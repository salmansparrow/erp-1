import NavHourlyProduction from "../Common/NavHourlyProduction";

function LayoutOfHourlyProduction({ children }) {
  return (
    <>
      <NavHourlyProduction />
      {children}
    </>
  );
}

export default LayoutOfHourlyProduction;
