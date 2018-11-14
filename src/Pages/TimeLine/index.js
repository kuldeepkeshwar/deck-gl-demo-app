import React from "react";
import { extend, debounce } from "../../utils";
import Map from "./Map";
import InfoPanel from "./InfoPanel";
// import DragableChart from "./../../Components/DragableChart";
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // eslint-disable-line
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
// Source data CSV
const DATA_URL = SERVER_URL + "/data/earthquakes.csv";

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

// function transformChatData(data) {
//   return Object.keys(data)
//     .sort(function(a, b) {
//       return a - 0 < b - 0;
//     })
//     .map(key => ({ x0: Number(key), x: Number(key) + 1, y: data[key] }));
// }
export default class Container extends React.Component {
  state = {
    data: undefined,
    start: undefined,
    end: undefined,
    playing: false,
    loading: true
  };

  _data = [];
  timerId = null;
  worker = null;
  async componentDidMount() {
    const instance = this;
    this.worker = new Worker("/workers/fetch-csv.js");
    this.worker.postMessage({ url: DATA_URL, withHeaders: true });
    this.worker.onmessage = e => {
      const { done, value = [] } = e.data;
      // value.forEach(item => {
      //   const year = new Date(item.DateTime).getFullYear();
      //   this.yearlyData[year] = (this.yearlyData[year] || 0) + 1;
      // });
      if (!done) {
        instance._data = extend(instance._data, value);
        instance.updateMap({ data: instance._data });
      } else {
        this.worker.terminate();
        this.worker = null;
        // this.yearlyData = transformChatData(this.yearlyData);
        instance.setState({ loading: false });
      }
    };
  }
  updateMap = debounce(state => {
    this.setState(state);
  }, 16);

  runTimeSeries(step) {
    const records = this._data;
    let start = fromYear;
    let end = start + step;
    this.setState({ playing: true });
    this.timerId = setInterval(() => {
      const data = records.filter(item => {
        const year = new Date(item.DateTime).getFullYear();
        return start <= year && year < end;
      });

      this.setState({
        data,
        start,
        end
      });
      if (currentYear <= end) {
        clearInterval(this.timerId);
        // this.setState({ playing: false });
      }
      start++;
      end++;
    }, 100);
  }
  componentWillUnmount() {
    this.timerId && clearInterval(this.timerId);
    this.worker && this.worker.terminate();
  }
  reset = () => {
    this.timerId && clearInterval(this.timerId);
    this.setState({
      data: this._data,
      playing: false,
      start: undefined,
      end: undefined
    });
  };
  render() {
    const { data, loading, playing, start, end } = this.state;

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
          <div className="control-panel top-left">
            <h4>Choose a time span & press play button</h4>
            {!playing ? (
              <div>
                <label>No of years</label>
                <select
                  className="control"
                  ref={node => (this.selectEl = node)}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>5</option>
                  <option>8</option>
                  <option>13</option>
                  <option>21</option>
                  <option>34</option>
                  <option>55</option>
                </select>
                <button
                  className="btn control play"
                  onClick={() => this.runTimeSeries(this.selectEl.value - 0)}
                >
                  Play
                </button>
              </div>
            ) : (
              <div>
                <label>
                  Earthquakes from {start} to {end}{" "}
                </label>
                <button
                  className="btn control reset"
                  onClick={() => this.reset()}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
