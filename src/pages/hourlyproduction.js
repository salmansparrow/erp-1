import HourlyProductionForm from "../../component/HourlyProduction/HourlyProductionForm";
import LayoutOfHourlyProduction from "../../component/Layout/Layout";

function hourlyproductionPage() {
  return (
    <>
      <LayoutOfHourlyProduction>
        <HourlyProductionForm />
      </LayoutOfHourlyProduction>
    </>
  );
}

export default hourlyproductionPage;
