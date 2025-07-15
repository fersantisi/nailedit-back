import ReservedStock from '../database/models/ReservedStock';
import Stock from '../database/models/Stock';
import { ReserveStockDto } from '../dtos/ReserveStockDto';
import { StockDto } from '../dtos/StockDto';
import { UpdateStockDto } from '../dtos/UpdateStockDto';
import { ReserveStockWithItemDto, StockItemDto } from '../dtos/ReserveStockWithItemDto';

// Helper function to calculate actual reserved quantity for a stock item
export const calculateReservedQuantity = async (
  stockId: number,
): Promise<number> => {
  try {
    const reservedStocks = await ReservedStock.findAll({
      where: { stockId: stockId },
    });

    return reservedStocks.reduce(
      (total, reserved) => total + reserved.quantity,
      0,
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const getUserStock = async (userId: number): Promise<StockDto[]> => {
  try {
    const stock = await Stock.findAll({
      where: { userid: userId },
    });

    // Calculate correct reserved quantities for each stock item
    const stockDTOs: StockDto[] = await Promise.all(
      stock.map(async (stockItem) => {
        const actualReservedQuantity = await calculateReservedQuantity(
          stockItem.id,
        );

        return new StockDto(
          stockItem.id,
          stockItem.itemName,
          stockItem.quantity,
          stockItem.unit,
          actualReservedQuantity, // Use calculated reserved quantity
          stockItem.userid,
        );
      }),
    );

    return stockDTOs;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const createStock = async (stockDto: StockDto): Promise<void> => {
  try {
    await Stock.create({
      itemName: stockDto.itemName,
      quantity: stockDto.quantity,
      unit: stockDto.unit,
      reserved: stockDto.reserved,
      userid: stockDto.userid,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const deleteStock = async (stockId: number): Promise<void> => {
  try {
    await Stock.destroy({
      where: { id: stockId },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const updateStock = async (stockDto: StockDto): Promise<void> => {
  try {
    const stock = await Stock.findByPk(stockDto.id);

    if (!stock) {
      throw new Error('Stock not found');
    }

    // Calculate actual reserved quantity from ReservedStock table
    const actualReservedQuantity = await calculateReservedQuantity(stockDto.id);

    // Validate that new quantity is not below currently reserved amount
    if (stockDto.quantity < actualReservedQuantity) {
      throw new Error(
        `Cannot reduce quantity below currently reserved amount (${actualReservedQuantity})`,
      );
    }

    // Update only user-provided fields
    stock.itemName = stockDto.itemName;
    stock.quantity = stockDto.quantity;
    stock.unit = stockDto.unit;

    // Set reserved field to calculated value from database
    stock.reserved = actualReservedQuantity;

    await stock.save();

    console.log(
      `Stock ${stockDto.id} updated: quantity=${stockDto.quantity}, reserved=${actualReservedQuantity}`,
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw error; // Re-throw the original error with its message
    }
    throw new Error('Server error, check server console for more information');
  }
};

// Overloaded version for UpdateStockDto (cleaner interface for updates)
export const updateStockWithDto = async (
  updateDto: UpdateStockDto,
): Promise<void> => {
  try {
    const stock = await Stock.findByPk(updateDto.id);

    if (!stock) {
      throw new Error('Stock not found');
    }

    // Calculate actual reserved quantity from ReservedStock table
    const actualReservedQuantity = await calculateReservedQuantity(
      updateDto.id,
    );

    // Validate that new quantity is not below currently reserved amount
    if (updateDto.quantity < actualReservedQuantity) {
      throw new Error(
        `Cannot reduce quantity below currently reserved amount (${actualReservedQuantity})`,
      );
    }

    // Update only user-provided fields
    stock.itemName = updateDto.itemName;
    stock.quantity = updateDto.quantity;
    stock.unit = updateDto.unit;

    // Set reserved field to calculated value from database
    stock.reserved = actualReservedQuantity;

    await stock.save();

    console.log(
      `Stock ${updateDto.id} updated: quantity=${updateDto.quantity}, reserved=${actualReservedQuantity}`,
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw error; // Re-throw the original error with its message
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const getAllProjectStock = async (
  projectId: number,
): Promise<ReserveStockWithItemDto[]> => {
  try {
    const reservedStock = await ReservedStock.findAll({
      where: { projectId: projectId },
      include: [
        {
          model: Stock,
          as: 'stock',
          attributes: ['id', 'itemName', 'unit', 'quantity', 'reserved'],
        },
      ],
    });
    
    const reservedStockDTOs: ReserveStockWithItemDto[] = reservedStock.map(
      (reserved) => {
        const stockItemDto = new StockItemDto(
          reserved.stock.id,
          reserved.stock.itemName,
          reserved.stock.unit,
          reserved.stock.quantity,
          reserved.stock.reserved,
        );

        return new ReserveStockWithItemDto(
          reserved.id,
          reserved.stockId,
          reserved.projectId,
          reserved.quantity,
          stockItemDto,
        );
      },
    );
    return reservedStockDTOs;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const reserveStock = async (
  reserveDto: ReserveStockDto,
): Promise<void> => {
  try {
    const stock = await Stock.findByPk(reserveDto.stockId);
    if (!stock) {
      throw new Error('Stock not found');
    }

    // Calculate actual reserved quantity from ReservedStock table
    const currentReservedQuantity = await calculateReservedQuantity(
      reserveDto.stockId,
    );

    if (stock.quantity < reserveDto.quantity + currentReservedQuantity) {
      throw new Error('Insufficient stock quantity');
    }

    // Update the stock reserved field to reflect new total
    stock.reserved = currentReservedQuantity + reserveDto.quantity;
    await stock.save();

    await ReservedStock.create({
      stockId: reserveDto.stockId,
      projectId: reserveDto.projectId,
      quantity: reserveDto.quantity,
    });

    console.log(
      `Reserved ${reserveDto.quantity} units of stock ${reserveDto.stockId} for project ${reserveDto.projectId}. Total reserved: ${stock.reserved}`,
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw error; // Re-throw the original error with its message
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const unreserveStock = async (
  reservedStockId: number,
): Promise<void> => {
  try {
    const reservedStock = await ReservedStock.findByPk(reservedStockId);
    if (!reservedStock) {
      throw new Error('Reserved stock not found');
    }
    const stock = await Stock.findByPk(reservedStock.stockId);
    if (!stock) {
      throw new Error('Stock not found');
    }
    stock.reserved -= reservedStock.quantity;
    await stock.save();
    await ReservedStock.destroy({
      where: { id: reservedStockId },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const updateReservedStock = async (
  reserveDto: ReserveStockDto,
): Promise<void> => {
  try {
    const reservedStock = await ReservedStock.findByPk(reserveDto.id);
    if (!reservedStock) {
      throw new Error('Reserved stock not found');
    }
    const stock = await Stock.findByPk(reservedStock.stockId);
    if (!stock) {
      throw new Error('Stock not found');
    }
    if (
      stock.quantity <
      reserveDto.quantity + stock.reserved - reservedStock.quantity
    ) {
      throw new Error('Insufficient stock quantity');
    }

    stock.reserved += reserveDto.quantity - reservedStock.quantity;
    await stock.save();

    reservedStock.quantity = reserveDto.quantity;
    await reservedStock.save();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const useReservedStock = async (
  reservedStockId: number,
  quantity: number,
): Promise<void> => {
  try {
    const reservedStock = await ReservedStock.findByPk(reservedStockId);
    if (!reservedStock) {
      throw new Error('Reserved stock not found');
    }
    const stock = await Stock.findByPk(reservedStock.stockId);
    if (!stock) {
      throw new Error('Stock not found');
    }
    if (stock.quantity < quantity) {
      throw new Error('Insufficient stock quantity');
    }
    if (reservedStock.quantity < quantity) {
      throw new Error('Insufficient reserved stock quantity');
    }

    stock.reserved -= quantity;
    stock.quantity -= quantity;
    reservedStock.quantity -= quantity;

    if (reservedStock.quantity === 0) {
      await ReservedStock.destroy({
        where: { id: reservedStockId },
      });
    } else {
      await reservedStock.save();
    }

    await stock.save();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};
