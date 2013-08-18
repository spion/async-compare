var Rx = require('rx');

module.exports = function upload(stream, idOrPath, tag, done) {
    
    var blob = blobManager.create(account);
    var tx = db.begin();
    
    blobPutAsObs(blob, stream)
        .selectMany(selectFile(this, idOrPath))
        .selectMany(insertVersion(this, tx, idOrPath, tag))
        .selectMany(insertFile(tx))
        .selectMany(updateFileVersion(tx))
        .selectMany(commit)
        .subscribe(function(commitResultArgs) {
            done.apply(null, commitResultArgs);
        });
}

function blobPutAsObs(blob, stream) {
    
    return Rx.Observable.create(function(observer) {
        
        blob.put(stream, function(err, iBlobId) {
            
            if(err) return observer.onError(err);
            
            observer.onNext(iBlobId);
            observer.onCompleted();
        });
    });
}

function selectFile(self, idOrPath) {
    
    return function(blobId) {
        
        return Rx.Observable.create(function(observer) {
            
            self.byUuidOrPath(idOrPath).get(function(err, iFile) {
                
                if(err) return observer.onError(err);
                
                observer.onNext([blobId, iFile]);
                observer.onCompleted();
            });
        });
    }
}

function insertVersion(self, tx, idOrPath, tag) {
    
    return function(blobIdAndFile) {
        
        var blobId = blobIdAndFile[0];
        var iFile  = blobIdAndFile[1];
        
        var previousId = iFile ? iFile.version : null,
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
        
        var slashIndex = idOrPath.lastIndexOf('/');
        var fileName = idOrPath.substring(slashIndex);
        var newId = uuid.v1();
        
        var createFile = createFileAsObs(self, fileName, newId);
        var doQuery = executeQuery(tx, newId);
        
        var createFileObs = createFile.selectMany(doQuery);
        var fileExistsObs = Rx.Observable.returnValue(newId);
        
        return Rx.Observable.ifThen(
            function() { return !file; },
            createFileObs,
            fileExistsObs
        )
        .select(function() {
            return [newId, version.id];
        });
    }
}

function createFileAsObs(self, fileName, newId) {
        
    return Rx.Observable.create(function(observer) {
        
        var query = {
            id: newId,
            userAccountId: userAccount.id,
            type: 'file',
            name: fileName,
            version: version.id
        };
        
        self.createQuery(idOrPath, query, function (err, q) {
            
            if(err) return observer.onError(err);
            
            observer.onNext(q);
            observer.onCompleted();
        })
    });
}

function executeQuery(tx, newId) {
    
    return function(q) {
        
        return Rx.Observable.create(function(observer) {
            q.execWithin(tx, function(err) {
                
                if(err) return observer.onError(err);
                
                observer.onNext(newId);
                observer.onCompleted();
            });
        });
    }
}

function insertFile(tx) {
    
    return function(fileIdAndVersion) {
        
        var fileId    = fileIdAndVersion[0];
        var versionId = fileIdAndVersion[1];
        
        return Rx.Observable.create(function(observer) {
            
            var insert = {
                fileId: fileId,
                versionId: versionId
            };
            
            FileVersion
                .insert(insert)
                .execWithin(tx, function(err) {
                    
                    if(err) return observer.onError(err);
                    
                    observer.onNext(fileIdAndVersion);
                    observer.onCompleted();
                });
        });
    }
}

function updateFileVersion(tx) {
    
    return function(fileIdAndVersion) {
        
        var fileId    = fileIdAndVersion[0];
        var versionId = fileIdAndVersion[1];
        
        return Rx.Observable.create(function(observer) {
            
            var file = {id: fileId},
                version = { version: versionId };
            
            File
                .whereUpdate(file, version)
                .execWithin(tx, function(err) {
                    
                    if(err) return observer.onError(err);
                    
                    observer.onNext(tx);
                    observer.onCompleted();
                });
        });
    }
}

function commit(tx) {
    
    return Rx.Observable.create(function(observer) {
        
        tx.commit(function() {
            
            observer.onNext(arguments);
            observer.onCompleted();
        });
    });
}