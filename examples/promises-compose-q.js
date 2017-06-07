var q = require('q'), 
    fn = require('when/function');
   
require('../lib/fakesP')(q.denodeify);

// Assume Version = objectLift(version), File = objectLift(file) etc.
var the_upload = function upload(stream, idOrPath, tag, done) {
    var blob = blobManager.create(account);
    var tx = db.begin();
    var blobIdP = blob.put(stream); 
    var fileP = self.byUuidOrPath(idOrPath).get();
    var previousIdP = fileP.then(function(file) {
        return file ? file.version : null;
    });
    var versionP = q.spread([blobIdP, previousIdP],
        function(blobId, previousId) {
            return {
                userAccountId: userAccount.id,
                date: new Date(),
                blobId: blobId,
                creatorId: userAccount.id,
                previousId: previousId
            };
        });
    versionP = versionP.then(function(version) {
        version.id = Version.createHash(version);
        return version;
    });
    var insertVersion = versionP.then(function(version) {
        return Version.insert(version).execWithin(tx);
    });
    
    var fileIdP = q.spread([fileP, versionP], function(file, version) {
        if (!file) {
            var splitPath = idOrPath.split('/');
            var fileName = splitPath[splitPath.length - 1];
            var newId = uuid.v1();
            return self.createQuery(idOrPath, {
                id: newId,
                userAccountId: userAccount.id,
                name: fileName,
                version: version.id
            }).then(function(q) { 
                return q.execWithin(tx);
            }).then(function() {
                return newId;
            });
        } else {
            return file.id;
        }
    });

    var updateFile = q.spread([fileIdP, versionP],
        function(fileId, version) {
            var ins = FileVersion.insert({
                fileId: fileId,
                versionId: version.id
            }).execWithin(tx); 
            var up = File.whereUpdate({id: fileId}, {version: version.id})
                .execWithin(tx);
            return q.all([ins, up]);
        });
    q.spread([insertVersion, updateFile], function() {
        tx.commit();
        return done();
    }, function(err) {
        tx.rollback();
        return done(err);
    });
}

module.exports=the_upload;

 