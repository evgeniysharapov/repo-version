const repoVersion = require('../../index.js');
const assert = require('assert');
const fs = require('fs');

describe("Git repo", () => {
    let location = process.cwd();
    before(done => {
	// rename _hg to .hg directory
	// and change CWD
	fs.rename(`${__dirname}/_git`, `${__dirname}/.git`, (err, result) => {
	    process.chdir(__dirname);
	    done();
	});
    });

    after(done => {
	// rename _hg to .hg directory
	// and change CWD
	fs.rename(`${__dirname}/.git`, `${__dirname}/_git`, (err, result) => {
	    process.chdir(location);
	    done();
	});
    });
    
    it("should retrieve revision hash", done => {
	repoVersion.currentRevision( e => {} )
	    .stopOnError(done)
	    .apply(data => {
		assert.equal(data, "a2c76c6c77f8f0031178121bf0a508d53370aac6\n");
		done();
	    });
    });
});
