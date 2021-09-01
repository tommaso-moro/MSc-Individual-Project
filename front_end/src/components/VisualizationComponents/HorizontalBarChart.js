import React, {useEffect, useState} from 'react';
import { Bar } from 'react-chartjs-2';



const HorizontalBarChart = (props) => {

  const [data, set_data] = useState({})
  const [options, set_options] = useState({})



  useEffect (() => {
    //set up chart for mentions
    if (props.data_type === "Mentions") {
      set_data({
        labels: props.data.mention_labels,
        datasets: [
          {
            label: "Popular Mentions",
            data: props.data.mention_data,
            backgroundColor: ['#2980b9'], //colors,
            borderColor: ['#2980b9'], //colors,
            borderWidth: 1,
          },
        ],
      })


      set_options({
        indexAxis: 'y',
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Most Mentioned Accounts',
          },
        },
        onClick: function(evt, element) {
          if(element.length > 0) {
              console.log(element,element[0]._datasetInde)
              
          }
        }
      })

    //set up chart for hashtags
    } else if (props.data_type === "Hashtags") {
      set_data({
        labels: props.data.hashtag_labels,
        datasets: [
          {
            label: "Popular Hashtags",
            data: props.data.hashtag_data,
            backgroundColor: ['rgba(231, 76, 60, 8.0)'], //colors,
            borderColor: ['rgba(231, 76, 60, 8.0)'], //colors,
            borderWidth: 1,
          },
        ],
      })


      set_options({
        indexAxis: 'y',
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Most Popular Hashtags',
          },
        },
        onClick: function(evt, element) {
          if(element.length > 0) {
              console.log(element,element[0]._datasetInde)
              
          }
        }
      })
    }
  }, [])

  return (
  <>
    <div className='header'>
      {props.data_type === "Hashtags" && <h1>Most Popular Hashtags</h1>}
      {props.data_type === "Mentions" && <h1>Most Popular Mentions</h1>}
    </div>
    <Bar key={props.key} data={data} options={options} />
  </>
  )
};

export default HorizontalBarChart;