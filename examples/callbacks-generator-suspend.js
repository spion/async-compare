var suspend= require('suspend');
require('../lib/fakes');

var the_upload = suspend(function* upload(stream, idOrPath, tag, done) {
    var resume=suspend.resume;
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
        return done();
    } catch (e) {
        tx.rollback();
        return done(e);
    }
});

module.exports=the_upload;


