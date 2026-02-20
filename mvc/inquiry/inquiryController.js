const asyncHandler = require("express-async-handler");
const {
  Create,
  GetOne,
  Delete,
  GetManyWithPagination,
  countDocuments,
} = require("./inquiryServices");

const registerInquiry = asyncHandler(async (req, res) => {
  try {
    const { pName, email, city, mNo, description } = req.body;
    if (!pName || !email || !city || !mNo || !description) {
      res.status(400);
      throw new Error("Please Provide All Credentials");
    }
    const InquiryExist = await GetOne({ email });
    if (InquiryExist) {
      res.status(400);
      throw new Error("Inquiry with this email already exist");
    }
    const Inquiry = await Create({
      pName,
      email,
      city,
      mNo,
      description,
    });
    if (Inquiry) {
      res.status(200).send({
        data: Inquiry,
        message: "Inquiry Created Succesfully",
      });
    } else {
      res.status(400);
      throw new Error("Failed Creating Inquiry");
    }
  } catch (error) {
    console.log("🚀 ~ registerInquiry ~ error:", error);
    res.status(400);
    throw new Error("Error");
  }
});

const deleteInquiry = asyncHandler(async (req, res) => {
  try {
    if (!req.query.id) {
      res.status(400).send({
        message: "id not given",
      });
    }
    const id = req.query.id;
    let Inquiry = await GetOne({ _id: id });

    if (Inquiry) {
      Inquiry = await Delete(id);
      return res.status(200).send({
        data: Inquiry,
        message: "Inquiry Deleted Succesfully",
      });
    } else {
      return res.status(400).send({
        data: Inquiry,
        message: "Falied Deleting Inquiry",
      });
    }
  } catch (e) {
    console.log("🚀 ~ deleteInquiry ~ e:", e);
    res.status(400);
    throw new Error(e);
  }
});

const allInquiry = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const skip = 5;
    const keyWord = req.query.search
      ? {
          $or: [
            { pName: { $regex: req.query.search, $options: "i" } },
            {
              email: { $regex: req.query.search, $options: "i" },
            },
          ],
        }
      : {};
    if (!id) {
      const Inquirys = await GetManyWithPagination(keyWord, page, skip);
      const total = await countDocuments(keyWord);
      if (Inquirys.length > 0) {
        return res.status(200).send({
          data: Inquirys,
          total,
          totalPage: Math.ceil(total / 5),
          page: page,
          pageSize: Inquirys.length,
          message: "Inquiry fetched successfully",
          success: true,
        });
      } else {
        return res.status(200).send({
          data: [],
          message: "no Inquiry Found",
          success: false,
        });
      }
    } else {
      const Inquiry = await GetOne({ _id: id });
      if (Inquiry) {
        res.status(200).send({
          data: Inquiry,
          message: "One Inquiry Fetch Successful",
        });
      } else {
        res.status(400).send({
          mssage: "No Inquiry Found",
        });
      }
    }
  } catch (error) {
    console.log("🚀 ~ allInquiry ~ error:", error);
  }
});

module.exports = {
  registerInquiry,
  deleteInquiry,
  allInquiry,
};
