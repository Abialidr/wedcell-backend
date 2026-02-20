var express = require("express");
var ProductRouter = express.Router();
var auth = require("../../../middleware/auth");
const productController = require("../controller/productController");
const uploadMulter = require("../../../middleware/imageUpload");
const album = [];
const video = [];
const main = [];
for (let index = 0; index < 100; index++) {
  album.push({
    name: `album${index}`,
    maxCount: 50,
  });
  video.push({
    name: `video${index}`,
    maxCount: 50,
  });
  main.push({
    name: `main${index}`,
    maxCount: 50,
  });
}

ProductRouter.post(
  "/create",
  [auth, uploadMulter.fields([...album, ...video, ...main])],
  productController.CreateProducts
);

ProductRouter.post(
  "/update",
  [auth, uploadMulter.fields([...album, ...video, ...main])],
  productController.UpdateProducts
);
ProductRouter.post(
  "/updateVariants",
  [
    auth,
    uploadMulter.fields([
      {
        name: `album`,
        maxCount: 50,
      },
      {
        name: `video`,
        maxCount: 50,
      },
      {
        name: `main`,
        maxCount: 50,
      },
    ]),
  ],
  productController.UpdateVariants
);
ProductRouter.post("/delete", auth, productController.DeleteProducts);
ProductRouter.delete(
  "/deleteVariant/:id",
  auth,
  productController.DeleteVariants
);

ProductRouter.post("/get", productController.GetProducts);
ProductRouter.post("/getoneproduct", productController.Get_Product);
ProductRouter.get("/getoneproduct", productController.Get_Product1);
ProductRouter.post("/getvariant", productController.GetVariantSingle);
ProductRouter.post("/getall", productController.GetProductsAll);
ProductRouter.get("/getall", productController.GetProductsAll1);

ProductRouter.post("/getallforadmin", productController.GetProductsForAdmin);
ProductRouter.post("/gettopsellers", productController.GetTopSellers);
ProductRouter.post("/gettopcity", productController.GetTopOrdersByCity);
ProductRouter.post("/getordersbymonth", productController.GetOrdersByMonth);
ProductRouter.get("/fullTextSearch/:id", productController.fullTextSearch);
ProductRouter.put("/updateall", productController.updateall);

ProductRouter.post(
  "/create-other-products",
  [
    auth,
    uploadMulter.fields([
      {
        name: `album`,
        maxCount: 50,
      },
      {
        name: `video`,
        maxCount: 50,
      },
      {
        name: `main`,
        maxCount: 50,
      },
    ]),
  ],
  productController.CreateOtherProducts
);
ProductRouter.post(
  "/update-other-products",
  [
    auth,
    uploadMulter.fields([
      {
        name: `album`,
        maxCount: 50,
      },
      {
        name: `video`,
        maxCount: 50,
      },
      {
        name: `main`,
        maxCount: 50,
      },
    ]),
  ],
  productController.UpdateOtherProducts
);
ProductRouter.post(
  "/get-other-products-for-admin",
  productController.GetOtherProductsForAdmin
);
ProductRouter.delete(
  "/delete-other-products/:id",
  auth,
  productController.DeleteOtherProducts
);
ProductRouter.post(
  "/get-one-other-products",
  productController.Get_Single_Other_Product
);
ProductRouter.get(
  "/get-one-other-products",
  productController.Get_Single_Other_Product_Client
);
ProductRouter.get(
  "/get-all-other-products",
  productController.Get_All_Other_Product_Client
);
ProductRouter.get(
  "/fullTextSearch-other-products/:id",
  productController.full_Text_Search_Other_Product
);

ProductRouter.post("/get-other-products", productController.Get_Other_Products);

module.exports = ProductRouter;
