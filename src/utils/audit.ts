import { IncomingHttpHeaders } from 'http'
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

export interface AuditLogEntry {
  userId: string;
  table: string;
  properties: any;
}

export const createAuditLogEntry = async (data: AuditLogEntry): Promise<void> => {
  const command = new PutCommand({
    TableName,
    Item: {
      userId: data.userId,
      createdAt: new Date().toISOString(),
      table: data.table,
      properties: data.properties,
    }
  })

  const response = await dynamodbClient.send(command)

  if (response.$metadata.httpStatusCode !== 201) {
    logger.error('Failed to create audit entry!')
  }
}
