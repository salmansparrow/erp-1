import React from "react";
import LayoutOfHourlyProduction from "../../component/Layout/Layout";
import EnhancedLineChart from "../../component/Charts/LineSumaryChart";

function LineSummary() {
  return (
    <>
      <LayoutOfHourlyProduction>
        <EnhancedLineChart />
      </LayoutOfHourlyProduction>
    </>
  );
}

export default LineSummary;
