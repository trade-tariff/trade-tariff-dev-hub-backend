import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type APIGatewayClient } from '@aws-sdk/client-api-gateway'
import { type CustomerApiKey } from '../models/customerApiKey'
import { ListCustomerApiKeysService } from '../services/listCustomerApiKeysService'
import { CreateCustomerApiKeyService } from '../services/createCustomerApiKeyService'
import { GetCustomerApiKeyService } from '../services/getCustomerApiKeyService'

export class CustomerApiKeyRepository {
  constructor (
    private readonly dynamodbClient: DynamoDBClient,
    private readonly apiGatewayClient: APIGatewayClient,
    private readonly listService: ListCustomerApiKeysService = new ListCustomerApiKeysService(dynamodbClient),
    private readonly createService: CreateCustomerApiKeyService = new CreateCustomerApiKeyService(dynamodbClient, apiGatewayClient),
    private readonly getService: GetCustomerApiKeyService = new GetCustomerApiKeyService(dynamodbClient)
    // private readonly updateService: UpdateCustomerApiKeyService = new UpdateCustomerApiKeyService(dynamodbClient, apiGatewayClient)

  ) {}

  // async updateKey (fpoId: string, id: string, updates: object): Promise<CustomerApiKey | null> {
  //   if (Object.keys(updates).length === 0) {
  //     return null
  //   } else if (this.getKey(fpoId, id) === null) {
  //     return null
  //   } else {
  //     return await this.updateService.call(fpoId, id, updates)
  //   }
  // }

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
