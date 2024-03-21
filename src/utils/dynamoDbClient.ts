import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "eu-west-2",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
    sessionToken: "test",
  },
});

const dynamoDbDocClient = DynamoDBDocumentClient.from(client);

export default dynamoDbDocClient;
