import { Router } from 'express';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  updateClientBalance,
  getClientsWithExceededCredit,
} from '../controllers/clientController';

const router = Router();

// Client routes
router.get('/', getClients);
router.get('/exceeded-credit', getClientsWithExceededCredit);
router.get('/:id', getClientById);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);
router.patch('/:id/balance', updateClientBalance);

export default router; 