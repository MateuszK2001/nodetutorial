import express from 'express';
import bodyParser from 'body-parser';
import adminRouter from './routes/admin';
import shopRouter from './routes/shop';
import { resolve } from 'path';
import * as errorsController from './controllers/errors';
import TutorialDatabase from './util/database';
import Product from './models/product';
import User from './models/user';
import Cart from './models/cart';
import Order from './models/order';
import CartItem from './models/cart-item';
import OrderItem from './models/order-item';
import { Model } from 'sequelize';


declare global {
    namespace Express {
        interface Request {
            user: User
        }
    }
}

declare module 'sequelize'{
    interface HasManyAddAssociationMixinOptions{
        through?: any,
        raw?: string;
    }
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', resolve('views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(resolve('public')));

app.use(async (req, res, next)=>{
    const user = await User.findByPk(1);
    if(!user){
        console.log("ERROR: nie istnieje user!!!");
    }
    req.user = user!;
    next();
});
app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorsController.use404);

Order.belongsTo(User,{
    targetKey: 'id',
    foreignKey: 'ownerId',
    as: 'owner'
});
Order.belongsToMany(Product,{
    sourceKey: 'id',
    targetKey: 'id',
    foreignKey: 'orderId',
    otherKey: 'productId',
    uniqueKey: 'id',  
    through: {
        model: OrderItem as typeof Model,
    }
});

Cart.belongsTo(User,{
    targetKey: 'id',
    foreignKey: 'ownerId',
    as: 'owner'
});
Cart.belongsToMany(Product,{
    sourceKey: 'id',
    targetKey: 'id',
    foreignKey: 'cartId',
    otherKey: 'productId',
    uniqueKey: 'id',  
    through: {
        model: CartItem as typeof Model
    }
});

User.hasMany(Product,{
    sourceKey: 'id',
    foreignKey: 'ownerId',
});
User.hasMany(Order,{
    sourceKey: 'id',
    foreignKey: 'ownerId', 
});
User.hasOne(Cart,{
    sourceKey: 'id',
    foreignKey: 'ownerId' 
});


const start = async()=>{
    try {
        await TutorialDatabase.sync();
        let user = await User.findByPk(1);
        if(!user){
            user = await User.create({name:'Max', email:'duda@polska.pis'});
        }
        let cart = await user.getCart();
        if(!cart){
            cart = await user.createCart();
        }
        app.listen(3000);
    } catch (error) {
        console.log("ERROR", (error as Error).message);        
    }
};    
start();
