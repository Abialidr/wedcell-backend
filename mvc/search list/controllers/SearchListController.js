const bcrypt = require('bcrypt');
var salt = '$2b$10$pm4WmosjwhVivTDHxkCoiO';
const { otpValidationMobile } = require('../../otp/validation/OtpValidation');
const Otp = require('../../otp/models/OtpModal');
const {
  GetOne,
  GetManyWithPagination,
  UpdateUser,
  GetMany,
  CreateUser,
  countDocuments,
  RefreshUser,
} = require('../services/SearchListServices');
var config = require('../../../config/config');
var jwt = require('jsonwebtoken');
const moment = require('moment');
const SearchListModels = require('../models/SearchListModels');

module.exports = {
  fullTextSearch: async (req, res) => {
    let searchString = req.params.id;

    if (searchString) {
      const data = await SearchListModels.find(
        {
          $text: { $search: searchString },
        },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(10);

      res.status(200).send({
        success: true,
        data,
      });
    } else {
      res.status(400).send({
        message: 'Something went wrong',
        error: JSON.stringify(error),
        data: [],
        success: false,
      });
    }
  },
};
