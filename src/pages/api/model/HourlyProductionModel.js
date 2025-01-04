import mongoose from "mongoose";

const HourlyDataSchema = new mongoose.Schema({
  hour: String, // e.g., "8-9"
  pieces: Number,
  em: Number,
  am: Number,
  efficiency: Number,
});

const LineDataSchema = new mongoose.Schema({
  lineNumber: String,
  articleName: String,
  SAM: Number,
  operator: Number,
  helper: Number,
  shiftTime: Number,
  target100: Number,
  target75: Number,
  targetPerHour: Number,
  hourlyData: [HourlyDataSchema], // Array of hourly breakdown
});

const HourlyProductionSchema = new mongoose.Schema({
  date: { type: String, required: true }, // e.g., "2025-01-01"
  lines: [LineDataSchema], // Array of lines
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.HourlyProduction ||
  mongoose.model("HourlyProduction", HourlyProductionSchema);
