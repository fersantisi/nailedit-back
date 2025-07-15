import { Router } from 'express';
import {
  addItem,
  removeItem,
  updateItem,
  getShoppingList,
  addItemToStock,
  downloadShoppingListPdf,
} from '../controllers/shoppingList.controller';

const router = Router();

// Get user's shopping list
router.get('/', getShoppingList);

// Add item to shopping list
router.post('/', addItem);

// Update item in shopping list
router.put('/:id', updateItem);

// Remove item from shopping list
router.delete('/:id', removeItem);

// Convert shopping list item to stock
router.post('/:id/add-to-stock', addItemToStock);

// Download shopping list as PDF
router.get('/download/pdf', downloadShoppingListPdf);

export default router;
