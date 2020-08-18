import path from 'path';
import Product from './product';
import Cart from './cart';
import TutorialDatabasePool from '../util/database';
import { stringify } from 'querystring';

const filename = path.resolve('data', 'products.json');


export default class Products{
    private static rowToProduct(row:any){
        return new Product({
            id: row.id.toString(),
            description: row.description,
            imgSrc: row.imgSrc,
            price: row.price,
            title: row.title
        });
    }
    private static productWithoutId(product:Product){
        const p = {...product};
        delete p.id;
        return p;
    }
    
    private static async loadProducts(){
        const [rows, fields] = await TutorialDatabasePool.execute('SELECT * FROM products');
        const products = (rows as Array<any>).map(r=>Products.rowToProduct(r));
        return products;
    }
    private static async loadProduct(id:string){
        const [rows, fields] = await TutorialDatabasePool.execute(
            'SELECT * FROM products WHERE id=?',
            [Number(id)]);
        return Products.rowToProduct( (rows as any)[0]);
    }
    static async update(product:Product, keys?:(keyof Product)[]){ /// you cant update id!!!
        if(keys === undefined){
            keys = Object.keys(this.productWithoutId(product)) as (keyof Product)[];
        }
        const queryHelper = keys.map(key=>`${key}=?`).join(',');
        const args = keys.map(key=>product[key]);
        args.push(product.id);

        await TutorialDatabasePool.execute(
            `UPDATE products SET ${queryHelper} WHERE id=?`,
            args);
    }
    static async add(p:Product){
        await TutorialDatabasePool.execute(
            "INSERT INTO products(title,price,description,imgSrc) VALUES (?,?,?,?)",
            Object.values(Products.productWithoutId(p)));
    }
    static async remove(id:string){
        const removedProduct = await Products.loadProduct(id);
        await TutorialDatabasePool.execute(
            "DELETE FROM products WHERE id=?",
            [Number(id)]);
        await Cart.removeProducts(id, removedProduct.price);
    }
    static async get(id:string){
        const product = await Products.loadProduct(id);
        // if(product===undefined){
        //     console.log("ERROR: Products.get <- undefined");
        //     throw new Error('ERROR: Products.get <- undefined');
        // }
        return product;
    }
    static async fetchAll(){
        return await this.loadProducts();
    }

}
