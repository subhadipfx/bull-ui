import * as express from "express";
import * as hbs from "express-handlebars";
import {HandleBarsService} from "./service"
import {join} from "path"
import QueueRouter from "./routes/QueueRouter";

const app = express();

app.set('views', join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(join(__dirname, 'public')))
app.engine('hbs', HandleBarsService.instance().engine);
app.set('view engine', 'hbs');


// app.get('/',(req, res) => res.render('index'))
app.use('/', new QueueRouter().routes().associate());
app.listen(3100, () => {
    console.log("Started")
})
