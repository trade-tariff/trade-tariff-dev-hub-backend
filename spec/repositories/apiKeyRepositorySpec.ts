import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { apiKeyRepository } from '../../src/repositories/apiKeyRepository';
import dynamoDb from '../../src/utils/dynamoDbClient';
import { ApiKey } from '@aws-sdk/client-api-gateway';

describe('ApiKeyRepository', () => {
  beforeEach(() => {
    spyOn(DynamoDBClient.prototype, 'send').and.callFake((command) => {
      if (command instanceof PutItemCommand) {
        return Promise.resolve({
        });
      }
      throw new Error("Unexpected command type");
    });
  });

  it('should store an API key successfully', async () => {
    const customerId = 'customerId';
    const description = 'Test API Key Description';
    const apiKey = {
      id: 'apiKeyId',
      value: 'apiKeyValue',
      createdDate: new Date('2023-01-01'),
    } as ApiKey;

    await apiKeyRepository.storeApiKey(customerId, description, apiKey);

    expect(DynamoDBClient.prototype.send).toHaveBeenCalled();

  });

  it('should throw an error if storing the API key fails', async () => {
      const apiKey = {
        id: 'apiKeyId',
        value: 'apiKeyValue',
        createdDate: new Date('2023-01-01'),
      } as ApiKey;

      await expectAsync(apiKeyRepository.storeApiKey('customerId', 'Test API Key Description', apiKey)).toBeRejectedWith(new Error('DynamoDB error'));
      expect(DynamoDBClient.prototype.send).toHaveBeenCalled();
  });
});
