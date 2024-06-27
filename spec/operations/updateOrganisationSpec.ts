import 'jasmine'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { UpdateOrganisation } from '../../src/operations/updateOrganisation'

describe('CreateOrganisation', () => {
  let dynamodbClient: jasmine.SpyObj<DynamoDBClient>
  let updateOrganisation: UpdateOrganisation

  beforeEach(() => {
    const dynamodbResult = {
      $metadata: {
        httpStatusCode: 201
      }
    }

    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve(dynamodbResult) })

    updateOrganisation = new UpdateOrganisation(dynamodbClient)
  })

  it('updates existing organisation', async () => {
    await updateOrganisation.call('organisationId', 'reference', 'status')
    expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
  })
})
