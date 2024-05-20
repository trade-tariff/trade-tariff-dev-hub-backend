import 'jasmine'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { GetUser } from '../../src/operations/getUser'

describe('GetUser', () => {
  let dynamodbClient: jasmine.SpyObj<DynamoDBClient>

  it('returns a user', async () => {
    const dynamodbResult = {
      Item: {
        UserId: { S: 'userId' },
        OrganisationId: { S: 'organisationId' },
        CreatedAt: { S: new Date().toISOString() },
        UpdatedAt: { S: new Date().toISOString() }
      },
      $metadata: {
        httpStatusCode: 200
      }
    }

    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve(dynamodbResult) })

    const user = await new GetUser(dynamodbClient).call('userId')

    expect(user?.UserId).toEqual('userId')
    expect(user?.OrganisationId).toEqual('organisationId')
    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
  })

  it('returns null if the user is not found', async () => {
    const dynamodbResult = {
      $metadata: {
        httpStatusCode: 404
      }
    }

    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve(dynamodbResult) })

    const user = await new GetUser(dynamodbClient).call('userId')

    expect(user).toBeNull()
    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
  })
})
