const mongoose = require('mongoose');
const uuid4 = require('uuid4');
const Schema = mongoose.Schema;
const budgetCategorySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categories: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        percentage: {
          type: Number,
          required: true,
        },
        estimated_amount: {
          type: Number,
          required: true,
        },
        final_cost: {
          type: Number,
          required: true,
        },
        paid_amount: {
          type: Number,
          required: true,
        },
        id: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    total_estimated_amount: {
      type: Number,
      required: true,
    },
    total_final_cost: {
      type: Number,
      required: true,
    },
    total_paid_amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const budgetSubCategorySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category_id: {
      type: String,
      required: true,
      trim: true,
    },
    category_name: {
      type: String,
      required: true,
      trim: true,
    },
    total_estimated_amount: {
      type: Number,
      required: true,
    },
    total_final_cost: {
      type: Number,
      required: true,
    },
    total_paid_amount: {
      type: Number,
      required: true,
    },
    subcategory: [
      {
        subcategory_name: {
          type: String,
          required: true,
          trim: true,
        },
        percentage: {
          type: Number,
          required: true,
        },
        estimated_amount: {
          type: Number,
          required: true,
        },
        final_cost: {
          type: Number,
          required: true,
        },
        paid_amount: {
          type: Number,
          required: true,
        },
        notes: {
          type: String,
          required: false,
          default: '',
          trim: true,
        },
        id: {
          type: String,
          required: false,
          default: uuid4(),
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = {
  BudgetCategory: mongoose.model('BudgetCategory', budgetCategorySchema),
  BudgetSubCategory: mongoose.model(
    'BudgetSubCategory',
    budgetSubCategorySchema
  ),
};
