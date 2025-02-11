require("dotenv").config();
require("module-alias/register")
const App = require("./src/main");

const {
    APP_PORT,
    APP_HOST,
    APP_MAIN_PATH
} = process.env


const app = new App(APP_PORT,APP_HOST,APP_MAIN_PATH)
app.run();
