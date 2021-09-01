import React, {useEffect, useState} from 'react'

import { Typography, Tag } from 'antd';
import { LineChartOutlined, TwitterOutlined, MonitorOutlined, SmileOutlined, EnvironmentOutlined } from'@ant-design/icons';


const { Text, Title } = Typography;

const colors = ["volcano", "green", "geekblue", "purple", "lime", "magenta"]

const TagPageParagraph = (props) => {

    const paragraphStyle = {
        fontSize: '1.2rem'
    }

    const [paragraph_subject, set_paragraph_subject] = useState(null)



    useEffect(() => {
        set_paragraph_subject(props.subject)
    }, [])


    return (
        <div style={{marginTop: '3rem', marginBottom: '1.5rem'}}>
            {
                paragraph_subject != null && <>
                    {
                        paragraph_subject === "Intro" && <>
                            <Title>Welcome!</Title>
                            <Text style={paragraphStyle}>On this page, you will explore and interact with some <Text mark>data visualizations</Text> which will
                                give you insights into how Twitter activity related to  {
                                    props.selected_tags.map((tag, index) => {
                                        return <>
                                            <Tag color={colors[index]}>{tag}
                                            </Tag>
                                        </>
                                    })
                                }
                                around the globe. Enjoy! <TwitterOutlined />
                            </Text>
                        </>
                    }


                    {
                        paragraph_subject === "Statistic" && <>
                        <Title>Topics' popularity <LineChartOutlined /></Title>
                        <Text style={paragraphStyle}>Let's start with the basics: <Text underline>just how popular are the topics you selected</Text>? To start, let's look at <Text mark>how many tweets</Text> were 
                        found for each topic.</Text>
                        <br/>
                        <div style={{marginTop: '1rem'}}>
                        <Text style={paragraphStyle}>Here are some high-level statistics: </Text>
                        </div>
                        </>
                    }
                    {
                        paragraph_subject === "Topic Popularity" && <>
                        <Text style={paragraphStyle}>The following bar chart breaks down topics' popularity <Text mark>by month</Text>. It is useful to observe
                        trends related to how the volume of tweets for a given topic <Text mark>changes over time</Text>, as well as for comparing how topics' popularity 
                        has evolved over time.
                        </Text>
                        </>
                    }
                    {
                        paragraph_subject === "Calendar" && <Text style={paragraphStyle}>The following visualization is a <Text mark>calendar heatmap</Text>: it goes even further and 
                        shows you how many tweets were generated for each topic, <Text underline>day by day</Text>. Through this visualization, it is possible to <Text mark>observe daily fluctuations</Text> in 
                        how topics are discussed on Twitter.</Text>
                    }
                    {
                        paragraph_subject === "Hashtags" && <>
                        <Title>Textual Analysis <MonitorOutlined /></Title>
                        <Text style={paragraphStyle}>Data related to tweet volumes is useful, but tweets also comprise of text which means
                        that <Text underline>textual analysis</Text> is relevant too. Let's dive into it! Analyzing user-generated <Text mark>hashtags</Text> is key to understanding the <Text mark>focal topics</Text> of tweets. The following bar chart breaks down
                        the 30 most common hashtags for any given topic of your choice. Check it out! </Text>
                        </>
                    }
                    {
                        paragraph_subject === "Mentions" && <Text style={paragraphStyle}>On Twitter, users can mention other users in their tweets. But which are the <Text mark>most mentioned</Text> accounts
                        for any given conversation on Twitter? Let's find out below! </Text>
                    }
                    {
                        paragraph_subject === "Wordcloud" && <Text style={paragraphStyle}>Speaking of textual analysis, it would be interesting to see <Text underline>what users talk about in their tweets</Text>. However, this is not
                        always reflected by hashtags. One way of inferring the most common topics in large volumes of tweets is to measure the frequency of each term that appears in the tweets. Key topics will emerge as
                        their keywords them will have higher frequency than less common topics. The following interactive <Text mark>word cloud</Text>  visualizes this term-frequency ranking, giving you insights on what users
                        actually talk about when they talk about {
                                    props.selected_tags.map((tag, index) => {
                                        return <>
                                            <Tag color={colors[index]}>{tag}
                                            </Tag>
                                        </>
                                    })
                                } </Text>
                    }
                    {
                        paragraph_subject === "Subjectivity Scores" && <Text style={paragraphStyle}>Textual analysis of tweets does not simply boil down to things like <Text underline>topic modelling</Text> and <Text underline>hashtag analysis</Text>. While it is useful to look
                        at <Text italic>what</Text> people talk about, it would also be interesting to know <Text italic>how</Text>  they talk about it. In Natural Language Processing
                        , <Text mark>subjectivity analysis</Text> is a form of sentiment analysis which is concerned with understanding how subjective a given piece of text is. What happens under the hood is quite complicated, but eventually 
                        a <Text mark>subjectivity score</Text> ranging from 0 to 1 is assigned to any given piece of text: a score closer to 0 means the text exhibits low subjectivity (and very high objectivity), whereas a 
                        score closer to 1 means the text exhibits high subjectivity (and low objectivity). The following visualization shows the distribution of subjectivity scores across the topic-specific data sets of tweets that were collected. Check it out! </Text>
                    }
                    {
                        paragraph_subject === "Map" && <>
                        <Title>Geospatial Analysis <EnvironmentOutlined /></Title>
                        <Text style={paragraphStyle}>Some tweets (not many though!) come with <Text mark>geospatial data</Text> , i.e. information about the location that their author attached to them. The following <Text underline>cluster-driven interactive map</Text> allows 
                        you to see the geospatial distribution of tweets related to your topics of choice: {
                                    props.selected_tags.map((tag, index) => {
                                        return <>
                                            <Tag color={colors[index]}>{tag}
                                            </Tag>
                                        </>
                                    })
                                } . Geospatial analysis of tweets is useful because it can give insights into how a given topic's popularity varies based on location. 
                                Some topics are much more discussed in some countries rather than others, for instance. Compare the topics you selected! Geographically speaking, are they similarly distributed?</Text>
                        </>
                    }
                    {
                        paragraph_subject === "Influential Tweets" && <>
                        <Title>Influential Tweets <TwitterOutlined /></Title>
                        <Text style={paragraphStyle}><Text underline>Which tweets are users exposed to the most</Text>? Here you can browse the <Text mark>most influential tweets</Text> for each of the topics you selected. You can also break down the tweets by 
                        month, and by most liked or most retweeted.</Text>
                        </>
                    }
                    {
                        paragraph_subject === "Closing Paragraph" && <>
                        <Title>Goodbye! <SmileOutlined /></Title>
                        <Text style={paragraphStyle}>This was a very insighful ride! Thank you for using this tool. Got any questions? 
                        Check the <a href="/about">About</a> page for more information on this tool. </Text>
                        </>
                    }
                </>
            }
        </div>
    )
}

export default TagPageParagraph;
