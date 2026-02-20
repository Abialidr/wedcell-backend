const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    mainImage: { type: String, required: false, trim: false, default: "" },
    type: { type: String, required: false, trim: true, default: "" },        
    category: { type: String, required: false, trim: true, default: "" },    
    description: { type: String, required: false, trim: true, default: "" },
    status: { type: String, required: false, trim: true, default: "Active" },
    rank: { type: String, required: false, trim: true, default: "1" },   
    url: { type: String, required: false, trim: true, },  
    keywords: [],  
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    is_delete: { type: Boolean, required: false, trim: true, default: false },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
module.exports = mongoose.model("Blog", BlogSchema);
