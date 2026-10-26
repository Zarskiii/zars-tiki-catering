import { describe, expect, it, vi } from "vitest";
import emailjs from "@emailjs/browser";
import {
  CATERING_PACKAGES, createPackageLink, selectedPackage, getEmailConfig,
  emptyInquiry, inquiryMailto, inquiryText, sendInquiry,
} from "./catering-inquiry";

vi.mock("@emailjs/browser", () => ({ default: { send: vi.fn() } }));

const config = { serviceId: "service_test", templateId: "template_test", publicKey: "test-public-key" };
const inquiry = {
  ...emptyInquiry, name: "Guest & Co", email: "guest+party@example.com", phone: "8015550100",
  eventDate: "2027-02-10", eventType: "Wedding", guestCount: "50-100", location: "Eagle Mountain, UT",
  packageName: "Standard Event Package", message: "Ice & toppings?\nMango + coconut #1 🍧",
};

function configure() {
  vi.stubEnv("VITE_EMAILJS_SERVICE_ID", config.serviceId);
  vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", config.templateId);
  vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", config.publicKey);
}

describe("delivery configuration", () => {
  it("uses all three build-time values", () => {
    configure();
    expect(getEmailConfig()).toEqual(config);
  });

  it.each(["VITE_EMAILJS_SERVICE_ID", "VITE_EMAILJS_TEMPLATE_ID", "VITE_EMAILJS_PUBLIC_KEY"])(
    "requires a usable %s", (key) => {
      configure();
      for (const invalid of [undefined, "", "  ", "xxxx", "service_xxxx", "template_xxxx", "YOUR_PUBLIC_KEY", "replace-me"]) {
        vi.stubEnv(key, invalid);
        expect(getEmailConfig()).toBeNull();
      }
    },
  );
});

describe("package URLs", () => {
  it.each(CATERING_PACKAGES)("round-trips %s through the router query", (name) => {
    const url = new URL(createPackageLink(name), "https://example.com");
    expect(url.hash).toBe("#contact");
    expect(selectedPackage(url.search, url.hash)).toBe(name);
  });

  it("supports old shared links and ignores unknown packages", () => {
    expect(selectedPackage("", "#contact?package=Small%20Event%20Package")).toBe("Small Event Package");
    expect(selectedPackage("?package=not-a-package", "")).toBe("");
    expect(selectedPackage("?package=%ZZ", "")).toBe("");
  });
});

describe("manual email", () => {
  it("encodes every inquiry field without adding recipient or header parameters", () => {
    const url = new URL(inquiryMailto(inquiry));
    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe("aloha@zarstikishack.com");
    expect([...url.searchParams.keys()]).toEqual(["subject", "body"]);
    const body = url.searchParams.get("body");
    expect(body).toBe(inquiryText(inquiry));
    for (const value of Object.values(inquiry)) expect(body).toContain(value);
  });
});

describe("EmailJS delivery", () => {
  it("passes the inquiry to the configured service and template", async () => {
    vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: "OK" });
    await sendInquiry(inquiry, config);
    expect(emailjs.send).toHaveBeenCalledWith(config.serviceId, config.templateId, {
      from_name: inquiry.name, from_email: inquiry.email, phone: inquiry.phone,
      event_date: inquiry.eventDate, event_type: inquiry.eventType, guest_count: inquiry.guestCount,
      location: inquiry.location, package_name: inquiry.packageName,
      message: `Package: ${inquiry.packageName}\n\n${inquiry.message}`,
    }, { publicKey: config.publicKey });
  });

  it("does not accept non-success responses", async () => {
    vi.mocked(emailjs.send).mockResolvedValue({ status: 500, text: "Unavailable" });
    await expect(sendInquiry(inquiry, config)).rejects.toThrow("Delivery unconfirmed");
  });

  it("times out a stalled request without reporting success", async () => {
    vi.useFakeTimers();
    try {
      vi.mocked(emailjs.send).mockReturnValue(new Promise(() => {}));
      const result = expect(sendInquiry(inquiry, config)).rejects.toThrow("Delivery unconfirmed");
      await vi.advanceTimersByTimeAsync(20000);
      await result;
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
