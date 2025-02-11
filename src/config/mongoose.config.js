const {default : mongoose} = require("mongoose");
const {successTypo,warningTypo,infoTypo} = require("@utils/chalkUtils");

const {MONGO_HOST,MONGO_PORT,MONGO_DB_NAME} = process.env;




module.exports = async () => {
    // create mongoose connection
    // handle the Error on initial-connection
    try{
        await mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`);
        console.log(successTypo("MongoDB connected SuccessFully!"));
    }catch(err){
        console.log(warningTypo("mongoDB connection By mongoose failed!"))
    }
    // track the conncetion events
    mongoose.connection.on("error",function(err){
        console.log(warningTypo(`Exception While mongoose connection with ${err} error`));
    })
    process.on("SIGINT",function(){
        // handle the signal-events (POSIX) sample keyboard-interupt (Ctrl+C)
        mongoose.connection.close(function(){
            console.log(infoTypo("Mongoose default connection is disconnected due to application termination"));
            process.exit(0)
        })
    })
}