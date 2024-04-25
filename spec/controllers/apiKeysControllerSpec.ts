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
        UpdatedAt: apiKey.UpdatedAt,
        UsagePlanId: ''
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
        UpdatedAt: apiKey.UpdatedAt,
        UsagePlanId: ''
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

  describe('update', () => {
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

    it('disable the key', async () => {
      apiKey = new CustomerApiKey()
      const getKeyResult = Promise.resolve(apiKey)
      const updateKeyResult = Promise.resolve(apiKey)

      repository = jasmine.createSpyObj(
        'CustomerApiKeyRepository',
        {
          updateKey: updateKeyResult,
          getKey: getKeyResult
        }
      )
      repository.updateKey.bind(repository)
      controller = new ApiKeyController(repository)
      req = { params: { fpoId: 'fpoId', id: 'id' }, body: { enabled: false } } as any

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await controller.update(req, res)

      expect(repository.getKey).toHaveBeenCalledWith('fpoId', 'id')
      expect(repository.updateKey).toHaveBeenCalledWith(apiKey)
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({
        CustomerApiKeyId: '',
        ApiGatewayId: '',
        Secret: '',
        Enabled: false,
        Description: '',
        FpoId: '',
        CreatedAt: apiKey.CreatedAt,
        UpdatedAt: apiKey.UpdatedAt,
        UsagePlanId: ''
      })
    })

    it('enable the key', async () => {
      apiKey = new CustomerApiKey()
      const getKeyResult = Promise.resolve(apiKey)
      const updateKeyResult = Promise.resolve(apiKey)

      repository = jasmine.createSpyObj(
        'CustomerApiKeyRepository',
        {
          updateKey: updateKeyResult,
          getKey: getKeyResult
        }
      )
      repository.updateKey.bind(repository)
      controller = new ApiKeyController(repository)
      req = { params: { fpoId: 'fpoId', id: 'id' }, body: { enabled: true } } as any

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await controller.update(req, res)

      expect(repository.getKey).toHaveBeenCalledWith('fpoId', 'id')
      expect(repository.updateKey).toHaveBeenCalledWith(apiKey)
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({
        CustomerApiKeyId: '',
        ApiGatewayId: '',
        Secret: '',
        Enabled: true,
        Description: '',
        FpoId: '',
        CreatedAt: apiKey.CreatedAt,
        UpdatedAt: apiKey.UpdatedAt,
        UsagePlanId: ''
      })
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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
        UpdatedAt: apiKey.UpdatedAt,
        UsagePlanId: ''
      })
    })
  })

  describe('destroy', () => {
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

    it('returns 200', async () => {
      apiKey = new CustomerApiKey()
      getKeyResult = Promise.resolve(apiKey)
      const deleteKeyResult = Promise.resolve()
      repository = jasmine.createSpyObj('CustomerApiKeyRepository', { getKey: getKeyResult, deleteKey: deleteKeyResult })
      repository.getKey.bind(repository)
      repository.deleteKey.bind(repository)
      controller = new ApiKeyController(repository)
      req = { params: { fpoId: 'fpoId', id: 'id' } } as any

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await controller.destroy(req, res)

      expect(repository.getKey).toHaveBeenCalledWith('fpoId', 'id')
      expect(repository.deleteKey).toHaveBeenCalledWith(apiKey)
      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({
        message: 'API key deleted'
      })
    })

    it('returns 404 if the key is not found', async () => {
      getKeyResult = Promise.resolve(null)
      repository = jasmine.createSpyObj('CustomerApiKeyRepository', { getKey: getKeyResult })
      repository.getKey.bind(repository)
      controller = new ApiKeyController(repository)
      req = { params: { fpoId: 'fpoId', id: 'id' } } as any

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await controller.destroy(req, res)

      expect(repository.getKey).toHaveBeenCalledWith('fpoId', 'id')
      expect(res.statusCode).toBe(404)
      expect(res.data).toEqual({
        message: 'API key not found'
      })
    })
  })
})
