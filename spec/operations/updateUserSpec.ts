import 'jasmine'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { UpdateUser } from '../../src/operations/updateUser'
import { User } from '../../src/models/user'

describe('UpdateUser', () => {
  let dynamodbClient: jasmine.SpyObj<DynamoDBClient>
  let createUser: UpdateUser

  beforeEach(() => {
    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve() })

    createUser = new UpdateUser(dynamodbClient)
  })

  it('updates a user', async () => {
    const user = new User()
    user.UserId = 'id'
    user.FpoId = 'fpoId'

    const updated = await createUser.call(user)

    expect(updated.UserId).toEqual('id')
    expect(updated.FpoId).toEqual('fpoId')
    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)

    expect(dynamodbClient.send.calls.first().args[0].input).toEqual(jasmine.objectContaining({
      TableName: 'Users',
      Key: {
        UserId: { S: 'id' }
      },
      UpdateExpression: 'SET FpoId = :fpoId, UpdatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':fpoId': { S: 'fpoId' },
        ':updatedAt': { S: jasmine.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/) }
      }
    }))
  })
})
