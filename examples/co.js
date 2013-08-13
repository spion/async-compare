var co = require("co")

module.exports = function upload(stream, idOrPath, tag, done) {
    var tx = db.begin();
    co(function* upload() {
        var blob = blobManager.create(account)
        var file = yield self.byUuidOrPath(idOrPath).get;
        var blobId = yield blob.putC(stream);
        var previousId = file ? file.version : null
        var version = {
            userAccountId: userAccount.id,
            date: new Date(),
            blobId: blobId,
            creatorId: userAccount.id,
            previousId: previousId
        }
        version.id = Version.createHash(version)
        yield Version.insert(version).execWithinC(tx);
        if (!file) {
            var splitPath = idOrPath.split("/")
            var fileName = splitPath[splitPath.length - 1]
            file = {
                id: uuid.v1(),
                userAccountId: userAccount.id,
                name: fileName,
                version: version.id
            };
            var query = yield self.createQueryC(idOrPath, file);
            yield query.execWithinC(tx)
        } 
        yield FileVersion.insert({ fileId: file.id, versionId: version.id })
            .execWithinC(tx);
        yield File.whereUpdate({ id: file.id }, { version: version.id })
            .execWithinC(tx);
        yield tx.commit;
    })(function(err) {
        if (err) tx.rollback()
        done(err);
    });
}
