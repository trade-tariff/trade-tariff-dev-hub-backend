import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type Organisation } from '../models/organisation'

import { CreateOrganisation } from '../operations/createOrganisation'
import { GetOrganisation } from '../operations/getOrganisation'

export class OrganisationRepository {
  constructor (
    private readonly dynamodbClient: DynamoDBClient,
    private readonly createOperation: CreateOrganisation = new CreateOrganisation(dynamodbClient),
    private readonly getOperation: GetOrganisation = new GetOrganisation(dynamodbClient)
  ) {}

  async createOrganisation (id: string): Promise<Organisation> {
    return await this.createOperation.call(id)
  }

  async getOrganisation (id: string): Promise<Organisation | null> {
    return await this.getOperation.call(id)
  }
}
