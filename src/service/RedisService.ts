import {createClient, RedisClient} from "redis";
import * as Q from "q";

export class RedisService{
    private static $_instance:RedisService = null;
    private client:RedisClient = null;
    private constructor() {
    }

    public static instance(){
        if(!RedisService.$_instance){
            RedisService.$_instance = new RedisService();
        }
        RedisService.$_instance.client = createClient();
        return RedisService.$_instance;
    }

    keySearch(regex:string):Q.Promise<string[]>{
        const defer:Q.Deferred<string[]> = Q.defer<string[]>();
        this.client.keys(regex,(error, result) => {
            if(error){
                defer.reject(error)
            }else{
                defer.resolve(result)
            }
        })
        return defer.promise;

    }

}
