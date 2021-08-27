const axios = require('axios');
const fs = require('fs');

const youtubeSeach = async (query) => {
    try {
        return new Promise((resolve, reject) => {
            const url = `https://m.youtube.com/results?search_query=${encodeURIComponent(query.substr(11))}`;
            axios.post(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
                    'Accept-Language': 'en-US',
                    'Referrer-Policy': 'origin'
                }
            }).then((response) => {
                const {data} = response;
                
                const {1: raw} = data.split('var ytInitialData = ');
                const {0: raw2} = raw.split(';');
               
                const pos1 = raw2.search('"videoId"');
               
                const pos2 = raw2.indexOf('"', pos1 + 11);

                const newId = raw2.substr(pos1 + 11, pos2 - (pos1 + 11));
                
                //const {videoId} = JSON.parse(raw2).contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].videoRenderer;
                
                resolve(newId);
            });
        });
    } catch (e) {
        return e;
    }
    
};

module.exports = youtubeSeach;