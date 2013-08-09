var async = require("gens")
var parallel = require("gens/parallel")

module.exports = function upload(stream, idOrPath, tag, done) {
    var tx = db.begin()
    uploadTransaction(tx, stream, idOrPath, tag, function (err) {
        if (err) { tx.rollback() }
        done.apply(this, arguments)
    })
}

var uploadTransaction = async(function* upload(tx, stream, idOrPath, tag) {
    var blob = blobManager.create(account)
    var results = yield parallel({
        file: self.byUuidOrPath.bind(self, idOrPath),
        blobId: blob.put.bind(null, stream)
    })
    var previousId = results.file ? results.file.version : null
    var version = {
        userAccountId: userAccountId,
        date: new Date(),
        blobId: results.blobId,
        creatorId: userAccountId.id,
        previousId: previousId
    }
    version.id = Version.createHash(version)
    yield Version.insert.bind(Version, version)
    var fileId = results.file.id
    if (!results.file) {
        var splitPath = idOrPath.split("/")
        var fileName = splitPath[splitPath.length - 1]
        fileId = uuid.v1()
        var query = yield self.createQuery.bind(self, idOrPath, {
            id: fileId,
            userAccountId: userAccount.id,
            name: fileName,
            version: version.id
        })
        yield query.execWithin.bind(query, tx)
    }

    yield parallel({
        version: FileVersion.insert({ fileId: fileId, versionId: version.id })
            .execWithin.bind(null, tx),
        file: File.whereUpdate({ id: fileId }, { version: version.id })
            .execWithin.bind(null, tx)
    })
    yield tx.commit()
})
