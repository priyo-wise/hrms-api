import React from "react";
import Paper from "@mui/material/Paper";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  BarSeries,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";
const BarGraph = ({ data }) => {
  data ??= [];

  return (
    <>
      <Paper>
        <Chart data={data}>
          <ArgumentAxis />
          <ValueAxis />

          <BarSeries valueField="value" argumentField="argument" />
          <Animation />
        </Chart>
      </Paper>
    </>
  );
};

export default BarGraph;
