import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom"; 
import api_calls from '../../api'
import { v4 as uuidv4 } from 'uuid';
import { Button, Row, Col } from 'antd';

import TagMultipleSelect from '../UIComponents/TagMultipleSelect'
import NatureSvg from "../../nature.svg";









const HomePage = () => {

    const history = useHistory()
    const [tags, set_tags] = useState([])
    const [dates, set_dates] = useState([])
    const [start_date_month, set_start_date_month] = useState("")
    const [end_date_month, set_end_date_month] = useState("")
    const [selected_tags, set_selected_tags] = useState([])
    const [explore_btn_is_disabled, set_explore_btn_is_disabled] = useState(true)

    const handle_tag_selection = () => {
        if (selected_tags.length == 0) {
            alert('Oops! You need to select one or more topics in order to continue')
        } else {
            history.push({
                pathname: '/topics_comparison',
                search: "",
                state: { 
                    selected_tags: selected_tags,
                    tag_start_date_month: start_date_month,
                    tag_end_date_month: end_date_month,
                    all_tags: tags
                }
            })
        }
    
    }


    const select_tags = (tags) => {
        set_selected_tags(tags)
        set_explore_btn_is_disabled(tags.length != 0 ? false : true)
    }

    useEffect(() => {
        api_calls.tags_and_dates.get_tags_and_dates()
            .then(res => {
                set_dates(res[0]["months"])
                set_tags(res[0]["tags"])
                set_start_date_month(res[0]["start_date_month"])
                set_end_date_month(res[0]["end_date_month"])
            })
    },[])
    return (
        <>
        <div style={{width: '85%', margin: 'auto'}}>

            <Row style={{marginTop: '3.5rem', marginBottom: '2.5rem'}}>
                <Col span={12} offset={6}>
                    <img src={NatureSvg} style={{ width: '9rem' }}/>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <h1>Large Scale Observatory For Sustainability-Related Twitter Activity</h1>
                </Col>
            </Row>


            <Row style={{marginTop: '2rem'}}>
                <Col span={12} offset={6}>
                    <h3>
                        Welcome! This is a publicly-accessible tool to explore how people around the world tweet about sustainability-related topics. 
                    </h3>
                </Col>
            </Row>
            
            <Row style={{marginTop: '2rem'}}>
                <Col span={12} offset={6}>
                    <h3>Pick up to 5 topics to explore</h3>
                </Col>
            </Row>


        {
            tags.length != 0 && <Row>
                <Col span={12} offset={6}>
                    <TagMultipleSelect 
                        tags={tags} 
                        handleSelection={select_tags}
                    />
                    <Button 
                        shape="round"
                        disabled={explore_btn_is_disabled}
                        style={{margin: '1rem'}}
                        onClick={handle_tag_selection}
                        >
                            Explore!
                    </Button>
                </Col>
            </Row>
        }
        </div>
        </>

    )
}

export default HomePage;