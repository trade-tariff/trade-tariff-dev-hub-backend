import { CustomerApiKeyEncryption } from '../../src/utils/customerApiKeyEncryption'

describe('CustomerApiKeyEncryption', () => {
  describe('encrypt', () => {
    it('returns an encrypted key', async () => {
      const encryption = new CustomerApiKeyEncryption()

      const encrypted = await encryption.encrypt('secret')

      expect(encrypted).toMatch(/^[A-Za-z0-9+/]+={0,2}:[A-Za-z0-9+/]+={0,2}$/)
    })
  })

  describe('decrypt', () => {
    it('returns a decrypted key', async () => {
      const encrypted = 'TwdRsG9BC6yF8zER:vgPdLKDyFcxn8bfJYpUHS/+YTk8O2g=='
      const encryption = new CustomerApiKeyEncryption()
      const decrypted = await encryption.decrypt(encrypted)

      expect(decrypted).toEqual('secret')
    })
  })
})
