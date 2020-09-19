import * as hbs from "express-handlebars";

export class HandleBarsService {
    public static instance():Exphbs{
        return  hbs.create({
            extname: "hbs",
            defaultLayout: 'main',
            layoutsDir:  "src/views/layout",
            helpers: HandleBarsService.helpers()
        });
    }

    private static helpers(){
        return {
            title : () => "Bull UI",
            setActive : (queue, link) => queue == link ? "active" : "",
            prettifyJobID: (id, name) => name != "__default__" ? name+":"+id : id,
            timestampToDate: (timestamp) => new Date(timestamp).toLocaleString(),
            verifyJobProgress: (progress, jobType) => (jobType == "completed" && progress == 0) ? 100 : progress,
            stringify: (obj) => JSON.stringify(obj)
        }
    }
}
