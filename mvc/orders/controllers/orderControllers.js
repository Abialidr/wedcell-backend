var OrdersServices = require("../services/orderServices");
var NotificationServices = require("../../notifications/services/notificationServices");
var ObjectId = require("mongodb").ObjectId;
var VariantModels = require("../../shop/model/variantModel");
const fs = require("fs");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const PDFDocument = require("pdfkit");
const PDFDocument = require("pdfkit-table");
const { Console } = require("console");
const { GetProducts } = require("../../shop/services/productServices");
const variantModel = require("../../shop/model/variantModel");
const ShopNowUserModels = require("../../shop now user/models/ShopNowUserModels");
const orderModels = require("../models/orderModels");
const CustomerModels = require("../../customer/models/CustomerModels");
const UserModels = require("../../users/models/UserModels");
const productModel = require("../../shop/model/productModel");
var fonts = {
  Roboto: {
    normal: "jsnode/fonts/DejaVuSans.ttf",
    bold: "jsnode/fonts/DejaVuSans-Bold.ttf",
    italics: "jsnode/fonts/DejaVuSans.ttf",
    bolditalics: "jsnode/fonts/DejaVuSans.ttf",
  },
};
const path = require("path");
// const { default: PDFDocumentWithTables } = require("pdfkit-table");

// var printer = new PdfPrinter(fonts);
module.exports = {
  CreateInvoice: async function (req, res) {
    try {
      const data = req.body;
      const total = Math.ceil(
        (data.amount * data.quantity / 100 + data.tax * data.quantity / 100 + data.shipping / 100)
      ).toString();
      console.log(data);
      const user = await CustomerModels.findById(req.user._id);
      // console.log(req.body, user)
      const logoPath = path.join(__dirname, "wedcell.png");
      const logoData = fs.readFileSync(logoPath);
      const buffers = [];

      let doc = new PDFDocument({ margin: 30, size: "A4" });

      doc.on("data", (chunk) => {
        buffers.push(chunk);
      });

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        const pdfBase64 = pdfBuffer.toString("base64");

        res.json({ pdfBase64 });
      });
      (async function () {
        const table = {
          title: "Title",
          subtitle: "Subtitle",
          headers: [
            "Product Name",
            "Sold by",
            "Amount",
            "Tax",
            "Shipping",
            "Quantity",
            "Total",
          ],
          rows: [
            [
              data.productName,
              data.companyName,
              (data.amount * data.quantity / 100).toString(),
              (data.tax * data.quantity / 100).toString(),
              (data.shipping / 100).toString(),
              data.quantity.toString(),
              total,
            ],
          ],
        };
        let yPosition = 10

        doc.image(logoData, 50, yPosition + 20, { width: 100 });
        yPosition = 100
        doc.fontSize(20).text("Invoice", { align: "center" });
        doc.font("Helvetica");
        doc.fontSize(8).text(`Invoice ID: ${data._id}`);
        doc.fontSize(8).text(`Order Date: ${data.createdAt}`);
        doc.moveDown();

        doc.fontSize(10).text("Billing Details:");
        doc.fontSize(8).text(`Name: ${data.shippingAddress.name}`);
        doc.fontSize(8).text(`Email: ${data.shippingAddress.email}`);
        doc
          .fontSize(8)
          .text(
            `Address: ${data.shippingAddress.address1}, ${data.shippingAddress.address2}`
          );
        doc.fontSize(8).text(`City: ${data.shippingAddress.city}`);
        doc.fontSize(8).text(`State: ${data.shippingAddress.state}`);
        doc.fontSize(8).text(`Country: ${data.shippingAddress.country}`);
        doc.moveDown();
        await doc.table(table, {
          columnsSize: [100, 100, 60, 60, 60, 60, 60],
        });
        doc.moveDown();
        doc.fontSize(10).text("Thank you for choosing wedcell", { align: "center" });
        // done!
        doc.end();
      })();
    } catch (error) {
      console.error("Error generating invoice:", error);
      res.send({ success: false })
    }
  },
  GetOrdersForAdmin: async (req, res) => {
    try {
      console.log(req.body.user);
      const condition = {};
      if (req.body.user) {
        const isEmail = req.body.user.includes("@");
        const query = isEmail
          ? { email: req.body.user }
          : { mobile: req.body.user };
        const customer = await CustomerModels.findOne(query);
        if (customer._id) {
          condition.userId = customer._id;
        }
        console.log(customer);
      }
      if (Object.hasOwnProperty.bind(req.body)("page")) {
        try {
          const result = await orderModels
            .find(condition)
            // .populate("shopkeeperId", ShopNowUserModels)
            .populate({ path: "productId", model: productModel })
            .populate({ path: "userId", model: CustomerModels })
            .skip((req.body.page - 1) * 20)
            .limit(20);
          console.log(result);
          const total = await orderModels.countDocuments(condition);
          res.status(200).send({
            success: true,
            message: "Products Gets Successfully",
            total,
            totalPage: Math.ceil(total / 20),
            page: req.body.page,
            pageSize: result.length,
            data: result,
          });
        } catch (error) {
          res.status(200).send({
            success: false,
            message: "Error in processing",
            data: error,
          });
        }
      } else {
        OrdersServices.GetOrders(condition)
          .then(function (result) {
            return res.json(result);
          })
          .catch(function (error) {
            console.error(error, "  - - - error = ");
            return res.json(error);
          });
      }
    } catch (error) {
      return res.json(error);
    }
  },

  CreateOrders: function (req, res) {
    var data = req.body;
    OrdersServices.CreateOrders(data)
      .then(function (result) {
        let notificationObject = {
          forUserId: data.shopkeeperId,
          userType: "admin",
          orderId: result.data._id.toString(),
          status: "Pending",
          comment: `New order added.`,
        };
        NotificationServices.SendBidEmail(
          result.data.userId,
          result.data.itemId,
          result.data
        );
        NotificationServices.CreateNotification(notificationObject)
          .then(function (resultNot) {
            return res.json(result);
          })
          .catch(function (error) {
            console.error(error, "  - - - error = ");
            return res.json(error);
          });
      })
      .catch(function (error) {
        return res.json(error);
      });
  },

  GetUserOrders: async function (req, res) {
    try {
      let arr = [];
      let condition = {};
      if (req.user.role === "admin") {
        // Handle admin condition if needed
      } else {
        condition.userId = ObjectId(req.user._id);
      }

      const result = await OrdersServices.GetUserOrders(condition);

      for (let i = 0; i < result.data.length; i++) {
        // console.log(result.data[i].itemId);
        const data = await variantModel
          .findById(result.data[i].itemId)
          .populate({ path: "vendorId", model: ShopNowUserModels });

        console.log(data);
        // const data = await GetProducts({ variants: result.data[i].itemId });
        // console.log(data);
        const updatedOrder = {
          ...result.data[i].toJSON(),
          companyName: data.vendorId.company_name,
          productName: data.productName,
          image: data.mainImages,
        };

        arr.push(updatedOrder);
      }

      return res.json(arr);
    } catch (error) {
      console.error(error, " - - - error = ");
      return res.json(error);
    }
  },

  GetOrdersCount: function (req, res) {
    try {
      let condition = {};
      if (req.user.role === "admin") {
      } else {
        condition.shopkeeperId = ObjectId(req.user._id);
      }
      OrdersServices.GetOrdersCount(condition)
        .then(function (result) {
          return res.json(result);
        })
        .catch(function (error) {
          console.error(error, "  - - - error = ");
          return res.json(error);
        });
    } catch (error) {
      return res.json(error);
    }
  },

  GetOrdersSellerdash: function (req, res) {
    console.log("JEDI", req.body);
    try {
      let condition = {};
      if (req.user.role === "admin") {
      } else {
        condition.shopkeeperId = ObjectId(req.user._id);
      }
      OrdersServices.GetOrdersPagination(
        condition,
        req.body.page,
        req.body.pageSize
      )
        .then(function (result) {
          return res.json(result);
        })
        .catch(function (error) {
          console.error(error, "  - - - error = ");
          return res.json(error);
        });
    } catch (error) {
      return res.json(error);
    }
  },
  GetOrders: function (req, res) {
    try {
      let condition = {};
      if (req.user.role === "admin") {
      } else {
        condition.shopkeeperId = ObjectId(req.user._id);
      }
      OrdersServices.GetOrders(condition)
        .then(function (result) {
          return res.json(result);
        })
        .catch(function (error) {
          console.error(error, "  - - - error = ");
          return res.json(error);
        });
    } catch (error) {
      return res.json(error);
    }
  },

  GetOrderSingle: function (req, res) {
    console.log("here", req.body);
    try {
      let condition = { _id: req.body.id };
      OrdersServices.GetOrders(condition)
        .then(function (result) {
          return res.json(result);
        })
        .catch(function (error) {
          console.log(error, "  - - - error = ");
          return res.json(error);
        });
    } catch (error) {
      return res.json(error);
    }
  },

  UpdateOrders: function (req, res) {
    try {
      let data = {
        email: req.body.email,
        phone: req.body.phone,
        firstAndLastName: req.body.firstAndLastName,
        shippingAddress: req.body.shippingAddress,
        specialInstructions: req.body.specialInstructions,
      };
      let condition = {
        _id: req.body._id,
      };
      OrdersServices.UpdateOrders(condition, data)
        .then(function (result) {
          return res.json(result);
        })
        .catch(function (error) {
          console.error(error, "  - - - error = ");
          return res.json(error);
        });
    } catch (error) {
      return res.json(error);
    }
  },

  DeleteOrders: function (req, res) {
    try {
      let data = {
        is_delete: true,
      };
      let condition = {
        _id: req.body._id,
      };
      OrdersServices.DeleteOrders(condition, data)
        .then(function (result) {
          return res.json(result);
        })
        .catch(function (error) {
          console.error(error, "  - - - error = ");
          return res.json(error);
        });
    } catch (error) {
      return res.json(error);
    }
  },

  ChangeOrderStatus: function (req, res) {
    var condition = {
      _id: req.body._id,
    };
    var data = {
      status: req.body.status,
    };
    if (data.status === "Completed") {
      OrdersServices.GetOrders(condition)
        .then(async (result0) => {
          if (result0.data.length) {
            OrderItem = result0.data[0]._doc;
            const currentUser = OrderItem.userId;
            const paymentMethods = await stripe.paymentMethods.list({
              customer: currentUser.stripeCustomer.id,
              type: "card",
            });
            try {
              const paymentIntent = await stripe.paymentIntents.create({
                amount: OrderItem.amount * 100, //times 100 because its treating everythin as cents not as usd
                currency: "usd",
                customer: currentUser.stripeCustomer.id,
                payment_method: paymentMethods.data[0].id,
                off_session: true,
                confirm: true,
              });
              NotificationServices.SendSlipEmail(
                OrderItem.userId._id,
                OrderItem.itemId._id,
                OrderItem
              );
              OrdersServices.UpdateOrders(condition, data).then(function (
                result
              ) {
                NotificationServices.SendNotification(
                  result.data.userId,
                  `Your order (${req.body._id}) was accepted from the shop owner. Order will be out for delivery soon.`
                )
                  .then(function (resultNot) {
                    return res.json(result);
                  })
                  .catch((e) => {
                    console.error(e);
                    return res.json(result);
                  });
              });
            } catch (err) {
              // Error code will be authentication_required if authentication is needed
              console.error("Error code is: ", err);
              const paymentIntentRetrieved =
                await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
            }
          }
        })
        .catch(function (error) {
          console.error(error, "  - - - error = ");
          return res.json(error);
        });
    } else {
      OrdersServices.UpdateOrders(condition, data)
        .then(function (result) {
          return res.json(result);
        })
        .catch(function (error) {
          console.error(error, "  - - - error = ");
          return res.json(error);
        });
    }
  },
};
