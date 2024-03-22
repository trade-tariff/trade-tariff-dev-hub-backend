import { validate } from 'class-validator'
import { CustomerApiKey } from '../../src/models/customerApiKey'

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
      apiKey.Enabled = true
      apiKey.Description = 'some-description'
      apiKey.CustomerId = 'some-customer-id'
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

  describe('when the CustomerId is invalid', () => {
    it('is invalid', async () => {
      const apiKey: CustomerApiKey = new CustomerApiKey()
      apiKey.CustomerId = null as unknown as string

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
})
