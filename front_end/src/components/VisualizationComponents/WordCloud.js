import React from 'react';
import ReactWordcloud from 'react-wordcloud';

const options = {
    fontSizes : [20, 150],
    deterministic: true,
    enableTooltip: false,
    rotations: 0,
    rotationAngles: [0,90]
  };
  
const WordCloud = (props) => {

    return (
        <div style={{height: '60vh', width: '100%'}}>
            <ReactWordcloud words={props.data} options={options}/>
        </div>
    )
}
export default WordCloud;
