var ItemsServices = require("../services/ItemServices");
var OrderServices = require("../../orders/services/orderServices");
var UtilsService = require("../../utils/services/UtilsServices");
var config = require("../../../config/config");
var cryptoJs = require("crypto-js");
var NotificationServices = require("../../notifications/services/notificationServices");
var ObjectId = require("mongodb").ObjectId;
var ItemModels = require("../models/ItemModels");
const { replaceS3BaseUrl } = require("../../../utils");
module.exports = {
  CreateItems: function (req, res) {
    const album = req.body?.album ? JSON.parse(req.body?.album) : null;
    const data = {
      name: req.body?.name ? req.body?.name : "",
      category: req.body?.category ? req.body?.category : "",
      subCategory: req.body?.subCategory ? req.body?.subCategory : "",
      type: req.body?.type ? req.body?.type : "",
      city: req.body?.city ? req.body?.city : "",
      address: req.body?.address ? req.body?.address : "",
      images: req.files?.gallery
        ? req.files?.gallery.map((item) => replaceS3BaseUrl(item.location))
        : [],
      albums: album
        ? album.map((item, itemKey) => {
            return {
              name: item.name,
              value: item.value.map((link, linkKey) =>
                replaceS3BaseUrl(req.files[`album${itemKey}`][linkKey].location)
              ),
            };
          })
        : [],
      brochure: req.files?.brochure
        ? replaceS3BaseUrl(req.files?.brochure[0].location)
        : null,
      menu: req.files?.menu
        ? req.files?.menu.map((item) => replaceS3BaseUrl(item.location))
        : [],
      mainImage: req.files?.main
        ? replaceS3BaseUrl(req.files?.main[0].location)
        : "",
      contactEmail: req.body?.contactEmail ? req.body?.contactEmail : "",
      contactPhone: req.body?.contactPhone ? req.body?.contactPhone : "",
      zipcode: req.body?.zipcode ? req.body?.zipcode : "",
      description: req.body?.description ? req.body?.description : "",
      price: req.body?.price ? req.body?.price : "",
      vegPerPlate: req.body?.vegPerPlate ? req.body?.vegPerPlate : "",
      nonVegPerPlate: req.body?.nonVegPerPlate ? req.body?.nonVegPerPlate : "",
      amenities: req.body?.amenities ? JSON.parse(req.body?.amenities) : [],
      allowedVendors: req.body?.allowedVendors
        ? JSON.parse(req.body?.allowedVendors)
        : [],
      features: req.body?.features ? JSON.parse(req.body?.features) : [],
      vendorId: req.body?.vendorId ? req.body?.vendorId : "",
      plans: req.body?.plans ? JSON.parse(req.body?.plans) : [],
      vidLinks: req.body?.vidLinks ? JSON.parse(req.body?.vidLinks) : [],
      secondNumbers: req.body?.secondNumbers
        ? JSON.parse(req.body?.secondNumbers)
        : [],
      termsandconditions: req.body?.termsandconditions
        ? req.body?.termsandconditions
        : "",
      additionalDetails: req.body?.additionalDetails
        ? JSON.parse(req.body?.additionalDetails)
        : "",
    };

    // data.Vendor = req.user._id;
    ItemsServices.CreateItems(data)
      .then(function (result) {
        return res.json({
          data: result,
          files: req.files,
        });
      })
      .catch(function (error) {
        console.error("create", error);
        return res.json(error);
      });
    // res.status(200).send({
    //   body: data,
    // });
  },

  UpdateItems: function (req, res) {
    let data;

    // req.body?.hasOwnProperty("popular")
    if (Object.hasOwnProperty.bind(req.body)("popular")) {
      data = {
        popular: req.body.popular,
      };
    } else if (Object.hasOwnProperty.bind(req.body)("is_approved")) {
      data = {
        is_approved: req.body.is_approved,
      };
    } else if (Object.hasOwnProperty.bind(req.body)("exclusive")) {
      data = {
        exclusive: req.body.exclusive,
      };
    } else if (Object.hasOwnProperty.bind(req.body)("awarded")) {
      data = {
        awarded: req.body.awarded,
      };
    } else if (
      Object.hasOwnProperty.bind(req.body)("fourStar") &&
      Object.hasOwnProperty.bind(req.body)("fiveStar")
    ) {
      data = {
        fourStar: req.body.fourStar,
        fiveStar: req.body.fiveStar,
      };
    } else if (Object.hasOwnProperty.bind(req.body)("priority")) {
      data = {
        priority: req.body.priority,
      };
    } else {
      let albums = req.body?.album ? JSON.parse(req.body?.album) : null;
      let album2 = req.body?.albumLink ? JSON.parse(req.body?.albumLink) : [];
      albums = albums
        ? albums.map((item, itemKey) => {
            return {
              name: item.name,
              value: item.value
                .map((link, linkKey) => {
                  if (req?.files[`album${itemKey}`]) {
                    return replaceS3BaseUrl(
                      req?.files[`album${itemKey}`][linkKey]?.location
                    );
                  }
                  return null;
                })
                .filter((link) => typeof link === "string"),
            };
          })
        : [];
      albums.forEach((data, key) => {
        if (album2[key]) {
          const alb = album2[key].value.length ? [...album2[key].value] : [];

          albums[key].value = [...data.value, ...alb];
        }
      });

      let images = req.files?.gallery
        ? req.files?.gallery.map((item) => replaceS3BaseUrl(item.location))
        : [];
      images = [...images, ...JSON.parse(req.body?.galleryLink)];

      let menu = req.files?.menu
        ? req.files?.menu.map((item) => replaceS3BaseUrl(item.location))
        : [];
      menu = [...menu, ...JSON.parse(req.body?.menuLink)];

      const brochure = req.body.brochureLink
        ? req.body.brochureLink
        : req.files?.brochure
        ? replaceS3BaseUrl(req.files?.brochure[0].location)
        : "";

      const mainImage = req.body.mainLink
        ? req.body.mainLink
        : req.files?.main
        ? replaceS3BaseUrl(req.files?.main[0].location)
        : "";

      data = {
        name: req.body?.name ? req.body?.name : "",
        category: req.body?.category ? req.body?.category : "",
        subCategory: req.body?.subCategory ? req.body?.subCategory : "",
        type: req.body?.type ? req.body?.type : "",
        city: req.body?.city ? req.body?.city : "",
        address: req.body?.address ? req.body?.address : "",
        images,
        albums,
        brochure,
        menu,
        mainImage,
        contactEmail: req.body?.contactEmail ? req.body?.contactEmail : "",
        contactPhone: req.body?.contactPhone ? req.body?.contactPhone : "",
        zipcode: req.body?.zipcode ? req.body?.zipcode : "",
        description: req.body?.description ? req.body?.description : "",
        price: req.body?.price ? req.body?.price : "",
        vegPerPlate: req.body?.vegPerPlate ? req.body?.vegPerPlate : "",
        nonVegPerPlate: req.body?.nonVegPerPlate
          ? req.body?.nonVegPerPlate
          : "",
        amenities: req.body?.amenities ? JSON.parse(req.body?.amenities) : [],
        allowedVendors: req.body?.allowedVendors
          ? JSON.parse(req.body?.allowedVendors)
          : [],
        features: req.body?.features ? JSON.parse(req.body?.features) : [],
        vendorId: req.body?.vendorId ? req.body?.vendorId : "",
        plans: req.body?.plans ? JSON.parse(req.body?.plans) : [],
        vidLinks: req.body?.vidLinks ? JSON.parse(req.body?.vidLinks) : [],
        secondNumbers: req.body?.secondNumbers
          ? JSON.parse(req.body?.secondNumbers)
          : [],
        termsandconditions: req.body?.termsandconditions
          ? req.body?.termsandconditions
          : "",
        additionalDetails: req.body?.additionalDetails
          ? JSON.parse(req.body?.additionalDetails)
          : "",
      };
    }

    let condition = {
      _id: req.body._id,
    };

    ItemsServices.UpdateItems(condition, data)
      .then(function (result) {
        NotificationServices.ItemNotification(req.body._id, req.body.name).then(
          (resultNew) => {
            return res.json(resultNew);
          }
        );
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },
  GetItemsForVendors: function (req, res) {
    const data = req.body;
    let condition = { is_delete: false, vendorId: data._id };

    ItemsServices.GetItems(condition)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },
  GetItemsAll: async (req, res) => {
    console.log(req.body);
    try {
      const condition = { is_delete: false, is_approved: true };
      const {
        _id,
        category,
        type,
        city,
        subCategory,
        popular,
        price,
        isAdmin,
      } = req.body;

      // if()

      if (category && category.length) {
        condition.category = category;
      }
      if (_id && _id.length) {
        condition._id = _id;
      }
      if (city && city.length) {
        condition.city = city;
      }
      if (subCategory && subCategory.length) {
        condition.subCategory = subCategory;
      }

      if (type && type.length) {
        condition.type = type;
      }

      if (popular == true || popular == false) {
        condition.popular = popular;
      }
      if (price) {
        condition.price = { $lte: price };
      }

      if (Object.hasOwnProperty.bind(req.body)("page")) {
        try {
          const result = await ItemModels.find(condition)
            .skip((req.body.page - 1) * isAdmin ? 12 : 20)
            .limit(isAdmin ? 12 : 20);
          const total = await ItemModels.countDocuments(condition);
          res.status(200).send({
            success: true,
            message: "Items Gets Successfully",
            total,
            totalPage: Math.ceil(total / isAdmin ? 12 : 20),
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
        ItemsServices.GetItems(condition)
          .then(function (result) {
            return res.json(result);
          })
          .catch(function (error) {
            console.error(error, "  - - - error = ");
            return res.json(error);
          });
      }
    } catch (error) {
      res.send(error);
    }
  },
  GetItemsAllForAdmin: async (req, res) => {
    try {
      const condition = { is_delete: false, is_approved: true };
      const {
        _id,
        category,
        type,
        city,
        subCategory,
        popular,
        price,
        isAdmin,
      } = req.body;
      console.log(req.body);
      // if()

      if (category && category.length) {
        condition.category = category;
      }
      if (_id && _id.length) {
        condition._id = _id;
      }
      if (city && city.length) {
        condition.city = city;
      }
      if (subCategory && subCategory.length) {
        condition.subCategory = subCategory;
      }

      if (type && type.length) {
        condition.type = type;
      }

      if (popular == true || popular == false) {
        condition.popular = popular;
      }
      if (price) {
        condition.price = { $lte: price };
      }

      if (Object.hasOwnProperty.bind(req.body)("page")) {
        try {
          const result = await ItemModels.find(condition)
            .skip((req.body.page - 1) * isAdmin ? 12 : 20)
            .limit(isAdmin ? 12 : 20);
          const total = await ItemModels.countDocuments(condition);
          res.status(200).send({
            success: true,
            message: "Items Gets Successfully",
            total,
            totalPage: Math.ceil(total / isAdmin ? 12 : 20),
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
        ItemsServices.GetItems(condition)
          .then(function (result) {
            return res.json(result);
          })
          .catch(function (error) {
            console.error(error, "  - - - error = ");
            return res.json(error);
          });
      }
    } catch (error) {
      res.send(error);
    }
  },

  fullTextSearch: async (req, res) => {
    let searchString = req.params.id;

    if (searchString) {
      const condition = {};
      req.query.type ? (condition.type = req.query.type) : null;
      req.query.category ? (condition.category = req.query.category) : null;
      req.query.subCategory
        ? (condition.subCategory = req.query.subCategory)
        : null;
      req.query.price ? (condition.price = { $lte: req.query.price }) : null;
      if (Object.hasOwnProperty.bind(req.query)("page")) {
        try {
          const result = await ItemModels.find(
            {
              $text: { $search: searchString },
              ...condition,
            },
            { score: { $meta: "textScore" } }
          )
            .sort({ score: { $meta: "textScore" } })
            .skip((req.query.page - 1) * req.query.isAdmin ? 12 : 20)
            .limit(req.query.isAdmin ? 12 : 20);

          const total = await ItemModels.countDocuments({
            $text: { $search: searchString },
            ...condition,
          });
          res.status(200).send({
            success: true,
            message: "Items Gets Successfully",
            total,
            totalPage: Math.ceil(total / req.query.isAdmin ? 12 : 20),
            page: req.query.page,
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
        const data = await ItemModels.find(
          {
            $text: { $search: searchString },
            ...condition,
          },
          { score: { $meta: "textScore" } }
        )
          .sort({ score: { $meta: "textScore" } })
          .limit(10);

        res.status(200).send({
          success: true,
          data,
        });
      }
    } else {
      res.status(400).send({
        success: false,
      });
    }
  },
  DeleteItems: async function (req, res) {
    try {
      let data = {
        is_delete: req.body.is_delete,
        // is_approved: true,
      };
      let condition = {
        _id: req.body._id,
      };
      const deleted = await ItemModels.findOneAndDelete(condition);
      if (deleted) {
        res.status(200).send({
          data: deleted,
          success: true,
          message: "item deleted successfully",
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: ItemControllers.js:458 ~ error:`, error);
      res.status(400).send({
        message: "Something went wrong",
        error: JSON.stringify(error),
        data: [],
        success: false,
      });
    }
    // ItemsServices.DeleteItems(condition, data)
    //   .then(function (result) {
    //     let condition1 = { itemId: req.body._id };
    //     OrderServices.GetOrders(condition1).then(function (result1) {
    //       let ids = [];
    //       result1.data.map((k) => {
    //         ids.push(k._id);
    //       });
    //       let data = { status: 'Rejected' };
    //       let condition = { _id: { $in: ids } };
    //       OrderServices.UpdateOrders(condition, data).then(function (result1) {
    //         return res.json(result);
    //       });
    //     });
    //   })
    //   .catch(function (error) {
    //     return res.json(error);
    //   });
  },
  updateallprice: async function (req, res) {
    const CategoryDefault = {
      "Planning & Decor": [
        {
          name: "Wedding Décor",
          value: "On Request",
        },
        {
          name: "Ring Ceremony Décor",
          value: "On Request",
        },
        {
          name: "Reception Décor",
          value: "On Request",
        },
        {
          name: "Mehndi Décor",
          value: "On Request",
        },
        {
          name: "Haldi Decor",
          value: "On Request",
        },
        {
          name: "Rokka Ceremony decor",
          value: "On Request",
        },
        {
          name: "Birthday Décor",
          value: "On Request",
        },
        {
          name: "Anniversary Décor",
          value: "On Request",
        },
      ],
      Photographers: [
        {
          name: "Wedding",
          value: "On Request",
        },
        {
          name: "Ring Ceremony",
          value: "On Request",
        },
        {
          name: "Reception",
          value: "On Request",
        },
        {
          name: "Mehndi",
          value: "On Request",
        },
        {
          name: "Haldi",
          value: "On Request",
        },
        {
          name: "Rokka Ceremony",
          value: "On Request",
        },
        {
          name: "Birthday",
          value: "On Request",
        },
        {
          name: "Anniversary",
          value: "On Request",
        },
        {
          name: "Pre Wedding Shoots ",
          value: "On Request",
        },
        {
          name: "Portfolio Shoots ",
          value: "On Request",
        },
        {
          name: "Model Shoots ",
          value: "On Request",
        },
      ],
      Mehndi: [
        {
          name: "Bride Mehndi",
          value: "On Request",
        },
        {
          name: "Family Mehndi",
          value: "On Request",
        },
      ],
      Makeup: [
        {
          name: "Bride Makeup",
          value: "On Request",
        },
        {
          name: "Family Makeup",
          value: "On Request",
        },
      ],
      Venue: [
        {
          name: "Veg Menu",
          value: "On Request",
        },
        {
          name: "Non Veg Menu",
          value: "On Request",
        },
        {
          name: "Hi-Tea",
          value: "On Request",
        },
        {
          name: "Flat Lunch",
          value: "On Request",
        },
        {
          name: "Breakfast",
          value: "On Request",
        },
        {
          name: "Restaurent Lunch/Dinner",
          value: "On Request",
        },
      ],
    };
    const SubCategoryDefault = {
      "Invitation Gift": [
        {
          name: "Invitation Card ",
          value: "On Request",
        },
        {
          name: "Special Gift Hamper",
          value: "On Request",
        },
      ],
      "Bridal Jwellery on Rent": [
        {
          name: "Bridal Jewellery on Rent",
          value: "On Request",
        },
      ],
      "Wedding Planners": [
        {
          name: "Venue Booking Service",
          value: "On Request",
        },
        {
          name: "Plan any Single Event ",
          value: "On Request",
        },
        {
          name: "Plan wedding Event Only ",
          value: "On Request",
        },
        {
          name: "Plan Destination Wedding ",
          value: "On Request",
        },
        {
          name: "Plan Birthday Event ",
          value: "On Request",
        },
        {
          name: "Plan Anniversary Event ",
          value: "On Request",
        },
      ],
      "Celebrities Management": [
        {
          name: "Local Singer ",
          value: "On Request",
        },
        {
          name: "Bollywood Singer ",
          value: "On Request",
        },
        {
          name: "Punjabi Singer ",
          value: "On Request",
        },
        {
          name: "Bollywood Actor ",
          value: "On Request",
        },
        {
          name: "Bollywood Actress ",
          value: "On Request",
        },
      ],
      "Hospitality Service": [
        {
          name: "Indian Hostess",
          value: "On Request",
        },
        {
          name: "Rusian Hostess",
          value: "On Request",
        },
        {
          name: "Russion Artist",
          value: "On Request",
        },
        {
          name: "Ground Staff",
          value: "On Request",
        },
        {
          name: "Personal Assistant",
          value: "On Request",
        },
      ],
      "Chaat Counter": [
        {
          name: "Per Chat Counter ",
          value: "On Request",
        },
      ],
      "Pan Counter": [
        {
          name: "Basic Pan Counter",
          value: "On Request",
        },
        {
          name: "Special Pan Counter ",
          value: "On Request",
        },
      ],
      "Invitation Card": [
        {
          name: "Invitation Card",
          value: "On Request",
        },
        {
          name: "Designer Invitation Card",
          value: "On Request",
        },
      ],
      "Catering services": [
        {
          name: "Veg Per Plat",
          value: "On Request",
        },
        {
          name: "Non Veg Per Plat ",
          value: "On Request",
        },
        {
          name: "Flat Lunch ",
          value: "On Request",
        },
        {
          name: "Hi-Tea",
          value: "On Request",
        },
        {
          name: "Breakfast ",
          value: "On Request",
        },
      ],
      "Fruit Counter": [
        {
          name: "Indian Fruits ",
          value: "On Request",
        },
        {
          name: "Imported Fruits ",
          value: "On Request",
        },
      ],
      Cake: [
        {
          name: "Normal Cake ",
          value: "On Request",
        },
        {
          name: "Celebrity Cake ",
          value: "On Request",
        },
        {
          name: "Designer Cake ",
          value: "On Request",
        },
        {
          name: "Hanging Cake ",
          value: "On Request",
        },
      ],
      "Bar Tenders": [
        {
          name: "Indian Male Bar Tender ",
          value: "On Request",
        },
        {
          name: "Indian Female Bar Tender ",
          value: "On Request",
        },
        {
          name: "Russian Male Bar Tender ",
          value: "On Request",
        },
        {
          name: "Russian  Female Bar Tender ",
          value: "On Request",
        },
      ],
      Anchor: [
        {
          name: "Wedding Achoring ",
          value: "On Request",
        },
        {
          name: "Travel",
          value: "On Request",
        },
        {
          name: "Stay",
          value: "On Request",
        },
        {
          name: "Food",
          value: "On Request",
        },
      ],
      Choreographer: [
        {
          name: "Wedding Choregrapher ",
          value: "On Request",
        },
        {
          name: "Travel",
          value: "On Request",
        },
        {
          name: "Stay",
          value: "On Request",
        },
        {
          name: "Food",
          value: "On Request",
        },
      ],
      DJ: [
        {
          name: "DJ Player",
          value: "On Request",
        },
        {
          name: "Noraml DJ",
          value: "On Request",
        },
        {
          name: "DJ With LED Screen & Perfomance Stage",
          value: "On Request",
        },
      ],
      "Ghodi & Baggi": [
        {
          name: "Ghodi ",
          value: "On Request",
        },
        {
          name: "Baggi",
          value: "On Request",
        },
      ],
      "Band Baja": [
        {
          name: "Band with 11 Team ",
          value: "On Request",
        },
        {
          name: "Band with 21 Team ",
          value: "On Request",
        },
        {
          name: "Band with 31 Team ",
          value: "On Request",
        },
        {
          name: "Band with 51 Team ",
          value: "On Request",
        },
      ],
      Dhol: [
        {
          name: "Local Dhol",
          value: "On Request",
        },
        {
          name: "Artist Dhol",
          value: "On Request",
        },
      ],
    };

    const result = await ItemModels.find();
    const resss = result.map(async (item, index) => {
      const data = {};
      if (item.type === "Vendor") {
        data.termsandconditions =
          "Booking Policy\n•    Pay 30% of the package price to book the package,\n•    Pay 50% amount before 15days of event \n•    Rest to be paid on the day of the event\n\nCancellation Policy\n•    This booking is non-cancellable. However the booking can be moved to another date at no extra charge.\n•    Advanced can be adjustable in future event if you plan any event with us\n \nTerms\n•    Transportation charges: No transportation charges apply within city. If the event is outside city, Travel & Stay charges shall be borne by the client. \n\n•    After booking confirmation, if you wish to change/alter your booked services in any way (e.g. your chosen event dates or location), we will do our utmost to accommodate these changes but it may not always be possible. Any request for changes must be in writing from the person who made the booking. All costs incurred due to amendments will be borne by you.";
        if (item.category === "Makeup") {
          data.plans = CategoryDefault["Makeup"];
        }
        if (item.category === "Mehndi") {
          data.plans = CategoryDefault["Mehndi"];
        }
        if (item.category === "Photographers") {
          data.plans = CategoryDefault["Photographers"];
        }
        if (item.category === "Planning & Decor") {
          data.plans = CategoryDefault["Planning & Decor"];
        }
        if (item.subCategory === "Invitation Gift") {
          data.plans = SubCategoryDefault["Invitation Gift"];
        }
        if (item.subCategory === "Bridal Jwellery on Rent") {
          data.plans = SubCategoryDefault["Bridal Jwellery on Rent"];
        }
        if (item.subCategory === "Wedding Planners") {
          data.plans = SubCategoryDefault["Wedding Planners"];
        }
        if (item.subCategory === "Celebrities Management") {
          data.plans = SubCategoryDefault["Celebrities Management"];
        }
        if (item.subCategory === "Hospitality Service") {
          data.plans = SubCategoryDefault["Hospitality Service"];
        }
        if (item.subCategory === "Chaat Counter") {
          data.plans = SubCategoryDefault["Chaat Counter"];
        }
        if (item.subCategory === "Pan Counter") {
          data.plans = SubCategoryDefault["Pan Counter"];
        }
        if (item.subCategory === "Invitation Card") {
          data.plans = SubCategoryDefault["Invitation Card"];
        }
        if (item.subCategory === "Catering services") {
          data.plans = SubCategoryDefault["Catering services"];
        }
        if (item.subCategory === "Fruit Counter") {
          data.plans = SubCategoryDefault["Fruit Counter"];
        }
        if (item.subCategory === "Cake") {
          data.plans = SubCategoryDefault["Cake"];
        }
        if (item.subCategory === "Bar Tenders") {
          data.plans = SubCategoryDefault["Bar Tenders"];
        }
        if (item.subCategory === "Anchor") {
          data.plans = SubCategoryDefault["Anchor"];
        }
        if (item.subCategory === "Choreographer") {
          data.plans = SubCategoryDefault["Choreographer"];
        }
        if (item.subCategory === "DJ") {
          data.plans = SubCategoryDefault["DJ"];
        }
        if (item.subCategory === "Ghodi & Baggi") {
          data.plans = SubCategoryDefault["Ghodi & Baggi"];
        }
        if (item.subCategory === "Band Baja") {
          data.plans = SubCategoryDefault["Band Baja"];
        }
        if (item.subCategory === "Dhol") {
          data.plans = SubCategoryDefault["Dhol"];
        }
      } else {
        data.termsandconditions =
          "Booking & Payment\n\n•    Advance: 50% of total Fee to be paid for booking the venue\n•    Remaining Booking Amount: to be paid at least 30 days prior to the event date(100% Booking Fee).\n•    Tax as applicable.\n•    Bookings are done on first come first server basis.\n•    Booking Confirmation Receipt will be given to client after Advance booking.\n•    Payment Mode: Cash, Bank Transfer(NEFT), Demand Draft are accepted.\n\nFacilities:\n\n•    Banquet Timings: Morning 8 a.m – 5 a.m & Evening 7 Pm till  Next Day (Extra charges for additional hours).\n•    Client must inspect the premises prior to taking possession. Similarly the venue is expected to be vacated in the same condition as it was handover to them.\n•    Client will be fully responsible for all liabilities, including food or any damage to the building, carpeting, equipments or other furnishings.\n•    Damage repair charges will be evaluated as per present market value & to be deducted from the Security deposit.\n•    Management is not responsible for any mishap. Natural Calamities and theft.\n•    Music system: 5 p.m- 10 p.m sharp.\n•    For DJ/Orchestra/ Any musical arrangement, guest has to arrange all valid licenses & permission . Asmi shall take no responsibility for the same.\n•    All statutory permission (police, sound, excise etc.) will sole responsibility of client, copy of such permission will have to be presented in the office before 3 days of the event.\n•    Smoking or Spitting of paan, gutkhas and other tobacco consumption is strictly prohibited inside the banquet premises.\n•    Spitting in the venue would attract the penalty of Rs.1,000/-.\n•    Venue representatives have the exclusive rights to restrict entry of certain guests into the premises.\n•    No animals and pets are permitted in the premises.\n•    Firearms and weapons are not allowed in the premises.\n•    Fireworks & firecrackers are strictly prohibited.";
        data.plans = CategoryDefault["Venue"];
      }

      const updateRes = await ItemModels.findByIdAndUpdate(item._id, data);
      return updateRes;
    });
    res.send({
      success: true,
      data: await Promise.all(resss),
    });
  },
};
