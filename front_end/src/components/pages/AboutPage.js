import React from 'react'
import {Row, Col} from 'antd';
import { Typography } from 'antd';
import TweetSvg from "../../undraw_tweet.svg";


const { Text, Title } = Typography;

const rowStyle = {
    margin: 'auto',
    width: '60%'
}

const paragraphStyle = {
    fontSize: '1.2rem'
}



const AboutPage = () => {
    return (
        <>
            <div style={{marginTop: '7rem', marginBottom: '4.5rem'}}>
                <Row>
                    <Col span={12} offset={6}>
                        <img src={TweetSvg} style={{ width: '15rem' }}/>
                    </Col>
                </Row>
            </div>

            <div style={{marginTop: '3rem'}}>
                <Row style={rowStyle}>
                    <Col span={24}>
                        <Title>FAQ</Title>
                    </Col>
                </Row>
            </div>

            <div>
            <Row style={rowStyle}>
                <Col span={24}>
                    <Text strong style={paragraphStyle}>What is this tool?</Text>
                </Col>
            </Row>
            </div>

            <div style={{marginBottom: '2rem'}}>
            <Row style={rowStyle}>
                <Col span={24}>
                    <Text style={paragraphStyle}>This is a <Text underline>publicly accessible</Text> and <Text underline>open source</Text> tool that allows users to interactively <Text mark>explore</Text> data 
                    sets of tweets related to sustainability.
                    </Text>
                </Col>
            </Row>
            </div>

            <div style={{marginTop: '2rem'}}>
            <Row style={rowStyle}>
                <Col span={24}>
                    <Text strong style={paragraphStyle}>How many tweets make up the data set? And when were the tweets posted?</Text>
                </Col>
            </Row>
            </div>

            <div style={{marginBottom: '2rem'}}>
            <Row style={rowStyle}>
                <Col span={24}>
                    <Text style={paragraphStyle}>Around <Text mark>4.5 million</Text> tweets were collected. All tweets were posted between September 1, 2020 and June 18, 2021.
                    </Text>
                </Col>
            </Row>
            </div>

            <div style={{marginTop: '2rem'}}>
            <Row style={rowStyle}>
                <Col span={24}>
                    <Text strong style={paragraphStyle}>Is this project open source? Where can I find the code?</Text>
                </Col>
            </Row>
            </div>

            <div style={{marginBottom: '2rem'}}>
            <Row style={rowStyle}>
                <Col span={24}>
                    <Text style={paragraphStyle}>Yes it is! The code is available here: <a target="_blank" href="https://github.com/tommaso-moro/MSc-Individual-Project">https://github.com/tommaso-moro/MSc-Individual-Project</a>
                    </Text>
                </Col>
            </Row>
            </div>

            <div style={{marginTop: '3rem'}}>
            <Row style={rowStyle}>
                <Col span={24}>
                    <Text strong style={paragraphStyle}>Contact:</Text>
                </Col>
            </Row>
            </div>

            <div style={{paddingBottom: '2rem'}}>
            <Row style={rowStyle}>
                <Col span={24}>
                    <Text>tm1120@ic.ac.uk
                    </Text>
                </Col>
            </Row>
            </div>
        </>
    )
}
export default AboutPage;
