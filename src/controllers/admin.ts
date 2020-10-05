import { NextFunction, Response, Request } from "express";
import Product, { IProduct } from "../models/product";
import { renderHelper, getValidationMsg } from "../util/ResponseHelper";
import User from "../models/User";
import { Types } from "mongoose";



export const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
    renderHelper(req, res, 'admin/edit-product', {
        docTitle: 'Add Product',
        path: 'admin/add-product'
    });
};
export const postAddProduct = async (req: Request, res: Response, next: NextFunction) => {
    const errors = getValidationMsg(req);
    if(errors){
        renderHelper(req, res.status(422), 'admin/edit-product', {
            docTitle: 'Add Product',
            path: 'admin/add-product',
            product:{
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                imageUrl: req?.file?.path,
            },
            ...errors,
        });
        return ;
    }
    await Product.create({
        title: req.body.title,
        price: Number(req.body.price),
        description: req.body.description,
        imageUrl: req?.file?.path || undefined,
        ownerId: req.user!._id
    });
    res.redirect('/');
};
export const getAdminProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({ownerId: req.user!._id});
    renderHelper(req, res, 'admin/products', {
        products: products,
        docTitle: 'Admin Products',
    });
};
export const getEditProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const product = await Product.findOne({_id: id, ownerId: req.user!._id});
    if (!product) {
        console.log("ERROR: admin: getEditProduct --- product not found");
        res.redirect('/admin/products');
        return;
    }

    renderHelper(req, res, 'admin/edit-product', {
        docTitle: 'Edit product',
        editingMode: true,
        product: product
    });
};
export const postEditProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const product = await Product.findOne({_id: id, ownerId: req.user!._id});
    if (!product) {
        console.log("ERROR: admin: postEditProduct --- product not found");
        res.redirect('/admin/products');
        return;
    }
    const errors = getValidationMsg(req);
    
    if(errors){
        return renderHelper(req, res, 'admin/edit-product', {
            docTitle: 'Edit product',
            editingMode: true,
            product: {
                _id: id,
                title: req.body.title,
                price: req.body.price,
                imageUrl: req?.file?.path,
                description: req.body.description
            },
            ...errors
        });
    }
    product.title = req.body.title;
    product.price = Number(req.body.price);
    product.description = req.body.description;
    product.imageUrl = req?.file?.path;
    await product.save();

    res.redirect('/admin/products');
};
export const postDeleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const product = await Product.findOne({ _id: id, ownerId: req.user!._id });
    if(!product){
        res.redirect('/admin/products');
        return;
    }
    await product.remove();
    await User.updateMany({},
        {$pull:{'cart.products': {'productId': new Types.ObjectId(id)}}},
        {multi: true});

    res.redirect('/admin/products');
}