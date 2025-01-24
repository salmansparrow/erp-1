import mongoose from "mongoose";

const RatesSchema = new mongoose.Schema({
  cuttingRate: { type: Number, required: true },
  stitchingRate: { type: Number, required: true },
  bartackAndButtonRate: { type: Number, required: true },
  finishingRate: { type: Number, required: true },
  packingRate: { type: Number, required: true },
});

const ArticlesDataSchema = new mongoose.Schema({
  articleName: { type: String, required: true, unique: true }, // Add `unique: true`
  SAM: { type: Number, required: true },
  requiredManPower: { type: Number, required: true },
  rates: { type: RatesSchema, required: true },
  totalRate: { type: Number },
  overhead: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to calculate `totalRate`
ArticlesDataSchema.pre("save", function (next) {
  this.totalRate =
    this.rates.cuttingRate +
    this.rates.stitchingRate +
    this.rates.bartackAndButtonRate +
    this.rates.finishingRate +
    this.rates.packingRate;
  next();
});

module.exports =
  mongoose.models.ArticlesData ||
  mongoose.model("ArticlesData", ArticlesDataSchema);
