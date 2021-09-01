import React, { useEffect, useState, useRef } from 'react'

import { Row, Col } from 'antd';

import VizConfigRadio from '../UIComponents/VizConfigRadio';
import MonthSelect from '../UIComponents/MonthSelect';

import OrdinalSummary from '../VisualizationComponents/OrdinalSummary';


const OrdinalSummaryHandler = (props) => {
    const ref = useRef(null);

    const [tags_subj_scores_data, set_tags_subj_scores_data]= useState(null)
    const [dropdown_tags, set_dropdown_tags] = useState(null)
    const [ordinal_summary_width, set_ordinal_summary_width] = useState(0)

    const [show_ordinal_summary_month_select, set_show_ordinal_summary_month_select] = useState(false)
    const [selected_month, set_selected_month] = useState(null)
    const [start_date_month, set_start_date_month] = useState(null)
    const [end_date_month, set_end_date_month] = useState(null)
    const [ordinal_summary_active_data, set_ordinal_summary_active_data] = useState(null)

    const ordinal_summary_data_setter = (tags_data, month=null) => {
        if (month == null) {
            var overall_data = [] //i.e. non-monthly data
            for (var i = 0; i < tags_data.length; i++) {
                if (tags_data[i].month == "n/a") {
                    overall_data.push(tags_data[i])
                }
            }
            set_ordinal_summary_active_data(overall_data)
        } else {
            var month_data = [] //i.e. non-monthly data
            for (var i = 0; i < tags_data.length; i++) {
                if (tags_data[i].month == month) {
                    month_data.push(tags_data[i])
                }
            }
            set_ordinal_summary_active_data(month_data)
        }
    }

    const handle_month_selection = year_month => {
        set_selected_month(year_month)
        ordinal_summary_data_setter(tags_subj_scores_data, year_month)
    }

    const handle_radio_selection = e => {
        const selected_option = e.target.value;
        switch (selected_option) {
            case "monthly":
                set_selected_month(end_date_month)
                set_show_ordinal_summary_month_select(true)
                ordinal_summary_data_setter(tags_subj_scores_data, end_date_month)
                break
            case "overall":
                set_selected_month(null)
                set_show_ordinal_summary_month_select(false)
                ordinal_summary_data_setter(tags_subj_scores_data)
                break
            default:
                break
        }
    } 

    const handleResize = () => {
        if (ref.current && (window.innerWidth > 0)) {
            set_ordinal_summary_width(ref.current.offsetWidth)
        }
    }

    //every time the window is resized, call method "handleResize"
    window.addEventListener('resize', handleResize)

    useEffect(() => {
        console.log(props.data)
        set_tags_subj_scores_data(props.data)
        set_dropdown_tags(props.dropdown_tags) 
        set_start_date_month(props.start_date_month);
        set_end_date_month(props.end_date_month);
        var overall_data = [] //i.e. non-monthly data
        for (var i = 0; i < props.data.length; i++) {
            if (props.data[i].month == "n/a") {
                overall_data.push(props.data[i])
            }
        }
        ordinal_summary_data_setter(overall_data)
    }, [])

    const vis_is_ready = tags_subj_scores_data != null && 
                         dropdown_tags != null && 
                         ref != null &&
                         start_date_month != null && 
                         end_date_month != null &&
                         ordinal_summary_active_data != null

    return (
        <div ref={ref} style={{width: '100%'}}>
        {
            vis_is_ready && <>
                <Row>
                    <Col span={24}>
                        <div style={{float: 'right'}}>
                            {
                            show_ordinal_summary_month_select && <div style={{margin: '1rem'}}>
                                <MonthSelect 
                                    start_month={start_date_month} 
                                    end_month={end_date_month} 
                                    chart={"ordinal_summary"} 
                                    on_month_select={handle_month_selection}/>
                                </div>
                            }
                            <VizConfigRadio on_radio_select={handle_radio_selection} chart={"ordinal_summary"}/>
                        </div>
                    </Col>
                </Row>
            
                <OrdinalSummary 
                    scores={ordinal_summary_active_data} 
                    tags={dropdown_tags}
                    width={(ordinal_summary_width == 0) ? ref.current.offsetWidth : ordinal_summary_width}
                    key={Math.random()}
                    >
                    
                </OrdinalSummary>
            </>
        }
        </div>
    )
}

export default OrdinalSummaryHandler;
