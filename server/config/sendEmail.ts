import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "connectify.web@gmail.com",
    pass: "connectify123",
  },
});

export default async function sendWelcomeEmail(email: string,name: string) {
  // Email content
  let mailOptions = {
    from: "connectify.web@gmail.com",
    to: email,
    subject: "Welcome to Connectify!",
    text: `Assalamu-Aleykum ${name} Welcome to Connectify! 🎉

We're thrilled to have you join our community. Connectify is your new go-to platform for staying connected with friends, family, and colleagues, all in one place. Whether you're here to chat, share, or discover new connections, we've got you covered.

Here is how to get started:

Complete Your Profile: Upload a profile picture and add a bio to let others know more about you.
Explore & Connect: Browse through your feed, find interesting people to connect with, and start building your network.
Stay Updated: Enable notifications to stay in the loop with what's happening in your circle.
Need Help?

We are here for you! If you have any questions or run into any issues, do not hesitate to reach out to our support team at connectify.web@gmail.com.

Thank you for joining Connectify. We are excited to see you connect, share, and grow with us!

Best regards,

The Connectify Team`,
  };

  try {
    // Send email
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
