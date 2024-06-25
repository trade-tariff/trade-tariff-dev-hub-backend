import { type Request, type Response } from 'express'
import { type UserRepository } from '../repositories/userRepository'
import { type OrganisationRepository } from '../repositories/organisationRepository'
import { logger } from '../config/logging'

export class UserController {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly organisationRepository: OrganisationRepository
  ) {}

  async show (req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const user = await this.userRepository.getUser(id)

    if (user === null) {
      res.status(404).json({ message: 'User not found' })
    } else {
      let organisation = await this.organisationRepository.getOrganisation(user.OrganisationId)

      if (organisation === null) {
        organisation = await this.organisationRepository.createOrganisation(user.OrganisationId)
      }
      logger.info(`UserController show user ${JSON.stringify(organisation)}`)
      logger.debug(`UserController show user ${JSON.stringify(organisation)}`)
      console.log(`UserController show user ${JSON.stringify(organisation)}`)
      const status = organisation?.Status
      const response = { ...user.toJson(), Status: status }
      console.log(`UserController show user response ${JSON.stringify(response)}`)
      res.json({ ...user.toJson(), Status: status })
    }
  }

  async create (req: Request, res: Response): Promise<void> {
    const userId = req.params.id
    const organisationId = req.body.organisationId as string
    const user = await this.userRepository.createUser(userId, organisationId)

    let organisation = await this.organisationRepository.getOrganisation(user.OrganisationId)
    if (organisation === null) {
      organisation = await this.organisationRepository.createOrganisation(organisationId)
    }
    const status = organisation.Status
    logger.info(`UserController show user ${JSON.stringify(organisation)}`)
    logger.debug(`UserController show user ${JSON.stringify(organisation)}`)
    console.log(`UserController show user ${JSON.stringify(organisation)}`)
    const response = { ...user.toJson(), Status: status }
    console.log(`UserController show user response ${JSON.stringify(response)}`)
    res.status(201).json({ ...user.toJson(), Status: status })
  }
}
