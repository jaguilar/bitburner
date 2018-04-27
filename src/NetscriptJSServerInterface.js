// A service worker that merely serves up user JS.
//
// The general desire is for user scripts to be able to
// import other user scripts using standard ECMAScript 6
// imports (e.g. import {myFunc} from "./myscript.js";).
// For this to work, we have to actually have something
// serve the user JS. Since there is no bitburner server,
// we use a service worker to serve the JS instead.
//
// Life of a script:
//
// Birth: When a script is copied to a bitburner server,
// two things happen. First, all of its imports are rewritten
// as such:
//
//   // myScript.js
//   import {foo} from "./myOtherScript.js";
//   =>
//   import {foo} from "./bbsrc/serverName/myOtherScript.js";
//
// Second, the new script, and its path are posted as a message
// to the service worker.
//
// The service worker keeps all received scripts in a dictionary.
// When it receives a get request for the script's URI, it simply
// serves up the script contents (with Cache-Control: no-store,
// so that future attempts to load the script will see the new 
// contents). Scripts are dynamically imported each time they 
// are run so that they will be reparsed as the user edits them.
//
// Death: when the user deletes the script from a server, a DELETE
// request is sent for the corresponding resource. The script is
// removed from the dictionary.

export function makeScriptBlob(code) {
    return new Blob([code], {type: "text/javascript"});
}

const allowedImports = [/Netscript\\.js/];

export class ScriptStore {
    constructor() {
        this.servers = {};
    }

    setScript(address, filename, code) {
        filename = filename.toLowerCase();
        const server = this.servers[address] || (this.servers[address] = {});
        server[filename] = {
            code: code,
        };
    }

    getScript(address, filename) {
        filename = filename.toLowerCase();
        const server = this.servers[address] || null;
        const file = server[filename] || null;
        return file.code;
    }

    delScript(address, filename) {
        filename = filename.toLowerCase();
        const server = this.servers[address];
        const file = server && server[filename];
        if (file == null) return;
        delete server[filename];
    }

    // The script as stored here is unusable, because it
    // refers to other modules by their "js" name. E.g.
    // it might refer to a hacking script as "hack.js".
    // This does not work because there is no such script!
    // What we're going to do is iterate over the scripts and
    // recursively replace all these imports with blob urls.
    // Note that this only applies to scripts on the server.
    // We'll also allow users to import from "./netscript.js".
    // Everything else will result in an error.
    async importScript(address, filename) {
        filename = filename.toLowerCase();
        // Get the blob url for this file.
        const stack = this._getScriptUrls(address, filename, []);

        try {
            // The URL at the top is the one we want to import. It will
            // recursively import all the other modules in the stack.
            return import(stack[stack.length - 1]);
        } finally {
            // Revoke the generated URLs, now that we no longer need
            // them. There's no easy system for reusing these,
            // since any of the files in the stack might change
            // before the next time the script runs.
            // In the future, maybe we'll remember the set of 
            // scripts that contributed to the parsing of a given
            // module and only invalidate them if one changes.
            for (const url in stack) URL.revokeObjectURL(url);
        }
    }

    

    // Gets a stack of blob urls, the top-most element being
    // the blob url for the named script on the named server.
    _getScriptUrls(address, filename, alreadySeen) {
        const code = ((this.servers[address] || {})[filename] || {})["code"] || null;
        if (code == null) throw new Error(filename + " does not exist on " + address);

        // From: https://stackoverflow.com/a/43834063/91401 
        var stack = [];
        try {
            const transformedCode = code.replace(/((?:from|import)\s+(?:'|"))([^'"]+)('|";)/g,
                (unmodified, prefix, filename, suffix) => {
                    const isAllowedImport = allowedImports.some(i => {
                        return filename.match(i) != null;
                    });
                    if (isAllowedImport) return unmodified;
                    
                    // Try to get a URL for the requested script. Not case sensitive.
                    const lowerFilename = filename.toLowerCase();
                    alreadySeen.push(lowerFilename);
                    const urls = this._getScriptUrls(address, lowerFilename, alreadySeen);
                    alreadySeen.pop();

                    // The top url in the stack is the replacement address for this
                    // script.
                    stack.push(...urls);
                    return [prefix, urls[urls.length - 1], suffix].join('');
                });
            
            // If we successfully transformed the code, create a blob url for it and
            // push that URL onto the top of the stack.
            stack.push(URL.createObjectURL(makeScriptBlob(transformedCode)));
            return stack;
        } finally {
            for (const url in stack) URL.revokeObjectURL(url);
        }
    }
}