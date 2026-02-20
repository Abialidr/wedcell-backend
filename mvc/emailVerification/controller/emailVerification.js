const User = require("../model/emailVerification");
const _ = require("lodash");
const Crypto = require("crypto");
const { validateSignup, validateVerify } = require("../_validation/addEmail");

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

const addEmail = async (req, res) => {
  const { error } = validateSignup(req.body);
  if (error) throw error;

  let user = await User.findOne({ emailAddress: req.body.emailAddress });
  if (user)
    return res
      .status(400)
      .json({ error: { emailAddress: "Email Address is already exist." } });

  let payload = _.pick(req.body, ["emailAddress"]);

  payload.verificationCode = Crypto.randomInt(100000, 999999);

  let newEmail = await User.create(payload);

  transporter.sendMail(
    {
      from: "arpitofficial06@gmail.com", // verified sender email
      to: newEmail.emailAddress, // recipient email
      subject: "Please verify that its you", // Subject line
      text: `Please verify that it's you \n\n
        If you are attempting to sign-up, please use the following code to confirm your identity: \n\n
        ${newEmail.verificationCode} \n\n
        Yours securely, \n\n
        Team Email Verification`, // plain text body
      html: `Please verify that it's you<br/><br/>
        If you are attempting to sign-up, please use the following code to confirm your identity:<br/><br/>
        <b>${newEmail.verificationCode}</b><br/><br/>
        Yours securely,<br/>
        Team Email Verification`, // html body
    },
    function (error, info) {
      if (error) {
        console.error(error);
      }
    }
  );
  res.status(200).json({ message: "Add Email process successfully done." });
};

const verify = async (req, res) => {
  const { error } = validateVerify(req.body);
  if (error) throw error;

  let user = await User.findOne({
    verificationCode: req.body.verificationCode,
  });
  if (!user)
    return res.status(400).json({ message: "Verification Code not matched." });

  user.verificationCode = null;
  user.status = "success";

  user.updatedAt = new Date().toISOString();
  user = await user.save();

  res.status(200).json({ message: "Email verified successfully." });
};

module.exports = { addEmail, verify };
