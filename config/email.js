import dotenv from "dotenv";
dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.EMAIL_USER || "aranya25626@gmail.com";
const FROM_NAME = "Aranya Store";

const sendEmail = async (to, subject, htmlContent, textContent) => {
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": BREVO_API_KEY,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                sender: { name: FROM_NAME, email: FROM_EMAIL },
                to: [{ email: to }],
                subject,
                htmlContent,
                textContent,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }

        console.log(`Email sent to ${to}`);
        return true;
    } catch (error) {
        console.error(`❌ Email failed: ${error.message}`);
        return false;
    }
};

export const sendOrderConfirmationEmail = async (userEmail, userName, orderId, products) => {
    const productList = products.map((p) => `<li>${p.name} — ₹${p.price}</li>`).join("");
    await sendEmail(
        userEmail,
        "✅ Order Confirmed — Aranya",
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px">
      <h2 style="color:#1D9E75">Thank you, ${userName}! 🌿</h2>
      <p>Your order has been placed successfully.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <h3>Products:</h3><ul>${productList}</ul>
      <p style="color:#666">We'll notify you when your order ships.</p>
      <hr/><p style="color:#999;font-size:12px">Aranya — Weave Your Tale 🌱</p>
    </div>`,
        `Thank you ${userName}! Order ${orderId} confirmed.`
    );
};

export const sendOrderStatusEmail = async (userEmail, userName, orderId, status) => {
    await sendEmail(
        userEmail,
        `📦 Order Update — ${status}`,
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px">
      <h2 style="color:#1D9E75">Order Status Update 🌿</h2>
      <p>Hi ${userName}, your order status: <strong>${status}</strong></p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <hr/><p style="color:#999;font-size:12px">Aranya — Weave Your Tale 🌱</p>
    </div>`,
        `Hi ${userName}, your order ${orderId} status: ${status}`
    );
};

export const sendDeliveredEmail = async (userEmail, userName, orderId) => {
    await sendEmail(
        userEmail,
        "🎉 Order Delivered — Aranya",
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px">
      <h2 style="color:#1D9E75">Delivered! 🌿</h2>
      <p>Hi ${userName}, your order has been delivered!</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <hr/><p style="color:#999;font-size:12px">Aranya — Weave Your Tale 🌱</p>
    </div>`,
        `Hi ${userName}, order ${orderId} delivered!`
    );
};

export const sendOTPEmail = async (userEmail, userName, otp) => {
    await sendEmail(
        userEmail,
        "🔐 Verify your Aranya account",
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px">
      <h2 style="color:#1D9E75">Verify Your Email 🌿</h2>
      <p>Hi ${userName}, use this OTP (valid 30 min):</p>
      <div style="background:#F0FDF4;padding:20px;text-align:center;border-radius:10px;margin:20px 0">
        <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1B4332">${otp}</span>
      </div>
      <hr/><p style="color:#999;font-size:12px">Aranya — Weave Your Tale 🌱</p>
    </div>`,
        `Your OTP: ${otp} (valid 30 minutes)`
    );
};