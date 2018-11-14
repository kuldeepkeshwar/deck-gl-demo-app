import React from 'react';
import {XYPlot, XAxis, YAxis, VerticalRectSeries} from 'react-vis';
import Highlight from './Highlight';
import "./styles.scss";
import 'react-vis/dist/style.css';

class DragableChart extends React.Component {
  state = {
    start: null,
    end: null
  };

  render() {
    const {start, end} = this.state;
    const updateDragState = area =>
      this.setState({
        start: area && Math.floor(area.left),
        end: area && Math.ceil(area.right)
      });

    return (
      <div className="chart-container">
        <XYPlot width={500} height={200}>
          <XAxis tickFormat={v => v}/>
          <YAxis  tickLabelAngle={-90} tickFormat={v => v?`${v/1000}K`:0}/>
          <VerticalRectSeries
            data={this.props.data}
            stroke="white"
            colorType="literal"
            getColor={d => {
              if (start === null || end === null) {
                return '#1E96BE';
              }
              const inX0 = d.x0 >= start && d.x0 < end;
              return  inX0 ? '#12939A' : '#1E96BE';
            }}
          />

          <Highlight
            color="#829AE3"
            drag
            start={start}
            end={end}
            enableY={false}
            onDrag={updateDragState}
            onDragEnd={updateDragState}
          />
        </XYPlot>

        <div>
          {this.props.playing?<span>playing</span>:<button onClick={()=>{this.props.onPlay(this.state)}}>start</button>}
          <b>start:</b> {start}
          <b>end:</b> {end}
        </div>
      </div>
    );
  }
}

export default DragableChart;