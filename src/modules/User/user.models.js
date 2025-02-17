const mongoose = require("mongoose")



const organizationalRolesSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        enum : {
            values : ["developer","motion_graphics_designer","mentee","accountant","huamn_resource_manager"],
            message : (receivedValue) => `incorrect \'${receivedValue.value}'\ for \'skil field'\,skil must be into [\'developer\',\'motion_graphics_designer\',\'mentee\',\'accountant\',\'huamn_resource_manager\']`
        }
    },
    roleOwners : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})



const OrganizationalRolesModel = mongoose.models.Roles ||  mongoose.model("Roles",organizationalRolesSchema);
module.exports = OrganizationalRolesModel;