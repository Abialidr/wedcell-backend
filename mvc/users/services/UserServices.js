var q = require('q');
var CryptoJS = require('crypto-js');
var config = require('../../../config/config');
var UserModels = require('../models/UserModels');
var jwt = require('jsonwebtoken');
var _ = require('underscore');
const bcrypt = require('bcrypt');
var salt = '$2b$10$pm4WmosjwhVivTDHxkCoiO';

function UsersServices() {
  function CreateAccount(data) {
    var deferred = q.defer();
    UserModels.create(data)
      .then(function (result) {
        var resp = {
          success: true,
          message: 'You are registered Successfully',
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: 'Error in processing',
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }

  async function GetUser(condition) {
    // var deferred = q.defer();
    try {
      const result = await UserModels.find(condition);
      var resp = {
        success: true,
        message: 'User Gets Successfully',
        data: result,
      };
      return resp;
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);
      var resp = {
        success: false,
        message: 'Error in processing',
        data: error,
      };
      // deferred.reject(resp);
      return resp;
    }
  }

  async function UpdateUser(condition, data) {
    var deferred = q.defer();
    UserModels.findOneAndUpdate(
      condition,
      { $set: data },
      { useFindAndModify: false, new: true }
    )
      .then(function (user_data) {
        var new_user_obj = {
          name: user_data.name,
          company_name: user_data.company_name,
          mobile: user_data.mobile,
          email: user_data.email,
          city: user_data.city,
          state: user_data.state,
          country: user_data.country,
          address: user_data.address,
          shipping_address: user_data.shipping_address,
          pincode: user_data.pincode,
          profile_pic: user_data.profile_pic,
          cover_pic: user_data.cover_pic,
          document_images: [],
          is_email_verified: user_data.is_email_verified,
          is_mobile_verified: user_data.is_mobile_verified,
          is_both_address_same: user_data.is_both_address_same,
          is_approved: user_data.is_approved,
          is_delete: user_data.is_delete,
          stripeCustomer: user_data.stripeCustomer,
          notificationList: user_data.notificationList,
          role: user_data.role,
          _id: user_data._id,
        };

        var resp = {
          success: true,
          message: 'User Updated Successfully',
          data: new_user_obj,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: 'Error in processing',
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }

  function DeleteUser(condition, data) {
    var deferred = q.defer();
    UserModels.findOneAndDelete(condition, { $set: data })
      .then(function (result) {
        var resp = {
          success: true,
          message: 'Delete User Successfully',
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: 'Error in processing',
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }

  async function ValidateLoggedInUser(data, req_obj) {
    var deferred = q.defer();
    var user_data = _.clone(data[0]);
    // const salt = await bcrypt.genSalt(10);
    const userPasswordbcrypt = await bcrypt.hash(req_obj.password, salt);
  
    var userPassword = CryptoJS.SHA256(req_obj.password).toString();

   
    GenerateToken(user_data._id, user_data.role).then(function (token) {

      // bcrypt.compare(userPassword.toString(), user_data.password.toString()).then(async (match) => {
      //userPassword==user_data.password ||
      match =
        userPassword == user_data.password ||
        userPasswordbcrypt == user_data.password;
      if (!match) {
        var resp = {
          success: false,
          message: 'Password Does not match',
          data: '',
        };
        deferred.reject(resp.message);
        // res.json({ error: "Wrong Username And Password Combination" });
      }

      var new_user_obj = {
        name: user_data.name,
        company_name: user_data.company_name,
        mobile: user_data.mobile,
        email: user_data.email,
        city: user_data.city,
        state: user_data.state,
        country: user_data.country,
        address: user_data.address,
        shipping_address: user_data.shipping_address,
        pincode: user_data.pincode,
        profile_pic: user_data.profile_pic,
        cover_pic: user_data.cover_pic,
        document_images: [],
        is_email_verified: user_data.is_email_verified,
        is_mobile_verified: user_data.is_mobile_verified,
        is_both_address_same: user_data.is_both_address_same,
        is_approved: user_data.is_approved,
        is_delete: user_data.is_delete,
        stripeCustomer: user_data.stripeCustomer,
        notificationList: user_data.notificationList,
        role: user_data.role,
        token: token,
        _id: user_data._id,
      };

      if (new_user_obj.is_approved === false) {
        var resp = {
          success: true,
          message: 'User Not  Verified',
          data: new_user_obj,
        };
        deferred.resolve(resp);
      } else if (
        new_user_obj.role == 'admin' ||
        new_user_obj.role == 'shopkeeper'
      ) {
        var resp = {
          success: true,
          message: 'User Verified',
          data: new_user_obj,
        };
        deferred.resolve(resp);
      } else {
        if (new_user_obj.is_approved) {
          var resp = {
            success: true,
            message: 'User Verified',
            data: new_user_obj,
          };
          deferred.resolve(resp);
        } else {
          var resp = {
            success: false,
            message:
              'You are not authorized to login! Please contact administrator',
            data: '',
          };
          deferred.reject(resp);
        }
      }

      // const accessToken = sign(
      //   { username: user.username, id: user.id },
      //   "importantsecret"
      // );
      // res.json({ token: accessToken, username: username, id: user.id });

      // });

      // if (userPassword == user_data.password.toString()) {
      //   var new_user_obj = {
      //     _id: user_data._id,
      //     name: user_data.name,
      //     email: user_data.email,
      //     token: token,
      //     is_mobile_verified: user_data.is_mobile_verified,
      //     is_both_address_same: user_data.is_both_address_same,
      //     is_approved: user_data.is_approved,
      //     is_delete: user_data.is_delete,
      //     is_email_verified: user_data.is_email_verified,
      //     role: user_data.role,
      //     document_images: [],
      //     profile_pic: user_data.profile_pic,
      //     mobile: user_data.mobile,
      //     address: user_data.address,
      //     shipping_address: user_data.shipping_address,
      //     pincode: user_data.pincode,
      //     stripeCustomer: user_data.stripeCustomer,
      //     notificationList: user_data.notificationList,
      //     device_token: user_data.device_token,
      //   };

      //   if (new_user_obj.is_approved === false) {
      //     var resp = {
      //       success: true,
      //       message: "User Not  Verified",
      //       data: new_user_obj,
      //     };
      //     deferred.resolve(resp);
      //   } else if (
      //     new_user_obj.role == "admin" ||
      //     new_user_obj.role == "shopkeeper"
      //   ) {
      //     var resp = {
      //       success: true,
      //       message: "User Verified",
      //       data: new_user_obj,
      //     };
      //     deferred.resolve(resp);
      //   } else {
      //     if (new_user_obj.is_approved) {
      //       var resp = {
      //         success: true,
      //         message: "User Verified",
      //         data: new_user_obj,
      //       };
      //       deferred.resolve(resp);
      //     } else {
      //       var resp = {
      //         success: false,
      //         message:
      //           "You are not authorized to login! Please contact administrator",
      //         data: "",
      //       };
      //       deferred.reject(resp);
      //     }
      //   }
      // } else {
      //   var resp = {
      //     success: false,
      //     message: "Password Does not match",
      //     data: "",
      //   };
      //   deferred.reject(resp.message);
      // }
    });
    return deferred.promise;
  }

  function GenerateToken(id, role) {
    var deferred = q.defer();
    var token = jwt.sign(
      {
        _id: id,
        role: role,
      },
      config.secret
    );
    deferred.resolve(token);
    return deferred.promise;
  }

  function itemNotification(id, itemId, remove) {
    var deferred = q.defer();
    if (remove) {
      UserModels.findOneAndUpdate(
        { _id: id },
        { $pull: { notificationList: itemId } },
        { useFindAndModify: false, new: true }
      )
        .then(function (result) {
          var resp = {
            success: true,
            message: 'User Updated Successfully',
            data: result,
          };
          deferred.resolve(resp);
        })
        .catch(function (error) {
          var resp = {
            success: false,
            message: 'Error in processing',
            data: error,
          };
          deferred.reject(resp);
        });
    } else {
      UserModels.findOneAndUpdate(
        { _id: id },
        { $push: { notificationList: itemId } },
        { useFindAndModify: false, new: true, password: 0 }
      )
        .then(function (result) {
          var resp = {
            success: true,
            message: 'User Updated Successfully',
            data: result,
          };
          deferred.resolve(resp);
        })
        .catch(function (error) {
          var resp = {
            success: false,
            message: 'Error in processing',
            data: error,
          };
          deferred.reject(resp);
        });
    }

    return deferred.promise;
  }

  return {
    CreateAccount: CreateAccount,
    ValidateLoggedInUser: ValidateLoggedInUser,
    GenerateToken: GenerateToken,
    GetUser: GetUser,
    UpdateUser: UpdateUser,
    DeleteUser: DeleteUser,
    itemNotification: itemNotification,
  };
}

module.exports = UsersServices();
