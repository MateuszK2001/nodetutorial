import { Router } from "express";
import * as AdminController from "../controllers/admin";

const adminRouter = Router();

adminRouter.get('/add-product', AdminController.getAddProduct);
adminRouter.get('/products', AdminController.getAdminProducts);
adminRouter.post('/add-product', AdminController.postAddProduct);
adminRouter.post('/delete-product/:id', AdminController.postDeleteProduct)
adminRouter.get('/edit-product/:id', AdminController.getEditProduct)
adminRouter.post('/edit-product/:id', AdminController.postEditProduct)

export default adminRouter;