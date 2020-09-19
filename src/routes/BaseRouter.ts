import * as express from "express";


export default class BaseRouter {
    protected readonly router:express.Router = express.Router();
    routes():void{}
    associate():express.Router{
        return this.router;
    }
}
