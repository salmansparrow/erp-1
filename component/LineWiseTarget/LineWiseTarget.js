import { Box, Typography } from "@mui/material";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

function LineWiseTarget() {
  const data = [
    { line: 1, plantTarget: 30, feeding: 25, achievement: 28 },
    { line: 2, plantTarget: 40, feeding: 38, achievement: 42 },
    { line: 3, plantTarget: 35, feeding: 30, achievement: 33 },
    { line: 4, plantTarget: 50, feeding: 45, achievement: 48 },
    { line: 5, plantTarget: 60, feeding: 58, achievement: 55 },
    { line: 6, plantTarget: 70, feeding: 65, achievement: 68 },
    { line: 7, plantTarget: 80, feeding: 75, achievement: 78 },
    { line: 8, plantTarget: 90, feeding: 85, achievement: 88 },
    { line: 9, plantTarget: 100, feeding: 95, achievement: 98 },
    { line: 10, plantTarget: 110, feeding: 105, achievement: 108 },
    { line: 11, plantTarget: 120, feeding: 115, achievement: 118 },
  ];

  return (
    <div>
      <h2>TNA Achievement (Stitching Line Wise)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="line" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Plant Target Bar */}
          <Bar dataKey="plantTarget" fill="#8884d8" barSize={40} barGap={10}>
            <LabelList
              dataKey="plantTarget"
              position="inside"
              fill="#fff"
              fontSize={14}
            />
          </Bar>

          {/* Feeding Bar */}
          <Bar dataKey="feeding" fill="#82ca9d" barSize={40} barGap={10}>
            <LabelList
              dataKey="feeding"
              position="inside"
              fill="#fff"
              fontSize={14}
            />
          </Bar>

          {/* Achievement Bar */}
          <Bar dataKey="achievement" fill="#ffc658" barSize={40} barGap={10}>
            <LabelList
              dataKey="achievement"
              position="inside"
              fill="#fff"
              fontSize={14}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineWiseTarget;
