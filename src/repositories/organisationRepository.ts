import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type Organisation } from '../models/organisation'

import { CreateOrganisation } from '../operations/createOrganisation'
import { GetOrganisation } from '../operations/getOrganisation'
import { UpdateOrganisation } from '../operations/updateOrganisation'

export class OrganisationRepository {
  constructor (
    private readonly dynamodbClient: DynamoDBClient,
    private readonly createOperation: CreateOrganisation = new CreateOrganisation(dynamodbClient),
    private readonly getOperation: GetOrganisation = new GetOrganisation(dynamodbClient),
    private readonly updateOperation: UpdateOrganisation = new UpdateOrganisation(dynamodbClient)
  ) {}

  async createOrganisation (id: string): Promise<Organisation> {
    return await this.createOperation.call(id)
  }

  async getOrganisation (id: string): Promise<Organisation | null> {
    return await this.getOperation.call(id)
  }

  async updateOrganisation (id: string, reference: string, status: string, organisationName: string, eoriNumber: string, ukacsReference: string): Promise<void> {
    await this.updateOperation.call(id, reference, status, organisationName, eoriNumber, ukacsReference)
  }
}
