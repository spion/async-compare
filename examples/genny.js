var genny = require('genny');

module.exports = genny.fn(function* upload(resume, stream, idOrPath, tag) {
    var blob = blobManager.create(account);
    var tx = db.begin();
    try {
        var blobId = yield blob.put(stream, resume()); 
        var file = yield self.byUuidOrPath(idOrPath).get(resume()); 
        var previousId = file ? file.version : null;
        var version = {
            userAccountId: userAccount.id,
            date: new Date(),
            blobId: blobId,
            creatorId: userAccount.id,
            previousId: previousId,
        };
        version.id = Version.createHash(version);
        yield Version.insert(version).execWithin(tx, resume());
        if (!file) {
            var splitPath = idOrPath.split('/');
            var fileName = splitPath[splitPath.length - 1];
            var newId = uuid.v1();
            var file = {
                id: newId,
                userAccountId: userAccount.id,
                name: fileName,
                version: version.id
            }
            var q = yield self.createQuery(idOrPath, file, resume());
            yield q.execWithin(tx, resume());
        }
        yield FileVersion.insert({fileId: file.id, versionId: version.id})
            .execWithin(tx, resume());
        yield File.whereUpdate({id: file.id}, {version: version.id})
            .execWithin(tx, resume()); 
        yield tx.commit(resume());
    } catch (e) {
        tx.rollback();
        throw e; //new Error(e);
    }
});

