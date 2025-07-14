import { promises } from "dns";
import ReservedStock from "../database/models/ReservedStock";
import Stock from "../database/models/Stock";
import { ReserveStockDto } from "../dtos/ReserveStockDto";
import { StockDto } from "../dtos/StockDto";

export const getUserStock = async (
    userId: number,
  ): Promise<StockDto[]> => {
    try {
      const stock = await Stock.findAll({
        where: { userid: userId },
      });
  
      const stockDTOs: StockDto[] = stock.map((stock) => {
        return new StockDto(
        stock.id,
        stock.itemName,
        stock.quantity,
        stock.unit,
        stock.reserved,
        stock.userid
        );
      });
  
      return stockDTOs;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      throw new Error('Server error, check server console for more information');
    }
};

export const createStock = async (
    stockDto: StockDto,
  ): Promise<void> => {
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

export const deleteStock = async (
    stockId: number,
  ): Promise<void> => {
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

export const updateStock = async (
    stockDto: StockDto,
  ): Promise<void> => {
    try {
      const stock = await Stock.findByPk(stockDto.id);
  
      if (!stock) {
        throw new Error('Stock not found');
      }
  
      stock.itemName = stockDto.itemName;
      stock.quantity = stockDto.quantity;
      stock.unit = stockDto.unit;
      stock.reserved = stockDto.reserved;
  
      await stock.save();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      throw new Error('Server error, check server console for more information');
    }
};

export const getAllProjectStock = async (
    projectId: number,
  ): Promise<ReserveStockDto[]> => {
    try {
      const reservedStock = await ReservedStock.findAll({
        where: { projectId: projectId },
      });
      const reservedStockDTOs: ReserveStockDto[] = reservedStock.map((reserved) => {
        return new ReserveStockDto(
          reserved.id,
          reserved.stockId,
          reserved.projectId,
          reserved.quantity
        );
      });
      return reservedStockDTOs;
    } catch (error) { 
      if (error instanceof Error) {
        console.log(error);
      }
      throw new Error('Server error, check server console for more information');
    }
}

export const reserveStock = async (
    reserveDto: ReserveStockDto,
  ): Promise<void> => {
    try {
      
      const stock = await Stock.findByPk(reserveDto.stockId);
      if (!stock) {
        throw new Error('Stock not found');
      }
      if (stock.quantity < reserveDto.quantity + stock.reserved) {
        throw new Error('Insufficient stock quantity');
      }

      stock.reserved += reserveDto.quantity;
      await stock.save();


      await ReservedStock.create({
        stockId: reserveDto.stockId,
        projectId: reserveDto.projectId,
        quantity: reserveDto.quantity,
      });

    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      throw new Error('Server error, check server console for more information');
    }
}

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
}

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
      if (stock.quantity < reserveDto.quantity + stock.reserved - reservedStock.quantity) {
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
}

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

      if (reservedStock.quantity === quantity) {
        await ReservedStock.destroy({ 
          where: { id: reservedStockId },
        });
      }else {
        await reservedStock.save();
      }

      await stock.save();

    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      throw new Error('Server error, check server console for more information');
    }
}

export const getAStock = async (
  id:number
):Promise<StockDto> => {
  try {

    const stock = await Stock.findByPk(id);

      if (!stock) {
        throw new Error('Stock not found');
      }


      const stockDto: StockDto = new StockDto(
        stock.id,
        stock.itemName,
        stock.quantity,
        stock.unit,
        stock.reserved,
        stock.userid
      );

      return stockDto;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
}