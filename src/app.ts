import express from 'express';
import bodyParser from 'body-parser';
import mongoConect from './util/database';
import { resolve } from 'path';
import adminRouter from './routes/admin';
import shopRouter from './routes/shop';
import User from './models/user';
import { ObjectId } from 'mongodb';


declare global {
    namespace Express {
        interface Request {
            user: User
        }
    }
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', resolve('views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(resolve('public')));

app.use(async (req, res, next)=>{
    const user = await User.findById(new ObjectId('5f40feac77514e76dd49950b'))
    if(!user){
        console.log("ERROR: nie istnieje user!!!");
    }
    req.user = user!;
    next();
});
app.use('/admin', adminRouter);
app.use(shopRouter);

// app.use(errorsController.use404);


const start = async()=>{
    try {
        await mongoConect();
        app.listen(3000);
    } catch (error) {
        console.log("ERROR", (error as Error).message);        
    }
};    
start();
