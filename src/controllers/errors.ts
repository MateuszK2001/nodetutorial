import { NextFunction, Request, Response } from "express";

export const use404 = (req:Request, res:Response, next:NextFunction) => {
    res.status(404).render('404', {docTitle: "Page Not Found", path: ""});
}
