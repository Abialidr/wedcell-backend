var q = require('q');
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

function UtilsServices() {
  function StoreSession(data, message, req) {
    var deferred = q.defer();
    return deferred.promise;
  }
  function SuccessResp(data, message) {
    var deferred = q.defer();
    var resp = {
      success: true,
      message: message,
      data: data,
    };
    deferre.resolve(resp);
    return deferred.promise;
  }

  function ErrorResp(data, message) {
    var deferred = q.defer();
    var resp = {
      success: false,
      message: message,
      data: data,
    };
    deferred.reject(resp);
    return deferred.promise;
  }

  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        // cb(null, path.join("./public/images/item"));

        //---------ctrate path--------------
        var balayAudPath = './public/images/item';

        fs.mkdirSync(balayAudPath, { recursive: true });
        cb(null, balayAudPath);
      } catch (e) {
        cb(e);
      }
    },
    filename: function (req, file, cb) {
      try {
        // let a = file.originalname.split(".");
        // cb(null, `${file.fieldname}-${a[0]}-${Date.now()}.${a[a.length - 1]}`);
        cb(null, Date.now() + path.extname(file.originalname));
      } catch (e) {
        cb(e);
      }
    },
  });

  const ProfileStorage =
    // multer({
    //   storage: storage,
    //   dest: 'profile/'
    // });
    multer.diskStorage({
      destination: function (req, file, cb) {
        try {
          // cb(null, path.join("./public/images/profile"));
          var balayAudPath = './public/images/profile';

          fs.mkdirSync(balayAudPath, { recursive: true });
          cb(null, balayAudPath);
        } catch (e) {
          cb(e);
        }
      },
      filename: function (req, file, cb) {
        try {
          // let a = file.originalname.split(".");
          // cb(null, `${file.fieldname}-${a[0]}-${Date.now()}.${a[a.length - 1]}`);
          cb(null, Date.now() + path.extname(file.originalname));
        } catch (e) {
          cb(e);
        }
      },
    });

  const FileStorage =
    // multer({
    //   storage: storage,
    //   dest: 'item/'
    // });
    multer.diskStorage({
      destination: function (req, file, cb) {
        try {
          cb(null, path.join('./public/images/item'));
        } catch (e) {
          cb(e);
        }
      },
      filename: function (req, file, cb) {
        try {
          let a = file.originalname.split('.');
          cb(
            null,
            `${file.fieldname}-${a[0]}-${Date.now()}.${a[a.length - 1]}`
          );
        } catch (e) {
          cb(e);
        }
      },
    });

  // const ProfileUpload = multer({
  //   storage: ProfileStorage,
  //   fileFilter: function (req, file, callback) {
  //     var ext = path.extname(file.originalname);
  //     if (
  //       ext !== ".png" &&
  //       ext !== ".jpg" &&
  //       ext !== ".gif" &&
  //       ext !== ".jpeg"
  //     ) {
  //       return callback(
  //         new Error("Only png, jpg, gif and jpeg images are allowed!")
  //       );
  //     }
  //     callback(null, true);
  //   },
  // });

  const FileUpload = multer({
    storage: FileStorage,
    fileFilter: function (req, file, callback) {
      var ext = path.extname(file.originalname);
      if (
        ext !== '.png' &&
        ext !== '.jpg' &&
        ext !== '.gif' &&
        ext !== '.jpeg' &&
        ext !== '.pdf'
      ) {
        return callback('Only png, jpg, gif and jpeg images are allowed!');
      }
      callback(null, true);
    },
  });

  const Upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
      var ext = path.extname(file.originalname);
      if (
        ext !== '.png' &&
        ext !== '.jpg' &&
        ext !== '.gif' &&
        ext !== '.jpeg' &&
        ext !== '.mp4' &&
        ext !== '.pdf'
      ) {
        return callback('Only png, jpg, gif and jpeg images are allowed!');
      }
      callback(null, true);
    },
  });

  async function SendSMS(number, body, callback) {
    try {
      const client = new twilio(accountSid, authToken);
      let response = await client.messages.create({
        body: body,
        to: number,
        from: '+919424760344',
      });
      callback(null, response, 'SMS Sent to ' + number + body);
    } catch (ex) {
      console.error('sendSMS catch', ex);
      callback(ex, null, 'Error Sending SMS to ' + number + body);
    }
  }

  function RandomNumber(length = 6) {
    const chars = '0123456789';
    let randomstring = '';
    for (let i = 0; i < length; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

  return {
    StoreSession: StoreSession,
    ErrorResp: ErrorResp,
    SuccessResp: SuccessResp,
    Upload: Upload,
    // ProfileUpload: ProfileUpload,
    SendSMS: SendSMS,
    RandomNumber: RandomNumber,
    FileUpload: FileUpload,
  };
}
module.exports = UtilsServices();
