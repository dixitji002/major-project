const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const possportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        require: true,
    },
});
userSchema.plugin(possportLocalMongoose );
const User = mongoose.model("User",userSchema);
module.exports = User;