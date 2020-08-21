import { Model, Optional, DataTypes } from 'sequelize';
import TutorialSequelize from '../util/database';


export interface CartItemAttributes{
    id:number;
    cartId:number
    productId:number;
    cnt:number;
}
export interface CartItemCreationAttributes extends Optional<CartItemAttributes, "id"> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes{
    id!:number;
    cartId!: number;
    productId!: number;
    cnt!:number;
}
CartItem.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    cartId:{
        type: DataTypes.INTEGER,
    },
    productId:{
        type: DataTypes.INTEGER
    },
    cnt:{
        type: DataTypes.INTEGER
    }
},{
    sequelize: TutorialSequelize,
    tableName: 'cartitems',
    modelName: 'cartItem',
});

export default CartItem;

