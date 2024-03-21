import { apiKeyRepository } from '../../src/repositories/ApiKeyRepository';
import dynamoDb from '../../src/utils/dynamoDbClient';

describe('ApiKeyRepository', () => {
  beforeEach(() => {
      spyOn(dynamoDb, 'put').and.returnValue({
        promise: () => Promise.resolve({
          $response: {
            httpResponse: {
              statusCode: 200,
            },
            data: {},
          }
        })
      } as any);
    });

  it('should store an API key successfully', async () => {
    const apiKey = {
      id: 'apiKeyId',
      value: 'apiKeyValue',
      createdDate: new Date('2023-01-01'),
    };

    await apiKeyRepository.storeApiKey('customerId', apiKey);

    expect(dynamoDb.put).toHaveBeenCalled();
  });

  it('should throw an error if storing the API key fails', async () => {
    (dynamoDb.put as any).and.returnValue({
      promise: () => Promise.reject(new Error('DynamoDB error'))
    });

    const apiKey = {
      id: 'apiKeyId',
      value: 'apiKeyValue',
      createdDate: new Date('2023-01-01'),
    };

    await expectAsync(apiKeyRepository.storeApiKey('customerId', apiKey)).toBeRejectedWith(new Error('DynamoDB error'));
    expect(dynamoDb.put).toHaveBeenCalled();
  });
});
