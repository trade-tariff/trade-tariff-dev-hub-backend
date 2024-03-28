import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type APIGatewayClient } from '@aws-sdk/client-api-gateway'
import { type CustomerApiKey } from '../models/customerApiKey'
import { ListCustomerApiKeysService } from '../services/listCustomerApiKeysService'
import { CreateCustomerApiKeyService } from '../services/createCustomerApiKeyService'
import { GetCustomerApiKeyService } from '../services/getCustomerApiKeyService'
import { UpdateCustomerApiKeyService } from '../services/updateCustomerApiKeyService'
import { get } from 'http'

export class CustomerApiKeyRepository {
  constructor (
    private readonly dynamodbClient: DynamoDBClient,
    private readonly apiGatewayClient: APIGatewayClient,
    private readonly listService: ListCustomerApiKeysService = new ListCustomerApiKeysService(dynamodbClient),
    private readonly createService: CreateCustomerApiKeyService = new CreateCustomerApiKeyService(dynamodbClient, apiGatewayClient),
    private readonly getService: GetCustomerApiKeyService = new GetCustomerApiKeyService(dynamodbClient),
    private readonly updateService: UpdateCustomerApiKeyService = new UpdateCustomerApiKeyService(dynamodbClient, apiGatewayClient)

  ) {}

  async updateKey (fpoId: string, customerApiKeyId: string, updates: object = {}): Promise<CustomerApiKey | null> {
    if (Object.keys(updates).length !== 0) {
      const customerApiKey = await this.getKey(fpoId, customerApiKeyId)

      if (customerApiKey === null) {
        return null
      }

      return await this.updateService.call(customerApiKey, updates)
    } else {
      return null
    }
  }

  async listKeys (fpoId: string): Promise<CustomerApiKey[]> {
    return await this.listService.call(fpoId)
  }

  async createKey (fpoId: string): Promise<CustomerApiKey> {
    return await this.createService.call(fpoId)
  }

  async getKey (fpoId: string, id: string): Promise<CustomerApiKey | null> {
    return await this.getService.call(fpoId, id)
  }
}
