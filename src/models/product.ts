import path from 'path';
import Cart from './cart';
import TutorialSequelize from '../util/database';
import { Model, DataTypes, Optional, HasOneGetAssociationMixin, Association } from 'sequelize';
import User from './user';
import CartItem from './cart-item';
import OrderItem from './order-item';
import Order from './order';


export interface ProductAttributes {
    id: number,
    title: string,
    price: number,
    description: string,
    imageUrl?: string,
    ownerId: number
}
interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}


class Product extends Model<ProductAttributes, ProductCreationAttributes>
    implements ProductAttributes {
    public id!: number;
    public title!: string;
    public price!: number;
    public description!: string;
    public imageUrl!: string;
    public ownerId!: number;

    public getOwner!: HasOneGetAssociationMixin<User>;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly owner?: User;
    public readonly cartItem?: CartItem;
    public readonly orderItem?: OrderItem;
    public static associations: {
        owner: Association<User, User>;
    }; 
}
Product.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.TEXT,
        defaultValue: 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    tableName: 'products',
    modelName: 'product',
    sequelize: TutorialSequelize 
});

Product.belongsTo(User, {
    targetKey: 'id',
    foreignKey: 'ownerId',
    constraints: true,
    onDelete: 'CASCADE',
    as: 'owner'
});
Product.belongsToMany(Cart,{
    sourceKey: 'id',
    targetKey: 'id',
    foreignKey: 'productId',
    otherKey: 'cartId',
    uniqueKey: 'id',  
    through: 'cartItem',
});
Product.belongsToMany(Order,{
    sourceKey: 'id',
    targetKey: 'id',
    foreignKey: 'productId',
    otherKey: 'orderId',
    uniqueKey: 'id',  
    through: 'orderItem',
});
export default Product;