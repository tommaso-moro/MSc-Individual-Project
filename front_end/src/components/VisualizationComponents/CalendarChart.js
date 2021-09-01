import React, { useState, useEffect } from 'react'; 
import { ResponsiveCalendar } from '@nivo/calendar'


const CalendarChart = (props) => {

    const from = {from: props.start_date}
    const to = {to: props.end_date}
    const [data, set_data] = useState([])

    useEffect(() => {
        set_data(props.data)
    }, [])


    return (
            <ResponsiveCalendar
            key={props.key}
            width={props.width}
            height={window.innerHeight}
            data={data}
            {...from}
            {...to}
            emptyColor="#eeeeee"
            colors={[ '#d4fcf5', '#aef2e6', '#61cdbb', '#e8c1a0', '#f47560', '#c0392b', '#80150a']}
            margin={{ top: 1, right: 1, bottom: 1, left: 1 }}
            yearSpacing={40}
            monthBorderColor="#ffffff"
            dayBorderWidth={3}
            dayBorderColor="#ffffff"
            legends={[
                {
                    anchor: 'top-left',
                    direction: 'row',
                    translateY: 90,
                    itemCount: 6,
                    itemWidth: 42,
                    itemHeight: 0,
                    itemsSpacing: 15,
                    itemDirection: 'right-to-left'
                }
            ]}
        />
        
    )
}

export default CalendarChart;