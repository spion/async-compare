/**
 * Created by yyrdl on 2017/6/7.
 */
require('../lib/fakes');
var co=require("zco");
/**
 * turn off stack trace
 * */
co.__TrackCallStack(false);

var the_upload= function upload(stream, idOrPath, tag, done) {
    co(function *(co_next) {
        var blob = blobManager.create(account);
        var tx = db.begin();
        var blobId, file;
        yield blob.put(stream, co_next);
        yield self.byUuidOrPath(idOrPath).get(co_next);
        var version = {
            userAccountId: userAccount.id,
            date: new Date(),
            blobId: blobId,
            creatorId: userAccount.id,
            previousId: file ? file.version : null
        };
        version.id = Version.createHash(version);
        yield Version.insert(version).execWithin(tx, co_next);
        if(!file){
            var splitPath = idOrPath.split('/');
            var fileName = splitPath[splitPath.length - 1];
            file={
                id: uuid.v1(),
                userAccountId: userAccount.id,
                name: fileName,
                version: version.id
            }
            var res1=yield  self.createQuery(idOrPath, file, co_next);
            if(res1[0]){
                backoff(res1[0]);
            }else{
               yield res1[1].execWithin(tx,co_next);
            }
        }
        yield  FileVersion.insert({fileId: file.id, versionId: version.id}).execWithin(tx, co_next);
        yield File.whereUpdate({id: file.id}, { version: version.id }).execWithin(tx, co_next);
        yield tx.commit(co_next);
    })(function (err) {
        if(err){
            tx.rollback();;
        }
        done(err);
    });
}

module.exports=the_upload;