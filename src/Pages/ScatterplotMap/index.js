/// app.js
import React from "react";
import {fetchJson} from "../../utils";
import Map from "./Map";
import InfoPanel from "./InfoPanel";

// Set your mapbox access token here
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

// Source data CSV
const DATA_URL ="/data/scatterplot.json";
 
// Initial viewport settings
const initialViewState = {
  longitude: -74.01790928,
  latitude: 40.70383152,
  zoom: 10,
  // maxZoom: 16,
  pitch: 0,
  bearing: 0
};

export default class Container extends React.Component {
  state = { data: null };
  async componentDidMount() {
    const {data} = await fetchJson(DATA_URL);
    this.setState({
      data
    });
  }
  render() {
    const data = this.state.data;
    return (
      <div>
        <InfoPanel data={data}/>
      <Map
        initialViewState={initialViewState}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        data={data}
      />
    </div>);
  }
}
