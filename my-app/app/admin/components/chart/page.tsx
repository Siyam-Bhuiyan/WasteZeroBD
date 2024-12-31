import React from "react";
import "./chart.css";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string; // Explicitly define that each object in `data` has a `name` property of type `string`
  [key: string]: string | number; // Allow other keys to be of type `string` or `number`
}

interface ChartProps {
  title: string;
  data: ChartData[]; // Use the `ChartData` interface
  dataKey: string;
  grid?: boolean; // Optional property
}

const Chart: React.FC<ChartProps> = ({ title, data, dataKey, grid }) => {
  return (
    <div className="chart">
      <h3 className="chartTitle">{title}</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="green" />
          <Line type="monotone" dataKey={dataKey} stroke="red" />
          <Tooltip />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
