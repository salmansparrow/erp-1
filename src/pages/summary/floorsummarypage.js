import React from "react";
import LayoutOfHourlyProduction from "../../../component/Layout/Layout";
import FloorSummaryChart from "../../../component/Charts/FloorSummaryChart";

function FloorSummaryPage() {
  return (
    <>
      <LayoutOfHourlyProduction>
        <FloorSummaryChart />
      </LayoutOfHourlyProduction>
    </>
  );
}

export default FloorSummaryPage;
