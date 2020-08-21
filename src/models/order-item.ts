import { Model, Optional, DataTypes } from 'sequelize';
import TutorialSequelize from '../util/database';


export interface OrderItemAttributes{
    id:number;
    orderId:number
    productId:number;
    cnt:number;
}
export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, "id"> {}

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes{
    id!:number;
    orderId!: number;
    productId!: number;
    cnt!:number;
}
OrderItem.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    orderId:{
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
    tableName: 'orderitems',
    modelName: 'orderItem',
});

export default OrderItem;

