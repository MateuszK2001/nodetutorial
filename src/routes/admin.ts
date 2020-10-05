import { Router } from "express";
import * as AdminController from "../controllers/admin";
import isAuth from "../../middleware/isAuth";
import { body,  } from "express-validator";

const adminRouter = Router();

adminRouter.get('/add-product', isAuth, AdminController.getAddProduct);

adminRouter.post('/add-product', isAuth, [
    body('title')
        .trim()
        .isString().withMessage('Title must be string')
        .isLength({min: 3}).withMessage('Title must be at least 3 characters'),
    body('image')
        .notEmpty().withMessage('Attached file in not an imamge'),
    body('price')
        .trim()
        .isFloat({min: 0}).withMessage('Price must be number greater or equal 0'),
    body('description')
        .trim()
        .isLength({min: 5, max: 400}).withMessage('Description should have between 5 and 400 characters')
], AdminController.postAddProduct);

adminRouter.get('/products', isAuth, AdminController.getAdminProducts);

adminRouter.get('/edit-product/:id', isAuth, AdminController.getEditProduct)

adminRouter.post('/delete-product/:id', isAuth, AdminController.postDeleteProduct)

adminRouter.post('/edit-product/:id', isAuth, [
    body('title')
        .trim()
        .isString().withMessage('Title must be string')
        .isLength({min: 3}).withMessage('Title must be at least 3 characters'),

    body('image')
        .notEmpty().withMessage('Attached file in not an image'),
    body('price')
        .trim()
        .isFloat({min: 0}).withMessage('Price must be number greater or equal 0'),
    body('description')
        .trim()
        .isLength({min: 5, max: 400}).withMessage('Description should have between 5 and 400 characters')
],  AdminController.postEditProduct)

export default adminRouter;