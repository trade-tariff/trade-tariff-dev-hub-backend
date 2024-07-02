import { type Request, type Response } from 'express'
import { type UserRepository } from '../repositories/userRepository'
import { type OrganisationRepository } from '../repositories/organisationRepository'

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

      const status = organisation?.Status
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

    res.status(201).json({ ...user.toJson(), Status: status })
  }

  async update (req: Request, res: Response): Promise<void> {
    const userId = req.params.userId
    const emailAddress = req.body.emailAddress as string

    await this.userRepository.updateUser(userId, emailAddress)
    res.status(200).json({ userId })
  }

  async updateOrganisation (req: Request, res: Response): Promise<void> {
    const organisationId = req.params.organisationId
    const reference = req.body.applicationReference as string
    const status = req.body.status as string
    const organisationName = req.body.organisationName as string
    const eoriNumber = req.body.eoriNumber as string
    const ukAcsReference = req.body.ukAcsReference as string

    await this.organisationRepository.updateOrganisation(organisationId, reference, status, organisationName, eoriNumber, ukAcsReference)
    res.status(200).json({ organisationId })
  }

  async getOrganisation (req: Request, res: Response): Promise<void> {
    const organisationId = req.params.organisationId
    const organisation = await this.organisationRepository.getOrganisation(organisationId)
    if (organisation === null) {
      res.status(404).json({ message: 'organisation not found' })
    } else {
      res.status(200).json({ ...organisation.toJson() })
    }
  }
}
