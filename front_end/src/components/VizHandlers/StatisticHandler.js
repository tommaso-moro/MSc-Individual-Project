import React, {useEffect, useState} from 'react'

import { Col, Row } from 'antd';

import Stat from '../VisualizationComponents/Statistic';


const StatisticHandler = (props) => {

    const [tags, set_tags] = useState(null)
    const [tags_stats, set_tags_stats] = useState(null)

    //adjust statistic layout based on number of statistics to show. "span" defines how large (from 0 to 24) the statistic 
    //column should be (see Ant Design's grid system for reference)
    const get_span = (num_tags) => {
        var span = 0
        switch (num_tags) {
            case 1:
                span = 24
                break;
            case 2:
                span = 12
                break;
            case 3: 
                span = 8
                break;
            case 4:
                span = 6
                break;
            case 5:
                span = 8
                break;
            default:
                break;
        }
        return span

    }

    useEffect(() => {
        set_tags(props.tags)
        set_tags_stats(props.data)
    },[])

    const vis_is_ready = tags != null && tags_stats != null

    return (
        <>
            <Row gutter={16}>
                {
                    vis_is_ready && tags_stats.map((tag_data) => {
                        return <Col span={get_span(tags.length)} style={{padding: '1rem'}}>
                                    <h2>{tag_data.tag}</h2>
                                    <Stat 
                                        title={"Number of tweets found:"}
                                        value={tag_data.num_tweets}
                                    />
                                </Col>
                    })
                }
            </Row>
        </>
    )
}

export default StatisticHandler;
