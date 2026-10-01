import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync('dist/app.js', 'utf8');
const listeners = {};
let timer;
class Element {
  constructor(control = false) { this.control = control; this.classes = new Set(); this.classList = { add: x => this.classes.add(x), remove: x => this.classes.delete(x) }; }
  closest(selector) { return selector.includes('aria-hidden') ? null : selector.startsWith('a,') ? (this.control ? this : null) : this; }
  matches() { return false; }
}
const events = { addEventListener: (name, fn) => { listeners[name] = fn; } };
runInNewContext(source.slice(source.indexOf('const controlSelector ='), source.indexOf('measure();', source.indexOf('const controlSelector ='))), {
  document: { ...events, querySelectorAll: () => [] }, window: events, Element,
  setTimeout: fn => { timer = fn; return 1; }, clearTimeout: () => { timer = null; }
});
const copy = new Element();
const button = new Element(true);
const pointer = { target: copy, pointerType: 'touch', isPrimary: true, button: 0, pointerId: 1, clientX: 0, clientY: 0 };
listeners.pointerdown(pointer);
assert(copy.classes.has('feedback-pressed'), 'Touch highlights copy');
listeners.pointermove({ ...pointer, clientY: 15 });
assert(!copy.classes.has('feedback-pressed'), 'Dragging cancels the highlight');
listeners.pointerdown({ ...pointer, target: button });
listeners.pointerup(pointer);
timer();
assert(!button.classes.has('feedback-pressed'), 'Tap feedback clears after release');
listeners.pointerdown(pointer);
listeners.pointercancel();
assert(!copy.classes.has('feedback-pressed'), 'Cancelled touch clears feedback');
listeners.pointerover({ ...pointer, pointerType: 'mouse' });
assert(copy.classes.has('feedback-hover'), 'Mouse highlights copy');
listeners.scroll();
assert(!copy.classes.has('feedback-hover'), 'Scrolling clears stale hover');
console.log('PASS: touch, drag cancellation, release, pointer cancellation, hover, and scroll cleanup.');
