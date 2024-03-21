import { APIGatewayClient, CreateApiKeyCommand, ApiKey } from '@aws-sdk/client-api-gateway';
import { apiKeyRepository } from '../../src/repositories/apiKeyRepository';
import { createCustomerApiKeyService } from '../../src/services/createCustomerApiKeyService';
import Spy = jasmine.Spy;

describe('CreateCustomerApiKeyService', () => {
  let mockSend: Spy;
  let mockStoreApiKey: Spy;

  beforeEach(() => {
    mockSend = spyOn(APIGatewayClient.prototype, 'send').and.callFake((command) => {
      if (command instanceof CreateApiKeyCommand) {
        return Promise.resolve({
          id: 'testApiKeyId',
          value: 'testApiKeyValue',
        });
      }
      throw new Error("Unexpected command type");
    });

    mockStoreApiKey = spyOn(apiKeyRepository, 'storeApiKey').and.resolveTo();
  });

  afterEach(() => {
    mockSend.calls.reset();
    mockStoreApiKey.calls.reset();
  });

  it('should create and store an API key successfully', async () => {
    const result = await createCustomerApiKeyService.call('testCustomerId', 'testName', 'testValue', 'testDescription');

    console.log('You are here___________________________');
    expect(mockSend).toHaveBeenCalledWith(jasmine.any(CreateApiKeyCommand));

    expect(mockStoreApiKey).toHaveBeenCalledWith(
      'testCustomerId',
      'testDescription',
      jasmine.objectContaining({ id: 'testApiKeyId', value: 'testApiKeyValue' })
    );

    expect(result).toEqual(jasmine.objectContaining({
      id: 'testApiKeyId',
      value: 'testApiKeyValue',
    }));
  });

  // it('should handle errors from the API Gateway client', async () => {
  //   mockSend.and.rejectWith(new Error('API Gateway error'));

  //   await expectAsync(createCustomerApiKeyService.call('testCustomerId', 'testName', 'testDescription'))
  //     .toBeRejectedWithError('API Gateway error');

  //   expect(mockStoreApiKey).not.toHaveBeenCalled();
  // });
});

