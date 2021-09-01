import axios from 'axios';

var API_URL = '' 
if (process.env.NODE_ENV === 'development') {
    API_URL = 'http://localhost:5000/api/'
} else {
    API_URL = "/api/"
}
const axiosInstance = axios.create({ baseURL: API_URL });

const api_calls = {
    daily_batch: {
        get_daily_calendar_data_by_tag: (tag) => axiosInstance.get("/daily_batches/daily_calendar_data_by_tag/", {
            params: {
                "tag": tag
            }
        })
            .then(res => res.data),
        get_daily_calendar_data_by_tags: (tags) => axiosInstance.get("/daily_batches/daily_calendar_data_by_tags", {
            params: {
                "tags": tags
            }
        })
            .then(res => res.data)
    },
    monthly_batch: {
        get_line_chart_monthly_data: () => axiosInstance.get("/line_chart_monthly_data/")
            .then(res => res.data[0])
    },
    geo_spatial_data: {
        get_geo_spatial_data_for_all_tags: () => axiosInstance.get('/geo_spatial_data/')
            .then(res => res.data),
        get_geo_spatial_data_by_tag: (tag) => axiosInstance.get('/geo_spatial_data/by_tag/', {
            params: {
                "tag": tag
            }
        })
            .then(res => res.data),
        get_geo_spatial_data_by_tags: (tags) => axiosInstance.get('/geo_spatial_data/by_tags/', {
            params: {
                "tags": tags
            }
        })
            .then(res => res.data)
    },
    tags_and_dates: {
        get_tags_and_dates: () => axiosInstance.get('/tags_and_dates/')
            .then(res => res.data),
        get_tags: () => axiosInstance.get('/tags_and_date/tags')
            .then(res => res.data),
        get_months: () => axiosInstance.get('/tags_and_dates/months')
            .then(res => res.data),
        get_start_and_end_dates_as_days: () => axiosInstance.get('/tags_and_dates/start_and_end_dates_day')
            .then(res => res.data[0])
    },
    tags_popularity: {
        get_tag_num_tweets: (tag) => axiosInstance.get('/tags_popularity/num_tweets_by_tag', {
            params: {
                "tag": tag
            }
        })
            .then(res => res.data),
        get_num_tweets_by_tags: (tags) => axiosInstance.get('/tags_popularity/num_tweets_by_tags', {
            params: {
                "tags": tags
            }
        })
            .then(res => res.data),
        get_all_tags_popularity_data: () => axiosInstance.get('/tags_popularity/')
            .then(res => res.data)
    },
    most_influential_tweets: {
        get_most_liked_tweets_by_tag: (tag) => axiosInstance.get('/most_influential_tweets/most_liked_tweets_by_tag/', {
            params: {
                "tag": tag
            }
        })
            .then(res => res.data),
        get_most_influential_tweets_by_tags: (tags) => axiosInstance.get('/most_influential_tweets/most_influential_tweets_by_tags', {
            params: {
                "tags": tags
            }
        })
            .then(res => res.data)
    },
    subjectivity_scores: {
        get_scores_by_tag: (tag) => axiosInstance.get('/subjectivity_scores/scaled_subjectivity_scores_data_by_tag/', {
            params: {
                "tag": tag
            }
        })
            .then(res => res.data),
        get_scores_for_all_tags: () => axiosInstance.get('subjectivity_scores/scaled_subjectivity_scores_data_for_all_tags/')
            .then(res => res.data),
        get_scores_by_tags_swarm_plot: (tags) => axiosInstance.get('subjectivity_scores/scaled_subjectivity_scores_data_by_tags_swarm', {
            params: {
                "tags": tags
            }
        })
            .then(res => res.data),
        get_scores_by_tags_ordinal_summary: (tags) => axiosInstance.get('subjectivity_scores/scaled_subjectivity_scores_data_by_tags_ordinal', {
            params: {
                "tags": tags
            }
        })
            .then(res => res.data)
    },
    wordcloud_data: {
        get_overall_wordcloud_by_tag: (tag) => axiosInstance.get('wordcloud/overall_wordcloud_by_tag/', {
            params: {
                "tag": tag
            }
        })
            .then(res => res.data),
        get_wordcloud_data_by_tag_and_month: (tag, month) => axiosInstance.get('wordcloud/wordcloud_by_tag_and_month/', {
            params: {
                "tag": tag,
                "month": month
            }
        })
            .then(res => res.data),

        //when passed an array of tags, returns all wordcloud data (both overall and monthly data) for all tags
        get_selected_tags_data: (tags) => axiosInstance.get('wordcloud/wordcloud_by_tags/', {
            params: {
                "tags": tags
            }
        })
            .then(res => res.data)
    },
    mentions_and_hashtags: {
        get_mentions_data_by_tags: (tags) => axiosInstance.get('mentions_and_hashtags/mentions_data_by_tags/', {
            params: {
                "tags": tags
            }
        })
            .then(res => res.data),
        get_hashtags_data_by_tags: (tags) => axiosInstance.get('mentions_and_hashtags/hashtags_data_by_tags/', {
            params: {
                "tags": tags
            }
        })
            .then(res => res.data),
        get_most_mentioned_accounts_by_tag_and_month: (tag, month) => axiosInstance.get('mentions_and_hashtags/mentions_by_tag_and_month/', {
            params: {
                "tag": tag,
                "month": month
            }
        })
            .then(res => res.data),
        get_most_mentioned_accounts_by_tag: (tag) => axiosInstance.get('mentions_and_hashtags/overall_mentions_by_tag', {
            params: {
                "tag": tag
            }
        })
            .then(res => res.data),
        get_most_used_hashtags_by_tag: (tag) => axiosInstance.get('mentions_and_hashtags/overall_hashtags_by_tag', {
            params: {
                "tag": tag
            }
        })
            .then(res => res.data),
        get_most_popular_hashtags_by_tag_and_month: (tag, month) => axiosInstance.get('mentions_and_hashtags/hashtags_by_tag_and_month/', {
            params: {
                "tag": tag,
                "month": month
            }
        })
            .then(res => res.data)
    } 
}

export default api_calls
