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
    FpoId: string

  @IsDateString()
    CreatedAt: string

  @IsDateString()
    UpdatedAt: string

  @IsString()
    ApiGatewayId: string | undefined

  Saved: boolean

  constructor () {
    this.CustomerApiKeyId = ''
    this.ApiGatewayId = ''
    this.Secret = ''
    this.Enabled = false
    this.Description = ''
    this.FpoId = ''
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
    apiKey.FpoId = plainObject.FpoId.S
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

  toJson (): any {
    return this.toItem()
  }

  async toDecryptedJson (): Promise<any> {
    const encryption = new CustomerApiKeyEncryption()
    return {
      ...this.toItem(),
      Secret: await encryption.decrypt(this.Secret)
    }
  }
}
