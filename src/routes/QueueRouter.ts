import BaseRouter from "./BaseRouter";
import QueueController from "../controllers/QueueController";
export default class JobRouter extends BaseRouter {
    routes():JobRouter {
        this.router.route('/')
            .get(QueueController.listQueuesWithJobCounts);

        this.router.route('/logs')
            .post(QueueController.getJobLogs);

        this.router.route('/:queue')
            .get(QueueController.getJobsByStatus);

        // this.router.route('/:queue/:job')
        //     .get(QueueController.getJobLogs);

        return this;
    }
}
