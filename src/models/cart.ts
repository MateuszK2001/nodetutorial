import Product from './product';
import { ObjectId } from 'mongodb';
import { getDb } from '../util/database';


class Cart{
    products: {productId: ObjectId, cnt:number}[];
    /**
     *
     */
    constructor() {
        this.products = [];
    }
    static countPrice(cartProducts:{product: Product, cnt:number}[]){
        const price = cartProducts.reduce((price:number, {product, cnt})=>{
            return price+product.price*cnt;
        }, 0);
        return price;
    }
    async fetchProducts(){
        const db = getDb();
        const ids = this.products.map(a=>a.productId);

        const products = await db.collection('products').find({
            _id: {$in: ids}
        })
            .map(p => Product.dataToProduct(p))
            .toArray();
        const idToProduct = new Map(products.map(p=>[p._id?.toHexString(), p]));
        return this.products.map(p=>({
            product: idToProduct.get(p.productId.toHexString())!, 
            cnt: p.cnt})) as {product: Product, cnt:number}[];
    }
    static dataToCart(data:any){
        return Object.assign(new Cart(), {...data});
    }
}


export default Cart;
