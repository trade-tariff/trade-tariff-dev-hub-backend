import { IsString, IsBoolean, IsDateString } from 'class-validator'
import { plainToClass } from 'class-transformer'

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
    CustomerId: string

  @IsDateString()
    CreatedAt: string

  @IsDateString()
    UpdatedAt: string

  constructor () {
    this.CustomerApiKeyId = ''
    this.Secret = ''
    this.Enabled = false
    this.Description = ''
    this.CustomerId = ''
    this.CreatedAt = new Date().toISOString()
    this.UpdatedAt = new Date().toISOString()
  }

  static fromItem (plainObject: any): CustomerApiKey {
    return plainToClass(CustomerApiKey, plainObject)
  }
}
