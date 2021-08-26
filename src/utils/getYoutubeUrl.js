const search = require('youtube-search');

const opts = {
    maxResults: 1,
    key: process.env.YOUTUBE_API_KEY
};

const getYoutubeUrl = async (term) => {
    try {
        return new Promise((resolve, reject) => {
            search(term.substr(11), opts, function(err, results) {
                if (err) {
                    return console.log(err); 
                }
        
                resolve(results);
            });
        });
    } catch (e) {
        return e.message;
    }
    
};

module.exports = getYoutubeUrl;