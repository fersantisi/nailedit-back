import ShoppingList from "../database/models/shoppingList";
import { ShoppingListItemDto } from "../dtos/ShoppingListItemDto";
import { getAStock, updateStock } from "./stock.service";
import PDFDocument from "pdfkit";





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

export const getShoppingListPdf = async (
    userId: number
): Promise<Buffer> => {

  const items: ShoppingListItemDto[] = await getUserShoppingItems(userId);

  const doc = new PDFDocument({ margin: 30, size: 'A4' });

  const buffers: Uint8Array[] = [];

  
  doc.on('data', buffers.push.bind(buffers));
  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    doc.on('error', reject);

    doc.fontSize(18).text('Lista de Compras', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text('Ítem', 50, doc.y, { continued: true });
    doc.text('Cantidad', 250, doc.y, { continued: true });
    doc.text('Unidad', 350);
    doc.moveDown();

    items.forEach((item) => {
      doc.text(item.itemName, 50, doc.y, { continued: true });
      doc.text(item.quantity.toString(), 250, doc.y, { continued: true });
      doc.text(item.unit, 350);
    });

    doc.end();
  });
};