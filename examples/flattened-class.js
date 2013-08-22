module.exports = function upload(stream, idOrPath, tag, done) {
    new Uploader(stream, idOrPath, tag, done).run();
}

function Uploader(stream, idOrPath, tag, done) {
    this.stream = stream;
    this.idOrPath = idOrPath;
    this.tag = tag;
    this.done = done;
}

Uploader.prototype.backoff = function(err) {
    this.tx.rollback();
    return done(err);
}


Uploader.prototype.run = function () {
    var blob = blobManager.create(account);
    this.tx = db.begin();
    blob.put(this.stream, this.afterBlobWritten.bind(this));
}

Uploader.prototype.afterBlobWritten = function (err, blobId) { 
    if (err) return this.done(err);
    this.blobId = blobId;
    self.byUuidOrPath(this.idOrPath)
        .get(this.afterFileFetched.bind(this));
}

Uploader.prototype.afterFileFetched = function(err, file) {
    if (err) return this.done(err);
    this.file = file;

    var previousId = file ? file.version : null;
    var version = this.version = {
        userAccountId: userAccount.id,
        date: new Date(),
        blobId: this.blobId,
        creatorId: userAccount.id,
        previousId: previousId,
        mergedId: null,
        mergeType: 'mine',
        comment: '',
        tag: this.tag
    };
    version.id = Version.createHash(version);
    Version.insert(version).execWithin(
        this.tx, this.afterVersionInserted.bind(this));
}

Uploader.prototype.afterVersionInserted = function(err) { 
    if (err) return this.backoff(err);
    if (!this.file) {
        var splitPath = this.idOrPath.split('/');
        var fileName = splitPath[splitPath.length - 1];
        var file = this.file = {
            id: uuid.v1(),
            userAccountId: userAccount.id,
            type: 'file',
            name: fileName,
            version: this.version.id
        };
        self.createQuery(this.idOrPath, file, 
            this.afterQueryCreated.bind(this));
    }
    else return afterFileExists();
}

Uploader.prototype.afterQueryCreated = function(err, q) {
    if (err) return this.backoff(err);
    q.execWithin(this.tx, this.afterFileExists.bind(this));
}

Uploader.prototype.afterFileExists = function(err) {

    if (err) return this.backoff(err);

    FileVersion.insert({fileId: this.file.id, versionId: this.version.id})
        .execWithin(this.tx, this.afterFileVersionInserted.bind(this));
}

Uploader.prototype.afterFileVersionInserted = function(err) {
    if (err) return this.backoff(err);
    File.whereUpdate({id: this.file.id}, { version: this.version.id })
        .execWithin(this.tx, this.afterFileUpdated.bind(this));
}

Uploader.prototype.afterFileUpdated = function(err) {
    if (err) return this.backoff(err);
    this.tx.commit(this.done);
}


