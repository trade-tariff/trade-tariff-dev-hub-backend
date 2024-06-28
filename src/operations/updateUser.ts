import { UpdateItemCommand, type UpdateItemCommandInput, type DynamoDBClient } from '@aws-sdk/client-dynamodb'

const TableName = process.env.USERS_TABLE_NAME ?? ''

class UpdateUser {
  private readonly client: DynamoDBClient

  constructor (client: DynamoDBClient) {
    this.client = client
  }

  async call (id: string, organisationName: string, eoriNumber: string, ukacsReference: string, emailAddress: string): Promise<void> {
    const input: UpdateItemCommandInput = {
      TableName,
      Key: {
        UserId: { S: id }
      },
      UpdateExpression: 'SET organisationName = :organisationName, #Status = :eoriNumber',
      ExpressionAttributeValues: {
        ':organisationName': { S: organisationName },
        ':eoriNumber': { S: eoriNumber },
        ':ukacsReference': { S: ukacsReference },
        ':emailAddress': { S: emailAddress }
      }
    }

    const command = new UpdateItemCommand(input)

    await this.client.send(command)
  }
}

export { UpdateUser }
