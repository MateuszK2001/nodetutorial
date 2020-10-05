import { Request, Response, NextFunction } from "express";
import { renderHelper, getValidationMsg } from "../util/ResponseHelper";
import User from "../models/User";
import * as bcrypt from 'bcryptjs';
import sendgrid from '@sendgrid/mail';
import crypto from 'crypto';
import { serialize } from "v8";
import {validationResult} from 'express-validator';

export const getLogin = (req: Request, res: Response, next: NextFunction) => {
    const infoMessage = String(req.flash('info'))||undefined;
    const errorMessage = String(req.flash('error'))||undefined;

    renderHelper(req, res, 'auth/login',{
        docTitle: 'Login',
        errorMessage,
        infoMessage
    });
};

export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email: email});
    if(!user || !await bcrypt.compare(password, user.pass)){
        req.flash('error', 'Invalid email or password.');
        return renderHelper(req, res, 'auth/login',{
            docTitle: 'Login',
            errorMessage: "Invalid email or password",
            oldInput: {email, password}
        });
    }
    req.session!.isLoggedIn = true;
    req.session!.userId = user._id;
    req.session!.save(err=>{
        if(err) console.log(err);
        res.redirect('/');
    });
};
export const postLogout = (req: Request, res: Response, next: NextFunction) => {
    req.session!.destroy((err)=>{
        if(err) console.log(err);
        res.redirect('/');
    });
};

export const getSignup = (req: Request, res: Response, next: NextFunction) => {
    const errorMessage = String(req.flash('error')) || undefined;
    

    renderHelper(req, res, 'auth/signup',{
        docTitle: 'Sign up',
        errorMessage
    });
};

export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    
    const errors = getValidationMsg(req);
    if(errors){
        renderHelper(req, res.status(422), 'auth/signup',{
            docTitle: 'Sign up',
            oldInput: {email, password, confirmPassword},
            ...errors
        });
        return;
    }
    
    // if(password !== confirmPassword){
    //     req.flash("error", "Given passwords are different.");
    //     return res.redirect('/signup');
    // }
    // if(await User.findOne({email: email})){
    //     req.flash("error", "User with this email already exists.");
    //     return res.redirect('/signup');
    // }
    // zrobione w walidacji

    const usr = await User.create({
        name:'Jolla',
        email: email,
        pass: await bcrypt.hash(password, 12),
        orders: [],
        cart: {products: []}
    });

    const msg = {
        to: email,
        from: 'mateusz.kisiel.mk@gmail.com',
        subject: 'Confirm your email',
        // text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>Click to confirm your email</strong>',
    };
    sendgrid.send(msg).catch(error=>console.log(error));


    req.session!.isLoggedIn = true;
    req.session!.userId = usr.id;
    req.session!.save(err=>{
        console.log(err);
        res.redirect('/');     
    });
};

export const getResetPassword = (req: Request, res: Response, next: NextFunction) => {
    const errorMessage = String(req.flash('error'))||undefined;
    const infoMessage = String(req.flash('info'))||undefined;

    renderHelper(req, res, 'auth/reset-password',{
        docTitle: 'Reset password',
        errorMessage,
        infoMessage
    });
}

export const postResetPassword = (req: Request, res: Response, next: NextFunction) => {
    crypto.randomBytes(32,async (err, buffer)=>{
        if(err) {
            console.log(err);
            req.flash('error', "Unexpected error occured");
            return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');
        const user = await User.findOne({email: req.body.email});
        if(!user){
            req.flash('error', "Email doesn't exists");
            return res.redirect('/reset-password');
        }
        user.resetToken = token;
        user.resetTokenExpiration = new Date(Date.now()+3600000);
        await user.save();
        sendgrid.send({
            from: 'mateusz.kisiel.mk@gmail.com',
            to: user.email,
            subject: 'Password reset',
            html: `<p>You requested password reset</p>
                Click <a href="http://localhost:3000/new-password/${token}">link</a> to reset password`
        });
        req.flash('info', 'Check your email to reset password.');
        res.redirect('/login');
    });
}

export const getNewPassword = async (req: Request, res: Response, next: NextFunction) => {
    const errorMessage = String(req.flash('error'))||undefined;
    const token = req.params.token;
    
    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: {$gt:new Date()}
    });
    
    if(!user){
        req.flash('error', 'Timeout expired');
        return res.redirect('/reset-password');
    }
    
    renderHelper(req, res, 'auth/new-password',{
        docTitle: 'New password',
        token: token,
        errorMessage
    });
}

export const postNewPassword = async (req: Request, res: Response, next: NextFunction) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const token = req.body.token;

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: {$gt:new Date()}
    });
    if(!user){
        req.flash('error', "Timeout expired");
        return res.redirect('/reset-password');
    }

    if(password !== confirmPassword){
        req.flash('error', 'Passwords are different');
        return res.redirect(`/new-password/${token}`)
    }

    user.pass = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    req.flash('info', 'Your password was changed.');
    
    res.redirect('/login');
}