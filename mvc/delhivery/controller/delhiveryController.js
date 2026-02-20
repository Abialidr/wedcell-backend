const Razorpay = require('razorpay');
var axios = require('axios');
var urlencode = require('urlencode');
var crypto = require('crypto');
const { checkPIN, check_charges, packing_slip} = require('../service/delhiveryService');
const { GetProducts } = require('../../shop/services/productServices');

const check = async (req, res) => {
  try {
   if(req.query.pin.length>5){
    const data =  await checkPIN(req.query.pin)
   res.json(data)
   }
   else{
    res.send('Please set pincode')
   }
  } catch (error) {
    res.send(error)
  }
};
const checkCharge = async (req, res) => {
  try {
   if(req.query.pincode.length>5){
    const data =  await check_charges(req.query.pincode, req.query.weight)
   res.json(data)
   }
   else{
    res.send('Please set pincode')
   }
  } catch (error) {
    res.send(error)
  }
};

const packingSlip = async (req, res) => {
  try {
    console.log(req.query)
    const data =  await packing_slip(req.query.waybill)
   res.json(data)
   
  } catch (error) {
    res.send(error)
  }
};
// const createShipping = async (req, res) => {
//   try {
//     const data =  await check_charges(req.query.pincode, req.query.weight)
//    res.json(data)
  
//   } catch (error) {
//     res.send(error)
//   }
// };

module.exports = {
    check,
    checkCharge,
    packingSlip,
};
