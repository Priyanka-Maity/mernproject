const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const LogInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})
LogInSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id)
        const token = jwt.sign({ _id: this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.error("Error generating authentication token:", error);
    }
};



const customer = new mongoose.model("customer", LogInSchema);
module.exports = customer