import { Router } from 'express';
import {
  getAllProjectReservedStock,
  getAllStock,
  createNewStock,
  deleteAStock,
  updateAStock,
  createAReservedStock,
  deleteAReservedStock,
  updateAReservedStock,
  useAReservedStock,
} from '../controllers/stock.controller';

const router = Router();

// Stock management routes
router.get('/', getAllStock); // Get user's stock
router.post('/', createNewStock); // Create new stock item
router.put('/:id', updateAStock); // Update stock item
router.delete('/:id', deleteAStock); // Delete stock item

// Reserved stock routes
router.get('/projects/:id/reserved', getAllProjectReservedStock); // Get project's reserved stock
router.post('/:id/reserve/:projectId', createAReservedStock); // Reserve stock for project
router.delete('/reserved/:id', deleteAReservedStock); // Delete reserved stock by reservedStockId
router.put('/reserved/:id', updateAReservedStock); // Update reserved stock quantity
router.put('/reserved/:id/use', useAReservedStock); // Use/consume reserved stock

export default router;
