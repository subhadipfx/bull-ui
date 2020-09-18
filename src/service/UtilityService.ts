import {Response} from "express"
import {ResponseMessage} from "../@types";
export class UtilityService{

    public static async asyncArrayIterator(data:any[], processor):Promise<any[]>{
        if(typeof processor != "function"){
            throw new Error("undefined processor function")
        }
        let resultArray:any[] = [];
        while (data.length){
            let item = data.pop();
            try{
                let result = await processor(item);
                resultArray.push(result)
            }catch (e){
                throw e;
            }
        }
        return resultArray;
    }

    public static responseMessage(responseHandler: Response, responseData:ResponseMessage ){
        responseHandler
            .status(responseData.code)
            .json({
                code: responseData.code,
                message: responseData.message,
                data: responseData.data || null
            })
    }
}
