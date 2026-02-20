var {
  GetOneCategory,
  GetManyCategory,
  UpdateCategory,
  DeleteCategory,
  CreateCategory,
  countDocumentsCategory,
  GetOneSubCategory,
  GetManySubCategory,
  UpdateSubCategory,
  DeleteSubCategory,
  CreateSubCategory,
  countDocumentsSubCategory,
} = require("../services/BudgetServices");
var uuid4 = require("uuid4");
var moment = require("moment");
module.exports = {
  CreateCategory: async function (req, res) {
    try {
      let newSubCat = req.body.subCategory.map((data) => {
        return {
          subcategory_name: data.subcategory_name,
          percentage: 0,
          estimated_amount: data.estimated_amount,
          final_cost: data.final_cost,
          paid_amount: data.paid_amount,
          notes: data.notes,
          id: uuid4(),
        };
      });
      let total_estimated_amount = newSubCat.reduce((sum, data) => {
        sum = sum + data.estimated_amount;
        return sum;
      }, 0);
      let total_final_cost = newSubCat.reduce((sum, data) => {
        sum = sum + data.final_cost;
        return sum;
      }, 0);
      let total_paid_amount = newSubCat.reduce((sum, data) => {
        sum = sum + data.paid_amount;
        return sum;
      }, 0);

      newSubCat = newSubCat.map((data) => {
        data.percentage =
          (data.estimated_amount * 100) / total_estimated_amount;
        return data;
      });

      let newCategory = {
        name: req.body.category,
        percentage: 0,
        estimated_amount: total_estimated_amount,
        final_cost: total_final_cost,
        paid_amount: total_paid_amount,
        id: uuid4(),
      };

      let subCatData = {
        category_name: newCategory.name,
        category_id: newCategory.id,
        subcategory: newSubCat,
        total_estimated_amount,
        total_final_cost,
        total_paid_amount,
        userId: req.user._id,
      };

      let catData = await GetOneCategory({
        userId: req.user._id,
      });
      catData.categories.push(newCategory);
      let categories = catData.categories;
      total_estimated_amount = categories.reduce((sum, data) => {
        sum = sum + data.estimated_amount;
        return sum;
      }, 0);
      total_final_cost = categories.reduce((sum, data) => {
        sum = sum + data.final_cost;
        return sum;
      }, 0);
      total_paid_amount = categories.reduce((sum, data) => {
        sum = sum + data.paid_amount;
        return sum;
      }, 0);

      categories = categories.map((data) => {
        data.percentage =
          (data.estimated_amount * 100) / total_estimated_amount;
        return data;
      });

      catData.categories = categories;
      catData.total_estimated_amount = total_estimated_amount;
      catData.total_final_cost = total_final_cost;
      catData.total_paid_amount = total_paid_amount;
      subCatData = await CreateSubCategory(subCatData);
      catData = await UpdateCategory(
        {
          userId: req.user._id,
        },
        catData
      );

      if (catData && subCatData) {
        res.status(200).send({
          success: true,
          data: {
            catData,
            subCatData,
          },
          message: "Budget Sub-Categorie Fetched successfully",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "No budget category found",
          data: [],
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: BudgetControllers.js:15 ~ error:`, error);

      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  CreateSubCategory: async function (req, res) {
    try {
      let newSubCat = {
        subcategory_name: req.body.subcategory_name,
        percentage: 0,
        estimated_amount: req.body.estimated_amount,
        final_cost: req.body.final_cost,
        paid_amount: req.body.paid_amount,
        notes: req.body.notes,
        id: uuid4(),
      };

      let subCatData = await GetOneSubCategory({
        userId: req.user._id,
        category_id: req.body.cid,
      });

      subCatData.subcategory.push(newSubCat);
      let subcategories = subCatData.subcategory;
      let total_estimated_amount = subcategories.reduce((sum, data) => {
        sum = sum + data.estimated_amount;
        return sum;
      }, 0);
      let total_final_cost = subcategories.reduce((sum, data) => {
        sum = sum + data.final_cost;
        return sum;
      }, 0);
      let total_paid_amount = subcategories.reduce((sum, data) => {
        sum = sum + data.paid_amount;
        return sum;
      }, 0);

      subcategories = subcategories.map((data) => {
        data.percentage =
          (data.estimated_amount * 100) / total_estimated_amount;
        return data;
      });

      subCatData.subcategory = subcategories;
      subCatData.total_estimated_amount = total_estimated_amount;
      subCatData.total_final_cost = total_final_cost;
      subCatData.total_paid_amount = total_paid_amount;

      subCatData = await UpdateSubCategory(
        {
          userId: req.user._id,
          category_id: req.body.cid,
        },
        subCatData
      );

      let catCondition = {
        userId: req.user._id,
      };

      let catData = await GetOneCategory(catCondition);

      let oneCategories = catData.categories.find((values) => {
        return values.id === req.body.cid;
      });
      oneCategories.estimated_amount = subCatData.total_estimated_amount;
      oneCategories.final_cost = subCatData.total_final_cost;
      oneCategories.paid_amount = subCatData.total_paid_amount;

      let categories = catData.categories;
      total_estimated_amount = categories.reduce((sum, data) => {
        sum = sum + data.estimated_amount;
        return sum;
      }, 0);
      total_final_cost = categories.reduce((sum, data) => {
        sum = sum + data.final_cost;
        return sum;
      }, 0);
      total_paid_amount = categories.reduce((sum, data) => {
        sum = sum + data.paid_amount;
        return sum;
      }, 0);

      categories = categories.map((data) => {
        data.percentage =
          (data.estimated_amount * 100) / total_estimated_amount;
        return data;
      });

      catData.categories = categories;
      catData.total_estimated_amount = total_estimated_amount;
      catData.total_final_cost = total_final_cost;
      catData.total_paid_amount = total_paid_amount;
      catData = await UpdateCategory(catCondition, catData);

      if (catData && subCatData) {
        res.status(200).send({
          success: true,
          data: {
            catData,
            subCatData,
          },
          message: "Budget Sub-Categorie Added successfully",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "No budget category found",
          data: [],
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: BudgetControllers.js:15 ~ error:`, error);

      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  UpdateCategory: async function (req, res) {
    try {
      let subCatCondition = {
        userId: req.user._id,
        category_id: req.body.id,
      };
      let catCondition = {
        userId: req.user._id,
      };
      let catData = await GetOneCategory(catCondition);
      let subCatData = await GetOneSubCategory(subCatCondition);

      const findedCat = catData.categories.find((data) => {
        return data.id === req.body.id;
      });
      findedCat.name = req.body.name;
      subCatData.category_name = req.body.name;
      catData = await UpdateCategory(catCondition, catData);
      subCatData = await UpdateSubCategory(subCatCondition, subCatData);
      if (catData && subCatData) {
        res.status(200).send({
          success: true,
          data: {
            catData,
            subCatData,
          },
          message: "Budget Sub-Categorie Fetched successfully",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "No budget category found",
          data: [],
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: BudgetControllers.js:15 ~ error:`, error);

      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  UpdateSubCategory: async function (req, res) {
    try {
      let subCatCondition = {
        userId: req.user._id,
        category_id: req.body.category_id,
      };

      let subCatData = await GetOneSubCategory(subCatCondition);

      let subcategories = req.body.subcategory.map((data) => {
        let subCatagory = subCatData.subcategory.find((values) => {
          return values.id === data.id;
        });
        console.log("🚀 ~ file: BudgetControllers.js:308 ~ subCatagory ~ subCatagory:", subCatagory)
        subCatagory.subcategory_name = data.subcategory_name;
        subCatagory.estimated_amount = data.estimated_amount;
        subCatagory.final_cost = data.final_cost;
        subCatagory.paid_amount = data.paid_amount;
        return subCatagory;
      });
      console.log("🚀 ~ file: BudgetControllers.js:314 ~ subcategories ~ subcategories:", subcategories)

      let total_estimated_amount = subcategories.reduce((sum, data) => {
        sum = sum + data.estimated_amount;
        return sum;
      }, 0);
      let total_final_cost = subcategories.reduce((sum, data) => {
        sum = sum + data.final_cost;
        return sum;
      }, 0);
      let total_paid_amount = subcategories.reduce((sum, data) => {
        sum = sum + data.paid_amount;
        return sum;
      }, 0);

      subcategories = subcategories.map((data) => {
        data.percentage =
          (data.estimated_amount * 100) / total_estimated_amount;
        return data;
      });
      

      subCatData.subcategory = subcategories;
      subCatData.total_estimated_amount = total_estimated_amount;
      subCatData.total_final_cost = total_final_cost;
      subCatData.total_paid_amount = total_paid_amount;

      let catCondition = {
        userId: req.user._id,
      };

      let catData = await GetOneCategory(catCondition);

      let oneCategories = catData.categories.find((values) => {
        return values.id === req.body.category_id;
      });
      oneCategories.estimated_amount = subCatData.total_estimated_amount;
      oneCategories.final_cost = subCatData.total_final_cost;
      oneCategories.paid_amount = subCatData.total_paid_amount;

      let categories = catData.categories;
      total_estimated_amount = categories.reduce((sum, data) => {
        sum = sum + data.estimated_amount;
        return sum;
      }, 0);
      total_final_cost = categories.reduce((sum, data) => {
        sum = sum + data.final_cost;
        return sum;
      }, 0);
      total_paid_amount = categories.reduce((sum, data) => {
        sum = sum + data.paid_amount;
        return sum;
      }, 0);

      categories = categories.map((data) => {
        data.percentage =
          (data.estimated_amount * 100) / total_estimated_amount;
        return data;
      });

      catData.categories = categories;
      catData.total_estimated_amount = total_estimated_amount;
      catData.total_final_cost = total_final_cost;
      catData.total_paid_amount = total_paid_amount;
      catData = await UpdateCategory(catCondition, catData);
      subCatData = await UpdateSubCategory(subCatCondition, subCatData);

      if (catData && subCatData) {
        res.status(200).send({
          success: true,
          data: {
            catData,
            subCatData,
          },
          message: "Budget Sub-Categorie Fetched successfully",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "No budget category found",
          data: [],
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: BudgetControllers.js:15 ~ error:`, error);

      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  UpdateTotal_Estimated_Amount: async function (req, res) {
    try {
      let catCondition = {
        userId: req.user._id,
      };

      let catData = await GetOneCategory(catCondition);

      let categories = catData.categories;

      categories = categories.map((data) => {
        data.estimated_amount = (data.percentage * req.body.TEA) / 100;
        return data;
      });
      console.log(
        `🚀 ~ file: BudgetControllers.js:420 ~ categories=categories.map ~ categories:`,
        categories
      );

      const subCatagories = await categories.map(async (data) => {
        let subCatCondition = {
          userId: req.user._id,
          category_id: data.id,
        };
        let subCatData = await GetOneSubCategory(subCatCondition);

        let subcategories = subCatData.subcategory;
        subcategories = subcategories.map((value) => {
          value.estimated_amount =
            (value.percentage * data.estimated_amount) / 100;
          return value;
        });
        let total_estimated_amount = subcategories.reduce((sum, data) => {
          sum = sum + data.estimated_amount;
          return sum;
        }, 0);
        subCatData.subcategory = subcategories;
        subCatData.total_estimated_amount = total_estimated_amount;
        return await UpdateSubCategory(subCatCondition, subCatData);
      });
      console.log(
        `🚀 ~ file: BudgetControllers.js:442 ~ subCatagories ~ subCatagories:`,
        subCatagories
      );
      const subCatData = await Promise.all(subCatagories);
      catData.categories = categories;
      catData.total_estimated_amount = req.body.TEA;
      catData = await UpdateCategory(catCondition, catData);

      if (catData && subCatData) {
        res.status(200).send({
          success: true,
          data: {
            catData,
            subCatData,
          },
          message: "Budget Sub-Categorie Fetched successfully",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "No budget category found",
          data: [],
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: BudgetControllers.js:15 ~ error:`, error);

      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  NotesSubCategory: async function (req, res) {
    try {
      let subCatCondition = {
        userId: req.user._id,
        category_id: req.body.cid,
      };

      let subCatData = await GetOneSubCategory(subCatCondition);

      const findedSubCat = subCatData.subcategory.find((data) => {
        return data.id === req.body.id;
      });
      findedSubCat.notes = req.body.notes;
      subCatData = await UpdateSubCategory(subCatCondition, subCatData);
      if (subCatData) {
        res.status(200).send({
          success: true,
          data: subCatData,
          message: "Budget Sub-Categorie Fetched successfully",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "No budget category found",
          data: [],
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: BudgetControllers.js:15 ~ error:`, error);

      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  DeleteCategory: async function (req, res) {
    try {
      const condition = {
        userId: req.user._id,
      };

      let data = await GetOneCategory(condition);
      let categories = data.categories.filter((values) => {
        return values.id !== req.params.id;
      });
      const total_estimated_amount = categories.reduce((sum, data) => {
        sum = sum + data.estimated_amount;
        return sum;
      }, 0);
      const total_final_cost = categories.reduce((sum, data) => {
        sum = sum + data.final_cost;
        return sum;
      }, 0);
      const total_paid_amount = categories.reduce((sum, data) => {
        sum = sum + data.paid_amount;
        return sum;
      }, 0);

      categories = categories.map((data) => {
        data.percentage =
          (data.estimated_amount * 100) / total_estimated_amount;
        return data;
      });

      const totalPer = categories.reduce((sum, data) => {
        sum = sum + data.percentage;
        return sum;
      }, 0);
      data.categories = categories;
      data.total_estimated_amount = total_estimated_amount;
      data.total_final_cost = total_final_cost;
      data.total_paid_amount = total_paid_amount;
      console.log(`🚀 ~ file: BudgetControllers.js:103 ~ data:`, data);
      data = await UpdateCategory(condition, data);

      await DeleteSubCategory({
        category_id: req.params.id,
        userId: req.user._id,
      });

      if (data) {
        res.status(200).send({
          success: true,
          data,
          message: "Budget Categorie Fetched successfully",
          totalPer,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "No budget category found",
          data: [],
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: BudgetControllers.js:15 ~ error:`, error);

      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  DeleteSubCategory: async function (req, res) {
    try {
      const id = req.params.id,
        cid = req.params.cid;

      let subCatCondition = {
        userId: req.user._id,
        category_id: cid,
      };

      let subCatData = await GetOneSubCategory(subCatCondition);

      let subcategories = subCatData.subcategory.filter((values) => {
        return values.id !== id;
      });
      let total_estimated_amount = subcategories.reduce((sum, data) => {
        sum = sum + data.estimated_amount;
        return sum;
      }, 0);
      let total_final_cost = subcategories.reduce((sum, data) => {
        sum = sum + data.final_cost;
        return sum;
      }, 0);
      let total_paid_amount = subcategories.reduce((sum, data) => {
        sum = sum + data.paid_amount;
        return sum;
      }, 0);

      subcategories = subcategories.map((data) => {
        data.percentage =
          (data.estimated_amount * 100) / total_estimated_amount;
        return data;
      });

      subCatData.subcategory = subcategories;
      subCatData.total_estimated_amount = total_estimated_amount;
      subCatData.total_final_cost = total_final_cost;
      subCatData.total_paid_amount = total_paid_amount;
      subCatData = await UpdateSubCategory(subCatCondition, subCatData);

      let catCondition = {
        userId: req.user._id,
      };

      let catData = await GetOneCategory(catCondition);

      let oneCategories = catData.categories.find((values) => {
        return values.id === cid;
      });
      oneCategories.estimated_amount = subCatData.total_estimated_amount;
      oneCategories.final_cost = subCatData.total_final_cost;
      oneCategories.paid_amount = subCatData.total_paid_amount;

      let categories = catData.categories;
      total_estimated_amount = categories.reduce((sum, data) => {
        sum = sum + data.estimated_amount;
        return sum;
      }, 0);
      total_final_cost = categories.reduce((sum, data) => {
        sum = sum + data.final_cost;
        return sum;
      }, 0);
      total_paid_amount = categories.reduce((sum, data) => {
        sum = sum + data.paid_amount;
        return sum;
      }, 0);

      categories = categories.map((data) => {
        data.percentage =
          (data.estimated_amount * 100) / total_estimated_amount;
        return data;
      });

      catData.categories = categories;
      catData.total_estimated_amount = total_estimated_amount;
      catData.total_final_cost = total_final_cost;
      catData.total_paid_amount = total_paid_amount;
      catData = await UpdateCategory(catCondition, catData);

      if (catData && subCatData) {
        res.status(200).send({
          success: true,
          data: {
            catData,
            subCatData,
          },
          message: "Budget Sub-Categorie Fetched successfully",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "No budget category found",
          data: [],
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: BudgetControllers.js:15 ~ error:`, error);

      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  GetCategory: async function (req, res) {
    try {
      const condition = {
        userId: req.user._id,
      };
      console.log(
        `🚀 ~ file: BudgetControllers.js:61 ~ condition.req.params.id:`,
        req.user._id
      );
      const data = await GetOneCategory(condition);
      if (data) {
        res.status(200).send({
          success: true,
          data,
          message: "Budget Categorie Fetched successfully",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "No budget category found",
          data: [],
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: BudgetControllers.js:15 ~ error:`, error);

      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  GetSubCategory: async function (req, res) {
    try {
      const condition = {
        userId: req.user._id,
        category_id: req.params.id,
      };
      console.log(
        `🚀 ~ file: BudgetControllers.js:61 ~ condition.req.params.id:`,
        req.params.id
      );
      const data = await GetOneSubCategory(condition);
      if (data) {
        res.status(200).send({
          success: true,
          data,
          message: "Budget Sub-Categorie Fetched successfully",
        });
      } else {
        res.status(400).send({
          success: false,
          message: "No budget category found",
          data: [],
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: BudgetControllers.js:15 ~ error:`, error);

      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
};
