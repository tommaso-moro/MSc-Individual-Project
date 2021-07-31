import React, { useState, useEffect } from 'react'; 
import { ResponsiveCalendar } from '@nivo/calendar'
import api_calls from '../../api';


const CalendarChart = (props) => {

    const from = {from: props.start_date}
    const to = {to: props.end_date}
    const [data, set_data] = useState([])
    const [tag, set_tag] = useState(props.tag)

    useEffect(() => {
        api_calls.daily_batch.get_daily_calendar_data_by_tag(props.tag)
            .then(res => {
                set_data(res.data)
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])


    return (
        <>
        {
            data == [] && <p>Loading calendar</p>
        }
        {
            data != [] && <ResponsiveCalendar
            data={data}
            {...from}
            {...to}
            emptyColor="#eeeeee"
            colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            yearSpacing={40}
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            legends={[
                {
                    anchor: 'top-left',
                    direction: 'row',
                    translateY: 36,
                    itemCount: 4,
                    itemWidth: 42,
                    itemHeight: 36,
                    itemsSpacing: 14,
                    itemDirection: 'right-to-left'
                }
            ]}
            />
        }
        </>  
        
    )
}

export default CalendarChart;