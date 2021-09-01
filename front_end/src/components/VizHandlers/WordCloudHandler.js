import React, { useEffect, useState } from 'react';


import { Row, Col } from 'antd';

import TagSingleSelect from '../UIComponents/TagSingleSelect';
import VizConfigRadio from '../UIComponents/VizConfigRadio';
import MonthSelect from '../UIComponents/MonthSelect';
import WordCloud from '../VisualizationComponents/WordCloud';



const WordCloudHandler = (props) => {

    const [tags_wordcloud_data, set_tags_wordcloud_data] = useState(null)
    const [dropdown_tags, set_dropdown_tags] = useState(null)
    const [start_date_month, set_start_date_month] = useState(null)
    const [end_date_month, set_end_date_month] = useState(null)
    const [wordcloud_active_data, set_wordcloud_active_data] = useState(null)

    const [show_wordcloud_month_select, set_show_wordcloud_month_select] = useState(false)
    const [selected_month, set_selected_month] = useState(null)
    const [selected_tag, set_selected_tag] = useState(null)


    //hooks
    const handle_tag_selection = tag => {
        set_selected_tag(tag)

        //check if user is seeing overall data or monthly data
        if (selected_month == null) {
            wordcloud_data_setter(tags_wordcloud_data, tag)
        } else {
            wordcloud_data_setter(tags_wordcloud_data, tag, selected_month)
        }
    }

    const handle_month_selection = year_month => {
        set_selected_month(year_month)
        wordcloud_data_setter(tags_wordcloud_data, selected_tag, year_month)
    }

    const handle_radio_selection = e => {
        const selected_option = e.target.value;
        switch (selected_option) {
            case "monthly":
                set_selected_month(end_date_month)
                set_show_wordcloud_month_select(true)
                wordcloud_data_setter(tags_wordcloud_data, selected_tag, end_date_month)
                break
            case "overall":
                set_selected_month(null)
                set_show_wordcloud_month_select(false)
                wordcloud_data_setter(tags_wordcloud_data, selected_tag)
                break
            default:
                break
        }
    }  

    const wordcloud_data_setter = (tags_data, tag, month=null) => {
        if (month == null) {
            for (var i = 0; i < tags_data.length; i++) {
                if (tags_data[i].tag == tag) {
                    const data = tags_data[i].overall_data
                    set_wordcloud_active_data(data)
                }
            }
        } else {
            //loop through the tags, when you find the right one loop through the months, when you find the right one set the data
            for (var i = 0; i < tags_data.length; i++) {
                if (tags_data[i].tag == tag) {
                    const months = tags_data[i].monthly_data;
                    for (var j = 0; j < months.length; j++) {
                        if (months[j]["month"] == month) {
                            const data = tags_data[i].monthly_data[j].data
                            set_wordcloud_active_data(data)
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
        set_tags_wordcloud_data(props.data)

        //set a default tag to display when the vis is rendered the first time
        const default_tag = props.dropdown_tags[0]
        set_selected_tag(default_tag)
        wordcloud_data_setter(props.data, default_tag)
    }, [])

    const vis_is_ready = dropdown_tags != null && 
                         start_date_month != null && 
                         end_date_month != null &&
                         tags_wordcloud_data != null &&
                         wordcloud_active_data != null


    return (
        <>
            {
                vis_is_ready && <>
                <Row>
                    <Col span={24}>
                        <div style={{float: 'right'}}>
                            {
                            show_wordcloud_month_select && <div style={{margin: '1rem'}}>
                                <MonthSelect 
                                    start_month={start_date_month} 
                                    end_month={end_date_month} 
                                    chart={"wordcloud"} 
                                    on_month_select={handle_month_selection}/>
                                </div>
                            }
                            <VizConfigRadio on_radio_select={handle_radio_selection} chart={"wordcloud"}/>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <div style={{float: 'right', width: '20%', marginTop: '1rem'}}>
                            <TagSingleSelect 
                                tags={dropdown_tags} 
                                on_tag_selection={handle_tag_selection}
                                chart="wordcloud"
                            />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <WordCloud data={wordcloud_active_data}/>
                    </Col>
                </Row>
                </>
            }
        </>
    )
}

export default WordCloudHandler;
