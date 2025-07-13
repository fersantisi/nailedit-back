import e, { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { getTokenPayload } from '../services/token.service';
import { StockDto } from '../dtos/StockDto';
import { ReserveStockDto } from '../dtos/ReserveStockDto';
import {
  createStock,
  deleteStock,
  getAllProjectStock,
  getUserStock,
  reserveStock,
  unreserveStock,
  updateReservedStock,
  updateStock,
  useReservedStock,
} from '../services/stock.service';

export const getAllProjectReservedStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = req.params.id;
    const projectIdNumber = +projectId;

    const reservedStock: ReserveStockDto[] =
      await getAllProjectStock(projectIdNumber);
    res.status(200).json(reservedStock);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getAllStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const stock: StockDto[] = await getUserStock(userId);

    res.status(200).json(stock);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const createNewStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = await getTokenPayload(req.cookies.authToken).userId;
    const { itemName, quantity, unit } = req.body;

    const stockDto = new StockDto(0, itemName, quantity, unit, 0, userId);

    await validateOrReject(stockDto);

    await createStock(stockDto);

    res.status(201).json({
      message: 'Stock created',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const deleteAStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const stockId = +req.params.id;

    await deleteStock(stockId);

    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export const updateAStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const stockId = +req.params.id;
    const { itemName, quantity, unit } = req.body;

    const stockDto = new StockDto(stockId, itemName, quantity, unit, 0, 0);

    await validateOrReject(stockDto);

    await updateStock(stockDto);

    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const createAReservedStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const stockId = +req.params.id;
    const projectId = +req.params.projectId;
    const { quantity } = req.body;

    const reserveDto = new ReserveStockDto(0, stockId, projectId, quantity);

    await reserveStock(reserveDto);

    res.status(201).json({
      message: 'Reserved Stock created',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};
export const deleteAReservedStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reservedStockId = +req.params.id;

    await unreserveStock(reservedStockId);

    res.status(200).json({ message: 'Reserve deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export const updateAReservedStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reservedStockId = +req.params.id;
    const { quantity } = req.body;

    const reserveDto = new ReserveStockDto(reservedStockId, 0, 0, quantity);

    await validateOrReject(reserveDto);

    const reservedStock = await updateReservedStock(reserveDto);

    res.status(200).json(reservedStock);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const useAReservedStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reservedStockId = +req.params.id;

    const { quantity } = req.body;

    useReservedStock(reservedStockId, quantity);

    res.status(200).json({ message: 'Reserved stock used successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};
