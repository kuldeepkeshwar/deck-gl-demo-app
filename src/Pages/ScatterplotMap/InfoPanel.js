import React from "react";

import Loader from "./../../Components/Loader";
export default function InfoPanel({ data = [], loading }) {
  return (
    <div className="info-panel top-right">
      <h3>Every Person in New York City</h3>
      <p>
        Each dot represents 10 people.Density per tract from 2015 census data
      </p>
      <p>
        Data source: <a href="http://www.census.gov">US Census Bureau</a>
      </p>
      <div className="layout">
        <div className="stat col-1-2">
          No.of Instances
          <b>{data.length}</b>
        </div>
        {loading && <Loader />}
      </div>
    </div>
  );
}
