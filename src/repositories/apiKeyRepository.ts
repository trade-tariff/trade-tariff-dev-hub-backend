import dynamoDb from '../utils/dynamoDbClient';

class ApiKeyRepository {
  private tableName: string = 'CustomerApiKeys';

  constructor() {}

  async storeApiKey(customerId: string, apiKey: AWS.APIGateway.ApiKey): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        customerId,
        apiKeyId: apiKey.id,
        apiKeyValue: apiKey.value,
        createdDate: apiKey.createdDate,
      },
    };

    try {
      await dynamoDb.put(params).promise();

      // Can remove this later
      // console.log('API key stored successfully');
    } catch (error) {
      // console.error('Error storing API key:', error);
      throw error;
    }
  }
}

export const apiKeyRepository = new ApiKeyRepository();
