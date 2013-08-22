module.exports = function upload(stream, idOrPath, tag, done) {
    FileVersion.insert(null).execWithin(null, done);
};
