import { IsString, IsDateString } from 'class-validator'
import { classToPlain, plainToClass } from 'class-transformer'

export class Organisation {
  @IsString()
    OrganisationId: string

  @IsString()
    Status: string

  @IsString()
    Description: string

  @IsDateString()
    CreatedAt: string

  @IsDateString()
    UpdatedAt: string

  Saved: boolean

  constructor () {
    this.OrganisationId = ''
    this.Description = ''
    this.CreatedAt = new Date().toISOString()
    this.UpdatedAt = new Date().toISOString()
    this.Status = 'Unregistered'
    this.Saved = false
  }

  static fromItem (plainObject: any): Organisation {
    delete plainObject.Saved

    return plainToClass(Organisation, plainObject)
  }

  static fromNestedItem (plainObject: any): Organisation {
    const user = new Organisation()

    user.OrganisationId = plainObject.OrganisationId.S
    user.CreatedAt = plainObject.CreatedAt.S
    user.UpdatedAt = plainObject.UpdatedAt.S
    user.Status = plainObject.Status.S
    user.Saved = true
    return user
  }

  toItem (): any {
    const item = classToPlain(this)
    delete item.Saved

    return item
  }

  toJson (): any {
    return this.toItem()
  }
}
