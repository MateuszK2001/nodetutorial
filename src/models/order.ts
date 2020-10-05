import { Schema, SchemaTypes, Types, model, Document } from "mongoose";


export interface IOrder extends Document {
    products:{
        product: {
            productId: Types.ObjectId,
            title: string,
            price: number
        },
        cnt: number
    }[],
    price: number,
    userId: Types.ObjectId
};
const orderSchema = new Schema<IOrder>({
    products: [{
        product:{
            productId: {
                type: SchemaTypes.ObjectId,
                required: true,
                ref: 'Product'
            },
            title:{
                type: String,
                required: true
            },
            price:{
                type: Number,
                required: true
            }
        },
        cnt: {
            type: Number,
            required: true
        }
    }],
    price: Number,
    userId: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    }
});

export default model<IOrder>('Order', orderSchema);