import { NextFunction, Response, Request } from "express";
import Product from "../models/product";
import { ObjectId } from "mongodb";



export const getAddProduct = (req:Request, res:Response, next:NextFunction) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product', 
        path: '/admin/edit-product'});
};
export const postAddProduct = async (req:Request, res:Response, next:NextFunction) => {
    const imageUrl:string = String(req.body.imageUrl).trim();
    const newProduct = new Product(
        req.body.title,
        Number(req.body.price), 
        req.body.description, 
        imageUrl.length>0?imageUrl:undefined,
        req.user._id!);
    await newProduct.save();
    res.redirect('/');
};
export const getAdminProducts = async (req:Request, res:Response, next:NextFunction) => {
    const products =  await Product.fetchAll();
    res.render('admin/products', {
        products: products, 
        docTitle: 'Admin Products', 
        path: '/admin/products'
    });
};
export const getEditProduct = async (req:Request, res:Response, next:NextFunction) => {
    const id = new ObjectId(req.params.id);
    const product = await Product.findById(id);
    if(!product){
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
    const id = new ObjectId(req.params.id);
    const product = new Product(
        req.body.title,
        Number(req.body.price),
        req.body.description,
        req.body.imageUrl,
        req.user._id!,
        id);
    await product.save();

    res.redirect('/admin/products');
};
export const postDeleteProduct = async (req:Request, res:Response, next:NextFunction) => {
    const id = new ObjectId(req.params.id);

    await Product.deleteById(id);
    res.redirect('/admin/products');
}