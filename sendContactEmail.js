import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "ap-southeast-2" }); // Sydney region

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const {
      name,
      email,
      unitNumber,
      category,
      message,
      copyToEmail,
    } = body;

    if (!name || !email || !unitNumber || !category || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing required fields." }),
      };
    }

    const committeeEmail = "test123@gmail.com";

    const messageBody = `
New contact form submission:

Name: ${name}
Email: ${email}
Unit Number: ${unitNumber}
Category: ${category}
Message:
${message}
`;

    const emailParams = {
      Destination: {
        ToAddresses: ["stratacommittee@gmail.com"],
        ...(copyToEmail ? { CcAddresses: [email] } : {}),
      },
      Message: {
        Body: {
          Text: { Data: messageBody },
        },
        Subject: { Data: `Contact Form Submission: ${category}` },
      },
      Source: "stratacommittee@gmail.com", // Must be a verified SES sender
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
