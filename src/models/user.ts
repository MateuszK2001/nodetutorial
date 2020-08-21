import TutorialSequelize from '../util/database';
import {
    Model,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasOneGetAssociationMixin,
    HasOneCreateAssociationMixin,
    Association,
    Optional,
    HasManyAddAssociationsMixin
} from 'sequelize';
import Product from './product';
import Cart from './cart';
import Order from './order';


export interface UserAttributes {
    id: number,
    name: string,
    email: string,
}
interface UserCreationAttributes extends Optional<UserAttributes, "id"> { }


class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getCart!: HasOneGetAssociationMixin<Cart>;
    public createCart!: HasOneCreateAssociationMixin<Cart>;

    public getProducts!: HasManyGetAssociationsMixin<Product>;
    public addProduct!: HasManyAddAssociationMixin<Product, number>;
    public addProducts!: HasManyAddAssociationsMixin<Product, number>;
    public hasProduct!: HasManyHasAssociationMixin<Product, number>;
    public countProducts!: HasManyCountAssociationsMixin;
    public createProduct!: HasManyCreateAssociationMixin<Product>;
    
    public getOrders!: HasManyGetAssociationsMixin<Order>;
    public addOrder!: HasManyAddAssociationMixin<Order, number>;
    public addOrders!: HasManyAddAssociationsMixin<Order, number>;
    public hasOrder!: HasManyHasAssociationMixin<Order, number>;
    public countOrders!: HasManyCountAssociationsMixin;
    public createOrder!: HasManyCreateAssociationMixin<Order>;

    public readonly products?: Product[]; // Note this is optional since it's only populated when explicitly requested in code
    public readonly orderss?: Order[]; // Note this is optional since it's only populated when explicitly requested in code
    public readonly cart?: Cart; // Note this is optional since it's only populated when explicitly requested in code

    public static associations: {
        products: Association<User, Product>;
        orders: Association<User, Order>;
        cart: Association<User, Cart>;
    };
}
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users',
    sequelize: TutorialSequelize
});


export default User;