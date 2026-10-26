import emailjs from "@emailjs/browser";

// Existing public contact address. Confirm mailbox ownership before deployment.
export const CATERING_EMAIL = "aloha@zarstikishack.com";

export const CATERING_PACKAGES = [
  "Small Event Package",
  "Standard Event Package",
  "Premium Event Package",
  "Custom Event Package",
] as const;

export const createPackageLink = (name: string) =>
  `/?package=${encodeURIComponent(name)}#contact`;

export function selectedPackage(search: string, hash: string): string {
  // Keep previously shared /#contact?package=... links working, too.
  const legacySearch = hash.startsWith("#contact?") ? hash.slice(8) : "";
  const name = new URLSearchParams(search).get("package") ??
    new URLSearchParams(legacySearch).get("package");
  return CATERING_PACKAGES.find((value) => value === name) ?? "";
}

export const packageMessage = (name: string) =>
  `I'm interested in the ${name}. Please provide more information.`;

export const emptyInquiry = {
  name: "", email: "", phone: "", eventDate: "", eventType: "",
  guestCount: "", location: "", message: "", packageName: "",
};

export type Inquiry = typeof emptyInquiry;

export function getEmailConfig() {
  const values = [
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  ].map((value) => value?.trim() ?? "");

  if (values.some((value) => !value || /xxxx|your[_ -]|placeholder|replace[_ -]/i.test(value))) {
    return null;
  }
  const [serviceId, templateId, publicKey] = values;
  return { serviceId, templateId, publicKey };
}

export function inquiryText(data: Inquiry) {
  return [
    "Catering quote request",
    `Name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone}`,
    `Package: ${data.packageName}`, `Event date: ${data.eventDate}`,
    `Event type: ${data.eventType}`, `Guest count: ${data.guestCount}`,
    `Location: ${data.location}`, "", data.message,
  ].join("\r\n");
}

export function inquiryMailto(data: Inquiry) {
  return `mailto:${CATERING_EMAIL}?subject=${encodeURIComponent("Catering quote request")}&body=${encodeURIComponent(inquiryText(data))}`;
}

export async function sendInquiry(data: Inquiry, config: NonNullable<ReturnType<typeof getEmailConfig>>) {
  let timeout: ReturnType<typeof setTimeout>;
  try {
    // A timeout is an unknown outcome, not proof that delivery failed. The UI
    // retains the inquiry and never treats a late response as a new success.
    const response = await Promise.race([
      emailjs.send(config.serviceId, config.templateId, {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        event_date: data.eventDate,
        event_type: data.eventType,
        guest_count: data.guestCount,
        location: data.location,
        package_name: data.packageName,
        // Preserve package information even in templates using only message.
        message: data.packageName ? `Package: ${data.packageName}\n\n${data.message}` : data.message,
      }, { publicKey: config.publicKey }),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error("Delivery unconfirmed")), 20000);
      }),
    ]);
    if (response.status < 200 || response.status >= 300) {
      throw new Error("Delivery unconfirmed");
    }
  } finally {
    clearTimeout(timeout);
  }
}
