var CategoryServices = require('../services/CategoryServices');
var UtilsService = require('../../utils/services/UtilsServices');
var config = require('../../../config/config');
var cryptoJs = require('crypto-js');

module.exports = {
  GetCategory: function (req, res) {
    let condition ={
      is_delete : false
    }
    CategoryServices.GetCategory(condition).then(function (result) {
      return res.json(result);
    }).catch(function (error) {
      console.error(error, '  - - - error = ');
      return res.json(error);
    })
  },

  CreateCategory: function (req, res) {
    let data = {
      name: req.body.name
    }
    CategoryServices.CreateCategory(data).then(function (result) {
      return res.json(result);
    }).catch(function (error) {
      console.error(error, '  - - - error = ');
      return res.json(error);
    })
  },

  UpdateCategory: function (req, res) {
    let data = {
      name: req.body.name
    }
    let condition = {
      _id: req.body._id
    }
    CategoryServices.UpdateCategory(condition, data).then(function (result) {
      return res.json(result);
    }).catch(function (error) {
      console.error(error, '  - - - error = ');
      return res.json(error);
    })
  },

  DeleteCategory: function (req, res) {
    let data = {
      is_delete:true
    }
    let condition = {
      _id: req.body._id
    }
    CategoryServices.DeleteCategory(condition, data).then(function (result) {
      return res.json(result);
    }).catch(function (error) {
      console.error(error, '  - - - error = ');
      return res.json(error);
    })
  }
};
