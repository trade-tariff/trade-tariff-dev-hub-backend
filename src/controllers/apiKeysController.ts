import { type Request, type Response } from 'express'
import { type CustomerApiKeyRepository } from '../repositories/customerApiKeyRepository'
// const allowedKeys = ['description', 'enabled']

export class ApiKeyController {
  constructor (
    private readonly repository: CustomerApiKeyRepository
  ) {}

  async patch (req: Request, res: Response): Promise<void> {
    const fpoId: string = req.params.fpoId
    const customerApiKeyId: string = req.params.customerApiKeyId
    const body: string = req.body

    if (typeof body !== 'object') {
      res.status(400).json({ message: 'Invalid request' })
    } else {
      const apiKey = await this.repository.updateKey(fpoId, customerApiKeyId, body)

      if (apiKey === null) {
        res.status(404).json({ message: 'Did not succeed' })
      } else {
        res.status(200).json({message: 'Success' })
      }
    }
  }

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
}
