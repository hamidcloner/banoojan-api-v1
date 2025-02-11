const express = require("express");
const appRouter = require("@routes");
const mongooseConnection = require("@config/mongoose.config");
const commonMiddlewares = require("@middlewares/commonMiddlewares")
// import the middlewares 
const pageNotFound = require("@middlewares/pageNotFound");
const exceptionHandlers = require("@middlewares/exceptionHandler");
const swaggerJSDOCS = require("@config/swagger.config");
const swaggerUI = require("swagger-ui-express");



class App{
    #appPort;
    #appHost;
    #appMainPath;
    #app;
    constructor(port,host,mainPath){
        this.#appPort = port
        this.#app = express();
        this.#appHost = host
        this.#appMainPath = mainPath;
    }
    enableApplicationRoutes(){
        this.#app.use(this.#appMainPath,appRouter);
    }
    enableLastAppMiddlewares(){
        this.#app.use(exceptionHandlers)
        this.#app.use(pageNotFound);
    }
    enableSwaggerTools(){
        this.#app.use("/api-doc",swaggerUI.serve,swaggerUI.setup(swaggerJSDOCS))
    }
    enableTopLevelMiddlewares(){
        commonMiddlewares(this.#app);
    }
    connectToDB(){
        mongooseConnection()
    }



    run(){
        this.enableSwaggerTools();
        this.enableTopLevelMiddlewares()
        this.enableApplicationRoutes();
        this.enableLastAppMiddlewares();
        this.connectToDB();
        
        this.#app.listen(this.#appPort,() => {
            console.log(`server is Running on http://${this.#appHost}:${this.#appPort}`)
        })
    }
}

module.exports = App;


