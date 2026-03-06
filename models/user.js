const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});

// ✅ Handle both export styles safely
const actualPlugin =
    passportLocalMongoose.default || passportLocalMongoose;

userSchema.plugin(actualPlugin);

const User = mongoose.model("User", userSchema);

module.exports = User;