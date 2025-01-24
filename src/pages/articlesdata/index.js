import React from "react";
import LayoutOfHourlyProduction from "../../../component/Layout/Layout";
import ArticlesDataComponent from "../../../component/ArticlesData/ArticlesDataComponent";

function ArticlesDataPage() {
  return (
    <>
      <LayoutOfHourlyProduction>
        <ArticlesDataComponent />
      </LayoutOfHourlyProduction>
    </>
  );
}

export default ArticlesDataPage;
