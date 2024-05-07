import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type User } from '../models/user'

import { CreateUser } from '../operations/createUser'
import { GetUser } from '../operations/getUser'
import { UpdateUser } from '../operations/updateUser'

export class UserRepository {
  constructor (
    private readonly dynamodbClient: DynamoDBClient,
    private readonly createOperation: CreateUser = new CreateUser(dynamodbClient),
    private readonly getOperation: GetUser = new GetUser(dynamodbClient),
    private readonly updateOperation: UpdateUser = new UpdateUser(dynamodbClient)
  ) {}

  async updateUser (user: User): Promise<User> {
    return await this.updateOperation.call(user)
  }

  async createUser (id: string): Promise<User> {
    return await this.createOperation.call(id)
  }

  async getUser (id: string): Promise<User | null> {
    return await this.getOperation.call(id)
  }
}
