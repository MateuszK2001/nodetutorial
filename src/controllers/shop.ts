import { Router, NextFunction, Response, Request } from "express";
import Product from "../models/product";
import Cart from "../models/cart";
import { Console } from "console";
import CartItem from "../models/cart-item";
import Order from "../models/order";
import OrderItem from "../models/order-item";
import { Model } from "sequelize";

//// USERS

export const getIndex = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.findAll();
    res.render('shop/index', {
        products: products,
        docTitle: 'My Shop',
        path: '/shop/index'
    });
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.findAll();
    res.render('shop/product-list', {
        products: products,
        docTitle: 'Products',
        path: '/shop/product-list'
    });
};

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const price = products.reduce((price:number, product:Product)=>{
        return price+product.price*product.cartItem!.cnt;
    }, 0);
    res.render('shop/cart', {
        docTitle: 'My Cart',
        path: '/shop/cart',
        products: products,
        price: price
    });
};
export const postCart = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.productId;
    const cart = await req.user.getCart();
    let product = (await cart.getProducts({
        where: {
            id: id
        }
    })).find(()=>true);
    let cnt = 1;
    if(product === undefined){
        const productTmp = await Product.findByPk(id);
        if (productTmp === null) {
            console.log("ERROR: shop: postCart --- product not found");
            res.redirect('/');
            return;
        }
        product = productTmp;
    }
    else{
        cnt = product.cartItem?.cnt as number + 1;
    }
    await (await cart).addProduct(product, { /// It is correct way also for update
        through: {
            cnt: cnt
        },
    });
    res.redirect("/cart");
};
export const getCheckout = async (req: Request, res: Response, next: NextFunction) => {
    res.render('shop/checkout', {
        // products: await Product.fetchAll(), 
        docTitle: 'My Cart',
        path: '/shop/checkout'
    });
};


export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (product === null) {
        console.log("ERROR: shop: getProduct --- product not found");
        res.redirect('/');
        return;
    }
    res.render('shop/product-detail', {
        product: await product,
        docTitle: product.title,
        path: '/shop/products'
    });
};


export const postCartDeleteItem = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.id;
    const cart = await req.user.getCart();
    
    const product = await (await cart.getProducts({where:{id:id}})).find(()=>true);
    if (product === undefined) {
        console.log("ERROR: shop: postCartDeleteItem --- product not found");
        res.redirect('/');
        return;
    }
    const cartItem = product.cartItem!;
    cartItem.cnt--;
    if(cartItem.cnt > 0){
        await cartItem.save();
    }
    else{
        await cartItem.destroy();
    }
    res.redirect("/cart");
}
export const postCartDeleteItems = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.id;
    const cart = await req.user.getCart();
    
    const product = await (await cart.getProducts({where:{id:id}})).find(()=>true);
    if (product === undefined) {
        console.log("ERROR: shop: postCartDeleteItems --- product not found");
        res.redirect('/');
        return;
    }
    product.cartItem!.destroy();
    res.redirect("/cart");
}

export const postCreateOrder = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.id;
    const cart = await req.user.getCart();
    const cartProducts = await cart.getProducts();
    const newOrder = await req.user.createOrder();
    await OrderItem.bulkCreate(cartProducts.map(product=>({
        cnt: product.cartItem!.cnt,
        orderId: newOrder.id,
        productId: product.id
    })));
    await cart.setProducts([]);
    res.redirect('/order');
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    const orders = await req.user.getOrders({include: Product as typeof Model});
    res.render('shop/orders', {
        orders: orders, 
        docTitle: 'My orders',
        path: '/shop/orders'
    });
};