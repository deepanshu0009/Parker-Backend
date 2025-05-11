var mongoose=require("mongoose");
function getReactUserSchema()
{
    var SchemaClass=mongoose.Schema;
    var colSchema=new SchemaClass({
       
        email:{type:String,required:true,unique:true,index:true},
        pwd:String,
        type:String,
        dos:{type:Date,default:Date.now},
    },{
        versionKey: false // to avoid __v field in table come by default 
    })

    var userColRef=mongoose.model("reactusers",colSchema);
return userColRef;
}
module.exports=getReactUserSchema;