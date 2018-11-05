import React from 'react';
import Loader from './../../Components/Loader';

export default function InfoPanel({data}) {
  return (<div className="info-panel top-right">
    <h3>United Kingdom Road Safety</h3>
    <p>Personal injury road accidents in GB from 1979</p>
    <p>The layer aggregates data within the boundary of each hexagon cell</p>
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
      <span className="col-1-2">Fewer Accidents</span>
      <span className="col-1-2 text-right">More Accidents</span>
    </p>
    <p>
      Data source: <a href="https://data.gov.uk">DATA.GOV.UK</a>
    </p>
    <div className="layout">
      {data ?<div className="stat col-1-2">
        Accidents<b>{data.length}</b>
      </div>:<Loader/>}
    </div>
  </div>);
}