
import path from 'path';
import Cart from './cart';
import { getDb } from '../util/database';
import { Model, DataTypes, Optional, HasOneGetAssociationMixin, Association } from 'sequelize';
import mongoConect from '../util/database';
import { Db, ObjectId, ObjectID } from 'mongodb';
import Product from './product';

class User{
    _id?: ObjectId;
    name: string;
    email: string;
    cart:Cart;
    /**
     *
     */
    constructor(name:string,email:string, id?:ObjectId, cart?:Cart) {
        this.name = name;
        this.email = email;
        this._id = id ? id : undefined;
        this.cart = cart?cart:new Cart();
    }

    async addOrder(){
        const db = getDb();
        const productsData = await this.cart.fetchProducts();
        const price = Cart.countPrice(productsData);

        await db.collection('orders').insertOne({
            userId: this._id,
            cart: this.cart,
            price: price});
        await this.removeFromCartAll();
    }
    async getOrders(){
        const db = getDb();
        const orders = await db.collection('orders').find({
            userId: this._id
        }).toArray();
        const productIds = Object.keys(orders.reduce((ids, order)=>{
            for(const product of order.cart.products){
                ids[product.productId] = true;
            }
            return ids;
        }, {})).map(p=>new ObjectId(p));
        const products = await db.collection('products').find({
            _id: {$in: productIds}
        }).toArray();
        const idToProduct = new Map<string, Product>(products.map(p=>[p._id.toHexString(), p]));
        const ordersWithProducts = orders.map(order=>({
            products: (order.cart as Cart).products.map(({productId, cnt})=>({
                product: idToProduct.get(productId.toHexString())!,
                cnt: cnt
            })),
            price: order.price,
            _id: order._id
        }));
        return ordersWithProducts;
    }

    async addToCart(productId:ObjectId){
        const index = this.cart.products.findIndex(a=>a.productId.equals(productId));
        if(index !== -1){
            this.cart.products[index].cnt++;
        }
        else{
            this.cart.products.push({
                productId: productId,
                cnt: 1
            });
        }
        const db = getDb();
        await db.collection('users').updateOne(
            {_id: this._id},
            {$set:{
                cart: this.cart
            }}
        );
    }
    async removeFromCartOne(productId:ObjectId){
        const index = this.cart.products.findIndex(a=>a.productId.equals(productId));
        if(index !== -1){
            this.cart.products[index].cnt--;
            if(this.cart.products[index].cnt === 0)
                this.cart.products.splice(index, 1);
        }
        else{
            throw 'ERROR - removeFromCartOne: id doesn\'t exist';
        }
        const db = getDb();
        await db.collection('users').updateOne(
            {_id: this._id},
            {$set:{
                cart: this.cart
            }}
        )
    }
    static async removeProductFromCarts(productId:ObjectId){
        const db = getDb();
        await db.collection('users').updateMany({},{
            $pull:{
                'cart.products': {productId: productId}
            }
        });
    }
    async removeFromCartAll(productId?:ObjectId){
        if(productId === undefined){
            const db = getDb();
            this.cart.products = [];
            await db.collection('users').updateOne(
                {_id: this._id},
                {$set:{
                    cart: this.cart
                }}
            );
            return;
        }
        const index = this.cart.products.findIndex(a=>a.productId.equals(productId));
        if(index !== -1){
            this.cart.products.splice(index, 1);
        }
        else{
            throw 'ERROR - removeFromCartOne: id doesn\'t exist';
        }
        const db = getDb();
        await db.collection('users').updateOne(
            {_id: this._id},
            {$set:{
                cart: this.cart
            }}
        )
    }
    static dataToUser(data:any){
        return new User(
            data.name,
            data.email,
            data._id,
            Cart.dataToCart(data.cart)
        );
    }
    static async fetchAll(){
        return await getDb().collection('users')
            .find()
            .map(p=>this.dataToUser(p))
            .toArray();
    }
    static async findById(id:ObjectId){
        return this.dataToUser( 
            await getDb().collection('users')
                .findOne({_id: id}));
    }
    static async deleteById(id:ObjectId){
        return await getDb().collection('users')
          .deleteOne({_id:id});
    }  
    async save(){
        const db = getDb();
        if(this._id){
            const results = await db.collection('users')
                .updateOne({_id: this._id}, {$set: this});
        }
        else{
            const results = await db.collection('users').insertOne(this);
            this._id = results.insertedId;
        }
    }
}


// export interface UserAttributes {
//     id: number,
//     name: string,
//     email: string,
// }
// interface UserCreationAttributes extends Optional<UserAttributes, "id"> { }


// class User extends Model<UserAttributes, UserCreationAttributes>
//     implements UserAttributes {
//     public id!: number;
//     public name!: string;
//     public email!: string;

//     // timestamps!
//     public readonly createdAt!: Date;
//     public readonly updatedAt!: Date;

//     public getCart!: HasOneGetAssociationMixin<Cart>;
//     public createCart!: HasOneCreateAssociationMixin<Cart>;

//     public getProducts!: HasManyGetAssociationsMixin<Product>;
//     public addProduct!: HasManyAddAssociationMixin<Product, number>;
//     public addProducts!: HasManyAddAssociationsMixin<Product, number>;
//     public hasProduct!: HasManyHasAssociationMixin<Product, number>;
//     public countProducts!: HasManyCountAssociationsMixin;
//     public createProduct!: HasManyCreateAssociationMixin<Product>;
    
//     public getOrders!: HasManyGetAssociationsMixin<Order>;
//     public addOrder!: HasManyAddAssociationMixin<Order, number>;
//     public addOrders!: HasManyAddAssociationsMixin<Order, number>;
//     public hasOrder!: HasManyHasAssociationMixin<Order, number>;
//     public countOrders!: HasManyCountAssociationsMixin;
//     public createOrder!: HasManyCreateAssociationMixin<Order>;

//     public readonly products?: Product[]; // Note this is optional since it's only populated when explicitly requested in code
//     public readonly orderss?: Order[]; // Note this is optional since it's only populated when explicitly requested in code
//     public readonly cart?: Cart; // Note this is optional since it's only populated when explicitly requested in code

//     public static associations: {
//         products: Association<User, Product>;
//         orders: Association<User, Order>;
//         cart: Association<User, Cart>;
//     };
// }
// User.init({
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
// }, {
//     tableName: 'users',
//     sequelize: TutorialSequelize
// });


export default User;