const files = [];

const addFile = (id, file, fileName, ext) => {
    files.push({ id, fileName, ext, file });
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