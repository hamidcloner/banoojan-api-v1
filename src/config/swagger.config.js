const swaggerJSDOCS = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const path = require("path");



const swaggerOptions = {
    swaggerDefinition : {
        openapi : "3.0.0",
        info : {
            title : "banoojan sample api",
            version : "1.0.0"
        }
    },
    apis : [path.join(__dirname,"../**/*.swagger.js")]
}

const swaggerDocs = swaggerJSDOCS(swaggerOptions);
module.exports = swaggerDocs;