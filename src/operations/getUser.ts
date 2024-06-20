import { User } from '../models/user'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { GetItemCommand } from '@aws-sdk/client-dynamodb'

const TableName = process.env.USERS_TABLE_NAME ?? ''

class GetUser {
  private readonly client: DynamoDBClient

  constructor (client: DynamoDBClient) {
    this.client = client
  }

  async call (id: string): Promise<User | null> {
    const command = new GetItemCommand(
      {
        TableName,
        Key: {
          UserId: { S: id }
        }
      }
    )

    const response = await this.client.send(command)

    if (response.Item === null || response.Item === undefined) {
      return null
    }

    return User.fromNestedItem(response.Item)
  }
}

export { GetUser }
