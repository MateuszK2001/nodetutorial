import { Router, NextFunction, Response, Request } from "express";
import Product from "../models/product";
import CartHelper from "../models/cartHelper";
import { IUserPopulated } from "../models/User";
import Order, { IOrder } from "../models/order";
import { renderHelper } from "../util/ResponseHelper";

//// USERS

export const getIndex = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();
    renderHelper(req, res, 'shop/index',{
        products: products,
        docTitle: 'My Shop',
    });
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();
    renderHelper(req, res, 'shop/product-list',{
        products: products,
        docTitle: 'Products',
    });
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        console.log("ERROR: shop: getProduct --- product not found");
        res.redirect('/');
        return;
    }
    renderHelper(req, res, 'shop/product-detail',{
        product: await product,
        docTitle: product.title,
    });
};

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    const user = (await req.user!
        .populate('cart.products.productId')
        .execPopulate()) as IUserPopulated;
    const cartProducts = user.cart.products;
    const price = CartHelper.countPrice(cartProducts);

    renderHelper(req, res, 'shop/cart',{
        docTitle: 'My Cart',
        products: cartProducts,
        price: price
    });
};
export const postCart = async (req: Request, res: Response, next: NextFunction) => {
    const id =  req.body.productId;
    const product = await Product.findById(id);
    if(!product){
        console.log("ERROR: shop: postCart --- product not found");
        res.redirect('/');
        return;
    }
    await req.user!.addToCart(product);
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
    const id = req.body.id;
    await req.user!.removeFromCartOne(id);
    res.redirect("/cart");
}
export const postCartDeleteItems = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.id;
    await req.user!.removeFromCartAll(id);
    res.redirect("/cart");
}

export const postCreateOrder = async (req: Request, res: Response, next: NextFunction) => {
    const user = await req.user!.populate('cart.products.productId').execPopulate() as IUserPopulated;

    await Order.create({
        userId: req.user!._id,
        products: user.cart.products.map(p=>({
            cnt: p.cnt,
            product: {
                price: p.productId.price,
                productId: p.productId._id,
                title: p.productId.title
            },
        })),
        price: CartHelper.countPrice(user.cart.products)
    } as IOrder);
    await user.removeFromCartAll();
    res.redirect('/orders');
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find({userId: req.user!.id})
        // .populate('products.product.productId')
        .exec();


    renderHelper(req, res, 'shop/orders',{
        orders: orders, 
        docTitle: 'My orders',
    });
};