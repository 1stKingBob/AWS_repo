import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "ap-southeast-2" }); // Sydney region

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing fields." }),
      };
    }

    const emailParams = {
      Destination: {
        ToAddresses: ["test123@gmail.com"], // Recipient
      },
      Message: {
        Body: {
          Text: {
            Data: `New message from ${name} (${email}):\n\n${message}`,
          },
        },
        Subject: {
          Data: "New Contact Form Submission",
        },
      },
      Source: "test123@gmail.com", // Must be verified in SES
    };

    await ses.send(new SendEmailCommand(emailParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Email sent successfully." }),
    };
  } catch (err) {
    console.error("Error sending email:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Internal Server Error" }),
    };
  }
};
