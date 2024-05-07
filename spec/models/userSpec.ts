import { validate } from 'class-validator'
import { User } from '../../src/models/user'

describe('User Model', () => {
  describe('when all of the values are the default', () => {
    it('should validate with no errors', async () => {
      const user: User = new User()
      const errors = await validate(user)
      expect(errors.length).toBe(0)
    })
  })

  describe('when the User has provided values', () => {
    it('is valid', async () => {
      const user = new User()

      user.UserId = 'some-id'
      user.FpoId = 'some-fpo-id'
      user.UpdatedAt = new Date().toISOString()

      const errors = await validate(user)
      expect(errors.length).toBe(0)
    })
  })

  describe('when the User is invalid', () => {
    it('is invalid', async () => {
      const user: User = new User()
      user.UserId = null as unknown as string

      const errors = await validate(user)
      expect(errors.length).toBe(1)
    })
  })

  describe('when the FpoId is invalid', () => {
    it('is invalid', async () => {
      const user: User = new User()
      user.FpoId = null as unknown as string

      const errors = await validate(user)
      expect(errors.length).toBe(1)
    })
  })

  describe('when the UpdatedAt is invalid', () => {
    it('is invalid', async () => {
      const user: User = new User()
      user.UpdatedAt = null as unknown as string

      let errors = await validate(user)
      expect(errors.length).toBe(1)

      user.UpdatedAt = 'some-date' as unknown as string

      errors = await validate(user)
      expect(errors.length).toBe(1)
    })
  })

  describe('fromItem', () => {
    it('returns a User instance', () => {
      const item = {
        UserId: 'the-id',
        FpoId: 'yodel',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        Saved: false
      }

      const actual = User.fromItem(item)
      expect(actual).toBeInstanceOf(User)
      expect(actual.UserId).toBe('the-id')
    })
  })

  describe('toItem', () => {
    it('returns a plain object', () => {
      const user = new User()
      user.UserId = 'the-id'
      user.FpoId = 'the-fpo-id'

      const actual = user.toItem()
      expect(actual).toEqual({
        UserId: 'the-id',
        FpoId: 'the-fpo-id',
        CreatedAt: user.CreatedAt,
        UpdatedAt: user.UpdatedAt
      })
    })
  })

  describe('toJson', () => {
    it('returns a plain object', () => {
      const user = new User()
      user.UserId = 'the-id'

      const actual = user.toJson()

      expect(actual).toEqual({
        UserId: 'the-id',
        FpoId: '',
        CreatedAt: user.CreatedAt,
        UpdatedAt: user.UpdatedAt
      })
    })
  })
})
