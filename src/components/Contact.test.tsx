import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HashRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Contact from "./Contact";
import Catering from "./Catering";
import CateringPage from "@/pages/CateringPage";
import { CATERING_PACKAGES } from "@/lib/catering-inquiry";

const { toast } = vi.hoisted(() => ({ toast: vi.fn() }));
vi.mock("@emailjs/browser", () => ({ default: { send: vi.fn() } }));
vi.mock("@/components/ui/use-toast", () => ({ useToast: () => ({ toast }) }));

const routerFlags = { v7_startTransition: true, v7_relativeSplatPath: true };

beforeEach(() => {
  vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "");
  vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "");
  vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "");
});

function configure() {
  vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_test");
  vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template_test");
  vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "test-public-key");
}

function renderForm(entry = "/") {
  return render(<MemoryRouter initialEntries={[entry]} future={routerFlags}><Contact /></MemoryRouter>);
}

function fillRequired() {
  fireEvent.change(screen.getByLabelText("Your Name*"), { target: { value: "Test Guest" } });
  fireEvent.change(screen.getByLabelText("Email Address*"), { target: { value: "guest@example.com" } });
  fireEvent.change(screen.getByLabelText("Tell us about your event*"), { target: { value: "A birthday with 40 guests" } });
}

function submit() {
  fireEvent.submit(screen.getByRole("form", { name: "Catering inquiry" }));
}

describe("inquiry submission", () => {
  it("prepares a manual email without sending, clearing, logging, or claiming success", async () => {
    const log = vi.spyOn(console, "log");
    const error = vi.spyOn(console, "error");
    renderForm();
    fillRequired();
    fireEvent.click(screen.getByRole("button", { name: "Prepare Email Request" }));
    expect(screen.getByRole("status")).toHaveTextContent("Your request has not been sent");
    const link = screen.getByRole("link", { name: "Open email draft" });
    expect(new URL(link.getAttribute("href")!).searchParams.get("body")).toContain("A birthday with 40 guests");
    // A draft click must leave the same unsent state even if no mail app exists.
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);
    expect(screen.getByLabelText("Your Name*")).toHaveValue("Test Guest");
    expect(screen.queryByText(/accepted by our email service/)).not.toBeInTheDocument();
    expect(emailjs.send).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  it("rejects whitespace-only required fields", () => {
    configure();
    renderForm();
    fillRequired();
    fireEvent.change(screen.getByLabelText("Your Name*"), { target: { value: "   " } });
    submit();
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: "destructive" }));
    expect(emailjs.send).not.toHaveBeenCalled();
  });

  it("uses native required/email validation", () => {
    renderForm();
    expect(screen.getByRole("form")).toBeInvalid();
    fillRequired();
    fireEvent.change(screen.getByLabelText("Email Address*"), { target: { value: "invalid" } });
    expect(screen.getByRole("form")).toBeInvalid();
  });

  it("only clears and confirms after service acceptance, and blocks duplicate submits", async () => {
    configure();
    let accept!: (value: { status: number; text: string }) => void;
    vi.mocked(emailjs.send).mockReturnValue(new Promise(resolve => { accept = resolve; }));
    renderForm("/?package=Premium%20Event%20Package#contact");
    fillRequired();
    submit();
    submit();
    expect(emailjs.send).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText("Your Name*")).toHaveValue("Test Guest");
    expect(screen.getByRole("button", { name: "Sending Request..." })).toBeDisabled();
    expect(screen.queryByText(/accepted by our email service/)).not.toBeInTheDocument();
    await act(async () => accept({ status: 200, text: "OK" }));
    expect(screen.getByRole("status")).toHaveTextContent("accepted by our email service");
    expect(screen.getByLabelText("Your Name*")).toHaveValue("");
    expect(screen.getByLabelText("Tell us about your event*")).toHaveValue("");
    expect(screen.queryByLabelText("Selected catering package")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Event Type" })).toHaveTextContent("Select event type");
  });

  it.each(["network", "provider"])("keeps details and offers email after a %s error", async (kind) => {
    configure();
    vi.mocked(emailjs.send).mockRejectedValue(kind === "network" ? new TypeError("Network unavailable") : { status: 500, text: "Private provider details" });
    const log = vi.spyOn(console, "error");
    renderForm("/?package=Standard%20Event%20Package#contact");
    fillRequired();
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent("couldn't confirm");
    expect(screen.getByLabelText("Your Name*")).toHaveValue("Test Guest");
    expect(screen.getByLabelText("Selected catering package")).toHaveValue("Standard Event Package");
    expect(screen.getByRole("link", { name: "Open email draft" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Quote Request" })).toBeEnabled();
    expect(screen.queryByText(/accepted by our email service/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Private provider details/)).not.toBeInTheDocument();
    expect(log).not.toHaveBeenCalled();
  });

  it("retains details after a timeout and ignores late service acceptance", async () => {
    configure();
    vi.useFakeTimers();
    try {
      let accept!: (value: { status: number; text: string }) => void;
      vi.mocked(emailjs.send).mockReturnValue(new Promise(resolve => { accept = resolve; }));
      renderForm();
      fillRequired();
      submit();
      await act(async () => { await vi.advanceTimersByTimeAsync(20000); });
      expect(screen.getByRole("alert")).toHaveTextContent("couldn't confirm");
      expect(screen.getByLabelText("Your Name*")).toHaveValue("Test Guest");
      expect(screen.getByRole("button", { name: "Send Quote Request" })).toBeEnabled();
      await act(async () => accept({ status: 200, text: "OK" }));
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByLabelText("Your Name*")).toHaveValue("Test Guest");
      expect(screen.queryByText(/accepted by our email service/)).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("copies the full inquiry and keeps sending as an explicit manual step", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    renderForm();
    fillRequired();
    submit();
    fireEvent.click(screen.getByRole("button", { name: "Copy inquiry" }));
    expect(await screen.findByText(/Inquiry copied/)).toHaveTextContent("It has not been sent here");
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("guest@example.com"));
    expect(emailjs.send).not.toHaveBeenCalled();
  });

  it("provides selectable inquiry text when clipboard access fails", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) } });
    renderForm();
    fillRequired();
    submit();
    fireEvent.click(screen.getByRole("button", { name: "Copy inquiry" }));
    expect(await screen.findByText(/Copy was unavailable/)).toBeInTheDocument();
    expect((screen.getByLabelText("Full inquiry to copy") as HTMLTextAreaElement).value).toContain("A birthday with 40 guests");
  });
});

describe("package navigation", () => {
  it.each(CATERING_PACKAGES)("populates %s from the detailed catering page under HashRouter", async (name) => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/zars-tiki-catering/#/catering");
    const view = render(
      <HashRouter future={routerFlags}>
        <Routes>
          <Route path="/catering" element={<CateringPage />} />
          <Route path="/" element={<Contact />} />
        </Routes>
      </HashRouter>,
    );
    const links = screen.getAllByRole("link").filter(link => link.getAttribute("href")?.includes("?package="));
    expect(links).toHaveLength(4);
    await user.click(links[CATERING_PACKAGES.indexOf(name)]);
    expect(await screen.findByLabelText("Selected catering package")).toHaveValue(name);
    expect(screen.getByLabelText("Tell us about your event*")).toHaveValue(`I'm interested in the ${name}. Please provide more information.`);
    expect(screen.getByRole("combobox", { name: "Event Type" })).toHaveTextContent("Catering");
    expect(window.location.hash).toBe(`#/?package=${encodeURIComponent(name)}#contact`);
    view.unmount();
    window.history.replaceState(null, "", "/");
  });

  it("updates already-mounted forms from every home package link without erasing custom details", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter future={routerFlags}><Catering /><Contact /></MemoryRouter>);
    for (const name of CATERING_PACKAGES) {
      await user.click(screen.getByRole("link", { name: new RegExp(name.split(" ")[0] + " Events") }));
      expect(screen.getByLabelText("Selected catering package")).toHaveValue(name);
      expect(screen.getByLabelText("Tell us about your event*")).toHaveValue(`I'm interested in the ${name}. Please provide more information.`);
    }
    fillRequired();
    await user.click(screen.getByRole("link", { name: /Small Events/ }));
    expect(screen.getByLabelText("Tell us about your event*")).toHaveValue("A birthday with 40 guests");
    expect(screen.getByLabelText("Your Name*")).toHaveValue("Test Guest");
  });

  it("supports legacy links and ignores unknown packages", async () => {
    const view = renderForm("/#contact?package=Small%20Event%20Package");
    await waitFor(() => expect(screen.getByLabelText("Selected catering package")).toHaveValue("Small Event Package"));
    view.unmount();
    renderForm("/?package=Not%20a%20package#contact");
    expect(screen.queryByLabelText("Selected catering package")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Tell us about your event*")).toHaveValue("");
  });
});
