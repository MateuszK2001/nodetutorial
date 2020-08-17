import { Router, NextFunction, Response, Request } from "express";
import Product from "../models/product";
import Products from "../models/products";
import Cart from "../models/cart";

//// USERS

export const getIndex = async (req:Request, res:Response, next:NextFunction) => {
    res.render('shop/index', {
        products: await Products.fetchAll(), 
        docTitle: 'My Shop', 
        path: '/shop/index'
    });
};

export const getProducts = async (req:Request, res:Response, next:NextFunction) => {
    res.render('shop/product-list', {
        products: await Products.fetchAll(), 
        docTitle: 'Products', 
        path: '/shop/product-list'
    });
};

export const getCart = async (req:Request, res:Response, next:NextFunction) => {
    const cartData = await Cart.getProducts();

    res.render('shop/cart', {
        // products: await Product.fetchAll(), 
        docTitle: 'My Cart', 
        path: '/shop/cart',
        cart: cartData
    });
};
export const postCart = async (req:Request, res:Response, next:NextFunction) => {
    const id = req.body.productId;
    const product = await Products.get(id);
    await Cart.add(product);
    res.redirect("/cart");
};
export const getCheckout = async (req:Request, res:Response, next:NextFunction) => {
    res.render('shop/checkout', {
        // products: await Product.fetchAll(), 
        docTitle: 'My Cart', 
        path: '/shop/checkout'
    });
};
export const getOrders = async (req:Request, res:Response, next:NextFunction) => {
    res.render('shop/orders', {
        // products: await Product.fetchAll(), 
        docTitle: 'My orders', 
        path: '/shop/orders'
    });
};

export const getProduct = async (req:Request, res:Response, next:NextFunction) => {
    const id = req.params.id;
    const product = await Products.get(id);
    res.render('shop/product-detail', {
        product: await product, 
        docTitle: product.title, 
        path: '/shop/products'
    });
};


export const postCartDeleteItem = async (req:Request, res:Response, next:NextFunction) => {
    const id = req.body.id;
    const product = await Products.get(id);
    await Cart.removeProduct(product);
    res.redirect("/cart");
}
export const postCartDeleteItems = async (req:Request, res:Response, next:NextFunction) => {
    const id = req.body.id;
    const product = await Products.get(id);
    await Cart.removeProducts(id, product.price);
    res.redirect("/cart");
}