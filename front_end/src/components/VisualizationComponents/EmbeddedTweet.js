import React, { useEffect } from 'react';
import { Tweet } from 'react-twitter-widgets'


const EmbeddedTweet = (props) => {

    useEffect(() => {
    }, [])

    return (
        <Tweet
            tweetId={props.tweet_id} 
            
        />
        
        
        
    )
}

export default EmbeddedTweet;
