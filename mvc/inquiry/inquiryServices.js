var InquiryModel = require("./inquiryModel");

function InquiryServices() {
  async function GetOne(condition) {
    try {
      return await InquiryModel.findOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  // async function GetMany(condition) {
  //   try {
  //     return await InquiryModel.find(condition);
  //   } catch (error) {
  //     console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

  //     return error;
  //   }
  // }
  async function GetManyWithPagination(condition, page, skip) {
    try {
      return await InquiryModel.find(condition)
        .skip((page - 1) * skip)
        .limit(skip);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }

  async function Update(condition, data) {
    try {
      return await InquiryModel.findOneAndUpdate(condition, data, {
        useFindAndModify: false,
        new: true,
      });
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function Create(data) {
    try {
      return await InquiryModel.create(data);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function Delete(id) {
    try {
      return await InquiryModel.findByIdAndDelete(id);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function countDocuments(condition) {
    try {
      return await InquiryModel.countDocuments(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  return {
    GetOne,
    GetManyWithPagination,
    Update,
    Create,
    Delete,
    countDocuments,
  };
}

module.exports = InquiryServices();
