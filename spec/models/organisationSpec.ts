import { validate } from 'class-validator'
import { Organisation } from '../../src/models/organisation'

describe('Organisation', () => {
  describe('when all of the values are the default', () => {
    it('should validate with no errors', async () => {
      const organisation: Organisation = new Organisation()
      const errors = await validate(organisation)
      expect(errors.length).toBe(0)
    })
  })

  describe('when the Organisation has provided values', () => {
    it('is valid', async () => {
      const organisation = new Organisation()

      organisation.OrganisationId = 'some-id'
      organisation.UpdatedAt = new Date().toISOString()

      const errors = await validate(organisation)
      expect(errors.length).toBe(0)
    })
  })

  describe('when the Organisation is invalid', () => {
    it('is invalid', async () => {
      const organisation: Organisation = new Organisation()
      organisation.OrganisationId = null as unknown as string

      const errors = await validate(organisation)
      expect(errors.length).toBe(1)
    })
  })

  describe('when the OrganisationId is invalid', () => {
    it('is invalid', async () => {
      const organisation: Organisation = new Organisation()
      organisation.OrganisationId = null as unknown as string

      const errors = await validate(organisation)
      expect(errors.length).toBe(1)
    })
  })

  describe('when the UpdatedAt is invalid', () => {
    it('is invalid', async () => {
      const organisation: Organisation = new Organisation()
      organisation.UpdatedAt = null as unknown as string

      let errors = await validate(organisation)
      expect(errors.length).toBe(1)

      organisation.UpdatedAt = 'some-date' as unknown as string

      errors = await validate(organisation)
      expect(errors.length).toBe(1)
    })
  })

  describe('fromItem', () => {
    it('returns a Organisation instance', () => {
      const item = {
        OrganisationId: 'the-id',
        OrganisationName: 'the-organisation-name',
        EoriNumber: 'the-eori-number',
        UkAcsReference: 'the-uk-acs-reference',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        Saved: false
      }

      const actual = Organisation.fromItem(item)
      expect(actual).toBeInstanceOf(Organisation)
      expect(actual.OrganisationId).toBe('the-id')
    })
  })

  describe('toItem', () => {
    it('returns a plain object', () => {
      const organisation = new Organisation()
      organisation.OrganisationId = 'the-id'
      organisation.OrganisationName = 'the-organisation-name'
      organisation.EoriNumber = 'the-eori-number'
      organisation.UkAcsReference = 'the-uk-acs-reference'

      const actual = organisation.toItem()
      expect(actual).toEqual({
        OrganisationId: 'the-id',
        Description: organisation.Description,
        Status: organisation.Status,
        ApplicationReference: organisation.ApplicationReference,
        OrganisationName: organisation.OrganisationName,
        EoriNumber: organisation.EoriNumber,
        UkAcsReference: organisation.UkAcsReference,
        CreatedAt: organisation.CreatedAt,
        UpdatedAt: organisation.UpdatedAt
      })
    })
  })

  describe('toJson', () => {
    it('returns a plain object', () => {
      const organisation = new Organisation()
      organisation.OrganisationId = 'the-id'

      const actual = organisation.toJson()

      expect(actual).toEqual({
        OrganisationId: 'the-id',
        Description: organisation.Description,
        Status: organisation.Status,
        ApplicationReference: organisation.ApplicationReference,
        OrganisationName: organisation.OrganisationName,
        EoriNumber: organisation.EoriNumber,
        UkAcsReference: organisation.UkAcsReference,
        CreatedAt: organisation.CreatedAt,
        UpdatedAt: organisation.UpdatedAt
      })
    })
  })
})
