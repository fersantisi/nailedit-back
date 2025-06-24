import Stock from "../database/models/Stock";
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