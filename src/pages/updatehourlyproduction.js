import React from "react";
import LayoutOfHourlyProduction from "../../component/Layout/Layout";
import UpdateHourlyProductionWithCalendar from "../../component/HourlyProduction/UpdateHourlyProductionForm";

function UpdateHourlyProduction() {
  return (
    <>
      <LayoutOfHourlyProduction>
        <UpdateHourlyProductionWithCalendar />
      </LayoutOfHourlyProduction>
    </>
  );
}

export default UpdateHourlyProduction;
