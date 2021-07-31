import React, { useState, useEffect } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed'
import api_calls from '../../api.js'


const EmbeddedTweet = (props) => {

    const [tweets, set_tweets] = useState([])

    useEffect(() => {
        api_calls.most_influential_tweets.get_most_liked_tweets_by_tag(props.tag)
            .then(res => {
                set_tweets(res)
            })
    })

    return (
        <> 
        {tweets != [] && tweets.map((tweet) => {
            return <TwitterTweetEmbed 
            // Here goes your copied ID.
            tweetId={tweet} 
            key={tweet}
            // Style options goes here:
            //options={{width: "900px", height: "400px"}} 
            />
        })}
        </>
        
        
    )
}

export default EmbeddedTweet;
