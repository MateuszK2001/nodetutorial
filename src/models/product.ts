import { URL } from 'url';
import { v4 as uuidv4} from 'uuid';


export default class Product{
    title:string = '';
    description:string = '';
    price:number = 0;
    id:string = uuidv4();
    imgSrc?:URL=new URL('https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png');

    constructor(params: {title?:string, description?:string, price?:number, imgSrc?: URL, id?: string}){
        params.title && (this.title = params.title);
        params.description && (this.description = params.description);
        params.price && (this.price = params.price);
        params.imgSrc && (this.imgSrc = params.imgSrc);
        params.id && (this.id = params.id);
    }   
}