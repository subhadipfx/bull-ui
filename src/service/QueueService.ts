import * as Queue from "bull"
import * as Q from "q";
import {unique} from "underscore";
import {JobLogs, QueueJobList} from "../@types";
import {RedisService, UtilityService} from "./";
import {JobCounts} from "bull";

export class QueueService {
    private readonly queue = null;

    constructor(queueName) {
        this.queue = Queue(queueName);
    }

    private static getJobCountsByQueueName(name):Q.Promise<QueueJobList>{
        const defer:Q.Deferred<QueueJobList> = Q.defer<QueueJobList>();
        Queue(name)
            .getJobCounts()
            .then(counts => defer.resolve({ name: name, jobCounts: counts }) )
            .catch(error => defer.reject(error))
        return defer.promise;
    }

    public static list():Q.Promise<QueueJobList[]>{
        const defer:Q.Deferred<QueueJobList[]> = Q.defer<QueueJobList[]>();

        RedisService.instance().keySearch("bull:*")
            .then(keys => {
                return unique(keys.map(key => key.split(":")[1]))
            })
            .then(queues => {
                return UtilityService.asyncArrayIterator(queues, QueueService.getJobCountsByQueueName);
            })
            .then(queueJobDetails => defer.resolve(queueJobDetails))
            .catch(error => defer.reject(error))

        return defer.promise;
    }

    getJobsByStatus(types: Queue.JobStatus[], start: number = 0, end: number = -1):Q.Promise<{ jobCounts: QueueJobList, jobs:Queue.Job[] }>{
        const defer:Q.Deferred<{ jobCounts: QueueJobList, jobs:Queue.Job[] }> = Q.defer<{ jobCounts: QueueJobList, jobs:Queue.Job[] }>();
        start = start ? start : 0;
        end = end ? end : -1;
        QueueService.getJobCountsByQueueName(this.queue.name)
            .then(jobCounts => [jobCounts, this.queue.getJobs(types, start, end)])
            .spread((jobCounts, jobs) => {
                let status = types.pop();
               return [jobCounts, jobs.map(job => {
                    let jsonObj = job.toJSON();
                    return {
                        id: jsonObj.id,
                        name: jsonObj.name,
                        queue: this.queue.name,
                        status: status,
                        data: jsonObj.data,
                        opts: jsonObj.opts,
                        progress: jsonObj.progress,
                        stacktrace: jsonObj.stacktrace,
                        timestamp: new Date(jsonObj.timestamp).toLocaleString(),
                        processedOn: new Date(jsonObj.processedOn).toLocaleString(),
                        finishedOn: new Date(jsonObj.finishedOn).toLocaleString()
                    }
                })]
            })
            .spread((jobCounts, jobs) => defer.resolve({jobCounts, jobs}))
            .catch(error => defer.reject(error))
        return defer.promise;
    }

    getQueue(): Queue.Queue{
        return this.queue;
    }

    getJobByJobID(id: string):Q.Promise<Queue.Job>{
        const defer:Q.Deferred<Queue.Job> = Q.defer<Queue.Job>();
        this.queue.getJob(id)
            .then(job => defer.resolve(job))
            .catch(error => defer.reject(error));
        return defer.promise;
    }

    getJobLogs(id: string):Q.Promise<JobLogs>{
        const defer:Q.Deferred<JobLogs> = Q.defer<JobLogs>();
        this.queue.getJobLogs(id)
            .then(logs => defer.resolve(logs.logs))
            .catch(error => defer.reject(error));
        return defer.promise;
    }
}
