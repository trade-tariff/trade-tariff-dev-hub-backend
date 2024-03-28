import { type Request, type Response } from 'express'
import { type CustomerApiKeyRepository } from '../repositories/customerApiKeyRepository'

export class ApiKeyController {
  constructor (
    private readonly repository: CustomerApiKeyRepository
  ) {}

  async show (req: Request, res: Response): Promise<void> {
    const fpoId = req.params.fpoId
    const id = req.params.id
    const apiKey = await this.repository.getKey(fpoId, id)

    if (apiKey === null) {
      res.status(404).json({ message: 'API key not found' })
    } else {
      res.json(await apiKey.toDecryptedJson())
    }
  }

  async index (req: Request, res: Response): Promise<void> {
    const fpoId = req.params.fpoId
    const apiKeys = await this.repository.listKeys(fpoId)

    res.json(apiKeys.map(apiKey => apiKey.toJson()))
  }

  async create (req: Request, res: Response): Promise<void> {
    const fpoId = req.params.fpoId
    const apiKey = await this.repository.createKey(fpoId)

    res.status(201).json(apiKey.toJson())
  }

  async update (req: Request, res: Response): Promise<void> {
    const fpoId: string = req.params.fpoId
    const customerApiKeyId: string = req.params.customerApiKeyId
    const body = req.body

    if (typeof body !== 'object') {
      res.status(400).json({ message: 'Invalid request' })
      return
    }

    const customerApiKey = await this.repository.getKey(fpoId, customerApiKeyId)

    if (customerApiKey === null) {
      res.status(404).json({ message: 'API key not found' })
      return
    }

    if (body.description !== undefined && typeof body.description === 'string') {
      customerApiKey.Description = body.description
    } else {
      res.status(400).json({ message: 'Invalid request' })
      return
    }

    await this.repository.updateKey(customerApiKey)

    res.status(200).json(customerApiKey.toJson())
  }
}
