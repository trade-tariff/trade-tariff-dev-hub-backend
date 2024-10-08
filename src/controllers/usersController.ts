import { type Request, type Response } from 'express'
import { type UserRepository } from '../repositories/userRepository'
import { type OrganisationRepository } from '../repositories/organisationRepository'
import { type NextFunction } from 'express-serve-static-core'

export class UserController {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly organisationRepository: OrganisationRepository
  ) {}

  async show (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id
      const user = await this.userRepository.getUser(id)

      if (user === null) {
        res.status(404).json({ message: 'User not found' })
      } else {
        let organisation = await this.organisationRepository.getOrganisation(user.OrganisationId)

        if (organisation === null) {
          organisation = await this.organisationRepository.createOrganisation(user.OrganisationId)
        }

        const status = organisation?.Status
        res.json({ ...user.toJson(), Status: status })
      }
    } catch (e) {
      next(e)
    }
  }

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id
      const organisationId = req.body.organisationId as string
      const user = await this.userRepository.createUser(userId, organisationId)

      let organisation = await this.organisationRepository.getOrganisation(user.OrganisationId)
      if (organisation === null) {
        organisation = await this.organisationRepository.createOrganisation(organisationId)
      }
      const status = organisation.Status

      res.status(201).json({ ...user.toJson(), Status: status })
    } catch (e) {
      next(e)
    }
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id
      const emailAddress = req.body.emailAddress as string

      await this.userRepository.updateUser(userId, emailAddress)
      res.status(200).json({ userId })
    } catch (e) {
      next(e)
    }
  }
}
