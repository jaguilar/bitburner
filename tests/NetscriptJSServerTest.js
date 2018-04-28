import {ScriptStore} from "../src/NetscriptJSServerInterface.js";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

console.info('asdf');

describe('NSJS ScriptStore', function() {
    it('should run an imported function', async function() {
        const s = new ScriptStore();        
        s.setScript("foo", "s1.js", "export function run() { return 2; }");
        chai.expect(await s.executeScript("foo", "s1.js")).to.equal(2);
    });

    it('should handle recursive imports', async function() {
        const s = new ScriptStore();
        s.setScript("foo", "s1.js", "export function iAmRecursiveImport(x) { return x + 2; }");
        s.setScript("foo", "s2.js", `
            import {iAmRecursiveImport} from \"s1.js\"; 
            export function run() { return iAmRecursiveImport(3); 
        }`);
        chai.expect(await s.executeScript("foo", "s2.js")).to.equal(5);
    });

    it(`should throw an error if the primary script isn't present`, async function() {
        const s = new ScriptStore();
        var o = {didRun: false};
        s.setScript("foo", "s1.js", "export function run() { o.didRun = true; }");
        s.delScript("foo", "s1.js");
        s.executeScript("foo", "s1.js").should.eventually.throw();
    });

    it(`should throw an error if a script to be imported is later deleted`, async function() {
        const s = new ScriptStore();
        var o = {didRun: false};
        s.setScript("foo", "s1.js", "export function importedFn() { return 3; }");
        s.setScript("foo", "s2.js", "import {importedFn} from \"s1.js\"; export function run() { return importedFn(); }");
        s.delScript("foo", "s1.js");
        s.executeScript("foo", "s2.js").should.eventually.throw();
    });

    it(`should not allow cross server imports`, async function() {
        const s = new ScriptStore();
        s.setScript("bar", "s1.js", "export function importedFn() { return 3; }");
        s.setScript("foo", "s2.js", "import {importedFn} from \"s1.js\"; export function run() { return importedFn(); }");
        s.executeScript("foo", "s2.js").should.eventually.throw();
    });

    it(`should detect updated imports and change behavior accordingly`, async function() {
        const s = new ScriptStore();
        s.setScript("foo", "s1.js", "export function effect(a) { a[0] = -1; }  // Start off negative.");
        s.setScript("foo", "s2.js", `
            import {effect} from \"s1.js\"; 
            export function run() { const a = [0]; importedFn(a); return a[0]; }
        `);
        s.executeScript("foo", "s2.js").should.eventually.equal(-1);
        s.setScript("foo", "s1.js", "export function effect(a) { a[0] = 1; }  // Change to positive.");
        s.executeScript("foo", "s2.js").should.eventually.equal(1);
    });

    it (`should correctly reference the passed global env`, async function() {
        const s = new ScriptStore();                
        var [x, y] = [0, 0];
        var env = {
            updateX: function(value) { x = value; },
            updateY: function(value) { y = value; },
        };
        s.setScript("foo", "s1.js", "export function importedFn(x) { updateX(x); }");
        s.setScript("foo", "s2.js", `
            import {importedFn} from "s1.js";
            export function run() { updateY(7); importedFn(3); }
        `);
        await s.executeScript("foo", "s2.js", env);
        chai.expect(y).to.equal(7);
        chai.expect(x).to.equal(3);
    });

    it (`should adopt a new global env with each import`, async function() {
        const s = new ScriptStore();                
        var [x, y] = [0, 0];
        var env = {
            updateX: function(value) { x = value; },
            updateY: function(value) { y = value; },
        };
        s.setScript("foo", "s1.js", "export function importedFn(x) { updateX(x); }");
        s.setScript("foo", "s2.js", `
            import {importedFn} from "s1.js";
            export function run() { updateY(7); importedFn(3); }
        `);
        await s.executeScript("foo", "s2.js", env);
        const doNothing = function() {};
        // The second time we execute, it doesn't have the same effect, since we changed the environment.
        [x, y] = [0, 0];
        await s.executeScript("foo", "s2.js", {updateX: doNothing, updateY: doNothing});
        chai.expect(x).to.equal(0);
        chai.expect(x).to.equal(0);
    });
});
