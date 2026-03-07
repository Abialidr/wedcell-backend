const env = require("./config/env");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const salt = env.SALT;
const UserModels = require("./mvc/users/models/UserModels");

const args = process.argv.slice(2);
if (args.length < 4) {
    console.log("Usage: node createAdmin.js <name> <email> <mobile> <password>");
    process.exit(1);
}

const [name, email, mobile, password] = args;

mongoose.connect(
    env.PROXY,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(async () => {
    try {
        const existingAdmin = await UserModels.findOne({ email });
        if (existingAdmin) {
            console.log("An account with this email already exists.");
            process.exit(1);
        }

        const hashPassword = await bcrypt.hash(password, salt);
        const adminData = {
            name,
            email,
            mobile,
            password: hashPassword,
            role: "admin",
            is_approved: true,
            is_mobile_verified: true,
            is_email_verified: true,
        };

        const newAdmin = new UserModels(adminData);
        await newAdmin.save();
        console.log("Admin created successfully!");
    } catch (e) {
        console.error("Error creating admin:", e);
    } finally {
        mongoose.disconnect();
        process.exit();
    }
}).catch(console.error);
