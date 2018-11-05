import React from "react";
import DeckGL, { MapView, ScatterplotLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";
import InfoTooltip from "./InfoTooltip";

const COLORS = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];
function getColor(d) {
  const magnitude = Math.ceil(Number(d.Magnitude));
  if (magnitude >= 7) {
    return COLORS[5];
  } else if (magnitude <= 2) {
    return COLORS[0];
  } else {
    return COLORS[magnitude - 2];
  }
}
function getPosition(d){
  return [Number(d.Longitude), Number(d.Latitude)];
}
const mapviewProps = {
  controller: true
};
const views = [new MapView({ id: "basemap-mapview", ...mapviewProps })];
export default class ScatterplotLayerMap extends React.Component {
  state = { data: null };
  _renderLayers() {
    const { data, radius = 40 } = this.props;
    return [
      new ScatterplotLayer({
        id: "scatter-plot",
        data,
        radiusScale: radius,
        radiusMinPixels: 0.25,
        getPosition,
        getColor,
        getRadius: 100,
        pickable: true,
        updateTriggers: {
          getColor
        },
        onHover: d => {
          if (d && d.object ) {
            this.setState(state => ({ data: d }));  
          }else{
            this.setState(state => ({ data: null }));
          }
        }
      })
    ];
  }
  onLayerClick = (...args) => {
    console.log(...args);
  };
  render() {
    const { initialViewState, mapboxApiAccessToken } = this.props;
    const { object,x,y} = this.state.data||{};
    
    return (
      <div>
        {object && <InfoTooltip data={object} x={x} y={y} />}
        <DeckGL
          initialViewState={initialViewState}
          layers={this._renderLayers()}
          views={views}
          onLayerClick={this.onLayerClick}
        >
          <StaticMap
            mapboxApiAccessToken={mapboxApiAccessToken}
            reuseMaps
            mapStyle="mapbox://styles/mapbox/light-v9"
            preventStyleDiffing={true}
          />
        </DeckGL>
      </div>
    );
  }
}
