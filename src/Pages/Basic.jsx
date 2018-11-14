/// app.js
import React from "react";
import DeckGL, { LineLayer,TextLayer, IconLayer, MapView } from "deck.gl";
import { StaticMap } from "react-map-gl";

// Set your mapbox access token here
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

// Data to be used by the LineLayer
const data = [
  {
    sourcePosition: [77.6945534, 12.9351775],
    targetPosition: [77.647608, 12.9081357]
  }
];
const iconLayerData = [
  { type: "Office", coordinates: data[0].sourcePosition },
  { type: "Home", coordinates: data[0].targetPosition }
];
// Initial viewport settings
const initialViewState = {
  longitude: 77.6680357,
  latitude: 12.91951343,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

const mapviewProps = {
  controller: true
};
const views = [new MapView({ id: "basemap-mapview", ...mapviewProps })];
export default class App extends React.Component {
  onLayerClick = (...args) => {
    console.log(...args);
  };
  renderLayers() {
    return [
      new LineLayer({
        id: "line-layer",
        pickable: true,
        data,
        getStrokeWidth: 5
      }),
      new TextLayer({
        id: 'text-layer',
        data: iconLayerData,
        pickable: true,
        getPosition: d => d.coordinates,
        getText: d => d.type,
        getColor: d => [Math.round(256 * Math.random()), 140, 0],
        getSize: 32,
        getAngle: 0,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'top',
      }),
      new IconLayer({
        id: "icon-layer",
        data: iconLayerData,
        pickable: true,
        iconAtlas: "https://deck.gl/images/icon-atlas.png",
        iconMapping: {
          marker: {
            x: 0,
            y: 0,
            width: 128,
            height: 128,
            anchorY: 128,
            mask: true
          }
        },
        sizeScale: 15,
        getPosition: d => d.coordinates,
        getIcon: d => "marker",
        getSize: d => 5,
        getColor: d => [Math.round(256 * Math.random()), 140, 0]
      })
    ];
  }
  render() {
    return (
      <DeckGL
        initialViewState={initialViewState}
        layers={this.renderLayers()}
        views={views}
        onLayerClick={this.onLayerClick}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_TOKEN} />
      </DeckGL>
    );
  }
}
