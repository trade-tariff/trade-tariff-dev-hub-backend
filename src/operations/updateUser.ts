import { type User } from '../models/user'
import { UpdateItemCommand, type UpdateItemCommandInput, type DynamoDBClient } from '@aws-sdk/client-dynamodb'

const TableName = process.env.USERS_TABLE_NAME ?? ''

class UpdateUser {
  constructor (
    private readonly dynamodbClient: DynamoDBClient
  ) {}

  async call (user: User): Promise<User> {
    await this.updateDynamoDb(user)

    return user
  }

  private async updateDynamoDb (user: User): Promise<void> {
    const input: UpdateItemCommandInput = {
      TableName,
      Key: {
        UserId: { S: user.UserId }
      },
      UpdateExpression: 'SET OrganisationId = :organisationId, UpdatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':organisationId': { S: user.OrganisationId },
        ':updatedAt': { S: new Date().toISOString() }
      }
    }

    const command = new UpdateItemCommand(input)

    await this.dynamodbClient.send(command)
  }
}

export { UpdateUser }
