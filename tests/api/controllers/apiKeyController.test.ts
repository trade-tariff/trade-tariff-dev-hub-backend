import express from 'express';
import request from 'supertest';
import { apiKeyController } from '../../../src/api/controllers/apiKeyController';
import { apiKeyService } from '../../../src/services/apiKeyService';

// Manual mock of apiKeyService
const mockCreateApiKeyAndSave = jasmine.createSpy('createApiKeyAndSave').and.callFake(() =>
    Promise.resolve({ id: '123', value: 'abc' })
);

// Mock module implementation
apiKeyService.createApiKeyAndSave = mockCreateApiKeyAndSave;

const app = express();
app.use(express.json());
app.post('/test-create-api-key', apiKeyController.createApiKey);

describe('POST /test-create-api-key', () => {
  it('should create an API key and return 201 status', async (done) => {
    request(app)
      .post('/test-create-api-key')
      .send({
        customerId: 'testCustomerId',
        name: 'testName',
        description: 'testDescription',
      })
      .end((err, response) => {
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: '123', value: 'abc' });
        expect(mockCreateApiKeyAndSave).toHaveBeenCalledWith('testCustomerId', 'testName', 'testDescription');
        done();
      });
  });
});
