import { Request, Response } from 'express';
import { createCustomerApiKeyService } from '../services/createCustomerApiKeyService';

export const apiKeyController = {
  createApiKey: async (req: Request, res: Response) => {
    try {
      const { customerId } = req.body;
      const { name } = req.body;
      const { value } = req.body;
      const { description } = req.body;

      if (!name) {
        return res.status(400).send({ message: 'Name is required' });
      }

      if (!description) {
        return res.status(400).send({ message: 'Description is required' });
      }

      const apiKeyDetails = await createCustomerApiKeyService.call(customerId, name, value, description);

      return res.status(201).send(apiKeyDetails);
    } catch (error) {
      console.error('Error creating API key:', error);
      return res.status(500).send({ message: 'Error creating API key' });
    }
  },

};

