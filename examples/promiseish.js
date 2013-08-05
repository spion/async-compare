var when = require('when'), 
    fn = require('when/function'), 
    p = require('../lib/promiseSupport.js');

module.exports = function upload(stream, idOrPath, tag, done) {
    var blob = blobManager.create(account);
    var tx = db.begin();
    var blobIdP = blob.putP(stream); 
    var fileP = self.byUuidOrPath(idOrPath).getP();
    var version, fileId, file;
    when([blobIdP, fileP]).spread(function(blobId, fileV) {        
        file = fileV;
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
        return Version.insert(version).execWithinP(tx);
    }).then(function() {
        if (!file) {
            var splitPath = idOrPath.split('/');
            var fileName = splitPath[splitPath.length - 1];
            var newId = uuid.v1();
            return self.createQueryP(idOrPath, {
                id: newId,
                userAccountId: userAccount.id,
                type: 'file',
                name: fileName,
                version: version.id
            }).then(function(q) {
                return q.execWithinP(tx);
            }).then(function() {
                return newId;
            });
        } else {
            return file.id;
        }
    }).then(function(fileIdV) {
        fileId = fileIdV;
        return FileVersion.insert({
            fileId: fileId,
            versionId: version.id
        }).execWithinP(tx);
    }).then(function() {
        return File.whereUpdate({id: fileId}, {version: version.id})
            .execWithinP(tx);
    }).then(function() {
        tx.commit();
        return done();
    }, function(err) {
        tx.rollback();
        return done(new Error(err));
    });
}
