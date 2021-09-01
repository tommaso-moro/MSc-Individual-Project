import React from 'react'
import { Statistic } from 'antd'

const Stat = (props) => {

    return (
        <Statistic title={props.title} value={props.value} />
    )
}

export default Stat
