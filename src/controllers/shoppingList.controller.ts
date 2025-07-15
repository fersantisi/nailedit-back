import { Request, Response } from 'express';
import { getTokenPayload } from '../services/token.service';
import { ShoppingListItemDto } from '../dtos/ShoppingListItemDto';
import { validateOrReject } from 'class-validator';
import {
  addNewStock,
  createItem,
  deleteItem,
  getShoppingListPdf,
  getUserShoppingItems,
  modifyItem,
} from '../services/shoppingList.service';

export const addItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const { itemId, itemName, quantity, unit } = req.body;

    const itemDto = new ShoppingListItemDto(
      0,
      itemId,
      itemName,
      quantity,
      unit,
      userId,
    );

    await validateOrReject(itemDto);

    await createItem(itemDto);

    res.status(201).json({
      message: 'Item created',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const removeItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const { id } = req.params;

    await deleteItem(Number(id));

    res.status(200).json({
      message: 'Item removed',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const { id } = req.params;
    const { itemId, itemName, quantity, unit } = req.body;

    const itemDto = new ShoppingListItemDto(
      Number(id),
      itemId,
      itemName,
      quantity,
      unit,
      userId,
    );

    await validateOrReject(itemDto);

    await modifyItem(itemDto);

    res.status(200).json({ message: 'Item updated successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const getShoppingList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;

    const shoppingList: ShoppingListItemDto[] =
      await getUserShoppingItems(userId);

    res.status(200).json(shoppingList);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const addItemToStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    await addNewStock(Number(id));

    res.status(200).json({ message: 'Stock Added' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const downloadShoppingListPdf = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;

    const pdfBuffer = await getShoppingListPdf(userId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=lista-de-compras.pdf',
    );
    res.status(200).send(pdfBuffer);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};
