import ShoppingList from "../database/models/shoppingList";
import { ShoppingListItemDto } from "../dtos/ShoppingListItemDto";
import { getAStock, updateStock } from "./stock.service";





export const getUserShoppingItems = async (
    userId: number,
  ): Promise<ShoppingListItemDto[]> => {
    try {
      const items = await ShoppingList.findAll({
        where: { userid: userId },
      });
  
      const itemDTOs: ShoppingListItemDto[] = items.map((items) => {
        return new ShoppingListItemDto(
        items.id,
        items.itemid,
        items.itemName,
        items.quantity,
        items.unit,
        items.userid
        );
      });
  
      return itemDTOs;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      throw new Error('Server error, check server console for more information');
    }
};

export const createItem = async (
    itemDto: ShoppingListItemDto,
  ): Promise<void> => {
    try {
      await ShoppingList.create({
        itemId: itemDto.itemId,
        itemName: itemDto.itemName,
        quantity: itemDto.quantity,
        unit: itemDto.unit,
        userid: itemDto.userid,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      throw new Error('Server error, check server console for more information');
    }
};

export const deleteItem = async (
    itemId: number,
  ): Promise<void> => {
    try {
      await ShoppingList.destroy({
        where: { id: itemId },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      throw new Error('Server error, check server console for more information');
    }
};

export const modifyItem = async (
    itemDto: ShoppingListItemDto,
  ): Promise<void> => {
    try {
      const item = await ShoppingList.findByPk(itemDto.id);
  
      if (!item) {
        throw new Error('Item not found');
      }
  
      item.itemName = itemDto.itemName;
      item.quantity = itemDto.quantity;
      item.unit = itemDto.unit;
        
      await item.save();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      throw new Error('Server error, check server console for more information');
    }
};

export const addNewStock = async (
    id: number,
): Promise<void> => {

    try {
        const item = await ShoppingList.findByPk(id);

        if(!item){
            throw new Error('Item not found');
        }
        const stock = await getAStock(item.itemid);

        stock.quantity = item.quantity;
        
        await updateStock(stock);

    } catch (error) {
        if (error instanceof Error) {
        console.log(error);
        }
        throw new Error('Server error, check server console for more information');
    }

}

