var nodemailer = require('nodemailer');
var path = require('path');
var q = require('q');
var fs = require('fs');
var jwt = require('jsonwebtoken')
var config = require('../../../config/config');
const { reset } = require('nodemon');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  }
});

function EmailService() {

  function ForgotPassword(data, url) {
    var token = jwt.sign({
      email: data.email
    }, config.secret);
    var deferred = q.defer();
    var templateFile = path.join('admin/assets/templates/reset-password-email.html');
    fs.readFile(templateFile, function (err, html) {
      if (err) {
        var resp = {
          success: false,
          message: 'Error in processing',
          data: err
        };
        deferred.reject(resp);
      } else {
        var htmldata = html.toString();
        url = url + token;
        htmldata = htmldata.replace("UserName", data.name);
        htmldata = htmldata.replace("user_email", data.email);
        htmldata = htmldata.replace("button_url", url);
        var direct_link_replace = `<strong><a href="` + url + `" style="word-break: break-word; font-family: 'Lato', Arial, Helvetica, sans-serif; color: #541388; text-decoration: underline;">` + url + `</a></strong>`;
        htmldata = htmldata.replace("directLink", direct_link_replace);
        var mailOptions = {
          from: 'machinet66@gmail.com',
          to: data.email,
          subject: 'Forgot Password for send me box app',
          html: htmldata
        };
        transporter.sendMail(mailOptions, function (error, response) {
          if (error) {
            var resp = {
              success: false,
              message: 'Error in procesing',
              data: error
            };
            deferred.reject(resp);
          } else {
            var resp = {
              success: true,
              message: 'Mail Sent Successfully',
              data: data,
              token: token
            };
            deferred.resolve(resp);
          }
        });
      }
    });
    return deferred.promise;
  };

  return {
    ForgotPassword: ForgotPassword
  };
};

module.exports = EmailService();
