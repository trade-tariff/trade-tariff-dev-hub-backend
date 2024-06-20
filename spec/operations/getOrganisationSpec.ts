import 'jasmine'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { GetOrganisation } from '../../src/operations/getOrganisation'

describe('GetOrganisation', () => {
  let dynamodbClient: jasmine.SpyObj<DynamoDBClient>

  it('returns a organisation', async () => {
    const dynamodbResult = {
      Item: {
        OrganisationId: { S: 'organisationId' },
        Description: { S: 'description' },
        Status: { S: 'Unregistered' },
        CreatedAt: { S: new Date().toISOString() },
        UpdatedAt: { S: new Date().toISOString() }
      },
      $metadata: {
        httpStatusCode: 200
      }
    }

    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve(dynamodbResult) })

    const organisation = await new GetOrganisation(dynamodbClient).call('organisationId')

    expect(organisation?.OrganisationId).toEqual('organisationId')
    expect(organisation?.OrganisationId).toEqual('organisationId')
    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
  })

  it('returns null if the organisation is not found', async () => {
    const dynamodbResult = {
      $metadata: {
        httpStatusCode: 404
      }
    }

    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve(dynamodbResult) })

    const organisation = await new GetOrganisation(dynamodbClient).call('organisationId')

    expect(organisation).toBeNull()
    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
  })
})
