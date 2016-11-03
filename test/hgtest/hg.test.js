const repoVersion = require('../../index.js');
const assert = require('assert');
const fs = require('fs')

describe("Mercurial repo", () => {
    let location = process.cwd();
    before(done => {
	// rename _hg to .hg directory
	// and change CWD
	fs.rename(`${__dirname}/_hg`, `${__dirname}/.hg`, (err, result) => {
	    process.chdir(__dirname);
	    done();
	});
    });

    after(done => {
	// rename _hg to .hg directory
	// and change CWD
	fs.rename(`${__dirname}/.hg`, `${__dirname}/_hg`, (err, result) => {
	    process.chdir(location);
	    done();
	});
    });
    
    it("should retrieve revision hash", done => {
	repoVersion.currentRevision( e => {} )
	    .stopOnError(done)
	    .apply(data => {
		assert.equal(data, "84c32bd8f442c0991bb965ca6a2ba08d27a998d4");
		done();
	    });
    });
});
