import { IsString, IsBoolean, IsDateString } from 'class-validator'
import { classToPlain, plainToClass } from 'class-transformer'

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

  Saved: boolean

  constructor () {
    this.CustomerApiKeyId = ''
    this.Secret = ''
    this.Enabled = false
    this.Description = ''
    this.CustomerId = ''
    this.CreatedAt = new Date().toISOString()
    this.UpdatedAt = new Date().toISOString()
    this.Saved = false
  }

  static fromItem (plainObject: any): CustomerApiKey {
    delete plainObject.Saved

    return plainToClass(CustomerApiKey, plainObject)
  }

  toItem (): any {
    const item = classToPlain(this)
    delete item.Saved

    return classToPlain(this)
  }
}
