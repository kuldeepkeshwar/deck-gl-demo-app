import React from "react";
export default class InfoTooltip extends React.Component {
  shouldComponentUpdate(nextProps) {
    const prev = this.props.data;
    const next = nextProps.data;
    if (prev.EventID === next.EventID) {
      return false;
    }
    return true;
  }
  render() {
    const { data, x, y } = this.props;
    const style = {
      left: `${x}px`, top: `${y}px`
    };
    return <div style={style} className="tooltip">
      
      <div className="row">
        <div className="label">Latitude</div> <div className="value">{data.Latitude} </div>
      </div>
      <div className="row">
        <div className="label">Longitude</div> <div className="value">{data.Longitude} </div>
      </div>
      <div className="row">
        <div className="label">Depth</div> <div className="value">{data.Depth} </div>
      </div>
      <div className="row">
        <div className="label">Magnitude</div>
        <div className="value">
          {data.Magnitude} {data.MagType}
        </div>
      </div>
      <div className="row">
        <div className="label">DateTime</div> <div className="value">{data.DateTime}</div>
      </div>
    </div>;
  }
}