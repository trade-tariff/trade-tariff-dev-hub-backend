import { type NextFunction, type Request, type Response } from 'express'
import { type CustomerApiKeyRepository } from '../repositories/customerApiKeyRepository'
import { createAuditLogEntry, type FrontendRequest } from '../utils/audit'

export class ApiKeyController {
  constructor (private readonly repository: CustomerApiKeyRepository) {}

  async show (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organisationId = req.params.organisationId
      const id = req.params.id
      const apiKey = await this.repository.getKey(organisationId, id)

      if (apiKey === null) {
        res.status(404).json({ message: 'API key not found' })
      } else {
        res.json(await apiKey.toJson())
      }
    } catch (e) {
      next(e)
    }
  }

  async index (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organisationId = req.params.organisationId
      const apiKeys = await this.repository.listKeys(organisationId)
      const jsonKeys = await Promise.all(
        apiKeys.map(async (apiKey) => await apiKey.toJson())
      )

      res.json(jsonKeys)
    } catch (e) {
      next(e)
    }
  }

  async create (req: FrontendRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organisationId = req.params.organisationId
      const description = req.body.description
      const userId = req.headers['x-user-id'] ?? ''

      if (typeof description !== 'string') {
        res.status(400).json({ error: 'Invalid description type' })
        return
      }

      const apiKey = await this.repository.createKey(organisationId, description)

      const serialized = await apiKey.toDecryptedJson()

      await createAuditLogEntry({
        userId,
        table: 'CustomerApiKeys',
        properties: {
          operation: 'create',
          changedValue: {
            name: 'API Key',
            value: apiKey.Secret
          }
        }
      })

      res.status(201).json(serialized)
    } catch (e) {
      next(e)
    }
  }

  async update (req: FrontendRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organisationId: string = req.params.organisationId
      const id: string = req.params.id
      const body = req.body
      const userId = req.headers['x-user-id'] ?? ''

      if (typeof body !== 'object') {
        res.status(400).json({ message: 'Invalid request' })
        return
      }

      const customerApiKey = await this.repository.getKey(organisationId, id)

      if (customerApiKey === null) {
        res.status(404).json({ message: 'API key not found' })
        return
      }
      if (body.enabled !== undefined && typeof body.enabled === 'boolean') {
        customerApiKey.Enabled = body.enabled
      } else {
        res.status(400).json({ message: 'Invalid request' })
        return
      }

      await this.repository.updateKey(customerApiKey)

      await createAuditLogEntry({
        userId,
        table: 'CustomerApiKeys',
        properties: {
          operation: 'update',
          changedValue: {
            name: 'API Key',
            value: customerApiKey.Secret
          }
        }
      })

      res.status(200).json(await customerApiKey.toJson())
    } catch (e) {
      next(e)
    }
  }

  async destroy (req: FrontendRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organisationId: string = req.params.organisationId
      const id: string = req.params.id
      const userId = req.headers['x-user-id'] ?? ''

      const customerApiKey = await this.repository.getKey(organisationId, id)

      if (customerApiKey === null) {
        res.status(404).json({ message: 'API key not found' })
        return
      }

      await this.repository.deleteKey(customerApiKey)

      await createAuditLogEntry({
        userId,
        table: 'CustomerApiKeys',
        properties: {
          operation: 'delete',
          changedValue: {
            name: 'API Key',
            value: customerApiKey.Secret
          }
        }
      })

      res.status(200).json({ message: 'API key deleted' })
    } catch (e) {
      next(e)
    }
  }
}
