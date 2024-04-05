const apiDocs = {
  '/keys/{fpoId}': {
    post: {
      summary: 'Create a new API key',
      parameters: [
        {
          in: 'path',
          name: 'fpoId',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'The FPO ID for which to create an API key'
        }
      ],
      responses: {
        201: {
          description: 'API key created successfully'
        },
        400: {
          description: 'Invalid request'
        }
      }
    },
    get: {
      summary: 'List all API keys for a given FPO',
      parameters: [
        {
          in: 'path',
          name: 'fpoId',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'The FPO ID for which to list API keys'
        }
      ],
      responses: {
        200: {
          description: 'An array of API keys'
        },
        404: {
          description: 'FPO not found'
        }
      }
    }
  },
  '/keys/{fpoId}/{id}': {
    get: {
      summary: 'Get a specific API key',
      parameters: [
        {
          in: 'path',
          name: 'fpoId',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'The FPO ID'
        },
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'The API key ID'
        }
      ],
      responses: {
        200: {
          description: 'Details of the API key'
        },
        404: {
          description: 'API key not found'
        }
      }
    },
    patch: {
      summary: 'Update an existing API key',
      parameters: [
        {
          in: 'path',
          name: 'fpoId',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'The FPO ID'
        },
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'The API key ID to update'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                description: {
                  type: 'string',
                  description: 'New description of the API key'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'API key updated successfully'
        },
        400: {
          description: 'Invalid request'
        },
        404: {
          description: 'API key not found'
        }
      }
    },
    delete: {
      summary: 'Delete an API key',
      parameters: [
        {
          in: 'path',
          name: 'fpoId',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'The FPO ID'
        },
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'The API key ID to delete'
        }
      ],
      responses: {
        200: {
          description: 'API key deleted successfully'
        },
        404: {
          description: 'API key not found'
        }
      }
    }
  }
}

export default apiDocs
