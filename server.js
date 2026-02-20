"use strict";
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
// require("./db/db");
const socketIo = require("socket.io");
var swaggerDoc = require("swagger-ui-express");
var swaggerDocmantation = require("./mvc/helper/documentation.js");
const mongoose = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv/config");
const socketServ = require("./socket");
const cors = require("cors");
const { categories, subcategories } = require("./lib/defaulVariables");
const StudentRouter = require("./mvc/student/routes/StudentRoutes");
const OtpRouter = require("./mvc/otp/routes/OtpRoutes");
const UsersRouter = require("./mvc/users/routes/UserRoutes");
const CustomerRouter = require("./mvc/customer/routes/CustomerRoutes");
const BlogRoutes = require("./mvc/blogs/routes/BlogRoutes");
const ProductRoutes = require("./mvc/shop/routes/route");
const adminRouter = require("./mvc/admin/routes/route");
const cartRouter = require("./mvc/cart/routes/CartRoutes");
const wishlistRouter = require("./mvc/wishlist/routes/WishlistRoutes.js");
const hiredVendorRouter = require("./mvc/hiredVendor/routes/HiredVendorRoutes.js");
const EventRouter = require("./mvc/event/routes/EventRoutes");
const reviewRouter = require("./mvc/review/routes/reviewRouter.js");
const paymentRouter = require("./mvc/payment/routes/paymentRoute.js");
const ContactRouter = require("./mvc/contact/routes/contactRoutes.js");
const AdminEssentialsRouter = require("./mvc/admin esentials/routes/AdminEssentialsRouter.js");
const TodoRoutes = require("./mvc/todos/routes/TodoRoutes.js");
const BudgetRouter = require("./mvc/budget/routes/BudgetRoutes.js");
const ShopNowUserRoutes = require("./mvc/shop now user/routes/ShopNowUserRoutes.js");
const VendorUserRoutes = require("./mvc/vendor user/routes/VendorUserRoutes.js");
const DecorListingRoutes = require("./mvc/DecorListing/routes/VendorUserRoutes.js");
const VenueUserRoutes = require("./mvc/venue user/routes/VenueUserRoutes.js");
const InvitationRouter = require("./mvc/invitation/routes/InvitationRoutes.js");
const SearchListRoutes = require("./mvc/search list/routes/SearchListRoutes.js");
const DelhiveryRouter = require("./mvc/delhivery/routes/delhiveryRoutes.js");
const inquiryRouter = require("./mvc/inquiry/inquiryRouter.js");

//not used yet
const DashboardRoutes = require("./mvc/dashboard/routes/dashboardRoutes");
const CategoryRouter = require("./mvc/category/routes/CategoryRoutes");
const EmailRouter = require("./mvc/email/routes/email.routes");
const emailAdd = require("./mvc/emailVerification/routes/emailVerificationRoutes");
const OrdersRouter = require("./mvc/orders/routes/orderRoutes");
const SubscriptionRoutes = require("./mvc/subscription/routes/SubscriptionRoutes");
const QuotationRouter = require("./routes/quotations");
const GuestRouter = require("./mvc/guests/routes/GuestRoutes.js");
const auth = require("./middleware/auth.js");
const InhouseRouter = require("./mvc/inhouse services/routes/InhouseRoutes.js");
const OppRouter = require("./mvc/other product purchase/routes/oppRoutes.js");
const InviteRouter = require("./mvc/invites/routes/InvitesRoutes.js");
const ImviteImgRouter = require("./mvc/invitesImages/routes/InvitesImgRoutes.js");
const TemplatesRouter = require("./mvc/templat/routes/templatesRoutes.js");
const InviteTextRouter = require("./mvc/inviteText/routes/InviteTextRoutes.js");
const FamilyRouter = require("./mvc/family/routes/FamilyRoutes.js");
const HandlerRouter = require("./mvc/HandlerUser/routes/HandlerRoutes.js");
// const CORS = require("cors")({
//   origin: [
//     "https://wedcell.com",
//     "https://www.wedcell.com",
//     "https://www.admin.wedcell.com",
//     "https://admin.wedcell.com",
//     "http://localhost:3000",
//     "http://localhost:3001",
//     "https://admin-beta.wedcell.com",
//     "https://frontend-beta.wedcell.com",
//     "https://vendors.wedcell.com",
//   ],
// });

var port = process.env.PORT || 8080;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Customer API",
      description: "Customer API Information",
      contact: {
        name: " Developer",
      },
      servers: [`http://localhost:${port}`],
    },
  },
  // ['.routes/*.js']
  apis: [
    "./mvc/admin/routes/*.js",
    "./mvc/blogs/routes/*.js",
    "./mvc/category/routes/*.js",
    "./mvc/dasboard/routes/*.js",
    "./mvc/email/routes/*.js",
    "./mvc/items/routes/*.js",
    "./mvc/orders/routes/*.js",
    "./mvc/Payment/routes/*.js",
    "./mvc/shop/routes/*.js",
    "./mvc/subscription/routes/*.js",
    "./mvc/users/routes/*.js",
    "./mvc/cart/routes/*.js",
  ],
};

var app = express();
app.use(cors({ origin: "*" }));
app.use("/documentations", swaggerDoc.serve);
app.use("/documentations", swaggerDoc.setup(swaggerDocmantation));

mongoose.connect(
  process.env.PROXY,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

app.use(logger("dev"));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({
    parameterLimit: 10000000000000000000,
    limit: "1000mb",
    extended: true,
  })
);
// app.use(fileUpload());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/", express.static("public"));
app.get("/", auth, (req, res) => {
  res.status(200).send({ success: true, message: "ok" });
});
app.get("/checkDef", (req, res) => {
  res.status(200).send({ success: true, data: { categories, subcategories } });
});

app.use("/admin", adminRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
app.use("/hiredVendor", hiredVendorRouter);
app.use("/student", StudentRouter);
app.use("/invites", InvitationRouter);
app.use("/invite", InviteRouter);
app.use("/otp", OtpRouter);
app.use("/event", EventRouter);
app.use("/customers", CustomerRouter);
app.use("/globalsearch", SearchListRoutes);
app.use("/shopnowuser", ShopNowUserRoutes);
app.use("/vendoruser", VendorUserRoutes);
app.use("/decor", DecorListingRoutes);
app.use("/venueuser", VenueUserRoutes);
app.use("/blog", BlogRoutes);
app.use("/product", ProductRoutes);
app.use("/rr", reviewRouter);
app.use("/adminessentials", AdminEssentialsRouter);
app.use("/todos", TodoRoutes);
app.use("/budget", BudgetRouter);
app.use("/guests", GuestRouter);
app.use("/inhouse", InhouseRouter);
app.use("/opp", OppRouter);
app.use("/api/v1", paymentRouter);
app.use("/delivery", DelhiveryRouter);
app.use("/inviteImg", ImviteImgRouter);
app.use("/template", TemplatesRouter);
app.use("/inviteText", InviteTextRouter);
app.use("/family", FamilyRouter);
app.use("/contacts", ContactRouter);
app.use("/inquiry", inquiryRouter);

//not used yet
app.use("/handler", HandlerRouter);
// app.use("/dashboard", DashboardRoutes);
app.use("/category", CategoryRouter);
app.use("/email2", emailAdd);
// app.use("/quotations", QuotationRouter);
app.use("/subscription", SubscriptionRoutes);
// app.use("/order", OrdersRouter);
app.use("/email", EmailRouter);

//not used at all
// app.use("/item", ItemRouter);
app.use("/users", UsersRouter);
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerDoc.serve, swaggerDoc.setup(swaggerDocs));

/**
 * { START THE SERVER }
 *
 */
const server = app.listen(port, function () {
  console.log("server is running on port", port);
});

// const io = socketIo(server);

socketServ(server);
module.exports = app;
