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

import {registerEnv, unregisterEnv, makeEnvHeader} from "./NSJSEnvLoader.js";

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

    // Translate the script, loading all the dependencies and getting it
    // ready to execute. Once it's loaded, call run() on the script.
    // Then clean up. Returns the return value of run.
    async executeScript(address, filename, env) {
        env = env || {};
        const envUuid = registerEnv(env);
        const envHeader = makeEnvHeader(envUuid);

        filename = filename.toLowerCase();
        // Get the blob url for this file.
        const stack = this._getScriptUrls(address, filename, envHeader, []);

        // The URL at the top is the one we want to import. It will
        // recursively import all the other modules in the stack.
        //
        // Webpack likes to turn the import into a require, which sort of
        // but not really behaves like import. Particularly, it cannot
        // load fully dynamic content. So we hide the import from webpack
        // by placing it inside an eval call.
        try {
            const loadedModule = await eval('import(stack[stack.length - 1])');
            return await loadedModule.run();    
        } finally {
            // Revoke the generated URLs and unregister the environment.
            for (const url in stack) URL.revokeObjectURL(url);
            unregisterEnv(envUuid);
        };
    }

    // Gets a stack of blob urls, the top-most element being
    // the blob url for the named script on the named server.
    _getScriptUrls(address, filename, envHeader, alreadySeen) {
        const code = ((this.servers[address] || {})[filename] || {})["code"] || null;
        if (code == null) throw new Error(filename + " does not exist on " + address);

        // From: https://stackoverflow.com/a/43834063/91401 
        const urlStack = [];
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
                    const urls = this._getScriptUrls(address, lowerFilename, envHeader, alreadySeen);
                    alreadySeen.pop();

                    // The top url in the stack is the replacement address for this
                    // script.
                    urlStack.push(...urls);
                    return [prefix, urls[urls.length - 1], suffix].join('');
                });
            
            // Inject the NSJS environment at the top of the code.
            const transformedCodeWithHeader = envHeader + transformedCode;
            console.info(transformedCodeWithHeader);

            // If we successfully transformed the code, create a blob url for it and
            // push that URL onto the top of the stack.
            urlStack.push(URL.createObjectURL(makeScriptBlob(transformedCodeWithHeader)));
            return urlStack;
        } catch (err) {
            // If there is an error, we need to clean up the URLs.
            for (const url in urlStack) URL.revokeObjectURL(url);
            throw err;
        }
    }
}