import React, {useEffect, useState} from 'react'
import { Select } from 'antd';
import { v4 as uuidv4 } from 'uuid';


const { Option } = Select;

const TagSingleSelect = (props) => {

    const [tags, set_tags] = useState([])


    useEffect(() => {
        set_tags(props.tags)
    }, [])

    return (
        <Select style={{ width: '100%' }} defaultValue={props.tags[0]} onChange={(selected_tag) => props.on_tag_selection(selected_tag, props.chart)}>
            {
                tags.length !== 0 && tags.map(tag => {
                    return <Option 
                                value={tag}
                                key={uuidv4()}
                            >{tag}
                            </Option>
                })
            }
         </Select>
    )
}

export default TagSingleSelect;
