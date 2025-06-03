import { RDSClient, ExecuteStatementCommand } from "@aws-sdk/client-rds-data";

const client = new RDSClient({ region: "ap-southeast-2" });

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { title, date, description } = body;

    if (!title || !date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Title and date are required." }),
      };
    }

    const sql = `
      INSERT INTO meetings (title, meeting_date, description)
      VALUES (:title, :date, :description)
    `;

    const command = new ExecuteStatementCommand({
      resourceArn: process.env.DB_CLUSTER_ARN!,
      secretArn: process.env.DB_SECRET_ARN!,
      database: process.env.DB_NAME!,
      sql,
      parameters: [
        { name: "title", value: { stringValue: title } },
        { name: "date", value: { stringValue: date } },
        { name: "description", value: { stringValue: description || "" } },
      ],
    });

    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Meeting scheduled successfully." }),
    };
  } catch (err) {
    console.error("Error inserting meeting:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
