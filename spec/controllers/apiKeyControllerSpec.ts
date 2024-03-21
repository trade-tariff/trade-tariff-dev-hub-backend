import express from 'express';
import request from 'supertest';
import { apiKeyController } from '../../src/controllers/apiKeyController';
import * as createCustomerApiKeyService from '../../src/services/createCustomerApiKeyService';

const app = express();
app.use(express.json());
app.post('/test-create-api-key', apiKeyController.createApiKey);

describe('POST /test-create-api-key', () => {
  let mockCreateApiKeyAndSave: jasmine.Spy;

  beforeEach(() => {
    mockCreateApiKeyAndSave = spyOn(createCustomerApiKeyService as any, 'createCustomerApiKeyAndSave').and.callFake(() =>
      Promise.resolve({ id: '123', value: 'abc' })
    );
  });

  afterEach(() => {
    mockCreateApiKeyAndSave.calls.reset();
  });

  it('should create an API key and return 201 status', async () => {
    const customerId = 'Test customerId';
    const name = 'Test name';
    const value = 'Test value';
    const description = 'Test API Key Description';

    const response = await request(app)
      .post('/test-create-api-key')
      .send({
        customerId: customerId,
        name: name,
        value: value,
        description: description,
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: '123', value: 'abc' });
    expect(mockCreateApiKeyAndSave).toHaveBeenCalledWith(customerId, name, value, description);
  });
});
