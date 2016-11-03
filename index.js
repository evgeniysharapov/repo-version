const _ = require ('highland');
const fs = require('fs');

/**
 * reading files into a stream
 */
const readFile = _.wrapCallback(fs.readFile);
/**
 * convert Buffer to String
 *
 * @param data buffer to be converted
 */
let toString = data => data.toString();

/**
 * Information about running application.
 * idea is simple:
 * if we have .hg or .git directory then most likely we are running on a dev's machine - retrieve information
 * from those directories. If not, then we will try to get information from version.txt
 *
 * version.txt is produced during build/deployment cycle and should not be added to the repository.
 *
 * @param _errorLogger {Function} logger where we report errors, optional, if undefined then uses console.log
 * @return {Stream}
 */
const currentRevision = (_errorLogger) => {
    const ROOT_DIR = process.cwd();
    let errorLogger = _errorLogger || console.log;
    // getting information about revision/version
    return _([
	// git is more complicated than necessary, first we read file HEAD and then
	// split line like this
	//     ref: refs/heads/master
	// where second part is the path of the file with a revision number (commit hash)
	readFile(`${ROOT_DIR}/.git/HEAD`)
	    .stopOnError(e => errorLogger(e))
	    .map(toString)
	    .map(data => /:(.+)/.exec(data)[1].trim()) // get the ref path
	    .flatMap(path => readFile(`${ROOT_DIR}/.git/${path}`)) // read file with commit hash
	    .map(toString)
	,
	// Work with Mercurial repo
	// assumption is we are on a bookmark
	readFile(`${ROOT_DIR}/.hg/bookmarks.current`)
	    .stopOnError(e => errorLogger(e))
	    .map(toString) // current bookmark name
	    .flatMap(branch => readFile(`${ROOT_DIR}/.hg/bookmarks`) // find it in the file of bookmarks
		     .split()
		     .find(line => line.match(new RegExp(branch + "$"))) // grep that line with bookmark name
		     .map(line => line.split(" ")[0])) // return changeset hash
    ]).merge();
};

exports.currentRevision = currentRevision;

