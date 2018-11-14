import React from "react";
import DeckGL, { MapView, ScatterplotLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";

const MALE_COLOR = [0, 128, 255];
const FEMALE_COLOR = [255, 0, 128];
const mapviewProps = {
  controller: true
};
const views = [new MapView({ id: "basemap-mapview", ...mapviewProps })];

export default class Map extends React.Component {
  _renderLayers() {
    const {
      data,
      radius = 20,
      maleColor = MALE_COLOR,
      femaleColor = FEMALE_COLOR
    } = this.props;
    return [
      new ScatterplotLayer({
        id: "scatter-plot",
        data,
        radiusScale: radius,
        radiusMinPixels: 0.1,
        getPosition: d => [(d.lng-0), (d.lat-0), 0],
        getColor: d => ((d.gender-0) === 1 ? maleColor : femaleColor),
        getRadius: 1,
        updateTriggers: {
          getColor: [maleColor, femaleColor]
        }
      })
    ];
  }
  onLayerClick = (...args) => {
    console.log(...args);
  };
  render() {
    const { initialViewState, mapboxApiAccessToken } = this.props;
    return (
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
    );
  }
}
