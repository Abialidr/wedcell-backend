const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    emailAddress: { type: String, required: [true, "Email Address required."] },
    verificationCode: { type: String, default: null },
    status: { type: String, default: "pending", enum: ['pending', 'success', 'block'] },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() }
}, { collection: 'userEmail' });

module.exports = mongoose.model("UserEmail", userSchema)