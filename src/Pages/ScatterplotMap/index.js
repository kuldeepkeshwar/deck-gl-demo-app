/// app.js
import React from "react";
import {extend,debounce} from "../../utils";
import Map from "./Map";
import InfoPanel from "./InfoPanel";

// Set your mapbox access token here
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
// Source data CSV
const DATA_URL = SERVER_URL+"/data/scatterplot.csv";
 
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
  state = { data: undefined,loading:true };
  _data=[];
  async componentDidMount() {
    const instance=this;
    const worker= new Worker("/workers/fetch-csv.js");
    worker.postMessage({url:DATA_URL,withHeaders:true,accumulatedSize:16});
    worker.onmessage = (e)=> {
      const {done,value}=e.data;
      if(!done){
        instance._data=extend(instance._data,Array.from(value));
        instance.updateMap({data:instance._data})
      }else{
        instance.setState({loading:false})
        worker.terminate();
      }
    }
  }
  updateMap=debounce((state)=>{
    this.setState(state)
  },250)
  componentWillUnmount() {
    this.worker && this.worker.terminate();
  }
  render() {
    const {data,loading} = this.state;
    return (
      <div>
        <InfoPanel data={data} loading={loading}/>
      <Map
        initialViewState={initialViewState}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        data={data}
      />
    </div>);
  }
}
