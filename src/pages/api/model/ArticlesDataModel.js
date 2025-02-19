import mongoose from "mongoose";

const RatesSchema = new mongoose.Schema({
  cuttingRate: { type: Number, required: true },
  smallPartsRate: { type: Number, required: true },
  stitchingRate: { type: Number, required: true },
  bartackAndButtonRate: { type: Number, required: true },
  outsideCropping: { type: Number, required: true },
  insideCropping: { type: Number, required: true },
  dusting: { type: Number, required: true },
  additionalJobFolding: { type: Number, required: true },
  pressPacking: { type: Number, required: true },
  tapeSilingAttach: { type: Number, required: true },
});

const ArticlesDataSchema = new mongoose.Schema({
  modelNumber: { type: String, required: true, unique: true },
  articleName: { type: String, required: true },
  SAM: { type: Number, required: true },
  requiredManPower: { type: Number, required: true },
  rates: { type: RatesSchema, required: true },
  overhead: { type: Number, required: true },
  totalRate: { type: Number },
  totalRateWithOverHead: { type: Number },
  cutToPackCost: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to calculate total values
ArticlesDataSchema.pre("save", function (next) {
  this.totalRate = Object.values(this.rates).reduce(
    (acc, rate) => acc + rate,
    0
  );
  this.totalRateWithOverHead = this.totalRate * (1 + this.overhead / 100);
  this.cutToPackCost = this.totalRateWithOverHead;
  next();
});

module.exports =
  mongoose.models.ArticlesData ||
  mongoose.model("ArticlesData", ArticlesDataSchema);
