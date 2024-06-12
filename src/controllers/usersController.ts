import { type Request, type Response } from 'express'
import { type UserRepository } from '../repositories/userRepository'
import { createAuditLogEntry, type FrontendRequest } from '../utils/audit'

export class UserController {
  constructor (private readonly repository: UserRepository) {}

  async show (req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const user = await this.repository.getUser(id)

    if (user === null) {
      res.status(404).json({ message: 'User not found' })
    } else {
      res.json(user)
    }
  }

  async create (req: Request, res: Response): Promise<void> {
    const userId = req.params.id
    const organisationId = req.body.organisationId as string
    const user = await this.repository.createUser(userId, organisationId)
    res.status(201).json(user.toJson())
  }

  async update (req: FrontendRequest, res: Response): Promise<void> {
    const id: string = req.params.id
    const body = req.body
    const userId = req.headers['x-user-id'] ?? ''

    if (typeof body !== 'object') {
      res.status(400).json({ message: 'Invalid request' })
      return
    }

    const user = await this.repository.getUser(id)

    if (user === null) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    if (
      body.organisationId !== undefined &&
      typeof body.organisationId === 'string'
    ) {
      user.OrganisationId = body.organisationId
    } else {
      res.status(400).json({ message: 'Invalid request' })
      return
    }

    await this.repository.updateUser(user)

    await createAuditLogEntry({
      userId,
      table: 'Users',
      properties: {
        operation: 'update',
        changedValue: {
          name: 'Organisation ID',
          value: body.organisationId
        }
      }
    })

    res.status(200).json(user.toJson())
  }
}
