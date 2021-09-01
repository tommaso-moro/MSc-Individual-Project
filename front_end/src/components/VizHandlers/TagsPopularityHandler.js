import React, {useEffect, useState} from 'react'
import {Radio} from 'antd'

import TagsPopularityBarChart from '../VisualizationComponents/TagsPopularityBarChart';


const TagsPopularityHandler = (props) => {

    const [data, set_data] = useState(null)
    const [show_normalized_data, set_show_normalized_data] = useState(null)

    const on_radio_select = e => {
        const selected_option = e.target.value
        set_show_normalized_data(selected_option === "actual" ? false : true)
    }

    useEffect(() => {
        set_data(props.data)
        set_show_normalized_data(false)
    }, [])

    const vis_is_ready = data != null 

    return (
        <>
            {
                vis_is_ready && <>
                    <div style={{float: 'right'}}>
                        <Radio.Group defaultValue="actual" size="small" onChange={on_radio_select}>
                            <Radio.Button value="actual">Actual values</Radio.Button>
                            <Radio.Button value="normalized">Normalized values</Radio.Button>
                        </Radio.Group>
                    </div>

                    <TagsPopularityBarChart key={Math.random()} data={data} show_normalized_data={show_normalized_data}/>
                </>
            }
        </>
    )
}

export default TagsPopularityHandler;