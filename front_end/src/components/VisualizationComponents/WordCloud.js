import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import data from '../../test_data/word_cloud_data.json'

const options = {
    fontSizes : [20, 150],
    deterministic: true,
    enableTooltip: false
  };
  
export const WordCloud = () => {
    return (
        <div style={{"height": "100%"}}>
            <ReactWordcloud words={data["data"]} options={options} />
        </div>
    )
}
export default WordCloud;
