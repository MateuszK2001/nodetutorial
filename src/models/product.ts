import path from 'path';
import Cart from './cart';
import { getDb } from '../util/database';
import { Model, DataTypes, Optional, HasOneGetAssociationMixin, Association } from 'sequelize';
import User from './user';
import mongoConect from '../util/database';
import { Db, ObjectId } from 'mongodb';


class Product{
    _id?:ObjectId;
    userId:ObjectId;
    title:string;
    price:number;
    description:string;
    imageUrl:string|undefined;
    /**
     *
     */
    constructor(title:string,price:number,description:string,imageUrl:string|undefined, userId:ObjectId, id?:ObjectId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.userId = userId;
        this._id = id ? id : undefined;
    }
    static dataToProduct(data:any){
        return new Product(
            data.title,
            data.price,
            data.description,
            data.imageUrl,
            data.userId,
            data._id,
        );
    }
    static async fetchAll(){
        return await getDb().collection('products')
            .find()
            .map(p=>this.dataToProduct(p))
            .toArray();
    }
    static async findById(id:ObjectId){
        return this.dataToProduct( 
            await getDb().collection('products')
                .findOne({_id: id}));
    }
    static async deleteById(id:ObjectId){
        await User.removeProductFromCarts(id);
        return await getDb().collection('products')
          .deleteOne({_id:id});
    }  
    async save(){
        const db = getDb();
        if(!this.imageUrl) 
            this.imageUrl = 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';
        if(this._id){
            const results = await db.collection('products')
                .updateOne({_id: this._id}, {$set: this});
        }
        else{
            const results = await db.collection('products').insertOne(this);
            this._id = results.insertedId;
        }
    }
}
// export interface ProductAttributes {
//     id: number,
//     title: string,
//     price: number,
//     description: string,
//     imageUrl?: string,
//     ownerId: number
// }
// interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}


// class Product extends Model<ProductAttributes, ProductCreationAttributes>
//     implements ProductAttributes {
//     public id!: number;
//     public title!: string;
//     public price!: number;
//     public description!: string;
//     public imageUrl!: string;
//     public ownerId!: number;

//     public getOwner!: HasOneGetAssociationMixin<User>;
//     // timestamps!
//     public readonly createdAt!: Date;
//     public readonly updatedAt!: Date;

//     public readonly owner?: User;
//     public readonly cartItem?: CartItem;
//     public readonly orderItem?: OrderItem;
//     public static associations: {
//         owner: Association<User, User>;
//     }; 
// }
// Product.init({
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     price: {
//         type: DataTypes.DOUBLE,
//         allowNull: false,
//     },
//     imageUrl: {
//         type: DataTypes.TEXT,
//         defaultValue: 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
//         allowNull: false,
//     },
//     description: {
//         type: DataTypes.TEXT,
//         allowNull: false
//     },
//     ownerId: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     }
// },{
//     tableName: 'products',
//     modelName: 'product',
//     sequelize: TutorialSequelize 
// });

// Product.belongsTo(User, {
//     targetKey: 'id',
//     foreignKey: 'ownerId',
//     constraints: true,
//     onDelete: 'CASCADE',
//     as: 'owner'
// });
// Product.belongsToMany(Cart,{
//     sourceKey: 'id',
//     targetKey: 'id',
//     foreignKey: 'productId',
//     otherKey: 'cartId',
//     uniqueKey: 'id',  
//     through: 'cartItem',
// });
// Product.belongsToMany(Order,{
//     sourceKey: 'id',
//     targetKey: 'id',
//     foreignKey: 'productId',
//     otherKey: 'orderId',
//     uniqueKey: 'id',  
//     through: 'orderItem',
// });
export default Product;