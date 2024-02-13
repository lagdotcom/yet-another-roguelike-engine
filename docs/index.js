var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m2 = s * 60;
    var h = m2 * 60;
    var d = h * 24;
    var w2 = d * 7;
    var y2 = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y2;
        case "weeks":
        case "week":
        case "w":
          return n * w2;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m2;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m2) {
        return Math.round(ms / m2) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m2) {
        return plural(ms, msAbs, m2, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug3(...args) {
          if (!debug3.enabled) {
            return;
          }
          const self = debug3;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug3.namespace = namespace;
        debug3.useColors = createDebug.useColors();
        debug3.color = createDebug.selectColor(namespace);
        debug3.extend = extend;
        debug3.destroy = createDebug.destroy;
        Object.defineProperty(debug3, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug3);
        }
        return debug3;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c2 = "color: " + this.color;
      args.splice(1, 0, c2, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c2);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// cdn:EventEmitter3
var require_EventEmitter3 = __commonJS({
  "cdn:EventEmitter3"(exports, module) {
    module.exports = globalThis.EventEmitter3;
  }
});

// cdn:deepcopy
var require_deepcopy = __commonJS({
  "cdn:deepcopy"(exports, module) {
    module.exports = globalThis.deepcopy;
  }
});

// src/Game.ts
var import_debug2 = __toESM(require_browser());
var import_eventemitter3 = __toESM(require_EventEmitter3());

// node_modules/random-seedable/src/PRNG.js
var PRNG = class _PRNG {
  /**
   * @constructor
   * @param {number | bigint} max -> Max number that can be generated by this generator.
   * @param {number | bigint} seed -> Initial seed.
   */
  constructor(max, seed) {
    this.max = max;
    this._seed = seed;
  }
  /**
   * Casts the given BigInt number to an unsigned big int with the given
   * number of bits.
   *
   * @protected
   * @param {bigint} number -> A string param.
   * @param {number} bits -> An optional param (Closure syntax)
   * @return {bigint} This is the result
   */
  cast(number, bits) {
    return BigInt.asUintN(bits, number);
  }
  /**
   * Checks that a given number is within the range.
   *
   * @protected
   * @param {number} number -> A string param.
   * @throws Error -> Number greater than max.
   */
  checkNum(number) {
    if (number > this.max) {
      throw new Error(`Number greater than ${this.max}`);
    }
  }
  /**
   * Resets the PRNG.
   * To be implemented by sub-classes.
   *
   * @public
   * @throws Error -> Method not implemented.
   */
  reset() {
    if (this.constructor === _PRNG) {
      throw new Error("Method not implemented");
    }
  }
  /**
   * Private method for integer generation.
   * To be implemented by sub-classes.
   *
   * @protected
   * @return {bigint} Random integer.
   */
  _int() {
    if (this.constructor === _PRNG) {
      throw new Error("Method not implemented");
    }
    return BigInt(0);
  }
  /**
   * Generates a boolean with the formula random.float() >= 0.5
   *
   * @example
   * random.bool();
   *
   * @example
   * random.bool(); // true
   *
   * @public
   * @returns {boolean} True/False.
   */
  bool() {
    return this.float() >= 0.5;
  }
  /**
   * Generates a random boolean with probability of it being true denoted by the pTrue parameter.
   * For example, when pTrue=0.8, 80% of the numbers generated with this method will be true.
   *
   * @example
   * random.coin(pTrue);
   *
   * @example
   * random.coin(0.8); // true
   *
   * @public
   * @param {number} pTrue -> Probability of generating a true value.
   * @returns {boolean} True/False.
   */
  coin(pTrue = 0.5) {
    return this.float() < pTrue;
  }
  /**
   * Generates and returns the next number in the PRNGs sequence.
   *
   * @example
   * random.int();
   *
   * @example
   * random.int(); // 85424123
   *
   * @public
   * @returns {number} Number less than 2 ** 32 for 32 bit generators.
   */
  int() {
    return Number(this._int());
  }
  /**
   * Generates and returns the next number in the PRNGs sequence and returns it as a Bigint.
   *
   * @example
   * random.bigInt();
   *
   * @example
   * random.bigInt(); // 85424123n
   *
   * @public
   * @returns {bigint} Number less than 2 ** 32 for 32 bit generators represented as a BigInt class.
   */
  bigInt() {
    return this._int();
  }
  /**
   * Generates a random floating point number.
   *
   * @example
   * random.float();
   *
   * @example
   * random.float(); // 0.234242
   *
   * @public
   * @returns {number} Float between 0.0 - 1.0.
   */
  float() {
    return this.int() * (1 / this.max);
  }
  /**
   * Generates a random floating point number.
   *
   * @example
   * random.float53();
   *
   * @example
   * random.float53(); // 0.2342422341231
   *
   * @public
   * @returns {number} Float between 0.0 - 1.0.
   */
  float53() {
    const a = this.int() >>> 5;
    const b = this.int() >>> 6;
    return (a * 67108864 + b) * (1 / 9007199254740992);
  }
  /**
   * Generates a number within the given range.
   *
   * @example
   * random.randRange(min, max);
   *
   * @example
   * const lowerBound = 4;
   * const upperBound = 2432;
   * random.randRange(lowerBound, upperBound); // 36.
   *
   * @public
   * @param {number} min -> Lower bound of the numbers to generate (inclusive).
   * @param {number} max -> Upper bound of the numbers to generate (inclusive).
   * @returns {number} Number min <= Number <= max.
   */
  randRange(min, max) {
    const range = max - min;
    const t = this.max % range;
    let r = this.int();
    while (r < t) {
      r = this.int();
    }
    return min + r % range;
  }
  /**
   * Generates a number below the given maximum.
   *
   * @example
   * random.randBelow(max);
   *
   * @example
   * const upperBound = 2432;
   * random.randBelow(upperBound);  // 285.
   *
   * @public
   * @param {number} max -> Upper bound of the numbers to generate (inclusive).
   * @returns {number} Number <= max
   */
  randBelow(max) {
    return this.randRange(0, max);
  }
  /**
   * Picks a random element from the array.
   *
   * @example
   * random.choice(array)
   *
   * @example
   * const arr = [1, 4, 2, 3];
   * random.choice(arr); // 4
   *
   * @public
   * @param {any[]} array -> Array of any type from which we randomly select one item.
   * @returns {any} A single item from the array of type ?.
   */
  choice(array) {
    return array[this.randBelow(array.length)];
  }
  /**
   * Randomly shuffles the given array using the fisher-yates algorithm.
   *
   * @example
   * random.shuffle(array, inPlace = false)
   *
   * @example
   * const arr = [1, 4, 2, 3];
   * const shuffled = random.shuffle(arr, false);
   * console.log(arr); // [1, 4, 2, 3]
   * console.log(shuffled); // [4, 2, 3, 1]
   *
   * @example
   * const arr = [1, 4, 2, 3];
   * const shuffled = random.shuffle(arr, true);
   * console.log(arr); // [4, 2, 3, 1]
   * console.log(shuffled); // [4, 2, 3, 1]
   *
   * @public
   * @param {any[]} array -> Array of any type to be shuffled.
   * @param {boolean} inPlace -> Shuffle the array (true) or shuffle a copy of array (false).
   * @returns {any[]} Array shuffled (inPlace === false), shuffled copy of array (inPlace === true).
   */
  shuffle(array, inPlace = true) {
    let toSort = array;
    if (!inPlace) {
      toSort = Array.from(toSort);
    }
    for (let i = toSort.length - 1; i > 0; i--) {
      const j2 = this.randRange(0, i);
      const temp = toSort[i];
      toSort[i] = toSort[j2];
      toSort[j2] = temp;
    }
    return toSort;
  }
  /**
   * Creates an array of the given size populated with the result of the mapFn.
   *
   * @protected
   * @param {number} size -> Length of the array to create.
   * @param {function(): boolean | number | bigint} mapFn -> Function which we use to fill array.
   * @returns {boolean[] | number[] | bigint[]} Array created by repeated calls to the mapFn.
   */
  initArray(size, mapFn) {
    return Array.from({ length: size }, mapFn);
  }
  /**
   * Generates an n size array populated with booleans.
   *
   * @example
   * random.boolArray(size);
   *
   * @example
   * const size = 256;
   * random.boolArray(size);
   *
   * @public
   * @param {number} size -> Size of the array to generate.
   * @returns {boolean[]} Array[Boolean] of length size.
   */
  boolArray(size) {
    return this.initArray(size, () => this.bool());
  }
  /**
   * Generates an n size array of random booleans with probability of it being true
   * denoted by the pTrue parameter. For example, when pTrue=0.8, 80% of the numbers
   * in the generated array will be true.
   *
   * @example
   * random.coinArray(size, pTrue);
   *
   * @example
   * const size = 256;
   * const pTrue = 0.8;
   * random.coinArray(size, pTrue);
   *
   * @public
   * @param {number} size -> Size of the array to generate.
   * @param {number} pTrue -> Probability of generating a true value.
   * @returns {boolean[]} Array[Boolean] of length size.
   */
  coinArray(size, pTrue = 0.5) {
    return this.initArray(size, () => this.coin(pTrue));
  }
  /**
   * Generates an n size array populated with integers.
   *
   * @example
   * random.intArray(size);
   *
   * @example
   * const size = 256;
   * random.intArray(size);
   *
   * @public
   * @param size -> Size of the array to generate.
   * @returns {number[]} Array[Number] of length size.
   */
  intArray(size) {
    return this.initArray(size, () => this.int());
  }
  /**
   * Generates an n size array populated with Big Integers.
   *
   * @example
   * random.bigIntArray(size);
   *
   * @example
   * const size = 256;
   * random.bigIntArray(size);
   *
   * @public
   * @param size -> Size of the array to generate.
   * @returns {bigint[]} Array[BigInt] of length size.
   */
  bigIntArray(size) {
    return this.initArray(size, () => this.bigInt());
  }
  /**
   * Generates an n size array populated within the given range.
   *
   * @example
   * random.randRangeArray(size, min, max);
   *
   * @example
   * const size = 256;
   * const lowerBound = 4;
   * const upperBound = 2432;
   * random.randRangeArray(size, lowerBound, upperBound);
   *
   * @public
   * @param {number} size -> Size of the array to generate.
   * @param {number} min -> Lower bound of the numbers to generate (inclusive).
   * @param {number} max -> Upper bound of the numbers to generate (inclusive).
   * @returns {number[]} Array[Number] of length size filled w/ min <= num <= max.
   */
  randRangeArray(size, min, max) {
    return this.initArray(size, () => this.randRange(min, max));
  }
  /**
   * Generates an n size array populated with floats.
   *
   * @example
   * random.floatArray(size);
   *
   * @example
   * const size = 256;
   * random.floatArray(size);
   *
   * @public
   * @param size -> Size of the array to generate.
   * @returns {number[]} Array[Number] between 0.0 - 1.0 of length size.
   */
  floatArray(size) {
    return this.initArray(size, () => this.float());
  }
  /**
   * Generates an n size array populated with floats.
   *
   * @example
   * random.float53Array(size);
   *
   * @example
   * const size = 256;
   * random.float53Array(size);
   *
   * @public
   * @param size -> Size of the array to generate.
   * @returns {number[]} Array[Number] between 0.0 - 1.0 of length size.
   */
  float53Array(size) {
    return this.initArray(size, () => this.float53());
  }
};
var PRNG_default = PRNG;

// node_modules/random-seedable/src/PRNG64.js
var PRNG64 = class extends PRNG_default {
  /**
   * @constructor
   * @param {number | bigint} max -> Max number that can be generated by this generator.
   * @param {number | bigint} seed -> Initial seed.
   */
  constructor(max, seed) {
    super(max, seed);
  }
  /**
   * Generates and returns the next number in the PRNGs sequence.
   * As this is a 64 bit generator and javascript integers are limited to 53 bits,
   * the generated BigInt result is right-shifted 11 bits; discarding the least significant bits.
   *
   * @example
   * random.int();
   *
   * @example
   * random.int(); // 85424123
   *
   * @public
   * @returns {number} Number less than 2 ** 53 for 64 bit generators.
   */
  int() {
    return Number(this._int() >> 11n);
  }
  /**
   * Generates a random floating point number.
   *
   * @example
   * random.float();
   *
   * @example
   * random.float(); // 0.234242
   *
   * @public
   * @returns {number} Float between 0.0 - 1.0.
   */
  float() {
    return this.int() / this.max;
  }
  /**
   * Generates a random floating point number.
   *
   * @example
   * random.float53();
   *
   * @example
   * random.float53(); // 0.2342422341231
   *
   * @public
   * @returns {number} Float between 0.0 - 1.0.
   */
  float53() {
    return this.float();
  }
};
var PRNG64_default = PRNG64;

// node_modules/random-seedable/src/constants.js
var MAX32 = 2 ** 32;
var MAX53 = 2 ** 53;
var MAX64 = 2n ** 64n;

// node_modules/random-seedable/src/xorshift64.js
var XORShift64 = class extends PRNG64_default {
  /**
   * @constructor
   * @param {number | bigint} seed -> Initial seed.
   * @param {number | bigint} a -> First bit shift parameter.
   * @param {number | bigint} b -> Second bit shift parameter.
   * @param {number | bigint} c -> Third bit shift parameter.
   */
  constructor(seed = Date.now(), a = 13, b = 7, c2 = 17) {
    super(MAX53, BigInt(seed));
    this.seed = seed;
    this.a = this.cast(BigInt(a), 64);
    this.b = this.cast(BigInt(b), 64);
    this.c = this.cast(BigInt(c2), 64);
  }
  /**
   * Resets the generator to its original state.
   */
  reset() {
    this.x = this.seed;
  }
  /**
   * Seed getter.
   *
   * @public
   * @returns {number | bigint} Retrieves seed.
   */
  get seed() {
    return this._seed;
  }
  /**
   * Converts seed into BigInt + takes steps to reset generator.
   *
   * @public
   * @param {number | bigint} seed -> New seed to set.
   */
  set seed(seed) {
    this._seed = this.cast(BigInt(seed), 64);
    this.x = this._seed;
  }
  _int() {
    let { x } = this;
    x ^= x << this.a;
    x = this.cast(x, 64);
    x ^= x >> this.b;
    x ^= x << this.c;
    x = this.cast(x, 64);
    this.x = x;
    return x;
  }
};
var xorshift64_default = XORShift64;

// node_modules/random-seedable/src/index.js
var random = new xorshift64_default(Date.now());
var src_default = new xorshift64_default(Date.now());

// node_modules/wglt/dist/esm/index.mjs
var Ae = Object.defineProperty;
var Ee = Object.getOwnPropertyDescriptor;
var R = (a, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Ee(e, t) : e, o = a.length - 1, n; o >= 0; o--)
    (n = a[o]) && (i = (r ? n(e, t, i) : n(i)) || i);
  return r && i && Ae(e, t, i), i;
};
function c(a, e, t, r) {
  return r === void 0 && (r = 255), (a << 24) + (e << 16) + (t << 8) + r;
}
var y = { BLACK: c(0, 0, 0), WHITE: c(255, 255, 255), LIGHT_GRAY: c(170, 170, 170), DARK_GRAY: c(85, 85, 85), YELLOW: c(255, 255, 85), BROWN: c(170, 85, 0), LIGHT_RED: c(255, 85, 85), DARK_RED: c(170, 0, 0), LIGHT_GREEN: c(85, 255, 85), DARK_GREEN: c(0, 170, 0), LIGHT_CYAN: c(85, 255, 255), DARK_CYAN: c(0, 170, 170), LIGHT_BLUE: c(85, 85, 255), DARK_BLUE: c(0, 0, 170), LIGHT_MAGENTA: c(255, 85, 255), DARK_MAGENTA: c(170, 0, 170), ORANGE: c(255, 136, 0) };
var Y = /* @__PURE__ */ new Map();
function L(a) {
  Y.set(a.name, a);
}
function Le(a) {
  return typeof a == "string" && a.length > 0 ? a.charCodeAt(0) : a;
}
var N = class {
  constructor(e, t, r, i = y.WHITE, o = y.BLACK) {
    this.x = e;
    this.y = t;
    r !== void 0 ? this.charCode = Le(r) : this.charCode = 32, this.fg = i, this.bg = o, this.dirty = true, this.blocked = false, this.blockedSight = false, this.explored = false, this.visible = false, this.pathId = -1, this.g = 0, this.h = 0, this.prev = null;
  }
  setCharCode(e) {
    this.charCode !== e && (this.charCode = e, this.dirty = true);
  }
  setForeground(e) {
    e != null && e !== this.fg && (this.fg = e, this.dirty = true);
  }
  setBackground(e) {
    e != null && e !== this.bg && (this.bg = e, this.dirty = true);
  }
  setValue(e, t, r) {
    return typeof e == "string" && (e = e.charCodeAt(0)), typeof e == "number" ? (this.setCharCode(e), t !== void 0 && this.setForeground(t), r !== void 0 && this.setBackground(r)) : this.drawCell(e), this.dirty;
  }
  drawCell(e, t) {
    let r = e.bg & 255;
    !t || e.charCode > 0 ? (this.setCharCode(e.charCode), this.setForeground(e.fg)) : r > 0 && r < 255 && this.setForeground(this.blendColors(this.fg, e.bg, t)), !t || r === 255 ? this.setBackground(e.bg) : r > 0 && this.setBackground(this.blendColors(this.bg, e.bg, t));
  }
  blendColors(e, t, r) {
    let o = (255 - (t & 255)) / 255, n = 1 - o, s = e >> 24 & 255, l = e >> 16 & 255, h = e >> 8 & 255, u = t >> 24 & 255, d = t >> 16 & 255, b = t >> 8 & 255;
    switch (r) {
      case "blend":
        return c(o * s + n * u | 0, o * l + n * d | 0, o * h + n * b | 0);
      case "add":
        return c(this.clamp(s + n * u | 0), this.clamp(l + n * d | 0), this.clamp(h + n * b | 0));
      default:
        return t;
    }
  }
  clamp(e) {
    return Math.min(255, e);
  }
};
N = R([L], N);
var g = { SMILEY: 1, INVERSE_SMILEY: 2, HEART: 3, DIAMOND: 4, CLUB: 5, SPADE: 6, BULLET: 7, INVERSE_BULLET: 8, LIGHT_SHADE: 176, MEDIUM_SHADE: 177, DARK_SHADE: 178, BOX_SINGLE_VERTICAL: 179, BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT: 180, BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT: 185, BOX_DOUBLE_VERTICAL: 186, BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT: 187, BOX_DOUBLE_UP_AND_DOUBLE_LEFT: 188, BOX_SINGLE_DOWN_AND_SINGLE_LEFT: 191, BOX_SINGLE_UP_AND_SINGLE_RIGHT: 192, BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP: 193, BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN: 194, BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT: 195, BOX_SINGLE_HORIZONTAL: 196, BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL: 197, BOX_DOUBLE_UP_AND_DOUBLE_RIGHT: 200, BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT: 201, BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP: 202, BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN: 203, BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT: 204, BOX_DOUBLE_HORIZONTAL: 205, BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL: 206, BOX_SINGLE_UP_AND_SINGLE_LEFT: 217, BOX_SINGLE_DOWN_AND_SINGLE_RIGHT: 218, BLOCK_FULL: 219, BLOCK_BOTTOM_HALF: 220, BLOCK_LEFT_HALF: 221, BLOCK_RIGHT_HALF: 222, BLOCK_TOP_HALF: 223 };
var X = { LEFT: "left", CENTER: "center", RIGHT: "right" };
var B = class {
  constructor(e, t, r, i, o) {
    this.text = e;
    this.fg = t;
    this.bg = r;
    this.children = i;
    this.align = o;
  }
  getWidth() {
    let e = 0;
    if (this.text)
      for (let t of this.text.split(`
`))
        e = Math.max(e, t.length);
    if (this.children)
      for (let t of this.children)
        e = Math.max(e, t.getWidth());
    return e;
  }
  getHeight() {
    let e = 0;
    if (this.text && (e += this.text.split(`
`).length), this.children)
      for (let t of this.children)
        e += t.getHeight();
    return e;
  }
};
B = R([L], B);
function re(a, e) {
  let t = new RegExp("(\\S(.{0," + e + "}\\S)?)\\s+", "g");
  return (a + " ").replace(t, `$1
`).trim().split(`
`).map((r) => r.trim());
}
var D = class {
  constructor(e, t, r) {
    this.width = e;
    this.height = t;
    this.grid = [], this.originX = 0, this.originY = 0, this.minX = 0, this.maxX = 0, this.minY = 0, this.maxY = 0, this.radius = 0;
    for (let i = 0; i < t; i++) {
      let o = [];
      for (let n = 0; n < e; n++)
        o.push(new N(n, i));
      this.grid.push(o);
    }
    if (this.clear(), r)
      for (let i = 0; i < t; i++)
        for (let o = 0; o < e; o++)
          this.grid[i][o].blocked = this.grid[i][o].blockedSight = r(o, i);
  }
  clear() {
    for (let e = 0; e < this.height; e++)
      for (let t = 0; t < this.width; t++)
        this.drawChar(t, e, 0);
  }
  getCell(e, t) {
    if (!(e < 0 || t < 0 || e >= this.width || t >= this.height))
      return this.grid[t][e];
  }
  getCharCode(e, t) {
    if (!(e < 0 || t < 0 || e >= this.width || t >= this.height))
      return this.grid[t][e].charCode;
  }
  drawChar(e, t, r, i, o) {
    this.clip && !this.clip.contains({ x: e, y: t }) || e >= 0 && e < this.width && t >= 0 && t < this.height && this.grid[t | 0][e | 0].setValue(r, i, o);
  }
  drawString(e, t, r, i, o) {
    let n = r.split(`
`);
    for (let s = 0; s < n.length; s++)
      this.drawStringLine(e, t + s, n[s], i, o);
  }
  drawStringLine(e, t, r, i, o) {
    for (let n = 0; n < r.length; n++)
      this.drawChar(e + n, t, r.charCodeAt(n), i, o);
  }
  drawCenteredString(e, t, r, i, o) {
    this.drawString(e - Math.floor(r.length / 2), t, r, i, o);
  }
  drawMessage(e, t, r, i) {
    if (r.text) {
      r.align === X.RIGHT ? e += i - r.text.length : r.align === X.CENTER && (e += i / 2 - r.text.length / 2);
      let o = re(r.text, i || this.width - e);
      for (let n of o)
        this.drawStringLine(e, t, n, r.fg, r.bg), t++;
    }
    if (r.children)
      for (let o of r.children)
        t = this.drawMessage(e, t, o, i);
    return t;
  }
  drawHLine(e, t, r, i, o, n) {
    for (let s = e; s < e + r; s++)
      this.drawChar(s, t, i, o, n);
  }
  drawVLine(e, t, r, i, o, n) {
    for (let s = t; s < t + r; s++)
      this.drawChar(e, s, i, o, n);
  }
  drawRect(e, t, r, i, o, n, s) {
    this.drawHLine(e, t, r, o, n, s), this.drawHLine(e, t + i - 1, r, o, n, s), this.drawVLine(e, t, i, o, n, s), this.drawVLine(e + r - 1, t, i, o, n, s);
  }
  drawBox(e, t, r, i, o, n, s, l, h, u, d, b, p, E) {
    this.drawHLine(e, t, r, o, p, E), this.drawHLine(e, t + i - 1, r, s, p, E), this.drawVLine(e, t, i, l, p, E), this.drawVLine(e + r - 1, t, i, n, p, E), this.drawChar(e, t, h, p, E), this.drawChar(e + r - 1, t, u, p, E), this.drawChar(e, t + i - 1, b, p, E), this.drawChar(e + r - 1, t + i - 1, d, p, E);
  }
  drawSingleBox(e, t, r, i, o, n) {
    this.drawBox(e, t, r, i, g.BOX_SINGLE_HORIZONTAL, g.BOX_SINGLE_VERTICAL, g.BOX_SINGLE_HORIZONTAL, g.BOX_SINGLE_VERTICAL, g.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT, g.BOX_SINGLE_DOWN_AND_SINGLE_LEFT, g.BOX_SINGLE_UP_AND_SINGLE_LEFT, g.BOX_SINGLE_UP_AND_SINGLE_RIGHT, o, n);
  }
  drawDoubleBox(e, t, r, i, o, n) {
    this.drawBox(e, t, r, i, g.BOX_DOUBLE_HORIZONTAL, g.BOX_DOUBLE_VERTICAL, g.BOX_DOUBLE_HORIZONTAL, g.BOX_DOUBLE_VERTICAL, g.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT, g.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT, g.BOX_DOUBLE_UP_AND_DOUBLE_LEFT, g.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT, o, n);
  }
  fillRect(e, t, r, i, o, n, s) {
    for (let l = t; l < t + i; l++)
      this.drawHLine(e, l, r, o, n, s);
  }
  drawConsole(e, t, r, i, o, n, s, l) {
    for (let h = 0; h < s; h++)
      for (let u = 0; u < n; u++) {
        let d = r.getCell(i + u, o + h);
        d && this.drawCell(e + u, t + h, d, l);
      }
  }
  drawCell(e, t, r, i) {
    e >= 0 && e < this.width && t >= 0 && t < this.height && this.grid[t][e].drawCell(r, i);
  }
  setBlocked(e, t, r) {
    e >= 0 && e < this.width && t >= 0 && t < this.height && (this.grid[t][e].blocked = r);
  }
  setBlockedSight(e, t, r) {
    e >= 0 && e < this.width && t >= 0 && t < this.height && (this.grid[t][e].blockedSight = r);
  }
  isVisible(e, t) {
    return e < this.minX || e > this.maxX || t < this.minY || t > this.maxY ? false : this.grid[t][e].visible;
  }
  isBlocked(e, t) {
    return e < 0 || e > this.width || t < 0 || t > this.height ? true : this.grid[t][e].blocked;
  }
  isBlockedSight(e, t) {
    return e < 0 || e > this.width || t < 0 || t > this.height ? true : this.grid[t][e].blockedSight;
  }
  computeOctantY(e, t) {
    let r = [], i = [], o = 1, n = 0, s = 0, l = 0, h, u, d, b, p, E, C, x, A, v;
    for (u = this.originY + t; u >= this.minY && u <= this.maxY; u += t, s = n, ++o)
      for (d = 0.5 / o, v = -1, b = Math.floor(l * o + 0.5), h = this.originX + b * e; b <= o && h >= this.minX && h <= this.maxX; h += e, ++b, v = A) {
        if (p = true, E = false, C = b / o, x = v, A = C + d, s > 0) {
          if (!(this.grid[u - t][h].visible && !this.grid[u - t][h].blockedSight) && !(this.grid[u - t][h - e].visible && !this.grid[u - t][h - e].blockedSight))
            p = false;
          else
            for (let _ = 0; _ < s && p; ++_)
              if (x <= i[_] && A >= r[_]) {
                if (this.grid[u][h].blockedSight)
                  if (x >= r[_] && A <= i[_]) {
                    p = false;
                    break;
                  } else
                    r[_] = Math.min(r[_], x), i[_] = Math.max(i[_], A), E = true;
                else if (C > r[_] && C < i[_]) {
                  p = false;
                  break;
                }
              }
        }
        p && (this.grid[u][h].visible = true, this.grid[u][h].blockedSight && (l >= x ? l = A : E || (r[n] = x, i[n++] = A)));
      }
  }
  computeOctantX(e, t) {
    let r = [], i = [], o = 1, n = 0, s = 0, l = 0, h, u, d, b, p, E, C, x, A, v;
    for (h = this.originX + e; h >= this.minX && h <= this.maxX; h += e, s = n, ++o)
      for (d = 0.5 / o, v = -1, b = Math.floor(l * o + 0.5), u = this.originY + b * t; b <= o && u >= this.minY && u <= this.maxY; u += t, ++b, v = A) {
        if (p = true, E = false, C = b / o, x = v, A = C + d, s > 0) {
          if (!(this.grid[u][h - e].visible && !this.grid[u][h - e].blockedSight) && !(this.grid[u - t][h - e].visible && !this.grid[u - t][h - e].blockedSight))
            p = false;
          else
            for (let _ = 0; _ < s && p; ++_)
              if (x <= i[_] && A >= r[_]) {
                if (this.grid[u][h].blockedSight)
                  if (x >= r[_] && A <= i[_]) {
                    p = false;
                    break;
                  } else
                    r[_] = Math.min(r[_], x), i[_] = Math.max(i[_], A), E = true;
                else if (C > r[_] && C < i[_]) {
                  p = false;
                  break;
                }
              }
        }
        p && (this.grid[u][h].visible = true, this.grid[u][h].blockedSight && (l >= x ? l = A : E || (r[n] = x, i[n++] = A)));
      }
  }
  computeFov(e, t, r, i, o) {
    if (this.originX = e, this.originY = t, this.radius = r, i)
      this.minX = Math.min(this.minX, Math.max(0, e - r)), this.minY = Math.min(this.minY, Math.max(0, t - r)), this.maxX = Math.max(this.maxX, Math.min(this.width - 1, e + r)), this.maxY = Math.max(this.maxY, Math.min(this.height - 1, t + r));
    else {
      this.minX = Math.max(0, e - r), this.minY = Math.max(0, t - r), this.maxX = Math.min(this.width - 1, e + r), this.maxY = Math.min(this.height - 1, t + r);
      for (let n = this.minY; n <= this.maxY; n++)
        for (let s = this.minX; s <= this.maxX; s++)
          this.grid[n][s].visible = false;
    }
    this.grid[t][e].visible = true, o === void 0 ? (this.computeOctantY(1, 1), this.computeOctantX(1, 1), this.computeOctantX(1, -1), this.computeOctantY(1, -1), this.computeOctantY(-1, -1), this.computeOctantX(-1, -1), this.computeOctantX(-1, 1), this.computeOctantY(-1, 1)) : (o & 1 && this.computeOctantY(1, 1), o & 2 && this.computeOctantX(1, 1), o & 4 && this.computeOctantX(1, -1), o & 8 && this.computeOctantY(1, -1), o & 16 && this.computeOctantY(-1, -1), o & 32 && this.computeOctantX(-1, -1), o & 64 && this.computeOctantX(-1, 1), o & 128 && this.computeOctantY(-1, 1));
  }
  updateExplored() {
    for (let e = this.minY; e <= this.maxY; e++)
      for (let t = this.minX; t <= this.maxX; t++) {
        let r = this.grid[e][t];
        r.explored = r.explored || r.visible;
      }
  }
};
D = R([L], D);
var z = class {
  constructor(e, t, r) {
    this.url = e;
    this.charWidth = t;
    this.charHeight = r;
  }
};
var Ce = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAEhklEQVRIx42Sv4oUQRDGC4UzadSwwMUD8QEKlbWD4Q58B/NGpTVocKO1wXHUzMAH0AcwMTYVGg5ag0IzEXaRjdZEZKNzkKbHqtnzHypY09M9+5uvqr7pbYCuC6ftaRhgONXs30eAh0O1rYDm4IS/eH0B8GxRW2vxo396yu/fb0ZFrW1zcOXlPU/XPwK8PGjbWhVwM4KnH61912oK4+zmmHJaQotyt1kvtC2Atdo24iohPDiG/v4eICJsY3Wy8Yvr0DSIBOdxgH6v8wsriWhc8s0AtaK/GzSl1jR0nSjQnwki6FQxNFKjgzO2a7BBqucH7dL4M9z96CIhT1Fs/AgKgcA6dKCxI29DaHNwRJ4EGAU1sU0OG9rmE4SIc3A4FChACqqhJRwpxkqh9wxag4DSmEJ5DtpFwAP4GUf6lmKcFFti1BYuQp4xN8kxM2kNhjdkTOiTUeAKGvhA1rLpMbYACQzCITlTDRMbLYoEa2JWPSMRFZIupcSzMVKcEUkX+sOG+ChNX2vD8ex6k7OFHL0P1655JuPd53WAD+yTv3UrCQiuHmYBbfIxpkImuvpBQBkVb5g4XHv3JkNireG8AO9zDhBZu2z2OMZ11S5/RIlyMefMNaZ4GsCz5xcjyM6hHYEjAYEfO8Ig1rklAe9sRIeYAdwyoIBq6YIzCAKiWoifA3m3o2AzWcdYKOdY47EIf8QABCuYgIUVmdVMEYEDA0Hmo/3D6KKJbh5mxhP3UsWIE97wnEygyizOfOLi2JOJW8CeOblW9IHeKZgv4zxuzDryOmb+4aQH+MXV6e0ywdUcxqCjBWl5GpbzZduOG1QEiGXP86T7EfiJfkMQ4OO4H0yqyNC2zlziWEN7Ywuc2fQ4p5BNkS5QYXP2h5NtRJh0vCKQidtVJmCGAwDSSQpYggSxiRIyzewsgCh4xxiTPDMh5aj//l7btqkr6rQyIOtLji4lVRQwXdzvus40Y53M33fh50GZwF4ExQeMlvuTggLzSi4ElKczUO7zVtpwdyMKdqZKOWb2nDblawPxPmuMwFEWBW+jlZR1eYtS442kiBGMWCi/h1/+GAR6NYOJWiqNJXFygFtrkx5C0O3IeFGs67HhEEhmBu/BUOT+0551pXxYIF+Elpi5AKRkLl5GUbCCZddyMv621ujEBPP4vSy2fotTx3U+d3WBiFOA6VSGSB49v/M7GBX9FPrDaT2c9qr4PCpwZ7qz813R94dVFIe19v33GlMZUghQFb8BrfE7QBmgBMbrn2B3enn/y3B5+DL8UBAdnejdYdBxeV9ejwoYNTgW0Ok/gA7UG2GAzanhL0DG7q4svynwF8UwDPu7u/vD0IudzSltMtVbP+J/gUbR29oJ7Fg9s6Uy+DnpiTCOYc4cXOeXMWfsusSw7FOg9x655nax6BlecwpOQQ68WBwp+H2LMQTuOq2RUigzh2Q/R3CWARJIJG199EwOTyKBlQMznshCRGeQ5gHABAQl6M4gLEdAzVaBWMCiANdsayDCHBA/hagKYfielrJIlipKKQIA9Nf3wBloTHT6BuAx15zRNa1nAAAAAElFTkSuQmCC";
var Q = new z(Ce, 8, 8);
var f = class {
  constructor(e, t) {
    this.x = e;
    this.y = t;
  }
};
f = R([L], f);
var T = class {
  constructor(e, t, r, i) {
    this.x = e;
    this.y = t;
    this.width = r;
    this.height = i;
  }
  get left() {
    return this.x;
  }
  get top() {
    return this.y;
  }
  get x2() {
    return this.x + this.width;
  }
  get y2() {
    return this.y + this.height;
  }
  getCenter() {
    return new f(this.x + this.width / 2 | 0, this.y + this.height / 2 | 0);
  }
  intersects(e) {
    return this.x <= e.x2 && this.x2 >= e.x && this.y <= e.y2 && this.y2 >= e.y;
  }
  contains(e) {
    return e.x >= this.x && e.x < this.x2 && e.y >= this.y && e.y < this.y2;
  }
};
T = R([L], T);
var F = class {
  constructor(e, t, r) {
    this.dialog = e;
    this.rect = t;
    this.contentsOffset = r;
    this.open = false;
    this.count = 0;
  }
};
var P = class {
  getState(e, t) {
    let r = t.contentsRect.width + 4, i = t.contentsRect.height + 4, o = (e.width - r) / 2 | 0, n = (e.height - i) / 2 | 0;
    return new F(t, new T(o, n, r, i), new f(o + 2, n + 2));
  }
  draw(e, t) {
    let r = t.dialog, { x: i, y: o, width: n, height: s } = t.rect;
    e.fillRect(i, o, n, s, 0, y.WHITE, y.BLACK), e.drawSingleBox(i, o, n, s), e.drawCenteredString(i + n / 2 | 0, o, " " + r.title + " "), r.drawContents(e, t.contentsOffset);
  }
};
var oe = class {
  constructor(e, t = new P(), r = []) {
    this.terminal = e;
    this.renderer = t;
    this.dialogs = r;
  }
  add(e) {
    this.dialogs.push(this.renderer.getState(this.terminal, e));
  }
  handleInput() {
    if (this.dialogs.length === 0)
      return false;
    let e = this.dialogs.length - 1, t = this.dialogs[this.dialogs.length - 1];
    return t.dialog.handleInput(this.terminal, t.contentsOffset) && this.dialogs.splice(e, 1), true;
  }
  draw() {
    for (let e = 0; e < this.dialogs.length; e++)
      this.renderer.draw(this.terminal, this.dialogs[e]);
  }
};
var w = class {
  constructor(e, t) {
    this.contentsRect = e;
    this.title = t;
  }
};
var ye = 66.66666666666667;
var j = class {
  constructor() {
    this.down = false;
    this.downTime = 0;
    this.repeat = false;
    this.repeatTime = 0;
    this.downCount = 0;
    this.upCount = 100;
  }
  setDown(e) {
    this.down !== e && (this.down = e, this.repeat = false, this.downTime = this.repeatTime = performance.now());
  }
  update(e) {
    this.repeat = false, this.down ? (this.downCount++, this.upCount = 0, e - this.downTime >= 200 && e - this.repeatTime >= ye && (this.repeat = true, this.repeatTime = e)) : (this.downCount = 0, this.upCount++);
  }
  isPressed() {
    return this.downCount === 1 || this.repeat;
  }
  isClicked() {
    return this.upCount === 1;
  }
};
var U = class {
  constructor() {
    this.inputs = /* @__PURE__ */ new Map();
  }
  clear() {
    this.inputs.clear();
  }
  get(e) {
    let t = this.inputs.get(e);
    return t || (t = new j(), this.inputs.set(e, t)), t;
  }
  updateAll(e) {
    this.inputs.forEach((t) => t.update(e));
  }
};
var V = class {
  constructor(e) {
    this.keys = new U();
    e.addEventListener("keydown", (t) => this.setKey(t, true)), e.addEventListener("keyup", (t) => this.setKey(t, false));
  }
  clear() {
    this.keys.clear();
  }
  getKey(e) {
    return this.keys.get(e);
  }
  setKey(e, t) {
    let r = e.code;
    r !== m.VK_F11 && (e.stopPropagation(), e.preventDefault(), this.keys.get(r).setDown(t));
  }
  updateKeys(e) {
    this.keys.updateAll(e);
  }
};
var m = { VK_BACKSPACE: "Backspace", VK_TAB: "Tab", VK_ENTER: "Enter", VK_SHIFT_LEFT: "ShiftLeft", VK_SHIFT_RIGHT: "ShiftRight", VK_CONTROL_LEFT: "ControlLeft", VK_CONTROL_RIGHT: "ControlRight", VK_ALT_LEFT: "AltLeft", VK_ALT_RIGHT: "AltRight", VK_PAUSE: "Pause", VK_CAPS_LOCK: "CapsLock", VK_ESCAPE: "Escape", VK_SPACE: "Space", VK_PAGE_UP: "PageUp", VK_PAGE_DOWN: "PageDown", VK_END: "End", VK_HOME: "Home", VK_LEFT: "ArrowLeft", VK_UP: "ArrowUp", VK_RIGHT: "ArrowRight", VK_DOWN: "ArrowDown", VK_INSERT: "Insert", VK_DELETE: "Delete", VK_0: "Digit0", VK_1: "Digit1", VK_2: "Digit2", VK_3: "Digit3", VK_4: "Digit4", VK_5: "Digit5", VK_6: "Digit6", VK_7: "Digit7", VK_8: "Digit8", VK_9: "Digit9", VK_SEMICOLON: "Semicolon", VK_EQUALS: "Equal", VK_A: "KeyA", VK_B: "KeyB", VK_C: "KeyC", VK_D: "KeyD", VK_E: "KeyE", VK_F: "KeyF", VK_G: "KeyG", VK_H: "KeyH", VK_I: "KeyI", VK_J: "KeyJ", VK_K: "KeyK", VK_L: "KeyL", VK_M: "KeyM", VK_N: "KeyN", VK_O: "KeyO", VK_P: "KeyP", VK_Q: "KeyQ", VK_R: "KeyR", VK_S: "KeyS", VK_T: "KeyT", VK_U: "KeyU", VK_V: "KeyV", VK_W: "KeyW", VK_X: "KeyX", VK_Y: "KeyY", VK_Z: "KeyZ", VK_CONTEXT_MENU: "ContextMenu", VK_NUMPAD0: "Numpad0", VK_NUMPAD1: "Numpad1", VK_NUMPAD2: "Numpad2", VK_NUMPAD3: "Numpad3", VK_NUMPAD4: "Numpad4", VK_NUMPAD5: "Numpad5", VK_NUMPAD6: "Numpad6", VK_NUMPAD7: "Numpad7", VK_NUMPAD8: "Numpad8", VK_NUMPAD9: "Numpad9", VK_NUMPAD_ENTER: "NumpadEnter", VK_MULTIPLY: "NumpadMultiply", VK_ADD: "NumpadAdd", VK_SEPARATOR: "NumpadSeparator", VK_SUBTRACT: "NumpadSubtract", VK_DECIMAL: "NumpadDecimal", VK_DIVIDE: "NumpadDivide", VK_F1: "F1", VK_F2: "F2", VK_F3: "F3", VK_F4: "F4", VK_F5: "F5", VK_F6: "F6", VK_F7: "F7", VK_F8: "F8", VK_F9: "F9", VK_F10: "F10", VK_F11: "F11", VK_F12: "F12", VK_F13: "F13", VK_F14: "F14", VK_F15: "F15", VK_F16: "F16", VK_F17: "F17", VK_F18: "F18", VK_F19: "F19", VK_F20: "F20", VK_F21: "F21", VK_F22: "F22", VK_F23: "F23", VK_F24: "F24", VK_NUM_LOCK: "NumLock", VK_SCROLL_LOCK: "ScrollLock", VK_COMMA: "Comma", VK_PERIOD: "Period", VK_SLASH: "Slash", VK_BACKQUOTE: "Backquote", VK_OPEN_BRACKET: "BracketLeft", VK_BACK_SLASH: "Backslash", VK_CLOSE_BRACKET: "BracketRight", VK_QUOTE: "Quote", VK_META: "OSLeft" };
var ie = class extends w {
  constructor(t, r) {
    let i;
    r instanceof B ? i = new T(0, 0, r.getWidth(), r.getHeight()) : i = new T(0, 0, r.length, 1);
    super(i, t);
    this.message = r;
  }
  drawContents(t, r) {
    this.message instanceof B ? t.drawMessage(r.x, r.y, this.message, this.message.getWidth()) : t.drawString(r.x, r.y, this.message);
  }
  handleInput(t) {
    return t.isKeyPressed(m.VK_ESCAPE);
  }
};
var ae = [{ charCode: g.BLOCK_TOP_HALF, active: [1, 1, 0, 0] }, { charCode: g.BLOCK_RIGHT_HALF, active: [0, 1, 0, 1] }];
var G = class {
  constructor(e) {
    this.buttons = new U();
    this.el = e.canvas, this.width = e.width, this.height = e.height, this.prevX = 0, this.prevY = 0, this.x = 0, this.y = 0, this.dx = 0, this.dy = 0, this.wheelDeltaX = 0, this.wheelDeltaY = 0;
    let t = this.el;
    t.addEventListener("mousedown", (r) => this.handleEvent(r)), t.addEventListener("mouseup", (r) => this.handleEvent(r)), t.addEventListener("mousemove", (r) => this.handleEvent(r)), t.addEventListener("contextmenu", (r) => this.handleEvent(r)), t.addEventListener("touchstart", (r) => this.handleTouchEvent(r)), t.addEventListener("touchend", (r) => this.handleTouchEvent(r)), t.addEventListener("touchcancel", (r) => this.handleTouchEvent(r)), t.addEventListener("touchmove", (r) => this.handleTouchEvent(r)), t.addEventListener("wheel", (r) => this.handleWheelEvent(r));
  }
  handleTouchEvent(e) {
    if (e.stopPropagation(), e.preventDefault(), e.touches.length > 0) {
      let t = e.touches[0];
      this.updatePosition(t.clientX, t.clientY), this.buttons.get(0).setDown(true);
    } else
      this.buttons.get(0).setDown(false);
  }
  handleEvent(e) {
    e.stopPropagation(), e.preventDefault(), this.updatePosition(e.clientX, e.clientY), e.type === "mousedown" && (this.buttons.get(e.button).setDown(true), this.el.focus()), e.type === "mouseup" && this.buttons.get(e.button).setDown(false);
  }
  handleWheelEvent(e) {
    e.stopPropagation(), e.preventDefault(), this.wheelDeltaX = e.deltaX, this.wheelDeltaY = e.deltaY;
  }
  updatePosition(e, t) {
    let r = this.el.getBoundingClientRect(), i = this.width / this.height, o = r.width / r.height;
    if (o - i > 0.01) {
      let n = i * r.height, s = r.width - n;
      r = new T(Math.floor(s / 2), 0, n, r.height);
    }
    if (o - i < -0.01) {
      let n = r.width / i, s = r.height - n;
      r = new T(0, Math.floor(s / 2), r.width, n);
    }
    this.x = this.width * (e - r.left) / r.width | 0, this.y = this.height * (t - r.top) / r.height | 0;
  }
  update(e) {
    this.dx = this.x - this.prevX, this.dy = this.y - this.prevY, this.prevX = this.x, this.prevY = this.y, this.buttons.updateAll(e);
  }
};
var nr = { BLACK: c(0, 0, 0), WHITE: c(255, 255, 255), RED: c(136, 0, 0), CYAN: c(170, 255, 238), VIOLET: c(204, 68, 204), GREEN: c(0, 204, 85), BLUE: c(0, 0, 170), YELLOW: c(238, 238, 119), ORANGE: c(221, 136, 85), BROWN: c(102, 68, 0), LIGHT_RED: c(255, 119, 119), DARK_GRAY: c(51, 51, 51), GRAY: c(119, 119, 119), LIGHT_GREEN: c(170, 255, 102), LIGHT_BLUE: c(0, 136, 255), LIGHT_GRAY: c(187, 187, 187) };
var lr = { BLACK: c(0, 0, 0), WHITE: c(255, 255, 255), RED: c(136, 0, 0), CYAN: c(170, 255, 238), VIOLET: c(204, 68, 204), GREEN: c(0, 204, 85), BLUE: c(0, 0, 170), YELLOW: c(238, 238, 119), ORANGE: c(221, 136, 85), BROWN: c(102, 68, 0), LIGHT_RED: c(255, 119, 119), DARK_GRAY: c(51, 51, 51), GRAY: c(119, 119, 119), LIGHT_GREEN: c(170, 255, 102), LIGHT_BLUE: c(0, 136, 255), LIGHT_GRAY: c(187, 187, 187) };
var cr = { BLACK: c(0, 0, 0), DARK_BLUE: c(29, 43, 83), DARK_PURPLE: c(126, 37, 83), DARK_GREEN: c(0, 135, 81), BROWN: c(171, 82, 54), DARK_GRAY: c(95, 87, 79), LIGHT_GRAY: c(194, 195, 199), WHITE: c(255, 241, 232), RED: c(255, 0, 77), ORANGE: c(255, 163, 0), YELLOW: c(255, 236, 39), GREEN: c(0, 228, 54), BLUE: c(41, 173, 255), LAVENDER: c(131, 118, 156), PINK: c(255, 119, 168), LIGHT_PEACH: c(255, 204, 170) };
var M = class {
  constructor(e = 1) {
    this.m = 2147483648, this.a = 1103515245, this.c = 12345, this.state = e;
  }
  nextInt() {
    return this.state = (this.a * this.state + this.c) % this.m, this.state;
  }
  nextFloat() {
    return this.nextInt() / (this.m - 1);
  }
  nextRange(e, t) {
    let r = t - e, i = this.nextInt() / this.m, o = e + (i * r | 0);
    if (isNaN(o))
      throw new Error("rand nan");
    return o;
  }
  chooseIndex(e) {
    let t = e.reduce((o, n) => o + n), r = this.nextRange(1, t + 1), i = 0;
    for (let o = 0; o < e.length; o++)
      if (i += e[o], r <= i)
        return o;
    return e.length - 1;
  }
  chooseKey(e) {
    let t = Object.keys(e), r = t.map((i) => e[i]);
    return t[this.chooseIndex(r)];
  }
};
M = R([L], M);
var ce = `#version 300 es
precision highp float;in vec2 a;in vec2 b;in vec3 c;in vec3 d;out vec2 e;out vec4 f;out vec4 g;void main(void){gl_Position=vec4(a.x,a.y,0,1);e=b/16.0;f=vec4(c.r,c.g,c.b,1);g=vec4(d.r,d.g,d.b,1);}`;
var de = `#version 300 es
precision highp float;in vec2 e;in vec4 f;in vec4 g;uniform sampler2D s;out vec4 o;void main(void){o=texture(s,e);if(o.r<0.1) {o=g;} else {o=f;}}`;
var me = `#version 300 es
precision highp float;
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main(void) {
  gl_Position=vec4(a_position.x, a_position.y, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`;
var fe = `#version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;
in vec2 v_texCoord;
uniform sampler2D u_texture;
uniform float u_blur;
uniform float u_curvature;
uniform float u_chroma;
uniform float u_scanlineWidth;
uniform float u_scanlineIntensity;
uniform float u_vignette;
out vec4 outputColor;

vec2 curve(vec2 uv) {
  uv = (uv - 0.5) * 2.0;
  uv *= 1.1;
  uv.x *= 1.0 + pow((abs(uv.y) * u_curvature), 2.0);
  uv.y *= 1.0 + pow((abs(uv.x) * u_curvature), 2.0);
  uv /= 1.1;
  uv = (uv / 2.0) + 0.5;
  return uv;
}

void main() {
  vec2 iResolution = vec2(640.0, 360.0);
  vec2 q = v_texCoord;
  vec2 fragCoord = v_texCoord;
  vec2 uv = q;
  uv = curve(uv);

  // Outside of range is black
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    outputColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  vec4 col;

  // Chromatic aberration
  // col = texture(u_texture, uv.xy);
  col.r = 0.7 * texture(u_texture, vec2(uv.x + 0.001 * u_chroma, uv.y + 0.001 * u_chroma)).r;
  col.g = 0.7 * texture(u_texture, vec2(uv.x + 0.000 * u_chroma, uv.y - 0.002 * u_chroma)).g;
  col.b = 0.7 * texture(u_texture, vec2(uv.x - 0.002 * u_chroma, uv.y + 0.000 * u_chroma)).b;
  
  // Blur
  col += 0.05 * texture(u_texture, vec2(uv.x - 2.0 * u_blur / iResolution.x, uv.y));
  col += 0.10 * texture(u_texture, vec2(uv.x - 1.0 * u_blur / iResolution.x, uv.y));
  col += 0.10 * texture(u_texture, vec2(uv.x + 1.0 * u_blur / iResolution.x, uv.y));
  col += 0.05 * texture(u_texture, vec2(uv.x + 2.0 * u_blur / iResolution.x, uv.y));

  // Vignette
  col *= pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), u_vignette);

  // Scanlines
  col *= clamp(1.0 + u_scanlineWidth * sin(uv.y * iResolution.y * 2.0 * PI), 1.0 - u_scanlineIntensity, 1.0);

  outputColor = vec4(col.rgb, 1.0);
}`;
function K(a, e) {
  return -1 + 2 * (a / e);
}
var _e = { [m.VK_K]: new f(0, -1), [m.VK_UP]: new f(0, -1), [m.VK_NUMPAD8]: new f(0, -1), [m.VK_J]: new f(0, 1), [m.VK_DOWN]: new f(0, 1), [m.VK_NUMPAD2]: new f(0, 1), [m.VK_H]: new f(-1, 0), [m.VK_LEFT]: new f(-1, 0), [m.VK_NUMPAD4]: new f(-1, 0), [m.VK_L]: new f(1, 0), [m.VK_RIGHT]: new f(1, 0), [m.VK_NUMPAD6]: new f(1, 0), [m.VK_Y]: new f(-1, -1), [m.VK_NUMPAD7]: new f(-1, -1), [m.VK_U]: new f(1, -1), [m.VK_NUMPAD9]: new f(1, -1), [m.VK_B]: new f(-1, 1), [m.VK_NUMPAD1]: new f(-1, 1), [m.VK_N]: new f(1, 1), [m.VK_NUMPAD3]: new f(1, 1), [m.VK_PERIOD]: new f(0, 0), [m.VK_NUMPAD5]: new f(0, 0) };
var Be = { font: Q, movementKeys: _e };
var be = class extends D {
  constructor(e, t, r, i = Be) {
    super(t, r), this.canvas = e, this.font = i.font ?? Q, this.crt = i.crt, this.maxFps = i.maxFps, this.pixelWidth = t * this.font.charWidth, this.pixelHeight = r * this.font.charHeight, this.pixelScale = i.crt?.scale ?? 1, e.width = this.pixelWidth * this.pixelScale, e.height = this.pixelHeight * this.pixelScale, e.style.imageRendering = "pixelated", e.style.outline = "none", e.tabIndex = 0, this.handleResize(), window.addEventListener("resize", () => this.handleResize()), this.keys = new V(e), this.mouse = new G(this);
    let o = e.getContext("webgl2", { antialias: false });
    if (!o)
      throw new Error("Unable to initialize WebGL. Your browser may not support it.");
    let n = o.createProgram();
    if (!n)
      throw new Error("Unable to initialize WebGL. Your browser may not support it.");
    this.gl = o, this.program = n, o.attachShader(n, this.buildShader(o.VERTEX_SHADER, ce)), o.attachShader(n, this.buildShader(o.FRAGMENT_SHADER, de)), o.linkProgram(n), o.useProgram(n), this.crtProgram = o.createProgram(), o.attachShader(this.crtProgram, this.buildShader(o.VERTEX_SHADER, me)), o.attachShader(this.crtProgram, this.buildShader(o.FRAGMENT_SHADER, fe)), o.linkProgram(this.crtProgram), o.useProgram(this.crtProgram), this.crtBlurLocation = o.getUniformLocation(this.crtProgram, "u_blur"), this.crtCurvatureLocation = o.getUniformLocation(this.crtProgram, "u_curvature"), this.crtChromaLocation = o.getUniformLocation(this.crtProgram, "u_chroma"), this.crtScanlineWidthLocation = o.getUniformLocation(this.crtProgram, "u_scanlineWidth"), this.crtScanlineIntensityLocation = o.getUniformLocation(this.crtProgram, "u_scanlineIntensity"), this.crtVignetteLocation = o.getUniformLocation(this.crtProgram, "u_vignette"), this.crtPositionLocation = o.getAttribLocation(this.crtProgram, "a_position"), this.crtPositionBuffer = o.createBuffer(), o.bindBuffer(o.ARRAY_BUFFER, this.crtPositionBuffer), o.bufferData(o.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), o.STATIC_DRAW), o.enableVertexAttribArray(this.crtPositionLocation), o.vertexAttribPointer(this.crtPositionLocation, 2, o.FLOAT, false, 0, 0), this.crtTexCoordLocation = o.getAttribLocation(this.crtProgram, "a_texCoord"), this.crtTexCoordBuffer = o.createBuffer(), o.bindBuffer(o.ARRAY_BUFFER, this.crtTexCoordBuffer), o.bufferData(o.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), o.STATIC_DRAW), o.enableVertexAttribArray(this.crtTexCoordLocation), o.vertexAttribPointer(this.crtTexCoordLocation, 2, o.FLOAT, false, 0, 0), this.positionAttribLocation = this.getAttribLocation("a"), this.textureAttribLocation = this.getAttribLocation("b"), this.fgColorAttribLocation = this.getAttribLocation("c"), this.bgColorAttribLocation = this.getAttribLocation("d");
    let s = t * r;
    this.positionsArray = new Float32Array(s * 3 * 4), this.indexArray = new Uint16Array(s * 6), this.textureArray = new Float32Array(s * 2 * 4), this.foregroundUint8Array = new Uint8Array(s * 4 * 4), this.foregroundDataView = new DataView(this.foregroundUint8Array.buffer), this.backgroundUint8Array = new Uint8Array(s * 4 * 4), this.backgroundDataView = new DataView(this.backgroundUint8Array.buffer), this.frameBufferTexture = o.createTexture(), o.bindTexture(o.TEXTURE_2D, this.frameBufferTexture), o.texImage2D(o.TEXTURE_2D, 0, o.RGBA, this.pixelWidth, this.pixelHeight, 0, o.RGBA, o.UNSIGNED_BYTE, null), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MIN_FILTER, o.NEAREST), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MAG_FILTER, o.NEAREST), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_S, o.CLAMP_TO_EDGE), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_T, o.CLAMP_TO_EDGE), this.frameBuffer = o.createFramebuffer(), o.bindFramebuffer(o.FRAMEBUFFER, this.frameBuffer), o.framebufferTexture2D(o.FRAMEBUFFER, o.COLOR_ATTACHMENT0, o.TEXTURE_2D, this.frameBufferTexture, 0);
    let l = 0, h = 0, u = 0;
    for (let d = 0; d < r; d++)
      for (let b = 0; b < t; b++)
        this.positionsArray[l++] = K(b, t), this.positionsArray[l++] = -K(d, r), this.positionsArray[l++] = K(b + 1, t), this.positionsArray[l++] = -K(d, r), this.positionsArray[l++] = K(b + 1, t), this.positionsArray[l++] = -K(d + 1, r), this.positionsArray[l++] = K(b, t), this.positionsArray[l++] = -K(d + 1, r), this.indexArray[h++] = u + 0, this.indexArray[h++] = u + 1, this.indexArray[h++] = u + 2, this.indexArray[h++] = u + 0, this.indexArray[h++] = u + 2, this.indexArray[h++] = u + 3, u += 4;
    this.positionBuffer = o.createBuffer(), this.indexBuffer = o.createBuffer(), this.textureBuffer = o.createBuffer(), this.foregroundBuffer = o.createBuffer(), this.backgroundBuffer = o.createBuffer(), o.bindBuffer(o.ARRAY_BUFFER, this.positionBuffer), o.bufferData(o.ARRAY_BUFFER, this.positionsArray, o.STATIC_DRAW), o.bindBuffer(o.ELEMENT_ARRAY_BUFFER, this.indexBuffer), o.bufferData(o.ELEMENT_ARRAY_BUFFER, this.indexArray, o.STATIC_DRAW), this.texture = this.loadTexture(this.font.url), this.lastRenderTime = 0, this.renderDelta = 0, this.fps = 0, this.averageFps = 0, this.maxFps === void 0 ? this.requestAnimationFrame() : window.setInterval(() => this.renderLoop(performance.now()), 1e3 / this.maxFps);
  }
  handleResize() {
    let e = this.canvas.parentElement;
    if (!e)
      return;
    let t = e.offsetWidth / this.pixelWidth, r = e.offsetHeight / this.pixelHeight, i = Math.min(t, r), o = i * this.pixelWidth | 0, n = i * this.pixelHeight | 0;
    this.canvas.style.width = o + "px", this.canvas.style.height = n + "px";
  }
  getAttribLocation(e) {
    let t = this.gl.getAttribLocation(this.program, e);
    return this.gl.enableVertexAttribArray(t), t;
  }
  flush() {
    let e = 0, t = 0;
    for (let r = 0; r < this.height; r++)
      for (let i = 0; i < this.width; i++) {
        let o = this.getCell(i, r);
        if (!o.dirty) {
          e += 8, t += 16;
          continue;
        }
        let n = o.charCode % 16, s = o.charCode / 16 | 0;
        this.textureArray[e++] = n, this.textureArray[e++] = s, this.textureArray[e++] = n + 1, this.textureArray[e++] = s, this.textureArray[e++] = n + 1, this.textureArray[e++] = s + 1, this.textureArray[e++] = n, this.textureArray[e++] = s + 1;
        for (let l = 0; l < 4; l++)
          this.foregroundDataView.setUint32(t, o.fg, false), this.backgroundDataView.setUint32(t, o.bg, false), t += 4;
        o.dirty = false;
      }
  }
  isKeyDown(e) {
    return this.keys.getKey(e).down;
  }
  isKeyPressed(e) {
    return this.keys.getKey(e).isPressed();
  }
  getKeyDownCount(e) {
    return this.keys.getKey(e).downCount;
  }
  getMovementKey(e = _e) {
    for (let [t, r] of Object.entries(e))
      if (this.isKeyPressed(t))
        return r;
  }
  buildShader(e, t) {
    let r = this.gl, i = r.createShader(e);
    if (!i)
      throw new Error("An error occurred compiling the shader: ");
    if (r.shaderSource(i, t), r.compileShader(i), !r.getShaderParameter(i, r.COMPILE_STATUS))
      throw new Error("An error occurred compiling the shader: " + r.getShaderInfoLog(i));
    return i;
  }
  loadTexture(e) {
    let t = this.gl, r = t.createTexture();
    t.bindTexture(t.TEXTURE_2D, r);
    let i = 0, o = t.RGBA, n = 1, s = 1, l = 0, h = t.RGBA, u = t.UNSIGNED_BYTE, d = new Uint8Array([0, 0, 0, 255]);
    t.texImage2D(t.TEXTURE_2D, i, o, n, s, l, h, u, d);
    let b = new Image();
    return b.onload = () => {
      t.bindTexture(t.TEXTURE_2D, r), t.texImage2D(t.TEXTURE_2D, i, o, h, u, b), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST);
    }, b.src = e, r;
  }
  render() {
    let e = this.gl;
    e.clearColor(0, 0, 0, 1), e.clearDepth(1), e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT), this.crt ? e.bindFramebuffer(e.FRAMEBUFFER, this.frameBuffer) : e.bindFramebuffer(e.FRAMEBUFFER, null), e.viewport(0, 0, this.pixelWidth, this.pixelHeight);
    {
      let r = e.FLOAT, i = false, o = 0, n = 0;
      e.bindBuffer(e.ARRAY_BUFFER, this.positionBuffer), e.vertexAttribPointer(this.positionAttribLocation, 2, r, i, o, n);
    }
    {
      let r = e.FLOAT, i = false, o = 0, n = 0;
      e.bindBuffer(e.ARRAY_BUFFER, this.textureBuffer), e.bufferData(e.ARRAY_BUFFER, this.textureArray, e.DYNAMIC_DRAW), e.vertexAttribPointer(this.textureAttribLocation, 2, r, i, o, n);
    }
    {
      let r = e.UNSIGNED_BYTE, i = true, o = 0, n = 0;
      e.bindBuffer(e.ARRAY_BUFFER, this.foregroundBuffer), e.bufferData(e.ARRAY_BUFFER, this.foregroundUint8Array, e.DYNAMIC_DRAW), e.vertexAttribPointer(this.fgColorAttribLocation, 4, r, i, o, n);
    }
    {
      let r = e.UNSIGNED_BYTE, i = true, o = 0, n = 0;
      e.bindBuffer(e.ARRAY_BUFFER, this.backgroundBuffer), e.bufferData(e.ARRAY_BUFFER, this.backgroundUint8Array, e.DYNAMIC_DRAW), e.vertexAttribPointer(this.bgColorAttribLocation, 4, r, i, o, n);
    }
    e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indexBuffer), e.useProgram(this.program), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, this.texture);
    {
      let t = this.width * this.height * 6, r = e.UNSIGNED_SHORT;
      e.drawElements(e.TRIANGLES, t, r, 0);
    }
  }
  renderCrt() {
    let e = this.crt;
    if (!e)
      return;
    let t = this.gl;
    t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, this.pixelWidth * this.pixelScale, this.pixelHeight * this.pixelScale), t.useProgram(this.crtProgram), t.uniform1f(this.crtBlurLocation, e.blur), t.uniform1f(this.crtCurvatureLocation, e.curvature), t.uniform1f(this.crtChromaLocation, e.chroma), t.uniform1f(this.crtVignetteLocation, e.vignette), t.uniform1f(this.crtScanlineWidthLocation, e.scanlineWidth), t.uniform1f(this.crtScanlineIntensityLocation, e.scanlineIntensity), t.bindBuffer(t.ARRAY_BUFFER, this.crtPositionBuffer), t.vertexAttribPointer(this.crtPositionLocation, 2, t.FLOAT, false, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, this.crtTexCoordBuffer), t.vertexAttribPointer(this.crtTexCoordLocation, 2, t.FLOAT, false, 0, 0), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, this.frameBufferTexture), t.drawArrays(t.TRIANGLES, 0, 6);
  }
  requestAnimationFrame() {
    window.requestAnimationFrame((e) => this.renderLoop(e));
  }
  renderLoop(e) {
    this.lastRenderTime === 0 ? (this.lastRenderTime = e, this.fps = 0) : (this.renderDelta = e - this.lastRenderTime, this.lastRenderTime = e, this.fps = 1e3 / this.renderDelta, this.averageFps = 0.95 * this.averageFps + 0.05 * this.fps), this.keys.updateKeys(e), this.mouse.update(e), this.update && this.update(), this.flush(), this.render(), this.crt && this.renderCrt(), this.maxFps === void 0 && this.requestAnimationFrame();
  }
};

// src/AmorphousAreaGenerator.ts
var import_debug = __toESM(require_browser());
var import_deepcopy = __toESM(require_deepcopy());

// src/aagStuff.ts
var tileColours = {
  " ": "black",
  "#": "silver",
  "%": "charcoal",
  \u00DF: "silver blue",
  "\xA1": "silver blue",
  "\xA7": "silver blue",
  "\xB6": "silver blue",
  \u00DE: "silver blue",
  J: "charcoal",
  "~": "charcoal",
  ".": "charcoal",
  ":": "charcoal",
  "\u2022": "charcoal",
  ";": "charcoal",
  $: "white",
  "\xB0": "red",
  "\xAE": "red",
  \u00D8: "red",
  "\xB9": "silver green",
  "\xB2": "silver green",
  "\xB3": "silver green",
  "@": "white"
};
var tileDecorations = ["\xDF", "\xA1", "\xA7", "\xB6", "\xDE"];
var tileJunk = [
  " ",
  " ",
  " ",
  " ",
  ":",
  ":",
  ":",
  ":",
  ":",
  ":",
  "\u2022",
  "\u2022",
  ";",
  "\xB9",
  "\xB0",
  "\xB0"
];
var walls = ["%", "#"];
var dimNames = ["A", "B", "C", "D", "E", "F"];
var dimSizes = {
  A: [1, 1],
  B: [2, 1],
  C: [1, 2],
  D: [2, 2],
  E: [3, 1],
  F: [1, 3],
  V: [0, 0],
  W: [1, 1]
};
var areaWidth = 7;
var areaHeight = 5;
var areaBank = {
  A: [
    ["###J###", "#  J  #", "JJ   JJ", "#  J  #", "###J###"],
    ["##.J.##", "#..J..#", "JJ   JJ", "#..J...", "###J.##"],
    ["JJJJ##J", "J##  #J", "J#   #J", "J## ##J", "JJJJJJJ"],
    ["###J###", "#     #", "J  ~  J", "#     #", "###J###"],
    ["J#.JJ##", "J #.  #", "J ... J", "J #.  #", "J#.JJ##"],
    ["JJ#J#JJ", "### ###", "J     J", "###~###", "JJ###JJ"],
    ["JJJJJJJ", "J  ###J", "J### #J", "J#   #J", "JJJJJJJ"],
    ["###JJJJ", "#     J", "### ###", "J     #", "JJJJ###"],
    ["##JJJJJ", "# #   J", "J ####J", "#     #", "###J###"],
    ["J##J##J", "#\xD8    #", "J ::: J", "#    \xB2#", "J##J##J"],
    ["JJJJJJJ", "J##\xB0##J", "J##\xB0##J", "J##\xB0\xB0\xB0J", "JJJJJJJ"],
    ["J#JJJJJ", "J######", "J#    J", "J#### J", "JJJJ#JJ"],
    ["J##J##J", "J#~ ~#J", "J     J", "J#~  #J", "J##J##J"],
    ["##%J###", "#%  #.#", "J     J", "#     %", "###J#%#"],
    ["###J%%%", "#   % #", "J  %  J", "%%%   #", "%##J###"]
  ],
  C: [
    [
      "###J###",
      "#     #",
      "J     J",
      "#     #",
      "#     #",
      "#     #",
      "#     #",
      "J     J",
      "#     #",
      "###J###"
    ],
    [
      "###J###",
      "# # # J",
      "J # # J",
      "J # # J",
      "J # # J",
      "J # # J",
      "J # # J",
      "J ### J",
      "#     J",
      "###JJJJ"
    ],
    [
      "###JJJJ",
      "###   J",
      "J     J",
      "#     #",
      "# #   #",
      "# #####",
      "# #####",
      "J     J",
      "# #   J",
      "###JJJJ"
    ],
    [
      "###J###",
      "#     #",
      "J     J",
      "#  %%%#",
      "#  \xAE~%#",
      "#   \xAE%#",
      "#  % %#",
      "J     J",
      "#     #",
      "###J###"
    ],
    [
      "###J###",
      "#     #",
      "J ### J",
      "# #~# #",
      "#     #",
      "#   \xAE #",
      "##   ##",
      "J     J",
      "#~# #~#",
      "###J###"
    ],
    [
      "###J###",
      "#     #",
      "J     J",
      "##### #",
      "J   # #",
      "J   # #",
      "##### #",
      "J     J",
      "#     #",
      "###J###"
    ],
    [
      "###J###",
      "#     #",
      "J     J",
      "# # # #",
      "J     J",
      "J     J",
      "# # # #",
      "J     J",
      "#     #",
      "###J###"
    ],
    [
      "##JJJ##",
      "# # # #",
      "J # # J",
      "# # # J",
      "# . #\xB9#",
      "# #####",
      "# #   #",
      "J #~  J",
      "# #   #",
      "#######"
    ],
    [
      "JJJJ###",
      "J    ##",
      "J    #J",
      "#....##",
      "#     #",
      "#~#   #",
      "###   #",
      "J#    J",
      "##    J",
      "###JJJJ"
    ],
    [
      "JJ#J#JJ",
      "### ###",
      "J     J",
      "##  ~##",
      "J#   #J",
      "J#   #J",
      "##\xB0  ##",
      "J     J",
      "### ###",
      "JJ#J#JJ"
    ]
  ],
  B: [
    [
      "###J######J###",
      "#            #",
      "J            J",
      "#            #",
      "###J######J###"
    ],
    [
      "........##J###",
      "#......#     #",
      "JJ....#      J",
      "#....#       #",
      "....######J###"
    ],
    [
      "###J#JJJJ#J###",
      "# ~ #    # ..#",
      "J   #    #.. J",
      "# ~ #    #.. #",
      "###J#JJJJ#J###"
    ],
    [
      "###J######J###",
      "#\xB0\xB0\xB0#        #",
      "J\xB0\xB0#         J",
      "###        ###",
      "###J######J#JJ"
    ],
    [
      "JJJJ######JJJJ",
      "J            J",
      "J            J",
      "### ####\xB9#   J",
      "###J######JJJJ"
    ],
    [
      "###J######J###",
      "#      #~# #~#",
      "J            J",
      "#            #",
      "###J######J###"
    ],
    [
      "###J######J###",
      "#            #",
      "#  ~   ~     J",
      "#            #",
      "##########J###"
    ],
    [
      "JJJJ##########",
      "J   #  #  #  #",
      "J   #  #  #  #",
      "J  ##  #  #  #",
      "JJJJJJJ#JJ#JJJ"
    ],
    [
      "###J######J#JJ",
      "#          # J",
      "J         #  J",
      "#        #   J",
      "###J#####JJJJJ"
    ],
    [
      "JJJJJJJJJJJJJJ",
      "#        ... #",
      "#      ......#",
      "# ############",
      "JJJJJJJJJJJJJJ"
    ],
    [
      "####JJ####J###",
      "J  #  #      #",
      "J###  #      J",
      "#     #      #",
      "JJJJJJ####J###"
    ],
    [
      "###J......J###",
      "#            #",
      "J \xB0 \xB0 \xB0\xB0 \xB0 \xB0 J",
      "#            #",
      "###J......J###"
    ]
  ],
  D: [
    [
      "###J######J###",
      "#            #",
      "J            J",
      "#            #",
      "#            #",
      "#            #",
      "#            #",
      "J            J",
      "#            #",
      "###J######J###"
    ],
    [
      "###JJJJJJJJ###",
      "#            #",
      "J       #    J",
      "J   ....#.   J",
      "J ###########J",
      "J  # ...#... J",
      "J  # ...#.   J",
      "J  #   .#    J",
      "#       #    #",
      "###JJJJJJJJ###"
    ],
    [
      "###J######J###",
      "#      #     #",
      "J      #     J",
      "#     ##     #",
      "#            #",
      "#         ####",
      "# ###     #  #",
      "J   #        J",
      "#            #",
      "###J######J###"
    ],
    [
      "JJJJ######JJJJ",
      "J            J",
      "J #####....  J",
      "# #   #####  J",
      "# ##      ####",
      "#  #         #",
      "#  #       ###",
      "J  #   ##### J",
      "J  #.###     J",
      "JJJJJJJJJJJJJJ"
    ],
    [
      "##########JJJJ",
      "#     ..  #  J",
      "# .   ...  # J",
      "# .         #J",
      "# ## \xD8 ...   #",
      "# #~    ..   #",
      "# ##~#       #",
      "#  ###  .    J",
      "#     ...    #",
      "##########J###"
    ],
    [
      "JJJJJJJJJJJJJJ",
      "J  ##        J",
      "J  ##        J",
      "J## #        J",
      "J###.##      J",
      "J  #...##    J",
      "J   #....#   J",
      "J  #.#....#  J",
      "J  ## #### ##J",
      "JJJJJJJJJJJJJJ"
    ],
    [
      "###J######J###",
      "#%%J%%%%%%J%##",
      "JJJ#\xAE\xAE\xAE\xAE\xAE\xAE#JJJ",
      "#%%\xAE\xAE%%\xAE\xAE\xAE\xAE%%#",
      "#%\xAE\xAE\xAE  %\xAE\xAE\xAE\xAE%#",
      "#%\xAE\xAE\xAE \xB3%\xAE\xAE\xAE\xAE%#",
      "#%%\xAE\xAE%%\xAE\xAE\xAE\xAE% #",
      "JJ %\xAE\xAE\xAE\xAE\xAE\xAE% JJ",
      "#  J%%%%%%J  #",
      "###J######J###"
    ]
  ],
  E: [
    [
      "%J%J######JJJJJJJJ%%%",
      "%J%      #       %  %",
      "##%%%%%  #       %  J",
      "#                %  %",
      "###J######JJJJJJJJ%%%"
    ],
    [
      "###J######J######J###",
      "#                   #",
      "J                   J",
      "#                   #",
      "###J######J######J###"
    ],
    [
      "###J##.........##J###",
      "#      .......      #",
      "J     ..  ....      J",
      "#   ....   .....  ..#",
      "###J######J######J###"
    ],
    [
      "###JJJJJJJJ######J###",
      "#              ~#   #",
      "J          ######   J",
      "#                   #",
      "###J######J######J###"
    ],
    [
      "JJ#JJJJJ##JJJJ###JJ#J",
      "J #   # #     # #   J",
      "J #####         ####J",
      "J   #   #     #     J",
      "JJJJ#JJJ##JJJJ###JJ##"
    ],
    [
      "###J######J######J###",
      "#      #   #    ###\xB0#",
      "J  \xB0  #~   #        J",
      "# ###  #\xB2  # \xB0      #",
      "###J######J######J###"
    ],
    [
      "###J#JJJJJJJJJJJ#J###",
      "#    #         #    #",
      "J     #       # #   J",
      "#      #     #   #  #",
      "###JJJJJ##J##JJJJJ###"
    ],
    [
      "###J%%%%%%J%%%%%%J###",
      "#   %\xAE\xAE\xAE\xAE% #\xAE\xAE\xAE\xAE%   #",
      "J   % \xAE\xAE\xAE% % \xB2\xAE\xAE%   J",
      "#   # \xB2\xAE\xAE% %\xAE\xAE\xAE\xAE%   #",
      "###J%%%%%%J%%%%%%J###"
    ],
    [
      "###J######J######J###",
      "#       ~#J#~  \xB0.J..#",
      "J             \xB0\xB0\xB0..JJ",
      "#               #J#.#",
      "###J######J######J###"
    ]
  ],
  F: [
    [
      "###J###",
      "#     #",
      "J     J",
      "#     #",
      "#     #",
      "#     #",
      "#     #",
      "J     J",
      "#     #",
      "#     #",
      "#     #",
      "#     #",
      "J     J",
      "#     #",
      "###J###"
    ],
    [
      "JJJJJJJ",
      "J     J",
      "J     J",
      "J.    J",
      "J..   J",
      "J ..  J",
      "J  .. J",
      "J   ..J",
      "J    .#",
      "J    ##",
      "J   # #",
      "J  #  #",
      "J #   J",
      "J~    #",
      "###J###"
    ],
    [
      "#JJJJJ#",
      "#.....#",
      "J     J",
      "#.....#",
      "#     #",
      "#.....#",
      "#     #",
      "#     J",
      "#     #",
      "#.....#",
      "#     #",
      "#.....#",
      "J     #",
      "#     #",
      "#######"
    ],
    [
      "###J###",
      "#~    #",
      "J     J",
      "#  # .#",
      "#  # .#",
      "#    .#",
      "#    .#",
      "J    .J",
      "# # #.#",
      "#    .#",
      "# ###.J",
      "J   #.J",
      "J   #.J",
      "J   #.J",
      "JJJJ##J"
    ],
    [
      "JJJJJJJ",
      "J#### J",
      "J#\xB0\xB0# J",
      "J#\xB0   J",
      "J#### J",
      "J     J",
      "J ####J",
      "J #\xB0  J",
      "J #\xB0\xB0#J",
      "J ####J",
      "J     J",
      "J# ## J",
      "J# \xB0# J",
      "J#\xB0\xB0# J",
      "J####JJ"
    ],
    [
      "###JJJJ",
      "#     J",
      "##    J",
      "J#### #",
      "J##   #",
      "J#    #",
      "##    #",
      "J     J",
      "#  ####",
      "# ###JJ",
      "#   #JJ",
      "#   ###",
      "J     J",
      "J     #",
      "JJJJ###"
    ],
    [
      "JJJJ###",
      "J  #  #",
      "J #   J",
      "# ### #",
      "#...# #",
      "#..#  #",
      "###  ##",
      "J   # J",
      "#   # #",
      "J#  # #",
      "J # # #",
      "### # #",
      "J   # J",
      "J    ##",
      "JJJJJJJ"
    ],
    [
      "%%%#%%%",
      "%\xB0 \xB0 \xB0%",
      "# \xB0 \xB0 #",
      "%\xB0 \xB0 \xB0%",
      "% \xB0 \xB0 %",
      "%\xB0 \xB0 \xB0%",
      "% \xB0 \xB0 %",
      "#\xB0 \xB0 \xB0#",
      "% \xB0 \xB0 %",
      "%\xB0 \xB0 \xB0%",
      "% \xB0 \xB0 %",
      "%\xB0 \xB0 \xB0%",
      "# \xB0 \xB0 #",
      "%\xB0 \xB0 \xB0%",
      "%%%#%%%"
    ]
  ],
  V: [["JJJJJJJ", "J     J", "J     J", "J     J", "JJJJJJJ"]],
  W: [
    ["JJJJJJJ", "J  ## J", "J  #. J", "J  .  J", "JJJJJJJ"],
    ["JJJJJJJ", "J.    J", "J...  J", "J.    J", "J.JJJJJ"],
    ["JJ.JJJJ", "J   ..J", "J #   J", "J   #~#", "JJJJ###"],
    ["JJ####J", "J #   J", "J##   J", "J .   J", "JJ#JJJJ"],
    ["JJJJJJJ", "J  .  J", "J  .. J", "J.. ..J", "JJJJJJJ"],
    ["JJJJJJJ", ".  ###J", ".     J", ".. J  J", "...J.JJ"],
    ["JJ#JJJJ", "J #   J", "J # # J", "J.#.###", "JJJJJJJ"],
    ["JJJJJ#.", "J#...##", "J.   .J", "J.   #J", "J#JJJJJ"],
    ["J#JJJJJ", "J#    J", "J#    J", "J#.....", "JJJJJJJ"],
    ["JJJJJ.J", "J     J", "J.    J", "..   #J", "J.JJJ.J"],
    ["JJ####J", "J #   J", "J##   J", "J .   J", "JJ#JJJJ"],
    ["JJJJJJJ", "J  .  J", "J  .. J", "J.. ..J", "JJJJJJJ"],
    ["JJJJJJJ", ".  ###J", ".     J", ".. J  J", "...J.JJ"],
    ["JJ#JJJJ", "J #   J", "J # # J", "J.#.###", "JJJJJJJ"],
    ["JJJJJ#.", "J#...##", "J.   .J", "J.   #J", "J#JJJJJ"],
    ["J#JJJJJ", "J#    J", "J#    J", "J#.....", "JJJJJJJ"],
    ["JJJJJ.J", "J     J", "J.    J", "..   #J", "J.JJJ.J"],
    ["...JJJJ", "....  J", "..... J", "......J", "......."],
    ["JJ..JJJ", "J#..# J", "J .# .J", "J   ..J", "JJJ####"],
    ["##JJJJ#", "J ..  J", "J ..  J", "#    ##", "#JJJJ##"],
    ["JJ#JJJJ", "J.... J", "J   . J", "J#    J", "JJJJJJJ"],
    ["...JJJJ", "....  J", "..... J", "......J", "......."],
    ["JJ..JJJ", "J#..# J", "J .# .J", "J   ..J", "JJJ####"],
    ["##JJJJ#", "J ..  J", "J ..  J", "#    ##", "#JJJJ##"],
    ["JJ#JJJJ", "J.... J", "J   . J", "J#    J", "JJJJJJJ"],
    ["J#JJJJJ", "J #   J", "J  ~  J", "J   # J", "JJJJJ#J"],
    ["JJJJJJJ", "J# .  J", "J \xD8   J", "J# #  J", "JJJJJJJ"],
    ["JJJJJJJ", "J%%%%%J", "J%\xAE\xAE\xAE#J", "J%%%%#J", "JJJJJJJ"],
    ["JJJJJJJ", "####  J", "#     J", "J     J", "JJJJJJJ"],
    ["JJJJJJJ", "J ... J", "J. \xB2 .J", "J.....J", "JJJJJJJ"],
    ["#J#J#JJ", "#J J  J", "J    .J", "J  . ..", "JJ....."],
    ["J.....J", "J   . J", "J  .  J", "J .   J", "J.....J"],
    ["#J#J#JJ", "#J J  J", "J    .J", "J  . ..", "JJ....."],
    ["J.....J", "J   . J", "J  .  J", "J .   J", "J.....J"],
    ["J~~~~~J", "J   ~ J", "J  ~  J", "J ~   J", "J~~~~~J"],
    ["#J#J#JJ", "#J\xB0J  J", "J     J", "J  J\xB0J#", "JJ#J#J#"],
    [".......", ". ..  .", ". .   .", ".     .", "......."],
    ["JJJJJJJ", "J%.   J", "J..   J", "J     J", "JJJJJJJ"],
    ["###JJJJ", "J ....J", "J .   J", "J .   #", "JJ.JJJ#"],
    ["JJ...JJ", "... ...", "J ... J", "J  .  J", "J.....J"],
    ["###JJJJ", "J ....J", "J .   J", "J .   #", "JJ.JJJ#"],
    ["JJ...JJ", "... ...", "J ... J", "J  .  J", "J.....J"],
    ["JJJJJJJ", "J   \xB0 J", "J   \xAE J", "J \xB0   J", "JJJJJJJ"],
    ["JJJ\xB9JJJ", "\xB9     \xB9", "J     J", "J     J", "J\xB9JJJ\xB9J"],
    [".#JJJ#.", "##   ##", "J     J", "J     J", ".JJJJJJ"],
    ["JJJJJJJ", "###   J", "JJ    J", "#  ####", "JJJJJJJ"],
    ["JJJJJJJ", "J  ## J", "J  #. J", "J  .  J", "JJJJJJJ"],
    ["JJJJJJJ", "J.    J", "J...  J", "J.    J", "J.JJJJJ"],
    ["JJ.JJJJ", "J   ..J", "J #   J", "J   #~#", "JJJJ###"],
    ["JJ####J", "J #   J", "J##   J", "J .   J", "JJ#JJJJ"],
    ["JJJJJJJ", "J  .  J", "J  .. J", "J.. ..J", "JJJJJJJ"],
    ["JJJJJJJ", ".  ###J", ".     J", ".. J  J", "...J.JJ"],
    ["JJ#JJJJ", "J #   J", "J # # J", "J.#.###", "JJJJJJJ"],
    ["JJJJJ#.", "J#...##", "J.   .J", "J.   #J", "J#JJJJJ"],
    ["J#JJJJJ", "J#    J", "J#    J", "J#.....", "JJJJJJJ"],
    ["JJJJJ.J", "J     J", "J.    J", "..   #J", "J.JJJ.J"],
    ["JJ####J", "J #   J", "J##   J", "J .   J", "JJ#JJJJ"],
    ["JJJJJJJ", "J  .  J", "J  .. J", "J.. ..J", "JJJJJJJ"],
    ["JJJJJJJ", ".  ###J", ".     J", ".. J  J", "...J.JJ"],
    ["JJ#JJJJ", "J #   J", "J # # J", "J.#.###", "JJJJJJJ"],
    ["JJJJJ#.", "J#...##", "J.   .J", "J.   #J", "J#JJJJJ"],
    ["J#JJJJJ", "J#    J", "J#    J", "J#.....", "JJJJJJJ"],
    ["JJJJJ.J", "J     J", "J.    J", "..   #J", "J.JJJ.J"],
    ["...JJJJ", "....  J", "..... J", "......J", "......."],
    ["JJ..JJJ", "J#..# J", "J .# .J", "J   ..J", "JJJ####"],
    ["##JJJJ#", "J ..  J", "J ..  J", "#    ##", "#JJJJ##"],
    ["JJ#JJJJ", "J.... J", "J   . J", "J#    J", "JJJJJJJ"],
    ["...JJJJ", "....  J", "..... J", "......J", "......."],
    ["JJ..JJJ", "J#..# J", "J .# .J", "J   ..J", "JJJ####"],
    ["##JJJJ#", "J ..  J", "J ..  J", "#    ##", "#JJJJ##"],
    ["JJ#JJJJ", "J.... J", "J   . J", "J#    J", "JJJJJJJ"],
    ["JJJJJJJ", "####  J", "#     J", "J     J", "JJJJJJJ"],
    ["#J#J#JJ", "#J J  J", "J    .J", "J  . ..", "JJ....."],
    ["J.....J", "J   . J", "J  .  J", "J .   J", "J.....J"],
    ["#J#J#JJ", "#J J  J", "J    .J", "J  . ..", "JJ....."],
    ["J.....J", "J   . J", "J  .  J", "J .   J", "J.....J"],
    [".......", ". ..  .", ". .   .", ".     .", "......."],
    ["###JJJJ", "J ....J", "J .   J", "J .   #", "JJ.JJJ#"],
    ["JJ...JJ", "... ...", "J ... J", "J  .  J", "J.....J"],
    ["###JJJJ", "J ....J", "J .   J", "J .   #", "JJ.JJJ#"],
    ["JJ...JJ", "... ...", "J ... J", "J  .  J", "J.....J"],
    [".#JJJ#.", "##   ##", "J     J", "J     J", ".JJJJJJ"],
    ["JJJJJJJ", "###   J", "JJ    J", "#  ####", "JJJJJJJ"],
    ["JJJJJJJ", "J  ## J", "J  #. J", "J  .  J", "JJJJJJJ"],
    ["JJJJJJJ", "J.    J", "J...  J", "J.    J", "J.JJJJJ"],
    ["JJ.JJJJ", "J   ..J", "J #   J", "J   #~#", "JJJJ###"],
    ["JJ####J", "J #   J", "J##   J", "J .   J", "JJ#JJJJ"],
    ["JJJJJJJ", "J  .  J", "J  .. J", "J.. ..J", "JJJJJJJ"],
    ["JJJJJJJ", ".  ###J", ".     J", ".. J  J", "...J.JJ"],
    ["JJ#JJJJ", "J #   J", "J # # J", "J.#.###", "JJJJJJJ"],
    ["JJJJJ#.", "J#...##", "J.   .J", "J.   #J", "J#JJJJJ"],
    ["J#JJJJJ", "J#    J", "J#    J", "J#.....", "JJJJJJJ"],
    ["JJJJJ.J", "J     J", "J.    J", "..   #J", "J.JJJ.J"],
    ["JJ####J", "J #   J", "J##   J", "J .   J", "JJ#JJJJ"],
    ["JJJJJJJ", "J  .  J", "J  .. J", "J.. ..J", "JJJJJJJ"],
    ["JJJJJJJ", ".  ###J", ".     J", ".. J  J", "...J.JJ"],
    ["JJ#JJJJ", "J #   J", "J # # J", "J.#.###", "JJJJJJJ"],
    ["JJJJJ#.", "J#...##", "J.   .J", "J.   #J", "J#JJJJJ"],
    ["J#JJJJJ", "J#    J", "J#    J", "J#.....", "JJJJJJJ"],
    ["JJJJJ.J", "J     J", "J.    J", "..   #J", "J.JJJ.J"],
    ["...JJJJ", "....  J", "..... J", "......J", "......."],
    ["JJ..JJJ", "J#..# J", "J .# .J", "J   ..J", "JJJ####"],
    ["##JJJJ#", "J ..  J", "J ..  J", "#    ##", "#JJJJ##"],
    ["JJ#JJJJ", "J.... J", "J   . J", "J#    J", "JJJJJJJ"],
    ["...JJJJ", "....  J", "..... J", "......J", "......."],
    ["JJ..JJJ", "J#..# J", "J .# .J", "J   ..J", "JJJ####"],
    ["##JJJJ#", "J ..  J", "J ..  J", "#    ##", "#JJJJ##"],
    ["JJ#JJJJ", "J.... J", "J   . J", "J#    J", "JJJJJJJ"],
    ["J#JJJJJ", "J #   J", "J  ~  J", "J   # J", "JJJJJ#J"],
    ["JJJJJJJ", "J# .  J", "J \xD8   J", "J# #  J", "JJJJJJJ"],
    ["JJJJJJJ", "J%%%%%J", "J%\xAE\xAE\xAE#J", "J%%%%#J", "JJJJJJJ"],
    ["JJJJJJJ", "####  J", "#     J", "J     J", "JJJJJJJ"],
    ["JJJJJJJ", "J ... J", "J. \xB2 .J", "J.....J", "JJJJJJJ"],
    ["#J#J#JJ", "#J J  J", "J    .J", "J  . ..", "JJ....."],
    ["J.....J", "J   . J", "J  .  J", "J .   J", "J.....J"],
    ["#J#J#JJ", "#J J  J", "J    .J", "J  . ..", "JJ....."],
    ["J.....J", "J   . J", "J  .  J", "J .   J", "J.....J"],
    ["J~~~~~J", "J   ~ J", "J  ~  J", "J ~   J", "J~~~~~J"],
    ["#J#J#JJ", "#J\xB0J  J", "J     J", "J  J\xB0J#", "JJ#J#J#"],
    [".......", ". ..  .", ". .   .", ".     .", "......."],
    ["JJJJJJJ", "J%.   J", "J..   J", "J     J", "JJJJJJJ"],
    ["###JJJJ", "J ....J", "J .   J", "J .   #", "JJ.JJJ#"],
    ["JJ...JJ", "... ...", "J ... J", "J  .  J", "J.....J"],
    ["###JJJJ", "J ....J", "J .   J", "J .   #", "JJ.JJJ#"],
    ["JJ...JJ", "... ...", "J ... J", "J  .  J", "J.....J"],
    ["JJJJJJJ", "J   \xB0 J", "J   \xAE J", "J \xB0   J", "JJJJJJJ"],
    ["JJJ\xB9JJJ", "\xB9     \xB9", "J     J", "J     J", "J\xB9JJJ\xB9J"],
    [".#JJJ#.", "##   ##", "J     J", "J     J", ".JJJJJJ"],
    ["JJJJJJJ", "###   J", "JJ    J", "#  ####", "JJJJJJJ"],
    ["JJJJJJJ", "J  ## J", "J  #. J", "J  .  J", "JJJJJJJ"],
    ["JJJJJJJ", "J.    J", "J...  J", "J.    J", "J.JJJJJ"],
    ["JJ.JJJJ", "J   ..J", "J #   J", "J   #~#", "JJJJ###"],
    ["JJ####J", "J #   J", "J##   J", "J .   J", "JJ#JJJJ"],
    ["JJJJJJJ", "J  .  J", "J  .. J", "J.. ..J", "JJJJJJJ"],
    ["JJJJJJJ", ".  ###J", ".     J", ".. J  J", "...J.JJ"],
    ["JJ#JJJJ", "J #   J", "J # # J", "J.#.###", "JJJJJJJ"],
    ["JJJJJ#.", "J#...##", "J.   .J", "J.   #J", "J#JJJJJ"],
    ["J#JJJJJ", "J#    J", "J#    J", "J#.....", "JJJJJJJ"],
    ["JJJJJ.J", "J     J", "J.    J", "..   #J", "J.JJJ.J"],
    ["JJ####J", "J #   J", "J##   J", "J .   J", "JJ#JJJJ"],
    ["JJJJJJJ", "J  .  J", "J  .. J", "J.. ..J", "JJJJJJJ"],
    ["JJJJJJJ", ".  ###J", ".     J", ".. J  J", "...J.JJ"],
    ["JJ#JJJJ", "J #   J", "J # # J", "J.#.###", "JJJJJJJ"],
    ["JJJJJ#.", "J#...##", "J.   .J", "J.   #J", "J#JJJJJ"],
    ["J#JJJJJ", "J#    J", "J#    J", "J#.....", "JJJJJJJ"],
    ["JJJJJ.J", "J     J", "J.    J", "..   #J", "J.JJJ.J"],
    ["...JJJJ", "....  J", "..... J", "......J", "......."],
    ["JJ..JJJ", "J#..# J", "J .# .J", "J   ..J", "JJJ####"],
    ["##JJJJ#", "J ..  J", "J ..  J", "#    ##", "#JJJJ##"],
    ["JJ#JJJJ", "J.... J", "J   . J", "J#    J", "JJJJJJJ"],
    ["...JJJJ", "....  J", "..... J", "......J", "......."],
    ["JJ..JJJ", "J#..# J", "J .# .J", "J   ..J", "JJJ####"],
    ["##JJJJ#", "J ..  J", "J ..  J", "#    ##", "#JJJJ##"],
    ["JJ#JJJJ", "J.... J", "J   . J", "J#    J", "JJJJJJJ"],
    ["JJJJJJJ", "####  J", "#     J", "J     J", "JJJJJJJ"],
    ["#J#J#JJ", "#J J  J", "J    .J", "J  . ..", "JJ....."],
    ["J.....J", "J   . J", "J  .  J", "J .   J", "J.....J"],
    ["#J#J#JJ", "#J J  J", "J    .J", "J  . ..", "JJ....."],
    ["J.....J", "J   . J", "J  .  J", "J .   J", "J.....J"],
    [".......", ". ..  .", ". .   .", ".     .", "......."],
    ["###JJJJ", "J ....J", "J .   J", "J .   #", "JJ.JJJ#"],
    ["JJ...JJ", "... ...", "J ... J", "J  .  J", "J.....J"],
    ["###JJJJ", "J ....J", "J .   J", "J .   #", "JJ.JJJ#"],
    ["JJ...JJ", "... ...", "J ... J", "J  .  J", "J.....J"],
    [".#JJJ#.", "##   ##", "J     J", "J     J", ".JJJJJJ"],
    ["JJJJJJJ", "###   J", "JJ    J", "#  ####", "JJJJJJJ"]
  ]
};

// src/formulae.ts
function sqrt(n) {
  return Math.floor(Math.sqrt(n));
}
function getMaxHP(stats) {
  return 40 + stats.body * sqrt(stats.level);
}
function getHPRegenChance(stats) {
  return sqrt(stats.body + stats.level);
}
function getHPRegenAmount(stats) {
  return Math.max(1, sqrt(stats.body));
}
function getMaxStamina(stats) {
  return stats.body;
}
var getStaminaRegenChance = getHPRegenChance;
function getStaminaRegenAmount(stats) {
  return Math.max(1, sqrt(getMaxStamina(stats)));
}
function getMaxMana(stats) {
  return stats.mind;
}
function getManaRegenChance(stats) {
  return sqrt(stats.mind + stats.level);
}
function getManaRegenAmount(stats) {
  return Math.max(1, sqrt(getMaxMana(stats)));
}
function getHitChance(attacker, target) {
  const accuracy = 0;
  const defence = 0;
  return 224 + accuracy - defence - target.spirit;
}
function getHitDamage(attacker, target) {
  const weapon = 0;
  const damage = 0;
  const reduction = 0;
  return weapon + damage + sqrt(attacker.body) - reduction;
}
function getAllTheStats(me2, them) {
  return {
    MaxHP: getMaxHP(me2),
    HPRegenChance: getHPRegenChance(me2),
    HPRegenAmount: getHPRegenAmount(me2),
    MaxStamina: getMaxStamina(me2),
    StaminaRegenChance: getStaminaRegenChance(me2),
    StaminaRegenAmount: getStaminaRegenAmount(me2),
    MaxMana: getMaxMana(me2),
    ManaRegenChance: getManaRegenChance(me2),
    ManaRegenAmount: getManaRegenAmount(me2),
    HitChance: getHitChance(me2, them),
    HitDamage: getHitDamage(me2, them)
  };
}

// src/Grid.ts
var Grid = class _Grid {
  constructor(width, height, fn) {
    this.width = width;
    this.height = height;
    const rows = [];
    for (let y2 = 0; y2 < height; y2++) {
      const row = [];
      for (let x = 0; x < width; x++)
        row.push(fn(x, y2));
      rows.push(row);
    }
    this.cells = rows;
  }
  contains(x, y2) {
    return x >= 0 && x < this.width && y2 >= 0 && y2 < this.height;
  }
  get(x, y2) {
    return this.cells[y2][x];
  }
  set(x, y2, cell) {
    this.cells[y2][x] = cell;
  }
  paste(sx, sy, grid) {
    for (let x = 0; x < grid.width; x++) {
      for (let y2 = 0; y2 < grid.height; y2++) {
        this.set(sx + x, sy + y2, grid.get(x, y2));
      }
    }
  }
  setHLine(x1, x2, y2, fn) {
    for (let x = x1; x <= x2; x++)
      this.cells[y2][x] = fn(x, y2);
  }
  setVLine(x, y1, y2, fn) {
    for (let y3 = y1; y3 <= y2; y3++)
      this.cells[y3][x] = fn(x, y3);
  }
  carve(x, y2, w2, h, border, inside) {
    for (let i = 0; i < w2; i++) {
      const iBorder = i === 0 || i === w2 - 1;
      for (let j2 = 0; j2 < h; j2++) {
        const jBorder = j2 === 0 || j2 === h - 1;
        this.set(x + i, y2 + j2, iBorder || jBorder ? border : inside);
      }
    }
  }
  expand(x, y2, fn) {
    return new _Grid(this.width + x, this.height + y2, fn);
  }
  flipH() {
    const w2 = this.width - 1;
    return new _Grid(this.width, this.height, (x, y2) => this.get(w2 - x, y2));
  }
  flipV() {
    const h = this.height - 1;
    return new _Grid(this.width, this.height, (x, y2) => this.get(x, h - y2));
  }
  toString(fn) {
    let grid = "";
    for (let y2 = 0; y2 < this.height; y2++) {
      for (let x = 0; x < this.width; x++) {
        grid += fn(this.get(x, y2), x, y2);
      }
      grid += "\n";
    }
    return grid;
  }
  forEach(fn) {
    for (let y2 = 0; y2 < this.height; y2++) {
      for (let x = 0; x < this.width; x++) {
        fn(this.get(x, y2), x, y2);
      }
    }
  }
};

// src/GameMap.ts
var GameMap = class extends Grid {
  isBlocked(x, y2) {
    if (!this.contains(x, y2))
      return true;
    return this.get(x, y2).blocks;
  }
};

// src/AmorphousAreaGenerator.ts
var times = (count, fn) => {
  const results = [];
  for (let i = 0; i < count; i++)
    results.push(fn(i));
  return results;
};
var adjacentOffsets = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
];
var AmorphousAreaGenerator = class {
  constructor(g2, floorLevel) {
    this.g = g2;
    this.floorLevel = floorLevel;
    this.debug = (0, import_debug.default)("aag");
    this.decor = times(3, () => g2.choose(tileDecorations));
    this.floorPlan = new Grid(5, 5, () => "V");
    const tries = g2.rng.randRange(4, 48);
    for (let n = 0; n < tries; n++) {
      const extendX = this.floorPlan.width;
      const extendY = this.floorPlan.height;
      let targetX = g2.rng.randRange(0, extendX - 1);
      let targetY = g2.rng.randRange(0, extendY - 1);
      if (n === 0) {
        targetX = 0;
        targetY = 0;
      }
      const roomCode = g2.choose(dimNames);
      const [width, height] = dimSizes[roomCode];
      this.emptyCheck(targetX, targetY, width, height, roomCode, true);
      this.expandPlan(extendX, extendY);
    }
    this.wasteland();
    this.simplePlan();
    this.areaBank = (0, import_deepcopy.default)(areaBank);
    this.pickRooms();
    this.map = new GameMap(this.tiles.width, this.tiles.height, (x, y2) => {
      const glyph = this.tiles.get(x, y2);
      const opaque = walls.includes(glyph);
      const blocks = opaque;
      const name = tileColours[glyph] || "white";
      const colour = g2.palette[name];
      return { glyph, colour, opaque, blocks };
    });
  }
  emptyCheck(xt, yt, xw, yw, rc, draw = false) {
    let out = true;
    const points = [];
    for (let y2 = 0; y2 < yw; y2++) {
      if (yt + y2 < this.floorPlan.height) {
        for (let x = 0; x < xw; x++) {
          if (xt + x < this.floorPlan.width) {
            points.push([xt + x, yt + y2]);
            if (this.floorPlan.get(xt + x, yt + y2) !== "V") {
              out = false;
            }
          } else {
            out = false;
          }
        }
      } else {
        out = false;
      }
    }
    if (draw && out) {
      let first = true;
      for (const [x, y2] of points) {
        const char = first ? rc : "X";
        this.floorPlan.set(x, y2, char);
        first = false;
      }
    }
    return out;
  }
  expandPlan(xt, yt) {
    let expandUp = false, expandDown = false, expandLeft = false, expandRight = false;
    for (let n = 0; n < xt; n++) {
      if (this.floorPlan.get(n, 0) !== "V")
        expandUp = true;
      if (this.floorPlan.get(n, yt - 1) !== "V")
        expandDown = true;
    }
    for (let n = 0; n < yt; n++) {
      if (this.floorPlan.get(0, n) !== "V")
        expandLeft = true;
      if (this.floorPlan.get(xt - 1, n) !== "V")
        expandRight = true;
    }
    const { width, height } = this.floorPlan;
    if (expandUp)
      this.floorPlan = this.floorPlan.expand(
        0,
        1,
        (x, y2) => y2 === 0 ? "V" : this.floorPlan.get(x, y2 - 1)
      );
    if (expandDown)
      this.floorPlan = this.floorPlan.expand(
        0,
        1,
        (x, y2) => y2 === height ? "V" : this.floorPlan.get(x, y2)
      );
    if (expandLeft)
      this.floorPlan.expand(
        1,
        0,
        (x, y2) => x === 0 ? "V" : this.floorPlan.get(x - 1, y2)
      );
    if (expandRight)
      this.floorPlan.expand(
        1,
        0,
        (x, y2) => x === width ? "V" : this.floorPlan.get(x, y2)
      );
  }
  wasteland() {
    const points = [];
    for (let y2 = 0; y2 < this.floorPlan.height; y2++) {
      for (let x = 0; x < this.floorPlan.width; x++) {
        if (this.scanAround(this.floorPlan, x, y2, "V", [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "X"
        ]))
          points.push([x, y2]);
      }
    }
    for (const [x, y2] of points)
      this.floorPlan.set(x, y2, "W");
  }
  scanAround(fp, xt, yt, middle, lookFor) {
    let out = false;
    if (fp.get(xt, yt) === middle) {
      for (const [xo, yo] of adjacentOffsets) {
        const xn = xo + xt;
        const yn = yo + yt;
        if (fp.contains(xn, yn) && lookFor.includes(fp.get(xn, yn)))
          out = true;
      }
    }
    return out;
  }
  simplePlan() {
    this.debug(
      "simple plan",
      "\n" + this.floorPlan.toString((ch) => {
        if (ch === "V")
          return " ";
        if (ch === "W")
          return "_";
        return "#";
      })
    );
  }
  pickRooms() {
    let xtw = this.floorPlan.width * areaWidth;
    let ytw = this.floorPlan.height * areaHeight;
    this.tiles = new Grid(xtw, ytw, () => " ");
    this.floorPlan.forEach((plan, x, y2) => {
      if (plan !== "V" && plan !== "X")
        this.pasteRoom(x * areaWidth, y2 * areaHeight, plan);
    });
    const joins = [];
    for (let y2 = 0; y2 < ytw; y2++) {
      for (let x = 0; x < xtw; x++) {
        if (this.scanAround(this.tiles, x, y2, "J", ["J"]))
          joins.push([x, y2]);
      }
    }
    for (const [x, y2] of joins)
      this.tiles.set(x, y2, " ");
    this.tiles = this.tiles.expand(2, 2, (x, y2) => {
      const nx = x - 1;
      const ny = y2 - 1;
      return this.tiles.contains(nx, ny) ? this.tiles.get(nx, ny) : "%";
    });
    xtw += 2;
    ytw += 2;
    const empty = [];
    for (let y2 = 0; y2 < ytw; y2++) {
      for (let x = 0; x < xtw; x++) {
        if (this.scanAround(this.tiles, x, y2, " ", ["#"]))
          empty.push([x, y2]);
      }
    }
    const spawns = Math.min(
      empty.length,
      sqrt(
        xtw + ytw + this.floorLevel + this.g.rng.randRange(1, this.floorLevel)
      )
    );
    for (let n = 0; n < spawns; n++) {
      const index = this.g.rng.randRange(0, empty.length - 1);
      const [x, y2] = empty[index];
      empty.splice(index, 1);
      if (n === 0)
        this.player = [x, y2];
      else
        this.g.spawnRandomMonster(x, y2, this.floorLevel);
    }
    for (let y2 = 0; y2 < ytw; y2++) {
      for (let x = 0; x < xtw; x++) {
        let ch = this.tiles.get(x, y2);
        if (ch === "J")
          ch = this.g.choose(["~", "."]);
        if (ch === "~")
          this.tiles.set(x, y2, this.g.choose(this.decor));
        if (ch === ".")
          this.tiles.set(x, y2, this.g.choose(tileJunk));
      }
    }
  }
  pasteRoom(x, y2, plan) {
    const prints = this.areaBank[plan];
    const blueprint = this.g.choose(prints);
    const i = prints.indexOf(blueprint);
    prints.splice(i, 1);
    let room = new Grid(
      blueprint[0].length,
      blueprint.length,
      (x2, y3) => blueprint[y3][x2]
    );
    if (this.g.rng.bool())
      room = room.flipH();
    if (this.g.rng.bool())
      room = room.flipV();
    this.tiles.paste(x, y2, room);
  }
};

// node_modules/deep-object-diff/mjs/utils.js
var isDate = (d) => d instanceof Date;
var isEmpty = (o) => Object.keys(o).length === 0;
var isObject = (o) => o != null && typeof o === "object";
var hasOwnProperty = (o, ...args) => Object.prototype.hasOwnProperty.call(o, ...args);
var isEmptyObject = (o) => isObject(o) && isEmpty(o);
var makeObjectWithoutPrototype = () => /* @__PURE__ */ Object.create(null);

// node_modules/deep-object-diff/mjs/diff.js
var diff = (lhs, rhs) => {
  if (lhs === rhs)
    return {};
  if (!isObject(lhs) || !isObject(rhs))
    return rhs;
  const deletedValues = Object.keys(lhs).reduce((acc, key) => {
    if (!hasOwnProperty(rhs, key)) {
      acc[key] = void 0;
    }
    return acc;
  }, makeObjectWithoutPrototype());
  if (isDate(lhs) || isDate(rhs)) {
    if (lhs.valueOf() == rhs.valueOf())
      return {};
    return rhs;
  }
  return Object.keys(rhs).reduce((acc, key) => {
    if (!hasOwnProperty(lhs, key)) {
      acc[key] = rhs[key];
      return acc;
    }
    const difference = diff(lhs[key], rhs[key]);
    if (isEmptyObject(difference) && !isDate(difference) && (isEmptyObject(lhs[key]) || !isEmptyObject(rhs[key])))
      return acc;
    acc[key] = difference;
    return acc;
  }, deletedValues);
};
var diff_default = diff;

// src/ecs.ts
var import_deepcopy2 = __toESM(require_deepcopy());

// node_modules/nanoid/non-secure/index.js
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
var nanoid = (size = 21) => {
  let id = "";
  let i = size;
  while (i--) {
    id += urlAlphabet[Math.random() * 64 | 0];
  }
  return id;
};

// src/ecs.ts
var Component = class {
  constructor(name) {
    this.name = name;
    this.data = {};
  }
  add(en, data) {
    this.data[en.id] = data;
  }
  remove(en) {
    delete this.data[en.id];
  }
  get(en) {
    return this.data[en.id];
  }
};
var BaseEntity = class {
  constructor(ecs2, id, ...prefabs) {
    this.ecs = ecs2;
    this.id = id;
    this.components = /* @__PURE__ */ new Set();
    this.prefabs = [];
    for (const pf of prefabs) {
      const pfd = pf.data();
      for (const name in pfd) {
        this.add(ecs2.getComponent(name), pfd[name]);
      }
      this.prefabs.push(pf.id);
    }
  }
  add(component, data) {
    this.components.add(component);
    component.add(this, (0, import_deepcopy2.default)(data));
    this[component.name] = component.get(this);
    return this;
  }
  get(component) {
    return component.get(this);
  }
  has(component) {
    return this.components.has(component);
  }
  remove(component) {
    this.components.delete(component);
    component.remove(this);
    delete this[component.name];
  }
  data() {
    const data = {};
    for (const co of this.components)
      data[co.name] = co.get(this);
    return data;
  }
  diffData() {
    return diff_default(this.prefabData(), this.data());
  }
  prefabNames() {
    return this.prefabs;
  }
  prefabData() {
    return this.prefabs.reduce((accumulatedData, name) => {
      const prefabData = this.ecs.getPrefab(name).data();
      return { ...accumulatedData, ...prefabData };
    }, {});
  }
};
var Entity = class extends BaseEntity {
  constructor(ecs2, id, ...prefabs) {
    super(ecs2, id, ...prefabs);
    this.destroyed = false;
  }
  add(component, data) {
    super.add(component, data);
    this.ecs.update(this);
    return this;
  }
  remove(component) {
    super.remove(component);
    this.ecs.update(this);
  }
  destroy() {
    if (!this.destroyed) {
      for (const co of this.components)
        co.remove(this);
      this.ecs.remove(this);
      this.destroyed = true;
    }
  }
  serialise() {
    const { id, prefabs } = this;
    const overlay = this.diffData();
    return { id, prefabs, overlay };
  }
};
var Prefab = class extends BaseEntity {
};
var Manager = class {
  constructor() {
    this.components = {};
    this.entities = /* @__PURE__ */ new Map();
    this.idGenerator = () => nanoid();
    this.prefabs = {};
    this.queries = [];
  }
  clear() {
    const remove = this.remove.bind(this);
    this.entities.forEach(remove);
  }
  register(name) {
    const comp = new Component(name);
    this.components[name] = comp;
    return comp;
  }
  getEntity(id) {
    return this.entities.get(id);
  }
  getComponent(name) {
    const co = this.components[name];
    if (!co)
      throw `Unknown component: ${name}`;
    return co;
  }
  nextId() {
    return this.idGenerator();
  }
  entity(...prefabs) {
    const id = this.nextId();
    const en = new Entity(
      this,
      id,
      ...prefabs.map((name) => this.getPrefab(name))
    );
    return this.attach(en);
  }
  prefab(name, ...prefabs) {
    const pf = new Prefab(this, name, ...prefabs);
    this.prefabs[name] = pf;
    return pf;
  }
  getPrefab(name) {
    const pf = this.prefabs[name];
    if (!pf)
      throw `Unknown prefab: ${name}`;
    return pf;
  }
  attach(en) {
    this.entities.set(en.id, en);
    for (const q of this.queries)
      q.add(en);
    return en;
  }
  update(en) {
    for (const q of this.queries)
      q.add(en);
  }
  remove(en) {
    for (const q of this.queries)
      q.remove(en);
    this.entities.delete(en.id);
  }
  query({
    all,
    any,
    none
  } = {}, save = true) {
    const matchAll = all ? (en) => all.every((comp) => en.has(comp)) : () => true;
    const matchAny = any ? (en) => any.some((comp) => en.has(comp)) : () => true;
    const matchNone = none ? (en) => !none.some((comp) => en.has(comp)) : () => true;
    const query = new Query(
      Array.from(this.entities.values()),
      (en) => matchAny(en) && matchAll(en) && matchNone(en)
    );
    if (save)
      this.queries.push(query);
    return query;
  }
  find(options = {}) {
    return this.query(options, false).get();
  }
  serialise() {
    return Array.from(this.entities.values(), (e) => e.serialise());
  }
  restore(entities) {
    for (const { id, prefabs, overlay } of entities) {
      const e = new Entity(
        this,
        id,
        ...prefabs.map((name) => this.getPrefab(name))
      );
      for (const [componentName, data] of Object.entries(overlay))
        e.add(this.getComponent(componentName), data);
      this.attach(e);
    }
  }
};
var Query = class {
  constructor(initial, match) {
    this.match = match;
    this.entities = new Set(initial.filter(match));
  }
  add(en) {
    if (this.match(en))
      this.entities.add(en);
    else
      this.entities.delete(en);
  }
  remove(en) {
    this.entities.delete(en);
  }
  get() {
    return Array.from(this.entities);
  }
};
var ecs = new Manager();
var ecs_default = ecs;
window.ecs = ecs;

// src/components.ts
var AI = ecs_default.register("AI");
var Appearance = ecs_default.register("Appearance");
var Position = ecs_default.register("Position");
var Stats = ecs_default.register("Stats");
var PlayerTag = ecs_default.register("PlayerTag");

// res/all.category
var all_exports = {};
__export(all_exports, {
  default: () => all_default
});
var all_default = [{ logo: "a", name: "Awfs", desc: "Awfs are tiny humanoids who dwell in the hills surrounding Graydnmuch. Once almost feral, they've since learnt from the humans they scavenge from and have devised their own society, complete with religions and technology.", die: "The awf collapses with a wail.", drop: { JUNK: 85, TECH_CONSUMABLE: 35 }, tags: ["INTELLIGENT", "MUNDANE", "HUMANOID", "CHAOTIC", "NEUTRAL"], status: [], attack: [] }];

// import-glob:../res/*.category
var modules = [all_exports];
var __default = modules;

// res/awf.monster
var awf_exports = {};
__export(awf_exports, {
  default: () => awf_default
});
var awf_default = [{ cat: "a", col: "silver", name: "desperate awf", desc: "A little guy with a scarred turquoise body. He draws his cloak around himself and mutters.", level: 1, atts: [10, 9, 6], tags: ["SINGULAR"], status: [], attack: [], id: "awf_d" }, { cat: "a", col: "white", name: "mulnishel", desc: "This tiny awf has blindingly-white flesh and an anti-social scowl.", level: 2, atts: [7, 16, 7], tags: ["SINGULAR", "CAST_ONCE"], status: [], attack: [{ name: "hex", hp: 0, sp: 1, mp: 0, effects: [{ type: "DAMAGE", amount: 7 }, { type: "DOUBLE_DAMAGE", criterion: "LAWFUL" }] }], hname: "awfen hermit", weapon: "club_basic" }];

// import-glob:../res/*.monster
var modules2 = [awf_exports];
var __default2 = modules2;

// res/colours.palette
var colours_default = { black: 255, charcoal: 926365695, silver: -2021160961, white: -1, red: -15132161, "silver brown": -943233025, "silver purp": -814757889, "silver cyan": 1875363839, "silver green": 1875859455, "silver blue": 1869598719, dgreen: 13566207, green: 671033343, dblue: 117964799, blue: 926416895, dcyan: 664246271, cyan: 1207959551, dpurp: -1759012865, purp: -12058625, dyel: -1751701505, yel: -47105, dora: -1083241473, ora: -3336705 };

// src/resources.ts
function loadAllCategories() {
  return __default.flatMap(
    (x) => x.default
  );
}
function loadAllMonsters() {
  return __default2.flatMap((x) => x.default);
}
function loadPalette() {
  return colours_default;
}

// src/systems/DrawScreen.ts
var darken = (c2, mul = 0.25) => {
  const b = c2 >> 8 & 255;
  const g2 = c2 >> 16 & 255;
  const r = c2 >> 24 & 255;
  return c(Math.floor(r * mul), Math.floor(g2 * mul), Math.floor(b * mul));
};
var DrawScreen = class {
  constructor(g2) {
    this.g = g2;
    this.dirty = true;
    this.drawable = g2.ecs.query({ all: [Appearance, Position] });
    const redraw = () => this.dirty = true;
    g2.on("move", redraw);
    g2.on("scroll", redraw);
  }
  process() {
    if (!this.dirty)
      return;
    const { map, scrollX, scrollY, term } = this.g;
    term.clear();
    for (let yo = 0; yo < term.height; yo++) {
      const y2 = yo + scrollY;
      for (let xo = 0; xo < term.width; xo++) {
        const x = xo + scrollX;
        const c2 = term.getCell(xo, yo);
        if (c2?.explored && map.contains(x, y2)) {
          const tile = map.get(x, y2);
          let colour = tile.colour;
          if (!term.isVisible(xo, yo))
            colour = darken(colour);
          term.drawChar(xo, yo, tile.glyph, colour);
        }
      }
    }
    this.drawable.get().map((e) => {
      const app = e.get(Appearance);
      const pos = e.get(Position);
      const x = pos.x - scrollX;
      const y2 = pos.y - scrollY;
      if (term.isVisible(x, y2))
        term.drawChar(x, y2, app.glyph, app.colour);
    });
    this.dirty = false;
  }
};

// src/Tile.ts
var outOfBounds = {
  glyph: " ",
  colour: 0,
  blocks: true,
  opaque: true
};

// src/systems/PlayerFOV.ts
var PlayerFOV = class {
  constructor(g2) {
    this.g = g2;
    this.dirty = true;
    this.scrolled = true;
    g2.on("move", (who) => {
      if (who.has(PlayerTag))
        this.dirty = true;
    });
    g2.on("scroll", ([x, y2]) => {
      this.preserveExplored();
      this.g.scrollX = x;
      this.g.scrollY = y2;
      this.dirty = true;
      this.scrolled = true;
    });
  }
  process() {
    if (!this.dirty)
      return;
    const { player, scrollX, scrollY, term } = this.g;
    if (this.scrolled)
      this.scroll(scrollX, scrollY);
    const pos = player.get(Position);
    const x = pos.x - scrollX;
    const y2 = pos.y - scrollY;
    if (term.getCell(x, y2)) {
      term.computeFov(x, y2, 5);
      term.updateExplored();
    }
    this.dirty = false;
  }
  preserveExplored() {
    const { map, scrollX, scrollY, term } = this.g;
    for (let yo = 0; yo < term.height; yo++) {
      const y2 = yo + scrollY;
      for (let xo = 0; xo < term.width; xo++) {
        const x = xo + scrollX;
        if (map.contains(x, y2)) {
          const tile = map.get(x, y2);
          tile.explored || (tile.explored = term.getCell(xo, yo)?.explored);
        }
      }
    }
  }
  scroll(sx, sy) {
    const { map, term } = this.g;
    for (let yo = 0; yo < term.height; yo++) {
      const y2 = yo + sy;
      for (let xo = 0; xo < term.width; xo++) {
        const x = xo + sx;
        const tile = map.contains(x, y2) ? map.get(x, y2) : outOfBounds;
        const cell = term.getCell(xo, yo);
        cell.blocked = tile.blocks;
        cell.blockedSight = tile.opaque;
        cell.explored = tile.explored || false;
      }
    }
    this.scrolled = false;
  }
};

// src/systems/PlayerMove.ts
var movementKeys = /* @__PURE__ */ new Map([
  // numpad
  [m.VK_NUMPAD7, new f(-1, -1)],
  [m.VK_NUMPAD8, new f(0, -1)],
  [m.VK_NUMPAD9, new f(1, -1)],
  [m.VK_NUMPAD4, new f(-1, 0)],
  [m.VK_NUMPAD5, new f(0, 0)],
  [m.VK_NUMPAD6, new f(1, 0)],
  [m.VK_NUMPAD1, new f(-1, 1)],
  [m.VK_NUMPAD2, new f(0, 1)],
  [m.VK_NUMPAD3, new f(1, 1)],
  // numpad (with num lock off)
  [m.VK_HOME, new f(-1, -1)],
  [m.VK_UP, new f(0, -1)],
  [m.VK_PAGE_UP, new f(1, -1)],
  [m.VK_LEFT, new f(-1, 0)],
  ["Clear", new f(0, 0)],
  [m.VK_RIGHT, new f(1, 0)],
  [m.VK_END, new f(-1, 1)],
  [m.VK_DOWN, new f(0, 1)],
  [m.VK_PAGE_DOWN, new f(1, 1)],
  // vi keys
  [m.VK_Y, new f(-1, -1)],
  [m.VK_K, new f(0, -1)],
  [m.VK_U, new f(1, -1)],
  [m.VK_H, new f(-1, 0)],
  [m.VK_PERIOD, new f(0, 0)],
  [m.VK_L, new f(1, 0)],
  [m.VK_B, new f(-1, 1)],
  [m.VK_J, new f(0, 1)],
  [m.VK_N, new f(1, 1)]
]);
function getMovementKey(term) {
  for (const [key, move] of movementKeys.entries()) {
    if (term.isKeyPressed(key))
      return move;
  }
}
var PlayerMove = class {
  constructor(g2) {
    this.g = g2;
  }
  process() {
    const { player, term } = this.g;
    const move = getMovementKey(term);
    if (!move)
      return;
    if (move.x === 0 && move.y === 0)
      return;
    if (term.isKeyDown(m.VK_CONTROL_LEFT)) {
      const newX = this.g.scrollX + move.x * 10;
      const newY = this.g.scrollY + move.y * 10;
      this.g.emit("scroll", [newX, newY]);
      return;
    }
    const pos = player.get(Position);
    const { x, y: y2 } = pos;
    if (!this.g.canMove(x, y2, move.x, move.y))
      return;
    pos.x += move.x;
    pos.y += move.y;
    this.g.emit("move", player, [x, y2]);
  }
};

// src/Game.ts
var catId = (logo) => `C:${logo}`;
var monId = (name) => `M:${name}`;
var Game = class extends import_eventemitter3.default {
  constructor(canvas, width, height) {
    super();
    this.width = width;
    this.height = height;
    this.debug = (0, import_debug2.default)("game");
    this.emit = (event, ...args) => {
      this.debug("event", event, ...args);
      return super.emit(event, ...args);
    };
    this.ecs = ecs_default;
    this.blockers = ecs_default.query({ all: [Position] });
    ecs_default.prefab("player").add(Appearance, { colour: y.WHITE, glyph: "@".charCodeAt(0) }).add(Stats, this.getPlayerStats(3, 3, 3, 1)).add(PlayerTag, {});
    this.player = ecs_default.entity("player");
    this.rng = random;
    this.debug("seed", this.rng.seed);
    this.scrollX = 0;
    this.scrollY = 0;
    this.term = new be(canvas, width, height);
    this.gui = new oe(this.term);
    this.installCheats();
    this.loadResources();
    try {
      const [x, y2] = this.load();
      this.player.add(Position, { x, y: y2 });
    } catch (e) {
      this.fatal(e);
      return;
    }
    this.systems = [PlayerMove, PlayerFOV, DrawScreen].map((s) => new s(this));
    this.term.update = this.update.bind(this);
  }
  update() {
    for (const sys of this.systems)
      sys.process();
  }
  loadResources() {
    this.palette = loadPalette();
    this.categories = loadAllCategories();
    this.monsters = loadAllMonsters();
    for (const category of this.categories)
      this.ecs.prefab(catId(category.logo));
    for (const monster of this.monsters) {
      const colour = this.palette[monster.col] || this.palette.white;
      this.ecs.prefab(monId(monster.name), this.ecs.getPrefab(catId(monster.cat))).add(Appearance, { colour, glyph: monster.cat.charCodeAt(0) }).add(Stats, this.getMonsterStats(monster));
    }
  }
  load() {
    const aa = new AmorphousAreaGenerator(this, 48);
    this.map = aa.map;
    if (aa.player)
      return aa.player;
    return [4, 4];
  }
  installCheats() {
    const glob = window;
    glob.stats = (name) => {
      const monster = this.monsters.find((m2) => m2.name === name);
      if (!monster)
        return "unknown";
      const stats = this.getMonsterStats(monster);
      return getAllTheStats(stats, this.player.get(Stats));
    };
  }
  fatal(e) {
    const err = e instanceof Error ? e : new Error(JSON.stringify(e));
    console.error(err);
    const dlg = new ie("Fatal Error", err.message);
    this.gui.add(dlg);
    this.gui.draw();
  }
  choose(items) {
    return this.rng.choice(items);
  }
  canMove(x, y2, dx, dy) {
    if (this.isBlocked(x + dx, y2 + dy))
      return false;
    return !(dx && dy && this.isBlocked(x + dx, y2) && this.isBlocked(x, y2 + dy));
  }
  isBlocked(x, y2) {
    if (this.map.isBlocked(x, y2))
      return true;
    for (const e of this.blockers.get()) {
      const pos = e.get(Position);
      if (pos.x === x && pos.y === y2)
        return true;
    }
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  spawnRandomMonster(x, y2, level) {
    const monster = this.choose(this.monsters);
    return this.spawnMonster(x, y2, monster);
  }
  spawnMonster(x, y2, monster) {
    const { categories, ecs: ecs2 } = this;
    const category = categories.find((cat) => cat.logo === monster.cat);
    const e = ecs2.entity(monId(monster.name)).add(Position, { x, y: y2 });
    this.debug("spawn %d,%d %s (%s)", x, y2, monster.name, category?.name);
    return e;
  }
  getMonsterStats(monster) {
    const { level } = monster;
    const [body, mind, spirit] = monster.atts;
    const stats = {
      level,
      body,
      mind,
      spirit,
      talent: 0,
      hp: 0,
      mana: 0,
      stamina: 0
    };
    stats.hp = getMaxHP(stats);
    stats.mana = getMaxMana(stats);
    stats.stamina = getMaxStamina(stats);
    return stats;
  }
  getPlayerStats(mind, body, spirit, talent) {
    const stats = {
      level: 1,
      mind: mind * 10,
      body: body * 10,
      spirit: spirit * 10,
      talent,
      hp: 0,
      mana: 0,
      stamina: 0
    };
    stats.hp = getMaxHP(stats);
    stats.mana = getMaxMana(stats);
    stats.stamina = getMaxStamina(stats);
    return stats;
  }
};

// src/index.ts
window.addEventListener("load", () => {
  const canvas = document.getElementById("main");
  canvas.focus();
  const g2 = new Game(canvas, 80, 60);
  window.g = g2;
});
//# sourceMappingURL=index.js.map
