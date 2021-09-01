import React, {useState, useEffect, useRef} from 'react';
import { useHistory } from "react-router-dom"; 
import api_calls from '../../api';
import Zoom from 'react-reveal';
import NatureSvg from "../../nature.svg";


// antd imports
import { Row, Col, Tag } from 'antd';
import { SyncOutlined } from'@ant-design/icons';


//import UI components
import TagPageParagraph from '../UIComponents/TagPageParagraph';
import Loader from '../UIComponents/Loader';

//import visualization handlers
import TagsPopularityBarChart from '../VisualizationComponents/TagsPopularityBarChart';
import WordCloudHandler from '../VizHandlers/WordCloudHandler';
import HashtagsAndMentionsBarChartHandler from '../VizHandlers/HashtagsAndMentionsBarChartHandler';
import MostInfluentialTweetsHandler from '../VizHandlers/MostInfluentialTweetsHandler'
import CalendarHandler from '../VizHandlers/CalendarHandler';
import OrdinalSummaryHandler from '../VizHandlers/OrdinalSummaryHandler';
import MapHandler from '../VizHandlers/MapHandler';
import StatisticHandler from '../VizHandlers/StatisticHandler';
import TagsPopularityHandler from '../VizHandlers/TagsPopularityHandler';



const rowStyle = {
    width: '85%', 
    margin: 'auto', 
    marginTop: '1rem'
}

const paragraphRowStyle = {
    width: '65%',
    margin: 'auto',
    marginTop: '3rem'
}

const TagsExplorationPage = (props) => {

    const history = useHistory()

//STATE
    //general
    const [tags, set_tags] = useState(null)
    const [start_date_month, set_start_date_month] = useState("")
    const [end_date_month, set_end_date_month] = useState("")


    //wordcloud
    const [tags_wordcloud_data, set_tags_wordcloud_data] = useState(null)

    //popularity barchart
    const [tags_monthly_popularity_data, set_tags_monthly_popularity_data] = useState(null)

    //mentions and hashtags barchart
    const [most_popular_hashtags_data, set_most_popular_hashtags_data] = useState(null)
    const [most_mentioned_accounts_data, set_most_mentioned_accounts_data] = useState(null)

    //most influential tweets
    const [most_influential_tweets_data, set_most_influential_tweets_data] = useState(null)

    //calendar
    const [calendar_tags_data, set_calendar_tags_data] = useState(null)
    const [calendar_data_is_loading, set_calendar_data_is_loading]= useState(false)

    //ordinal summary
    const [ordinal_summary_tags_subj_scores_data, set_ordinal_summary_tags_subj_scores_data] = useState(null)

    //map
    const [tags_map_data, set_tags_map_data] = useState(null)

    //statistic
    const [tags_statistics_data, set_tags_statistics_data] = useState(null)

    //loader
    const [loading, set_loading] = useState(true) 
    
    //
    const [tags_badges_background_colors, set_tags_badges_background_colors] = useState(null)


//HOOKS
    const get_tags_wordcloud_data = (tags, month=null, default_load=false) => {
        api_calls.wordcloud_data.get_selected_tags_data(tags)
            .then(res => set_tags_wordcloud_data(res))
    }

    const get_tags_monthly_popularity_data = (tags) => {
        api_calls.tags_popularity.get_all_tags_popularity_data()
            .then(res => {
                var data = []
                for (var i = 0; i < res.length; i++) {
                    if (tags.includes(res[i].tag)) {
                        data.push(res[i])
                    }
                }    
                set_tags_monthly_popularity_data(data)   
            })
    }

    const get_most_mentioned_accounts_data = (tags) => {
        api_calls.mentions_and_hashtags.get_mentions_data_by_tags(tags)
            .then(res => set_most_mentioned_accounts_data(res))
    }

    const get_most_popular_hashtags_data = (tags) => {
        api_calls.mentions_and_hashtags.get_hashtags_data_by_tags(tags)
            .then(res => set_most_popular_hashtags_data(res))
    }

    const get_most_influential_tweets_data = (tags) => {
        api_calls.most_influential_tweets.get_most_influential_tweets_by_tags(tags)
            .then(res => set_most_influential_tweets_data(res))
    }

    const get_calendar_tags_data = (tags) => {
        set_calendar_data_is_loading(true)
        api_calls.daily_batch.get_daily_calendar_data_by_tags(tags)
            .then(res => {
                set_calendar_tags_data(res)
                set_calendar_data_is_loading(false)
            })
    }

    const get_ordinal_summary_subjectivity_scores_data = (tags) => {
        api_calls.subjectivity_scores.get_scores_by_tags_ordinal_summary(tags)
            .then(res => {
                set_ordinal_summary_tags_subj_scores_data(res)
            })
    }

    const get_tags_map_data = (tags) => {
        api_calls.geo_spatial_data.get_geo_spatial_data_by_tags(tags)
            .then(res => {
                set_tags_map_data(res)
            })
    }

    const get_tags_statistics_data = (tags) => {
        api_calls.tags_popularity.get_num_tweets_by_tags(tags)
            .then(res => {
                set_tags_statistics_data(res);
            })
    }

    const handle_loading_complete = () => {
        set_loading(false)
    }

    

    useEffect(() => {
        // redirect to home page
        if (props.location.state == undefined) {
            history.push('/')
        } else {
            var selected_tags = props.location.state.selected_tags
            set_tags(selected_tags)
            set_start_date_month(props.location.state.tag_start_date_month)
            set_end_date_month(props.location.state.tag_end_date_month)

            get_calendar_tags_data(selected_tags)
            get_tags_wordcloud_data(selected_tags, null, true)
            get_tags_monthly_popularity_data(selected_tags)
            get_most_mentioned_accounts_data(selected_tags)
            get_most_popular_hashtags_data(selected_tags)
            get_most_influential_tweets_data(selected_tags)
            get_ordinal_summary_subjectivity_scores_data(selected_tags)
            get_tags_map_data(selected_tags)
            get_tags_statistics_data(selected_tags)

        }
    }, [])
    
    return (
        <>
            {
                loading && <Zoom>
                    <Row style={paragraphRowStyle}>
                        <Col span={24}> 
                            <TagPageParagraph selected_tags={tags} subject={"Intro"} />
                        </Col>
                    </Row>
                    <Row style={paragraphRowStyle}>
                        <Col span={24}> 
                            <Loader on_loading_complete={handle_loading_complete}/>
                        </Col>
                    </Row>
                </Zoom>
            }

            {
                !loading && <> <Row style={{marginTop: '2rem', marginBottom: '1.5rem'}}>
                    <Col span={12} offset={6}>
                        <img src={NatureSvg} style={{ width: '9rem' }}/>
                    </Col>
                </Row>
                {
                <Zoom>
                    <Row style={paragraphRowStyle}>
                        <Col span={24}> 
                            <TagPageParagraph subject={"Statistic"} />
                        </Col>
                    </Row>
                </Zoom>
                }
                {
                    tags != [] && start_date_month != "" && end_date_month != "" && tags_statistics_data != null && <>
                        <Zoom>
                            <Row style={rowStyle}>
                                <Col span={24}>
                                    <StatisticHandler 
                                        tags={tags}
                                        data={tags_statistics_data}
                                    />
                                </Col>
                            </Row>
                        </Zoom>
                </>
                }

                {
                    <Zoom>
                        <Row style={rowStyle}>
                            <Col span={24}> 
                                <TagPageParagraph subject={"Topic Popularity"} />
                            </Col>
                        </Row>
                    </Zoom>
                }
                {
                    tags_monthly_popularity_data != null && <Zoom>
                        <Row style={rowStyle}>
                            <Col span={24}> 
                                <TagsPopularityHandler data={tags_monthly_popularity_data}/>
                            </Col>
                        </Row>
                    </Zoom> 
                }



                {
                    <Zoom>
                        <Row style={rowStyle}>
                            <Col span={24}> 
                                <TagPageParagraph subject={"Calendar"} />
                            </Col>
                        </Row>
                    </Zoom>
                }
                {
                    calendar_tags_data === null && <Tag icon={<SyncOutlined spin />} color="processing">
                        Loading calendar heatmap...
                    </Tag>
                }
                {
                    tags != [] && start_date_month != "" && end_date_month != "" && calendar_tags_data != null && <>
                        <Zoom>
                            <Row style={rowStyle}>
                                <Col span={24}>
                                    <CalendarHandler 
                                        dropdown_tags={tags}
                                        data={calendar_tags_data}
                                    />
                                </Col>
                            </Row>
                        </Zoom>
                    </>
                }





                {
                    <Zoom>
                        <Row style={rowStyle}>
                            <Col span={24}> 
                                <TagPageParagraph subject={"Hashtags"} />
                            </Col>
                        </Row>
                    </Zoom>
                }
                {
                    tags != [] && start_date_month != "" && end_date_month != "" && most_popular_hashtags_data != null && <>
                        <Zoom>
                            <Row style={rowStyle}>
                                <Col span={24}>
                                    <HashtagsAndMentionsBarChartHandler 
                                        start_date_month={start_date_month}
                                        end_date_month={end_date_month}
                                        dropdown_tags={tags}
                                        data_type={"Hashtags"}
                                        data={most_popular_hashtags_data}
                                    />
                                </Col>
                            </Row>
                        </Zoom>
                    </>
                }





                {
                    <Zoom>
                        <Row style={rowStyle}>
                            <Col span={24}> 
                                <TagPageParagraph selected_tags={tags} subject={"Wordcloud"} />
                            </Col>
                        </Row>
                    </Zoom>
                }
                {
                    tags != [] && start_date_month != "" && end_date_month != "" && tags_wordcloud_data != null && <>
                        <Zoom>
                            <Row style={rowStyle}>
                                <Col span={24}>
                                    <WordCloudHandler 
                                        start_date_month={start_date_month}
                                        end_date_month={end_date_month}
                                        dropdown_tags={tags}
                                        data={tags_wordcloud_data}                   
                                    />
                                </Col>
                            </Row>
                        </Zoom>
                    </>
                }




                {
                    <Zoom>
                        <Row style={rowStyle}>
                            <Col span={24}> 
                                <TagPageParagraph tags={tags} subject={"Mentions"} />
                            </Col>
                        </Row>
                    </Zoom>
                }
                {
                    tags != [] && start_date_month != "" && end_date_month != "" && most_mentioned_accounts_data != null && <>
                        <Zoom>
                            <Row style={rowStyle}>
                                <Col span={24}>
                                    <HashtagsAndMentionsBarChartHandler 
                                        start_date_month={start_date_month}
                                        end_date_month={end_date_month}
                                        dropdown_tags={tags}
                                        data_type={"Mentions"}
                                        data={most_mentioned_accounts_data}
                                    />
                                </Col>
                            </Row>
                        </Zoom>
                    </>
                }






                {
                    <Zoom>
                        <Row style={rowStyle}>
                            <Col span={24}> 
                                <TagPageParagraph tags={tags} subject={"Subjectivity Scores"} />
                            </Col>
                        </Row>
                    </Zoom>
                }
                {
                    tags != [] && start_date_month != "" && end_date_month != "" && ordinal_summary_tags_subj_scores_data != null && <>
                        <Zoom>
                            <Row style={rowStyle}>
                                <Col span={24}>
                                    <OrdinalSummaryHandler 
                                        data={ordinal_summary_tags_subj_scores_data}
                                        dropdown_tags={tags}
                                        start_date_month={start_date_month}
                                        end_date_month={end_date_month}
                                    />
                                </Col>
                            </Row>
                        </Zoom>
                    </>
                }



                {
                    <Zoom>
                        <Row style={rowStyle}>
                            <Col span={24}> 
                                <TagPageParagraph selected_tags={tags} subject={"Map"} />
                            </Col>
                        </Row>
                    </Zoom>
                }
                {
                    tags != [] && start_date_month != "" && end_date_month != "" && tags_map_data != null && <>
                        <Zoom>
                            <Row style={rowStyle}>
                                <Col span={24}>
                                    <MapHandler 
                                        data={tags_map_data}
                                        dropdown_tags={tags}
                                    />
                                </Col>
                            </Row>
                        </Zoom>
                    </>
                }





                {
                    <Zoom>
                        <Row style={rowStyle}>
                            <Col span={24}> 
                                <TagPageParagraph tags={tags} subject={"Influential Tweets"} />
                            </Col>
                        </Row>
                    </Zoom>
                }
                {
                    tags != [] && start_date_month != "" && end_date_month != "" && most_influential_tweets_data != null && <>
                        <Zoom>
                            <Row style={rowStyle}>
                                <Col span={24}>
                                    <MostInfluentialTweetsHandler 
                                        start_date_month={start_date_month}
                                        end_date_month={end_date_month}
                                        dropdown_tags={tags}
                                        data={most_influential_tweets_data}
                                    />
                                </Col>
                            </Row>
                        </Zoom>
                    </>
                }

                {
                    <Zoom>
                        <Row style={rowStyle}>
                            <Col span={24}> 
                                <TagPageParagraph tags={tags} subject={"Closing Paragraph"} />
                            </Col>
                        </Row>
                    </Zoom>
                }
                </>
            }
            
        </>
    )
}

export default TagsExplorationPage;
