import React, {useEffect, useState} from 'react'

import { Row, Col } from 'antd';

import { v4 as uuidv4 } from 'uuid';

import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"




import TagSingleSelect from '../UIComponents/TagSingleSelect';
import VizConfigRadio from '../UIComponents/VizConfigRadio';
import MonthSelect from '../UIComponents/MonthSelect';
import RetweetsVsLikesSelect from '../UIComponents/RetweetsVsLikesSelect'

import EmbeddedTweet from '../VisualizationComponents/EmbeddedTweet'




const MostInfluentialTweetsHandler = (props) => {
//STATE
    const [tags_embedded_tweets_data, set_tags_embedded_tweets_data] = useState(null);
    const [selected_tweet_rank, set_selected_tweet_rank] = useState(null) //can be "most_retweeted" or "most_liked"
    const [dropdown_tags, set_dropdown_tags] = useState(null)
    const [start_date_month, set_start_date_month] = useState(null)
    const [end_date_month, set_end_date_month] = useState(null)
    const [embedded_tweets_active_data, set_embedded_tweets_active_data] = useState(null)

    const [show_month_select, set_show_month_select] = useState(false)
    const [selected_month, set_selected_month] = useState(null)
    const [selected_tag, set_selected_tag] = useState(null)


//HOOKS

    const handle_tag_selection = tag => {
        set_selected_tag(tag)

        //check if user is seeing overall data or monthly data
        if (selected_month == null) {
            embedded_tweets_data_setter(tags_embedded_tweets_data, tag, selected_tweet_rank)
        } else {
            embedded_tweets_data_setter(tags_embedded_tweets_data, tag, selected_tweet_rank, selected_month)
        }
    }

    const handle_month_selection = year_month => {
        set_selected_month(year_month)
        embedded_tweets_data_setter(tags_embedded_tweets_data, selected_tag, selected_tweet_rank, year_month)
    }

    const handle_radio_selection = e => {
        const selected_option = e.target.value;
        switch (selected_option) {
            case "monthly":
                set_selected_month(end_date_month)
                set_show_month_select(true)
                embedded_tweets_data_setter(tags_embedded_tweets_data, selected_tag, selected_tweet_rank, end_date_month)
                break
            case "overall":
                set_selected_month(null)
                set_show_month_select(false)
                embedded_tweets_data_setter(tags_embedded_tweets_data, selected_tag, selected_tweet_rank)
                break
            default:
                break
        }
    }  

    const handle_retweeted_vs_liked_selection = selected_option => {
        switch (selected_option) {
            case "most_liked":
                set_selected_tweet_rank("most_liked")
                embedded_tweets_data_setter(tags_embedded_tweets_data, selected_tag, "most_liked")
                break
            case "most_retweeted":
                set_selected_tweet_rank("most_retweeted")
                embedded_tweets_data_setter(tags_embedded_tweets_data, selected_tag, "most_retweeted")
                break
            default:
                break
        }
    }

    const embedded_tweets_data_setter = (tags_data, tag, rank_by, month=null) => {
        if (month == null) {
            for (var i = 0; i < tags_data.length; i++) {
                if (tags_data[i].tag == tag) {
                    const data = (rank_by == "most_liked") ? tags_data[i].most_liked_tweets : tags_data[i].most_retweeted_tweets
                    console.log(data)
                    set_embedded_tweets_active_data(data)
                }
            }
        } else {
            //loop through the tags, when you find the right one loop through the months, when you find the right one set the data
            for (var i = 0; i < tags_data.length; i++) {
                if (tags_data[i].tag == tag) {
                    const months = tags_data[i].months;
                    for (var j = 0; j < months.length; j++) {
                        if (months[j]["month"] == month) {
                            const month_data = tags_data[i].months[j]
                            const data = (rank_by == "most_liked") ? month_data.most_liked_tweets : month_data.most_retweeted_tweets
                            set_embedded_tweets_active_data(data)
                        }
                    }
                }
            } 
        }
    }

    useEffect(() => {
        set_dropdown_tags(props.dropdown_tags);
        set_start_date_month(props.start_date_month);
        set_end_date_month(props.end_date_month);
        set_tags_embedded_tweets_data(props.data)


        //set a default tag to display when the vis is rendered the first time
        const default_tag = props.dropdown_tags[0]
        set_selected_tag(default_tag)
        set_selected_tweet_rank("most_liked") //by default, show most liked tweets
        embedded_tweets_data_setter(props.data, default_tag, "most_liked")

    }, [])

    const vis_is_ready = dropdown_tags != null && 
                         start_date_month != null && 
                         end_date_month != null &&
                         tags_embedded_tweets_data != null &&
                         embedded_tweets_active_data != null


    return (
        <>
            {
                vis_is_ready && <>
                <Row>
                    <Col span={24}>
                        <div style={{float: 'right'}}>
                            {
                            show_month_select && <div style={{margin: '1rem'}}>
                                <MonthSelect 
                                    start_month={start_date_month} 
                                    end_month={end_date_month} 
                                    chart={"embedded_tweets"} 
                                    on_month_select={handle_month_selection}/>
                                </div>
                            }
                            <VizConfigRadio on_radio_select={handle_radio_selection} chart={"embedded_tweets"}/>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <div style={{float: 'right', width: '20%', marginTop: '1rem'}}>
                            <RetweetsVsLikesSelect 
                                on_retweeted_vs_liked_selection={handle_retweeted_vs_liked_selection}
                            />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <div style={{float: 'right', width: '20%', marginTop: '1rem'}}>
                            <TagSingleSelect 
                                tags={dropdown_tags} 
                                on_tag_selection={handle_tag_selection}
                                chart="embedded_tweets"
                            />
                        </div>
                    </Col>
                </Row>

                

                <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
                <Masonry>
                        {
                            embedded_tweets_active_data.map((tweet) => {
                                return <div key={uuidv4()} style={{padding: '4px'}}>
                                    <EmbeddedTweet tweet_id={tweet}/>
                                </div>
                            })
                        }
                </Masonry>
            </ResponsiveMasonry>

                </>
            }
            
        </>
    )
}

export default MostInfluentialTweetsHandler;
