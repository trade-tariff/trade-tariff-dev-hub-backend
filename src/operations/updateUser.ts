import { UpdateItemCommand, type UpdateItemCommandInput, type DynamoDBClient } from '@aws-sdk/client-dynamodb'

const TableName = process.env.USERS_TABLE_NAME ?? ''

class UpdateUser {
  private readonly client: DynamoDBClient

  constructor (client: DynamoDBClient) {
    this.client = client
  }

  async call (id: string, emailAddress: string): Promise<void> {
    const input: UpdateItemCommandInput = {
      TableName,
      Key: {
        UserId: { S: id }
      },
      UpdateExpression: 'SET EmailAddress = :emailAddress, UpdatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':emailAddress': { S: emailAddress },
        ':updatedAt': { S: new Date().toISOString() }
      }
    }
    const command = new UpdateItemCommand(input)

    await this.client.send(command)
  }
}

export { UpdateUser }
