import mongoose from "mongoose";

const HourlyDataSchema = new mongoose.Schema({
  hour: String, // e.g., "8-9"
  pieces: Number,
  em: Number,
  am: Number,
  efficiency: Number,
});

const LineDataSchema = new mongoose.Schema({
  lineNumber: { type: String, required: true },
  articleName: { type: String, required: true },
  SAM: { type: Number, required: true },
  operator: { type: Number, required: true },
  helper: { type: Number, required: true },
  shiftTime: { type: Number, default: 480 },
  target100: { type: Number, default: 0 },
  target75: { type: Number, default: 0 },
  targetPerHour: { type: Number, default: 0 },
  otData: {
    otHours: { type: Number, default: 0 },
    otMenPower: { type: Number, default: 0 },
    otMinutes: { type: Number, default: 0 },
  },
  hourlyData: [HourlyDataSchema],
});

const HourlyProductionSchema = new mongoose.Schema({
  date: { type: String, required: true }, // e.g., "2025-01-01"
  lines: [LineDataSchema], // Array of lines
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

HourlyProductionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports =
  mongoose.models.HourlyProduction ||
  mongoose.model("HourlyProduction", HourlyProductionSchema);
