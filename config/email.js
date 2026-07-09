import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create transporter
// const transporter = nodemailer.createTransport({
// service: "gmail",
// auth: {
// user: process.env.EMAIL_USER,
// pass: process.env.EMAIL_PASS,
// },
// });

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP Error:", error);
    } else {
        console.log("✅ SMTP Server Ready");
    }
});

// Send order confirmation email
export const sendOrderConfirmationEmail = async (userEmail, userName, orderId, products) => {
    try {
        const productList = products
            .map((p) => `<li>${p.name} — ₹${p.price}</li>`)
            .join("");

        await transporter.sendMail({
            from: `"Aranya Store" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "✅ Order Confirmed — Aranya",
            text: `Thank you for your order! Your order has been placed successfully. We'll notify you once it ships.`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1D9E75;">Thank you for your order, ${userName}! 🌿</h2>
          <p>Your order has been placed successfully.</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <h3>Products Ordered:</h3>
          <ul>${productList}</ul>
          <p style="color: #666;">We will notify you when your order is shipped.</p>
          <hr/>
          <p style="color: #999; font-size: 12px;">Aranya — Weave Your Tale 🌱</p>
        </div>
      `,
        });

        console.log(`Order confirmation email sent to ${userEmail}`);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

// Send order status update email
export const sendOrderStatusEmail = async (userEmail, userName, orderId, status) => {
    try {
        const statusEmoji = {
            "Processing": "⚙️",
            "Shipped": "🚚",
            "delivered": "✅",
            "cancel": "❌",
            "Not Process": "⏳",
        };

        await transporter.sendMail({
            from: `"Aranya Store" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `${statusEmoji[status] || "📦"} Order Update — ${status}`,
            text: `Your order status has been updated to: ${status}. Thank you for shopping with Aranya.`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1D9E75;">Order Status Update 🌿</h2>
          <p>Hi ${userName},</p>
          <p>Your order status has been updated.</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>New Status:</strong> 
            <span style="color: #1D9E75; font-weight: bold;">
              ${statusEmoji[status] || "📦"} ${status}
            </span>
          </p>
          <p style="color: #666;">Thank you for shopping with Aranya!</p>
          <hr/>
          <p style="color: #999; font-size: 12px;">Aranya — Weave Your Tale 🌱</p>
        </div>
      `,
        });

        console.log(`Status update email sent to ${userEmail}`);
    } catch (error) {
        console.error("Status email failed:", error);
    }
};

export const sendDeliveredEmail = async (userEmail, userName, orderId) => {
    try {
        await transporter.sendMail({
            from: `"Aranya Store" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "🎉 Your order has been delivered!",
            text: `Great news — your order has been delivered successfully! Thank you for choosing Aranya.`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1D9E75;">Delivered! 🌿</h2>
          <p>Hi ${userName},</p>
          <p>Great news — your order has been delivered successfully!</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p style="color: #666;">We hope you love your eco-friendly products. Thank you for choosing Aranya!</p>
          <hr/>
          <p style="color: #999; font-size: 12px;">Aranya — Weave Your Tale 🌱</p>
        </div>
      `,
        });
        console.log(`Delivered email sent to ${userEmail}`);
    } catch (error) {
        console.error("Delivered email failed:", error);
    }
};

export const sendOTPEmail = async (userEmail, userName, otp) => {
    try {
        await transporter.sendMail({
            from: `"Aranya Store" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "🔐 Verify your Aranya account",
            text: `Use this OTP to verify your Aranya account. This code is valid for 10 minutes.`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1D9E75;">Verify Your Email 🌿</h2>
          <p>Hi ${userName},</p>
          <p>Use the OTP below to verify your Aranya account. This code is valid for 10 minutes.</p>
          <div style="background: #F0FDF4; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1B4332;">${otp}</span>
          </div>
          <p style="color: #666;">If you didn't request this, please ignore this email.</p>
          <hr/>
          <p style="color: #999; font-size: 12px;">Aranya — Weave Your Tale 🌱</p>
        </div>
      `,
        });
        console.log(`OTP email sent to ${userEmail}`);
    } catch (error) {
        console.error("OTP email failed:", error);
    }
};