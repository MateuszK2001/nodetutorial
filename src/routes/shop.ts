import { Router } from "express";
import * as ShopController from "../controllers/shop";
const shopRouter = Router();

shopRouter.get('/', ShopController.getIndex);
shopRouter.get('/products', ShopController.getProducts);
shopRouter.get('/products/:id', ShopController.getProduct);
shopRouter.get('/cart', ShopController.getCart);
shopRouter.post('/cart', ShopController.postCart);
shopRouter.post('/cart-delete-item', ShopController.postCartDeleteItem);
shopRouter.post('/cart-delete-items', ShopController.postCartDeleteItems);
// shopRouter.get('/checkout', ShopController.getCheckout);
shopRouter.get('/orders', ShopController.getOrders);
shopRouter.post('/create-order', ShopController.postCreateOrder);
export default shopRouter;