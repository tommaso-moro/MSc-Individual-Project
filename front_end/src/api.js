import axios from 'axios';

var API_URL = '' 
if (process.env.NODE_ENV == 'development') {
    API_URL = 'http://localhost:5000/'
} else {
    API_URL = process.env.PROD_API_URL
}
console.log(API_URL)
const axiosInstance = axios.create({ baseURL: API_URL });

const api_calls = {
    daily_batch: {
        get_daily_calendar_data_by_tag: (tag) => axiosInstance.get("/daily_batches/daily_calendar_data_by_tag/", {
            params: {
                "tag": tag
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
        .then(res => res.data)
    },
    tags_and_dates: {
        get_tags_and_dates: () => axiosInstance.get('/tags_and_dates/')
            .then(res => res.data),
        get_tags: () => axiosInstance.get('/tags_and_date/tags')
            .then(res => res.data),
        get_months: () => axiosInstance.get('/tags_and_dates/months')
            .then(res => res.data)
    },
    most_influential_tweets: {
        get_most_liked_tweets_by_tag: (tag) => axiosInstance.get('/most_influential_tweets/most_liked_tweets_by_tag/', {
            params: {
                "tag": tag
            }
        })
            .then(res => res.data)
    }
}

export default api_calls
