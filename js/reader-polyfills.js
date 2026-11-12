/*
 * reader-polyfills.js  (written in plain ES5 so even very old browsers can run it)
 * Adds the few built-in functions that the book reader and the PDF engine use but that
 * browsers older than ~2022 do not have yet. Every polyfill is only installed when missing.
 */
(function (root) {
  'use strict';

  function def(obj, name, fn) {
    if (!obj || obj[name]) return;
    try { Object.defineProperty(obj, name, { value: fn, writable: true, configurable: true }); }
    catch (e) { try { obj[name] = fn; } catch (e2) {} }
  }

  /* ---- globalThis ---- */
  if (typeof root.globalThis === 'undefined') {
    try { Object.defineProperty(root, 'globalThis', { value: root, writable: true, configurable: true }); }
    catch (e) { root.globalThis = root; }
  }

  /* ---- Promise ---- */
  if (typeof root.Promise === 'function') {
    def(root.Promise, 'withResolvers', function () {
      var res, rej, p = new this(function (a, b) { res = a; rej = b; });
      return { promise: p, resolve: res, reject: rej };
    });
    def(root.Promise, 'allSettled', function (list) {
      var C = this;
      return C.all(Array.prototype.map.call(list, function (p) {
        return C.resolve(p).then(
          function (v) { return { status: 'fulfilled', value: v }; },
          function (r) { return { status: 'rejected', reason: r }; });
      }));
    });
    def(root.Promise, 'try', function (fn) {
      var C = this;
      return new C(function (resolve) { resolve(fn()); });
    });
    def(root.Promise.prototype, 'finally', function (cb) {
      var C = this.constructor || root.Promise;
      return this.then(
        function (v) { return C.resolve(cb()).then(function () { return v; }); },
        function (e) { return C.resolve(cb()).then(function () { throw e; }); });
    });
  }

  /* ---- Object ---- */
  def(Object, 'hasOwn', function (o, k) { return Object.prototype.hasOwnProperty.call(Object(o), k); });
  def(Object, 'fromEntries', function (it) {
    var o = {};
    Array.prototype.forEach.call(Array.from ? Array.from(it) : it, function (e) { o[e[0]] = e[1]; });
    return o;
  });
  def(Object, 'entries', function (o) { return Object.keys(o).map(function (k) { return [k, o[k]]; }); });
  def(Object, 'values', function (o) { return Object.keys(o).map(function (k) { return o[k]; }); });

  /* ---- Array / typed arrays ---- */
  function at(n) { n = Math.trunc ? Math.trunc(n) || 0 : (n < 0 ? Math.ceil(n) : Math.floor(n)) || 0; if (n < 0) n += this.length; return (n < 0 || n >= this.length) ? undefined : this[n]; }
  function findLast(fn, t) { for (var i = this.length - 1; i >= 0; i--) if (fn.call(t, this[i], i, this)) return this[i]; return undefined; }
  function findLastIndex(fn, t) { for (var i = this.length - 1; i >= 0; i--) if (fn.call(t, this[i], i, this)) return i; return -1; }
  function flat(depth) {
    depth = depth === undefined ? 1 : Number(depth);
    var out = [];
    (function walk(a, d) {
      for (var i = 0; i < a.length; i++) {
        if (Array.isArray(a[i]) && d > 0) walk(a[i], d - 1); else if (i in a) out.push(a[i]);
      }
    })(this, depth);
    return out;
  }
  function flatMap(fn, t) { return Array.prototype.map.call(this, fn, t).flat(1); }
  function includes(v, from) { return Array.prototype.indexOf.call(this, v, from) !== -1 || (v !== v && Array.prototype.some.call(this, function (x) { return x !== x; })); }

  def(Array.prototype, 'at', at);
  def(Array.prototype, 'findLast', findLast);
  def(Array.prototype, 'findLastIndex', findLastIndex);
  def(Array.prototype, 'flat', flat);
  def(Array.prototype, 'flatMap', flatMap);
  def(Array.prototype, 'includes', includes);
  def(Array, 'from', function (it, mapFn, t) {
    var out = [], i, n;
    if (it == null) throw new TypeError('Array.from requires an array-like object');
    if (typeof Symbol === 'function' && Symbol.iterator && typeof it[Symbol.iterator] === 'function') {
      var iter = it[Symbol.iterator](), step;
      while (!(step = iter.next()).done) out.push(mapFn ? mapFn.call(t, step.value, out.length) : step.value);
      return out;
    }
    n = it.length >>> 0;
    for (i = 0; i < n; i++) out.push(mapFn ? mapFn.call(t, it[i], i) : it[i]);
    return out;
  });
  ['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array'].forEach(function (n) {
    var C = root[n]; if (!C || !C.prototype) return;
    def(C.prototype, 'at', at);
    def(C.prototype, 'findLast', findLast);
    def(C.prototype, 'findLastIndex', findLastIndex);
    def(C.prototype, 'includes', includes);
    def(C.prototype, 'slice', function (a, b) { return new this.constructor(Array.prototype.slice.call(this, a, b)); });
    def(C.prototype, 'fill', function (v, a, b) { return Array.prototype.fill.call(this, v, a, b); });
  });
  def(Array.prototype, 'fill', function (v, a, b) {
    var len = this.length >>> 0, s = a === undefined ? 0 : (a < 0 ? Math.max(len + a, 0) : Math.min(a, len)), e = b === undefined ? len : (b < 0 ? Math.max(len + b, 0) : Math.min(b, len));
    for (; s < e; s++) this[s] = v;
    return this;
  });

  /* ---- String ---- */
  def(String.prototype, 'at', at);
  def(String.prototype, 'replaceAll', function (search, rep) {
    if (search instanceof RegExp) {
      if (!search.global) throw new TypeError('replaceAll must be called with a global RegExp');
      return this.replace(search, rep);
    }
    var s = String(this), f = String(search), out = '', i = 0, j;
    if (f === '') return s.replace(/(?:)/g, rep);
    while ((j = s.indexOf(f, i)) !== -1) {
      out += s.slice(i, j) + (typeof rep === 'function' ? rep(f, j, s) : String(rep).replace(/\$&/g, f));
      i = j + f.length;
    }
    return out + s.slice(i);
  });
  def(String.prototype, 'trimStart', function () { return this.replace(/^[\s\uFEFF\xA0]+/, ''); });
  def(String.prototype, 'trimEnd', function () { return this.replace(/[\s\uFEFF\xA0]+$/, ''); });
  def(String.prototype, 'padStart', function (n, p) { var s = String(this); p = p === undefined ? ' ' : String(p); while (s.length < n && p) s = p + s; return s.length > n ? s.slice(s.length - n) : s; });
  def(String.prototype, 'padEnd', function (n, p) { var s = String(this); p = p === undefined ? ' ' : String(p); while (s.length < n && p) s += p; return s.slice(0, Math.max(n, String(this).length)); });

  /* ---- Math / Number ---- */
  def(Math, 'trunc', function (x) { return x < 0 ? Math.ceil(x) : Math.floor(x); });
  def(Number, 'isNaN', function (x) { return typeof x === 'number' && x !== x; });
  def(Number, 'isFinite', function (x) { return typeof x === 'number' && isFinite(x); });
  def(Number, 'isInteger', function (x) { return typeof x === 'number' && isFinite(x) && Math.floor(x) === x; });

  /* ---- queueMicrotask / requestAnimationFrame ---- */
  if (typeof root.queueMicrotask !== 'function' && root.Promise) {
    root.queueMicrotask = function (fn) { root.Promise.resolve().then(fn); };
  }
  if (!root.requestAnimationFrame) {
    root.requestAnimationFrame = function (fn) { return setTimeout(function () { fn(Date.now()); }, 16); };
    root.cancelAnimationFrame = function (id) { clearTimeout(id); };
  }

  /* ---- structuredClone (simple deep copy: enough for the plain data the PDF engine clones) ---- */
  if (typeof root.structuredClone !== 'function') {
    root.structuredClone = function (value) {
      var seen = [], copies = [];
      function clone(v) {
        if (v === null || typeof v !== 'object') return v;
        var i = seen.indexOf(v); if (i !== -1) return copies[i];
        var out;
        if (v instanceof Date) return new Date(v.getTime());
        if (v instanceof RegExp) return new RegExp(v.source, v.flags);
        if (typeof ArrayBuffer !== 'undefined' && v instanceof ArrayBuffer) return v.slice(0);
        if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView && ArrayBuffer.isView(v)) {
          return new v.constructor(v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength));
        }
        if (typeof Map !== 'undefined' && v instanceof Map) { out = new Map(); seen.push(v); copies.push(out); v.forEach(function (x, k) { out.set(clone(k), clone(x)); }); return out; }
        if (typeof Set !== 'undefined' && v instanceof Set) { out = new Set(); seen.push(v); copies.push(out); v.forEach(function (x) { out.add(clone(x)); }); return out; }
        var proto = Object.getPrototypeOf(v);
        if (!Array.isArray(v) && proto !== Object.prototype && proto !== null) return v;   // ImageBitmap, canvas, DOM objects ... are passed on as they are
        out = Array.isArray(v) ? [] : {};
        seen.push(v); copies.push(out);
        Object.keys(v).forEach(function (k) { out[k] = clone(v[k]); });
        return out;
      }
      return clone(value);
    };
  }

  /* ---- DOM helpers ---- */
  if (root.NodeList && root.NodeList.prototype && !root.NodeList.prototype.forEach) {
    root.NodeList.prototype.forEach = Array.prototype.forEach;
  }
  if (root.Element && !root.Element.prototype.matches) {
    root.Element.prototype.matches = root.Element.prototype.msMatchesSelector || root.Element.prototype.webkitMatchesSelector;
  }
  if (root.Element && !root.Element.prototype.closest) {
    root.Element.prototype.closest = function (sel) {
      var el = this;
      while (el && el.nodeType === 1) { if (el.matches(sel)) return el; el = el.parentElement || el.parentNode; }
      return null;
    };
  }
  if (typeof root.CustomEvent !== 'function') {
    root.CustomEvent = function (type, p) {
      p = p || { bubbles: false, cancelable: false, detail: null };
      var e = document.createEvent('CustomEvent'); e.initCustomEvent(type, p.bubbles, p.cancelable, p.detail); return e;
    };
  }
  /* AbortSignal.any is only used by newer pdf.js code paths; give a minimal stand-in */
  if (root.AbortSignal && !root.AbortSignal.any && typeof root.AbortController === 'function') {
    root.AbortSignal.any = function (signals) {
      var c = new root.AbortController();
      Array.prototype.forEach.call(signals, function (s) {
        if (s.aborted) c.abort(); else s.addEventListener('abort', function () { c.abort(); });
      });
      return c.signal;
    };
  }
})(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this));
