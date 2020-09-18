import * as Queue from "bull"
import * as Q from "q";
import {unique} from "underscore";
import {QueueJobList} from "../@types";
import {RedisService, UtilityService} from "./";

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

    getJobsByStatus(types: Queue.JobStatus[], start: number = 0, end: number = -1):Q.Promise<Queue.Job[]>{
        const defer:Q.Deferred<Queue.Job[]> = Q.defer<Queue.Job[]>();
        start = start ? start : 0;
        end = end ? end : -1;
        this.queue.getJobs(types, start, end)
            .then(jobs => defer.resolve(jobs))
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
}
