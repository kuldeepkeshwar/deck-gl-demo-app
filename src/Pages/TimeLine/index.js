import React from "react";
import { extend, debounce } from "../../utils";
import Map from "./Map";
import InfoPanel from "./InfoPanel";
import DragableChart from "./../../Components/DragableChart";
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // eslint-disable-line
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
// Source data CSV
const DATA_URL = SERVER_URL + "/data/earthquakes";

const INITIAL_VIEW_STATE = {
  latitude: 37.12943561,
  longitude: -121.57125271,
  zoom: 4.9,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};
const currentYear = new Date().getFullYear();
const fromYear = 1965;

function transformChatData(data) {
  return Object.keys(data)
    .sort(function(a, b) {
      return a - 0 < b - 0;
    })
    .map(key => ({ x0: Number(key), x: Number(key) + 1, y: data[key] }));
}
export default class Container extends React.Component {
  state = { data: undefined, playing: false, loading: true };

  _data = [];
  yearlyData = {};
  timerId = null;
  worker = null;
  async componentDidMount() {
    const instance = this;
    this.worker = new Worker("/workers/fetch-csv.js");
    this.worker.postMessage({ url: DATA_URL, withHeaders: true });
    this.worker.onmessage = e => {
      const { done, value = [] } = e.data;
      value.forEach(item => {
        const year = new Date(item.DateTime).getFullYear();
        this.yearlyData[year] = (this.yearlyData[year] || 0) + 1;
      });
      if (!done) {
        instance._data = extend(instance._data, value);
        instance.updateMap({data:instance._data})
      } else {
        this.worker.terminate();
        this.worker = null;
        this.yearlyData = transformChatData(this.yearlyData);
        instance.setState({ loading: false });
      }
    };
  }
  updateMap = debounce(state => {
    this.setState(state);
  }, 16);

  runTimeSeries(start, end) {
    const records = this._data;
    const step = end - start;
    let counter = 0;
    this.setState({ playing: true });
    this.timerId = setInterval(() => {
      const data = records.filter(item => {
        const year = new Date(item.DateTime).getFullYear();
        return year <= fromYear + (step * counter);
      });

      this.setState({
        data
      });
      if (currentYear <= fromYear + (step * counter)) {
        clearInterval(this.timerId);
        this.setState({ playing: false });
      }
      counter++;
    }, 100);
  }
  componentWillUnmount() {
    this.timerId && clearInterval(this.timerId);
    this.worker && this.worker.terminate();
  }
  render() {
    const { data, loading } = this.state;
    return (
      <div>
        <Map
          initialViewState={INITIAL_VIEW_STATE}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          data={data}
        />
        <InfoPanel
          data={this._data}
          fromYear={fromYear}
          toYear={currentYear}
          loading={loading}
        />
        {!loading && (
          <DragableChart
            playing={this.state.playing}
            data={this.yearlyData}
            onPlay={({ start, end }) => {
              this.runTimeSeries(start, end);
            }}
          />
        )}
      </div>
    );
  }
}
