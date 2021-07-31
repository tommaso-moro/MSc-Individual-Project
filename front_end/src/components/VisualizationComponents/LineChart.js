import React, { useState, useEffect } from 'react'; 
import {Line} from 'react-chartjs-2'
import axios from 'axios'
import api_calls from '../../api.js'




const LineChart = (props) => {
    const [data, set_data] = useState({})
    const [linechart_config, set_line_chart_config] = useState({}); 
    
    const default_graph_style = {
        fill: false,
        lineTension: 0.5,
        borderWidth: 2
    }
    const colors = ['rgba(46, 204, 113,1.0)', 'rgba(52, 152, 219,1.0)', 'rgba(155, 89, 182,1.0)', 'rgba(241, 196, 15,1.0)', 'rgba(230, 126, 34,1.0)', 'rgba(231, 76, 60,1.0)', 'rgba(127, 140, 141,1.0)', '#FDE12D', '#9046CF', '#119DA4', '#767522', '#FF3F00', '#0B3954', '#7EBDC3', '#FAD8D6', '#18020C', '#E26D5A', 'rgba(46, 204, 113,1.0)', 'rgba(52, 152, 219,1.0)', 'rgba(155, 89, 182,1.0)', 'rgba(241, 196, 15,1.0)', 'rgba(230, 126, 34,1.0)', 'rgba(231, 76, 60,1.0)', 'rgba(127, 140, 141,1.0)', '#FDE12D', '#9046CF', '#119DA4', '#767522', '#FF3F00', '#0B3954', '#7EBDC3', '#FAD8D6', '#18020C', '#E26D5A']
    
    const handle_tag_click = (e) => {
        var tag = e.target.value
        var tag_is_being_shown = data["num_tweets"][tag]["show"]
        if (tag_is_being_shown) {
            remove_tag_from_chart(tag)
        } else {
            add_tag_to_chart(tag)
        }
    }
    const remove_tag_from_chart = (tag) => {
        var new_data = data
        new_data["num_tweets"][tag]["show"] = false
        set_data(new_data)
        update_linechart(new_data)
    }

    const add_tag_to_chart = (tag) => {
        var new_data = data
        new_data["num_tweets"][tag]["show"] = true
        set_data(new_data)
        update_linechart(new_data)
    }

    const update_linechart = (line_chart_data) => {
        var config = {
            labels: line_chart_data["dates"],
            datasets: []
        }
        var i = 0
        Object.keys(line_chart_data["num_tweets"]).map((tag) => {
            if (line_chart_data["num_tweets"][tag]["show"] == true) {
                const tag_dict = {
                    label : tag,
                    data : line_chart_data["num_tweets"][tag]["num_tweets"],
                    fill : default_graph_style.fill,
                    lineTension : default_graph_style.lineTension,
                    borderWidth : default_graph_style.borderWidth,
                    backgroundColor : line_chart_data["num_tweets"][tag]["color"],
                    borderColor : line_chart_data["num_tweets"][tag]["color"]
                }
                i++
                config.datasets.push(tag_dict)
            }        
        }); 
        set_line_chart_config(config)
    }

    useEffect(() => {
        api_calls.monthly_batch.get_line_chart_monthly_data()
            .then(res => {
                var my_data = res 
                var i = 0
                Object.keys(my_data["num_tweets"]).map((tag) => {
                    my_data["num_tweets"][tag]["show"] = (props.tags == []) ? true : (props.tags.includes(tag) ? true : false)
                    my_data["num_tweets"][tag]["color"] = colors[i]
                    i++
                })
                set_data(my_data)
                update_linechart(my_data)   
            })
            .catch(err => {
                console.log("An error occurred")
            })
    }, [])



    return (
        <div>
            {/* {data.num_tweets && Object.keys(data["num_tweets"]).map((tag) => {
                    return <button 
                        value={tag} 
                        key={tag}
                        onClick={(e) => handle_tag_click(e)}
                    >{tag}</button>
            })} */}
            <p>Click on the legends to customize the line chart!</p>
            <Line data={linechart_config}></Line>
        </div>
    );
  }
  
export default LineChart;