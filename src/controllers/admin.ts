import { NextFunction, Response, Request } from "express";
import Product from "../models/product";
import Products from "../models/products";


export const getAddProduct = (req:Request, res:Response, next:NextFunction) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product', 
        path: '/admin/edit-product'});
};
export const postAddProduct = async (req:Request, res:Response, next:NextFunction) => {
    const product = new Product({
        title: req.body.title, 
        description: req.body.description, 
        price: Number(req.body.price), 
        imgSrc: req.body.imgsrc});
    await Products.add(product);
    res.redirect('/');
};
export const getAdminProducts = async (req:Request, res:Response, next:NextFunction) => {
    res.render('admin/products', {
        products: await Products.fetchAll(), 
        docTitle: 'Admin Products', 
        path: '/admin/products'
    });
};
export const getEditProduct = async (req:Request, res:Response, next:NextFunction) => {
    const id = req.params.id;
    const product = await Products.get(id);
    res.render('admin/edit-product', {
        docTitle: 'Edit product', 
        path: '/admin/edit-product',
        product: product});
};
export const postEditProduct = async (req:Request, res:Response, next:NextFunction) => {
    const id = req.params.id;
    const product = new Product({
        id: id,
        title: req.body.title, 
        description: req.body.description, 
        price: Number(req.body.price), 
        imgSrc: req.body.imgsrc});

    await Products.update(product);
    res.redirect('/admin/products');
};
export const postDeleteProduct = async (req:Request, res:Response, next:NextFunction) => {
    const id = req.params.id;
    await Products.remove(id);
    res.redirect('/admin/products');
}