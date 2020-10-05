import { Router } from "express";
import * as ShopController from "../controllers/shop";
import isAuth from "../../middleware/isAuth";
const shopRouter = Router();

shopRouter.get('/', ShopController.getIndex);
shopRouter.get('/products', ShopController.getProducts);
shopRouter.get('/products/:id', ShopController.getProduct);
shopRouter.get('/cart', isAuth, ShopController.getCart);
shopRouter.post('/cart', isAuth, ShopController.postCart);
shopRouter.post('/cart-delete-item', isAuth, ShopController.postCartDeleteItem);
shopRouter.post('/cart-delete-items', isAuth, ShopController.postCartDeleteItems);
shopRouter.get('/orders', isAuth, ShopController.getOrders);
shopRouter.post('/create-order', isAuth, ShopController.postCreateOrder);
// // shopRouter.get('/checkout', ShopController.getCheckout);

export default shopRouter;