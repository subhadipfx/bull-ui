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
            title : () => "Bull UI"
        }
    }
}
