var genny = require('genny');

module.exports = genny.fn(function* upload(resume, stream, idOrPath, tag) {
    var blob = blobManager.create(account);
    var tx = db.begin();
    try {
        var blobId = yield blob.put(stream, resume.t); 
        var file = yield self.byUuidOrPath(idOrPath).get(resume.t); 
        var previousId = file ? file.version : null;
        var version = {
            userAccountId: userAccount.id,
            date: new Date(),
            blobId: blobId,
            creatorId: userAccount.id,
            previousId: previousId,
            mergedId: null,
            mergeType: 'mine',
            comment: '',
            tag: tag
        };
        version.id = Version.createHash(version);
        yield Version.insert(version).execWithin(tx, resume.t);
        if (!file) {
            var splitPath = idOrPath.split('/');
            var fileName = splitPath[splitPath.length - 1];
            var newId = uuid.v1();
            var file = {
                id: newId,
                userAccountId: userAccount.id,
                type: 'file',
                name: fileName,
                version: version.id
            }
            var q = yield self.createQuery(idOrPath, file, resume.t);
            yield q.execWithin(tx, resume.t);
        }
        yield FileVersion.insert({fileId: file.id, versionId: version.id})
            .execWithin(tx, resume.t);
        yield File.whereUpdate({id: file.id}, {version: version.id})
            .execWithin(tx, resume.t); 
        yield tx.commit(resume.t);
    } catch (err) {
        tx.rollback();
        throw new Error(err);
    }
});

