import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type APIGatewayClient } from '@aws-sdk/client-api-gateway'
import { type CustomerApiKey } from '../models/customerApiKey'
import { ListCustomerApiKeysOperation } from '../operations/listCustomerApiKeysOperation'
import { CreateCustomerApiKeyOperation } from '../operations/createCustomerApiKeyOperation'
import { GetCustomerApiKeyOperation } from '../operations/getCustomerApiKeyOperation'
import { UpdateCustomerApiKeyOperation } from '../operations/updateCustomerApiKeyOperation'
import { get } from 'http'

export class CustomerApiKeyRepository {
  constructor (
    private readonly dynamodbClient: DynamoDBClient,
    private readonly apiGatewayClient: APIGatewayClient,
    private readonly listOperation: ListCustomerApiKeysOperation = new ListCustomerApiKeysOperation(dynamodbClient),
    private readonly createOperation: CreateCustomerApiKeyOperation = new CreateCustomerApiKeyOperation(dynamodbClient, apiGatewayClient),
    private readonly getOperation: GetCustomerApiKeyOperation = new GetCustomerApiKeyOperation(dynamodbClient),
    private readonly updateOperation: UpdateCustomerApiKeyOperation = new UpdateCustomerApiKeyOperation(dynamodbClient, apiGatewayClient)

  ) {}

  async updateKey (fpoId: string, customerApiKeyId: string, updates: object = {}): Promise<CustomerApiKey | null> {
    if (Object.keys(updates).length !== 0) {
      const customerApiKey = await this.getKey(fpoId, customerApiKeyId)

      if (customerApiKey === null) {
        return null
      }

      return await this.updateOperation.call(customerApiKey, updates)
    } else {
      return null
    }
  }

  async listKeys (fpoId: string): Promise<CustomerApiKey[]> {
    return await this.listOperation.call(fpoId)
  }

  async createKey (fpoId: string): Promise<CustomerApiKey> {
    return await this.createOperation.call(fpoId)
  }

  async getKey (fpoId: string, id: string): Promise<CustomerApiKey | null> {
    return await this.getOperation.call(fpoId, id)
  }
}
