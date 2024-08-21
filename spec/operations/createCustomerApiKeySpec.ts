import 'jasmine'
import { type DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  CreateApiKeyCommand,
  CreateUsagePlanKeyCommand,
  GetUsagePlansCommand,
  CreateUsagePlanCommand,
  type APIGatewayClient
} from '@aws-sdk/client-api-gateway'
import { CreateCustomerApiKey } from '../../src/operations/createCustomerApiKey'

describe('CreateCustomerApiKey', () => {
  let dynamodbClient: jasmine.SpyObj<DynamoDBClient>
  let apigatewayClient: jasmine.SpyObj<APIGatewayClient>
  let createCustomerApiKey: CreateCustomerApiKey

  beforeEach(() => {
    const dynamodbResult = {
      $metadata: {
        httpStatusCode: 201
      }
    }

    dynamodbClient = jasmine.createSpyObj('DynamoDBClient', { send: Promise.resolve(dynamodbResult) })
    apigatewayClient = jasmine.createSpyObj('APIGatewayClient', ['send'])
    const sendSpy = jasmine.createSpy('send').and.callFake(async (command) => {
      if (command instanceof CreateApiKeyCommand) {
        return await Promise.resolve({ id: 'apiGatewayId' })
      }

      if (command instanceof GetUsagePlansCommand) {
        return await Promise.resolve(
          {
            items: [
              {
                id: 'usagePlanId',
                name: 'organisationId'
              }
            ],
            position: ''
          }
        )
      }

      if (command instanceof CreateUsagePlanCommand) {
        return await Promise.resolve({ id: 'usagePlanId' })
      }

      if (command instanceof CreateUsagePlanKeyCommand) {
        return await Promise.resolve({ id: 'usagePlanId' })
      }

      throw new Error(`Unknown command type: ${command}`)
    })

    apigatewayClient.send = sendSpy
    createCustomerApiKey = new CreateCustomerApiKey(dynamodbClient, apigatewayClient)
  })

  describe('when there is already an usage plan for the current organisationId', () => {
    it('generates a fresh api key', async () => {
      const created = await createCustomerApiKey.call('organisationId', 'description')
      const decrypted = await created.toDecryptedJson()

      expect(created.OrganisationId).toEqual('organisationId')
      expect(created.CustomerApiKeyId).toMatch(/^HUB[A-Z0-9]{17}$/)
      expect(created.Secret).toMatch(/^[\w\d+/=]+:[\w\d+/=]+$/)
      expect(created.Enabled).toEqual(true)
      expect(decrypted.Secret).toMatch(/^[A-Za-z0-9_-]+$/)
      expect(created.Description).toMatch(/^description/)
      expect(created.ApiGatewayId).toEqual('apiGatewayId')
      expect(created.UsagePlanId).toEqual('usagePlanId')
      expect(created.Saved).toEqual(true)

      expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
      expect(apigatewayClient.send).toHaveBeenCalledTimes(3)
    })
  })

  describe('when there is no usage plan for the current organisationId', () => {
    it('generates a fresh api key', async () => {
      const created = await createCustomerApiKey.call('anotherOrganisationId', 'description')
      const decrypted = await created.toDecryptedJson()

      expect(created.OrganisationId).toEqual('anotherOrganisationId')
      expect(created.CustomerApiKeyId).toMatch(/^HUB[A-Z0-9]{17}$/)
      expect(created.Secret).toMatch(/^[\w\d+/=]+:[\w\d+/=]+$/)
      expect(created.Enabled).toEqual(true)
      expect(decrypted.Secret).toMatch(/^[A-Za-z0-9_-]+$/)
      expect(created.Description).toMatch(/^description/)
      expect(created.ApiGatewayId).toEqual('apiGatewayId')
      expect(created.UsagePlanId).toEqual('usagePlanId')
      expect(created.Saved).toEqual(true)

      expect(dynamodbClient.send).toHaveBeenCalledTimes(1)
      expect(apigatewayClient.send).toHaveBeenCalledTimes(4)
    })
  })
})
