import { Response, Request } from "express";
import { validationResult } from "express-validator";


export const renderHelper = (req: Request, res: Response, view: string, args: any) => {
    // let cookie = req.get('Cookie')
    //     ?.split(';')
    //     .reduce((obj, str)=>{
    //         const val = str.trim().split('=');
    //         obj[val[0]] = (val.length>=2 ? val[1] : null);
    //         return obj;
    //     }, {} as StringMap);
    // if(cookie===undefined)
    //     cookie = {};
    const options = {
        ...args,
        path: args.path || view,
        csrfToken: req.csrfToken(),
        isAuthenticated: req.session!.isLoggedIn === true
    };
    res.render(view, options);
}

export const getValidationMsg = (req:Request)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const errorMessage = `Correct the form to continue:<br>`
            + errors.array().map((err, idx)=>{
                return `${idx+1}) ${err.msg}`;
            }).join("<br>");
        const invalid = errors.array().reduce((obj:Record<string, boolean>, err)=>{
            obj[err.param] = true;
            return obj;
        }, {});

        return {errorMessage, invalid};
    }
    return null;
}