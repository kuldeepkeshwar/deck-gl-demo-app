import React from 'react';

export default function InfoPanel({data,fromYear,toYear}) {
  return (<div className="info-panel top-right">
    <h3>California Earthquakes</h3>
    <p>Location, maginitude and magtype of <b>2.0+</b> magnitude earthquakes in california</p>
    <p>Showing earthquakes from <b>{fromYear}</b> to <b>{toYear}</b></p>
    
    <div className="layout">
      <div className="legend" style={{
        background: "rgb(1, 152, 189)",
        width: "16.6667%"
      }} />
      <div className="legend" style={{
        background: "rgb(73, 227, 206)",
        width: "16.6667%"
      }} />
      <div className="legend" style={{
        background: "rgb(216, 254, 181)",
        width: "16.6667%"
      }} />
      <div className="legend" style={{
        background: "rgb(254, 237, 177)",
        width: "16.6667%"
      }} />
      <div className="legend" style={{
        background: "rgb(254, 173, 84)",
        width: "16.6667%"
      }} />
      <div className="legend" style={{
        background: "rgb(209, 55, 78)",
        width: "16.6667%"
      }} />
    </div>
    <p className="layout">
      <span className="col-1-2">Small Maginitude</span>
      <span className="col-1-2 text-right">Large Maginitude</span>
    </p>
    <p>
      Data source: <a href="https://http://ncedc.org/">NCEDC</a>
    </p>
    {data && <div className="layout">
      <div className="stat col-1-2">
        Total Earthquakes
          <b>{data.length}</b>
      </div>
    </div>}
  </div>);
}