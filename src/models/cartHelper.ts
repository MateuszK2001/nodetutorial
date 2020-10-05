import Product, { IProduct } from './product';


class CartHelper{
    static countPrice(cartProducts:{productId: IProduct, cnt:number}[]){
        const price = cartProducts.reduce((price:number, {productId:product, cnt})=>{
            return price+product.price*cnt;
        }, 0);
        return price;
    }
}


export default CartHelper;
