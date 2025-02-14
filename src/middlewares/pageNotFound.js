function pageNotFound(req,res,next){
    return res.status(404).json({
        success : false,
        status : 404,
        message : "page not found",
        errors : {
            message : `${req.originalUrl} path,not found,or check your CRUD operation that use by this path`,
        }
    })
}


module.exports = pageNotFound;

