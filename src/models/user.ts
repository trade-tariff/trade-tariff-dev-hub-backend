import { IsString, IsDateString } from 'class-validator'
import { classToPlain, plainToClass } from 'class-transformer'

export class User {
  @IsString()
    UserId: string

  @IsString()
    OrganisationId: string

  @IsDateString()
    CreatedAt: string

  @IsDateString()
    UpdatedAt: string

  Saved: boolean

  constructor () {
    this.UserId = ''
    this.OrganisationId = ''
    this.CreatedAt = new Date().toISOString()
    this.UpdatedAt = new Date().toISOString()
    this.Saved = false
  }

  static fromItem (plainObject: any): User {
    delete plainObject.Saved

    return plainToClass(User, plainObject)
  }

  static fromNestedItem (plainObject: any): User {
    const user = new User()

    user.UserId = plainObject.UserId.S
    user.OrganisationId = plainObject.OrganisationId.S
    user.CreatedAt = plainObject.CreatedAt.S
    user.UpdatedAt = plainObject.UpdatedAt.S
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
