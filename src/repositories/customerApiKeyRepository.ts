import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type CustomerApiKey } from '../models/customerApiKey'
import { ListCustomerApiKeysService } from '../services/listCustomerApiKeysService'

export class CustomerApiKeyRepository {
  private readonly client: DynamoDBClient
  private readonly listService: ListCustomerApiKeysService

  constructor(client: DynamoDBClient) {
    this.client = client
    this.listService = new ListCustomerApiKeysService(this.client)
  }

  async listCustomerApiKeys(customerId: string): Promise<CustomerApiKey[]> {
    return await this.listService.call(customerId)
  }
}
