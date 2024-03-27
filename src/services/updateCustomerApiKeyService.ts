// import { CustomerApiKey } from '../models/customerApiKey'
// import { UpdateItemCommand, type UpdateItemCommandInput, type DynamoDBClient } from '@aws-sdk/client-dynamodb'
// import { UpdateApiKeyCommand, type UpdateApiKeyCommandInput, type APIGatewayClient } from '@aws-sdk/client-api-gateway'

// class UpdateCustomerApiKeyService {
//   private readonly dynamodbClient: DynamoDBClient
//   private readonly apigatewayClient: APIGatewayClient

//   constructor (dynamodbClient: DynamoDBClient, apigatewayClient: APIGatewayClient) {
//     this.dynamicClient = dynamodbClient
//     this.apigatewayClient = apigatewayClient
//   }

//   async call (fpoId: string, id: string, updates: any): Promise<CustomerApiKey> {
//     // Update the dynamo db Description and Enabled fields
//     // Update the API Gateway description and enabled fields
//     // Return the updated CustomerApiKey object
//     const input: UpdateItemCommandInput = {
//       TableName: 'CustomerApiKeys',
//       Key: {
//         FpoId: { S: fpoId },
//         CustomerApiKeyId: { S: id }
//       },
//       UpdateExpression: 'SET Enabled = :enabled, Description = :description',
//       ExpressionAttributeValues: {
//         ':enabled': { BOOL: updates.enabled },
//         ':description': { S: updates.description }
//       }
//     }

//     const command = new UpdateItemCommand(input)
//     const response = await this.dynamodbClient.send(command)

//     return CustomerApiKey.fromNestedItem(response.Attributes)
//   }

//   private async updateDynamoDb (apiKey: CustomerApiKey): Promise<void> {
//     const input: UpdateItemCommandInput = {
//       TableName: 'CustomerApiKeys',
//       Key: {
//         FpoId: { S: apiKey.FpoId },
//         CustomerApiKeyId: { S: apiKey.CustomerApiKeyId }
//       },
//       UpdateExpression: 'SET Enabled = :enabled, Description = :description',
//       ExpressionAttributeValues: {
//         ':enabled': { BOOL: apiKey.Enabled },
//         ':description': { S: apiKey.Description }
//       }
//     }

//     const command = new UpdateItemCommand(input)

//     await this.dynamodbClient.send(command)
//   }

//   private async updateApiGateway (apiKey: CustomerApiKey): Promise<void> {
//     const input: UpdateApiKeyCommandInput = {
//       apiKey: apiKey.ApiGatewayId,
//       patchOperations: [
//         {
//           op: 'replace',
//           path: '/description',
//           value: apiKey.Description
//         },
//         {
//           op: 'replace',
//           path: '/enabled',
//           value: apiKey.Enabled.toString()
//         }
//       ]
//     }

//     const command = new UpdateApiKeyCommand(input)

//     await this.apigatewayClient.send(command)
//   }
// }

// export { UpdateCustomerApiKeyService }
