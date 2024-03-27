//import { type Request, type Response } from 'express'
//import { type CustomerApiKeyRepository } from '../repositories/customerApiKeyRepository'
//// const allowedKeys = ['description', 'enabled']

//export class ApiKeyController {
//  //   async update (req: Request, res: Response): Promise<void> {
//  //     const fpoId = req.params.fpoId
//  //     const id = req.params.id
//  //     const body = req.body
//  //
//  //     if (typeof body !== 'object') {
//  //       res.status(400).json({ message: 'Invalid request' })
//  //     }
//  //     const apiKey = await repository.updateKey(fpoId, id, body)

//  //     if (apiKey === null) {
//  //       res.status(404).json({ message: 'Did not succeed' })
//  //     } else {
//  //       res.status(200).json(apiKey.toJson())
//  //     }
//  //   }
//  private readonly repository: CustomerApiKeyRepository

//  constructor (repository: CustomerApiKeyRepository) {
//    this.repository = repository
//  }

//  async show (req: Request, res: Response): Promise<void> {
//    const fpoId = req.params.fpoId
//    const id = req.params.id
//    const apiKey = await this.repository.getKey(fpoId, id)

//    if (apiKey === null) {
//      res.status(404).json({ message: 'API key not found' })
//    } else {
//      res.json(await apiKey.toDecryptedJson())
//    }
//  }

//  async index (req: Request, res: Response): Promise<void> {
//    const fpoId = req.params.fpoId
//    const apiKeys = await this.repository.listKeys(fpoId)

//    res.json(apiKeys.map(apiKey => apiKey.toJson()))
//  }

//  async create (req: Request, res: Response): Promise<void> {
//    const fpoId = req.params.fpoId
//    const apiKey = await this.repository.createKey(fpoId)

//    res.status(201).json(apiKey.toJson())
//  }
//}
//
import jasmine from 'jasmine'

import { ApiKeyController } from '../../src/controllers/apiKeysController'

describe('ApiKeyController', () => {
  it('should be defined', () => {
    expect(ApiKeyController).toBeDefined()
  })
})


