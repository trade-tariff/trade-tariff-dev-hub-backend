import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type CustomerApiKey } from '../models/customerApiKey'
import { ListCustomerApiKeysService } from '../services/listCustomerApiKeysService'

export class CustomerApiKeyRepository {
  private readonly client: DynamoDBClient
  private readonly listService: ListCustomerApiKeysService

  constructor(client: DynamoDBClient, listService: ListCustomerApiKeysService = new ListCustomerApiKeysService(client)) {
    this.client = client
    this.listService = listService
  }

  async listCustomerApiKeys(customerId: string): Promise<CustomerApiKey[]> {
    console.log('listCustomerApiKeys')
    return await this.listService.call(customerId)
  }
}
