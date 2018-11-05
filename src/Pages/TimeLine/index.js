import React from "react";
import {fetchCSV} from "../../utils";
import Map from "./Map";
import InfoPanel from "./InfoPanel";

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // eslint-disable-line

// Source data CSV
const DATA_URL ="/data/earthquakes.csv";

const INITIAL_VIEW_STATE = {
  latitude: 37.12943561,
  longitude: -121.57125271,
  zoom: 4.9,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};
const currentYear = new Date().getFullYear();
const fromYear = 1960;

export default class Container extends React.Component {
  state = { data: null, endYear: fromYear };

  async componentDidMount() {
    const records = await fetchCSV(DATA_URL);
    // TODO
    // const worker= new Worker("/workers/timeline.js");
    // const data={records,currentYear,endYear: this.state.endYear};
    // const str=JSON.stringify(data);
    // worker.postMessage(str);
    // worker.onmessage = (e)=> {
    //   const state = JSON.parse(e.data);
    //   this.setState(state);
    // }
    const id = setInterval(() => {
      this.setState(
        prevState => {
          const data = records.filter(item => {
            const year = new Date(item.DateTime).getFullYear();
            return year <= prevState.endYear;
          });
          return {
            data,
            endYear: prevState.endYear + 1
          };
        },
        () => {
          if (currentYear <= this.state.endYear) {
            clearInterval(id);
          }
        }
      );
    }, 200);
  }
  render() {
    return (
      <div>
        <Map
          initialViewState={INITIAL_VIEW_STATE}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          data={this.state.data}
        />
        <InfoPanel
          data={this.state.data}
          fromYear={fromYear}
          toYear={this.state.endYear}
        />
      </div>
    );
  }
}
