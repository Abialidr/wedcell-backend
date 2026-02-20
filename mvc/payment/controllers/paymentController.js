const Razorpay = require("razorpay");
var axios = require("axios");
var urlencode = require("urlencode");
var crypto = require("crypto");
const OtherModel = require("../../inhouse services/models/OtherModel");
const OppModel = require("../../other product purchase/models/oppModel");

const {
  CreateOrders,
  UpdateOrders,
  GetUserOrders,
} = require("../../orders/services/orderServices");
const { GetProducts } = require("../../shop/services/productServices");
const {
  createShipping,
  cancelShipping,
} = require("../../delhivery/service/delhiveryService");
const orderModels = require("../../orders/models/orderModels");
const {
  OrderSuccess,
  OrderCancel,
} = require("../../otp/controllers/OtpController");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createCodOrder = async (req, res) => {
  const { price } = req.body;
  const { shipping } = req.body;
  const { tax } = req.body;
  console.log("cod", req.body);
  try {
    var options = {
      amount: (Number(price) + Number(shipping) + Number(tax)) * 100,
      currency: "INR",
    };
    if (req.body.itemId) {
      const { data } = await GetProducts({ variants: req.body.itemId });
      // console.log('DATA', data);
      req.body.price = undefined;
      req.body.shipping = Math.ceil(shipping * 100);
      req.body.tax = Math.ceil(tax * 100);
      // console.log('PID', data._id)
      const orderCreated = await CreateOrders({
        ...req.body,
        productId: data[0]._id,
        paymentInfo: "cod",
        status: "Pending",
        orderStatus: "Processing",
        paymentMode: "COD",
        zipcode: req.body.shippingAddress.pincode,
        shopkeeperId: data[0].vendorId,
        amount: Math.ceil((Number(price) + Number(tax)) * 100),
      });
      const sendMsg = await OrderSuccess(
        req.body.shippingAddress.number,
        orderCreated.data._id
      );
      console.log(sendMsg);
      const shipped = await createShipping(orderCreated.data, "COD");
      await UpdateOrders(
        { _id: orderCreated.data._id },
        { waybill: shipped.packages[0].waybill }
      );
      res.send({ data: orderCreated.data });
    } else if (req.body.cart) {
      (async () => {
        const orderPromises = req.body.cart.map(async (e, i) => {
          const { data } = await GetProducts({ variants: e.variantId });
          console.log("EEE", e);
          req.body.price = undefined;

          const abc = await CreateOrders({
            ...req.body,
            size: e.size,
            productId: data[0]._id,
            quantity: e.quantity,
            itemId: e.variantId,
            weight: e.weight,
            paymentInfo: "cod",
            status: "Pending",
            orderStatus: "Processing",
            paymentMode: "COD",
            zipcode: req.body.shippingAddress.pincode,
            shopkeeperId: data[0].vendorId,
            amount: Math.ceil(Number(e.price) * 1.12 * 100),
            tax: Math.ceil(Number(e.price) * 0.12 * 100),
            shipping: Math.ceil(req.body.cartCharges[i] * 100),
          });
          const shipped = await createShipping(abc.data, "COD");
          await UpdateOrders(
            { _id: abc.data._id },
            { waybill: shipped.packages[0].waybill }
          );
          const sendMsg = await OrderSuccess(
            req.body.shippingAddress.number,
            "from your Cart"
          );
          console.log(sendMsg);
          return abc;
        });

        const orderResults = await Promise.all(orderPromises);

        console.log("Order Results", orderResults);

        res.json(orderResults[0]);
      })();
    }
  } catch (error) {
    console.error(error);
  }
};
const creatOrder = async (req, res) => {
  const { price } = req.body;
  const { shipping } = req.body;
  const { tax } = req.body;
  try {
    var options = {
      amount: (Number(price) + Number(shipping) + Number(tax)) * 100,
      currency: "INR",
    };
    const orderdetails = await instance.orders.create(options);
    if (req.body.itemId) {
      const { data } = await GetProducts({ variants: req.body.itemId });
      req.body.price = undefined;
      const orderCreated = await CreateOrders({
        ...req.body,
        productId: data[0]._id,
        paymentInfo: orderdetails.id,
        status: "Pending",
        orderStatus: "Processing",
        paymentMode: "Prepaid",
        zipcode: req.body.shippingAddress.pincode,
        shopkeeperId: data[0].vendorId,
        amount: Math.ceil((Number(price) + Number(tax)) * 100),
      });

      res.send({ data: orderdetails, order: orderCreated.data });
    } else if (req.body.cart) {
      (async () => {
        const orderPromises = req.body.cart.map(async (e, i) => {
          const { data } = await GetProducts({ variants: e.variantId });

          req.body.price = undefined;
          const abc = await CreateOrders({
            ...req.body,
            size: e.size,
            productId: data[0]._id,
            quantity: e.quantity,
            itemId: e.variantId,
            weight: e.weight,
            paymentInfo: orderdetails.id,
            status: "Pending",
            orderStatus: "Processing",
            paymentMode: "Prepaid",
            zipcode: req.body.shippingAddress.pincode,
            shopkeeperId: data[0].vendorId,
            amount: Math.ceil(Number(e.price) * 1.12 * 100),
            tax: Number(e.price) * 0.12,
            shipping: req.body.cartCharges[i],
          });
          return abc;
        });

        const orderResults = await Promise.all(orderPromises);

        console.log("Order Results", orderResults);

        res.send({ data: orderdetails, order: orderResults[0] });
      })();
    }

    // res.send(orderdetails);
  } catch (error) {
    console.error(error);
  }
};
const creatOrderOg = async (req, res) => {
  const { price } = req.body;
  // console.log(typeof amount);
  console.log(req.body);
  try {
    var options = {
      amount: Number(price) * 100,
      currency: "INR",
    };
    const orderdetails = await instance.orders.create(options);
    res.send(orderdetails);
    console.log(orderdetails);
  } catch (error) {
    console.log(error);
  }
};
const webhook = async (req, res) => {
  try {
    const event = req.body;
    const signature = req.headers["x-razorpay-signature"];
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(event))
      .digest("hex");
    if (signature == expectedSignature) {
      console.log(req.body.event);
      console.log(
        "🚀 ~ file: paymentController.js:188 ~ webhook ~ req:",
        event,
        "\n",
        signature === expectedSignature,
        "\n",
        JSON.stringify(event?.payload?.payment?.entity, null, 4)
      );
      if (req.body.event == "payment.authorized") {
        const order = await orderModels.find({
          paymentInfo: req.body.payload.payment.entity.order_id,
        });
        order.forEach(async (ord) => {
          const shipped = await createShipping(ord, "Prepaid");
          await orderModels.findByIdAndUpdate(
            ord._id,
            {
              status: "Completed",
              paymentId: req.body.payload.payment.entity.id,
              waybill: shipped.packages[0].waybill,
            },
            { new: true }
          );
        });
        if (order.length == 1) {
          const sendMsg = await OrderSuccess(
            order[0].shippingAddress.number,
            order[0]._id
          );
          console.log(sendMsg);
        } else if (order.length > 1) {
          const sendMsg = await OrderSuccess(
            order[0].shippingAddress.number,
            "from your Cart"
          );
          console.log(sendMsg);
        }
        // const order = await orderModels.updateMany(
        //   { paymentInfo: req.body.payload.payment.entity.order_id },
        //   { status: "Completed", paymentId: req.body.payload.payment.entity.id } , {new:true}
        // );
        console.log("UPDATED ORDERS", order);

        //   const shipped = await createShipping(order.data , "Prepaid")
        // await UpdateOrders(
        //   { _id: order.data._id },
        //   { waybill: shipped.packages[0].waybill}
        // );
      } else if (req.body.event == "payment.captured") {
        if (
          event?.payload?.payment?.entity?.notes?.type === "inhouse Others" &&
          event?.payload?.payment?.entity?.notes?._id
        ) {
          console.log(
            "🚀 ~ file: paymentController.js:255 ~ webhook ~ payment.captured: 456"
          );
          const r = await OtherModel.findByIdAndUpdate(
            event?.payload?.payment?.entity?.notes?._id,
            {
              status: "success",
              payment_id: event?.payload?.payment?.entity?.id,
            }
          );
        } else if (
          event?.payload?.payment?.entity?.notes?.type === "product purchase" &&
          event?.payload?.payment?.entity?.notes?._id
        ) {
          console.log(
            "🚀 ~ file: paymentController.js:255 ~ webhook ~ payment.captured: 456"
          );
          const r = await OppModel.findByIdAndUpdate(
            event?.payload?.payment?.entity?.notes?._id,
            {
              status: "success",
              payment_id: event?.payload?.payment?.entity?.id,
            }
          );
        }
      } else if (req.body.event == "payment.failed") {
        if (
          event?.payload?.payment?.entity?.notes?.type === "inhouse Others" &&
          event?.payload?.payment?.entity?.notes?._id
        ) {
          console.log(
            "🚀 ~ file: paymentController.js:255 ~ webhook ~ payment.captured: 456"
          );
          const r = await OtherModel.findByIdAndUpdate(
            event?.payload?.payment?.entity?.notes?._id,
            {
              status: "failed",
              payment_id: event?.payload?.payment?.entity?.id,
            }
          );
        } else if (
          event?.payload?.payment?.entity?.notes?.type === "product purchase" &&
          event?.payload?.payment?.entity?.notes?._id
        ) {
          console.log(
            "🚀 ~ file: paymentController.js:255 ~ webhook ~ payment.captured: 456"
          );
          const r = await OppModel.findByIdAndUpdate(
            event?.payload?.payment?.entity?.notes?._id,
            {
              status: "failed",
              payment_id: event?.payload?.payment?.entity?.id,
            }
          );
        } else {
          const order = await orderModels.updateMany(
            { paymentInfo: req.body.payload.payment.entity.order_id },
            { status: "Rejected", orderStatus: "Cancelled" }
          );
        }
      } else if (req.body.event == "refund.created") {
        const order = await orderModels.updateMany(
          { paymentInfo: req.body.payload.payment.entity.order_id },
          { status: "Refunded", orderStatus: "Refunded" }
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};
const verifyOrder = async (req, res) => {
  res.json({
    success: true,
    status: 200,
  });
};

const cancelOrder = async (req, res) => {
  if (req.body.mode === "COD") {
    const order = await UpdateOrders(
      { _id: req.body.id },
      { status: "Refunded", orderStatus: "Cancelled" },
      { new: true }
    );
    const cancelshipping = await cancelShipping(order.data.waybill);
    console.log(cancelShipping);
    const sendMsg = await OrderCancel(
      order.data.shippingAddress.number,
      order.data._id
    );
    console.log(sendMsg);
    res.json({
      success: true,
      status: 200,
    });
  } else {
    const refund = await refundOrder(req.body.paymentId, req.body.amount);
    if (refund) {
      const order = await UpdateOrders(
        { _id: req.body.id },
        { status: "Refunded", orderStatus: "Refunded" },
        { new: true }
      );
      await cancelShipping(order.data.waybill);
      const sendMsg = await OrderCancel(
        order.data.shippingAddress.number,
        order.data._id
      );
      console.log(sendMsg);
      res.json({
        success: true,
        status: 200,
      });
    } else {
      res.json({
        success: false,
        status: 200,
      });
    }
  }
};
const refundOrder = async (paymentId, refundAmount) => {
  try {
    const refund = await instance.payments.refund(paymentId, {
      amount: refundAmount,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getkeyId = async (req, res) => {
  res.json({
    key: process.env.RAZORPAY_KEY_ID,
    status: 200,
    success: true,
  });
};

module.exports = {
  getkeyId,
  verifyOrder,
  creatOrder,
  creatOrderOg,
  createCodOrder,
  webhook,
  cancelOrder,
};
