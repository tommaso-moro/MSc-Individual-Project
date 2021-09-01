
import React from 'react';

import OrdinalFrame from "semiotic/lib/OrdinalFrame";

const OrdinalSummary = (props) => {
  const tags = props.tags
  const colors = ['rgba(231, 76, 60,1.0)', 'rgba(41, 128, 185,1.0)', 'rgba(39, 174, 96,1.0)', 'rgba(241, 196, 15,1.0)', 'rgba(155, 89, 182,1.0)']
  const tags_colors = {

  }
  for (var i = 0; i < tags.length; i++) {
    tags_colors[tags[i]] = colors[i]
  }
  
  const frameProps = {   
    data: props.scores,
    size: [(props.width*0.95),800],
    margin: { left: 180, bottom: 90, right: 0, top: 40 },
    //type: "point",
    summaryType: "ridgeline", //can also use "ridgeline"
    projection: "horizontal",
    oAccessor: "tag",
    rAccessor: "score",
    rExtent: [0],
    style: d => {
      return {
        r: 2,
        fill: d && tags_colors[d.tag]
      }
    },
    summaryStyle: d => ({
      fill: d && tags_colors[d.tag],
      fillOpacity: 0.2,
      stroke: d && tags_colors[d.tag],
      strokeWidth: 0.5
    }),
    title: "Subjectivity scores",
    axes: [{ orient: "bottom", label: "subjectivity score" }],
    oLabel: true
  }

  

  return (
    <OrdinalFrame {...frameProps} key={props.key}/>
  )
}

export default OrdinalSummary;