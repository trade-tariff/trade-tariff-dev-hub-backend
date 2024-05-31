import { validate } from 'class-validator'
import { CustomerApiKey } from '../../src/models/customerApiKey'
import { CustomerApiKeyEncryption } from '../../src/utils/customerApiKeyEncryption'

describe('CustomerApiKey Model', () => {
  describe('when all of the values are the default', () => {
    it('should validate with no errors', async () => {
      const apiKey: CustomerApiKey = new CustomerApiKey()
      const errors = await validate(apiKey)
      expect(errors.length).toBe(0)
    })
  })

  describe('when the CustomerApiKeyId has provided values', () => {
    it('is valid', async () => {
      const apiKey = new CustomerApiKey()

      apiKey.CustomerApiKeyId = 'some-id'
      apiKey.Secret = 'some-secret'
      apiKey.ApiGatewayId = 'someother-id'
      apiKey.Enabled = true
      apiKey.Description = 'some-description'
      apiKey.OrganisationId = 'some-fpo-id'
      apiKey.CreatedAt = new Date().toISOString()
      apiKey.UpdatedAt = new Date().toISOString()

      const errors = await validate(apiKey)
      expect(errors.length).toBe(0)
    })
  })

  describe('when the CustomerApiKeyId is invalid', () => {
    it('is invalid', async () => {
      const apiKey: CustomerApiKey = new CustomerApiKey()
      apiKey.CustomerApiKeyId = null as unknown as string

      const errors = await validate(apiKey)
      expect(errors.length).toBe(1)
    })
  })

  describe('when the ApiGatewayId is invalid', () => {
    it('is invalid', async () => {
      const apiKey: CustomerApiKey = new CustomerApiKey()
      apiKey.ApiGatewayId = null as unknown as string

      const errors = await validate(apiKey)
      expect(errors.length).toBe(1)
    })
  })

  describe('when the Secret is invalid', () => {
    it('is invalid', async () => {
      const apiKey: CustomerApiKey = new CustomerApiKey()
      apiKey.Secret = null as unknown as string

      const errors = await validate(apiKey)
      expect(errors.length).toBe(1)
    })
  })

  describe('when the Enabled is invalid', () => {
    it('is invalid', async () => {
      const apiKey: CustomerApiKey = new CustomerApiKey()
      apiKey.Enabled = null as unknown as boolean

      let errors = await validate(apiKey)
      expect(errors.length).toBe(1)

      apiKey.Enabled = undefined as unknown as boolean

      errors = await validate(apiKey)
      expect(errors.length).toBe(1)

      apiKey.Enabled = 'true' as unknown as boolean
      errors = await validate(apiKey)
      expect(errors.length).toBe(1)
    })
  })

  describe('when the Description is invalid', () => {
    it('is invalid', async () => {
      const apiKey: CustomerApiKey = new CustomerApiKey()
      apiKey.Description = null as unknown as string

      const errors = await validate(apiKey)
      expect(errors.length).toBe(1)
    })
  })

  describe('when the OrganisationId is invalid', () => {
    it('is invalid', async () => {
      const apiKey: CustomerApiKey = new CustomerApiKey()
      apiKey.OrganisationId = null as unknown as string

      const errors = await validate(apiKey)
      expect(errors.length).toBe(1)
    })
  })

  describe('when the CreatedAt is invalid', () => {
    it('is invalid', async () => {
      const apiKey: CustomerApiKey = new CustomerApiKey()
      apiKey.CreatedAt = null as unknown as string

      let errors = await validate(apiKey)
      expect(errors.length).toBe(1)

      apiKey.CreatedAt = 'some-date' as unknown as string

      errors = await validate(apiKey)
      expect(errors.length).toBe(1)
    })
  })

  describe('when the UpdatedAt is invalid', () => {
    it('is invalid', async () => {
      const apiKey: CustomerApiKey = new CustomerApiKey()
      apiKey.UpdatedAt = null as unknown as string

      let errors = await validate(apiKey)
      expect(errors.length).toBe(1)

      apiKey.UpdatedAt = 'some-date' as unknown as string

      errors = await validate(apiKey)
      expect(errors.length).toBe(1)
    })
  })

  describe('fromItem', () => {
    it('returns a CustomerApiKey instance', () => {
      const item = {
        CustomerApiKeyId: 'the-id',
        Secret: 'secret',
        Enabled: true,
        Description: '',
        OrganisationId: 'yodel',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        Saved: false,
        UsagePlanId: ''
      }

      const actual = CustomerApiKey.fromItem(item)
      expect(actual).toBeInstanceOf(CustomerApiKey)
      expect(actual.CustomerApiKeyId).toBe('the-id')
    })
  })

  describe('toItem', () => {
    it('returns a plain object', () => {
      const apiKey = new CustomerApiKey()
      apiKey.CustomerApiKeyId = 'the-id'
      apiKey.Secret = 'secret'
      apiKey.Enabled = true

      const actual = apiKey.toItem()
      expect(actual).toEqual({
        CustomerApiKeyId: 'the-id',
        ApiGatewayId: '',
        Secret: 'secret',
        Enabled: true,
        Description: '',
        OrganisationId: '',
        CreatedAt: apiKey.CreatedAt,
        UpdatedAt: apiKey.UpdatedAt,
        UsagePlanId: ''
      })
    })
  })

  describe('toJson', () => {
    it('returns a plain object', async () => {
      const plainSecret = 'secret'
      const encryptedSecret = await new CustomerApiKeyEncryption().encrypt(plainSecret)
      const apiKey = new CustomerApiKey()
      apiKey.CustomerApiKeyId = 'the-id'
      apiKey.Secret = encryptedSecret
      apiKey.Enabled = true

      const actual = await apiKey.toJson()

      expect(actual).toEqual({
        CustomerApiKeyId: 'the-id',
        ApiGatewayId: '',
        Secret: '****cret',
        Enabled: true,
        Description: '',
        OrganisationId: '',
        CreatedAt: apiKey.CreatedAt,
        UpdatedAt: apiKey.UpdatedAt,
        UsagePlanId: ''
      })
    })
  })

  describe('toDecryptedJson', () => {
    it('returns a plain object', async () => {
      const plainSecret = 'fomo'
      const encryptedSecret = await new CustomerApiKeyEncryption().encrypt(plainSecret)
      const apiKey = new CustomerApiKey()
      apiKey.Secret = encryptedSecret

      const actual = await apiKey.toDecryptedJson()
      expect(actual).toEqual({
        Secret: plainSecret,
        Description: '',
        Enabled: false,
        OrganisationId: '',
        ApiGatewayId: '',
        CustomerApiKeyId: '',
        CreatedAt: apiKey.CreatedAt,
        UpdatedAt: apiKey.UpdatedAt,
        UsagePlanId: ''
      })
    })
  })
})
