import React, {useEffect, useState} from 'react';
import { Row, Col } from 'antd';
import { HomeOutlined, InfoCircleOutlined } from'@ant-design/icons';


const home_btn_active_style = {
    fontWeight: 800,
    marginRight: '2rem',
    float: 'right'
}

const home_btn_not_active_style = {
    marginRight: '2rem',
    float: 'right'
}

const about_btn_active_style = {
    fontWeight: 800,
    marginLeft: '2rem',
    float: 'left'
}

const about_btn_not_active_style = {
    marginLeft: '2rem',
    float: 'left'
}

const NavBar = () => {

    const [current_url, set_current_url] = useState(false)

    useEffect(() => {
        set_current_url(window.location.pathname)
    }, [])
    
    return (
        <>
            <Row>
                <Col span={12}>
                    <a style={current_url === '/' ? home_btn_active_style : home_btn_not_active_style} 
                        href="/">
                        Home <HomeOutlined />
                    </a>
                </Col>
                <Col span={12}>
                    <a 
                        style={current_url === '/about' ? about_btn_active_style : about_btn_not_active_style} 
                        href="/about">
                        About <InfoCircleOutlined />
                    </a>
                </Col>
            </Row>
        </>
    )
}
export default NavBar;
