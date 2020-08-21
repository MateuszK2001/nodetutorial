import { NextFunction, Response, Request } from "express";
import Product from "../models/product";


export const getAddProduct = (req:Request, res:Response, next:NextFunction) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product', 
        path: '/admin/edit-product'});
};
export const postAddProduct = async (req:Request, res:Response, next:NextFunction) => {
    const imageUrl:string = String(req.body.imageUrl).trim();
    await req.user.createProduct({
        title: req.body.title, 
        description: req.body.description, 
        price: Number(req.body.price), 
        imageUrl: imageUrl.length>0?imageUrl:undefined,
    });
    res.redirect('/');
};
export const getAdminProducts = async (req:Request, res:Response, next:NextFunction) => {
    const products =  await req.user.getProducts();
    res.render('admin/products', {
        products: products, 
        docTitle: 'Admin Products', 
        path: '/admin/products'
    });
};
export const getEditProduct = async (req:Request, res:Response, next:NextFunction) => {
    const id = req.params.id;
    const product = (await req.user.getProducts({where: {id: id}})).find(()=>true);
    if(product === undefined){
        console.log("ERROR: admin: getEditProduct --- product not found");
        res.redirect('/');
        return;
    }
    res.render('admin/edit-product', {
        docTitle: 'Edit product', 
        path: '/admin/edit-product',
        product: product});
};
export const postEditProduct = async (req:Request, res:Response, next:NextFunction) => {
    const id = req.params.id;
    const product = (await req.user.getProducts({where: {id: id}})).find(()=>true);
    if(product === undefined){
        console.log("ERROR: admin: postEditProduct --- product not found");
        res.redirect('/');
        return;
    }
    await product.update({
        title: req.body.title, 
        description: req.body.description, 
        price: Number(req.body.price), 
        imageUrl: req.body.imageUrl
    });
    res.redirect('/admin/products');
};
export const postDeleteProduct = async (req:Request, res:Response, next:NextFunction) => {
    const id = req.params.id;
    const product = (await req.user.getProducts({where: {id: id}})).find(()=>true);
    if(product === undefined){
        console.log("ERROR: admin: postDeleteProduct --- product not found");
        res.redirect('/');
        return;
    }
    await product.destroy();
    res.redirect('/admin/products');
}