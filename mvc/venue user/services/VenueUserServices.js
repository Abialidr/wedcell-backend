var q = require("q");
var VenueUserModels = require("../models/VenueUserModels");

function VenueUserServices() {
  async function GetOne(condition) {
    // var deferred = q.defer();
    try {
      return await VenueUserModels.findOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function DeleteOne(id) {
    // var deferred = q.defer();
    try {
      return await VenueUserModels.findByIdAndDelete(id);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);
      return error;
    }
  }
  async function GetMany(condition) {
    // var deferred = q.defer();
    try {
      return await VenueUserModels.find(condition).sort({ priority: 1 });
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetManyWithPagination(condition, page, skip) {
    // var deferred = q.defer();
    try {
      return await VenueUserModels.find(condition)
        .sort({ priority: 1, _id: 1 })
        .skip((page - 1) * skip)
        .limit(skip);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }

  async function UpdateUser(condition, data) {
    console.log(condition, data);
    try {
      return await VenueUserModels.findOneAndUpdate(condition, data, {
        useFindAndModify: false,
        new: true,
      });
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);
      return error;
    }
  }
  async function CreateUser(data) {
    try {
      return await VenueUserModels.create(data);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function countDocuments(condition) {
    try {
      return await VenueUserModels.countDocuments(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  const RefreshUser = (user) => {
    const VenueUser = JSON.parse(JSON.stringify(user));
    delete VenueUser["password"];
    delete VenueUser["is_approved"];
    delete VenueUser["is_delete"];
    delete VenueUser["createdAt"];
    delete VenueUser["updatedAt"];
    delete VenueUser["__v"];
    return VenueUser;
  };
  return {
    GetOne,
    GetManyWithPagination,
    UpdateUser,
    GetMany,
    CreateUser,
    countDocuments,
    RefreshUser,
    DeleteOne,
  };
}

module.exports = VenueUserServices();
