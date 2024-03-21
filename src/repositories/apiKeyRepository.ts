import { ApiKey } from '@aws-sdk/client-api-gateway';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from '@aws-sdk/util-dynamodb';

class ApiKeyRepository {
  private tableName: string = 'CustomerApiKeys';
  private dynamoDbClient: DynamoDBClient;

  constructor() {
    this.dynamoDbClient = new DynamoDBClient({
      region: process.env.AWS_REGION || 'eu-west-2'
    });
  }

  async storeApiKey(customerId: string, description: string, apiKey: ApiKey): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: marshall({
        customerId: customerId,
        customerApiKeyId: apiKey.id,
        description: description,
        enabled: true,
        apiKeyValue: apiKey.value,
        createdDate: apiKey.createdDate,
      }, {
        convertClassInstanceToMap: true
    }),
    };

    try {
      await this.dynamoDbClient.send(new PutItemCommand(params));
      // console.log('API key stored successfully');
    } catch (error) {
      // console.error('Error storing API key:', error);
      throw error;
    }
  }
}

export const apiKeyRepository = new ApiKeyRepository();
