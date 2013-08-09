global.useQ = true;
var q = require('q');

module.exports = function upload(stream, idOrPath, tag, done) {
    q.spawn(function* () {
        try {
            var blob = blobManager.create(account);
            var tx = db.begin();
            var blobId = yield blob.putP(stream);
            var file = yield self.byUuidOrPath(idOrPath).getP();
            var previousId = file ? file.version : null;
            version = {
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
            yield Version.insert(version).execWithinP(tx);
            if (!file) {
                var splitPath = idOrPath.split('/');
                var fileName = splitPath[splitPath.length - 1];
                file = {
                    id: uuid.v1(),
                    userAccountId: userAccount.id,
                    type: 'file',
                    name: fileName,
                    version: version.id
                }
                var query = yield self.createQueryP(idOrPath, file);             
                yield query.execWithinP(tx);
            }
            yield FileVersion.insert({fileId: file.id, versionId: version.id})
                .execWithinP(tx);
            yield File.whereUpdate({id: file.id}, {version: version.id})
                .execWithinP(tx);
            tx.commit();
            return done();
        } catch (err) {
            tx.rollback();
            return done(err);
        }
    });
}
