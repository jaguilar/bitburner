import {ScriptStore} from "../NetscriptJSServerInterface.js";

async function runTest() {
    const s = new ScriptStore();

    // We can write a script that can be run.
    var o = {didRun: false};
    s.setScript("foo", "s1.js", "export function run(o) { o.didRun = true; }");
    
    const module = await s.importScript("foo", "s1.js");
    module.run(o);

    if (!o.didRun) throw new Error("it should have run");

    o.didRun = false;
    
    // We can write another script to import the first one.
    s.setScript("foo", "s2.js", 'import {run} from "s1.js"; export function run2(o) { run(o); }');

    const module2 = await s.importScript("foo", "s2.js");
    module2.run2(o);

    if (!o.didRun) throw new Error("should have been able to import original script");
    o.didRun = false;

    // If we delete the script, reimporting module 2 will not work.
    s.delScript("foo", "s1.js");
    try {
        const module2_2 = await s.importScript("foo", "s2.js");
    } catch (error) {
        console.info("got expected err:", error);
    }

    // Calling run on the original module should still work. (Shouldn't matter for us, but just verifying assumptions.)
    module.run(o);
    if (!o.didRun) throw new Error("after deleting script, original module fails!");
    o.didRun = false;
}

document.getElementById("starttest").addEventListener('click', e => {
    runTest().then(() => { 
        console.log("success!"); 
    });
});