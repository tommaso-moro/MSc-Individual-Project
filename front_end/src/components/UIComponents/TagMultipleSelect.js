import { Select, Tag } from 'antd';
import React, {useEffect, useState} from 'react'
import { tags_colors } from '../../helpers.js'
import { TagOutlined } from'@ant-design/icons';


const colors_config = {}

function tagRender(props) {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = event => {
    event.preventDefault();
    event.stopPropagation();
    };
    return (
        <Tag
        color={colors_config[label]}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, borderRadius: '10px' }}
        >
        {label} <TagOutlined/>
        </Tag>
    );
}

const TagMultipleSelect = (props) => {

    const [options, set_options] = useState([])
    const [selected_tags, set_selected_tags] = useState([])


    //when the user has reached the max number of selected tags, all the tags that the user
    //has not selected will be disabled (i.e. he won't be able to select them).
    const disable_unselected_tags = () => {
        var options_temp = []
        for (var i = 0; i < props.tags.length; i++) {
            options_temp.push({
                value: props.tags[i],
                disabled: selected_tags.includes(props.tags[i]) ? false : true
            })
            set_options(options_temp)
        }
    }

    //enable all the tags, i.e. make them all selectable
    const enable_all_tags = () => {
        var options_temp = []
        for (var i = 0; i < props.tags.length; i++) {
            options_temp.push({
                value: props.tags[i],
                disabled: false
            })
            set_options(options_temp)
        }
    }


    const handle_deselect = deselected_tag => {
        //create a copy of the current selected tags, leaving out the deselected tag
        var new_selected_tags = []
        for (var i = 0; i < selected_tags.length; i++) {
            if (selected_tags[i] !== deselected_tag) {
                new_selected_tags.push(selected_tags[i])
            }
        }

        //update the value of selected_tags
        set_selected_tags(new_selected_tags)

        //if the user has reached the 5 tags limit and they deselect a tag, enable all tags
        if (selected_tags.length === 5) {
            enable_all_tags()
        }

        props.handleSelection(new_selected_tags)
        
    }

    const handle_select = selected_tag => {
        var current_selection = selected_tags

        //if the user has selected less than 5 tags so far, allow the user to select another tag
        if (selected_tags.length < 5) {
            current_selection.push(selected_tag)

            //if this selected tag is the 5th selected tag, then disable every other tag
            if (selected_tags.length === 5) { 
                disable_unselected_tags() 
            } 
            set_selected_tags(current_selection)
        } 
        props.handleSelection(current_selection)
    }

    // set up the colors_config dictionary by assigning each tag 
    // with a distinct color. 
    // the colors_config dict then looks like:
    //  {
    //    "Biodiversity": "rgba(103,44,88, 0.9)",
    //    "Regenerative Agriculture": "rgba(11, 198, 145, 0.9)"
    //    ...
    //  }
    const set_up_tags_colors = () => {
        for (var i = 0; i < props.tags.length; i++) {
            colors_config[props.tags[i]] = tags_colors[i]
        }
    }

    useEffect(() => {
        //make all tags selectable in the select-list
        enable_all_tags()

        //assign a distinct color to each tag
        set_up_tags_colors()

        //set up the configuration options for the <Select> UI component
    }, [])
    return (
        <Select
            mode="multiple"
            showArrow
            tagRender={tagRender}
            placeholder="Click me to select a topic!"
            style={{ width: '70%'}}
            options={options}
            onSelect={handle_select}
            onDeselect={handle_deselect}
            size={"large"}
        />
    )
}

export default TagMultipleSelect;
