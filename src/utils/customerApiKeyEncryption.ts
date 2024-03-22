import crypto from 'crypto'
import { Buffer } from 'buffer'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

export class CustomerApiKeyEncryption {
  async loadKey(): Promise<crypto.webcrypto.CryptoKey> {
    let base64Key: string

    if (process.env.ENCRYPTION_KEY === undefined) {
      base64Key = ''
    } else {
      base64Key = process.env.ENCRYPTION_KEY
    }

    const decodedKey = Buffer.from(base64Key, 'base64')
    const result = await crypto.subtle.importKey(
      'raw',
      decodedKey,
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    )

    return result
  }

  async encrypt(secret: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encoded = new TextEncoder().encode(secret)

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      await this.loadKey(),
      encoded
    )

    const encodedIv = Buffer.from(iv).toString('base64')
    const encodedEncrypted = Buffer.from(encrypted).toString('base64')

    return `${encodedIv}:${encodedEncrypted}`
  }

  async decrypt(encrypted: string): Promise<string> {
    const [encodedIv, encodedEncrypted] = encrypted.split(':')

    const iv = Buffer.from(encodedIv, 'base64')
    const encryptedSecret = Buffer.from(encodedEncrypted, 'base64')

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      await this.loadKey(),
      encryptedSecret
    )

    return new TextDecoder().decode(decrypted)
  }
}
