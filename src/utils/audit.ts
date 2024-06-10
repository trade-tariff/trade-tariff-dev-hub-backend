import { randomBytes } from 'crypto'
import { type IncomingHttpHeaders } from 'http'
import { type Request } from 'express'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { logger } from '../config/logging'

const TableName = process.env.AUDIT_TABLE_NAME ?? ''

const dynamodbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT
})

export interface FrontendRequest extends Request {
  headers: IncomingHttpHeaders & {
    'X-User-Id'?: string
  }
}

interface AuditLogProperties {
  operation: 'create' | 'update' | 'delete'
  changedValue: {
    name: string
    value?: string
  }
}

export interface AuditLogEntry {
  userId: string
  table: string
  properties: AuditLogProperties
}

function randomString (length: number = 8): string {
  return randomBytes(length).toString('hex')
}

function getHash (): string {
  return `${new Date().toISOString()}-${randomString()}`
}

export const createAuditLogEntry = async (
  data: AuditLogEntry
): Promise<void> => {
  const command = new PutCommand({
    TableName,
    Item: {
      LogId: `${getHash()}`,
      CreatedAt: new Date().toISOString(),
      Properties: data.properties,
      Table: data.table,
      UserId: data.userId
    }
  })

  const response = await dynamodbClient.send(command)

  if (response.$metadata.httpStatusCode != 200) {
    logger.error('Failed to create audit entry!')
  }
}
