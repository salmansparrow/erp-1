import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function TnaChart() {
  const data = [
    { month: "Jan", target: 30, feeding: 25, achieved: 28 },
    { month: "Feb", target: 40, feeding: 38, achieved: 42 },
    { month: "Mar", target: 35, feeding: 30, achieved: 33 },
    { month: "Apr", target: 50, feeding: 45, achieved: 48 },
    { month: "May", target: 60, feeding: 58, achieved: 55 },
    { month: "Jun", target: 70, feeding: 65, achieved: 68 },
  ];

  return (
    <div>
      <h2>TNA Target vs Feeding vs Achieved</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            strokeWidth={5} // Iski thickness alag set
            dataKey="target"
            stroke="#8884d8"
          />
          <Line
            type="monotone"
            strokeWidth={5} // Iski thickness alag set
            strokeDasharray={"6 4"}
            strokeOpacity={10}
            dataKey="feeding"
            stroke="#82ca9d"
          />
          <Line
            type="monotone"
            strokeWidth={5} // Iski thickness alag set
            strokeDasharray={"6 4"}
            dataKey="achieved"
            stroke="#ffc658"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TnaChart;
