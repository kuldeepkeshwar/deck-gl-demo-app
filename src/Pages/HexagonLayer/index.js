import React from "react";
import {extend,debounce} from "../../utils";
import Map from "./Map";
import InfoPanel from "./InfoPanel";
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // eslint-disable-line
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
// Source data CSV
const DATA_URL = SERVER_URL+"/data/heatmap.csv";

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
  state = { data: undefined ,animation:false,loading:true};
  _data=[];
  async componentDidMount() {
    const instance=this;
    const worker= new Worker("/workers/fetch-csv.js");
    worker.postMessage({url:DATA_URL,withHeaders:true});
    worker.onmessage = (e)=> {
      const {done,value}=e.data;
      if(!done){
        instance._data=extend(instance._data,value);
        instance.updateMap({data:instance._data})
      }else{
        instance.setState({animation:true,loading:false})
        worker.terminate();
      }
    }
  }
  updateMap=debounce((state)=>{
    this.setState(state)
  },16)
  componentWillUnmount() {
    this.worker && this.worker.terminate();
  }
  render() {
    const {data,loading} = this.state;
    return (
      <div>
        <InfoPanel data={data} loading={loading}/>
        <Map
          initialViewState={INITIAL_VIEW_STATE}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          animation={this.state.animation}
          data={data}
        />
      </div>
    );
  }
}
