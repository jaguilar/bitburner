// Getting the environment into a real javascript module
// is a bit tricky. It's going to work like this.
//
// - Before importing the user's NSJS script, we're going
//   to create an environment for that script. The environment
//   is the set of properties we want to appear in the global
//   object from the perspective of the user script.
//   This includes methods like grow, hack, etc.
// - Before running the script, we will store the environment in
//   a map, uniquely keyed by a uuid. After the script ends,
//   the env will be dropped from this map.
// - For each module to be imported, code is added that fetches
//   this environment from the map we have here, and installs
//   it in the global scope.

import uuidv4 from "uuid/v4";
import {sprintf} from "sprintf-js";

window.__NSJS__environments = {};

// Returns the UUID for the env.
export function registerEnv(env) {
    const uuid = uuidv4();
    window.__NSJS__environments[uuid] = env;
    return uuid;
}
export function unregisterEnv(uuid) {
    delete window.__NSJS__environments[uuid];
}

export function makeEnvHeader(uuid) {
    if (!(uuid in window.__NSJS__environments)) throw new Error("uuid is not in the environment" + uuid);

    const env = window.__NSJS__environments[uuid];
    var envLines = [];
    for (const prop in env) {
        envLines.push("const ", prop, " = ", "__NSJS_ENV[\"", prop, "\"];\n");
    }

    return sprintf(`
        'use strict';
        const __NSJS_ENV = window.__NSJS__environments['%s'];
        // The global variable assignments (hack, weaken, etc.).
        %s
    `, uuid, envLines.join(""));
}