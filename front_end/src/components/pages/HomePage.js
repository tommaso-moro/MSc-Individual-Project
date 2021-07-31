import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom"; 
import api_calls from '../../api'
import { v4 as uuidv4 } from 'uuid';

const HomePage = () => {

    const history = useHistory()
    
    const [tags, set_tags] = useState([])
    const [dates, set_dates] = useState([])
    const [start_date, set_start_date] = useState("")
    const [end_date, set_end_date] = useState("")

    const handle_tag_selection = (tag) => {
        history.push({
            pathname: '/tag',
            search: tag,
            state: { 
                tag_name: tag,
                tag_start_date: start_date,
                tag_end_date: end_date
            }
        })
    }

    useEffect(() => {
        api_calls.tags_and_dates.get_tags_and_dates()
            .then(res => {
                set_dates(res[0]["dates"])
                set_tags(res[0]["tags"])
            })

        //const test = [{'score': 0.0, 'num_tweets': 274}, {'score': 0.01, 'num_tweets': 0}, {'score': 0.02, 'num_tweets': 0}, {'score': 0.03, 'num_tweets': 0}, {'score': 0.04, 'num_tweets': 0}, {'score': 0.05, 'num_tweets': 2}, {'score': 0.06, 'num_tweets': 1}, {'score': 0.07, 'num_tweets': 2}, {'score': 0.08, 'num_tweets': 1}, {'score': 0.09, 'num_tweets': 0}, {'score': 0.1, 'num_tweets': 46}, {'score': 0.11, 'num_tweets': 1}, {'score': 0.12, 'num_tweets': 6}, {'score': 0.13, 'num_tweets': 0}, {'score': 0.14, 'num_tweets': 0}, {'score': 0.15, 'num_tweets': 10}, {'score': 0.16, 'num_tweets': 1}, {'score': 0.17, 'num_tweets': 4}, {'score': 0.18, 'num_tweets': 7}, {'score': 0.19, 'num_tweets': 2}, {'score': 0.2, 'num_tweets': 12}, {'score': 0.21, 'num_tweets': 1}, {'score': 0.22, 'num_tweets': 1}, {'score': 0.23, 'num_tweets': 4}, {'score': 0.24, 'num_tweets': 3}, {'score': 0.25, 'num_tweets': 35}, {'score': 0.26, 'num_tweets': 3}, {'score': 0.27, 'num_tweets': 6}, {'score': 0.28, 'num_tweets': 5}, {'score': 0.29, 'num_tweets': 7}, {'score': 0.3, 'num_tweets': 44}, {'score': 0.31, 'num_tweets': 7}, {'score': 0.32, 'num_tweets': 3}, {'score': 0.33, 'num_tweets': 6}, {'score': 0.34, 'num_tweets': 5}, {'score': 0.35, 'num_tweets': 9}, {'score': 0.36, 'num_tweets': 9}, {'score': 0.37, 'num_tweets': 5}, {'score': 0.38, 'num_tweets': 19}, {'score': 0.39, 'num_tweets': 4}, {'score': 0.4, 'num_tweets': 15}, {'score': 0.41, 'num_tweets': 5}, {'score': 0.42, 'num_tweets': 7}, {'score': 0.43, 'num_tweets': 6}, {'score': 0.44, 'num_tweets': 2}, {'score': 0.45, 'num_tweets': 24}, {'score': 0.46, 'num_tweets': 7}, {'score': 0.47, 'num_tweets': 10}, {'score': 0.48, 'num_tweets': 11}, {'score': 0.49, 'num_tweets': 3}, {'score': 0.5, 'num_tweets': 67}, {'score': 0.51, 'num_tweets': 3}, {'score': 0.52, 'num_tweets': 9}, {'score': 0.53, 'num_tweets': 14}, {'score': 0.54, 'num_tweets': 12}, {'score': 0.55, 'num_tweets': 11}, {'score': 0.56, 'num_tweets': 5}, {'score': 0.57, 'num_tweets': 12}, {'score': 0.58, 'num_tweets': 6}, {'score': 0.59, 'num_tweets': 2}, {'score': 0.6, 'num_tweets': 24}, {'score': 0.61, 'num_tweets': 4}, {'score': 0.62, 'num_tweets': 12}, {'score': 0.63, 'num_tweets': 5}, {'score': 0.64, 'num_tweets': 2}, {'score': 0.65, 'num_tweets': 9}, {'score': 0.66, 'num_tweets': 2}, {'score': 0.67, 'num_tweets': 4}, {'score': 0.68, 'num_tweets': 1}, {'score': 0.69, 'num_tweets': 4}, {'score': 0.7, 'num_tweets': 10}, {'score': 0.71, 'num_tweets': 2}, {'score': 0.72, 'num_tweets': 2}, {'score': 0.73, 'num_tweets': 4}, {'score': 0.74, 'num_tweets': 0}, {'score': 0.75, 'num_tweets': 21}, {'score': 0.76, 'num_tweets': 1}, {'score': 0.77, 'num_tweets': 4}, {'score': 0.78, 'num_tweets': 4}, {'score': 0.79, 'num_tweets': 0}, {'score': 0.8, 'num_tweets': 11}, {'score': 0.81, 'num_tweets': 0}, {'score': 0.82, 'num_tweets': 1}, {'score': 0.83, 'num_tweets': 5}, {'score': 0.84, 'num_tweets': 0}, {'score': 0.85, 'num_tweets': 0}, {'score': 0.86, 'num_tweets': 0}, {'score': 0.87, 'num_tweets': 0}, {'score': 0.88, 'num_tweets': 4}, {'score': 0.89, 'num_tweets': 0}, {'score': 0.9, 'num_tweets': 21}, {'score': 0.91, 'num_tweets': 1}, {'score': 0.92, 'num_tweets': 1}, {'score': 0.93, 'num_tweets': 0}, {'score': 0.94, 'num_tweets': 0}, {'score': 0.95, 'num_tweets': 5}, {'score': 0.96, 'num_tweets': 0}, {'score': 0.97, 'num_tweets': 0}, {'score': 0.98, 'num_tweets': 0}, {'score': 0.99, 'num_tweets': 0}, {'score': 1.0, 'num_tweets': 55}]
        //const num_scores = 995
        const value = 10
        const from = [1, 50]
        const to = [100, 5000]

        var scale = (to[1] - to[0]) / (from[1] - from[0]);
	    var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
	    console.log(~~(capped * scale + to[0]));
    },[])
    return (
        <>
        {dates.length != 0 && tags.map((tag) => {
            return <li key={uuidv4()}>
                <button onClick={() => handle_tag_selection(tag)}>
                    {tag}
                </button>
            </li>
        })}
        </>

    )
}

export default HomePage;