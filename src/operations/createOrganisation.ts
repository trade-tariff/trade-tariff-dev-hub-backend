import { Organisation } from '../models/organisation'
import { PutCommand, type DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const TableName = process.env.ORGANISATIONS_TABLE_NAME ?? ''

class CreateOrganisation {
  constructor (
    private readonly dynamodbClient: DynamoDBDocumentClient
  ) {}

  async call (organisationId: string): Promise<Organisation> {
    const organisation = new Organisation()
    organisation.OrganisationId = organisationId
    organisation.Description = `Autogenerated ${organisation.Status} on ${new Date().toISOString()}`
    await this.createInDynamoDb(organisation)
    return organisation
  }

  private async createInDynamoDb (organisation: Organisation): Promise<void> {
    const command = new PutCommand({
      TableName,
      Item: organisation.toItem()
    })

    const response = await this.dynamodbClient.send(command)

    if (response.$metadata.httpStatusCode === 201) {
      organisation.Saved = true
    }
  }
}

export { CreateOrganisation }
