import React from 'react'
import {Radio} from 'antd'


const VizConfigRadio = (props) => {


    return (
        <Radio.Group defaultValue="overall" size="small" onChange={(e) => props.on_radio_select(e, props.chart)}>
            <Radio.Button value="overall">Overall data</Radio.Button>
            <Radio.Button value="monthly">By Month</Radio.Button>
        </Radio.Group>
    )
}

export default VizConfigRadio;
