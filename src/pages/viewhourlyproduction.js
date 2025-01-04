import HourlyProductionDisplay from "../../component/HourlyProduction/HourlyProductionDisplay";
import LayoutOfHourlyProduction from "../../component/Layout/Layout";

function ViewHourlyProduction() {
  return (
    <>
      <LayoutOfHourlyProduction>
        <HourlyProductionDisplay />
      </LayoutOfHourlyProduction>
    </>
  );
}

export default ViewHourlyProduction;
