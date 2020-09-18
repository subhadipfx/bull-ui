import {Request, Response} from "express";
import {QueueService, UtilityService} from "../service";
import {HTTP_STATUS} from "../@types";


export default class QueueController{

    public static listQueuesWithJobCounts(request: Request, response: Response){
        QueueService.list()
            .then(queueList =>
                UtilityService.responseMessage(response,
                {
                message: "Queue List Fetched",
                data: queueList,
                code: HTTP_STATUS.SUCCESS
            }
            ))
            .catch(error =>
                UtilityService.responseMessage(response,
                {
                    message: error.message,
                    code: HTTP_STATUS.INTERNAL_ERROR
                })
            )
    }

    public static getJobsByStatus(request: Request, response: Response){
        if(request.query.types == null){
            return UtilityService.responseMessage(response,
                {
                    message: "Types are is not defined",
                    code: HTTP_STATUS.BAD_REQUEST
                })
        }
        let jobTypes:any[] = String(request.query.types).split(',');
        new QueueService(String(request.params.queue)).getJobsByStatus(jobTypes)
            .then(jobList => UtilityService.responseMessage(response,
                {
                    message: "Job List Fetched",
                    data: jobList,
                    code: HTTP_STATUS.SUCCESS
                }))
            .catch(error =>
                UtilityService.responseMessage(response,
                    {
                        message: error.message,
                        code: HTTP_STATUS.INTERNAL_ERROR
                    })
            )
    }

    public static queueAction(request: Request, response: Response){
        if(request.query.action == null){
            return UtilityService.responseMessage(response,
                {
                    message: "Queue action is not defined",
                    code: HTTP_STATUS.BAD_REQUEST
                })
        }

        let promise = null;
        let queue =new QueueService(String(request.params.queue)).getQueue();
        switch (String(request.query.action)){
            case "empty":
               promise = queue.empty();
               break;
            case "clean":
                if(request.query.grace == null){
                    return UtilityService.responseMessage(response,
                        {
                            message: "A grace number (in milliseconds) is required",
                            code: HTTP_STATUS.BAD_REQUEST
                        })
                }
                if(request.query.type == null){
                    return UtilityService.responseMessage(response,
                        {
                            message: "A valid job status type is required",
                            code: HTTP_STATUS.BAD_REQUEST
                        })
                }
                let type:any = String(request.query.type);
                promise = queue.clean(parseInt(String(request.query.grace)), type);
                break;
            case "close":
                promise = queue.close();
                break;
            default:
                return UtilityService.responseMessage(response,
                    {
                        message: "This type of action is currently not supported",
                        code: HTTP_STATUS.BAD_REQUEST
                    })
        }
        if(promise){
            promise.then(_ => {
                return UtilityService.responseMessage(response,
                    {
                        message: "Action is performed",
                        code: HTTP_STATUS.SUCCESS
                    })
            })
        }else{
            return UtilityService.responseMessage(response,
                {
                    message: "Something went wrong",
                    code: HTTP_STATUS.INTERNAL_ERROR
                })
        }

    }

    public static queueJobAction(request: Request, response: Response){
        if(request.query.action == null){
            return UtilityService.responseMessage(response,
                {
                    message: "Job action is not defined",
                    code: HTTP_STATUS.BAD_REQUEST
                })
        }
        new QueueService(String(request.params.queue)).getJobByJobID(String(request.params.job))
            .then(job => {
                let promise = null;
                switch (String(request.query.action)){
                    case "remove":
                        promise = job.remove();
                        break;
                    case "retry":
                        promise = job.retry();
                        break;
                    case "discard":
                        promise = job.discard();
                        break;
                    case "promote":
                        promise = job.promote();
                        break;
                    case "moveToCompleted":
                        promise = job.moveToCompleted();
                        break;
                    case "moveToFailed":
                        promise = job.moveToFailed({message: "Failed"});
                        break;
                    default:
                        throw new Error("This type of action is currently not supported")
                }
                if(promise){
                    return promise;
                }else{
                    throw new Error("Something went wrong");
                }
            })
            .then(_ => {
                return UtilityService.responseMessage(response,
                    {
                        message: "Action is performed",
                        code: HTTP_STATUS.SUCCESS
                    })
            })
            .catch(error =>
                UtilityService.responseMessage(response,
                    { message: error.message,
                                code: HTTP_STATUS.BAD_REQUEST
                    }))
    }
}
