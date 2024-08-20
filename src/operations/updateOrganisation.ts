import { UpdateItemCommand, type UpdateItemCommandInput, type DynamoDBClient } from '@aws-sdk/client-dynamodb'

const TableName = process.env.ORGANISATIONS_TABLE_NAME ?? ''

class UpdateOrganisation {
  private readonly client: DynamoDBClient

  constructor (client: DynamoDBClient) {
    this.client = client
  }

  async call (id: string, applicationReference: string, applicationStatus: string, organisationName: string, eoriNumber: string, ukacsReference: string): Promise<void> {
    const input: UpdateItemCommandInput = {
      TableName,
      Key: {
        OrganisationId: { S: id }
      },
      UpdateExpression: 'SET ApplicationReference = :applicationReference, #Status = :applicationStatus, OrganisationName = :organisationName, EoriNumber = :eoriNumber,  UkAcsReference = :ukacsReference, UpdatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':applicationReference': { S: applicationReference },
        ':applicationStatus': { S: applicationStatus },
        ':organisationName': { S: organisationName },
        ':eoriNumber': { S: eoriNumber },
        ':ukacsReference': { S: ukacsReference },
        ':updatedAt': { S: new Date().toISOString() }
      },
      ExpressionAttributeNames: {
        '#Status': 'Status'
      }
    }

    const command = new UpdateItemCommand(input)

    await this.client.send(command)
  }
}

export { UpdateOrganisation }
