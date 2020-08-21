import { Model, Optional, DataTypes, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, Association, BelongsToGetAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin } from 'sequelize';
import TutorialSequelize from '../util/database';
import Product from './product';
import User from './user';


export interface CartAttributes{
    id:number,
    ownerId:number
}
interface CartCreationAttributes extends Optional<CartAttributes, "id"> {}

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes{
    id!: number;
    ownerId!: number;
    
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public removeProducts!: HasManyRemoveAssociationsMixin<Product, number>;
    public setProducts!: HasManySetAssociationsMixin<Product, number>;
    public getProducts!: HasManyGetAssociationsMixin<Product>;
    public addProduct!: HasManyAddAssociationMixin<Product, number>;
    public hasProduct!: HasManyHasAssociationMixin<Product, number>;
    public countProducts!: HasManyCountAssociationsMixin;
    public createProduct!: HasManyCreateAssociationMixin<Product>;
    public getOwner!: BelongsToGetAssociationMixin<User>;
    
    public readonly products?: Product[]; // Note this is optional since it's only populated when explicitly requested in code
    public readonly owner?: User;

    public static associations: {
        products: Association<Cart, Product>;
        owner: Association<Cart, User>;
    };
}
Cart.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ownerId:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    sequelize: TutorialSequelize,
    tableName: 'cart',
    // freezeTableName: true
})



export default Cart;
