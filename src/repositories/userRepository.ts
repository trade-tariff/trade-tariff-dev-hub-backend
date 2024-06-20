import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type User } from '../models/user'

import { CreateUser } from '../operations/createUser'
import { GetUser } from '../operations/getUser'

export class UserRepository {
  constructor (
    private readonly dynamodbClient: DynamoDBClient,
    private readonly createOperation: CreateUser = new CreateUser(dynamodbClient),
    private readonly getOperation: GetUser = new GetUser(dynamodbClient),
  ) {}

  async createUser (id: string, organisationId: string): Promise<User> {
    return await this.createOperation.call(id, organisationId)
  }

  async getUser (id: string): Promise<User | null> {
    return await this.getOperation.call(id)
  }
}
