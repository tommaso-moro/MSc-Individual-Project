import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom"; 
import api_calls from '../../api'
import { v4 as uuidv4 } from 'uuid';
import { getParameterByName } from '../../helpers.js'

//import visualizations
import CalendarChart from '../VisualizationComponents/CalendarChart'
import LineChart from '../VisualizationComponents/LineChart'
import Map from '../VisualizationComponents/Map'
import WordCloud from '../VisualizationComponents/WordCloud'
import EmbeddedTweet from '../VisualizationComponents/EmbeddedTweet'



const TagPage = (props) => {
    const visualizations = ["Calendar", "Line Chart", "Map", "Word Cloud", "Most Influential Tweets"]
    const [tag, set_tag] = useState("")
    const [show_calendar, set_show_calendar] = useState(false)
    const [show_line_chart, set_show_line_chart] = useState(false)
    const [show_map, set_show_map] = useState(false)
    const [show_wordcloud, set_show_wordcloud] = useState(false)
    const [show_most_influential_tweets, set_show_most_influential_tweets] = useState(false)
    const history = useHistory()
    

    const handle_viz_selection = (e) => {
        //e.preventDefault()
        switch(e.target.value) {
            case "Calendar":
                set_show_calendar(true)
                break
            case "Line Chart":
                set_show_line_chart(true)
                break
            case "Map":
                set_show_map(true)
                break
            case "Word Cloud":
                set_show_wordcloud(true)
                break
            case "Most Influential Tweets":
                set_show_most_influential_tweets(true)
                break
            default:
                break
        }
    }


    useEffect(() => {
        if (props.location.state == undefined) {
            history.push('/')
        } else {
            set_tag(props.location.state.tag_name) //get the tag from state.detail which was set by the component which pushed history to this page
        }
        
    }, []) 

    return (
        <>
        <h1>{tag}</h1>
        {visualizations.map((viz) => {
            return <button 
            key={uuidv4()}
            onClick={(e) => handle_viz_selection(e)}
            value={viz}>
            {viz}
        </button>
        })}
        {
            show_calendar && <CalendarChart start_date={"2020-09-01"} end_date={"2021-06-18"} tag={tag}/>
        }
        {
            show_line_chart && <LineChart tags={[tag]}/>
        }
        {
            show_map && <Map/>
        }
        {
            show_wordcloud && <WordCloud/>
        }
        {
            show_most_influential_tweets && <EmbeddedTweet tag={tag}/>
        }
        </>
    )
}

export default TagPage;