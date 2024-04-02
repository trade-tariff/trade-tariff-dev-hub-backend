import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type APIGatewayClient } from '@aws-sdk/client-api-gateway'
import { type CustomerApiKey } from '../models/customerApiKey'
import { ListCustomerApiKeys } from '../operations/listCustomerApiKeys'
import { CreateCustomerApiKey } from '../operations/createCustomerApiKey'
import { GetCustomerApiKey } from '../operations/getCustomerApiKey'
import { UpdateCustomerApiKey } from '../operations/updateCustomerApiKey'
import { DeleteCustomerApiKey } from '../operations/deleteCustomerApiKey'

export class CustomerApiKeyRepository {
  constructor (
    private readonly dynamodbClient: DynamoDBClient,
    private readonly apiGatewayClient: APIGatewayClient,
    private readonly listOperation: ListCustomerApiKeys = new ListCustomerApiKeys(dynamodbClient),
    private readonly createOperation: CreateCustomerApiKey = new CreateCustomerApiKey(dynamodbClient, apiGatewayClient),
    private readonly getOperation: GetCustomerApiKey = new GetCustomerApiKey(dynamodbClient),
    private readonly updateOperation: UpdateCustomerApiKey = new UpdateCustomerApiKey(dynamodbClient, apiGatewayClient),
    private readonly deleteOperation: DeleteCustomerApiKey = new DeleteCustomerApiKey(dynamodbClient, apiGatewayClient)
  ) {}

  async updateKey (customerApiKey: CustomerApiKey): Promise<CustomerApiKey> {
    return await this.updateOperation.call(customerApiKey)
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

  async deleteKey (customerApiKey: CustomerApiKey): Promise<void> {
    await this.deleteOperation.call(customerApiKey)
  }
}
