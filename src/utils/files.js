const files = [];

const addFile = (id, file, mimeType, fileName, ext) => {
    files.push({ id, fileName, ext, file, mimeType });
};

const getUserFiles = (id) => {
    const userFiles = files.find((file) => file.id === id);

    return userFiles;
};

const getFiles = () => files;

module.exports = {
    addFile,
    getUserFiles,
    getFiles
};