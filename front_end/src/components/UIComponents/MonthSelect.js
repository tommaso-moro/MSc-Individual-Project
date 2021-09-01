import React from 'react'
import { DatePicker } from 'antd';
import moment from 'moment';
import { get_year_month_str_from_moment_obj } from '../../helpers.js';


const monthFormat = 'YYYY/MM';

const MonthSelect = (props) => {


    function disabledDate(current) {  
        return current > moment(props.end_month) || current < moment(props.start_month)
    }

    

    return (
        <DatePicker defaultValue={moment(props.end_month, monthFormat)} 
            format={monthFormat} 
            picker="month" 
            disabledDate={disabledDate}
            onChange={(moment) => props.on_month_select(get_year_month_str_from_moment_obj(moment), props.chart)} />
    )
}

export default MonthSelect;
