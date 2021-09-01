import React, { useEffect, useState, useRef } from 'react'

import { Row, Col } from 'antd';

import TagSingleSelect from '../UIComponents/TagSingleSelect';

import CalendarChart from '../VisualizationComponents/CalendarChart';

const CalendarHandler = (props) => {
    const ref = useRef(null);
    const [calendar_width, set_calendar_width] = useState(0)

    const [tags_calendar_data, set_tags_calendar_data] = useState(null)
    const [dropdown_tags, set_dropdown_tags] = useState(null)
    const [start_date_day, set_start_date_day] = useState(null)
    const [end_date_day, set_end_date_day] = useState(null)
    const [calendar_active_data, set_calendar_active_data] = useState(null)



    //hooks
    const handle_tag_selection = tag => {
        calendar_data_setter(tags_calendar_data, tag)
    }
  

    const calendar_data_setter = (tags_data, tag) => {
        for (var i = 0; i < tags_data.length; i++) {
            if (tags_data[i].tag === tag) {
                const data = tags_data[i].data
                set_calendar_active_data(data)
            }
        }
    }

    //method to dynamically update the calendar width whenever the window is resized.
    //this is needed because the Nivo Rocks library (which powers the calendar) does not take care of it automatically.
    const handleResize = () => {
        if (ref.current && (window.innerWidth > 0)) {
            set_calendar_width(ref.current.offsetWidth)
        }
    }

    //every time the window is resized, call method "handleResize"
    window.addEventListener('resize', handleResize)

    

    useEffect(() => {
        set_dropdown_tags(props.dropdown_tags);
        set_tags_calendar_data(props.data)

        //set a default tag to display when the vis is rendered the first time
        const default_tag = props.dropdown_tags[0]
        const default_start_day = props.data[0].start_date
        const default_end_day = props.data[0].end_date
        set_start_date_day(default_start_day)
        set_end_date_day(default_end_day)
        calendar_data_setter(props.data, default_tag)
    }, [])

    const vis_is_ready = dropdown_tags != null && 
                         start_date_day != null && 
                         end_date_day != null &&
                         tags_calendar_data != null &&
                         calendar_active_data != null

    return (
        <div style={{width:'100%'}} ref={ref}>
            {
                vis_is_ready && <>

                <Row>
                    <Col span={24}>
                        <div style={{float: 'right', width: '20%', marginTop: '1rem'}}>
                            <TagSingleSelect 
                                tags={dropdown_tags} 
                                on_tag_selection={handle_tag_selection}
                                chart="calendar"
                            />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <CalendarChart key={Math.random()} width={(calendar_width === 0) ? ref.current.offsetWidth : calendar_width} start_date={start_date_day} end_date={end_date_day} data={calendar_active_data}/>
                    </Col>
                </Row>
                </>
            }     
        </div>
    )
};

export default CalendarHandler;
