import {Request, Response, NextFunction} from 'express';

export default (redirectPath:string) => (req:Request, res:Response, next:NextFunction)=>{
    if(req.user){
        return res.redirect(redirectPath);
    }
    next();
}