import { IsString, IsBoolean, IsDateString } from 'class-validator'
import { classToPlain, plainToClass } from 'class-transformer'
import { CustomerApiKeyEncryption } from '../utils/customerApiKeyEncryption'

export class CustomerApiKey {
  @IsString()
    CustomerApiKeyId: string

  @IsString()
    Secret: string

  @IsBoolean()
    Enabled: boolean

  @IsString()
    Description: string

  @IsString()
    OrganisationId: string

  @IsDateString()
    CreatedAt: string

  @IsDateString()
    UpdatedAt: string

  @IsString()
    ApiGatewayId: string

  @IsString()
    UsagePlanId: string

  Saved: boolean

  constructor () {
    this.CustomerApiKeyId = ''
    this.ApiGatewayId = ''
    this.UsagePlanId = ''
    this.Secret = ''
    this.Enabled = false
    this.Description = ''
    this.OrganisationId = ''
    this.CreatedAt = new Date().toISOString()
    this.UpdatedAt = new Date().toISOString()
    this.Saved = false
  }

  static fromItem (plainObject: any): CustomerApiKey {
    delete plainObject.Saved

    return plainToClass(CustomerApiKey, plainObject)
  }

  static fromNestedItem (plainObject: any): CustomerApiKey {
    const apiKey = new CustomerApiKey()

    apiKey.CustomerApiKeyId = plainObject.CustomerApiKeyId.S
    apiKey.Secret = plainObject.Secret.S
    apiKey.Enabled = plainObject.Enabled.BOOL
    apiKey.Description = plainObject.Description.S
    apiKey.OrganisationId = plainObject.OrganisationId.S
    apiKey.CreatedAt = plainObject.CreatedAt.S
    apiKey.UpdatedAt = plainObject.UpdatedAt.S
    apiKey.ApiGatewayId = plainObject.ApiGatewayId?.S
    apiKey.Saved = true

    return apiKey
  }

  toItem (): any {
    const item = classToPlain(this)
    delete item.Saved

    return item
  }

  async toApiGatewayItem (): Promise<any> {
    const usagePlanId = process.env.USAGE_PLAN_ID

    return {
      id: usagePlanId,
      name: this.CustomerApiKeyId,
      value: await new CustomerApiKeyEncryption().decrypt(this.Secret),
      description: this.Description,
      enabled: this.Enabled,
      tags: {
        customer: 'fpo'
      }
    }
  }

  async toJson (): Promise<any> {
    const decryptedJson = await this.toDecryptedJson()

    return {
      ...decryptedJson,
      Secret: `****${decryptedJson.Secret.slice(-4)}`

    }
  }

  async toDecryptedJson (): Promise<any> {
    const encryption = new CustomerApiKeyEncryption()
    return {
      ...this.toItem(),
      Secret: await encryption.decrypt(this.Secret)
    }
  }
}
