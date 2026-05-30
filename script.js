(function () {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const yearEl = document.getElementById("year");

  const SERVICE_LABELS = {
    iot: "IoT Device Development",
    report: "Project Report Writing",
    web: "Website Development",
    full: "Full Project Package",
  };

  const PLACEHOLDER_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open menu");
  }

  navToggle?.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 20) {
        header?.classList.add("scrolled");
      } else {
        header?.classList.remove("scrolled");
      }
    },
    { passive: true }
  );

  function setFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = "form-note" + (type ? ` ${type}` : "");
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "Sending…" : "Send Message";
  }

  function getAccessKey() {
    const key = window.FORM_CONFIG?.accessKey?.trim();
    if (!key || key === PLACEHOLDER_KEY) return null;
    return key;
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const accessKey = getAccessKey();
    if (!accessKey) {
      setFormStatus(
        "Email is not configured yet. Copy config.example.js to config.js and add your Web3Forms access key.",
        "error"
      );
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name = data.get("name")?.toString().trim() ?? "";
    const email = data.get("email")?.toString().trim() ?? "";
    const university = data.get("university")?.toString().trim() ?? "";
    const service = data.get("service")?.toString() ?? "";
    const message = data.get("message")?.toString().trim() ?? "";
    const serviceLabel = SERVICE_LABELS[service] ?? service;

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `University & Department: ${university}`,
      `Service: ${serviceLabel}`,
      "",
      "Project details:",
      message,
    ].join("\n");

    setSubmitting(true);
    setFormStatus("Sending your message…", "");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Build It Lab inquiry — ${serviceLabel}`,
          from_name: name,
          name,
          email,
          replyto: email,
          university,
          service: serviceLabel,
          message: body,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send message. Please try again.");
      }

      setFormStatus(
        "Thank you! Your message was sent. We will get back to you within 24 hours.",
        "success"
      );
      form.reset();
    } catch (err) {
      setFormStatus(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or message us on WhatsApp.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  });
})();
