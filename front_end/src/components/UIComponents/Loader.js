import React, {useEffect, useState} from 'react';
import { Progress, Button, Row, Col } from 'antd';
import { Animated } from 'react-animated-css'

import { ThunderboltOutlined } from'@ant-design/icons';




export const Loader = (props) => {

    const [percent, set_percent] = useState(0)
    const [is_loading, set_is_loading] = useState(true)

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const increase = (previous_percent) => {
        let new_percent = previous_percent + Math.floor(Math.random() * 21); //random number between 1 and 20
        if (new_percent > 100) {
            new_percent = 100;
        }
        return new_percent;
    };


    useEffect( () => {
        async function handle_loader() {
            var percent_tracker = 0;
            await delay(1000);
            while (percent_tracker !== 100) {
                var rand = Math.floor(Math.random() * 800) + 500; //random number betwen 500 and 800
                await delay(rand);
                percent_tracker = increase(percent_tracker)
                set_percent(percent_tracker)
            }
            set_is_loading(false)
        }
        handle_loader();
    }, [])

    return (
        <>
            <>
                <Row>
                    <Col span={24}>
                        <Progress type="circle" percent={percent} />
                    </Col>
                </Row>
                {
                    !is_loading && <Row>
                        <Col span={24}>
                            <Animated animationIn="fadeIn" animationInDelay={500} isVisible={true}>
                                <Button 
                                    size="large"
                                    style={{marginTop: '2rem'}}
                                    shape="round"
                                    onClick={() => props.on_loading_complete()}>
                                    Explore <ThunderboltOutlined />
                                </Button>
                            </Animated>
                        </Col>
                    </Row>
                    
                }
            </>
        </>
    )
}

export default Loader;
