import { NextFunction, type Request, type Response } from 'express'
import { type OrganisationRepository } from '../repositories/organisationRepository'
import { type Organisation } from '../../src/models/organisation'

export class OrganisationsController {
  constructor (
    private readonly organisationRepository: OrganisationRepository
  ) {}

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organisationId = req.body.organisationId as string

      let organisation = await this.organisationRepository.getOrganisation(organisationId)
      if (organisation === null) {
        organisation = await this.organisationRepository.createOrganisation(organisationId)
      }

      res.status(201).json({ ...organisation.toJson() })
    } catch (e) {
      next(e)
    }
  }

  async updateOrganisation (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organisationId = req.params.organisationId
      const reference = req.body.applicationReference as string
      const status = req.body.status as string
      const organisationName = req.body.organisationName as string
      const eoriNumber = req.body.eoriNumber as string
      const ukAcsReference = req.body.ukAcsReference as string

      await this.organisationRepository.updateOrganisation(organisationId, reference, status, organisationName, eoriNumber, ukAcsReference)
      res.status(200).json({ organisationId })
    } catch (e) {
      next(e)
    }
  }

  async getOrganisation (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organisationId = req.params.organisationId
      const organisation = await this.organisationRepository.getOrganisation(organisationId)
      if (organisation === null) {
        res.status(404).json({ message: 'organisation not found' })
      } else {
        res.json({ ...organisation.toJson() })
      }
    } catch (e) {
      next(e)
    }
  }
}
