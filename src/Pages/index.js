import React from "react";
import Basic from "./Basic";
import ScatterplotMap from "./ScatterplotMap";
import HexagonLayer from "./HexagonLayer";
import TimeLine from "./TimeLine";

const Home = () => <h2 className="title">Demo App to showcase deck.gl</h2>;

export default [
  {
    path: "/",
    exact: true,
    component: Home,
    label: "Home"
  },
  {
    path: "/basic/",
    exact: true,
    component: Basic,
    label: "Basic"
  },
  {
    path: "/scatterplot/",
    exact: true,
    component: ScatterplotMap,
    label: "Scatterplot Layer"
  },
  {
    path: "/hexagon-layer/",
    exact: true,
    component: HexagonLayer,
    label: "Hexagon Layer"
  },
  {
    path: "/time-line/",
    exact: true,
    component: TimeLine,
    label: "Time Line"
  }
];
