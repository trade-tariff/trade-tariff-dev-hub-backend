import 'jasmine'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { UpdateUser } from '../../src/operations/updateUser'

describe('CreateUser', () => {
  let dynamodbClient: jasmine.SpyObj<DynamoDBClient>
  let updateUser: UpdateUser

  beforeEach(() => {
    const dynamodbResult = {
      $metadata: {
        httpStatusCode: 201
      }
    }

    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve(dynamodbResult) })

    updateUser = new UpdateUser(dynamodbClient)
  })

  it('updates existing User', async () => {
    await updateUser.call('UserId', 'emailAddress')
    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
  })
})
