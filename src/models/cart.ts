import Product from "./product";
import {promises as fs, existsSync} from 'fs';
import path from "path";
import Products from "./products";

const filename = path.resolve('data', 'cart.json');

export default class Cart{
    productsId:{[id:string]:number} = {};
    totalPrice:number = 0;
    static async _Init(){
        if(!existsSync(filename)){
            await fs.writeFile(filename, JSON.stringify(new Cart())); 
        }
    }
    static async loadCart():Promise<Cart>{
        const data = JSON.parse((await fs.readFile(filename)).toString());
        const cart = new Cart();
        cart.productsId = data.productsId;
        cart.totalPrice = data.totalPrice;
        return cart;
    }
    private static async saveCart(cart:Cart){
        await fs.writeFile(filename, JSON.stringify(cart));
    }
    static async add(product: Product){
        const cart = await Cart.loadCart();
        cart.productsId[product.id] = 1 + (cart.productsId[product.id]?1:0);  
        cart.totalPrice += product.price;
        await Cart.saveCart(cart);
    }
    static async removeProduct(product: Product){
        const cart = await Cart.loadCart();
        if(cart.productsId[product.id] === undefined || cart.productsId[product.id] === 0){
            throw new Error('ERROR: Cart remove - product id undefined or equal 0');
        }
        cart.productsId[product.id]--;
        cart.totalPrice -= product.price;
        if(cart.productsId[product.id] === 0)
            delete cart.productsId[product.id]; 
        await Cart.saveCart(cart);
    }
    static async removeProducts(id:string, singlePrice: number){
        const cart = await Cart.loadCart();
        if(cart.productsId[id] === undefined || cart.productsId[id] === 0){
            throw new Error('ERROR: Cart remove - product id undefined or equal 0');
        }
        cart.totalPrice -= (singlePrice*cart.productsId[id]);
        delete cart.productsId[id];
        await Cart.saveCart(cart);
    }
    
    static async getProducts():Promise<{product: Product, cnt: number}[]>{
        const cart = await this.loadCart()
        const allProducts = await Products.fetchAll();
        const cartProducts = new Set(Object.keys(cart.productsId));
        const results = allProducts
            .filter(a=>cartProducts.has(a.id))
            .map(p => ({product: p, cnt: cart.productsId[p.id]}));
        return results;
    }
    
}
Cart._Init();