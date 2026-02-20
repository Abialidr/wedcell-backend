const {userSchema} = require("../model/emailVerification")

const Joi = require("joi");

const User = require("../model/emailVerification");

const validateSignup = (data) => {
    const schema = Joi.object({
        emailAddress: Joi.string().email().required().label('Email Address'),
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

const validateVerify = (data) => {
    const schema = Joi.object({
        verificationCode: Joi.string().required().label('Verification Code')
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

module.exports = {User , validateSignup , validateVerify};