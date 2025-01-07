import React from "react";
import LayoutOfHourlyProduction from "../../component/Layout/Layout";
import AddBackdatedHourlyProductionForm from "../../component/HourlyProduction/AddBackdatedHourlyProductionForm";

function AddBackdatedHourlyProduction() {
  return (
    <>
      <LayoutOfHourlyProduction>
        <AddBackdatedHourlyProductionForm />
      </LayoutOfHourlyProduction>
    </>
  );
}

export default AddBackdatedHourlyProduction;
