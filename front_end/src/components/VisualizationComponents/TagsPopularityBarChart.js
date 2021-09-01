import React, {useEffect, useState} from 'react';
import { Bar } from 'react-chartjs-2';

const colors = ['rgba(231, 76, 60,1.0)', 'rgba(41, 128, 185,1.0)', 'rgba(39, 174, 96,1.0)', 'rgba(241, 196, 15,1.0)', 'rgba(155, 89, 182,1.0)']
const TagsPopularityBarChart = (props) => {
  
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const [data, set_data] = useState({}) 

  useEffect(() => {
    
    var months = []
    var datasets = []
    props.data[0].months.reverse() //reverse months because they come latest-to-earliest (e.g. 2021-06, 2021-05 ...)
    for (var i = 0; i < props.data[0].months.length; i++) {
      months.push(props.data[0].months[i]["month"])
    }

    for (var i = 0; i < props.data.length; i++) {
      var tag_data = props.data[i]
      var label = tag_data.tag
      var tag_monthly_data = []
      var background_color = colors[i]
      if (props.show_normalized_data == true) {
        tag_monthly_data = []
        for (var j = 0; j < tag_data.months_normalized.length; j++) {
          var month_num_tweets = tag_data.months_normalized[j].normalized_num_tweets
          tag_monthly_data.push(month_num_tweets)
        }
      } else {
        tag_monthly_data = []
        for (var j = 0; j < tag_data.months.length; j++) {
          var month_num_tweets = tag_data.months[j].num_tweets
          tag_monthly_data.push(month_num_tweets)
        }
      }
      datasets.push({
        label: label,
        data: tag_monthly_data,
        backgroundColor: background_color
      })
    }

    set_data({
      labels: months,
      datasets: datasets,
    })
  }, [])

  return (
  <>
    <Bar key={props.key} data={data} options={options} />
  </>
  )
};

export default TagsPopularityBarChart;