const axios = require('axios');

const youtubeSeach = async (query) => {
    try {
        return new Promise((resolve, reject) => {
            const url = `https://m.youtube.com/results?search_query=${encodeURIComponent(query.substr(11))}`;
            axios.post(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
                    'Accept-Language': 'en-US'
                }
            }).then((response) => {
                const {data} = response;
        
                const {1: raw} = data.split('var ytInitialData = ');
                const {0: raw2} = raw.split(';');
            
                const {videoId} = JSON.parse(raw2).contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].videoRenderer;
            
                resolve(videoId);
            });
        });
    } catch (e) {
        return e;
    }
    
};

module.exports = youtubeSeach;