import 'jasmine'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { CreateOrganisation } from '../../src/operations/createOrganisation'

describe('CreateOrganisation', () => {
  let dynamodbClient: jasmine.SpyObj<DynamoDBClient>
  let createOrganisation: CreateOrganisation

  beforeEach(() => {
    const dynamodbResult = {
      $metadata: {
        httpStatusCode: 201
      }
    }

    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve(dynamodbResult) })

    createOrganisation = new CreateOrganisation(dynamodbClient)
  })

  it('creates a new organisation', async () => {
    const created = await createOrganisation.call('organisationId')

    expect(created.OrganisationId).toEqual('organisationId')
    expect(created.Status).toEqual('Unregistered')
    expect(created.Saved).toEqual(true)

    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
  })
})
