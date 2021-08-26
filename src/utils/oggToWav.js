const CloudmersiveVideoApiClient = require('cloudmersive-video-api-client');

const defaultClient = CloudmersiveVideoApiClient.ApiClient.instance;
const {Apikey} = defaultClient.authentications;
Apikey.apiKey = process.env.CLOUDMERSIVE_API_KEY;

const apiInstance = new CloudmersiveVideoApiClient.AudioApi();

const convertFile = async (buffer) => {

    const opts = {
        inputFile: buffer,
        sampleRate: 8.14
    };

    return new Promise((resolve, reject) => {
        apiInstance.audioConvertToWav(opts, (error, data, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = convertFile;