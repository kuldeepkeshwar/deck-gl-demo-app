import React from "react";
import {fetchCSV} from "../../utils";
import Map from "./Map";
import InfoPanel from "./InfoPanel";
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // eslint-disable-line

// Source data CSV
const DATA_URL = "/data/heatmap.csv";

const INITIAL_VIEW_STATE = {
  longitude: -1.4157267858730052,
  latitude: 52.232395363869415,
  zoom: 6,
  minZoom: 5,
  maxZoom: 15,
  pitch: 40.5,
  bearing: -27.396674584323023
};

export default class Container extends React.Component {
  state = { data: null };
  async componentDidMount() {
    const data = await fetchCSV(DATA_URL);
    this.setState({
      data
    });
  }
  render() {
    const data = this.state.data;
    return (
      <div>
        {data && <InfoPanel data={data}/>}
        <Map
          initialViewState={INITIAL_VIEW_STATE}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          data={data}
        />
      </div>
    );
  }
}
