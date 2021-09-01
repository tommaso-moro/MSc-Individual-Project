import React from 'react'
import { Select } from 'antd';

import { RetweetOutlined, LikeOutlined } from'@ant-design/icons';


const { Option } = Select;

const RetweetsVsLikesSelect = (props) => {



    return (
        <Select style={{ width: '100%' }} defaultValue={"most_liked"} onChange={(selected_option) => props.on_retweeted_vs_liked_selection(selected_option)}>
            <Option value={"most_retweeted"}>Most Retweeted <RetweetOutlined /></Option>
            <Option value={"most_liked"}>Most Liked <LikeOutlined /></Option>
        </Select>
    )
}

export default RetweetsVsLikesSelect;
