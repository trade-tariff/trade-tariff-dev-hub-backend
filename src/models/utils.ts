export default function getFieldValue (plainObject: any, field: string): string {
  let fieldValue = ''
  if (Object.prototype.hasOwnProperty.call(plainObject, field)) {
    fieldValue = plainObject[field].S
  }
  return fieldValue
}
