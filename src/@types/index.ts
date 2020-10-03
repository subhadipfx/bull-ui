import {JobCounts, JobStatus} from "bull"

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

export interface JobInfo {
    id: string,
    name: string,
    queue: string,
    status: JobStatus
    data: any,
    opts: any,
    progress: number,
    stacktrace: any[]
    timestamp: Date,
    processedOn: Date
    finishedOn: Date,
}


export interface JobLogs {
    logs: string[],
    count: number
}
