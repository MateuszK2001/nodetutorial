import {promises as fs, existsSync} from 'fs';
import path from 'path';
import Product from './product';
import Cart from './cart';

const filename = path.resolve('data', 'products.json');


export default class Products{
    static _Init(){
        if(!existsSync(filename)){
            fs.writeFile(filename, "[]"); 
        }
    }
    private static async loadProducts(){
        const data = JSON.parse((await fs.readFile(filename)).toString()) as Array<any>;
        return data.map(p => new Product({...p}));
    }
    static async add(p:Product){
        const products = (await Products.loadProducts());
        products.push(p);
        await fs.writeFile(filename, JSON.stringify(products));
    }
    static async remove(id:string){
        let products = (await Products.loadProducts());
        const removedProduct = await this.get(id);
        products = products.filter(a=>a.id !== id);
        await fs.writeFile(filename, JSON.stringify(products));
        await Cart.removeProducts(id, (await removedProduct).price);
    }
    static async get(id:string):Promise<Product>{
        const products = (await Products.loadProducts());
        const product = products.find(a=>a.id===id);
        if(product===undefined){
            console.log("ERROR: Products.get <- undefined");
            throw new Error('ERROR: Products.get <- undefined');
        }
        return product;
    }
    static async fetchAll(){
        return await this.loadProducts();
    }

}

Products._Init();