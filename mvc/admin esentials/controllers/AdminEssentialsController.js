const { replaceS3BaseUrl } = require("../../../utils");
var AdminEssentialsModel = require("../models/AdminEssentialsModel");
module.exports = {
  CreateItems: async function (req, res) {
    const data = {
      type: "Admin",
      DesktopImage: "",
      venuesDescruption: "",
      decoreDescruption: "",
      makeupDescruption: "",
      mehendiDescruption: "",
      photographerDescruption: "",
      weddingpannerDescruption: "",
    };

    try {
      const resss = await AdminEssentialsModel.create(data);
      res.status(200).send({
        data: resss,
        message: "admin essentials added successfully",
      });
    } catch (error) {
      console.error(
        "🚀 ~ file: AdminEssentialsController.js:25 ~ error:",
        error
      );
      res.status(400).send({
        data: error,
        message: "admin essentials added successfully",
      });
    }
  },

  UpdateItems: async function (req, res) {
    const DesktopImage = JSON.parse(req.body.images);
    DesktopImage.forEach((data, key) => {
      if (data.mobile === "") {
        DesktopImage[key].mobile = replaceS3BaseUrl(
          replaceS3BaseUrl(req.files[`mobile${key}`][0].location)
        );
      } else {
        DesktopImage[key].mobile = replaceS3BaseUrl(data.mobile);
      }
      if (data.tablet === "") {
        DesktopImage[key].tablet = replaceS3BaseUrl(
          req.files[`tablet${key}`][0].location
        );
      } else {
        DesktopImage[key].tablet = replaceS3BaseUrl(data.tablet);
      }
      if (data.laptop === "") {
        DesktopImage[key].laptop = replaceS3BaseUrl(
          req.files[`laptop${key}`][0].location
        );
      } else {
        DesktopImage[key].laptop = replaceS3BaseUrl(data.laptop);
      }
      if (data.desktop === "") {
        DesktopImage[key].desktop = replaceS3BaseUrl(
          req.files[`desktop${key}`][0].location
        );
      } else {
        DesktopImage[key].desktop = replaceS3BaseUrl(data.desktop);
      }
    });

    const data = {
      DesktopImage,
      venuesDescruption: req.body.venuesDescruption,
      decoreDescruption: req.body.decoreDescruption,
      makeupDescruption: req.body.makeupDescruption,
      mehendiDescruption: req.body.mehendiDescruption,
      photographerDescruption: req.body.photographerDescruption,
      weddingpannerDescruption: req.body.weddingpannerDescruption,
    };

    let condition = {
      type: "Admin",
    };
    try {
      const ress = await AdminEssentialsModel.findOneAndUpdate(condition, data);
      if (ress) {
        return res.status(200).send({
          data: ress,
          success: true,
        });
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  UpdateInHouse: async function (req, res) {
    const data = req.body.data;

    let condition = {
      type: req.body.type,
    };
    try {
      const ress = await AdminEssentialsModel.findOneAndUpdate(condition, {
        data,
      });
      if (ress) {
        return res.status(200).send({
          data: ress,
          success: true,
        });
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  UpdateInHouseAll: async function (req, res) {
    const Images = JSON.parse(req.body?.Images)
      ? JSON.parse(req.body?.Images).map((item, itemKey) => {
          return {
            description: item.description,
            image: item.image
              ? replaceS3BaseUrl(item.image)
              : replaceS3BaseUrl(req?.files[`galery${itemKey}`][0]?.location),
          };
        })
      : [];
    let albums = req.body?.album ? JSON.parse(req.body?.album) : null;
    let album2 = req.body?.albumLink ? JSON.parse(req.body?.albumLink) : [];
    albums = albums
      ? albums.map((item, itemKey) => {
          return {
            name: item.name,
            value: item.value
              .map((link, linkKey) => {
                if (req?.files[`album${itemKey}`]) {
                  return req?.files[`album${itemKey}`][linkKey]?.location;
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

        albums[key].value = [
          ...data.value.map((data) => replaceS3BaseUrl(data)),
          ...alb.map((data) => replaceS3BaseUrl(data)),
        ];
      }
    });
    data = {
      Service: req.body?.Service ? JSON.parse(req.body?.Service) : [],
      IncludedService: req.body?.IncludedService
        ? JSON.parse(req.body?.IncludedService)
        : [],
      Video: req.body?.Video ? JSON.parse(req.body?.Video) : [],
      Type: req.body?.Type ? JSON.parse(req.body?.Type) : [],
      Images,
      albums,
      People: req.body?.People ? JSON.parse(req.body?.People) : [],
      Link: req.body?.Link
        ? JSON.parse(req.body?.Link)
        : {
            instagram: "",
            youtube: "",
            pintress: "",
            linkedin: "",
            facebook: "",
          },
    };
    let condition = {
      type: req.body.type,
    };
    try {
      const ress = await AdminEssentialsModel.findOneAndUpdate(condition, {
        data,
      });
      if (ress) {
        return res.status(200).send({
          data: ress,
          success: true,
        });
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  UpdateImages: async function (req, res) {
    console.log(
      "🚀 ~ file: AdminEssentialsController.js:116 ~ JSON.parse(req.body?.Imagelink1:",
      JSON.parse(req.body?.Imagelink1),
      req.files?.image2
        ? req.files?.image2.map((item) => replaceS3BaseUrl(item.location))
        : []
    );
    let images1 = req.files?.image1
      ? req.files?.image1.map((item) => replaceS3BaseUrl(item.location))
      : [];
    images1 = [...images1, ...JSON.parse(req.body?.Imagelink1)];

    let images2 = req.files?.image2
      ? req.files?.image2.map((item) => replaceS3BaseUrl(item.location))
      : [];
    images2 = [...images2, ...JSON.parse(req.body?.Imagelink2)];

    let images3 = req.files?.image3
      ? req.files?.image3.map((item) => replaceS3BaseUrl(item.location))
      : [];
    images3 = [...images3, ...JSON.parse(req.body?.Imagelink3)];

    let condition = {
      type: req.body.type,
    };
    try {
      let data = await AdminEssentialsModel.findOne(condition);
      // data.data = data.data[0].data;
      // data = JSON.parse(JSON.stringify(data));
      data.data[0].images = images1;
      data.data[1].images = images2;
      data.data[2].images = images3;
      const ress = await AdminEssentialsModel.findOneAndUpdate(
        condition,
        data,
        {
          useFindAndModify: false,
          new: true,
        }
      );
      if (ress) {
        return res.status(200).send({
          data: ress,
          success: true,
        });
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  ///------get_OneItem
  Get_Items: async function (req, res) {
    try {
      const ress = await AdminEssentialsModel.findById(
        "64a80827bc6a7a3720a73d43"
      );
      if (ress) {
        return res.status(200).send({
          data: ress,
          success: true,
        });
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  Get_Mehendi: async function (req, res) {
    try {
      const ress = await AdminEssentialsModel.findOne({ type: "mehendi" });
      if (ress) {
        return res.status(200).send({
          data: ress,
          success: true,
        });
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  Get_Makeup: async function (req, res) {
    try {
      const ress = await AdminEssentialsModel.findOne({ type: "makeup" });
      if (ress) {
        return res.status(200).send({
          data: ress,
          success: true,
        });
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  Get_Photography: async function (req, res) {
    try {
      const ress = await AdminEssentialsModel.findOne({ type: "photography" });
      if (ress) {
        return res.status(200).send({
          data: ress,
          success: true,
        });
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  Get_Wedding: async function (req, res) {
    try {
      const ress = await AdminEssentialsModel.findOne({ type: "wedding" });
      if (ress) {
        return res.status(200).send({
          data: ress,
          success: true,
        });
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  Get_Dhol: async function (req, res) {
    try {
      const ress = await AdminEssentialsModel.findOne({ type: "dhol" });
      if (ress) {
        return res.status(200).send({
          data: ress,
          success: true,
        });
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  Get_Decore: async function (req, res) {
    try {
      const ress = await AdminEssentialsModel.findOne({ type: "decore" });
      if (ress) {
        return res.status(200).send({
          data: ress,
          success: true,
        });
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  Get_Componets: async function (req, res) {
    try {
      const ress = await AdminEssentialsModel.findOne({ type: "Components" });
      if (ress) {
        return res.status(200).send({
          data: ress,
          success: true,
        });
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  Update_Componets: async function (req, res) {
    try {
      const ress = await AdminEssentialsModel.findOne({ type: "Components" });
      if (ress) {
        const value = req.body.value;
        if (req.query.type === "Subtype") {
          if (!ress.subTypes.includes(value)) {
            ress.subTypes.push(value);

            await ress.save();
            return res.status(200).send({
              data: ress,
              success: true,
            });
          } else {
            return res.status(200).send({
              success: false,
              message: "This Subtype already exists ",
            });
          }
        } else if (req.query.type === "TextType") {
          if (!ress.TextTypes.includes(value)) {
            ress.TextTypes.push(value);

            await ress.save();
            return res.status(200).send({
              data: ress,
              success: true,
            });
          } else {
            return res.status(200).send({
              success: false,
              message: "This TextType already exists ",
            });
          }
        } else {
          if (!ress.data.includes(value)) {
            ress.data.push(value);

            await ress.save();
            return res.status(200).send({
              data: ress,
              success: true,
            });
          } else {
            return res.status(200).send({
              success: false,
              message: "This Type already exists",
            });
          }
        }
      } else {
        return res.status(400).send({
          data: "something went wrong",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        data: error,
        success: false,
      });
    }
  },
  updateall: async function (req, res) {
    try {
      const customers = await AdminEssentialsModel.find({
        type: "decore",
      });
      console.log(
        "🚀 ~ file: VenueUserControllers.js:1063 ~ customers:",
        customers
      );
      const customer = await customers.forEach(async (data1) => {
        const data = JSON.parse(JSON.stringify(data1));

        // const newAlbum = data?.data[0].albums?.map((album) => {
        //   const imgs = album?.value?.map((d) => {
        //     d = d?.replace("https://wedcell.s3.ap-south-1.amazonaws.com", "");
        //     return d;
        //   });
        //   album.value = imgs;
        //   return album;
        // });
        const newImages = data?.data[0].Images?.map((album) => {
          const imgs = album?.image?.replace(
            "https://wedcell.s3.ap-south-1.amazonaws.com",
            ""
          );
          album.image = imgs;
          return album;
        });
        // data.data[0].albums = newAlbum;
        data.data[0].Images = newImages;

        const w = {
          data: data.data,
        };
        console.log(
          "🚀 ~ file: VenueUserControllers.js:1126 ~ customer ~ w:",
          w
        );
        const a = await AdminEssentialsModel.updateOne(
          { _id: data._id },
          {
            $set: w,
          }
        );
        console.log(
          "🚀 ~ file: VenueUserControllers.js:1129 ~ customer ~ a:",
          a
        );
      });
      res.send({
        data: customer,
      });
    } catch (error) {
      console.log(`🚀 ~ file: VenueUserControllers.js:775 ~ error:`, error);
      res.send({
        success: true,
        error,
        // length: data4.length,
      });
    }
  },
};
