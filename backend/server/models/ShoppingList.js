import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, default: "1" },
  unit: { type: String, default: "pcs" },
  category: { type: String, default: "Other" },
  checked: { type: Boolean, default: false },
  estimatedCost: { type: Number, default: 0 },
});

const shoppingListSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: [itemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("ShoppingList", shoppingListSchema);
