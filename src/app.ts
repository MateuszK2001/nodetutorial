import {config as dotenvConfig} from'dotenv';
dotenvConfig();

import { resolve } from 'path';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import adminRouter from './routes/admin';
import shopRouter from './routes/shop';
import User, { IUser } from './models/User';
import mongoose from 'mongoose';
import * as errorsController from './controllers/errors';
import authRouter from './routes/auth';
import session from 'express-session';
import * as Express from 'express';
import connectMongoSession from 'connect-mongodb-session';
const MongoDBStore = connectMongoSession(session);
import csrf from 'csurf';
import flash from 'connect-flash';
import sendgrid from '@sendgrid/mail';
import multer from 'multer';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            isLoggedIn: boolean;
            csrfToken: ()=>string; 
        }
        interface Session {
            isLoggedIn?: boolean,
            userId?:string;
        }
    }
}
const MONGODB_URI = process.env.MONGODB_URI!;
sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

const app = express();

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});


app.set('view engine', 'ejs');
app.set('views', resolve('views'));

const fileStorage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'images');
    },
    filename: (req, file, cb)=>{
        cb(null, `${file.originalname}`);
    },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({
    storage: fileStorage, 
    fileFilter: (req, file, cb)=>{
        const accept = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype);
        cb(null, accept)
    }
}).single('image'));
app.use(express.static(resolve('public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(csrf());
app.use((err:any, req:Request, res:Response, next:NextFunction)=> {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
  
    // handle CSRF token errors here
    res.status(403)
    res.send('form tampered with')
  })

app.use(flash());

app.use(async (req, res, next) => {
    if(req.session!.userId){
        const user = await User.findById(req.session!.userId);
        if (!user) {
            console.log("ERROR: nie istnieje user!!!");
            next(new Error('ERROR: nie istnieje user!!!'));
            return;
        }
        req.user = user!;
    }
    next();
});
// app.use((req, res, next)=>{
//     res.locals
// });
app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(errorsController.use500);
app.use(errorsController.use404);


const start = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        if (!(await User.findOne())) {
            const user = new User({
                name: 'Max',
                email: 'max@test.com',
                cart: {
                    products: []
                }
            });
            await user.save();
        }
        app.listen(3000);
    } catch (error) {
        console.log("ERROR", (error as Error).message);
    }
};
start();
