const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://priyanka:root@cluster0.hlcsv6d.mongodb.net/MyDatabase")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log("failed to connect");
    })


const imageSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    data: Buffer,
  });

  const messageSchema = new mongoose.Schema({
      user:{
          type:String,
          required:true
        },
      address:{
          type:String,
          required:true
      },   
     message:{
      type:String,
      required:true
     },
     date:{
         type:Date,
         default:Date.now
     }
  })
const Image = new mongoose.model('Image', imageSchema);
const Message = new mongoose.model("Message",messageSchema)
module.exports = {Image,Message}