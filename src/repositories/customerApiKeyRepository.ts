import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type CustomerApiKey } from '../models/customerApiKey'
import { ListCustomerApiKeysService } from '../services/listCustomerApiKeysService'
import { CreateCustomerApiKeyService } from '../services/createCustomerApiKeyService'

export class CustomerApiKeyRepository {
  constructor (
    private readonly client: DynamoDBClient,
    private readonly listService: ListCustomerApiKeysService = new ListCustomerApiKeysService(client),
    private readonly createService: CreateCustomerApiKeyService = new CreateCustomerApiKeyService(client)
  ) {}

  async listCustomerApiKeys (customerId: string): Promise<CustomerApiKey[]> {
    return await this.listService.call(customerId)
  }

  async createCustomerApiKey (customerId: string): Promise<CustomerApiKey> {
    return await this.createService.call(customerId)
  }
}
