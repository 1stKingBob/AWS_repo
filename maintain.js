import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "ap-southeast-2" }); // Sydney

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const {
      issueSubject,
      issueType,
      issueLocation,
      issueDescription
    } = body;

    if (!issueSubject || !issueType || !issueLocation || !issueDescription) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing required fields." }),
      };
    }

    const emailBody = `
New Maintenance Request Submitted:

Subject: ${issueSubject}
Type: ${issueType}
Location: ${issueLocation}
Description: ${issueDescription}
`;

    const emailParams = {
      Destination: {
        ToAddresses: ["test123@gmail.com"], // Replace with real recipient
      },
      Message: {
        Body: {
          Text: { Data: emailBody },
        },
        Subject: {
          Data: `Maintenance Request: ${issueSubject}`,
        },
      },
      Source: "test123@gmail.com", // Must be SES verified
    };

    await ses.send(new SendEmailCommand(emailParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Request submitted successfully." }),
    };
  } catch (err) {
    console.error("Error sending maintenance request:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Internal server error." }),
    };
  }
};
