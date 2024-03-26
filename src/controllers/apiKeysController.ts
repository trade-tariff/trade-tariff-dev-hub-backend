import { type Request, type Response } from 'express'
import { CustomerApiKeyRepository } from '../repositories/customerApiKeyRepository'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayClient } from '@aws-sdk/client-api-gateway'

const dynamodbClient = new DynamoDBClient({ region: process.env.AWS_REGION })
const apiGatewayClient = new APIGatewayClient({ region: process.env.AWS_REGION })
const repository = new CustomerApiKeyRepository(dynamodbClient, apiGatewayClient)
const allowedKeys = ['description', 'enabled']

export class ApiKeyController {
//   async update (req: Request, res: Response): Promise<void> {
//     const fpoId = req.params.fpoId
//     const id = req.params.id
//     const body = req.body

//     if (typeof body !== 'object') {
//       res.status(400).json({ message: 'Invalid request' })
//     }
//     const apiKey = await repository.updateKey(fpoId, id, body)

//     if (apiKey === null) {
//       res.status(404).json({ message: 'Did not succeed' })
//     } else {
//       res.status(200).json(apiKey.toJson())
//     }
//   }

  async show (req: Request, res: Response): Promise<void> {
    const fpoId = req.params.fpoId
    const id = req.params.id
    const apiKey = await repository.getKey(fpoId, id)

    if (apiKey === null) {
      res.status(404).json({ message: 'API key not found' })
    } else {
      res.json(await apiKey.toDecryptedJson())
    }
  }

  async index (req: Request, res: Response): Promise<void> {
    const fpoId = req.params.fpoId
    const apiKeys = await repository.listKeys(fpoId)

    res.json(apiKeys.map(apiKey => apiKey.toJson()))
  }

  async create (req: Request, res: Response): Promise<void> {
    const fpoId = req.params.fpoId
    const apiKey = await repository.createKey(fpoId)

    res.status(201).json(apiKey.toJson())
  }
}
