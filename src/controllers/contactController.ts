import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const EMAILJS_SERVICE_ID = "service_si0kadn";
const EMAILJS_TEMPLATE_ID = "template_f9js2nj";
const EMAILJS_PUBLIC_KEY = "A7dc_YVPNK6uLO4tz";

/**
 * @desc    Handle contact form submission
 * @route   POST /api/contact
 * @access  Public
 */
export const handleContactForm = asyncHandler(
  async (req: Request, res: Response) => {
    const { fullName, email, phone, subject, message } = req.body;

    // --- 1. Validate Input ---
    if (!fullName || !email || !subject || !message) {
      res.status(400);
      throw new Error(
        "Please provide all required fields: fullName, email, subject, and message."
      );
    }

    if (!isValidEmail(email)) {
      res.status(400);
      throw new Error("Please provide a valid email address.");
    }

    // --- 2. Send via EmailJS REST API ---
    const emailJsResponse = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            from_name: fullName,
            from_email: email,
            phone: phone || "Not provided",
            subject: subject,
            message: message,
            to_email: "aramidejkolawole@gmail.com",
          },
        }),
      }
    );

    if (!emailJsResponse.ok) {
      const errorText = await emailJsResponse.text();
      console.error("EmailJS error:", errorText);
      res.status(500);
      throw new Error("Failed to send email. Please try again later.");
    }

    // --- 3. Send Success Response ---
    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  }
);