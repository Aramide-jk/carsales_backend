// import nodemailer from "nodemailer";

// // 1. Create the transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail", // using Gmail
//   auth: {
//     user: process.env.EMAIL_USER, // your Gmail address
//     pass: process.env.EMAIL_PASS, // your App Password (not Gmail password!)
//   },
// });

// 2. Function to send mail

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM as string,
      to: "jkautos97@gmail.com",
      subject,
      text,
      html,
    });

    if (error) throw error;

    console.log("Email sent successfully:", data?.id);
    return data;
  } catch (error) {
    console.error(" Error sending email:", error);
    throw error;
  }
};

// export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"JK Autos" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log("Email sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// };
