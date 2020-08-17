import express from 'express';
import bodyParser from 'body-parser';
import adminRouter from './routes/admin';
import shopRouter from './routes/shop';
import { resolve } from 'path';
import * as errorsController from './controllers/errors';

const app = express();

app.set('view engine', 'ejs');
app.set('views', resolve('views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(resolve('public')));

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorsController.use404);




app.listen(3000);

