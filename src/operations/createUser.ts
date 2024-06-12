import { User } from '../models/user'
import { PutCommand, type DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const TableName = process.env.USERS_TABLE_NAME ?? ''

class CreateUser {
  constructor (
    private readonly dynamodbClient: DynamoDBDocumentClient
  ) {}

  async call (userId: string, organisationId: string): Promise<User> {
    const user = new User()
    user.UserId = userId
    user.OrganisationId = organisationId
    user.Status = 'Unregistered'
    await this.createInDynamoDb(user)
    return user
  }

  private async createInDynamoDb (user: User): Promise<void> {
    const command = new PutCommand({
      TableName,
      Item: user.toItem()
    })

    const response = await this.dynamodbClient.send(command)

    if (response.$metadata.httpStatusCode === 201) {
      user.Saved = true
    }
  }
}

export { CreateUser }
