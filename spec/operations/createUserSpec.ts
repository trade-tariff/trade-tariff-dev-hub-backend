import 'jasmine'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { CreateUser } from '../../src/operations/createUser'

describe('CreateUser', () => {
  let dynamodbClient: jasmine.SpyObj<DynamoDBClient>
  let createUser: CreateUser

  beforeEach(() => {
    const dynamodbResult = {
      $metadata: {
        httpStatusCode: 201
      }
    }

    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve(dynamodbResult) })

    createUser = new CreateUser(dynamodbClient)
  })

  it('creates a new user', async () => {
    const created = await createUser.call('userId', 'groupId')

    expect(created.UserId).toEqual('userId')
    expect(created.OrganisationId).toEqual('groupId')
    expect(created.Saved).toEqual(true)

    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
  })
})
