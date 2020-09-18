import {JobCounts} from "bull"

export interface QueueJobList {
    name: string,
    jobCounts: JobCounts
}

export enum HTTP_STATUS {
    SUCCESS = 200,
    SUCCESS_CREATED= 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND= 404,
    INTERNAL_ERROR = 500
}

export interface ResponseMessage {
    message: string,
    data?: any,
    code: HTTP_STATUS
}
