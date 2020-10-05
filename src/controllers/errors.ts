import { NextFunction, Request, Response } from "express";
import { renderHelper } from "../util/ResponseHelper";

export const use404 = (req:Request, res:Response, next:NextFunction) => {
    res = res.status(404);
    renderHelper(req,res,'404',{
        docTitle: "Page Not Found"
    });
}

export const use500 = (err:Error, req:Request, res:Response, next:NextFunction) => {
    console.log(err);
    res = res.status(500);
    res.render('500', {
        docTitle: "Server issue",
        path: "500",
        isAuthenticated: false
    });
}
