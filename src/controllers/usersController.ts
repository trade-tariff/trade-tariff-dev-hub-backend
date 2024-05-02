import { type Request, type Response } from 'express'
import { type UserRepository } from '../repositories/userRepository'

export class UserController {
  constructor (
    private readonly repository: UserRepository
  ) {}

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
    const user = await this.repository.createUser(userId)

    res.status(201).json(user.toJson())
  }

  async update (req: Request, res: Response): Promise<void> {
    const id: string = req.params.id
    const body = req.body

    if (typeof body !== 'object') {
      res.status(400).json({ message: 'Invalid request' })
      return
    }

    const user = await this.repository.getUser(id)

    if (user === null) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    if (body.fpoId !== undefined && typeof body.fpoId === 'string') {
      user.FpoId = body.fpoId
    } else {
      res.status(400).json({ message: 'Invalid request' })
      return
    }

    await this.repository.updateUser(user)

    res.status(200).json(user.toJson())
  }
}
