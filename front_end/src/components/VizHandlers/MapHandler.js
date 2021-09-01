import React, { useEffect, useState, useRef } from 'react';

import { Row, Col } from 'antd';

import TagSingleSelect from '../UIComponents/TagSingleSelect';
import Map from '../VisualizationComponents/Map';



const MapHandler = (props) => {

    const ref =useRef(null)

    const [tags_map_data, set_tags_map_data] = useState(null)
    const [dropdown_tags, set_dropdown_tags] = useState(null)
    
    const [map_active_data, set_map_active_data] = useState(null)
    const [selected_tag, set_selected_tag] = useState(null)

    const [map_width, set_map_width] = useState(0)

    //hooks
    const handle_tag_selection = tag => {
        set_selected_tag(tag)
        map_data_setter(tags_map_data, tag)
    }

    const map_data_setter = (tags_data, tag) => {
        for (var i = 0; i < tags_data.length; i++) {
            if (tags_data[i].tag == tag) {
                const data = tags_data[i].geo_data
                set_map_active_data(data)
            }
        }
    }

    //method to dynamically update the map width whenever the window is resized.
    //this is needed because the react-map-gl library (which powers the map) does not take care of it automatically.
    const handleResize = () => {
        if (ref.current && (window.innerWidth > 0)) {
            set_map_width(ref.current.offsetWidth)
        }
    }

    //every time the window is resized, call method "handleResize"
    window.addEventListener('resize', handleResize)

    useEffect(() => {
        set_tags_map_data(props.data)
        set_dropdown_tags(props.dropdown_tags)

        //set a default tag to display when the vis is rendered the first time
        const default_tag = props.dropdown_tags[0]
        set_selected_tag(default_tag)
        map_data_setter(props.data, default_tag)
    }, [])

    const vis_is_ready = tags_map_data != null && dropdown_tags != null

    return (
        <div ref={ref} style={{width: '100%'}}>
            {
                vis_is_ready && <>
                    <Row>
                        <Col span={24}>
                            <div style={{float: 'right', width: '20%', marginTop: '1rem'}}>
                                <TagSingleSelect 
                                    tags={dropdown_tags} 
                                    on_tag_selection={handle_tag_selection}
                                    chart="map"
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <div style={{marginTop: '1rem'}}>
                                <Map 
                                    data={map_active_data} 
                                    width={(map_width == 0) ? ref.current.offsetWidth : map_width}/
                                >
                            </div>
                        </Col>
                    </Row>
                </>
            }
        </div>
    )
}

export default MapHandler;
