import { Router, NextFunction, Response, Request } from "express";
import Product from "../models/product";
import Cart from "../models/cart";
import { Console } from "console";
import { Model } from "sequelize";
import { ObjectId } from "mongodb";
import { userInfo } from "os";

//// USERS

export const getIndex = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.fetchAll();
    res.render('shop/index', {
        products: products,
        docTitle: 'My Shop',
        path: '/shop/index'
    });
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.fetchAll();
    res.render('shop/product-list', {
        products: products,
        docTitle: 'Products',
        path: '/shop/product-list'
    });
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id = new ObjectId(req.params.id);
    const product = await Product.findById(id);
    if (!product) {
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

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    const cart = req.user.cart;
    const cartProducts = await cart.fetchProducts();
    const price = Cart.countPrice(cartProducts);
    res.render('shop/cart', {
        docTitle: 'My Cart',
        path: '/shop/cart',
        products: cartProducts,
        price: price
    });
};
export const postCart = async (req: Request, res: Response, next: NextFunction) => {
    const id =  new ObjectId(req.body.productId);
    const product = await Product.findById(id);
    if(!product){
        console.log("ERROR: shop: postCart --- product not found");
        res.redirect('/');
        return;
    }
    await req.user.addToCart(product._id!);
    res.redirect("/cart");
};
// export const getCheckout = async (req: Request, res: Response, next: NextFunction) => {
//     res.render('shop/checkout', {
//         // products: await Product.fetchAll(), 
//         docTitle: 'My Cart',
//         path: '/shop/checkout'
//     });
// };





export const postCartDeleteItem = async (req: Request, res: Response, next: NextFunction) => {
    const id = new ObjectId(req.body.id);
    await req.user.removeFromCartOne(id);
    res.redirect("/cart");
}
export const postCartDeleteItems = async (req: Request, res: Response, next: NextFunction) => {
    const id = new ObjectId(req.body.id);
    await req.user.removeFromCartAll(id);
    res.redirect("/cart");
}

export const postCreateOrder = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.id;
    await req.user.addOrder();
    res.redirect('/orders');
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    const orders = await req.user.getOrders();
    res.render('shop/orders', {
        orders: orders, 
        docTitle: 'My orders',
        path: '/shop/orders'
    });
};