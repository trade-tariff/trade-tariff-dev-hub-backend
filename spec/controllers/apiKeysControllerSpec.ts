import 'jasmine'
import { type Request, type Response } from 'express'

import { ApiKeyController } from '../../src/controllers/apiKeysController'
import { type CustomerApiKeyRepository } from '../../src/repositories/customerApiKeyRepository'
import { CustomerApiKey } from '../../src/models/customerApiKey'

describe('ApiKeyController', () => {
  let repository: jasmine.SpyObj<CustomerApiKeyRepository>
  let controller: ApiKeyController
  let getKeyResult: Promise<CustomerApiKey | null>
  let req: Request
  let res: Response
  let apiKey: CustomerApiKey

  describe('show', () => {
    it('returns the decrypted key', async () => {
      apiKey = new CustomerApiKey()
      apiKey.Secret = 'TwdRsG9BC6yF8zER:vgPdLKDyFcxn8bfJYpUHS/+YTk8O2g=='
      getKeyResult = Promise.resolve(apiKey)
      repository = jasmine.createSpyObj('CustomerApiKeyRepository', { getKey: getKeyResult })
      repository.getKey.bind(repository)
      controller = new ApiKeyController(repository)
      req = { params: { fpoId: 'fpoId', id: 'id' } } as any
      res = { json: jasmine.createSpy() } as unknown as any

      await controller.show(req, res)

      expect(repository.getKey).toHaveBeenCalledWith('fpoId', 'id')
      expect(res.json).toHaveBeenCalledWith({
        CustomerApiKeyId: '',
        ApiGatewayId: '',
        Secret: 'secret',
        Enabled: false,
        Description: '',
        FpoId: '',
        CreatedAt: apiKey.CreatedAt,
        UpdatedAt: apiKey.UpdatedAt
      })
    })

    it('returns 404 if the key is not found', async () => {
      getKeyResult = Promise.resolve(null)
      repository = jasmine.createSpyObj('CustomerApiKeyRepository', { getKey: getKeyResult })
      repository.getKey.bind(repository)
      controller = new ApiKeyController(repository)
      req = { params: { fpoId: 'fpoId', id: 'id' } } as any
      res = { status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() }) } as unknown as any

      await controller.show(req, res)

      expect(repository.getKey).toHaveBeenCalledWith('fpoId', 'id')
      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('index', () => {
    it('returns the list of keys', async () => {
      apiKey = new CustomerApiKey()
      apiKey.Secret = 'TwdRsG9BC6yF8zER:vgPdLKDyFcxn8bfJYpUHS/+YTk8O2g=='
      const listKeysResult = Promise.resolve([apiKey])
      repository = jasmine.createSpyObj('CustomerApiKeyRepository', { listKeys: listKeysResult })
      repository.listKeys.bind(repository)
      controller = new ApiKeyController(repository)
      req = { params: { fpoId: 'fpoId' } } as any
      res = { json: jasmine.createSpy() } as unknown as any

      await controller.index(req, res)

      expect(repository.listKeys).toHaveBeenCalledWith('fpoId')
      expect(res.json).toHaveBeenCalledWith([{
        CustomerApiKeyId: '',
        ApiGatewayId: '',
        Secret: 'TwdRsG9BC6yF8zER:vgPdLKDyFcxn8bfJYpUHS/+YTk8O2g==',
        Enabled: false,
        Description: '',
        FpoId: '',
        CreatedAt: apiKey.CreatedAt,
        UpdatedAt: apiKey.UpdatedAt
      }])
    })

    it('returns an empty list if there are no keys', async () => {
      const listKeysResult = Promise.resolve([])
      repository = jasmine.createSpyObj('CustomerApiKeyRepository', { listKeys: listKeysResult })
      repository.listKeys.bind(repository)
      controller = new ApiKeyController(repository)
      req = { params: { fpoId: 'fpoId' } } as any
      res = { json: jasmine.createSpy() } as unknown as any

      await controller.index(req, res)

      expect(repository.listKeys).toHaveBeenCalledWith('fpoId')
      expect(res.json).toHaveBeenCalledWith([])
    })
  })

  describe('create', () => {
    it('creates a new key', async () => {
      apiKey = new CustomerApiKey()

      const createKeyResult = Promise.resolve(apiKey)
      repository = jasmine.createSpyObj('CustomerApiKeyRepository', { createKey: createKeyResult })
      repository.createKey.bind(repository)
      controller = new ApiKeyController(repository)
      req = { params: { fpoId: 'fpoId' } } as any
      const res = {
        status: function (code: number) {
          this.statusCode = code
          return this
        },
        json: function (data: any) {
          this.data = data
          return this
        }
      } as any

      await controller.create(req, res)

      expect(repository.createKey).toHaveBeenCalledWith('fpoId')
      expect(res.statusCode).toBe(201)
      expect(res.data).toEqual({
        CustomerApiKeyId: '',
        ApiGatewayId: '',
        Secret: '',
        Enabled: false,
        Description: '',
        FpoId: '',
        CreatedAt: apiKey.CreatedAt,
        UpdatedAt: apiKey.UpdatedAt
      })
    })
  })
})
