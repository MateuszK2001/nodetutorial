import { Model, Optional, DataTypes, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, BelongsToGetAssociationMixin, Association, HasManyAddAssociationsMixin } from 'sequelize';
import TutorialSequelize from '../util/database';
import Product from './product';
import User from './user';


export interface OrderAttributes{
    id:number;
    ownerId:number;
}
interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes{
    id!:number;
    ownerId!:number;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getProducts!: HasManyGetAssociationsMixin<Product>;
    public addProduct!: HasManyAddAssociationMixin<Product, number>;
    public addProducts!: HasManyAddAssociationsMixin<Product, number>;
    public hasProduct!: HasManyHasAssociationMixin<Product, number>;
    public countProducts!: HasManyCountAssociationsMixin;
    public createProduct!: HasManyCreateAssociationMixin<Product>;
    public getOwner!: BelongsToGetAssociationMixin<User>;
    
    public readonly products?: Product[]; // Note this is optional since it's only populated when explicitly requested in code
    public readonly owner?: User;

    public static associations: {
        products: Association<Order, Product>;
        owner: Association<Order, User>;
    };
}
Order.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ownerId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
},{
    sequelize: TutorialSequelize,
    tableName: 'orders',
});



export default Order;

