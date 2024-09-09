var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/formats/emscripten.cjs
var require_emscripten = __commonJS({
  "src/formats/emscripten.cjs"(exports2, module2) {
    var DEFAULT_GAS_LIMIT = 9e15;
    var Module = (() => {
      let _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : void 0;
      if (typeof __filename !== "undefined")
        _scriptDir = _scriptDir || __filename;
      return function(binaryOrInstantiate, { computeLimit, memoryLimit, extensions, format }) {
        var Module2 = Module2 || {};
        if (typeof binaryOrInstantiate === "function")
          Module2.instantiateWasm = binaryOrInstantiate;
        else
          Module2.wasmBinary = binaryOrInstantiate;
        Module2.gas = {
          limit: computeLimit || DEFAULT_GAS_LIMIT,
          used: 0,
          use: (amount) => {
            Module2.gas.used += amount;
          },
          refill: (amount) => {
            if (!amount)
              Module2.gas.used = 0;
            else
              Module2.gas.used = Math.max(Module2.gas.used - amount, 0);
          },
          isEmpty: () => Module2.gas.used > Module2.gas.limit
        };
        const _listeners_ = [];
        Module2.cleanupListeners = function() {
          _listeners_.forEach(([name, l]) => process.removeListener(name, l));
        };
        function uncaughtException(ex) {
          if (!(ex instanceof ExitStatus)) {
            throw ex;
          }
        }
        function unhandledRejection(reason) {
          throw reason;
        }
        _listeners_.push(["uncaughtException", uncaughtException], ["unhandledRejection", unhandledRejection]);
        var Module2 = typeof Module2 !== "undefined" ? Module2 : {};
        let readyPromiseResolve, readyPromiseReject;
        Module2.ready = new Promise(function(resolve, reject) {
          readyPromiseResolve = resolve;
          readyPromiseReject = reject;
        });
        Module2.locateFile = (url) => {
          return url;
        };
        let moduleOverrides = Object.assign({}, Module2);
        let arguments_ = [];
        let thisProgram = "./this.program";
        let quit_ = (status, toThrow) => {
          throw toThrow;
        };
        const ENVIRONMENT_IS_WEB = typeof window === "object";
        const ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
        const ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
        let scriptDirectory = "";
        function locateFile(path) {
          if (Module2.locateFile) {
            return Module2.locateFile(path, scriptDirectory);
          }
          return scriptDirectory + path;
        }
        let read_, readAsync, readBinary, setWindowTitle;
        function logExceptionOnExit(e) {
          if (e instanceof ExitStatus)
            return;
          const toLog = e;
          err("exiting due to exception: " + toLog);
        }
        let fs;
        let nodePath;
        let requireNodeFS;
        if (ENVIRONMENT_IS_NODE) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = require("path").dirname(scriptDirectory) + "/";
          } else {
            scriptDirectory = __dirname + "/";
          }
          requireNodeFS = () => {
            if (!nodePath) {
              fs = require("fs");
              nodePath = require("path");
            }
          };
          read_ = function shell_read(filename, binary) {
            requireNodeFS();
            filename = nodePath.normalize(filename);
            return fs.readFileSync(filename, binary ? void 0 : "utf8");
          };
          readBinary = (filename) => {
            let ret = read_(filename, true);
            if (!ret.buffer) {
              ret = new Uint8Array(ret);
            }
            return ret;
          };
          readAsync = (filename, onload, onerror) => {
            requireNodeFS();
            filename = nodePath.normalize(filename);
            fs.readFile(filename, function(err2, data) {
              if (err2)
                onerror(err2);
              else
                onload(data.buffer);
            });
          };
          if (process.argv.length > 1) {
            thisProgram = process.argv[1].replace(/\\/g, "/");
          }
          arguments_ = process.argv.slice(2);
          process.on("uncaughtException", uncaughtException);
          process.on("unhandledRejection", unhandledRejection);
          quit_ = (status, toThrow) => {
            if (keepRuntimeAlive()) {
              process.exitCode = status;
              throw toThrow;
            }
            logExceptionOnExit(toThrow);
            process.exit(status);
          };
          Module2.inspect = function() {
            return "[Emscripten Module object]";
          };
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else if (typeof document !== "undefined" && document.currentScript) {
            scriptDirectory = document.currentScript.src;
          }
          if (_scriptDir) {
            scriptDirectory = _scriptDir;
          }
          if (scriptDirectory.indexOf("blob:") !== 0) {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
          } else {
            scriptDirectory = "";
          }
          {
            read_ = (url) => {
              const xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.send(null);
              return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = (url) => {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(xhr.response);
              };
            }
            readAsync = (url, onload, onerror) => {
              const xhr = new XMLHttpRequest();
              xhr.open("GET", url, true);
              xhr.responseType = "arraybuffer";
              xhr.onload = () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                  onload(xhr.response);
                  return;
                }
                onerror();
              };
              xhr.onerror = onerror;
              xhr.send(null);
            };
          }
          setWindowTitle = (title) => document.title = title;
        } else {
        }
        const out = Module2.print || console.log.bind(console);
        var err = Module2.printErr || console.warn.bind(console);
        Object.assign(Module2, moduleOverrides);
        moduleOverrides = null;
        if (Module2.arguments)
          arguments_ = Module2.arguments;
        if (Module2.thisProgram)
          thisProgram = Module2.thisProgram;
        if (Module2.quit)
          quit_ = Module2.quit;
        let tempRet0 = 0;
        const setTempRet0 = (value) => {
          tempRet0 = value;
        };
        const getTempRet0 = () => tempRet0;
        let wasmBinary;
        if (Module2.wasmBinary)
          wasmBinary = Module2.wasmBinary;
        const noExitRuntime = Module2.noExitRuntime || true;
        if (typeof WebAssembly !== "object") {
          abort("no native wasm support detected");
        }
        let wasmMemory;
        let ABORT = false;
        let EXITSTATUS;
        function getCFunc(ident) {
          const func = Module2["_" + ident];
          return func;
        }
        function ccall(ident, returnType, argTypes, args, opts) {
          const toC = { string: function(str) {
            let ret2 = 0;
            if (str !== null && str !== void 0 && str !== 0) {
              const len = (str.length << 2) + 1;
              ret2 = stackAlloc(len);
              stringToUTF8(str, ret2, len);
            }
            return ret2;
          }, array: function(arr) {
            const ret2 = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret2);
            return ret2;
          } };
          function convertReturnValue(ret2) {
            if (returnType === "string") {
              return UTF8ToString(ret2);
            }
            if (returnType === "boolean")
              return Boolean(ret2);
            return ret2;
          }
          const func = getCFunc(ident);
          const cArgs = [];
          let stack = 0;
          if (args) {
            for (let i = 0; i < args.length; i++) {
              const converter = toC[argTypes[i]];
              if (converter) {
                if (stack === 0)
                  stack = stackSave();
                cArgs[i] = converter(args[i]);
              } else {
                cArgs[i] = args[i];
              }
            }
          }
          let ret = func.apply(null, cArgs);
          function onDone(ret2) {
            if (stack !== 0)
              stackRestore(stack);
            return convertReturnValue(ret2);
          }
          ret = onDone(ret);
          return ret;
        }
        function cwrap(ident, returnType, argTypes, opts) {
          argTypes = argTypes || [];
          const numericArgs = argTypes.every(function(type) {
            return type === "number";
          });
          const numericRet = returnType !== "string";
          if (numericRet && numericArgs && !opts) {
            return getCFunc(ident);
          }
          return function() {
            return ccall(ident, returnType, argTypes, arguments, opts);
          };
        }
        const UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : void 0;
        function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
          const endIdx = idx + maxBytesToRead;
          let endPtr = idx;
          while (heapOrArray[endPtr] && !(endPtr >= endIdx))
            ++endPtr;
          if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
          } else {
            var str = "";
            while (idx < endPtr) {
              let u0 = heapOrArray[idx++];
              if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue;
              }
              const u1 = heapOrArray[idx++] & 63;
              if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue;
              }
              const u2 = heapOrArray[idx++] & 63;
              if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2;
              } else {
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
              }
              if (u0 < 65536) {
                str += String.fromCharCode(u0);
              } else {
                const ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
              }
            }
          }
          return str;
        }
        function UTF8ToString(ptr, maxBytesToRead) {
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        }
        function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
          if (!(maxBytesToWrite > 0))
            return 0;
          const startIdx = outIdx;
          const endIdx = outIdx + maxBytesToWrite - 1;
          for (let i = 0; i < str.length; ++i) {
            let u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
              const u1 = str.charCodeAt(++i);
              u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
              if (outIdx >= endIdx)
                break;
              heap[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx)
                break;
              heap[outIdx++] = 192 | u >> 6;
              heap[outIdx++] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx)
                break;
              heap[outIdx++] = 224 | u >> 12;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx)
                break;
              heap[outIdx++] = 240 | u >> 18;
              heap[outIdx++] = 128 | u >> 12 & 63;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            }
          }
          heap[outIdx] = 0;
          return outIdx - startIdx;
        }
        function stringToUTF8(str, outPtr, maxBytesToWrite) {
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        }
        function lengthBytesUTF8(str) {
          let len = 0;
          for (let i = 0; i < str.length; ++i) {
            let u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343)
              u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
            if (u <= 127)
              ++len;
            else if (u <= 2047)
              len += 2;
            else if (u <= 65535)
              len += 3;
            else
              len += 4;
          }
          return len;
        }
        function allocateUTF8(str) {
          const size = lengthBytesUTF8(str) + 1;
          const ret = _malloc(size);
          if (ret)
            stringToUTF8Array(str, HEAP8, ret, size);
          return ret;
        }
        function writeArrayToMemory(array, buffer2) {
          HEAP8.set(array, buffer2);
        }
        function writeAsciiToMemory(str, buffer2, dontAddNull) {
          for (let i = 0; i < str.length; ++i) {
            HEAP8[buffer2++ >> 0] = str.charCodeAt(i);
          }
          if (!dontAddNull)
            HEAP8[buffer2 >> 0] = 0;
        }
        let buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        function updateGlobalBufferAndViews(buf) {
          buffer = buf;
          Module2.HEAP8 = HEAP8 = new Int8Array(buf);
          Module2.HEAP16 = HEAP16 = new Int16Array(buf);
          Module2.HEAP32 = HEAP32 = new Int32Array(buf);
          Module2.HEAPU8 = HEAPU8 = new Uint8Array(buf);
          Module2.HEAPU16 = HEAPU16 = new Uint16Array(buf);
          Module2.HEAPU32 = HEAPU32 = new Uint32Array(buf);
          Module2.HEAPF32 = HEAPF32 = new Float32Array(buf);
          Module2.HEAPF64 = HEAPF64 = new Float64Array(buf);
        }
        const INITIAL_MEMORY = Module2.INITIAL_MEMORY || 6291456;
        let wasmTable;
        const __ATPRERUN__ = [];
        const __ATINIT__ = [];
        const __ATMAIN__ = [];
        const __ATPOSTRUN__ = [];
        let runtimeInitialized = false;
        function keepRuntimeAlive() {
          return noExitRuntime;
        }
        function preRun() {
          if (Module2.preRun) {
            if (typeof Module2.preRun === "function")
              Module2.preRun = [Module2.preRun];
            while (Module2.preRun.length) {
              addOnPreRun(Module2.preRun.shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          runtimeInitialized = true;
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
          if (Module2.postRun) {
            if (typeof Module2.postRun === "function")
              Module2.postRun = [Module2.postRun];
            while (Module2.postRun.length) {
              addOnPostRun(Module2.postRun.shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
          __ATINIT__.unshift(cb);
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        let runDependencies = 0;
        let runDependencyWatcher = null;
        let dependenciesFulfilled = null;
        function addRunDependency(id) {
          runDependencies++;
          if (Module2.monitorRunDependencies) {
            Module2.monitorRunDependencies(runDependencies);
          }
        }
        function removeRunDependency(id) {
          runDependencies--;
          if (Module2.monitorRunDependencies) {
            Module2.monitorRunDependencies(runDependencies);
          }
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              const callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        function abort(what) {
          {
            if (Module2.onAbort) {
              Module2.onAbort(what);
            }
          }
          what = "Aborted(" + what + ")";
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          what += ". Build with -sASSERTIONS for more info.";
          const e = new WebAssembly.RuntimeError(what);
          readyPromiseReject(e);
          throw e;
        }
        const dataURIPrefix = "data:application/octet-stream;base64,";
        function isDataURI(filename) {
          return filename.startsWith(dataURIPrefix);
        }
        function isFileURI(filename) {
          return filename.startsWith("file://");
        }
        let wasmBinaryFile;
        wasmBinaryFile = "process.wasm";
        if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinary(file) {
          try {
            if (file == wasmBinaryFile && wasmBinary) {
              return new Uint8Array(wasmBinary);
            }
            if (readBinary) {
              return readBinary(file);
            } else {
              throw "both async and sync fetching of the wasm failed";
            }
          } catch (err2) {
            abort(err2);
          }
        }
        function getBinaryPromise() {
          if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
            if (typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
              return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
                if (!response.ok) {
                  throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
                }
                return response.arrayBuffer();
              }).catch(function() {
                return getBinary(wasmBinaryFile);
              });
            } else {
              if (readAsync) {
                return new Promise(function(resolve, reject) {
                  readAsync(wasmBinaryFile, function(response) {
                    resolve(new Uint8Array(response));
                  }, reject);
                });
              }
            }
          }
          return Promise.resolve().then(function() {
            return getBinary(wasmBinaryFile);
          });
        }
        function createWasm() {
          const info = { a: asmLibraryArg, metering: { usegas: function(gas) {
            Module2.gas.use(gas);
            if (Module2.gas.isEmpty())
              throw Error("out of gas!");
          } } };
          function receiveInstance(instance, module3) {
            const exports3 = instance.exports;
            Module2.asm = exports3;
            wasmMemory = Module2.asm.E;
            updateGlobalBufferAndViews(wasmMemory.buffer);
            wasmTable = Module2.asm.I;
            addOnInit(Module2.asm.F);
            removeRunDependency("wasm-instantiate");
          }
          addRunDependency("wasm-instantiate");
          function receiveInstantiationResult(result) {
            receiveInstance(result.instance);
          }
          function instantiateArrayBuffer(receiver) {
            return getBinaryPromise().then(function(binary) {
              return WebAssembly.instantiate(binary, info);
            }).then(function(instance) {
              return instance;
            }).then(receiver, function(reason) {
              err("failed to asynchronously prepare wasm: " + reason);
              abort(reason);
            });
          }
          function instantiateAsync() {
            if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch === "function") {
              return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
                const result = WebAssembly.instantiateStreaming(response, info);
                return result.then(receiveInstantiationResult, function(reason) {
                  err("wasm streaming compile failed: " + reason);
                  err("falling back to ArrayBuffer instantiation");
                  return instantiateArrayBuffer(receiveInstantiationResult);
                });
              });
            } else {
              return instantiateArrayBuffer(receiveInstantiationResult);
            }
          }
          if (Module2.instantiateWasm) {
            try {
              const exports3 = Module2.instantiateWasm(info, receiveInstance);
              return exports3;
            } catch (e) {
              err("Module.instantiateWasm callback failed with error: " + e);
              return false;
            }
          }
          instantiateAsync().catch(readyPromiseReject);
          return {};
        }
        function callRuntimeCallbacks(callbacks) {
          while (callbacks.length > 0) {
            const callback = callbacks.shift();
            if (typeof callback === "function") {
              callback(Module2);
              continue;
            }
            const func = callback.func;
            if (typeof func === "number") {
              if (callback.arg === void 0) {
                getWasmTableEntry(func)();
              } else {
                getWasmTableEntry(func)(callback.arg);
              }
            } else {
              func(callback.arg === void 0 ? null : callback.arg);
            }
          }
        }
        function getWasmTableEntry(funcPtr) {
          return wasmTable.get(funcPtr);
        }
        function handleException(e) {
          if (e instanceof ExitStatus || e == "unwind") {
            return EXITSTATUS;
          }
          quit_(1, e);
        }
        var SYSCALLS = { varargs: void 0, get: function() {
          SYSCALLS.varargs += 4;
          const ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
          return ret;
        }, getStr: function(ptr) {
          const ret = UTF8ToString(ptr);
          return ret;
        } };
        function ___syscall_dup3(fd, suggestFD, flags) {
        }
        function setErrNo(value) {
          HEAP32[___errno_location() >> 2] = value;
          return value;
        }
        function ___syscall_fcntl64(fd, cmd, varargs) {
          SYSCALLS.varargs = varargs;
          return 0;
        }
        function ___syscall_ioctl(fd, op, varargs) {
          SYSCALLS.varargs = varargs;
          return 0;
        }
        function ___syscall_lstat64(path, buf) {
        }
        function ___syscall_openat(dirfd, path, flags, varargs) {
          SYSCALLS.varargs = varargs;
        }
        function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
        }
        function ___syscall_rmdir(path) {
        }
        function ___syscall_unlinkat(dirfd, path, flags) {
        }
        function __emscripten_date_now() {
          return 0;
        }
        const nowIsMonotonic = true;
        function __emscripten_get_now_is_monotonic() {
          return nowIsMonotonic;
        }
        function __emscripten_throw_longjmp() {
          throw Infinity;
        }
        function __gmtime_js(time, tmPtr) {
          const date = new Date(HEAP32[time >> 2] * 1e3);
          HEAP32[tmPtr >> 2] = date.getUTCSeconds();
          HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
          HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
          HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
          HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
          HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
          HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
          const start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
          const yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
          HEAP32[tmPtr + 28 >> 2] = yday;
        }
        function __localtime_js(time, tmPtr) {
          const date = new Date(HEAP32[time >> 2] * 1e3);
          HEAP32[tmPtr >> 2] = date.getSeconds();
          HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
          HEAP32[tmPtr + 8 >> 2] = date.getHours();
          HEAP32[tmPtr + 12 >> 2] = date.getDate();
          HEAP32[tmPtr + 16 >> 2] = date.getMonth();
          HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
          HEAP32[tmPtr + 24 >> 2] = date.getDay();
          const start = new Date(date.getFullYear(), 0, 1);
          const yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
          HEAP32[tmPtr + 28 >> 2] = yday;
          HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
          const summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
          const winterOffset = start.getTimezoneOffset();
          const dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
          HEAP32[tmPtr + 32 >> 2] = dst;
        }
        function __mktime_js(tmPtr) {
          const date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr + 8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0);
          const dst = HEAP32[tmPtr + 32 >> 2];
          const guessedOffset = date.getTimezoneOffset();
          const start = new Date(date.getFullYear(), 0, 1);
          const summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
          const winterOffset = start.getTimezoneOffset();
          const dstOffset = Math.min(winterOffset, summerOffset);
          if (dst < 0) {
            HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
          } else if (dst > 0 != (dstOffset == guessedOffset)) {
            const nonDstOffset = Math.max(winterOffset, summerOffset);
            const trueOffset = dst > 0 ? dstOffset : nonDstOffset;
            date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
          }
          HEAP32[tmPtr + 24 >> 2] = date.getDay();
          const yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
          HEAP32[tmPtr + 28 >> 2] = yday;
          HEAP32[tmPtr >> 2] = date.getSeconds();
          HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
          HEAP32[tmPtr + 8 >> 2] = date.getHours();
          HEAP32[tmPtr + 12 >> 2] = date.getDate();
          HEAP32[tmPtr + 16 >> 2] = date.getMonth();
          return date.getTime() / 1e3 | 0;
        }
        function _tzset_impl(timezone, daylight, tzname) {
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
          const winter = new Date(currentYear, 0, 1);
          const summer = new Date(currentYear, 6, 1);
          const winterOffset = winter.getTimezoneOffset();
          const summerOffset = summer.getTimezoneOffset();
          const stdTimezoneOffset = Math.max(winterOffset, summerOffset);
          HEAP32[timezone >> 2] = stdTimezoneOffset * 60;
          HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
          function extractZone(date) {
            const match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
            return match ? match[1] : "GMT";
          }
          const winterName = extractZone(winter);
          const summerName = extractZone(summer);
          const winterNamePtr = allocateUTF8(winterName);
          const summerNamePtr = allocateUTF8(summerName);
          if (summerOffset < winterOffset) {
            HEAPU32[tzname >> 2] = winterNamePtr;
            HEAPU32[tzname + 4 >> 2] = summerNamePtr;
          } else {
            HEAPU32[tzname >> 2] = summerNamePtr;
            HEAPU32[tzname + 4 >> 2] = winterNamePtr;
          }
        }
        function __tzset_js(timezone, daylight, tzname) {
          if (__tzset_js.called)
            return;
          __tzset_js.called = true;
          _tzset_impl(timezone, daylight, tzname);
        }
        function _abort() {
          abort("");
        }
        let _emscripten_get_now;
        if (ENVIRONMENT_IS_NODE) {
          _emscripten_get_now = () => {
            return 0;
          };
        } else
          _emscripten_get_now = () => 0;
        function _emscripten_memcpy_big(dest, src, num) {
          HEAPU8.copyWithin(dest, src, src + num);
        }
        function getHeapMax() {
          return 524288e3;
        }
        function emscripten_realloc_buffer(size) {
          try {
            wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
            updateGlobalBufferAndViews(wasmMemory.buffer);
            return 1;
          } catch (e) {
          }
        }
        function _emscripten_resize_heap(requestedSize) {
          const oldSize = HEAPU8.length;
          requestedSize = requestedSize >>> 0;
          const maxHeapSize = getHeapMax();
          if (requestedSize > maxHeapSize) {
            return false;
          }
          const alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
          for (let cutDown = 1; cutDown <= 4; cutDown *= 2) {
            let overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            const newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
            const replacement = emscripten_realloc_buffer(newSize);
            if (replacement) {
              return true;
            }
          }
          return false;
        }
        const ENV = {};
        function getExecutableName() {
          return thisProgram || "./this.program";
        }
        function getEnvStrings() {
          if (!getEnvStrings.strings) {
            const lang = "C.UTF-8";
            const env = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: lang, _: getExecutableName() };
            for (var x in ENV) {
              if (ENV[x] === void 0)
                delete env[x];
              else
                env[x] = ENV[x];
            }
            const strings = [];
            for (var x in env) {
              strings.push(x + "=" + env[x]);
            }
            getEnvStrings.strings = strings;
          }
          return getEnvStrings.strings;
        }
        function _environ_get(__environ, environ_buf) {
          let bufSize = 0;
          getEnvStrings().forEach(function(string, i) {
            const ptr = environ_buf + bufSize;
            HEAPU32[__environ + i * 4 >> 2] = ptr;
            writeAsciiToMemory(string, ptr);
            bufSize += string.length + 1;
          });
          return 0;
        }
        function _environ_sizes_get(penviron_count, penviron_buf_size) {
          const strings = getEnvStrings();
          HEAPU32[penviron_count >> 2] = strings.length;
          let bufSize = 0;
          strings.forEach(function(string) {
            bufSize += string.length + 1;
          });
          HEAPU32[penviron_buf_size >> 2] = bufSize;
          return 0;
        }
        function _exit(status) {
          exit(status);
        }
        function _fd_close(fd) {
          return 52;
        }
        function _fd_read(fd, iov, iovcnt, pnum) {
          return 52;
        }
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
          return 70;
        }
        const printCharBuffers = [null, [], []];
        function printChar(stream, curr) {
          const buffer2 = printCharBuffers[stream];
          if (curr === 0 || curr === 10) {
            (stream === 1 ? out : err)(UTF8ArrayToString(buffer2, 0));
            buffer2.length = 0;
          } else {
            buffer2.push(curr);
          }
        }
        function _fd_write(fd, iov, iovcnt, pnum) {
          let num = 0;
          for (let i = 0; i < iovcnt; i++) {
            const ptr = HEAPU32[iov >> 2];
            const len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            for (let j = 0; j < len; j++) {
              printChar(fd, HEAPU8[ptr + j]);
            }
            num += len;
          }
          HEAPU32[pnum >> 2] = num;
          return 0;
        }
        function _getTempRet0() {
          return getTempRet0();
        }
        function _setTempRet0(val) {
          setTempRet0(val);
        }
        function __isLeapYear(year) {
          return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        }
        function __arraySum(array, index) {
          let sum = 0;
          for (let i = 0; i <= index; sum += array[i++]) {
          }
          return sum;
        }
        const __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        function __addDays(date, days) {
          const newDate = new Date(date.getTime());
          while (days > 0) {
            const leap = __isLeapYear(newDate.getFullYear());
            const currentMonth = newDate.getMonth();
            const daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
            if (days > daysInCurrentMonth - newDate.getDate()) {
              days -= daysInCurrentMonth - newDate.getDate() + 1;
              newDate.setDate(1);
              if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1);
              } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1);
              }
            } else {
              newDate.setDate(newDate.getDate() + days);
              return newDate;
            }
          }
          return newDate;
        }
        function _strftime(s, maxsize, format2, tm) {
          const tm_zone = HEAP32[tm + 40 >> 2];
          const date = { tm_sec: HEAP32[tm >> 2], tm_min: HEAP32[tm + 4 >> 2], tm_hour: HEAP32[tm + 8 >> 2], tm_mday: HEAP32[tm + 12 >> 2], tm_mon: HEAP32[tm + 16 >> 2], tm_year: HEAP32[tm + 20 >> 2], tm_wday: HEAP32[tm + 24 >> 2], tm_yday: HEAP32[tm + 28 >> 2], tm_isdst: HEAP32[tm + 32 >> 2], tm_gmtoff: HEAP32[tm + 36 >> 2], tm_zone: tm_zone ? UTF8ToString(tm_zone) : "" };
          let pattern = UTF8ToString(format2);
          const EXPANSION_RULES_1 = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
          for (var rule in EXPANSION_RULES_1) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
          }
          const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          function leadingSomething(value, digits, character) {
            let str = typeof value === "number" ? value.toString() : value || "";
            while (str.length < digits) {
              str = character[0] + str;
            }
            return str;
          }
          function leadingNulls(value, digits) {
            return leadingSomething(value, digits, "0");
          }
          function compareByDay(date1, date2) {
            function sgn(value) {
              return value < 0 ? -1 : value > 0 ? 1 : 0;
            }
            let compare;
            if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
              if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate());
              }
            }
            return compare;
          }
          function getFirstWeekStartDate(janFourth) {
            switch (janFourth.getDay()) {
              case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
              case 1:
                return janFourth;
              case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
              case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
              case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
              case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
              case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30);
            }
          }
          function getWeekBasedYear(date2) {
            const thisDate = __addDays(new Date(date2.tm_year + 1900, 0, 1), date2.tm_yday);
            const janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
            const janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
            const firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            const firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
              if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1;
              } else {
                return thisDate.getFullYear();
              }
            } else {
              return thisDate.getFullYear() - 1;
            }
          }
          const EXPANSION_RULES_2 = { "%a": function(date2) {
            return WEEKDAYS[date2.tm_wday].substring(0, 3);
          }, "%A": function(date2) {
            return WEEKDAYS[date2.tm_wday];
          }, "%b": function(date2) {
            return MONTHS[date2.tm_mon].substring(0, 3);
          }, "%B": function(date2) {
            return MONTHS[date2.tm_mon];
          }, "%C": function(date2) {
            const year = date2.tm_year + 1900;
            return leadingNulls(year / 100 | 0, 2);
          }, "%d": function(date2) {
            return leadingNulls(date2.tm_mday, 2);
          }, "%e": function(date2) {
            return leadingSomething(date2.tm_mday, 2, " ");
          }, "%g": function(date2) {
            return getWeekBasedYear(date2).toString().substring(2);
          }, "%G": function(date2) {
            return getWeekBasedYear(date2);
          }, "%H": function(date2) {
            return leadingNulls(date2.tm_hour, 2);
          }, "%I": function(date2) {
            let twelveHour = date2.tm_hour;
            if (twelveHour == 0)
              twelveHour = 12;
            else if (twelveHour > 12)
              twelveHour -= 12;
            return leadingNulls(twelveHour, 2);
          }, "%j": function(date2) {
            return leadingNulls(date2.tm_mday + __arraySum(__isLeapYear(date2.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date2.tm_mon - 1), 3);
          }, "%m": function(date2) {
            return leadingNulls(date2.tm_mon + 1, 2);
          }, "%M": function(date2) {
            return leadingNulls(date2.tm_min, 2);
          }, "%n": function() {
            return "\n";
          }, "%p": function(date2) {
            if (date2.tm_hour >= 0 && date2.tm_hour < 12) {
              return "AM";
            } else {
              return "PM";
            }
          }, "%S": function(date2) {
            return leadingNulls(date2.tm_sec, 2);
          }, "%t": function() {
            return "	";
          }, "%u": function(date2) {
            return date2.tm_wday || 7;
          }, "%U": function(date2) {
            const days = date2.tm_yday + 7 - date2.tm_wday;
            return leadingNulls(Math.floor(days / 7), 2);
          }, "%V": function(date2) {
            let val = Math.floor((date2.tm_yday + 7 - (date2.tm_wday + 6) % 7) / 7);
            if ((date2.tm_wday + 371 - date2.tm_yday - 2) % 7 <= 2) {
              val++;
            }
            if (!val) {
              val = 52;
              const dec31 = (date2.tm_wday + 7 - date2.tm_yday - 1) % 7;
              if (dec31 == 4 || dec31 == 5 && __isLeapYear(date2.tm_year % 400 - 1)) {
                val++;
              }
            } else if (val == 53) {
              const jan1 = (date2.tm_wday + 371 - date2.tm_yday) % 7;
              if (jan1 != 4 && (jan1 != 3 || !__isLeapYear(date2.tm_year)))
                val = 1;
            }
            return leadingNulls(val, 2);
          }, "%w": function(date2) {
            return date2.tm_wday;
          }, "%W": function(date2) {
            const days = date2.tm_yday + 7 - (date2.tm_wday + 6) % 7;
            return leadingNulls(Math.floor(days / 7), 2);
          }, "%y": function(date2) {
            return (date2.tm_year + 1900).toString().substring(2);
          }, "%Y": function(date2) {
            return date2.tm_year + 1900;
          }, "%z": function(date2) {
            let off = date2.tm_gmtoff;
            const ahead = off >= 0;
            off = Math.abs(off) / 60;
            off = off / 60 * 100 + off % 60;
            return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
          }, "%Z": function(date2) {
            return date2.tm_zone;
          }, "%%": function() {
            return "%";
          } };
          pattern = pattern.replace(/%%/g, "\0\0");
          for (var rule in EXPANSION_RULES_2) {
            if (pattern.includes(rule)) {
              pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
            }
          }
          pattern = pattern.replace(/\0\0/g, "%");
          const bytes = intArrayFromString(pattern, false);
          if (bytes.length > maxsize) {
            return 0;
          }
          writeArrayToMemory(bytes, s);
          return bytes.length - 1;
        }
        function _system(command) {
          if (false) {
            if (!command)
              return 1;
            const cmdstr = UTF8ToString(command);
            if (!cmdstr.length)
              return 0;
            const cp = null;
            const ret = cp.spawnSync(cmdstr, [], { shell: true, stdio: "inherit" });
            const _W_EXITCODE = (ret2, sig) => ret2 << 8 | sig;
            if (ret.status === null) {
              const signalToNumber = (sig) => {
                switch (sig) {
                  case "SIGHUP":
                    return 1;
                  case "SIGINT":
                    return 2;
                  case "SIGQUIT":
                    return 3;
                  case "SIGFPE":
                    return 8;
                  case "SIGKILL":
                    return 9;
                  case "SIGALRM":
                    return 14;
                  case "SIGTERM":
                    return 15;
                }
                return 2;
              };
              return _W_EXITCODE(0, signalToNumber(ret.signal));
            }
            return _W_EXITCODE(ret.status, 0);
          }
          if (!command)
            return 0;
          setErrNo(52);
          return -1;
        }
        function intArrayFromString(stringy, dontAddNull, length) {
          const len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
          const u8array = new Array(len);
          const numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
          if (dontAddNull)
            u8array.length = numBytesWritten;
          return u8array;
        }
        var asmLibraryArg = { w: ___syscall_dup3, d: ___syscall_fcntl64, z: ___syscall_ioctl, r: ___syscall_lstat64, g: ___syscall_openat, s: ___syscall_renameat, t: ___syscall_rmdir, e: ___syscall_unlinkat, a: __emscripten_date_now, A: __emscripten_get_now_is_monotonic, p: __emscripten_throw_longjmp, B: __gmtime_js, C: __localtime_js, i: __mktime_js, j: __tzset_js, D: _abort, k: _emscripten_memcpy_big, q: _emscripten_resize_heap, u: _environ_get, v: _environ_sizes_get, l: _exit, c: _fd_close, y: _fd_read, o: _fd_seek, f: _fd_write, h: _getTempRet0, x: invoke_vii, b: _setTempRet0, n: _strftime, m: _system };
        const asm = createWasm();
        var ___wasm_call_ctors = Module2.___wasm_call_ctors = function() {
          return (___wasm_call_ctors = Module2.___wasm_call_ctors = Module2.asm.F).apply(null, arguments);
        };
        var _handle = Module2._handle = function() {
          return (_handle = Module2._handle = Module2.asm.G).apply(null, arguments);
        };
        var _main = Module2._main = function() {
          return (_main = Module2._main = Module2.asm.H).apply(null, arguments);
        };
        var _malloc = Module2._malloc = function() {
          return (_malloc = Module2._malloc = Module2.asm.J).apply(null, arguments);
        };
        var ___errno_location = Module2.___errno_location = function() {
          return (___errno_location = Module2.___errno_location = Module2.asm.K).apply(null, arguments);
        };
        var _setThrew = Module2._setThrew = function() {
          return (_setThrew = Module2._setThrew = Module2.asm.L).apply(null, arguments);
        };
        var stackSave = Module2.stackSave = function() {
          return (stackSave = Module2.stackSave = Module2.asm.M).apply(null, arguments);
        };
        var stackRestore = Module2.stackRestore = function() {
          return (stackRestore = Module2.stackRestore = Module2.asm.N).apply(null, arguments);
        };
        var stackAlloc = Module2.stackAlloc = function() {
          return (stackAlloc = Module2.stackAlloc = Module2.asm.O).apply(null, arguments);
        };
        function invoke_vii(index, a1, a2) {
          const sp = stackSave();
          try {
            getWasmTableEntry(index)(a1, a2);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
              throw e;
            _setThrew(1, 0);
          }
        }
        let MAGIC = 0;
        Math.random = () => {
          MAGIC = Math.pow(MAGIC + 1.8912, 3) % 1;
          return MAGIC;
        };
        let TIME = 1e4;
        Date.now = () => TIME++;
        if (typeof performance === "object")
          performance.now = Date.now;
        if (ENVIRONMENT_IS_NODE)
          process.hrtime = Date.now;
        if (!Module2)
          Module2 = {};
        Module2.thisProgram = "thisProgram";
        Module2.cwrap = cwrap;
        let calledRun;
        function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = "Program terminated with exit(" + status + ")";
          this.status = status;
        }
        let calledMain = false;
        dependenciesFulfilled = function runCaller() {
          if (!calledRun)
            run();
          if (!calledRun)
            dependenciesFulfilled = runCaller;
        };
        function callMain(args) {
          const entryFunction = Module2._main;
          const argc = 0;
          const argv = 0;
          try {
            const ret = entryFunction(argc, argv);
            exit(ret, true);
            return ret;
          } catch (e) {
            return handleException(e);
          } finally {
            calledMain = true;
          }
        }
        function run(args) {
          args = args || arguments_;
          if (runDependencies > 0) {
            return;
          }
          preRun();
          if (runDependencies > 0) {
            return;
          }
          function doRun() {
            if (calledRun)
              return;
            calledRun = true;
            Module2.calledRun = true;
            if (ABORT)
              return;
            initRuntime();
            preMain();
            readyPromiseResolve(Module2);
            if (Module2.onRuntimeInitialized)
              Module2.onRuntimeInitialized();
            if (shouldRunNow)
              callMain(args);
            postRun();
          }
          if (Module2.setStatus) {
            Module2.setStatus("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module2.setStatus("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
        }
        Module2.run = run;
        function exit(status, implicit) {
          EXITSTATUS = status;
          procExit(status);
        }
        function procExit(code) {
          EXITSTATUS = code;
          if (!keepRuntimeAlive()) {
            if (Module2.onExit)
              Module2.onExit(code);
            ABORT = true;
          }
          quit_(code, new ExitStatus(code));
        }
        if (Module2.preInit) {
          if (typeof Module2.preInit === "function")
            Module2.preInit = [Module2.preInit];
          while (Module2.preInit.length > 0) {
            Module2.preInit.pop()();
          }
        }
        var shouldRunNow = true;
        if (Module2.noInitialRun)
          shouldRunNow = false;
        run();
        Module2.resizeHeap = _emscripten_resize_heap;
        return Module2.ready;
      };
    })();
    module2.exports = Module;
  }
});

// src/formats/emscripten2.cjs
var require_emscripten2 = __commonJS({
  "src/formats/emscripten2.cjs"(exports2, module2) {
    var DEFAULT_GAS_LIMIT = 9e15;
    var Module = (() => {
      let _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : void 0;
      if (typeof __filename !== "undefined")
        _scriptDir = _scriptDir || __filename;
      return function(binaryOrInstantiate, { computeLimit, memoryLimit, extensions, format }) {
        var Module2 = Module2 || {};
        if (typeof binaryOrInstantiate === "function")
          Module2.instantiateWasm = binaryOrInstantiate;
        else
          Module2.wasmBinary = binaryOrInstantiate;
        Module2.gas = {
          limit: computeLimit || DEFAULT_GAS_LIMIT,
          used: 0,
          use: (amount) => {
            Module2.gas.used += amount;
          },
          refill: (amount) => {
            if (!amount)
              Module2.gas.used = 0;
            else
              Module2.gas.used = Math.max(Module2.gas.used - amount, 0);
          },
          isEmpty: () => Module2.gas.used > Module2.gas.limit
        };
        const _listeners_ = [];
        Module2.cleanupListeners = function() {
          _listeners_.forEach(([name, l]) => process.removeListener(name, l));
        };
        function uncaughtException(ex) {
          if (!(ex instanceof ExitStatus)) {
            throw ex;
          }
        }
        function unhandledRejection(reason) {
          throw reason;
        }
        _listeners_.push(
          ["uncaughtException", uncaughtException],
          ["unhandledRejection", unhandledRejection]
        );
        var Module2 = typeof Module2 != "undefined" ? Module2 : {};
        var readyPromiseResolve, readyPromiseReject;
        Module2["ready"] = new Promise(function(resolve, reject) {
          readyPromiseResolve = resolve;
          readyPromiseReject = reject;
        });
        if (!Object.getOwnPropertyDescriptor(Module2["ready"], "_main")) {
          Object.defineProperty(Module2["ready"], "_main", { configurable: true, get: function() {
            abort("You are getting _main on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
          } });
          Object.defineProperty(Module2["ready"], "_main", { configurable: true, set: function() {
            abort("You are setting _main on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
          } });
        }
        if (!Object.getOwnPropertyDescriptor(Module2["ready"], "_handle")) {
          Object.defineProperty(Module2["ready"], "_handle", { configurable: true, get: function() {
            abort("You are getting _handle on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
          } });
          Object.defineProperty(Module2["ready"], "_handle", { configurable: true, set: function() {
            abort("You are setting _handle on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
          } });
        }
        if (!Object.getOwnPropertyDescriptor(Module2["ready"], "_fflush")) {
          Object.defineProperty(Module2["ready"], "_fflush", { configurable: true, get: function() {
            abort("You are getting _fflush on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
          } });
          Object.defineProperty(Module2["ready"], "_fflush", { configurable: true, set: function() {
            abort("You are setting _fflush on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
          } });
        }
        if (!Object.getOwnPropertyDescriptor(Module2["ready"], "onRuntimeInitialized")) {
          Object.defineProperty(Module2["ready"], "onRuntimeInitialized", { configurable: true, get: function() {
            abort("You are getting onRuntimeInitialized on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
          } });
          Object.defineProperty(Module2["ready"], "onRuntimeInitialized", { configurable: true, set: function() {
            abort("You are setting onRuntimeInitialized on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js");
          } });
        }
        Module2.locateFile = (url) => {
          return url;
        };
        var moduleOverrides = Object.assign({}, Module2);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow) => {
          throw toThrow;
        };
        var ENVIRONMENT_IS_WEB = typeof window == "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
        var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
        var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        if (Module2["ENVIRONMENT"]) {
          throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
        }
        var scriptDirectory = "";
        function locateFile(path) {
          if (Module2["locateFile"]) {
            return Module2["locateFile"](path, scriptDirectory);
          }
          return scriptDirectory + path;
        }
        var read_, readAsync, readBinary, setWindowTitle;
        function logExceptionOnExit(e) {
          if (e instanceof ExitStatus)
            return;
          let toLog = e;
          if (e && typeof e == "object" && e.stack) {
            toLog = [e, e.stack];
          }
          err("exiting due to exception: " + toLog);
        }
        var fs;
        var nodePath;
        var requireNodeFS;
        if (ENVIRONMENT_IS_NODE) {
          if (!(typeof process == "object" && typeof require == "function"))
            throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = require("path").dirname(scriptDirectory) + "/";
          } else {
            scriptDirectory = __dirname + "/";
          }
          requireNodeFS = () => {
            if (!nodePath) {
              fs = require("fs");
              nodePath = require("path");
            }
          };
          read_ = function shell_read(filename, binary) {
            requireNodeFS();
            filename = nodePath["normalize"](filename);
            return fs.readFileSync(filename, binary ? void 0 : "utf8");
          };
          readBinary = (filename) => {
            var ret = read_(filename, true);
            if (!ret.buffer) {
              ret = new Uint8Array(ret);
            }
            assert(ret.buffer);
            return ret;
          };
          readAsync = (filename, onload, onerror) => {
            requireNodeFS();
            filename = nodePath["normalize"](filename);
            fs.readFile(filename, function(err2, data) {
              if (err2)
                onerror(err2);
              else
                onload(data.buffer);
            });
          };
          if (process["argv"].length > 1) {
            thisProgram = process["argv"][1].replace(/\\/g, "/");
          }
          arguments_ = process["argv"].slice(2);
          process["on"]("uncaughtException", uncaughtException);
          process["on"]("unhandledRejection", unhandledRejection);
          quit_ = (status, toThrow) => {
            if (keepRuntimeAlive()) {
              process["exitCode"] = status;
              throw toThrow;
            }
            logExceptionOnExit(toThrow);
            process["exit"](status);
          };
          Module2["inspect"] = function() {
            return "[Emscripten Module object]";
          };
        } else if (ENVIRONMENT_IS_SHELL) {
          if (typeof process == "object" && typeof require === "function" || typeof window == "object" || typeof importScripts == "function")
            throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          if (typeof read != "undefined") {
            read_ = function shell_read(f) {
              return read(f);
            };
          }
          readBinary = function readBinary2(f) {
            let data;
            if (typeof readbuffer == "function") {
              return new Uint8Array(readbuffer(f));
            }
            data = read(f, "binary");
            assert(typeof data == "object");
            return data;
          };
          readAsync = function readAsync2(f, onload, onerror) {
            setTimeout(() => onload(readBinary(f)), 0);
          };
          if (typeof scriptArgs != "undefined") {
            arguments_ = scriptArgs;
          } else if (typeof arguments != "undefined") {
            arguments_ = arguments;
          }
          if (typeof quit == "function") {
            quit_ = (status, toThrow) => {
              logExceptionOnExit(toThrow);
              quit(status);
            };
          }
          if (typeof print != "undefined") {
            if (typeof console == "undefined")
              console = /** @type{!Console} */
              {};
            console.log = /** @type{!function(this:Console, ...*): undefined} */
            print;
            console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */
            typeof printErr != "undefined" ? printErr : print;
          }
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else if (typeof document != "undefined" && document.currentScript) {
            scriptDirectory = document.currentScript.src;
          }
          if (_scriptDir) {
            scriptDirectory = _scriptDir;
          }
          if (scriptDirectory.indexOf("blob:") !== 0) {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
          } else {
            scriptDirectory = "";
          }
          if (!(typeof window == "object" || typeof importScripts == "function"))
            throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          {
            read_ = (url) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.send(null);
              return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = (url) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(
                  /** @type{!ArrayBuffer} */
                  xhr.response
                );
              };
            }
            readAsync = (url, onload, onerror) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, true);
              xhr.responseType = "arraybuffer";
              xhr.onload = () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                  onload(xhr.response);
                  return;
                }
                onerror();
              };
              xhr.onerror = onerror;
              xhr.send(null);
            };
          }
          setWindowTitle = (title) => document.title = title;
        } else {
          throw new Error("environment detection error");
        }
        var out = Module2["print"] || console.log.bind(console);
        var err = Module2["printErr"] || console.warn.bind(console);
        Object.assign(Module2, moduleOverrides);
        moduleOverrides = null;
        checkIncomingModuleAPI();
        if (Module2["arguments"])
          arguments_ = Module2["arguments"];
        legacyModuleProp("arguments", "arguments_");
        if (Module2["thisProgram"])
          thisProgram = Module2["thisProgram"];
        legacyModuleProp("thisProgram", "thisProgram");
        if (Module2["quit"])
          quit_ = Module2["quit"];
        legacyModuleProp("quit", "quit_");
        assert(typeof Module2["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["read"] == "undefined", "Module.read option was removed (modify read_ in JS)");
        assert(typeof Module2["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
        assert(typeof Module2["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
        assert(typeof Module2["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify setWindowTitle in JS)");
        assert(typeof Module2["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
        legacyModuleProp("read", "read_");
        legacyModuleProp("readAsync", "readAsync");
        legacyModuleProp("readBinary", "readBinary");
        legacyModuleProp("setWindowTitle", "setWindowTitle");
        var IDBFS = "IDBFS is no longer included by default; build with -lidbfs.js";
        var PROXYFS = "PROXYFS is no longer included by default; build with -lproxyfs.js";
        var WORKERFS = "WORKERFS is no longer included by default; build with -lworkerfs.js";
        var NODEFS = "NODEFS is no longer included by default; build with -lnodefs.js";
        assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add 'shell' to `-sENVIRONMENT` to enable.");
        var STACK_ALIGN = 16;
        var POINTER_SIZE = 4;
        function getNativeTypeSize(type) {
          switch (type) {
            case "i1":
            case "i8":
            case "u8":
              return 1;
            case "i16":
            case "u16":
              return 2;
            case "i32":
            case "u32":
              return 4;
            case "i64":
            case "u64":
              return 8;
            case "float":
              return 4;
            case "double":
              return 8;
            default: {
              if (type[type.length - 1] === "*") {
                return POINTER_SIZE;
              } else if (type[0] === "i") {
                const bits = Number(type.substr(1));
                assert(bits % 8 === 0, "getNativeTypeSize invalid bits " + bits + ", type " + type);
                return bits / 8;
              } else {
                return 0;
              }
            }
          }
        }
        function warnOnce(text) {
          if (!warnOnce.shown)
            warnOnce.shown = {};
          if (!warnOnce.shown[text]) {
            warnOnce.shown[text] = 1;
            err(text);
          }
        }
        function uleb128Encode(n) {
          assert(n < 16384);
          if (n < 128) {
            return [n];
          }
          return [n % 128 | 128, n >> 7];
        }
        function sigToWasmTypes(sig) {
          var typeNames = {
            "i": "i32",
            "j": "i64",
            "f": "f32",
            "d": "f64",
            "p": "i32"
          };
          var type = {
            parameters: [],
            results: sig[0] == "v" ? [] : [typeNames[sig[0]]]
          };
          for (var i = 1; i < sig.length; ++i) {
            assert(sig[i] in typeNames, "invalid signature char: " + sig[i]);
            type.parameters.push(typeNames[sig[i]]);
          }
          return type;
        }
        function convertJsFunctionToWasm(func, sig) {
          if (typeof WebAssembly.Function == "function") {
            return new WebAssembly.Function(sigToWasmTypes(sig), func);
          }
          var typeSection = [
            1,
            // count: 1
            96
            // form: func
          ];
          var sigRet = sig.slice(0, 1);
          var sigParam = sig.slice(1);
          var typeCodes = {
            "i": 127,
            // i32
            "p": 127,
            // i32
            "j": 126,
            // i64
            "f": 125,
            // f32
            "d": 124
            // f64
          };
          typeSection = typeSection.concat(uleb128Encode(sigParam.length));
          for (var i = 0; i < sigParam.length; ++i) {
            assert(sigParam[i] in typeCodes, "invalid signature char: " + sigParam[i]);
            typeSection.push(typeCodes[sigParam[i]]);
          }
          if (sigRet == "v") {
            typeSection.push(0);
          } else {
            typeSection = typeSection.concat([1, typeCodes[sigRet]]);
          }
          typeSection = [
            1
            /* Type section code */
          ].concat(
            uleb128Encode(typeSection.length),
            typeSection
          );
          var bytes = new Uint8Array([
            0,
            97,
            115,
            109,
            // magic ("\0asm")
            1,
            0,
            0,
            0
            // version: 1
          ].concat(typeSection, [
            2,
            7,
            // import section
            // (import "e" "f" (func 0 (type 0)))
            1,
            1,
            101,
            1,
            102,
            0,
            0,
            7,
            5,
            // export section
            // (export "f" (func 0 (type 0)))
            1,
            1,
            102,
            0,
            0
          ]));
          var module3 = new WebAssembly.Module(bytes);
          var instance = new WebAssembly.Instance(module3, {
            "e": {
              "f": func
            }
          });
          var wrappedFunc = instance.exports["f"];
          return wrappedFunc;
        }
        var freeTableIndexes = [];
        var functionsInTableMap;
        function getEmptyTableSlot() {
          if (freeTableIndexes.length) {
            return freeTableIndexes.pop();
          }
          try {
            wasmTable.grow(1);
          } catch (err2) {
            if (!(err2 instanceof RangeError)) {
              throw err2;
            }
            throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
          }
          return wasmTable.length - 1;
        }
        function updateTableMap(offset, count) {
          for (var i = offset; i < offset + count; i++) {
            var item = getWasmTableEntry(i);
            if (item) {
              functionsInTableMap.set(item, i);
            }
          }
        }
        function addFunction(func, sig) {
          assert(typeof func != "undefined");
          if (!functionsInTableMap) {
            functionsInTableMap = /* @__PURE__ */ new WeakMap();
            updateTableMap(0, wasmTable.length);
          }
          if (functionsInTableMap.has(func)) {
            return functionsInTableMap.get(func);
          }
          var ret = getEmptyTableSlot();
          try {
            setWasmTableEntry(ret, func);
          } catch (err2) {
            if (!(err2 instanceof TypeError)) {
              throw err2;
            }
            assert(typeof sig != "undefined", "Missing signature argument to addFunction: " + func);
            var wrapped = convertJsFunctionToWasm(func, sig);
            setWasmTableEntry(ret, wrapped);
          }
          functionsInTableMap.set(func, ret);
          return ret;
        }
        function removeFunction(index) {
          functionsInTableMap.delete(getWasmTableEntry(index));
          freeTableIndexes.push(index);
        }
        function legacyModuleProp(prop, newName) {
          if (!Object.getOwnPropertyDescriptor(Module2, prop)) {
            Object.defineProperty(Module2, prop, {
              configurable: true,
              get: function() {
                abort("Module." + prop + " has been replaced with plain " + newName + " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
              }
            });
          }
        }
        function ignoredModuleProp(prop) {
          if (Object.getOwnPropertyDescriptor(Module2, prop)) {
            abort("`Module." + prop + "` was supplied but `" + prop + "` not included in INCOMING_MODULE_JS_API");
          }
        }
        function unexportedMessage(sym, isFSSybol) {
          var msg = "'" + sym + "' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)";
          if (isFSSybol) {
            msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
          }
          return msg;
        }
        function unexportedRuntimeSymbol(sym, isFSSybol) {
          if (!Object.getOwnPropertyDescriptor(Module2, sym)) {
            Object.defineProperty(Module2, sym, {
              configurable: true,
              get: function() {
                abort(unexportedMessage(sym, isFSSybol));
              }
            });
          }
        }
        function unexportedRuntimeFunction(sym, isFSSybol) {
          if (!Object.getOwnPropertyDescriptor(Module2, sym)) {
            Module2[sym] = () => abort(unexportedMessage(sym, isFSSybol));
          }
        }
        var tempRet0 = 0;
        var setTempRet0 = (value) => {
          tempRet0 = value;
        };
        var getTempRet0 = () => tempRet0;
        var wasmBinary;
        if (Module2["wasmBinary"])
          wasmBinary = Module2["wasmBinary"];
        legacyModuleProp("wasmBinary", "wasmBinary");
        var noExitRuntime = Module2["noExitRuntime"] || true;
        legacyModuleProp("noExitRuntime", "noExitRuntime");
        if (typeof WebAssembly != "object") {
          abort("no native wasm support detected");
        }
        var wasmMemory;
        var ABORT = false;
        var EXITSTATUS;
        function assert(condition, text) {
          if (!condition) {
            abort("Assertion failed" + (text ? ": " + text : ""));
          }
        }
        function getCFunc(ident) {
          var func = Module2["_" + ident];
          assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
          return func;
        }
        function ccall(ident, returnType, argTypes, args, opts) {
          var toC = {
            "string": function(str) {
              var ret2 = 0;
              if (str !== null && str !== void 0 && str !== 0) {
                var len = (str.length << 2) + 1;
                ret2 = stackAlloc(len);
                stringToUTF8(str, ret2, len);
              }
              return ret2;
            },
            "array": function(arr) {
              var ret2 = stackAlloc(arr.length);
              writeArrayToMemory(arr, ret2);
              return ret2;
            }
          };
          function convertReturnValue(ret2) {
            if (returnType === "string") {
              return UTF8ToString(ret2);
            }
            if (returnType === "boolean")
              return Boolean(ret2);
            return ret2;
          }
          var func = getCFunc(ident);
          var cArgs = [];
          var stack = 0;
          assert(returnType !== "array", 'Return type should not be "array".');
          if (args) {
            for (var i = 0; i < args.length; i++) {
              var converter = toC[argTypes[i]];
              if (converter) {
                if (stack === 0)
                  stack = stackSave();
                cArgs[i] = converter(args[i]);
              } else {
                cArgs[i] = args[i];
              }
            }
          }
          var ret = func.apply(null, cArgs);
          function onDone(ret2) {
            if (stack !== 0)
              stackRestore(stack);
            return convertReturnValue(ret2);
          }
          ret = onDone(ret);
          return ret;
        }
        function cwrap(ident, returnType, argTypes, opts) {
          return function() {
            return ccall(ident, returnType, argTypes, arguments, opts);
          };
        }
        var ALLOC_NORMAL = 0;
        var ALLOC_STACK = 1;
        function allocate(slab, allocator) {
          var ret;
          assert(typeof allocator == "number", "allocate no longer takes a type argument");
          assert(typeof slab != "number", "allocate no longer takes a number as arg0");
          if (allocator == ALLOC_STACK) {
            ret = stackAlloc(slab.length);
          } else {
            ret = _malloc(slab.length);
          }
          if (!slab.subarray && !slab.slice) {
            slab = new Uint8Array(slab);
          }
          HEAPU8.set(slab, ret);
          return ret;
        }
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
        function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          while (heapOrArray[endPtr] && !(endPtr >= endIdx))
            ++endPtr;
          if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
          } else {
            var str = "";
            while (idx < endPtr) {
              var u0 = heapOrArray[idx++];
              if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue;
              }
              var u1 = heapOrArray[idx++] & 63;
              if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue;
              }
              var u2 = heapOrArray[idx++] & 63;
              if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2;
              } else {
                if ((u0 & 248) != 240)
                  warnOnce("Invalid UTF-8 leading byte 0x" + u0.toString(16) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
              }
              if (u0 < 65536) {
                str += String.fromCharCode(u0);
              } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
              }
            }
          }
          return str;
        }
        function UTF8ToString(ptr, maxBytesToRead) {
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        }
        function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
          if (!(maxBytesToWrite > 0))
            return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i);
              u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
              if (outIdx >= endIdx)
                break;
              heap[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx)
                break;
              heap[outIdx++] = 192 | u >> 6;
              heap[outIdx++] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx)
                break;
              heap[outIdx++] = 224 | u >> 12;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx)
                break;
              if (u > 1114111)
                warnOnce("Invalid Unicode code point 0x" + u.toString(16) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
              heap[outIdx++] = 240 | u >> 18;
              heap[outIdx++] = 128 | u >> 12 & 63;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            }
          }
          heap[outIdx] = 0;
          return outIdx - startIdx;
        }
        function stringToUTF8(str, outPtr, maxBytesToWrite) {
          assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        }
        function lengthBytesUTF8(str) {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343)
              u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
            if (u <= 127)
              ++len;
            else if (u <= 2047)
              len += 2;
            else if (u <= 65535)
              len += 3;
            else
              len += 4;
          }
          return len;
        }
        function AsciiToString(ptr) {
          var str = "";
          while (1) {
            var ch = HEAPU8[ptr++ >> 0];
            if (!ch)
              return str;
            str += String.fromCharCode(ch);
          }
        }
        function stringToAscii(str, outPtr) {
          return writeAsciiToMemory(str, outPtr, false);
        }
        var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : void 0;
        function UTF16ToString(ptr, maxBytesToRead) {
          assert(ptr % 2 == 0, "Pointer passed to UTF16ToString must be aligned to two bytes!");
          var endPtr = ptr;
          var idx = endPtr >> 1;
          var maxIdx = idx + maxBytesToRead / 2;
          while (!(idx >= maxIdx) && HEAPU16[idx])
            ++idx;
          endPtr = idx << 1;
          if (endPtr - ptr > 32 && UTF16Decoder) {
            return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
          } else {
            var str = "";
            for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
              var codeUnit = HEAP16[ptr + i * 2 >> 1];
              if (codeUnit == 0)
                break;
              str += String.fromCharCode(codeUnit);
            }
            return str;
          }
        }
        function stringToUTF16(str, outPtr, maxBytesToWrite) {
          assert(outPtr % 2 == 0, "Pointer passed to stringToUTF16 must be aligned to two bytes!");
          assert(typeof maxBytesToWrite == "number", "stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
          if (maxBytesToWrite === void 0) {
            maxBytesToWrite = 2147483647;
          }
          if (maxBytesToWrite < 2)
            return 0;
          maxBytesToWrite -= 2;
          var startPtr = outPtr;
          var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
          for (var i = 0; i < numCharsToWrite; ++i) {
            var codeUnit = str.charCodeAt(i);
            HEAP16[outPtr >> 1] = codeUnit;
            outPtr += 2;
          }
          HEAP16[outPtr >> 1] = 0;
          return outPtr - startPtr;
        }
        function lengthBytesUTF16(str) {
          return str.length * 2;
        }
        function UTF32ToString(ptr, maxBytesToRead) {
          assert(ptr % 4 == 0, "Pointer passed to UTF32ToString must be aligned to four bytes!");
          var i = 0;
          var str = "";
          while (!(i >= maxBytesToRead / 4)) {
            var utf32 = HEAP32[ptr + i * 4 >> 2];
            if (utf32 == 0)
              break;
            ++i;
            if (utf32 >= 65536) {
              var ch = utf32 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            } else {
              str += String.fromCharCode(utf32);
            }
          }
          return str;
        }
        function stringToUTF32(str, outPtr, maxBytesToWrite) {
          assert(outPtr % 4 == 0, "Pointer passed to stringToUTF32 must be aligned to four bytes!");
          assert(typeof maxBytesToWrite == "number", "stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
          if (maxBytesToWrite === void 0) {
            maxBytesToWrite = 2147483647;
          }
          if (maxBytesToWrite < 4)
            return 0;
          var startPtr = outPtr;
          var endPtr = startPtr + maxBytesToWrite - 4;
          for (var i = 0; i < str.length; ++i) {
            var codeUnit = str.charCodeAt(i);
            if (codeUnit >= 55296 && codeUnit <= 57343) {
              var trailSurrogate = str.charCodeAt(++i);
              codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
            }
            HEAP32[outPtr >> 2] = codeUnit;
            outPtr += 4;
            if (outPtr + 4 > endPtr)
              break;
          }
          HEAP32[outPtr >> 2] = 0;
          return outPtr - startPtr;
        }
        function lengthBytesUTF32(str) {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var codeUnit = str.charCodeAt(i);
            if (codeUnit >= 55296 && codeUnit <= 57343)
              ++i;
            len += 4;
          }
          return len;
        }
        function allocateUTF8(str) {
          var size = lengthBytesUTF8(str) + 1;
          var ret = _malloc(size);
          if (ret)
            stringToUTF8Array(str, HEAP8, ret, size);
          return ret;
        }
        function allocateUTF8OnStack(str) {
          var size = lengthBytesUTF8(str) + 1;
          var ret = stackAlloc(size);
          stringToUTF8Array(str, HEAP8, ret, size);
          return ret;
        }
        function writeStringToMemory(string, buffer2, dontAddNull) {
          warnOnce("writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!");
          var lastChar, end;
          if (dontAddNull) {
            end = buffer2 + lengthBytesUTF8(string);
            lastChar = HEAP8[end];
          }
          stringToUTF8(string, buffer2, Infinity);
          if (dontAddNull)
            HEAP8[end] = lastChar;
        }
        function writeArrayToMemory(array, buffer2) {
          assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
          HEAP8.set(array, buffer2);
        }
        function writeAsciiToMemory(str, buffer2, dontAddNull) {
          for (var i = 0; i < str.length; ++i) {
            assert(str.charCodeAt(i) === (str.charCodeAt(i) & 255));
            HEAP8[buffer2++ >> 0] = str.charCodeAt(i);
          }
          if (!dontAddNull)
            HEAP8[buffer2 >> 0] = 0;
        }
        var HEAP, buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        function updateGlobalBufferAndViews(buf) {
          buffer = buf;
          Module2["HEAP8"] = HEAP8 = new Int8Array(buf);
          Module2["HEAP16"] = HEAP16 = new Int16Array(buf);
          Module2["HEAP32"] = HEAP32 = new Int32Array(buf);
          Module2["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
          Module2["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
          Module2["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
          Module2["HEAPF32"] = HEAPF32 = new Float32Array(buf);
          Module2["HEAPF64"] = HEAPF64 = new Float64Array(buf);
        }
        var TOTAL_STACK = 5242880;
        if (Module2["TOTAL_STACK"])
          assert(TOTAL_STACK === Module2["TOTAL_STACK"], "the stack size can no longer be determined at runtime");
        var INITIAL_MEMORY = Module2["INITIAL_MEMORY"] || 6291456;
        legacyModuleProp("INITIAL_MEMORY", "INITIAL_MEMORY");
        assert(INITIAL_MEMORY >= TOTAL_STACK, "INITIAL_MEMORY should be larger than TOTAL_STACK, was " + INITIAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
        assert(
          typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != void 0 && Int32Array.prototype.set != void 0,
          "JS engine does not provide full typed array support"
        );
        assert(!Module2["wasmMemory"], "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");
        assert(INITIAL_MEMORY == 6291456, "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
        var wasmTable;
        function writeStackCookie() {
          var max = _emscripten_stack_get_end();
          assert((max & 3) == 0);
          HEAP32[max >> 2] = 34821223;
          HEAP32[max + 4 >> 2] = 2310721022;
          HEAPU32[0] = 1668509029;
        }
        function checkStackCookie() {
          if (ABORT)
            return;
          var max = _emscripten_stack_get_end();
          var cookie1 = HEAPU32[max >> 2];
          var cookie2 = HEAPU32[max + 4 >> 2];
          if (cookie1 != 34821223 || cookie2 != 2310721022) {
            abort("Stack overflow! Stack cookie has been overwritten at 0x" + max.toString(16) + ", expected hex dwords 0x89BACDFE and 0x2135467, but received 0x" + cookie2.toString(16) + " 0x" + cookie1.toString(16));
          }
          if (HEAPU32[0] !== 1668509029)
            abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
        }
        (function() {
          var h16 = new Int16Array(1);
          var h8 = new Int8Array(h16.buffer);
          h16[0] = 25459;
          if (h8[0] !== 115 || h8[1] !== 99)
            throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
        })();
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATEXIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        function keepRuntimeAlive() {
          return noExitRuntime;
        }
        function preRun() {
          if (Module2["preRun"]) {
            if (typeof Module2["preRun"] == "function")
              Module2["preRun"] = [Module2["preRun"]];
            while (Module2["preRun"].length) {
              addOnPreRun(Module2["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          assert(!runtimeInitialized);
          runtimeInitialized = true;
          checkStackCookie();
          if (!Module2["noFSInit"] && !FS.init.initialized)
            FS.init();
          FS.ignorePermissions = false;
          TTY.init();
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          checkStackCookie();
          callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
          checkStackCookie();
          if (Module2["postRun"]) {
            if (typeof Module2["postRun"] == "function")
              Module2["postRun"] = [Module2["postRun"]];
            while (Module2["postRun"].length) {
              addOnPostRun(Module2["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
          __ATINIT__.unshift(cb);
        }
        function addOnPreMain(cb) {
          __ATMAIN__.unshift(cb);
        }
        function addOnExit(cb) {
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        var runDependencyTracking = {};
        function getUniqueRunDependency(id) {
          var orig = id;
          while (1) {
            if (!runDependencyTracking[id])
              return id;
            id = orig + Math.random();
          }
        }
        function addRunDependency(id) {
          runDependencies++;
          if (Module2["monitorRunDependencies"]) {
            Module2["monitorRunDependencies"](runDependencies);
          }
          if (id) {
            assert(!runDependencyTracking[id]);
            runDependencyTracking[id] = 1;
            if (runDependencyWatcher === null && typeof setInterval != "undefined") {
              runDependencyWatcher = setInterval(function() {
                if (ABORT) {
                  clearInterval(runDependencyWatcher);
                  runDependencyWatcher = null;
                  return;
                }
                var shown = false;
                for (var dep in runDependencyTracking) {
                  if (!shown) {
                    shown = true;
                    err("still waiting on run dependencies:");
                  }
                  err("dependency: " + dep);
                }
                if (shown) {
                  err("(end of list)");
                }
              }, 1e4);
            }
          } else {
            err("warning: run dependency added without ID");
          }
        }
        function removeRunDependency(id) {
          runDependencies--;
          if (Module2["monitorRunDependencies"]) {
            Module2["monitorRunDependencies"](runDependencies);
          }
          if (id) {
            assert(runDependencyTracking[id]);
            delete runDependencyTracking[id];
          } else {
            err("warning: run dependency removed without ID");
          }
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        function abort(what) {
          {
            if (Module2["onAbort"]) {
              Module2["onAbort"](what);
            }
          }
          what = "Aborted(" + what + ")";
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          var e = new WebAssembly.RuntimeError(what);
          readyPromiseReject(e);
          throw e;
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        function isDataURI(filename) {
          return filename.startsWith(dataURIPrefix);
        }
        function isFileURI(filename) {
          return filename.startsWith("file://");
        }
        function createExportWrapper(name, fixedasm) {
          return function() {
            var displayName = name;
            var asm2 = fixedasm;
            if (!fixedasm) {
              asm2 = Module2["asm"];
            }
            assert(runtimeInitialized, "native function `" + displayName + "` called before runtime initialization");
            if (!asm2[name]) {
              assert(asm2[name], "exported native function `" + displayName + "` not found");
            }
            return asm2[name].apply(null, arguments);
          };
        }
        var wasmBinaryFile;
        wasmBinaryFile = "process.wasm";
        if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinary(file) {
          try {
            if (file == wasmBinaryFile && wasmBinary) {
              return new Uint8Array(wasmBinary);
            }
            if (readBinary) {
              return readBinary(file);
            } else {
              throw "both async and sync fetching of the wasm failed";
            }
          } catch (err2) {
            abort(err2);
          }
        }
        function getBinaryPromise() {
          if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
            if (typeof fetch == "function" && !isFileURI(wasmBinaryFile)) {
              return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
                if (!response["ok"]) {
                  throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
                }
                return response["arrayBuffer"]();
              }).catch(function() {
                return getBinary(wasmBinaryFile);
              });
            } else {
              if (readAsync) {
                return new Promise(function(resolve, reject) {
                  readAsync(wasmBinaryFile, function(response) {
                    resolve(new Uint8Array(
                      /** @type{!ArrayBuffer} */
                      response
                    ));
                  }, reject);
                });
              }
            }
          }
          return Promise.resolve().then(function() {
            return getBinary(wasmBinaryFile);
          });
        }
        function createWasm() {
          var info = {
            "env": asmLibraryArg,
            "wasi_snapshot_preview1": asmLibraryArg,
            metering: { usegas: function(gas) {
              Module2.gas.use(gas);
              if (Module2.gas.isEmpty())
                throw Error("out of gas!");
            } }
          };
          function receiveInstance(instance, module3) {
            var exports4 = instance.exports;
            Module2["asm"] = exports4;
            wasmMemory = Module2["asm"]["memory"];
            assert(wasmMemory, "memory not found in wasm exports");
            updateGlobalBufferAndViews(wasmMemory.buffer);
            wasmTable = Module2["asm"]["__indirect_function_table"];
            assert(wasmTable, "table not found in wasm exports");
            addOnInit(Module2["asm"]["__wasm_call_ctors"]);
            removeRunDependency("wasm-instantiate");
          }
          addRunDependency("wasm-instantiate");
          var trueModule = Module2;
          function receiveInstantiationResult(result) {
            assert(Module2 === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
            trueModule = null;
            receiveInstance(result["instance"]);
          }
          function instantiateArrayBuffer(receiver) {
            return getBinaryPromise().then(function(binary) {
              return WebAssembly.instantiate(binary, info);
            }).then(function(instance) {
              return instance;
            }).then(receiver, function(reason) {
              err("failed to asynchronously prepare wasm: " + reason);
              if (isFileURI(wasmBinaryFile)) {
                err("warning: Loading from a file URI (" + wasmBinaryFile + ") is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing");
              }
              abort(reason);
            });
          }
          function instantiateAsync() {
            if (!wasmBinary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(wasmBinaryFile) && // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
            !isFileURI(wasmBinaryFile) && // Avoid instantiateStreaming() on Node.js environment for now, as while
            // Node.js v18.1.0 implements it, it does not have a full fetch()
            // implementation yet.
            //
            // Reference:
            //   https://github.com/emscripten-core/emscripten/pull/16917
            !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
              return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
                var result = WebAssembly.instantiateStreaming(response, info);
                return result.then(
                  receiveInstantiationResult,
                  function(reason) {
                    err("wasm streaming compile failed: " + reason);
                    err("falling back to ArrayBuffer instantiation");
                    return instantiateArrayBuffer(receiveInstantiationResult);
                  }
                );
              });
            } else {
              return instantiateArrayBuffer(receiveInstantiationResult);
            }
          }
          if (Module2["instantiateWasm"]) {
            try {
              var exports3 = Module2["instantiateWasm"](info, receiveInstance);
              return exports3;
            } catch (e) {
              err("Module.instantiateWasm callback failed with error: " + e);
              return false;
            }
          }
          instantiateAsync().catch(readyPromiseReject);
          return {};
        }
        var tempDouble;
        var tempI64;
        var ASM_CONSTS = {};
        function callRuntimeCallbacks(callbacks) {
          while (callbacks.length > 0) {
            var callback = callbacks.shift();
            if (typeof callback == "function") {
              callback(Module2);
              continue;
            }
            var func = callback.func;
            if (typeof func == "number") {
              if (callback.arg === void 0) {
                getWasmTableEntry(func)();
              } else {
                getWasmTableEntry(func)(callback.arg);
              }
            } else {
              func(callback.arg === void 0 ? null : callback.arg);
            }
          }
        }
        function withStackSave(f) {
          var stack = stackSave();
          var ret = f();
          stackRestore(stack);
          return ret;
        }
        function demangle(func) {
          warnOnce("warning: build with -sDEMANGLE_SUPPORT to link in libcxxabi demangling");
          return func;
        }
        function demangleAll(text) {
          var regex = /\b_Z[\w\d_]+/g;
          return text.replace(
            regex,
            function(x) {
              var y = demangle(x);
              return x === y ? x : y + " [" + x + "]";
            }
          );
        }
        function getValue(ptr, type = "i8") {
          if (type.endsWith("*"))
            type = "i32";
          switch (type) {
            case "i1":
              return HEAP8[ptr >> 0];
            case "i8":
              return HEAP8[ptr >> 0];
            case "i16":
              return HEAP16[ptr >> 1];
            case "i32":
              return HEAP32[ptr >> 2];
            case "i64":
              return HEAP32[ptr >> 2];
            case "float":
              return HEAPF32[ptr >> 2];
            case "double":
              return Number(HEAPF64[ptr >> 3]);
            default:
              abort("invalid type for getValue: " + type);
          }
          return null;
        }
        var wasmTableMirror = [];
        function getWasmTableEntry(funcPtr) {
          var func = wasmTableMirror[funcPtr];
          if (!func) {
            if (funcPtr >= wasmTableMirror.length)
              wasmTableMirror.length = funcPtr + 1;
            wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
          }
          assert(wasmTable.get(funcPtr) == func, "JavaScript-side Wasm function table mirror is out of date!");
          return func;
        }
        function handleException(e) {
          if (e instanceof ExitStatus || e == "unwind") {
            return EXITSTATUS;
          }
          quit_(1, e);
        }
        function jsStackTrace() {
          var error = new Error();
          if (!error.stack) {
            try {
              throw new Error();
            } catch (e) {
              error = e;
            }
            if (!error.stack) {
              return "(no stack trace available)";
            }
          }
          return error.stack.toString();
        }
        function setValue(ptr, value, type = "i8") {
          if (type.endsWith("*"))
            type = "i32";
          switch (type) {
            case "i1":
              HEAP8[ptr >> 0] = value;
              break;
            case "i8":
              HEAP8[ptr >> 0] = value;
              break;
            case "i16":
              HEAP16[ptr >> 1] = value;
              break;
            case "i32":
              HEAP32[ptr >> 2] = value;
              break;
            case "i64":
              tempI64 = [value >>> 0, (tempDouble = value, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
              break;
            case "float":
              HEAPF32[ptr >> 2] = value;
              break;
            case "double":
              HEAPF64[ptr >> 3] = value;
              break;
            default:
              abort("invalid type for setValue: " + type);
          }
        }
        function setWasmTableEntry(idx, func) {
          wasmTable.set(idx, func);
          wasmTableMirror[idx] = wasmTable.get(idx);
        }
        function stackTrace() {
          var js = jsStackTrace();
          if (Module2["extraStackTrace"])
            js += "\n" + Module2["extraStackTrace"]();
          return demangleAll(js);
        }
        function ___assert_fail(condition, filename, line, func) {
          abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]);
        }
        var PATH = {
          isAbs: (path) => path.charAt(0) === "/",
          splitPath: (filename) => {
            var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            return splitPathRe.exec(filename).slice(1);
          },
          normalizeArray: (parts, allowAboveRoot) => {
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
              var last = parts[i];
              if (last === ".") {
                parts.splice(i, 1);
              } else if (last === "..") {
                parts.splice(i, 1);
                up++;
              } else if (up) {
                parts.splice(i, 1);
                up--;
              }
            }
            if (allowAboveRoot) {
              for (; up; up--) {
                parts.unshift("..");
              }
            }
            return parts;
          },
          normalize: (path) => {
            var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
            path = PATH.normalizeArray(path.split("/").filter((p) => !!p), !isAbsolute).join("/");
            if (!path && !isAbsolute) {
              path = ".";
            }
            if (path && trailingSlash) {
              path += "/";
            }
            return (isAbsolute ? "/" : "") + path;
          },
          dirname: (path) => {
            var result = PATH.splitPath(path), root = result[0], dir = result[1];
            if (!root && !dir) {
              return ".";
            }
            if (dir) {
              dir = dir.substr(0, dir.length - 1);
            }
            return root + dir;
          },
          basename: (path) => {
            if (path === "/")
              return "/";
            path = PATH.normalize(path);
            path = path.replace(/\/$/, "");
            var lastSlash = path.lastIndexOf("/");
            if (lastSlash === -1)
              return path;
            return path.substr(lastSlash + 1);
          },
          join: function() {
            var paths = Array.prototype.slice.call(arguments, 0);
            return PATH.normalize(paths.join("/"));
          },
          join2: (l, r) => {
            return PATH.normalize(l + "/" + r);
          }
        };
        function getRandomDevice() {
          if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
            var randomBuffer = new Uint8Array(1);
            return function() {
              crypto.getRandomValues(randomBuffer);
              return randomBuffer[0];
            };
          } else if (ENVIRONMENT_IS_NODE) {
            try {
              var crypto_module = require("crypto");
              return function() {
                return crypto_module["randomBytes"](1)[0];
              };
            } catch (e) {
            }
          }
          return function() {
            abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
          };
        }
        var PATH_FS = {
          resolve: function() {
            var resolvedPath = "", resolvedAbsolute = false;
            for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
              var path = i >= 0 ? arguments[i] : FS.cwd();
              if (typeof path != "string") {
                throw new TypeError("Arguments to path.resolve must be strings");
              } else if (!path) {
                return "";
              }
              resolvedPath = path + "/" + resolvedPath;
              resolvedAbsolute = PATH.isAbs(path);
            }
            resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p) => !!p), !resolvedAbsolute).join("/");
            return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
          },
          relative: (from, to) => {
            from = PATH_FS.resolve(from).substr(1);
            to = PATH_FS.resolve(to).substr(1);
            function trim(arr) {
              var start = 0;
              for (; start < arr.length; start++) {
                if (arr[start] !== "")
                  break;
              }
              var end = arr.length - 1;
              for (; end >= 0; end--) {
                if (arr[end] !== "")
                  break;
              }
              if (start > end)
                return [];
              return arr.slice(start, end - start + 1);
            }
            var fromParts = trim(from.split("/"));
            var toParts = trim(to.split("/"));
            var length = Math.min(fromParts.length, toParts.length);
            var samePartsLength = length;
            for (var i = 0; i < length; i++) {
              if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
              }
            }
            var outputParts = [];
            for (var i = samePartsLength; i < fromParts.length; i++) {
              outputParts.push("..");
            }
            outputParts = outputParts.concat(toParts.slice(samePartsLength));
            return outputParts.join("/");
          }
        };
        var TTY = {
          ttys: [],
          init: function() {
          },
          shutdown: function() {
          },
          register: function(dev, ops) {
            TTY.ttys[dev] = { input: [], output: [], ops };
            FS.registerDevice(dev, TTY.stream_ops);
          },
          stream_ops: {
            open: function(stream) {
              var tty = TTY.ttys[stream.node.rdev];
              if (!tty) {
                throw new FS.ErrnoError(43);
              }
              stream.tty = tty;
              stream.seekable = false;
            },
            close: function(stream) {
              stream.tty.ops.flush(stream.tty);
            },
            flush: function(stream) {
              stream.tty.ops.flush(stream.tty);
            },
            read: function(stream, buffer2, offset, length, pos) {
              if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(60);
              }
              var bytesRead = 0;
              for (var i = 0; i < length; i++) {
                var result;
                try {
                  result = stream.tty.ops.get_char(stream.tty);
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
                if (result === void 0 && bytesRead === 0) {
                  throw new FS.ErrnoError(6);
                }
                if (result === null || result === void 0)
                  break;
                bytesRead++;
                buffer2[offset + i] = result;
              }
              if (bytesRead) {
                stream.node.timestamp = Date.now();
              }
              return bytesRead;
            },
            write: function(stream, buffer2, offset, length, pos) {
              if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(60);
              }
              try {
                for (var i = 0; i < length; i++) {
                  stream.tty.ops.put_char(stream.tty, buffer2[offset + i]);
                }
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (length) {
                stream.node.timestamp = Date.now();
              }
              return i;
            }
          },
          default_tty_ops: {
            get_char: function(tty) {
              if (!tty.input.length) {
                var result = null;
                if (ENVIRONMENT_IS_NODE) {
                  var BUFSIZE = 256;
                  var buf = Buffer.alloc(BUFSIZE);
                  var bytesRead = 0;
                  try {
                    bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, -1);
                  } catch (e) {
                    if (e.toString().includes("EOF"))
                      bytesRead = 0;
                    else
                      throw e;
                  }
                  if (bytesRead > 0) {
                    result = buf.slice(0, bytesRead).toString("utf-8");
                  } else {
                    result = null;
                  }
                } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                  result = window.prompt("Input: ");
                  if (result !== null) {
                    result += "\n";
                  }
                } else if (typeof readline == "function") {
                  result = readline();
                  if (result !== null) {
                    result += "\n";
                  }
                }
                if (!result) {
                  return null;
                }
                tty.input = intArrayFromString(result, true);
              }
              return tty.input.shift();
            },
            put_char: function(tty, val) {
              if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              } else {
                if (val != 0)
                  tty.output.push(val);
              }
            },
            flush: function(tty) {
              if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              }
            }
          },
          default_tty1_ops: {
            put_char: function(tty, val) {
              if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              } else {
                if (val != 0)
                  tty.output.push(val);
              }
            },
            flush: function(tty) {
              if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              }
            }
          }
        };
        function zeroMemory(address, size) {
          HEAPU8.fill(0, address, address + size);
        }
        function alignMemory(size, alignment) {
          assert(alignment, "alignment argument is required");
          return Math.ceil(size / alignment) * alignment;
        }
        function mmapAlloc(size) {
          size = alignMemory(size, 65536);
          var ptr = _emscripten_builtin_memalign(65536, size);
          if (!ptr)
            return 0;
          zeroMemory(ptr, size);
          return ptr;
        }
        var MEMFS = {
          ops_table: null,
          mount: function(mount) {
            return MEMFS.createNode(null, "/", 16384 | 511, 0);
          },
          createNode: function(parent, name, mode, dev) {
            if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
              throw new FS.ErrnoError(63);
            }
            if (!MEMFS.ops_table) {
              MEMFS.ops_table = {
                dir: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                    lookup: MEMFS.node_ops.lookup,
                    mknod: MEMFS.node_ops.mknod,
                    rename: MEMFS.node_ops.rename,
                    unlink: MEMFS.node_ops.unlink,
                    rmdir: MEMFS.node_ops.rmdir,
                    readdir: MEMFS.node_ops.readdir,
                    symlink: MEMFS.node_ops.symlink
                  },
                  stream: {
                    llseek: MEMFS.stream_ops.llseek
                  }
                },
                file: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr
                  },
                  stream: {
                    llseek: MEMFS.stream_ops.llseek,
                    read: MEMFS.stream_ops.read,
                    write: MEMFS.stream_ops.write,
                    allocate: MEMFS.stream_ops.allocate,
                    mmap: MEMFS.stream_ops.mmap,
                    msync: MEMFS.stream_ops.msync
                  }
                },
                link: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                    readlink: MEMFS.node_ops.readlink
                  },
                  stream: {}
                },
                chrdev: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr
                  },
                  stream: FS.chrdev_stream_ops
                }
              };
            }
            var node = FS.createNode(parent, name, mode, dev);
            if (FS.isDir(node.mode)) {
              node.node_ops = MEMFS.ops_table.dir.node;
              node.stream_ops = MEMFS.ops_table.dir.stream;
              node.contents = {};
            } else if (FS.isFile(node.mode)) {
              node.node_ops = MEMFS.ops_table.file.node;
              node.stream_ops = MEMFS.ops_table.file.stream;
              node.usedBytes = 0;
              node.contents = null;
            } else if (FS.isLink(node.mode)) {
              node.node_ops = MEMFS.ops_table.link.node;
              node.stream_ops = MEMFS.ops_table.link.stream;
            } else if (FS.isChrdev(node.mode)) {
              node.node_ops = MEMFS.ops_table.chrdev.node;
              node.stream_ops = MEMFS.ops_table.chrdev.stream;
            }
            node.timestamp = Date.now();
            if (parent) {
              parent.contents[name] = node;
              parent.timestamp = node.timestamp;
            }
            return node;
          },
          getFileDataAsTypedArray: function(node) {
            if (!node.contents)
              return new Uint8Array(0);
            if (node.contents.subarray)
              return node.contents.subarray(0, node.usedBytes);
            return new Uint8Array(node.contents);
          },
          expandFileStorage: function(node, newCapacity) {
            var prevCapacity = node.contents ? node.contents.length : 0;
            if (prevCapacity >= newCapacity)
              return;
            var CAPACITY_DOUBLING_MAX = 1024 * 1024;
            newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
            if (prevCapacity != 0)
              newCapacity = Math.max(newCapacity, 256);
            var oldContents = node.contents;
            node.contents = new Uint8Array(newCapacity);
            if (node.usedBytes > 0)
              node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
          },
          resizeFileStorage: function(node, newSize) {
            if (node.usedBytes == newSize)
              return;
            if (newSize == 0) {
              node.contents = null;
              node.usedBytes = 0;
            } else {
              var oldContents = node.contents;
              node.contents = new Uint8Array(newSize);
              if (oldContents) {
                node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
              }
              node.usedBytes = newSize;
            }
          },
          node_ops: {
            getattr: function(node) {
              var attr = {};
              attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
              attr.ino = node.id;
              attr.mode = node.mode;
              attr.nlink = 1;
              attr.uid = 0;
              attr.gid = 0;
              attr.rdev = node.rdev;
              if (FS.isDir(node.mode)) {
                attr.size = 4096;
              } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes;
              } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length;
              } else {
                attr.size = 0;
              }
              attr.atime = new Date(node.timestamp);
              attr.mtime = new Date(node.timestamp);
              attr.ctime = new Date(node.timestamp);
              attr.blksize = 4096;
              attr.blocks = Math.ceil(attr.size / attr.blksize);
              return attr;
            },
            setattr: function(node, attr) {
              if (attr.mode !== void 0) {
                node.mode = attr.mode;
              }
              if (attr.timestamp !== void 0) {
                node.timestamp = attr.timestamp;
              }
              if (attr.size !== void 0) {
                MEMFS.resizeFileStorage(node, attr.size);
              }
            },
            lookup: function(parent, name) {
              throw FS.genericErrors[44];
            },
            mknod: function(parent, name, mode, dev) {
              return MEMFS.createNode(parent, name, mode, dev);
            },
            rename: function(old_node, new_dir, new_name) {
              if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                  new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {
                }
                if (new_node) {
                  for (var i in new_node.contents) {
                    throw new FS.ErrnoError(55);
                  }
                }
              }
              delete old_node.parent.contents[old_node.name];
              old_node.parent.timestamp = Date.now();
              old_node.name = new_name;
              new_dir.contents[new_name] = old_node;
              new_dir.timestamp = old_node.parent.timestamp;
              old_node.parent = new_dir;
            },
            unlink: function(parent, name) {
              delete parent.contents[name];
              parent.timestamp = Date.now();
            },
            rmdir: function(parent, name) {
              var node = FS.lookupNode(parent, name);
              for (var i in node.contents) {
                throw new FS.ErrnoError(55);
              }
              delete parent.contents[name];
              parent.timestamp = Date.now();
            },
            readdir: function(node) {
              var entries = [".", ".."];
              for (var key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                  continue;
                }
                entries.push(key);
              }
              return entries;
            },
            symlink: function(parent, newname, oldpath) {
              var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
              node.link = oldpath;
              return node;
            },
            readlink: function(node) {
              if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(28);
              }
              return node.link;
            }
          },
          stream_ops: {
            read: function(stream, buffer2, offset, length, position) {
              var contents = stream.node.contents;
              if (position >= stream.node.usedBytes)
                return 0;
              var size = Math.min(stream.node.usedBytes - position, length);
              assert(size >= 0);
              if (size > 8 && contents.subarray) {
                buffer2.set(contents.subarray(position, position + size), offset);
              } else {
                for (var i = 0; i < size; i++)
                  buffer2[offset + i] = contents[position + i];
              }
              return size;
            },
            write: function(stream, buffer2, offset, length, position, canOwn) {
              assert(!(buffer2 instanceof ArrayBuffer));
              if (buffer2.buffer === HEAP8.buffer) {
                canOwn = false;
              }
              if (!length)
                return 0;
              var node = stream.node;
              node.timestamp = Date.now();
              if (buffer2.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                  assert(position === 0, "canOwn must imply no weird position inside the file");
                  node.contents = buffer2.subarray(offset, offset + length);
                  node.usedBytes = length;
                  return length;
                } else if (node.usedBytes === 0 && position === 0) {
                  node.contents = buffer2.slice(offset, offset + length);
                  node.usedBytes = length;
                  return length;
                } else if (position + length <= node.usedBytes) {
                  node.contents.set(buffer2.subarray(offset, offset + length), position);
                  return length;
                }
              }
              MEMFS.expandFileStorage(node, position + length);
              if (node.contents.subarray && buffer2.subarray) {
                node.contents.set(buffer2.subarray(offset, offset + length), position);
              } else {
                for (var i = 0; i < length; i++) {
                  node.contents[position + i] = buffer2[offset + i];
                }
              }
              node.usedBytes = Math.max(node.usedBytes, position + length);
              return length;
            },
            llseek: function(stream, offset, whence) {
              var position = offset;
              if (whence === 1) {
                position += stream.position;
              } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                  position += stream.node.usedBytes;
                }
              }
              if (position < 0) {
                throw new FS.ErrnoError(28);
              }
              return position;
            },
            allocate: function(stream, offset, length) {
              MEMFS.expandFileStorage(stream.node, offset + length);
              stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
            },
            mmap: function(stream, length, position, prot, flags) {
              if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
              }
              var ptr;
              var allocated;
              var contents = stream.node.contents;
              if (!(flags & 2) && contents.buffer === buffer) {
                allocated = false;
                ptr = contents.byteOffset;
              } else {
                if (position > 0 || position + length < contents.length) {
                  if (contents.subarray) {
                    contents = contents.subarray(position, position + length);
                  } else {
                    contents = Array.prototype.slice.call(contents, position, position + length);
                  }
                }
                allocated = true;
                ptr = mmapAlloc(length);
                if (!ptr) {
                  throw new FS.ErrnoError(48);
                }
                HEAP8.set(contents, ptr);
              }
              return { ptr, allocated };
            },
            msync: function(stream, buffer2, offset, length, mmapFlags) {
              if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
              }
              if (mmapFlags & 2) {
                return 0;
              }
              var bytesWritten = MEMFS.stream_ops.write(stream, buffer2, 0, length, offset, false);
              return 0;
            }
          }
        };
        function asyncLoad(url, onload, onerror, noRunDep) {
          var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
          readAsync(url, function(arrayBuffer) {
            assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
            onload(new Uint8Array(arrayBuffer));
            if (dep)
              removeRunDependency(dep);
          }, function(event) {
            if (onerror) {
              onerror();
            } else {
              throw 'Loading data file "' + url + '" failed.';
            }
          });
          if (dep)
            addRunDependency(dep);
        }
        var ERRNO_MESSAGES = { 0: "Success", 1: "Arg list too long", 2: "Permission denied", 3: "Address already in use", 4: "Address not available", 5: "Address family not supported by protocol family", 6: "No more processes", 7: "Socket already connected", 8: "Bad file number", 9: "Trying to read unreadable message", 10: "Mount device busy", 11: "Operation canceled", 12: "No children", 13: "Connection aborted", 14: "Connection refused", 15: "Connection reset by peer", 16: "File locking deadlock error", 17: "Destination address required", 18: "Math arg out of domain of func", 19: "Quota exceeded", 20: "File exists", 21: "Bad address", 22: "File too large", 23: "Host is unreachable", 24: "Identifier removed", 25: "Illegal byte sequence", 26: "Connection already in progress", 27: "Interrupted system call", 28: "Invalid argument", 29: "I/O error", 30: "Socket is already connected", 31: "Is a directory", 32: "Too many symbolic links", 33: "Too many open files", 34: "Too many links", 35: "Message too long", 36: "Multihop attempted", 37: "File or path name too long", 38: "Network interface is not configured", 39: "Connection reset by network", 40: "Network is unreachable", 41: "Too many open files in system", 42: "No buffer space available", 43: "No such device", 44: "No such file or directory", 45: "Exec format error", 46: "No record locks available", 47: "The link has been severed", 48: "Not enough core", 49: "No message of desired type", 50: "Protocol not available", 51: "No space left on device", 52: "Function not implemented", 53: "Socket is not connected", 54: "Not a directory", 55: "Directory not empty", 56: "State not recoverable", 57: "Socket operation on non-socket", 59: "Not a typewriter", 60: "No such device or address", 61: "Value too large for defined data type", 62: "Previous owner died", 63: "Not super-user", 64: "Broken pipe", 65: "Protocol error", 66: "Unknown protocol", 67: "Protocol wrong type for socket", 68: "Math result not representable", 69: "Read only file system", 70: "Illegal seek", 71: "No such process", 72: "Stale file handle", 73: "Connection timed out", 74: "Text file busy", 75: "Cross-device link", 100: "Device not a stream", 101: "Bad font file fmt", 102: "Invalid slot", 103: "Invalid request code", 104: "No anode", 105: "Block device required", 106: "Channel number out of range", 107: "Level 3 halted", 108: "Level 3 reset", 109: "Link number out of range", 110: "Protocol driver not attached", 111: "No CSI structure available", 112: "Level 2 halted", 113: "Invalid exchange", 114: "Invalid request descriptor", 115: "Exchange full", 116: "No data (for no delay io)", 117: "Timer expired", 118: "Out of streams resources", 119: "Machine is not on the network", 120: "Package not installed", 121: "The object is remote", 122: "Advertise error", 123: "Srmount error", 124: "Communication error on send", 125: "Cross mount point (not really error)", 126: "Given log. name not unique", 127: "f.d. invalid for this operation", 128: "Remote address changed", 129: "Can   access a needed shared lib", 130: "Accessing a corrupted shared lib", 131: ".lib section in a.out corrupted", 132: "Attempting to link in too many libs", 133: "Attempting to exec a shared library", 135: "Streams pipe error", 136: "Too many users", 137: "Socket type not supported", 138: "Not supported", 139: "Protocol family not supported", 140: "Can't send after socket shutdown", 141: "Too many references", 142: "Host is down", 148: "No medium (in tape drive)", 156: "Level 2 not synchronized" };
        var ERRNO_CODES = {};
        var FS = {
          root: null,
          mounts: [],
          devices: {},
          streams: [],
          nextInode: 1,
          nameTable: null,
          currentPath: "/",
          initialized: false,
          ignorePermissions: true,
          ErrnoError: null,
          genericErrors: {},
          filesystems: null,
          syncFSRequests: 0,
          lookupPath: (path, opts = {}) => {
            path = PATH_FS.resolve(FS.cwd(), path);
            if (!path)
              return { path: "", node: null };
            var defaults = {
              follow_mount: true,
              recurse_count: 0
            };
            opts = Object.assign(defaults, opts);
            if (opts.recurse_count > 8) {
              throw new FS.ErrnoError(32);
            }
            var parts = PATH.normalizeArray(path.split("/").filter((p) => !!p), false);
            var current = FS.root;
            var current_path = "/";
            for (var i = 0; i < parts.length; i++) {
              var islast = i === parts.length - 1;
              if (islast && opts.parent) {
                break;
              }
              current = FS.lookupNode(current, parts[i]);
              current_path = PATH.join2(current_path, parts[i]);
              if (FS.isMountpoint(current)) {
                if (!islast || islast && opts.follow_mount) {
                  current = current.mounted.root;
                }
              }
              if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                  var link = FS.readlink(current_path);
                  current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                  var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
                  current = lookup.node;
                  if (count++ > 40) {
                    throw new FS.ErrnoError(32);
                  }
                }
              }
            }
            return { path: current_path, node: current };
          },
          getPath: (node) => {
            var path;
            while (true) {
              if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path)
                  return mount;
                return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path;
              }
              path = path ? node.name + "/" + path : node.name;
              node = node.parent;
            }
          },
          hashName: (parentid, name) => {
            var hash = 0;
            for (var i = 0; i < name.length; i++) {
              hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
            }
            return (parentid + hash >>> 0) % FS.nameTable.length;
          },
          hashAddNode: (node) => {
            var hash = FS.hashName(node.parent.id, node.name);
            node.name_next = FS.nameTable[hash];
            FS.nameTable[hash] = node;
          },
          hashRemoveNode: (node) => {
            var hash = FS.hashName(node.parent.id, node.name);
            if (FS.nameTable[hash] === node) {
              FS.nameTable[hash] = node.name_next;
            } else {
              var current = FS.nameTable[hash];
              while (current) {
                if (current.name_next === node) {
                  current.name_next = node.name_next;
                  break;
                }
                current = current.name_next;
              }
            }
          },
          lookupNode: (parent, name) => {
            var errCode = FS.mayLookup(parent);
            if (errCode) {
              throw new FS.ErrnoError(errCode, parent);
            }
            var hash = FS.hashName(parent.id, name);
            for (var node = FS.nameTable[hash]; node; node = node.name_next) {
              var nodeName = node.name;
              if (node.parent.id === parent.id && nodeName === name) {
                return node;
              }
            }
            return FS.lookup(parent, name);
          },
          createNode: (parent, name, mode, rdev) => {
            assert(typeof parent == "object");
            var node = new FS.FSNode(parent, name, mode, rdev);
            FS.hashAddNode(node);
            return node;
          },
          destroyNode: (node) => {
            FS.hashRemoveNode(node);
          },
          isRoot: (node) => {
            return node === node.parent;
          },
          isMountpoint: (node) => {
            return !!node.mounted;
          },
          isFile: (mode) => {
            return (mode & 61440) === 32768;
          },
          isDir: (mode) => {
            return (mode & 61440) === 16384;
          },
          isLink: (mode) => {
            return (mode & 61440) === 40960;
          },
          isChrdev: (mode) => {
            return (mode & 61440) === 8192;
          },
          isBlkdev: (mode) => {
            return (mode & 61440) === 24576;
          },
          isFIFO: (mode) => {
            return (mode & 61440) === 4096;
          },
          isSocket: (mode) => {
            return (mode & 49152) === 49152;
          },
          flagModes: { "r": 0, "r+": 2, "w": 577, "w+": 578, "a": 1089, "a+": 1090 },
          modeStringToFlags: (str) => {
            var flags = FS.flagModes[str];
            if (typeof flags == "undefined") {
              throw new Error("Unknown file open mode: " + str);
            }
            return flags;
          },
          flagsToPermissionString: (flag) => {
            var perms = ["r", "w", "rw"][flag & 3];
            if (flag & 512) {
              perms += "w";
            }
            return perms;
          },
          nodePermissions: (node, perms) => {
            if (FS.ignorePermissions) {
              return 0;
            }
            if (perms.includes("r") && !(node.mode & 292)) {
              return 2;
            } else if (perms.includes("w") && !(node.mode & 146)) {
              return 2;
            } else if (perms.includes("x") && !(node.mode & 73)) {
              return 2;
            }
            return 0;
          },
          mayLookup: (dir) => {
            var errCode = FS.nodePermissions(dir, "x");
            if (errCode)
              return errCode;
            if (!dir.node_ops.lookup)
              return 2;
            return 0;
          },
          mayCreate: (dir, name) => {
            try {
              var node = FS.lookupNode(dir, name);
              return 20;
            } catch (e) {
            }
            return FS.nodePermissions(dir, "wx");
          },
          mayDelete: (dir, name, isdir) => {
            var node;
            try {
              node = FS.lookupNode(dir, name);
            } catch (e) {
              return e.errno;
            }
            var errCode = FS.nodePermissions(dir, "wx");
            if (errCode) {
              return errCode;
            }
            if (isdir) {
              if (!FS.isDir(node.mode)) {
                return 54;
              }
              if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 10;
              }
            } else {
              if (FS.isDir(node.mode)) {
                return 31;
              }
            }
            return 0;
          },
          mayOpen: (node, flags) => {
            if (!node) {
              return 44;
            }
            if (FS.isLink(node.mode)) {
              return 32;
            } else if (FS.isDir(node.mode)) {
              if (FS.flagsToPermissionString(flags) !== "r" || // opening for write
              flags & 512) {
                return 31;
              }
            }
            return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
          },
          MAX_OPEN_FDS: 4096,
          nextfd: (fd_start = 0, fd_end = FS.MAX_OPEN_FDS) => {
            for (var fd = fd_start; fd <= fd_end; fd++) {
              if (!FS.streams[fd]) {
                return fd;
              }
            }
            throw new FS.ErrnoError(33);
          },
          getStream: (fd) => FS.streams[fd],
          createStream: (stream, fd_start, fd_end) => {
            if (!FS.FSStream) {
              FS.FSStream = /** @constructor */
              function() {
                this.shared = {};
              };
              FS.FSStream.prototype = {};
              Object.defineProperties(FS.FSStream.prototype, {
                object: {
                  /** @this {FS.FSStream} */
                  get: function() {
                    return this.node;
                  },
                  /** @this {FS.FSStream} */
                  set: function(val) {
                    this.node = val;
                  }
                },
                isRead: {
                  /** @this {FS.FSStream} */
                  get: function() {
                    return (this.flags & 2097155) !== 1;
                  }
                },
                isWrite: {
                  /** @this {FS.FSStream} */
                  get: function() {
                    return (this.flags & 2097155) !== 0;
                  }
                },
                isAppend: {
                  /** @this {FS.FSStream} */
                  get: function() {
                    return this.flags & 1024;
                  }
                },
                flags: {
                  /** @this {FS.FSStream} */
                  get: function() {
                    return this.shared.flags;
                  },
                  /** @this {FS.FSStream} */
                  set: function(val) {
                    this.shared.flags = val;
                  }
                },
                position: {
                  /** @this {FS.FSStream} */
                  get: function() {
                    return this.shared.position;
                  },
                  /** @this {FS.FSStream} */
                  set: function(val) {
                    this.shared.position = val;
                  }
                }
              });
            }
            stream = Object.assign(new FS.FSStream(), stream);
            var fd = FS.nextfd(fd_start, fd_end);
            stream.fd = fd;
            FS.streams[fd] = stream;
            return stream;
          },
          closeStream: (fd) => {
            FS.streams[fd] = null;
          },
          chrdev_stream_ops: {
            open: (stream) => {
              var device = FS.getDevice(stream.node.rdev);
              stream.stream_ops = device.stream_ops;
              if (stream.stream_ops.open) {
                stream.stream_ops.open(stream);
              }
            },
            llseek: () => {
              throw new FS.ErrnoError(70);
            }
          },
          major: (dev) => dev >> 8,
          minor: (dev) => dev & 255,
          makedev: (ma, mi) => ma << 8 | mi,
          registerDevice: (dev, ops) => {
            FS.devices[dev] = { stream_ops: ops };
          },
          getDevice: (dev) => FS.devices[dev],
          getMounts: (mount) => {
            var mounts = [];
            var check = [mount];
            while (check.length) {
              var m = check.pop();
              mounts.push(m);
              check.push.apply(check, m.mounts);
            }
            return mounts;
          },
          syncfs: (populate, callback) => {
            if (typeof populate == "function") {
              callback = populate;
              populate = false;
            }
            FS.syncFSRequests++;
            if (FS.syncFSRequests > 1) {
              err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
            }
            var mounts = FS.getMounts(FS.root.mount);
            var completed = 0;
            function doCallback(errCode) {
              assert(FS.syncFSRequests > 0);
              FS.syncFSRequests--;
              return callback(errCode);
            }
            function done(errCode) {
              if (errCode) {
                if (!done.errored) {
                  done.errored = true;
                  return doCallback(errCode);
                }
                return;
              }
              if (++completed >= mounts.length) {
                doCallback(null);
              }
            }
            ;
            mounts.forEach((mount) => {
              if (!mount.type.syncfs) {
                return done(null);
              }
              mount.type.syncfs(mount, populate, done);
            });
          },
          mount: (type, opts, mountpoint) => {
            if (typeof type == "string") {
              throw type;
            }
            var root = mountpoint === "/";
            var pseudo = !mountpoint;
            var node;
            if (root && FS.root) {
              throw new FS.ErrnoError(10);
            } else if (!root && !pseudo) {
              var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
              mountpoint = lookup.path;
              node = lookup.node;
              if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
              }
              if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54);
              }
            }
            var mount = {
              type,
              opts,
              mountpoint,
              mounts: []
            };
            var mountRoot = type.mount(mount);
            mountRoot.mount = mount;
            mount.root = mountRoot;
            if (root) {
              FS.root = mountRoot;
            } else if (node) {
              node.mounted = mount;
              if (node.mount) {
                node.mount.mounts.push(mount);
              }
            }
            return mountRoot;
          },
          unmount: (mountpoint) => {
            var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
            if (!FS.isMountpoint(lookup.node)) {
              throw new FS.ErrnoError(28);
            }
            var node = lookup.node;
            var mount = node.mounted;
            var mounts = FS.getMounts(mount);
            Object.keys(FS.nameTable).forEach((hash) => {
              var current = FS.nameTable[hash];
              while (current) {
                var next = current.name_next;
                if (mounts.includes(current.mount)) {
                  FS.destroyNode(current);
                }
                current = next;
              }
            });
            node.mounted = null;
            var idx = node.mount.mounts.indexOf(mount);
            assert(idx !== -1);
            node.mount.mounts.splice(idx, 1);
          },
          lookup: (parent, name) => {
            return parent.node_ops.lookup(parent, name);
          },
          mknod: (path, mode, dev) => {
            var lookup = FS.lookupPath(path, { parent: true });
            var parent = lookup.node;
            var name = PATH.basename(path);
            if (!name || name === "." || name === "..") {
              throw new FS.ErrnoError(28);
            }
            var errCode = FS.mayCreate(parent, name);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.mknod) {
              throw new FS.ErrnoError(63);
            }
            return parent.node_ops.mknod(parent, name, mode, dev);
          },
          create: (path, mode) => {
            mode = mode !== void 0 ? mode : 438;
            mode &= 4095;
            mode |= 32768;
            return FS.mknod(path, mode, 0);
          },
          mkdir: (path, mode) => {
            mode = mode !== void 0 ? mode : 511;
            mode &= 511 | 512;
            mode |= 16384;
            return FS.mknod(path, mode, 0);
          },
          mkdirTree: (path, mode) => {
            var dirs = path.split("/");
            var d = "";
            for (var i = 0; i < dirs.length; ++i) {
              if (!dirs[i])
                continue;
              d += "/" + dirs[i];
              try {
                FS.mkdir(d, mode);
              } catch (e) {
                if (e.errno != 20)
                  throw e;
              }
            }
          },
          mkdev: (path, mode, dev) => {
            if (typeof dev == "undefined") {
              dev = mode;
              mode = 438;
            }
            mode |= 8192;
            return FS.mknod(path, mode, dev);
          },
          symlink: (oldpath, newpath) => {
            if (!PATH_FS.resolve(oldpath)) {
              throw new FS.ErrnoError(44);
            }
            var lookup = FS.lookupPath(newpath, { parent: true });
            var parent = lookup.node;
            if (!parent) {
              throw new FS.ErrnoError(44);
            }
            var newname = PATH.basename(newpath);
            var errCode = FS.mayCreate(parent, newname);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.symlink) {
              throw new FS.ErrnoError(63);
            }
            return parent.node_ops.symlink(parent, newname, oldpath);
          },
          rename: (old_path, new_path) => {
            var old_dirname = PATH.dirname(old_path);
            var new_dirname = PATH.dirname(new_path);
            var old_name = PATH.basename(old_path);
            var new_name = PATH.basename(new_path);
            var lookup, old_dir, new_dir;
            lookup = FS.lookupPath(old_path, { parent: true });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, { parent: true });
            new_dir = lookup.node;
            if (!old_dir || !new_dir)
              throw new FS.ErrnoError(44);
            if (old_dir.mount !== new_dir.mount) {
              throw new FS.ErrnoError(75);
            }
            var old_node = FS.lookupNode(old_dir, old_name);
            var relative = PATH_FS.relative(old_path, new_dirname);
            if (relative.charAt(0) !== ".") {
              throw new FS.ErrnoError(28);
            }
            relative = PATH_FS.relative(new_path, old_dirname);
            if (relative.charAt(0) !== ".") {
              throw new FS.ErrnoError(55);
            }
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (old_node === new_node) {
              return;
            }
            var isdir = FS.isDir(old_node.mode);
            var errCode = FS.mayDelete(old_dir, old_name, isdir);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!old_dir.node_ops.rename) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
              throw new FS.ErrnoError(10);
            }
            if (new_dir !== old_dir) {
              errCode = FS.nodePermissions(old_dir, "w");
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
            }
            FS.hashRemoveNode(old_node);
            try {
              old_dir.node_ops.rename(old_node, new_dir, new_name);
            } catch (e) {
              throw e;
            } finally {
              FS.hashAddNode(old_node);
            }
          },
          rmdir: (path) => {
            var lookup = FS.lookupPath(path, { parent: true });
            var parent = lookup.node;
            var name = PATH.basename(path);
            var node = FS.lookupNode(parent, name);
            var errCode = FS.mayDelete(parent, name, true);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.rmdir) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            parent.node_ops.rmdir(parent, name);
            FS.destroyNode(node);
          },
          readdir: (path) => {
            var lookup = FS.lookupPath(path, { follow: true });
            var node = lookup.node;
            if (!node.node_ops.readdir) {
              throw new FS.ErrnoError(54);
            }
            return node.node_ops.readdir(node);
          },
          unlink: (path) => {
            var lookup = FS.lookupPath(path, { parent: true });
            var parent = lookup.node;
            if (!parent) {
              throw new FS.ErrnoError(44);
            }
            var name = PATH.basename(path);
            var node = FS.lookupNode(parent, name);
            var errCode = FS.mayDelete(parent, name, false);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.unlink) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            parent.node_ops.unlink(parent, name);
            FS.destroyNode(node);
          },
          readlink: (path) => {
            var lookup = FS.lookupPath(path);
            var link = lookup.node;
            if (!link) {
              throw new FS.ErrnoError(44);
            }
            if (!link.node_ops.readlink) {
              throw new FS.ErrnoError(28);
            }
            return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
          },
          stat: (path, dontFollow) => {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            var node = lookup.node;
            if (!node) {
              throw new FS.ErrnoError(44);
            }
            if (!node.node_ops.getattr) {
              throw new FS.ErrnoError(63);
            }
            return node.node_ops.getattr(node);
          },
          lstat: (path) => {
            return FS.stat(path, true);
          },
          chmod: (path, mode, dontFollow) => {
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, { follow: !dontFollow });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            node.node_ops.setattr(node, {
              mode: mode & 4095 | node.mode & ~4095,
              timestamp: Date.now()
            });
          },
          lchmod: (path, mode) => {
            FS.chmod(path, mode, true);
          },
          fchmod: (fd, mode) => {
            var stream = FS.getStream(fd);
            if (!stream) {
              throw new FS.ErrnoError(8);
            }
            FS.chmod(stream.node, mode);
          },
          chown: (path, uid, gid, dontFollow) => {
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, { follow: !dontFollow });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            node.node_ops.setattr(node, {
              timestamp: Date.now()
              // we ignore the uid / gid for now
            });
          },
          lchown: (path, uid, gid) => {
            FS.chown(path, uid, gid, true);
          },
          fchown: (fd, uid, gid) => {
            var stream = FS.getStream(fd);
            if (!stream) {
              throw new FS.ErrnoError(8);
            }
            FS.chown(stream.node, uid, gid);
          },
          truncate: (path, len) => {
            if (len < 0) {
              throw new FS.ErrnoError(28);
            }
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, { follow: true });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isDir(node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!FS.isFile(node.mode)) {
              throw new FS.ErrnoError(28);
            }
            var errCode = FS.nodePermissions(node, "w");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            node.node_ops.setattr(node, {
              size: len,
              timestamp: Date.now()
            });
          },
          ftruncate: (fd, len) => {
            var stream = FS.getStream(fd);
            if (!stream) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(28);
            }
            FS.truncate(stream.node, len);
          },
          utime: (path, atime, mtime) => {
            var lookup = FS.lookupPath(path, { follow: true });
            var node = lookup.node;
            node.node_ops.setattr(node, {
              timestamp: Math.max(atime, mtime)
            });
          },
          open: (path, flags, mode) => {
            if (path === "") {
              throw new FS.ErrnoError(44);
            }
            flags = typeof flags == "string" ? FS.modeStringToFlags(flags) : flags;
            mode = typeof mode == "undefined" ? 438 : mode;
            if (flags & 64) {
              mode = mode & 4095 | 32768;
            } else {
              mode = 0;
            }
            var node;
            if (typeof path == "object") {
              node = path;
            } else {
              path = PATH.normalize(path);
              try {
                var lookup = FS.lookupPath(path, {
                  follow: !(flags & 131072)
                });
                node = lookup.node;
              } catch (e) {
              }
            }
            var created = false;
            if (flags & 64) {
              if (node) {
                if (flags & 128) {
                  throw new FS.ErrnoError(20);
                }
              } else {
                node = FS.mknod(path, mode, 0);
                created = true;
              }
            }
            if (!node) {
              throw new FS.ErrnoError(44);
            }
            if (FS.isChrdev(node.mode)) {
              flags &= ~512;
            }
            if (flags & 65536 && !FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54);
            }
            if (!created) {
              var errCode = FS.mayOpen(node, flags);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
            }
            if (flags & 512 && !created) {
              FS.truncate(node, 0);
            }
            flags &= ~(128 | 512 | 131072);
            var stream = FS.createStream({
              node,
              path: FS.getPath(node),
              // we want the absolute path to the node
              flags,
              seekable: true,
              position: 0,
              stream_ops: node.stream_ops,
              // used by the file family libc calls (fopen, fwrite, ferror, etc.)
              ungotten: [],
              error: false
            });
            if (stream.stream_ops.open) {
              stream.stream_ops.open(stream);
            }
            if (Module2["logReadFiles"] && !(flags & 1)) {
              if (!FS.readFiles)
                FS.readFiles = {};
              if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1;
              }
            }
            return stream;
          },
          close: (stream) => {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (stream.getdents)
              stream.getdents = null;
            try {
              if (stream.stream_ops.close) {
                stream.stream_ops.close(stream);
              }
            } catch (e) {
              throw e;
            } finally {
              FS.closeStream(stream.fd);
            }
            stream.fd = null;
          },
          isClosed: (stream) => {
            return stream.fd === null;
          },
          llseek: (stream, offset, whence) => {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (!stream.seekable || !stream.stream_ops.llseek) {
              throw new FS.ErrnoError(70);
            }
            if (whence != 0 && whence != 1 && whence != 2) {
              throw new FS.ErrnoError(28);
            }
            stream.position = stream.stream_ops.llseek(stream, offset, whence);
            stream.ungotten = [];
            return stream.position;
          },
          read: (stream, buffer2, offset, length, position) => {
            if (length < 0 || position < 0) {
              throw new FS.ErrnoError(28);
            }
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 1) {
              throw new FS.ErrnoError(8);
            }
            if (FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!stream.stream_ops.read) {
              throw new FS.ErrnoError(28);
            }
            var seeking = typeof position != "undefined";
            if (!seeking) {
              position = stream.position;
            } else if (!stream.seekable) {
              throw new FS.ErrnoError(70);
            }
            var bytesRead = stream.stream_ops.read(stream, buffer2, offset, length, position);
            if (!seeking)
              stream.position += bytesRead;
            return bytesRead;
          },
          write: (stream, buffer2, offset, length, position, canOwn) => {
            if (length < 0 || position < 0) {
              throw new FS.ErrnoError(28);
            }
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(8);
            }
            if (FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!stream.stream_ops.write) {
              throw new FS.ErrnoError(28);
            }
            if (stream.seekable && stream.flags & 1024) {
              FS.llseek(stream, 0, 2);
            }
            var seeking = typeof position != "undefined";
            if (!seeking) {
              position = stream.position;
            } else if (!stream.seekable) {
              throw new FS.ErrnoError(70);
            }
            var bytesWritten = stream.stream_ops.write(stream, buffer2, offset, length, position, canOwn);
            if (!seeking)
              stream.position += bytesWritten;
            return bytesWritten;
          },
          allocate: (stream, offset, length) => {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (offset < 0 || length <= 0) {
              throw new FS.ErrnoError(28);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(8);
            }
            if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            if (!stream.stream_ops.allocate) {
              throw new FS.ErrnoError(138);
            }
            stream.stream_ops.allocate(stream, offset, length);
          },
          mmap: (stream, length, position, prot, flags) => {
            if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
              throw new FS.ErrnoError(2);
            }
            if ((stream.flags & 2097155) === 1) {
              throw new FS.ErrnoError(2);
            }
            if (!stream.stream_ops.mmap) {
              throw new FS.ErrnoError(43);
            }
            return stream.stream_ops.mmap(stream, length, position, prot, flags);
          },
          msync: (stream, buffer2, offset, length, mmapFlags) => {
            if (!stream || !stream.stream_ops.msync) {
              return 0;
            }
            return stream.stream_ops.msync(stream, buffer2, offset, length, mmapFlags);
          },
          munmap: (stream) => 0,
          ioctl: (stream, cmd, arg) => {
            if (!stream.stream_ops.ioctl) {
              throw new FS.ErrnoError(59);
            }
            return stream.stream_ops.ioctl(stream, cmd, arg);
          },
          readFile: (path, opts = {}) => {
            opts.flags = opts.flags || 0;
            opts.encoding = opts.encoding || "binary";
            if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
              throw new Error('Invalid encoding type "' + opts.encoding + '"');
            }
            var ret;
            var stream = FS.open(path, opts.flags);
            var stat = FS.stat(path);
            var length = stat.size;
            var buf = new Uint8Array(length);
            FS.read(stream, buf, 0, length, 0);
            if (opts.encoding === "utf8") {
              ret = UTF8ArrayToString(buf, 0);
            } else if (opts.encoding === "binary") {
              ret = buf;
            }
            FS.close(stream);
            return ret;
          },
          writeFile: (path, data, opts = {}) => {
            opts.flags = opts.flags || 577;
            var stream = FS.open(path, opts.flags, opts.mode);
            if (typeof data == "string") {
              var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
              var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
              FS.write(stream, buf, 0, actualNumBytes, void 0, opts.canOwn);
            } else if (ArrayBuffer.isView(data)) {
              FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
            } else {
              throw new Error("Unsupported data type");
            }
            FS.close(stream);
          },
          cwd: () => FS.currentPath,
          chdir: (path) => {
            var lookup = FS.lookupPath(path, { follow: true });
            if (lookup.node === null) {
              throw new FS.ErrnoError(44);
            }
            if (!FS.isDir(lookup.node.mode)) {
              throw new FS.ErrnoError(54);
            }
            var errCode = FS.nodePermissions(lookup.node, "x");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            FS.currentPath = lookup.path;
          },
          createDefaultDirectories: () => {
            FS.mkdir("/tmp");
            FS.mkdir("/home");
            FS.mkdir("/home/web_user");
          },
          createDefaultDevices: () => {
            FS.mkdir("/dev");
            FS.registerDevice(FS.makedev(1, 3), {
              read: () => 0,
              write: (stream, buffer2, offset, length, pos) => length
            });
            FS.mkdev("/dev/null", FS.makedev(1, 3));
            TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
            TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
            FS.mkdev("/dev/tty", FS.makedev(5, 0));
            FS.mkdev("/dev/tty1", FS.makedev(6, 0));
            var random_device = getRandomDevice();
            FS.createDevice("/dev", "random", random_device);
            FS.createDevice("/dev", "urandom", random_device);
            FS.mkdir("/dev/shm");
            FS.mkdir("/dev/shm/tmp");
          },
          createSpecialDirectories: () => {
            FS.mkdir("/proc");
            var proc_self = FS.mkdir("/proc/self");
            FS.mkdir("/proc/self/fd");
            FS.mount({
              mount: () => {
                var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
                node.node_ops = {
                  lookup: (parent, name) => {
                    var fd = +name;
                    var stream = FS.getStream(fd);
                    if (!stream)
                      throw new FS.ErrnoError(8);
                    var ret = {
                      parent: null,
                      mount: { mountpoint: "fake" },
                      node_ops: { readlink: () => stream.path }
                    };
                    ret.parent = ret;
                    return ret;
                  }
                };
                return node;
              }
            }, {}, "/proc/self/fd");
          },
          createStandardStreams: () => {
            if (Module2["stdin"]) {
              FS.createDevice("/dev", "stdin", Module2["stdin"]);
            } else {
              FS.symlink("/dev/tty", "/dev/stdin");
            }
            if (Module2["stdout"]) {
              FS.createDevice("/dev", "stdout", null, Module2["stdout"]);
            } else {
              FS.symlink("/dev/tty", "/dev/stdout");
            }
            if (Module2["stderr"]) {
              FS.createDevice("/dev", "stderr", null, Module2["stderr"]);
            } else {
              FS.symlink("/dev/tty1", "/dev/stderr");
            }
            var stdin = FS.open("/dev/stdin", 0);
            var stdout = FS.open("/dev/stdout", 1);
            var stderr = FS.open("/dev/stderr", 1);
            assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
            assert(stdout.fd === 1, "invalid handle for stdout (" + stdout.fd + ")");
            assert(stderr.fd === 2, "invalid handle for stderr (" + stderr.fd + ")");
          },
          ensureErrnoError: () => {
            if (FS.ErrnoError)
              return;
            FS.ErrnoError = /** @this{Object} */
            function ErrnoError(errno, node) {
              this.node = node;
              this.setErrno = /** @this{Object} */
              function(errno2) {
                this.errno = errno2;
                for (var key in ERRNO_CODES) {
                  if (ERRNO_CODES[key] === errno2) {
                    this.code = key;
                    break;
                  }
                }
              };
              this.setErrno(errno);
              this.message = ERRNO_MESSAGES[errno];
              if (this.stack) {
                Object.defineProperty(this, "stack", { value: new Error().stack, writable: true });
                this.stack = demangleAll(this.stack);
              }
            };
            FS.ErrnoError.prototype = new Error();
            FS.ErrnoError.prototype.constructor = FS.ErrnoError;
            [44].forEach((code) => {
              FS.genericErrors[code] = new FS.ErrnoError(code);
              FS.genericErrors[code].stack = "<generic error, no stack>";
            });
          },
          staticInit: () => {
            FS.ensureErrnoError();
            FS.nameTable = new Array(4096);
            FS.mount(MEMFS, {}, "/");
            FS.createDefaultDirectories();
            FS.createDefaultDevices();
            FS.createSpecialDirectories();
            FS.filesystems = {
              "MEMFS": MEMFS
            };
          },
          init: (input, output, error) => {
            assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
            FS.init.initialized = true;
            FS.ensureErrnoError();
            Module2["stdin"] = input || Module2["stdin"];
            Module2["stdout"] = output || Module2["stdout"];
            Module2["stderr"] = error || Module2["stderr"];
            FS.createStandardStreams();
          },
          quit: () => {
            FS.init.initialized = false;
            _fflush(0);
            for (var i = 0; i < FS.streams.length; i++) {
              var stream = FS.streams[i];
              if (!stream) {
                continue;
              }
              FS.close(stream);
            }
          },
          getMode: (canRead, canWrite) => {
            var mode = 0;
            if (canRead)
              mode |= 292 | 73;
            if (canWrite)
              mode |= 146;
            return mode;
          },
          findObject: (path, dontResolveLastLink) => {
            var ret = FS.analyzePath(path, dontResolveLastLink);
            if (ret.exists) {
              return ret.object;
            } else {
              return null;
            }
          },
          analyzePath: (path, dontResolveLastLink) => {
            try {
              var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
              path = lookup.path;
            } catch (e) {
            }
            var ret = {
              isRoot: false,
              exists: false,
              error: 0,
              name: null,
              path: null,
              object: null,
              parentExists: false,
              parentPath: null,
              parentObject: null
            };
            try {
              var lookup = FS.lookupPath(path, { parent: true });
              ret.parentExists = true;
              ret.parentPath = lookup.path;
              ret.parentObject = lookup.node;
              ret.name = PATH.basename(path);
              lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
              ret.exists = true;
              ret.path = lookup.path;
              ret.object = lookup.node;
              ret.name = lookup.node.name;
              ret.isRoot = lookup.path === "/";
            } catch (e) {
              ret.error = e.errno;
            }
            ;
            return ret;
          },
          createPath: (parent, path, canRead, canWrite) => {
            parent = typeof parent == "string" ? parent : FS.getPath(parent);
            var parts = path.split("/").reverse();
            while (parts.length) {
              var part = parts.pop();
              if (!part)
                continue;
              var current = PATH.join2(parent, part);
              try {
                FS.mkdir(current);
              } catch (e) {
              }
              parent = current;
            }
            return current;
          },
          createFile: (parent, name, properties, canRead, canWrite) => {
            var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
            var mode = FS.getMode(canRead, canWrite);
            return FS.create(path, mode);
          },
          createDataFile: (parent, name, data, canRead, canWrite, canOwn) => {
            var path = name;
            if (parent) {
              parent = typeof parent == "string" ? parent : FS.getPath(parent);
              path = name ? PATH.join2(parent, name) : parent;
            }
            var mode = FS.getMode(canRead, canWrite);
            var node = FS.create(path, mode);
            if (data) {
              if (typeof data == "string") {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i)
                  arr[i] = data.charCodeAt(i);
                data = arr;
              }
              FS.chmod(node, mode | 146);
              var stream = FS.open(node, 577);
              FS.write(stream, data, 0, data.length, 0, canOwn);
              FS.close(stream);
              FS.chmod(node, mode);
            }
            return node;
          },
          createDevice: (parent, name, input, output) => {
            var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
            var mode = FS.getMode(!!input, !!output);
            if (!FS.createDevice.major)
              FS.createDevice.major = 64;
            var dev = FS.makedev(FS.createDevice.major++, 0);
            FS.registerDevice(dev, {
              open: (stream) => {
                stream.seekable = false;
              },
              close: (stream) => {
                if (output && output.buffer && output.buffer.length) {
                  output(10);
                }
              },
              read: (stream, buffer2, offset, length, pos) => {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                  var result;
                  try {
                    result = input();
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                  if (result === void 0 && bytesRead === 0) {
                    throw new FS.ErrnoError(6);
                  }
                  if (result === null || result === void 0)
                    break;
                  bytesRead++;
                  buffer2[offset + i] = result;
                }
                if (bytesRead) {
                  stream.node.timestamp = Date.now();
                }
                return bytesRead;
              },
              write: (stream, buffer2, offset, length, pos) => {
                for (var i = 0; i < length; i++) {
                  try {
                    output(buffer2[offset + i]);
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                }
                if (length) {
                  stream.node.timestamp = Date.now();
                }
                return i;
              }
            });
            return FS.mkdev(path, mode, dev);
          },
          forceLoadFile: (obj) => {
            if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
              return true;
            if (typeof XMLHttpRequest != "undefined") {
              throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
            } else if (read_) {
              try {
                obj.contents = intArrayFromString(read_(obj.url), true);
                obj.usedBytes = obj.contents.length;
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            } else {
              throw new Error("Cannot load without read() or XMLHttpRequest.");
            }
          },
          createLazyFile: (parent, name, url, canRead, canWrite) => {
            function LazyUint8Array() {
              this.lengthKnown = false;
              this.chunks = [];
            }
            LazyUint8Array.prototype.get = /** @this{Object} */
            function LazyUint8Array_get(idx) {
              if (idx > this.length - 1 || idx < 0) {
                return void 0;
              }
              var chunkOffset = idx % this.chunkSize;
              var chunkNum = idx / this.chunkSize | 0;
              return this.getter(chunkNum)[chunkOffset];
            };
            LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
              this.getter = getter;
            };
            LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
              var xhr = new XMLHttpRequest();
              xhr.open("HEAD", url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
              var chunkSize = 1024 * 1024;
              if (!hasByteServing)
                chunkSize = datalength;
              var doXHR = (from, to) => {
                if (from > to)
                  throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength - 1)
                  throw new Error("only " + datalength + " bytes available! programmer error!");
                var xhr2 = new XMLHttpRequest();
                xhr2.open("GET", url, false);
                if (datalength !== chunkSize)
                  xhr2.setRequestHeader("Range", "bytes=" + from + "-" + to);
                xhr2.responseType = "arraybuffer";
                if (xhr2.overrideMimeType) {
                  xhr2.overrideMimeType("text/plain; charset=x-user-defined");
                }
                xhr2.send(null);
                if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304))
                  throw new Error("Couldn't load " + url + ". Status: " + xhr2.status);
                if (xhr2.response !== void 0) {
                  return new Uint8Array(
                    /** @type{Array<number>} */
                    xhr2.response || []
                  );
                } else {
                  return intArrayFromString(xhr2.responseText || "", true);
                }
              };
              var lazyArray2 = this;
              lazyArray2.setDataGetter((chunkNum) => {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray2.chunks[chunkNum] == "undefined") {
                  lazyArray2.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof lazyArray2.chunks[chunkNum] == "undefined")
                  throw new Error("doXHR failed!");
                return lazyArray2.chunks[chunkNum];
              });
              if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                out("LazyFiles on gzip forces download of the whole file when length is accessed");
              }
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
            };
            if (typeof XMLHttpRequest != "undefined") {
              if (!ENVIRONMENT_IS_WORKER)
                throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
              var lazyArray = new LazyUint8Array();
              Object.defineProperties(lazyArray, {
                length: {
                  get: (
                    /** @this{Object} */
                    function() {
                      if (!this.lengthKnown) {
                        this.cacheLength();
                      }
                      return this._length;
                    }
                  )
                },
                chunkSize: {
                  get: (
                    /** @this{Object} */
                    function() {
                      if (!this.lengthKnown) {
                        this.cacheLength();
                      }
                      return this._chunkSize;
                    }
                  )
                }
              });
              var properties = { isDevice: false, contents: lazyArray };
            } else {
              var properties = { isDevice: false, url };
            }
            var node = FS.createFile(parent, name, properties, canRead, canWrite);
            if (properties.contents) {
              node.contents = properties.contents;
            } else if (properties.url) {
              node.contents = null;
              node.url = properties.url;
            }
            Object.defineProperties(node, {
              usedBytes: {
                get: (
                  /** @this {FSNode} */
                  function() {
                    return this.contents.length;
                  }
                )
              }
            });
            var stream_ops = {};
            var keys = Object.keys(node.stream_ops);
            keys.forEach((key) => {
              var fn = node.stream_ops[key];
              stream_ops[key] = function forceLoadLazyFile() {
                FS.forceLoadFile(node);
                return fn.apply(null, arguments);
              };
            });
            function writeChunks(stream, buffer2, offset, length, position) {
              var contents = stream.node.contents;
              if (position >= contents.length)
                return 0;
              var size = Math.min(contents.length - position, length);
              assert(size >= 0);
              if (contents.slice) {
                for (var i = 0; i < size; i++) {
                  buffer2[offset + i] = contents[position + i];
                }
              } else {
                for (var i = 0; i < size; i++) {
                  buffer2[offset + i] = contents.get(position + i);
                }
              }
              return size;
            }
            stream_ops.read = (stream, buffer2, offset, length, position) => {
              FS.forceLoadFile(node);
              return writeChunks(stream, buffer2, offset, length, position);
            };
            stream_ops.mmap = (stream, length, position, prot, flags) => {
              FS.forceLoadFile(node);
              var ptr = mmapAlloc(length);
              if (!ptr) {
                throw new FS.ErrnoError(48);
              }
              writeChunks(stream, HEAP8, ptr, length, position);
              return { ptr, allocated: true };
            };
            node.stream_ops = stream_ops;
            return node;
          },
          createPreloadedFile: (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
            var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
            var dep = getUniqueRunDependency("cp " + fullname);
            function processData(byteArray) {
              function finish(byteArray2) {
                if (preFinish)
                  preFinish();
                if (!dontCreateFile) {
                  FS.createDataFile(parent, name, byteArray2, canRead, canWrite, canOwn);
                }
                if (onload)
                  onload();
                removeRunDependency(dep);
              }
              if (Browser.handledByPreloadPlugin(byteArray, fullname, finish, () => {
                if (onerror)
                  onerror();
                removeRunDependency(dep);
              })) {
                return;
              }
              finish(byteArray);
            }
            addRunDependency(dep);
            if (typeof url == "string") {
              asyncLoad(url, (byteArray) => processData(byteArray), onerror);
            } else {
              processData(url);
            }
          },
          indexedDB: () => {
            return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
          },
          DB_NAME: () => {
            return "EM_FS_" + window.location.pathname;
          },
          DB_VERSION: 20,
          DB_STORE_NAME: "FILE_DATA",
          saveFilesToDB: (paths, onload, onerror) => {
            onload = onload || (() => {
            });
            onerror = onerror || (() => {
            });
            var indexedDB = FS.indexedDB();
            try {
              var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
            } catch (e) {
              return onerror(e);
            }
            openRequest.onupgradeneeded = () => {
              out("creating db");
              var db = openRequest.result;
              db.createObjectStore(FS.DB_STORE_NAME);
            };
            openRequest.onsuccess = () => {
              var db = openRequest.result;
              var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
              var files = transaction.objectStore(FS.DB_STORE_NAME);
              var ok = 0, fail = 0, total = paths.length;
              function finish() {
                if (fail == 0)
                  onload();
                else
                  onerror();
              }
              paths.forEach((path) => {
                var putRequest = files.put(FS.analyzePath(path).object.contents, path);
                putRequest.onsuccess = () => {
                  ok++;
                  if (ok + fail == total)
                    finish();
                };
                putRequest.onerror = () => {
                  fail++;
                  if (ok + fail == total)
                    finish();
                };
              });
              transaction.onerror = onerror;
            };
            openRequest.onerror = onerror;
          },
          loadFilesFromDB: (paths, onload, onerror) => {
            onload = onload || (() => {
            });
            onerror = onerror || (() => {
            });
            var indexedDB = FS.indexedDB();
            try {
              var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
            } catch (e) {
              return onerror(e);
            }
            openRequest.onupgradeneeded = onerror;
            openRequest.onsuccess = () => {
              var db = openRequest.result;
              try {
                var transaction = db.transaction([FS.DB_STORE_NAME], "readonly");
              } catch (e) {
                onerror(e);
                return;
              }
              var files = transaction.objectStore(FS.DB_STORE_NAME);
              var ok = 0, fail = 0, total = paths.length;
              function finish() {
                if (fail == 0)
                  onload();
                else
                  onerror();
              }
              paths.forEach((path) => {
                var getRequest = files.get(path);
                getRequest.onsuccess = () => {
                  if (FS.analyzePath(path).exists) {
                    FS.unlink(path);
                  }
                  FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                  ok++;
                  if (ok + fail == total)
                    finish();
                };
                getRequest.onerror = () => {
                  fail++;
                  if (ok + fail == total)
                    finish();
                };
              });
              transaction.onerror = onerror;
            };
            openRequest.onerror = onerror;
          },
          absolutePath: () => {
            abort("FS.absolutePath has been removed; use PATH_FS.resolve instead");
          },
          createFolder: () => {
            abort("FS.createFolder has been removed; use FS.mkdir instead");
          },
          createLink: () => {
            abort("FS.createLink has been removed; use FS.symlink instead");
          },
          joinPath: () => {
            abort("FS.joinPath has been removed; use PATH.join instead");
          },
          mmapAlloc: () => {
            abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
          },
          standardizePath: () => {
            abort("FS.standardizePath has been removed; use PATH.normalize instead");
          }
        };
        var SYSCALLS = {
          DEFAULT_POLLMASK: 5,
          calculateAt: function(dirfd, path, allowEmpty) {
            if (PATH.isAbs(path)) {
              return path;
            }
            var dir;
            if (dirfd === -100) {
              dir = FS.cwd();
            } else {
              var dirstream = FS.getStream(dirfd);
              if (!dirstream)
                throw new FS.ErrnoError(8);
              dir = dirstream.path;
            }
            if (path.length == 0) {
              if (!allowEmpty) {
                throw new FS.ErrnoError(44);
                ;
              }
              return dir;
            }
            return PATH.join2(dir, path);
          },
          doStat: function(func, path, buf) {
            try {
              var stat = func(path);
            } catch (e) {
              if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
                return -54;
              }
              throw e;
            }
            HEAP32[buf >> 2] = stat.dev;
            HEAP32[buf + 4 >> 2] = 0;
            HEAP32[buf + 8 >> 2] = stat.ino;
            HEAP32[buf + 12 >> 2] = stat.mode;
            HEAP32[buf + 16 >> 2] = stat.nlink;
            HEAP32[buf + 20 >> 2] = stat.uid;
            HEAP32[buf + 24 >> 2] = stat.gid;
            HEAP32[buf + 28 >> 2] = stat.rdev;
            HEAP32[buf + 32 >> 2] = 0;
            tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
            HEAP32[buf + 48 >> 2] = 4096;
            HEAP32[buf + 52 >> 2] = stat.blocks;
            HEAP32[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
            HEAP32[buf + 60 >> 2] = 0;
            HEAP32[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
            HEAP32[buf + 68 >> 2] = 0;
            HEAP32[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
            HEAP32[buf + 76 >> 2] = 0;
            tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 80 >> 2] = tempI64[0], HEAP32[buf + 84 >> 2] = tempI64[1];
            return 0;
          },
          doMsync: function(addr, stream, len, flags, offset) {
            var buffer2 = HEAPU8.slice(addr, addr + len);
            FS.msync(stream, buffer2, offset, len, flags);
          },
          varargs: void 0,
          get: function() {
            assert(SYSCALLS.varargs != void 0);
            SYSCALLS.varargs += 4;
            var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
            return ret;
          },
          getStr: function(ptr) {
            var ret = UTF8ToString(ptr);
            return ret;
          },
          getStreamFromFD: function(fd) {
            var stream = FS.getStream(fd);
            if (!stream)
              throw new FS.ErrnoError(8);
            return stream;
          }
        };
        function ___syscall_chmod(path, mode) {
          try {
            path = SYSCALLS.getStr(path);
            FS.chmod(path, mode);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_dup3(fd, suggestFD, flags) {
          try {
            var old = SYSCALLS.getStreamFromFD(fd);
            assert(!flags);
            if (old.fd === suggestFD)
              return -28;
            var suggest = FS.getStream(suggestFD);
            if (suggest)
              FS.close(suggest);
            return FS.createStream(old, suggestFD, suggestFD + 1).fd;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_faccessat(dirfd, path, amode, flags) {
          try {
            path = SYSCALLS.getStr(path);
            assert(flags === 0);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (amode & ~7) {
              return -28;
            }
            var lookup = FS.lookupPath(path, { follow: true });
            var node = lookup.node;
            if (!node) {
              return -44;
            }
            var perms = "";
            if (amode & 4)
              perms += "r";
            if (amode & 2)
              perms += "w";
            if (amode & 1)
              perms += "x";
            if (perms && FS.nodePermissions(node, perms)) {
              return -2;
            }
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fchmod(fd, mode) {
          try {
            FS.fchmod(fd, mode);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fchown32(fd, owner, group) {
          try {
            FS.fchown(fd, owner, group);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function setErrNo(value) {
          HEAP32[___errno_location() >> 2] = value;
          return value;
        }
        function ___syscall_fcntl64(fd, cmd, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (cmd) {
              case 0: {
                var arg = SYSCALLS.get();
                if (arg < 0) {
                  return -28;
                }
                var newStream;
                newStream = FS.createStream(stream, arg);
                return newStream.fd;
              }
              case 1:
              case 2:
                return 0;
              case 3:
                return stream.flags;
              case 4: {
                var arg = SYSCALLS.get();
                stream.flags |= arg;
                return 0;
              }
              case 5: {
                var arg = SYSCALLS.get();
                var offset = 0;
                HEAP16[arg + offset >> 1] = 2;
                return 0;
              }
              case 6:
              case 7:
                return 0;
              case 16:
              case 8:
                return -28;
              case 9:
                setErrNo(28);
                return -1;
              default: {
                return -28;
              }
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fstat64(fd, buf) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            return SYSCALLS.doStat(FS.stat, stream.path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function convertI32PairToI53Checked(lo, hi) {
          assert(lo == lo >>> 0 || lo == (lo | 0));
          assert(hi === (hi | 0));
          return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
        }
        function ___syscall_ftruncate64(fd, length_low, length_high) {
          try {
            var length = convertI32PairToI53Checked(length_low, length_high);
            if (isNaN(length))
              return -61;
            FS.ftruncate(fd, length);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_getcwd(buf, size) {
          try {
            if (size === 0)
              return -28;
            var cwd = FS.cwd();
            var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
            if (size < cwdLengthInBytes)
              return -68;
            stringToUTF8(cwd, buf, size);
            return cwdLengthInBytes;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_ioctl(fd, op, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (op) {
              case 21509:
              case 21505: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              case 21510:
              case 21511:
              case 21512:
              case 21506:
              case 21507:
              case 21508: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              case 21519: {
                if (!stream.tty)
                  return -59;
                var argp = SYSCALLS.get();
                HEAP32[argp >> 2] = 0;
                return 0;
              }
              case 21520: {
                if (!stream.tty)
                  return -59;
                return -28;
              }
              case 21531: {
                var argp = SYSCALLS.get();
                return FS.ioctl(stream, op, argp);
              }
              case 21523: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              case 21524: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              default:
                abort("bad ioctl syscall " + op);
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_lstat64(path, buf) {
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.lstat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_mkdirat(dirfd, path, mode) {
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            path = PATH.normalize(path);
            if (path[path.length - 1] === "/")
              path = path.substr(0, path.length - 1);
            FS.mkdir(path, mode, 0);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_newfstatat(dirfd, path, buf, flags) {
          try {
            path = SYSCALLS.getStr(path);
            var nofollow = flags & 256;
            var allowEmpty = flags & 4096;
            flags = flags & ~4352;
            assert(!flags, flags);
            path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
            return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_openat(dirfd, path, flags, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            var mode = varargs ? SYSCALLS.get() : 0;
            return FS.open(path, flags, mode).fd;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (bufsize <= 0)
              return -28;
            var ret = FS.readlink(path);
            var len = Math.min(bufsize, lengthBytesUTF8(ret));
            var endChar = HEAP8[buf + len];
            stringToUTF8(ret, buf, bufsize + 1);
            HEAP8[buf + len] = endChar;
            return len;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
          try {
            oldpath = SYSCALLS.getStr(oldpath);
            newpath = SYSCALLS.getStr(newpath);
            oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
            newpath = SYSCALLS.calculateAt(newdirfd, newpath);
            FS.rename(oldpath, newpath);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_rmdir(path) {
          try {
            path = SYSCALLS.getStr(path);
            FS.rmdir(path);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_stat64(path, buf) {
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.stat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_unlinkat(dirfd, path, flags) {
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (flags === 0) {
              FS.unlink(path);
            } else if (flags === 512) {
              FS.rmdir(path);
            } else {
              abort("Invalid flags passed to unlinkat");
            }
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_utimensat(dirfd, path, times, flags) {
          try {
            path = SYSCALLS.getStr(path);
            assert(flags === 0);
            path = SYSCALLS.calculateAt(dirfd, path, true);
            if (!times) {
              var atime = Date.now();
              var mtime = atime;
            } else {
              var seconds = HEAP32[times >> 2];
              var nanoseconds = HEAP32[times + 4 >> 2];
              atime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
              times += 8;
              seconds = HEAP32[times >> 2];
              nanoseconds = HEAP32[times + 4 >> 2];
              mtime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
            }
            FS.utime(path, atime, mtime);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function __dlinit(main_dso_handle) {
        }
        var dlopenMissingError = "To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking";
        function __dlopen_js(filename, flag) {
          abort(dlopenMissingError);
        }
        function __dlsym_js(handle, symbol) {
          abort(dlopenMissingError);
        }
        function __emscripten_date_now() {
          return 0;
        }
        var nowIsMonotonic = true;
        ;
        function __emscripten_get_now_is_monotonic() {
          return nowIsMonotonic;
        }
        function __emscripten_throw_longjmp() {
          throw Infinity;
        }
        function __gmtime_js(time, tmPtr) {
          var date = new Date(HEAP32[time >> 2] * 1e3);
          HEAP32[tmPtr >> 2] = date.getUTCSeconds();
          HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
          HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
          HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
          HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
          HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
          HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
          var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
          var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
          HEAP32[tmPtr + 28 >> 2] = yday;
        }
        function __localtime_js(time, tmPtr) {
          var date = new Date(HEAP32[time >> 2] * 1e3);
          HEAP32[tmPtr >> 2] = date.getSeconds();
          HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
          HEAP32[tmPtr + 8 >> 2] = date.getHours();
          HEAP32[tmPtr + 12 >> 2] = date.getDate();
          HEAP32[tmPtr + 16 >> 2] = date.getMonth();
          HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
          HEAP32[tmPtr + 24 >> 2] = date.getDay();
          var start = new Date(date.getFullYear(), 0, 1);
          var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
          HEAP32[tmPtr + 28 >> 2] = yday;
          HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
          var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
          var winterOffset = start.getTimezoneOffset();
          var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
          HEAP32[tmPtr + 32 >> 2] = dst;
        }
        function __mktime_js(tmPtr) {
          var date = new Date(
            HEAP32[tmPtr + 20 >> 2] + 1900,
            HEAP32[tmPtr + 16 >> 2],
            HEAP32[tmPtr + 12 >> 2],
            HEAP32[tmPtr + 8 >> 2],
            HEAP32[tmPtr + 4 >> 2],
            HEAP32[tmPtr >> 2],
            0
          );
          var dst = HEAP32[tmPtr + 32 >> 2];
          var guessedOffset = date.getTimezoneOffset();
          var start = new Date(date.getFullYear(), 0, 1);
          var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
          var winterOffset = start.getTimezoneOffset();
          var dstOffset = Math.min(winterOffset, summerOffset);
          if (dst < 0) {
            HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
          } else if (dst > 0 != (dstOffset == guessedOffset)) {
            var nonDstOffset = Math.max(winterOffset, summerOffset);
            var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
            date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
          }
          HEAP32[tmPtr + 24 >> 2] = date.getDay();
          var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
          HEAP32[tmPtr + 28 >> 2] = yday;
          HEAP32[tmPtr >> 2] = date.getSeconds();
          HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
          HEAP32[tmPtr + 8 >> 2] = date.getHours();
          HEAP32[tmPtr + 12 >> 2] = date.getDate();
          HEAP32[tmPtr + 16 >> 2] = date.getMonth();
          return date.getTime() / 1e3 | 0;
        }
        function __mmap_js(len, prot, flags, fd, off, allocated) {
          try {
            var stream = FS.getStream(fd);
            if (!stream)
              return -8;
            var res = FS.mmap(stream, len, off, prot, flags);
            var ptr = res.ptr;
            HEAP32[allocated >> 2] = res.allocated;
            return ptr;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function __munmap_js(addr, len, prot, flags, fd, offset) {
          try {
            var stream = FS.getStream(fd);
            if (stream) {
              if (prot & 2) {
                SYSCALLS.doMsync(addr, stream, len, flags, offset);
              }
              FS.munmap(stream);
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return -e.errno;
          }
        }
        function _tzset_impl(timezone, daylight, tzname) {
          var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
          var winter = new Date(currentYear, 0, 1);
          var summer = new Date(currentYear, 6, 1);
          var winterOffset = winter.getTimezoneOffset();
          var summerOffset = summer.getTimezoneOffset();
          var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
          HEAP32[timezone >> 2] = stdTimezoneOffset * 60;
          HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
          function extractZone(date) {
            var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
            return match ? match[1] : "GMT";
          }
          ;
          var winterName = extractZone(winter);
          var summerName = extractZone(summer);
          var winterNamePtr = allocateUTF8(winterName);
          var summerNamePtr = allocateUTF8(summerName);
          if (summerOffset < winterOffset) {
            HEAPU32[tzname >> 2] = winterNamePtr;
            HEAPU32[tzname + 4 >> 2] = summerNamePtr;
          } else {
            HEAPU32[tzname >> 2] = summerNamePtr;
            HEAPU32[tzname + 4 >> 2] = winterNamePtr;
          }
        }
        function __tzset_js(timezone, daylight, tzname) {
          if (__tzset_js.called)
            return;
          __tzset_js.called = true;
          _tzset_impl(timezone, daylight, tzname);
        }
        function _abort() {
          abort("native code called abort()");
        }
        function getHeapMax() {
          return 524288e3;
        }
        function _emscripten_get_heap_max() {
          return getHeapMax();
        }
        var _emscripten_get_now;
        if (ENVIRONMENT_IS_NODE) {
          _emscripten_get_now = () => {
            var t = process["hrtime"]();
            return t[0] * 1e3 + t[1] / 1e6;
          };
        } else
          _emscripten_get_now = () => performance.now();
        ;
        function _emscripten_memcpy_big(dest, src, num) {
          HEAPU8.copyWithin(dest, src, src + num);
        }
        function emscripten_realloc_buffer(size) {
          try {
            wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
            updateGlobalBufferAndViews(wasmMemory.buffer);
            return 1;
          } catch (e) {
            err("emscripten_realloc_buffer: Attempted to grow heap from " + buffer.byteLength + " bytes to " + size + " bytes, but got error: " + e);
          }
        }
        function _emscripten_resize_heap(requestedSize) {
          var oldSize = HEAPU8.length;
          requestedSize = requestedSize >>> 0;
          assert(requestedSize > oldSize);
          var maxHeapSize = getHeapMax();
          if (requestedSize > maxHeapSize) {
            err("Cannot enlarge memory, asked to go up to " + requestedSize + " bytes, but the limit is " + maxHeapSize + " bytes!");
            return false;
          }
          let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
          for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
            var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
            var replacement = emscripten_realloc_buffer(newSize);
            if (replacement) {
              return true;
            }
          }
          err("Failed to grow the heap from " + oldSize + " bytes to " + newSize + " bytes, not enough memory!");
          return false;
        }
        var ENV = {};
        function getExecutableName() {
          return thisProgram || "./this.program";
        }
        function getEnvStrings() {
          if (!getEnvStrings.strings) {
            var lang = "C.UTF-8";
            var env = {
              "USER": "web_user",
              "LOGNAME": "web_user",
              "PATH": "/",
              "PWD": "/",
              "HOME": "/home/web_user",
              "LANG": lang,
              "_": getExecutableName()
            };
            for (var x in ENV) {
              if (ENV[x] === void 0)
                delete env[x];
              else
                env[x] = ENV[x];
            }
            var strings = [];
            for (var x in env) {
              strings.push(x + "=" + env[x]);
            }
            getEnvStrings.strings = strings;
          }
          return getEnvStrings.strings;
        }
        function _environ_get(__environ, environ_buf) {
          var bufSize = 0;
          getEnvStrings().forEach(function(string, i) {
            var ptr = environ_buf + bufSize;
            HEAPU32[__environ + i * 4 >> 2] = ptr;
            writeAsciiToMemory(string, ptr);
            bufSize += string.length + 1;
          });
          return 0;
        }
        function _environ_sizes_get(penviron_count, penviron_buf_size) {
          var strings = getEnvStrings();
          HEAPU32[penviron_count >> 2] = strings.length;
          var bufSize = 0;
          strings.forEach(function(string) {
            bufSize += string.length + 1;
          });
          HEAPU32[penviron_buf_size >> 2] = bufSize;
          return 0;
        }
        function _exit(status) {
          exit(status);
        }
        function _fd_close(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.close(stream);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return e.errno;
          }
        }
        function _fd_fdstat_get(fd, pbuf) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
            HEAP8[pbuf >> 0] = type;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return e.errno;
          }
        }
        function doReadv(stream, iov, iovcnt, offset) {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
              return -1;
            ret += curr;
            if (curr < len)
              break;
          }
          return ret;
        }
        function _fd_read(fd, iov, iovcnt, pnum) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doReadv(stream, iov, iovcnt);
            HEAP32[pnum >> 2] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return e.errno;
          }
        }
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
          try {
            var offset = convertI32PairToI53Checked(offset_low, offset_high);
            if (isNaN(offset))
              return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.llseek(stream, offset, whence);
            tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
            if (stream.getdents && offset === 0 && whence === 0)
              stream.getdents = null;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return e.errno;
          }
        }
        function _fd_sync(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            if (stream.stream_ops && stream.stream_ops.fsync) {
              return -stream.stream_ops.fsync(stream);
            }
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return e.errno;
          }
        }
        function doWritev(stream, iov, iovcnt, offset) {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
              return -1;
            ret += curr;
          }
          return ret;
        }
        function _fd_write(fd, iov, iovcnt, pnum) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doWritev(stream, iov, iovcnt);
            HEAPU32[pnum >> 2] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError))
              throw e;
            return e.errno;
          }
        }
        function _getTempRet0() {
          return getTempRet0();
        }
        function _setTempRet0(val) {
          setTempRet0(val);
        }
        function __isLeapYear(year) {
          return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        }
        function __arraySum(array, index) {
          var sum = 0;
          for (var i = 0; i <= index; sum += array[i++]) {
          }
          return sum;
        }
        var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        function __addDays(date, days) {
          var newDate = new Date(date.getTime());
          while (days > 0) {
            var leap = __isLeapYear(newDate.getFullYear());
            var currentMonth = newDate.getMonth();
            var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
            if (days > daysInCurrentMonth - newDate.getDate()) {
              days -= daysInCurrentMonth - newDate.getDate() + 1;
              newDate.setDate(1);
              if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1);
              } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1);
              }
            } else {
              newDate.setDate(newDate.getDate() + days);
              return newDate;
            }
          }
          return newDate;
        }
        function _strftime(s, maxsize, format2, tm) {
          var tm_zone = HEAP32[tm + 40 >> 2];
          var date = {
            tm_sec: HEAP32[tm >> 2],
            tm_min: HEAP32[tm + 4 >> 2],
            tm_hour: HEAP32[tm + 8 >> 2],
            tm_mday: HEAP32[tm + 12 >> 2],
            tm_mon: HEAP32[tm + 16 >> 2],
            tm_year: HEAP32[tm + 20 >> 2],
            tm_wday: HEAP32[tm + 24 >> 2],
            tm_yday: HEAP32[tm + 28 >> 2],
            tm_isdst: HEAP32[tm + 32 >> 2],
            tm_gmtoff: HEAP32[tm + 36 >> 2],
            tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
          };
          var pattern = UTF8ToString(format2);
          var EXPANSION_RULES_1 = {
            "%c": "%a %b %d %H:%M:%S %Y",
            // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
            "%D": "%m/%d/%y",
            // Equivalent to %m / %d / %y
            "%F": "%Y-%m-%d",
            // Equivalent to %Y - %m - %d
            "%h": "%b",
            // Equivalent to %b
            "%r": "%I:%M:%S %p",
            // Replaced by the time in a.m. and p.m. notation
            "%R": "%H:%M",
            // Replaced by the time in 24-hour notation
            "%T": "%H:%M:%S",
            // Replaced by the time
            "%x": "%m/%d/%y",
            // Replaced by the locale's appropriate date representation
            "%X": "%H:%M:%S",
            // Replaced by the locale's appropriate time representation
            // Modified Conversion Specifiers
            "%Ec": "%c",
            // Replaced by the locale's alternative appropriate date and time representation.
            "%EC": "%C",
            // Replaced by the name of the base year (period) in the locale's alternative representation.
            "%Ex": "%m/%d/%y",
            // Replaced by the locale's alternative date representation.
            "%EX": "%H:%M:%S",
            // Replaced by the locale's alternative time representation.
            "%Ey": "%y",
            // Replaced by the offset from %EC (year only) in the locale's alternative representation.
            "%EY": "%Y",
            // Replaced by the full alternative year representation.
            "%Od": "%d",
            // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading zeros if there is any alternative symbol for zero; otherwise, with leading <space> characters.
            "%Oe": "%e",
            // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading <space> characters.
            "%OH": "%H",
            // Replaced by the hour (24-hour clock) using the locale's alternative numeric symbols.
            "%OI": "%I",
            // Replaced by the hour (12-hour clock) using the locale's alternative numeric symbols.
            "%Om": "%m",
            // Replaced by the month using the locale's alternative numeric symbols.
            "%OM": "%M",
            // Replaced by the minutes using the locale's alternative numeric symbols.
            "%OS": "%S",
            // Replaced by the seconds using the locale's alternative numeric symbols.
            "%Ou": "%u",
            // Replaced by the weekday as a number in the locale's alternative representation (Monday=1).
            "%OU": "%U",
            // Replaced by the week number of the year (Sunday as the first day of the week, rules corresponding to %U ) using the locale's alternative numeric symbols.
            "%OV": "%V",
            // Replaced by the week number of the year (Monday as the first day of the week, rules corresponding to %V ) using the locale's alternative numeric symbols.
            "%Ow": "%w",
            // Replaced by the number of the weekday (Sunday=0) using the locale's alternative numeric symbols.
            "%OW": "%W",
            // Replaced by the week number of the year (Monday as the first day of the week) using the locale's alternative numeric symbols.
            "%Oy": "%y"
            // Replaced by the year (offset from %C ) using the locale's alternative numeric symbols.
          };
          for (var rule in EXPANSION_RULES_1) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
          }
          var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          function leadingSomething(value, digits, character) {
            var str = typeof value == "number" ? value.toString() : value || "";
            while (str.length < digits) {
              str = character[0] + str;
            }
            return str;
          }
          function leadingNulls(value, digits) {
            return leadingSomething(value, digits, "0");
          }
          function compareByDay(date1, date2) {
            function sgn(value) {
              return value < 0 ? -1 : value > 0 ? 1 : 0;
            }
            var compare;
            if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
              if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate());
              }
            }
            return compare;
          }
          function getFirstWeekStartDate(janFourth) {
            switch (janFourth.getDay()) {
              case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
              case 1:
                return janFourth;
              case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
              case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
              case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
              case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
              case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30);
            }
          }
          function getWeekBasedYear(date2) {
            var thisDate = __addDays(new Date(date2.tm_year + 1900, 0, 1), date2.tm_yday);
            var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
            var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
              if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1;
              } else {
                return thisDate.getFullYear();
              }
            } else {
              return thisDate.getFullYear() - 1;
            }
          }
          var EXPANSION_RULES_2 = {
            "%a": function(date2) {
              return WEEKDAYS[date2.tm_wday].substring(0, 3);
            },
            "%A": function(date2) {
              return WEEKDAYS[date2.tm_wday];
            },
            "%b": function(date2) {
              return MONTHS[date2.tm_mon].substring(0, 3);
            },
            "%B": function(date2) {
              return MONTHS[date2.tm_mon];
            },
            "%C": function(date2) {
              var year = date2.tm_year + 1900;
              return leadingNulls(year / 100 | 0, 2);
            },
            "%d": function(date2) {
              return leadingNulls(date2.tm_mday, 2);
            },
            "%e": function(date2) {
              return leadingSomething(date2.tm_mday, 2, " ");
            },
            "%g": function(date2) {
              return getWeekBasedYear(date2).toString().substring(2);
            },
            "%G": function(date2) {
              return getWeekBasedYear(date2);
            },
            "%H": function(date2) {
              return leadingNulls(date2.tm_hour, 2);
            },
            "%I": function(date2) {
              var twelveHour = date2.tm_hour;
              if (twelveHour == 0)
                twelveHour = 12;
              else if (twelveHour > 12)
                twelveHour -= 12;
              return leadingNulls(twelveHour, 2);
            },
            "%j": function(date2) {
              return leadingNulls(date2.tm_mday + __arraySum(__isLeapYear(date2.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date2.tm_mon - 1), 3);
            },
            "%m": function(date2) {
              return leadingNulls(date2.tm_mon + 1, 2);
            },
            "%M": function(date2) {
              return leadingNulls(date2.tm_min, 2);
            },
            "%n": function() {
              return "\n";
            },
            "%p": function(date2) {
              if (date2.tm_hour >= 0 && date2.tm_hour < 12) {
                return "AM";
              } else {
                return "PM";
              }
            },
            "%S": function(date2) {
              return leadingNulls(date2.tm_sec, 2);
            },
            "%t": function() {
              return "	";
            },
            "%u": function(date2) {
              return date2.tm_wday || 7;
            },
            "%U": function(date2) {
              var days = date2.tm_yday + 7 - date2.tm_wday;
              return leadingNulls(Math.floor(days / 7), 2);
            },
            "%V": function(date2) {
              var val = Math.floor((date2.tm_yday + 7 - (date2.tm_wday + 6) % 7) / 7);
              if ((date2.tm_wday + 371 - date2.tm_yday - 2) % 7 <= 2) {
                val++;
              }
              if (!val) {
                val = 52;
                var dec31 = (date2.tm_wday + 7 - date2.tm_yday - 1) % 7;
                if (dec31 == 4 || dec31 == 5 && __isLeapYear(date2.tm_year % 400 - 1)) {
                  val++;
                }
              } else if (val == 53) {
                var jan1 = (date2.tm_wday + 371 - date2.tm_yday) % 7;
                if (jan1 != 4 && (jan1 != 3 || !__isLeapYear(date2.tm_year)))
                  val = 1;
              }
              return leadingNulls(val, 2);
            },
            "%w": function(date2) {
              return date2.tm_wday;
            },
            "%W": function(date2) {
              var days = date2.tm_yday + 7 - (date2.tm_wday + 6) % 7;
              return leadingNulls(Math.floor(days / 7), 2);
            },
            "%y": function(date2) {
              return (date2.tm_year + 1900).toString().substring(2);
            },
            "%Y": function(date2) {
              return date2.tm_year + 1900;
            },
            "%z": function(date2) {
              var off = date2.tm_gmtoff;
              var ahead = off >= 0;
              off = Math.abs(off) / 60;
              off = off / 60 * 100 + off % 60;
              return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
            },
            "%Z": function(date2) {
              return date2.tm_zone;
            },
            "%%": function() {
              return "%";
            }
          };
          pattern = pattern.replace(/%%/g, "\0\0");
          for (var rule in EXPANSION_RULES_2) {
            if (pattern.includes(rule)) {
              pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
            }
          }
          pattern = pattern.replace(/\0\0/g, "%");
          var bytes = intArrayFromString(pattern, false);
          if (bytes.length > maxsize) {
            return 0;
          }
          writeArrayToMemory(bytes, s);
          return bytes.length - 1;
        }
        function _system(command) {
          if (false) {
            if (!command)
              return 1;
            var cmdstr = UTF8ToString(command);
            if (!cmdstr.length)
              return 0;
            var cp = null;
            var ret = cp.spawnSync(cmdstr, [], { shell: true, stdio: "inherit" });
            var _W_EXITCODE = (ret2, sig) => ret2 << 8 | sig;
            if (ret.status === null) {
              var signalToNumber = (sig) => {
                switch (sig) {
                  case "SIGHUP":
                    return 1;
                  case "SIGINT":
                    return 2;
                  case "SIGQUIT":
                    return 3;
                  case "SIGFPE":
                    return 8;
                  case "SIGKILL":
                    return 9;
                  case "SIGALRM":
                    return 14;
                  case "SIGTERM":
                    return 15;
                }
                return 2;
              };
              return _W_EXITCODE(0, signalToNumber(ret.signal));
            }
            return _W_EXITCODE(ret.status, 0);
          }
          if (!command)
            return 0;
          setErrNo(52);
          return -1;
        }
        var FSNode = (
          /** @constructor */
          function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          }
        );
        var readMode = 292 | 73;
        var writeMode = 146;
        Object.defineProperties(FSNode.prototype, {
          read: {
            get: (
              /** @this{FSNode} */
              function() {
                return (this.mode & readMode) === readMode;
              }
            ),
            set: (
              /** @this{FSNode} */
              function(val) {
                val ? this.mode |= readMode : this.mode &= ~readMode;
              }
            )
          },
          write: {
            get: (
              /** @this{FSNode} */
              function() {
                return (this.mode & writeMode) === writeMode;
              }
            ),
            set: (
              /** @this{FSNode} */
              function(val) {
                val ? this.mode |= writeMode : this.mode &= ~writeMode;
              }
            )
          },
          isFolder: {
            get: (
              /** @this{FSNode} */
              function() {
                return FS.isDir(this.mode);
              }
            )
          },
          isDevice: {
            get: (
              /** @this{FSNode} */
              function() {
                return FS.isChrdev(this.mode);
              }
            )
          }
        });
        FS.FSNode = FSNode;
        FS.staticInit();
        ;
        ERRNO_CODES = {
          "EPERM": 63,
          "ENOENT": 44,
          "ESRCH": 71,
          "EINTR": 27,
          "EIO": 29,
          "ENXIO": 60,
          "E2BIG": 1,
          "ENOEXEC": 45,
          "EBADF": 8,
          "ECHILD": 12,
          "EAGAIN": 6,
          "EWOULDBLOCK": 6,
          "ENOMEM": 48,
          "EACCES": 2,
          "EFAULT": 21,
          "ENOTBLK": 105,
          "EBUSY": 10,
          "EEXIST": 20,
          "EXDEV": 75,
          "ENODEV": 43,
          "ENOTDIR": 54,
          "EISDIR": 31,
          "EINVAL": 28,
          "ENFILE": 41,
          "EMFILE": 33,
          "ENOTTY": 59,
          "ETXTBSY": 74,
          "EFBIG": 22,
          "ENOSPC": 51,
          "ESPIPE": 70,
          "EROFS": 69,
          "EMLINK": 34,
          "EPIPE": 64,
          "EDOM": 18,
          "ERANGE": 68,
          "ENOMSG": 49,
          "EIDRM": 24,
          "ECHRNG": 106,
          "EL2NSYNC": 156,
          "EL3HLT": 107,
          "EL3RST": 108,
          "ELNRNG": 109,
          "EUNATCH": 110,
          "ENOCSI": 111,
          "EL2HLT": 112,
          "EDEADLK": 16,
          "ENOLCK": 46,
          "EBADE": 113,
          "EBADR": 114,
          "EXFULL": 115,
          "ENOANO": 104,
          "EBADRQC": 103,
          "EBADSLT": 102,
          "EDEADLOCK": 16,
          "EBFONT": 101,
          "ENOSTR": 100,
          "ENODATA": 116,
          "ETIME": 117,
          "ENOSR": 118,
          "ENONET": 119,
          "ENOPKG": 120,
          "EREMOTE": 121,
          "ENOLINK": 47,
          "EADV": 122,
          "ESRMNT": 123,
          "ECOMM": 124,
          "EPROTO": 65,
          "EMULTIHOP": 36,
          "EDOTDOT": 125,
          "EBADMSG": 9,
          "ENOTUNIQ": 126,
          "EBADFD": 127,
          "EREMCHG": 128,
          "ELIBACC": 129,
          "ELIBBAD": 130,
          "ELIBSCN": 131,
          "ELIBMAX": 132,
          "ELIBEXEC": 133,
          "ENOSYS": 52,
          "ENOTEMPTY": 55,
          "ENAMETOOLONG": 37,
          "ELOOP": 32,
          "EOPNOTSUPP": 138,
          "EPFNOSUPPORT": 139,
          "ECONNRESET": 15,
          "ENOBUFS": 42,
          "EAFNOSUPPORT": 5,
          "EPROTOTYPE": 67,
          "ENOTSOCK": 57,
          "ENOPROTOOPT": 50,
          "ESHUTDOWN": 140,
          "ECONNREFUSED": 14,
          "EADDRINUSE": 3,
          "ECONNABORTED": 13,
          "ENETUNREACH": 40,
          "ENETDOWN": 38,
          "ETIMEDOUT": 73,
          "EHOSTDOWN": 142,
          "EHOSTUNREACH": 23,
          "EINPROGRESS": 26,
          "EALREADY": 7,
          "EDESTADDRREQ": 17,
          "EMSGSIZE": 35,
          "EPROTONOSUPPORT": 66,
          "ESOCKTNOSUPPORT": 137,
          "EADDRNOTAVAIL": 4,
          "ENETRESET": 39,
          "EISCONN": 30,
          "ENOTCONN": 53,
          "ETOOMANYREFS": 141,
          "EUSERS": 136,
          "EDQUOT": 19,
          "ESTALE": 72,
          "ENOTSUP": 138,
          "ENOMEDIUM": 148,
          "EILSEQ": 25,
          "EOVERFLOW": 61,
          "ECANCELED": 11,
          "ENOTRECOVERABLE": 56,
          "EOWNERDEAD": 62,
          "ESTRPIPE": 135
        };
        ;
        var ASSERTIONS = true;
        function intArrayFromString(stringy, dontAddNull, length) {
          var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
          var u8array = new Array(len);
          var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
          if (dontAddNull)
            u8array.length = numBytesWritten;
          return u8array;
        }
        function intArrayToString(array) {
          var ret = [];
          for (var i = 0; i < array.length; i++) {
            var chr = array[i];
            if (chr > 255) {
              if (ASSERTIONS) {
                assert(false, "Character code " + chr + " (" + String.fromCharCode(chr) + ")  at offset " + i + " not in 0x00-0xFF.");
              }
              chr &= 255;
            }
            ret.push(String.fromCharCode(chr));
          }
          return ret.join("");
        }
        function checkIncomingModuleAPI() {
          ignoredModuleProp("fetchSettings");
        }
        var asmLibraryArg = {
          "__assert_fail": ___assert_fail,
          "__syscall_chmod": ___syscall_chmod,
          "__syscall_dup3": ___syscall_dup3,
          "__syscall_faccessat": ___syscall_faccessat,
          "__syscall_fchmod": ___syscall_fchmod,
          "__syscall_fchown32": ___syscall_fchown32,
          "__syscall_fcntl64": ___syscall_fcntl64,
          "__syscall_fstat64": ___syscall_fstat64,
          "__syscall_ftruncate64": ___syscall_ftruncate64,
          "__syscall_getcwd": ___syscall_getcwd,
          "__syscall_ioctl": ___syscall_ioctl,
          "__syscall_lstat64": ___syscall_lstat64,
          "__syscall_mkdirat": ___syscall_mkdirat,
          "__syscall_newfstatat": ___syscall_newfstatat,
          "__syscall_openat": ___syscall_openat,
          "__syscall_readlinkat": ___syscall_readlinkat,
          "__syscall_renameat": ___syscall_renameat,
          "__syscall_rmdir": ___syscall_rmdir,
          "__syscall_stat64": ___syscall_stat64,
          "__syscall_unlinkat": ___syscall_unlinkat,
          "__syscall_utimensat": ___syscall_utimensat,
          "_dlinit": __dlinit,
          "_dlopen_js": __dlopen_js,
          "_dlsym_js": __dlsym_js,
          "_emscripten_date_now": __emscripten_date_now,
          "_emscripten_get_now_is_monotonic": __emscripten_get_now_is_monotonic,
          "_emscripten_throw_longjmp": __emscripten_throw_longjmp,
          "_gmtime_js": __gmtime_js,
          "_localtime_js": __localtime_js,
          "_mktime_js": __mktime_js,
          "_mmap_js": __mmap_js,
          "_munmap_js": __munmap_js,
          "_tzset_js": __tzset_js,
          "abort": _abort,
          "emscripten_get_heap_max": _emscripten_get_heap_max,
          "emscripten_get_now": _emscripten_get_now,
          "emscripten_memcpy_big": _emscripten_memcpy_big,
          "emscripten_resize_heap": _emscripten_resize_heap,
          "environ_get": _environ_get,
          "environ_sizes_get": _environ_sizes_get,
          "exit": _exit,
          "fd_close": _fd_close,
          "fd_fdstat_get": _fd_fdstat_get,
          "fd_read": _fd_read,
          "fd_seek": _fd_seek,
          "fd_sync": _fd_sync,
          "fd_write": _fd_write,
          "getTempRet0": _getTempRet0,
          "invoke_vii": invoke_vii,
          "setTempRet0": _setTempRet0,
          "strftime": _strftime,
          "system": _system
        };
        var asm = createWasm();
        var ___wasm_call_ctors = Module2["___wasm_call_ctors"] = createExportWrapper("__wasm_call_ctors");
        var _handle = Module2["_handle"] = createExportWrapper("handle");
        var _main = Module2["_main"] = createExportWrapper("main");
        var _malloc = Module2["_malloc"] = createExportWrapper("malloc");
        var _saveSetjmp = Module2["_saveSetjmp"] = createExportWrapper("saveSetjmp");
        var _free = Module2["_free"] = createExportWrapper("free");
        var ___errno_location = Module2["___errno_location"] = createExportWrapper("__errno_location");
        var _fflush = Module2["_fflush"] = createExportWrapper("fflush");
        var ___dl_seterr = Module2["___dl_seterr"] = createExportWrapper("__dl_seterr");
        var _emscripten_builtin_memalign = Module2["_emscripten_builtin_memalign"] = createExportWrapper("emscripten_builtin_memalign");
        var _sbrk = Module2["_sbrk"] = createExportWrapper("sbrk");
        var _setThrew = Module2["_setThrew"] = createExportWrapper("setThrew");
        var _emscripten_stack_init = Module2["_emscripten_stack_init"] = function() {
          return (_emscripten_stack_init = Module2["_emscripten_stack_init"] = Module2["asm"]["emscripten_stack_init"]).apply(null, arguments);
        };
        var _emscripten_stack_get_free = Module2["_emscripten_stack_get_free"] = function() {
          return (_emscripten_stack_get_free = Module2["_emscripten_stack_get_free"] = Module2["asm"]["emscripten_stack_get_free"]).apply(null, arguments);
        };
        var _emscripten_stack_get_base = Module2["_emscripten_stack_get_base"] = function() {
          return (_emscripten_stack_get_base = Module2["_emscripten_stack_get_base"] = Module2["asm"]["emscripten_stack_get_base"]).apply(null, arguments);
        };
        var _emscripten_stack_get_end = Module2["_emscripten_stack_get_end"] = function() {
          return (_emscripten_stack_get_end = Module2["_emscripten_stack_get_end"] = Module2["asm"]["emscripten_stack_get_end"]).apply(null, arguments);
        };
        var stackSave = Module2["stackSave"] = createExportWrapper("stackSave");
        var stackRestore = Module2["stackRestore"] = createExportWrapper("stackRestore");
        var stackAlloc = Module2["stackAlloc"] = createExportWrapper("stackAlloc");
        var dynCall_viiiij = Module2["dynCall_viiiij"] = createExportWrapper("dynCall_viiiij");
        var dynCall_iiiij = Module2["dynCall_iiiij"] = createExportWrapper("dynCall_iiiij");
        var dynCall_iij = Module2["dynCall_iij"] = createExportWrapper("dynCall_iij");
        var dynCall_iijii = Module2["dynCall_iijii"] = createExportWrapper("dynCall_iijii");
        var dynCall_iiji = Module2["dynCall_iiji"] = createExportWrapper("dynCall_iiji");
        var dynCall_iiiiiij = Module2["dynCall_iiiiiij"] = createExportWrapper("dynCall_iiiiiij");
        var dynCall_iiij = Module2["dynCall_iiij"] = createExportWrapper("dynCall_iiij");
        var dynCall_jii = Module2["dynCall_jii"] = createExportWrapper("dynCall_jii");
        var dynCall_ji = Module2["dynCall_ji"] = createExportWrapper("dynCall_ji");
        var dynCall_vij = Module2["dynCall_vij"] = createExportWrapper("dynCall_vij");
        var dynCall_iiiiijii = Module2["dynCall_iiiiijii"] = createExportWrapper("dynCall_iiiiijii");
        var dynCall_j = Module2["dynCall_j"] = createExportWrapper("dynCall_j");
        var dynCall_jj = Module2["dynCall_jj"] = createExportWrapper("dynCall_jj");
        var dynCall_jiij = Module2["dynCall_jiij"] = createExportWrapper("dynCall_jiij");
        var dynCall_iiiiji = Module2["dynCall_iiiiji"] = createExportWrapper("dynCall_iiiiji");
        var dynCall_iiiijii = Module2["dynCall_iiiijii"] = createExportWrapper("dynCall_iiiijii");
        var dynCall_ij = Module2["dynCall_ij"] = createExportWrapper("dynCall_ij");
        var dynCall_viiji = Module2["dynCall_viiji"] = createExportWrapper("dynCall_viiji");
        var dynCall_viijii = Module2["dynCall_viijii"] = createExportWrapper("dynCall_viijii");
        var dynCall_jiji = Module2["dynCall_jiji"] = createExportWrapper("dynCall_jiji");
        function invoke_vii(index, a1, a2) {
          var sp = stackSave();
          try {
            getWasmTableEntry(index)(a1, a2);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
              throw e;
            _setThrew(1, 0);
          }
        }
        var MAGIC = 0;
        Math.random = () => {
          MAGIC = Math.pow(MAGIC + 1.8912, 3) % 1;
          return MAGIC;
        };
        var TIME = 1e4;
        Date.now = () => TIME++;
        if (typeof performance == "object")
          performance.now = Date.now;
        if (ENVIRONMENT_IS_NODE)
          process["hrtime"] = Date.now;
        if (!Module2)
          Module2 = {};
        Module2["thisProgram"] = "thisProgram";
        function hashMemory(id) {
          var ret = 0;
          var len = _sbrk();
          for (var i = 0; i < len; i++) {
            ret = ret * 17 + HEAPU8[i] | 0;
          }
          return id + ":" + ret;
        }
        function hashString(s) {
          var ret = 0;
          for (var i = 0; i < s.length; i++) {
            ret = ret * 17 + s.charCodeAt(i) | 0;
          }
          return ret;
        }
        unexportedRuntimeFunction("ccall", false);
        Module2["cwrap"] = cwrap;
        unexportedRuntimeFunction("allocate", false);
        unexportedRuntimeFunction("UTF8ArrayToString", false);
        unexportedRuntimeFunction("UTF8ToString", false);
        unexportedRuntimeFunction("stringToUTF8Array", false);
        unexportedRuntimeFunction("stringToUTF8", false);
        unexportedRuntimeFunction("lengthBytesUTF8", false);
        unexportedRuntimeFunction("addOnPreRun", false);
        unexportedRuntimeFunction("addOnInit", false);
        unexportedRuntimeFunction("addOnPreMain", false);
        unexportedRuntimeFunction("addOnExit", false);
        unexportedRuntimeFunction("addOnPostRun", false);
        unexportedRuntimeFunction("addRunDependency", true);
        unexportedRuntimeFunction("removeRunDependency", true);
        unexportedRuntimeFunction("FS_createFolder", false);
        unexportedRuntimeFunction("FS_createPath", true);
        unexportedRuntimeFunction("FS_createDataFile", true);
        unexportedRuntimeFunction("FS_createPreloadedFile", true);
        unexportedRuntimeFunction("FS_createLazyFile", true);
        unexportedRuntimeFunction("FS_createLink", false);
        unexportedRuntimeFunction("FS_createDevice", true);
        unexportedRuntimeFunction("FS_unlink", true);
        unexportedRuntimeFunction("getLEB", false);
        unexportedRuntimeFunction("getFunctionTables", false);
        unexportedRuntimeFunction("alignFunctionTables", false);
        unexportedRuntimeFunction("registerFunctions", false);
        unexportedRuntimeFunction("addFunction", false);
        unexportedRuntimeFunction("removeFunction", false);
        unexportedRuntimeFunction("prettyPrint", false);
        unexportedRuntimeFunction("getCompilerSetting", false);
        unexportedRuntimeFunction("print", false);
        unexportedRuntimeFunction("printErr", false);
        unexportedRuntimeFunction("getTempRet0", false);
        unexportedRuntimeFunction("setTempRet0", false);
        unexportedRuntimeFunction("callMain", false);
        unexportedRuntimeFunction("abort", false);
        unexportedRuntimeFunction("keepRuntimeAlive", false);
        unexportedRuntimeFunction("wasmMemory", false);
        unexportedRuntimeFunction("warnOnce", false);
        unexportedRuntimeFunction("stackSave", false);
        unexportedRuntimeFunction("stackRestore", false);
        unexportedRuntimeFunction("stackAlloc", false);
        unexportedRuntimeFunction("AsciiToString", false);
        unexportedRuntimeFunction("stringToAscii", false);
        unexportedRuntimeFunction("UTF16ToString", false);
        unexportedRuntimeFunction("stringToUTF16", false);
        unexportedRuntimeFunction("lengthBytesUTF16", false);
        unexportedRuntimeFunction("UTF32ToString", false);
        unexportedRuntimeFunction("stringToUTF32", false);
        unexportedRuntimeFunction("lengthBytesUTF32", false);
        unexportedRuntimeFunction("allocateUTF8", false);
        unexportedRuntimeFunction("allocateUTF8OnStack", false);
        unexportedRuntimeFunction("ExitStatus", false);
        unexportedRuntimeFunction("intArrayFromString", false);
        unexportedRuntimeFunction("intArrayToString", false);
        unexportedRuntimeFunction("writeStringToMemory", false);
        unexportedRuntimeFunction("writeArrayToMemory", false);
        unexportedRuntimeFunction("writeAsciiToMemory", false);
        Module2["writeStackCookie"] = writeStackCookie;
        Module2["checkStackCookie"] = checkStackCookie;
        unexportedRuntimeFunction("ptrToString", false);
        unexportedRuntimeFunction("zeroMemory", false);
        unexportedRuntimeFunction("stringToNewUTF8", false);
        unexportedRuntimeFunction("getHeapMax", false);
        unexportedRuntimeFunction("emscripten_realloc_buffer", false);
        unexportedRuntimeFunction("ENV", false);
        unexportedRuntimeFunction("ERRNO_CODES", false);
        unexportedRuntimeFunction("ERRNO_MESSAGES", false);
        unexportedRuntimeFunction("setErrNo", false);
        unexportedRuntimeFunction("inetPton4", false);
        unexportedRuntimeFunction("inetNtop4", false);
        unexportedRuntimeFunction("inetPton6", false);
        unexportedRuntimeFunction("inetNtop6", false);
        unexportedRuntimeFunction("readSockaddr", false);
        unexportedRuntimeFunction("writeSockaddr", false);
        unexportedRuntimeFunction("DNS", false);
        unexportedRuntimeFunction("getHostByName", false);
        unexportedRuntimeFunction("Protocols", false);
        unexportedRuntimeFunction("Sockets", false);
        unexportedRuntimeFunction("getRandomDevice", false);
        unexportedRuntimeFunction("traverseStack", false);
        unexportedRuntimeFunction("UNWIND_CACHE", false);
        unexportedRuntimeFunction("convertPCtoSourceLocation", false);
        unexportedRuntimeFunction("readAsmConstArgsArray", false);
        unexportedRuntimeFunction("readAsmConstArgs", false);
        unexportedRuntimeFunction("mainThreadEM_ASM", false);
        unexportedRuntimeFunction("jstoi_q", false);
        unexportedRuntimeFunction("jstoi_s", false);
        unexportedRuntimeFunction("getExecutableName", false);
        unexportedRuntimeFunction("listenOnce", false);
        unexportedRuntimeFunction("autoResumeAudioContext", false);
        unexportedRuntimeFunction("dynCallLegacy", false);
        unexportedRuntimeFunction("getDynCaller", false);
        unexportedRuntimeFunction("dynCall", false);
        unexportedRuntimeFunction("handleException", false);
        unexportedRuntimeFunction("runtimeKeepalivePush", false);
        unexportedRuntimeFunction("runtimeKeepalivePop", false);
        unexportedRuntimeFunction("callUserCallback", false);
        unexportedRuntimeFunction("maybeExit", false);
        unexportedRuntimeFunction("safeSetTimeout", false);
        unexportedRuntimeFunction("asmjsMangle", false);
        unexportedRuntimeFunction("asyncLoad", false);
        unexportedRuntimeFunction("alignMemory", false);
        unexportedRuntimeFunction("mmapAlloc", false);
        unexportedRuntimeFunction("writeI53ToI64", false);
        unexportedRuntimeFunction("writeI53ToI64Clamped", false);
        unexportedRuntimeFunction("writeI53ToI64Signaling", false);
        unexportedRuntimeFunction("writeI53ToU64Clamped", false);
        unexportedRuntimeFunction("writeI53ToU64Signaling", false);
        unexportedRuntimeFunction("readI53FromI64", false);
        unexportedRuntimeFunction("readI53FromU64", false);
        unexportedRuntimeFunction("convertI32PairToI53", false);
        unexportedRuntimeFunction("convertI32PairToI53Checked", false);
        unexportedRuntimeFunction("convertU32PairToI53", false);
        unexportedRuntimeFunction("reallyNegative", false);
        unexportedRuntimeFunction("unSign", false);
        unexportedRuntimeFunction("strLen", false);
        unexportedRuntimeFunction("reSign", false);
        unexportedRuntimeFunction("formatString", false);
        unexportedRuntimeFunction("setValue", false);
        unexportedRuntimeFunction("getValue", false);
        unexportedRuntimeFunction("PATH", false);
        unexportedRuntimeFunction("PATH_FS", false);
        unexportedRuntimeFunction("SYSCALLS", false);
        unexportedRuntimeFunction("getSocketFromFD", false);
        unexportedRuntimeFunction("getSocketAddress", false);
        unexportedRuntimeFunction("JSEvents", false);
        unexportedRuntimeFunction("registerKeyEventCallback", false);
        unexportedRuntimeFunction("specialHTMLTargets", false);
        unexportedRuntimeFunction("maybeCStringToJsString", false);
        unexportedRuntimeFunction("findEventTarget", false);
        unexportedRuntimeFunction("findCanvasEventTarget", false);
        unexportedRuntimeFunction("getBoundingClientRect", false);
        unexportedRuntimeFunction("fillMouseEventData", false);
        unexportedRuntimeFunction("registerMouseEventCallback", false);
        unexportedRuntimeFunction("registerWheelEventCallback", false);
        unexportedRuntimeFunction("registerUiEventCallback", false);
        unexportedRuntimeFunction("registerFocusEventCallback", false);
        unexportedRuntimeFunction("fillDeviceOrientationEventData", false);
        unexportedRuntimeFunction("registerDeviceOrientationEventCallback", false);
        unexportedRuntimeFunction("fillDeviceMotionEventData", false);
        unexportedRuntimeFunction("registerDeviceMotionEventCallback", false);
        unexportedRuntimeFunction("screenOrientation", false);
        unexportedRuntimeFunction("fillOrientationChangeEventData", false);
        unexportedRuntimeFunction("registerOrientationChangeEventCallback", false);
        unexportedRuntimeFunction("fillFullscreenChangeEventData", false);
        unexportedRuntimeFunction("registerFullscreenChangeEventCallback", false);
        unexportedRuntimeFunction("JSEvents_requestFullscreen", false);
        unexportedRuntimeFunction("JSEvents_resizeCanvasForFullscreen", false);
        unexportedRuntimeFunction("registerRestoreOldStyle", false);
        unexportedRuntimeFunction("hideEverythingExceptGivenElement", false);
        unexportedRuntimeFunction("restoreHiddenElements", false);
        unexportedRuntimeFunction("setLetterbox", false);
        unexportedRuntimeFunction("currentFullscreenStrategy", false);
        unexportedRuntimeFunction("restoreOldWindowedStyle", false);
        unexportedRuntimeFunction("softFullscreenResizeWebGLRenderTarget", false);
        unexportedRuntimeFunction("doRequestFullscreen", false);
        unexportedRuntimeFunction("fillPointerlockChangeEventData", false);
        unexportedRuntimeFunction("registerPointerlockChangeEventCallback", false);
        unexportedRuntimeFunction("registerPointerlockErrorEventCallback", false);
        unexportedRuntimeFunction("requestPointerLock", false);
        unexportedRuntimeFunction("fillVisibilityChangeEventData", false);
        unexportedRuntimeFunction("registerVisibilityChangeEventCallback", false);
        unexportedRuntimeFunction("registerTouchEventCallback", false);
        unexportedRuntimeFunction("fillGamepadEventData", false);
        unexportedRuntimeFunction("registerGamepadEventCallback", false);
        unexportedRuntimeFunction("registerBeforeUnloadEventCallback", false);
        unexportedRuntimeFunction("fillBatteryEventData", false);
        unexportedRuntimeFunction("battery", false);
        unexportedRuntimeFunction("registerBatteryEventCallback", false);
        unexportedRuntimeFunction("setCanvasElementSize", false);
        unexportedRuntimeFunction("getCanvasElementSize", false);
        unexportedRuntimeFunction("demangle", false);
        unexportedRuntimeFunction("demangleAll", false);
        unexportedRuntimeFunction("jsStackTrace", false);
        unexportedRuntimeFunction("stackTrace", false);
        unexportedRuntimeFunction("getEnvStrings", false);
        unexportedRuntimeFunction("checkWasiClock", false);
        unexportedRuntimeFunction("doReadv", false);
        unexportedRuntimeFunction("doWritev", false);
        unexportedRuntimeFunction("dlopenMissingError", false);
        unexportedRuntimeFunction("setImmediateWrapped", false);
        unexportedRuntimeFunction("clearImmediateWrapped", false);
        unexportedRuntimeFunction("polyfillSetImmediate", false);
        unexportedRuntimeFunction("uncaughtExceptionCount", false);
        unexportedRuntimeFunction("exceptionLast", false);
        unexportedRuntimeFunction("exceptionCaught", false);
        unexportedRuntimeFunction("ExceptionInfo", false);
        unexportedRuntimeFunction("exception_addRef", false);
        unexportedRuntimeFunction("exception_decRef", false);
        unexportedRuntimeFunction("Browser", false);
        unexportedRuntimeFunction("setMainLoop", false);
        unexportedRuntimeFunction("wget", false);
        unexportedRuntimeFunction("FS", false);
        unexportedRuntimeFunction("MEMFS", false);
        unexportedRuntimeFunction("TTY", false);
        unexportedRuntimeFunction("PIPEFS", false);
        unexportedRuntimeFunction("SOCKFS", false);
        unexportedRuntimeFunction("_setNetworkCallback", false);
        unexportedRuntimeFunction("tempFixedLengthArray", false);
        unexportedRuntimeFunction("miniTempWebGLFloatBuffers", false);
        unexportedRuntimeFunction("heapObjectForWebGLType", false);
        unexportedRuntimeFunction("heapAccessShiftForWebGLHeap", false);
        unexportedRuntimeFunction("GL", false);
        unexportedRuntimeFunction("emscriptenWebGLGet", false);
        unexportedRuntimeFunction("computeUnpackAlignedImageSize", false);
        unexportedRuntimeFunction("emscriptenWebGLGetTexPixelData", false);
        unexportedRuntimeFunction("emscriptenWebGLGetUniform", false);
        unexportedRuntimeFunction("webglGetUniformLocation", false);
        unexportedRuntimeFunction("webglPrepareUniformLocationsBeforeFirstUse", false);
        unexportedRuntimeFunction("webglGetLeftBracePos", false);
        unexportedRuntimeFunction("emscriptenWebGLGetVertexAttrib", false);
        unexportedRuntimeFunction("writeGLArray", false);
        unexportedRuntimeFunction("AL", false);
        unexportedRuntimeFunction("SDL_unicode", false);
        unexportedRuntimeFunction("SDL_ttfContext", false);
        unexportedRuntimeFunction("SDL_audio", false);
        unexportedRuntimeFunction("SDL", false);
        unexportedRuntimeFunction("SDL_gfx", false);
        unexportedRuntimeFunction("GLUT", false);
        unexportedRuntimeFunction("EGL", false);
        unexportedRuntimeFunction("GLFW_Window", false);
        unexportedRuntimeFunction("GLFW", false);
        unexportedRuntimeFunction("GLEW", false);
        unexportedRuntimeFunction("IDBStore", false);
        unexportedRuntimeFunction("runAndAbortIfError", false);
        unexportedRuntimeSymbol("ALLOC_NORMAL", false);
        unexportedRuntimeSymbol("ALLOC_STACK", false);
        var calledRun;
        function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = "Program terminated with exit(" + status + ")";
          this.status = status;
        }
        var calledMain = false;
        dependenciesFulfilled = function runCaller() {
          if (!calledRun)
            run();
          if (!calledRun)
            dependenciesFulfilled = runCaller;
        };
        function callMain(args) {
          assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
          assert(__ATPRERUN__.length == 0, "cannot call main when preRun functions remain to be called");
          var entryFunction = Module2["_main"];
          args = args || [];
          args.unshift(thisProgram);
          var argc = args.length;
          var argv = stackAlloc((argc + 1) * 4);
          var argv_ptr = argv >> 2;
          args.forEach((arg) => {
            HEAP32[argv_ptr++] = allocateUTF8OnStack(arg);
          });
          HEAP32[argv_ptr] = 0;
          try {
            var ret = entryFunction(argc, argv);
            exit(
              ret,
              /* implicit = */
              true
            );
            return ret;
          } catch (e) {
            return handleException(e);
          } finally {
            calledMain = true;
          }
        }
        function stackCheckInit() {
          _emscripten_stack_init();
          writeStackCookie();
        }
        function run(args) {
          args = args || arguments_;
          if (runDependencies > 0) {
            return;
          }
          stackCheckInit();
          preRun();
          if (runDependencies > 0) {
            return;
          }
          function doRun() {
            if (calledRun)
              return;
            calledRun = true;
            Module2["calledRun"] = true;
            if (ABORT)
              return;
            initRuntime();
            preMain();
            readyPromiseResolve(Module2);
            if (Module2["onRuntimeInitialized"])
              Module2["onRuntimeInitialized"]();
            if (shouldRunNow)
              callMain(args);
            postRun();
          }
          if (Module2["setStatus"]) {
            Module2["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module2["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
          checkStackCookie();
        }
        Module2["run"] = run;
        function checkUnflushedContent() {
          var oldOut = out;
          var oldErr = err;
          var has = false;
          out = err = (x) => {
            has = true;
          };
          try {
            _fflush(0);
            ["stdout", "stderr"].forEach(function(name) {
              var info = FS.analyzePath("/dev/" + name);
              if (!info)
                return;
              var stream = info.object;
              var rdev = stream.rdev;
              var tty = TTY.ttys[rdev];
              if (tty && tty.output && tty.output.length) {
                has = true;
              }
            });
          } catch (e) {
          }
          out = oldOut;
          err = oldErr;
          if (has) {
            warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.");
          }
        }
        function exit(status, implicit) {
          EXITSTATUS = status;
          checkUnflushedContent();
          if (keepRuntimeAlive() && !implicit) {
            var msg = "program exited (with status: " + status + "), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)";
            readyPromiseReject(msg);
            err(msg);
          }
          procExit(status);
        }
        function procExit(code) {
          EXITSTATUS = code;
          if (!keepRuntimeAlive()) {
            if (Module2["onExit"])
              Module2["onExit"](code);
            ABORT = true;
          }
          quit_(code, new ExitStatus(code));
        }
        if (Module2["preInit"]) {
          if (typeof Module2["preInit"] == "function")
            Module2["preInit"] = [Module2["preInit"]];
          while (Module2["preInit"].length > 0) {
            Module2["preInit"].pop()();
          }
        }
        var shouldRunNow = true;
        if (Module2["noInitialRun"])
          shouldRunNow = false;
        run();
        Module2.resizeHeap = _emscripten_resize_heap;
        return Module2.ready;
      };
    })();
    module2.exports = Module;
  }
});

// src/formats/emscripten3.cjs
var require_emscripten3 = __commonJS({
  "src/formats/emscripten3.cjs"(exports2, module2) {
    var DEFAULT_GAS_LIMIT = 9e15;
    var Module = (() => {
      let _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : void 0;
      if (typeof __filename !== "undefined")
        _scriptDir = _scriptDir || __filename;
      return function(binaryOrInstantiate, { computeLimit, memoryLimit, extensions, format }) {
        var Module2 = Module2 || {};
        if (typeof binaryOrInstantiate === "function")
          Module2.instantiateWasm = binaryOrInstantiate;
        else
          Module2.wasmBinary = binaryOrInstantiate;
        Module2.gas = {
          limit: computeLimit || DEFAULT_GAS_LIMIT,
          used: 0,
          use: (amount) => {
            Module2.gas.used += amount;
          },
          refill: (amount) => {
            if (!amount)
              Module2.gas.used = 0;
            else
              Module2.gas.used = Math.max(Module2.gas.used - amount, 0);
          },
          isEmpty: () => Module2.gas.used > Module2.gas.limit
        };
        const _listeners_ = [];
        Module2.cleanupListeners = function() {
          _listeners_.forEach(([name, l]) => process.removeListener(name, l));
        };
        function uncaughtException(ex) {
          if (!(ex instanceof ExitStatus)) {
            throw ex;
          }
        }
        function unhandledRejection(reason) {
          throw reason;
        }
        _listeners_.push(
          ["uncaughtException", uncaughtException],
          ["unhandledRejection", unhandledRejection]
        );
        var readyPromiseResolve, readyPromiseReject;
        Module2["ready"] = new Promise((resolve, reject) => {
          readyPromiseResolve = resolve;
          readyPromiseReject = reject;
        });
        ["_memory", "_handle", "___indirect_function_table", "_main", "onRuntimeInitialized"].forEach((prop) => {
          if (!Object.getOwnPropertyDescriptor(Module2["ready"], prop)) {
            Object.defineProperty(Module2["ready"], prop, {
              get: () => abort("You are getting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js"),
              set: () => abort("You are setting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")
            });
          }
        });
        Module2.locateFile = (url) => url;
        var moduleOverrides = Object.assign({}, Module2);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow) => {
          throw toThrow;
        };
        var ENVIRONMENT_IS_WEB = typeof window == "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
        var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
        var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        if (Module2["ENVIRONMENT"]) {
          throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
        }
        var scriptDirectory = "";
        function locateFile(path) {
          if (Module2["locateFile"]) {
            return Module2["locateFile"](path, scriptDirectory);
          }
          return scriptDirectory + path;
        }
        var read_, readAsync, readBinary;
        if (ENVIRONMENT_IS_NODE) {
          if (typeof process == "undefined" || !process.release || process.release.name !== "node")
            throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          var nodeVersion = process.versions.node;
          var numericVersion = nodeVersion.split(".").slice(0, 3);
          numericVersion = numericVersion[0] * 1e4 + numericVersion[1] * 100 + numericVersion[2].split("-")[0] * 1;
          var minVersion = 16e4;
          if (numericVersion < 16e4) {
            throw new Error("This emscripten-generated code requires node v16.0.0 (detected v" + nodeVersion + ")");
          }
          var fs = require("fs");
          var nodePath = require("path");
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
          } else {
            scriptDirectory = __dirname + "/";
          }
          read_ = (filename, binary) => {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            return fs.readFileSync(filename, binary ? void 0 : "utf8");
          };
          readBinary = (filename) => {
            var ret = read_(filename, true);
            if (!ret.buffer) {
              ret = new Uint8Array(ret);
            }
            assert(ret.buffer);
            return ret;
          };
          readAsync = (filename, onload, onerror, binary = true) => {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            fs.readFile(filename, binary ? void 0 : "utf8", (err2, data) => {
              if (err2)
                onerror(err2);
              else
                onload(binary ? data.buffer : data);
            });
          };
          if (!Module2["thisProgram"] && process.argv.length > 1) {
            thisProgram = process.argv[1].replace(/\\/g, "/");
          }
          arguments_ = process.argv.slice(2);
          quit_ = (status, toThrow) => {
            process.exitCode = status;
            throw toThrow;
          };
        } else if (ENVIRONMENT_IS_SHELL) {
          if (typeof process == "object" && typeof require === "function" || typeof window == "object" || typeof importScripts == "function")
            throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          if (typeof read != "undefined") {
            read_ = read;
          }
          readBinary = (f) => {
            if (typeof readbuffer == "function") {
              return new Uint8Array(readbuffer(f));
            }
            let data = read(f, "binary");
            assert(typeof data == "object");
            return data;
          };
          readAsync = (f, onload, onerror) => {
            setTimeout(() => onload(readBinary(f)));
          };
          if (typeof clearTimeout == "undefined") {
            globalThis.clearTimeout = (id) => {
            };
          }
          if (typeof setTimeout == "undefined") {
            globalThis.setTimeout = (f) => typeof f == "function" ? f() : abort();
          }
          if (typeof scriptArgs != "undefined") {
            arguments_ = scriptArgs;
          } else if (typeof arguments != "undefined") {
            arguments_ = arguments;
          }
          if (typeof quit == "function") {
            quit_ = (status, toThrow) => {
              setTimeout(() => {
                if (!(toThrow instanceof ExitStatus)) {
                  let toLog = toThrow;
                  if (toThrow && typeof toThrow == "object" && toThrow.stack) {
                    toLog = [toThrow, toThrow.stack];
                  }
                  err(`exiting due to exception: ${toLog}`);
                }
                quit(status);
              });
              throw toThrow;
            };
          }
          if (typeof print != "undefined") {
            if (typeof console == "undefined")
              console = /** @type{!Console} */
              {};
            console.log = /** @type{!function(this:Console, ...*): undefined} */
            print;
            console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */
            typeof printErr != "undefined" ? printErr : print;
          }
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else if (typeof document != "undefined" && document.currentScript) {
            scriptDirectory = document.currentScript.src;
          }
          if (_scriptDir) {
            scriptDirectory = _scriptDir;
          }
          if (scriptDirectory.startsWith("blob:")) {
            scriptDirectory = "";
          } else {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
          }
          if (!(typeof window == "object" || typeof importScripts == "function"))
            throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          {
            read_ = (url) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.send(null);
              return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = (url) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(
                  /** @type{!ArrayBuffer} */
                  xhr.response
                );
              };
            }
            readAsync = (url, onload, onerror) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, true);
              xhr.responseType = "arraybuffer";
              xhr.onload = () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                  onload(xhr.response);
                  return;
                }
                onerror();
              };
              xhr.onerror = onerror;
              xhr.send(null);
            };
          }
        } else {
          throw new Error("environment detection error");
        }
        var out = Module2["print"] || console.log.bind(console);
        var err = Module2["printErr"] || console.error.bind(console);
        Object.assign(Module2, moduleOverrides);
        moduleOverrides = null;
        checkIncomingModuleAPI();
        if (Module2["arguments"])
          arguments_ = Module2["arguments"];
        legacyModuleProp("arguments", "arguments_");
        if (Module2["thisProgram"])
          thisProgram = Module2["thisProgram"];
        legacyModuleProp("thisProgram", "thisProgram");
        if (Module2["quit"])
          quit_ = Module2["quit"];
        legacyModuleProp("quit", "quit_");
        assert(typeof Module2["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["read"] == "undefined", "Module.read option was removed (modify read_ in JS)");
        assert(typeof Module2["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
        assert(typeof Module2["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
        assert(typeof Module2["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)");
        assert(typeof Module2["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
        legacyModuleProp("asm", "wasmExports");
        legacyModuleProp("read", "read_");
        legacyModuleProp("readAsync", "readAsync");
        legacyModuleProp("readBinary", "readBinary");
        legacyModuleProp("setWindowTitle", "setWindowTitle");
        var IDBFS = "IDBFS is no longer included by default; build with -lidbfs.js";
        var PROXYFS = "PROXYFS is no longer included by default; build with -lproxyfs.js";
        var WORKERFS = "WORKERFS is no longer included by default; build with -lworkerfs.js";
        var FETCHFS = "FETCHFS is no longer included by default; build with -lfetchfs.js";
        var ICASEFS = "ICASEFS is no longer included by default; build with -licasefs.js";
        var JSFILEFS = "JSFILEFS is no longer included by default; build with -ljsfilefs.js";
        var OPFS = "OPFS is no longer included by default; build with -lopfs.js";
        var NODEFS = "NODEFS is no longer included by default; build with -lnodefs.js";
        assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");
        var wasmBinary;
        if (Module2["wasmBinary"])
          wasmBinary = Module2["wasmBinary"];
        legacyModuleProp("wasmBinary", "wasmBinary");
        if (typeof WebAssembly != "object") {
          abort("no native wasm support detected");
        }
        var wasmMemory;
        var ABORT = false;
        var EXITSTATUS;
        function assert(condition, text) {
          if (!condition) {
            abort("Assertion failed" + (text ? ": " + text : ""));
          }
        }
        function _malloc() {
          abort("malloc() called but not included in the build - add `_malloc` to EXPORTED_FUNCTIONS");
        }
        function _free() {
          abort("free() called but not included in the build - add `_free` to EXPORTED_FUNCTIONS");
        }
        var HEAP, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        function updateMemoryViews() {
          var b = wasmMemory.buffer;
          Module2["HEAP8"] = HEAP8 = new Int8Array(b);
          Module2["HEAP16"] = HEAP16 = new Int16Array(b);
          Module2["HEAPU8"] = HEAPU8 = new Uint8Array(b);
          Module2["HEAPU16"] = HEAPU16 = new Uint16Array(b);
          Module2["HEAP32"] = HEAP32 = new Int32Array(b);
          Module2["HEAPU32"] = HEAPU32 = new Uint32Array(b);
          Module2["HEAPF32"] = HEAPF32 = new Float32Array(b);
          Module2["HEAPF64"] = HEAPF64 = new Float64Array(b);
        }
        assert(!Module2["STACK_SIZE"], "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");
        assert(typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != void 0 && Int32Array.prototype.set != void 0, "JS engine does not provide full typed array support");
        assert(!Module2["wasmMemory"], "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");
        assert(!Module2["INITIAL_MEMORY"], "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
        function writeStackCookie() {
          var max = _emscripten_stack_get_end();
          assert((max & 3) == 0);
          if (max == 0) {
            max += 4;
          }
          HEAPU32[max >>> 2 >>> 0] = 34821223;
          HEAPU32[max + 4 >>> 2 >>> 0] = 2310721022;
          HEAPU32[0 >>> 2 >>> 0] = 1668509029;
        }
        function checkStackCookie() {
          if (ABORT)
            return;
          var max = _emscripten_stack_get_end();
          if (max == 0) {
            max += 4;
          }
          var cookie1 = HEAPU32[max >>> 2 >>> 0];
          var cookie2 = HEAPU32[max + 4 >>> 2 >>> 0];
          if (cookie1 != 34821223 || cookie2 != 2310721022) {
            abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
          }
          if (HEAPU32[0 >>> 2 >>> 0] != 1668509029) {
            abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
          }
        }
        (function() {
          var h16 = new Int16Array(1);
          var h8 = new Int8Array(h16.buffer);
          h16[0] = 25459;
          if (h8[0] !== 115 || h8[1] !== 99)
            throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
        })();
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATEXIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        function preRun() {
          if (Module2["preRun"]) {
            if (typeof Module2["preRun"] == "function")
              Module2["preRun"] = [Module2["preRun"]];
            while (Module2["preRun"].length) {
              addOnPreRun(Module2["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          assert(!runtimeInitialized);
          runtimeInitialized = true;
          checkStackCookie();
          if (!Module2["noFSInit"] && !FS.init.initialized)
            FS.init();
          FS.ignorePermissions = false;
          TTY.init();
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          checkStackCookie();
          callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
          checkStackCookie();
          if (Module2["postRun"]) {
            if (typeof Module2["postRun"] == "function")
              Module2["postRun"] = [Module2["postRun"]];
            while (Module2["postRun"].length) {
              addOnPostRun(Module2["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
          __ATINIT__.unshift(cb);
        }
        function addOnPreMain(cb) {
          __ATMAIN__.unshift(cb);
        }
        function addOnExit(cb) {
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        var runDependencyTracking = {};
        function getUniqueRunDependency(id) {
          var orig = id;
          while (1) {
            if (!runDependencyTracking[id])
              return id;
            id = orig + Math.random();
          }
        }
        function addRunDependency(id) {
          runDependencies++;
          Module2["monitorRunDependencies"]?.(runDependencies);
          if (id) {
            assert(!runDependencyTracking[id]);
            runDependencyTracking[id] = 1;
            if (runDependencyWatcher === null && typeof setInterval != "undefined") {
              runDependencyWatcher = setInterval(() => {
                if (ABORT) {
                  clearInterval(runDependencyWatcher);
                  runDependencyWatcher = null;
                  return;
                }
                var shown = false;
                for (var dep in runDependencyTracking) {
                  if (!shown) {
                    shown = true;
                    err("still waiting on run dependencies:");
                  }
                  err(`dependency: ${dep}`);
                }
                if (shown) {
                  err("(end of list)");
                }
              }, 1e4);
            }
          } else {
            err("warning: run dependency added without ID");
          }
        }
        function removeRunDependency(id) {
          runDependencies--;
          Module2["monitorRunDependencies"]?.(runDependencies);
          if (id) {
            assert(runDependencyTracking[id]);
            delete runDependencyTracking[id];
          } else {
            err("warning: run dependency removed without ID");
          }
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        function abort(what) {
          Module2["onAbort"]?.(what);
          what = "Aborted(" + what + ")";
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          var e = new WebAssembly.RuntimeError(what);
          readyPromiseReject(e);
          throw e;
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
        var isFileURI = (filename) => filename.startsWith("file://");
        function createExportWrapper(name) {
          return (...args) => {
            assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
            var f = wasmExports[name];
            assert(f, `exported native function \`${name}\` not found`);
            return f(...args);
          };
        }
        var wasmBinaryFile;
        wasmBinaryFile = "AOS.wasm";
        if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinarySync(file) {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          if (readBinary) {
            return readBinary(file);
          }
          throw "both async and sync fetching of the wasm failed";
        }
        function getBinaryPromise(binaryFile) {
          if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
            if (typeof fetch == "function" && !isFileURI(binaryFile)) {
              return fetch(binaryFile, {
                credentials: "same-origin"
              }).then((response) => {
                if (!response["ok"]) {
                  throw `failed to load wasm binary file at '${binaryFile}'`;
                }
                return response["arrayBuffer"]();
              }).catch(() => getBinarySync(binaryFile));
            } else if (readAsync) {
              return new Promise((resolve, reject) => {
                readAsync(binaryFile, (response) => resolve(new Uint8Array(
                  /** @type{!ArrayBuffer} */
                  response
                )), reject);
              });
            }
          }
          return Promise.resolve().then(() => getBinarySync(binaryFile));
        }
        function instantiateArrayBuffer(binaryFile, imports, receiver) {
          return getBinaryPromise(binaryFile).then((binary) => WebAssembly.instantiate(binary, imports)).then(receiver, (reason) => {
            err(`failed to asynchronously prepare wasm: ${reason}`);
            if (isFileURI(wasmBinaryFile)) {
              err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
            }
            abort(reason);
          });
        }
        function instantiateAsync(binary, binaryFile, imports, callback) {
          if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
            return fetch(binaryFile, {
              credentials: "same-origin"
            }).then((response) => {
              var result = WebAssembly.instantiateStreaming(response, imports);
              return result.then(callback, function(reason) {
                err(`wasm streaming compile failed: ${reason}`);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(binaryFile, imports, callback);
              });
            });
          }
          return instantiateArrayBuffer(binaryFile, imports, callback);
        }
        function createWasm() {
          var info = {
            "env": wasmImports,
            "wasi_snapshot_preview1": wasmImports,
            metering: { usegas: function(gas) {
              Module2.gas.use(gas);
              if (Module2.gas.isEmpty())
                throw Error("out of gas!");
            } }
          };
          function receiveInstance(instance, module3) {
            wasmExports = instance.exports;
            wasmExports = applySignatureConversions(wasmExports);
            wasmMemory = wasmExports["memory"];
            assert(wasmMemory, "memory not found in wasm exports");
            updateMemoryViews();
            wasmTable = wasmExports["__indirect_function_table"];
            assert(wasmTable, "table not found in wasm exports");
            addOnInit(wasmExports["__wasm_call_ctors"]);
            removeRunDependency("wasm-instantiate");
            return wasmExports;
          }
          addRunDependency("wasm-instantiate");
          var trueModule = Module2;
          function receiveInstantiationResult(result) {
            assert(Module2 === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
            trueModule = null;
            receiveInstance(result["instance"]);
          }
          if (Module2["instantiateWasm"]) {
            try {
              return Module2["instantiateWasm"](info, receiveInstance);
            } catch (e) {
              err(`Module.instantiateWasm callback failed with error: ${e}`);
              readyPromiseReject(e);
            }
          }
          instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
          return {};
        }
        var tempDouble;
        var tempI64;
        function legacyModuleProp(prop, newName, incoming = true) {
          if (!Object.getOwnPropertyDescriptor(Module2, prop)) {
            Object.defineProperty(Module2, prop, {
              configurable: true,
              get() {
                let extra = incoming ? " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)" : "";
                abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);
              }
            });
          }
        }
        function ignoredModuleProp(prop) {
          if (Object.getOwnPropertyDescriptor(Module2, prop)) {
            abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
          }
        }
        function isExportedByForceFilesystem(name) {
          return name === "FS_createPath" || name === "FS_createDataFile" || name === "FS_createPreloadedFile" || name === "FS_unlink" || name === "addRunDependency" || name === "FS_createLazyFile" || name === "FS_createDevice" || name === "removeRunDependency";
        }
        function missingGlobal(sym, msg) {
          if (typeof globalThis !== "undefined") {
            Object.defineProperty(globalThis, sym, {
              configurable: true,
              get() {
                warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
                return void 0;
              }
            });
          }
        }
        missingGlobal("buffer", "Please use HEAP8.buffer or wasmMemory.buffer");
        missingGlobal("asm", "Please use wasmExports instead");
        function missingLibrarySymbol(sym) {
          if (typeof globalThis !== "undefined" && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
            Object.defineProperty(globalThis, sym, {
              configurable: true,
              get() {
                var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
                var librarySymbol = sym;
                if (!librarySymbol.startsWith("_")) {
                  librarySymbol = "$" + sym;
                }
                msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
                if (isExportedByForceFilesystem(sym)) {
                  msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
                }
                warnOnce(msg);
                return void 0;
              }
            });
          }
          unexportedRuntimeSymbol(sym);
        }
        function unexportedRuntimeSymbol(sym) {
          if (!Object.getOwnPropertyDescriptor(Module2, sym)) {
            Object.defineProperty(Module2, sym, {
              configurable: true,
              get() {
                var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
                if (isExportedByForceFilesystem(sym)) {
                  msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
                }
                abort(msg);
              }
            });
          }
        }
        function dbg(...args) {
          console.warn(...args);
        }
        function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = `Program terminated with exit(${status})`;
          this.status = status;
        }
        var callRuntimeCallbacks = (callbacks) => {
          while (callbacks.length > 0) {
            callbacks.shift()(Module2);
          }
        };
        function getValue(ptr, type = "i8") {
          if (type.endsWith("*"))
            type = "*";
          switch (type) {
            case "i1":
              return HEAP8[ptr >>> 0];
            case "i8":
              return HEAP8[ptr >>> 0];
            case "i16":
              return HEAP16[ptr >>> 1 >>> 0];
            case "i32":
              return HEAP32[ptr >>> 2 >>> 0];
            case "i64":
              abort("to do getValue(i64) use WASM_BIGINT");
            case "float":
              return HEAPF32[ptr >>> 2 >>> 0];
            case "double":
              return HEAPF64[ptr >>> 3 >>> 0];
            case "*":
              return HEAPU32[ptr >>> 2 >>> 0];
            default:
              abort(`invalid type for getValue: ${type}`);
          }
        }
        var noExitRuntime = Module2["noExitRuntime"] || true;
        var ptrToString = (ptr) => {
          assert(typeof ptr === "number");
          return "0x" + ptr.toString(16).padStart(8, "0");
        };
        function setValue(ptr, value, type = "i8") {
          if (type.endsWith("*"))
            type = "*";
          switch (type) {
            case "i1":
              HEAP8[ptr >>> 0] = value;
              break;
            case "i8":
              HEAP8[ptr >>> 0] = value;
              break;
            case "i16":
              HEAP16[ptr >>> 1 >>> 0] = value;
              break;
            case "i32":
              HEAP32[ptr >>> 2 >>> 0] = value;
              break;
            case "i64":
              abort("to do setValue(i64) use WASM_BIGINT");
            case "float":
              HEAPF32[ptr >>> 2 >>> 0] = value;
              break;
            case "double":
              HEAPF64[ptr >>> 3 >>> 0] = value;
              break;
            case "*":
              HEAPU32[ptr >>> 2 >>> 0] = value;
              break;
            default:
              abort(`invalid type for setValue: ${type}`);
          }
        }
        var warnOnce = (text) => {
          warnOnce.shown ||= {};
          if (!warnOnce.shown[text]) {
            warnOnce.shown[text] = 1;
            if (ENVIRONMENT_IS_NODE)
              text = "warning: " + text;
            err(text);
          }
        };
        var PATH = {
          isAbs: (path) => path.charAt(0) === "/",
          splitPath: (filename) => {
            var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            return splitPathRe.exec(filename).slice(1);
          },
          normalizeArray: (parts, allowAboveRoot) => {
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
              var last = parts[i];
              if (last === ".") {
                parts.splice(i, 1);
              } else if (last === "..") {
                parts.splice(i, 1);
                up++;
              } else if (up) {
                parts.splice(i, 1);
                up--;
              }
            }
            if (allowAboveRoot) {
              for (; up; up--) {
                parts.unshift("..");
              }
            }
            return parts;
          },
          normalize: (path) => {
            var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
            path = PATH.normalizeArray(path.split("/").filter((p) => !!p), !isAbsolute).join("/");
            if (!path && !isAbsolute) {
              path = ".";
            }
            if (path && trailingSlash) {
              path += "/";
            }
            return (isAbsolute ? "/" : "") + path;
          },
          dirname: (path) => {
            var result = PATH.splitPath(path), root = result[0], dir = result[1];
            if (!root && !dir) {
              return ".";
            }
            if (dir) {
              dir = dir.substr(0, dir.length - 1);
            }
            return root + dir;
          },
          basename: (path) => {
            if (path === "/")
              return "/";
            path = PATH.normalize(path);
            path = path.replace(/\/$/, "");
            var lastSlash = path.lastIndexOf("/");
            if (lastSlash === -1)
              return path;
            return path.substr(lastSlash + 1);
          },
          join: (...paths) => PATH.normalize(paths.join("/")),
          join2: (l, r) => PATH.normalize(l + "/" + r)
        };
        var initRandomFill = () => {
          if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
            return (view) => crypto.getRandomValues(view);
          } else if (ENVIRONMENT_IS_NODE) {
            try {
              var crypto_module = require("crypto");
              var randomFillSync = crypto_module["randomFillSync"];
              if (randomFillSync) {
                return (view) => crypto_module["randomFillSync"](view);
              }
              var randomBytes = crypto_module["randomBytes"];
              return (view) => (view.set(randomBytes(view.byteLength)), view);
            } catch (e) {
            }
          }
          abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: (array) => { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
        };
        var randomFill = (view) => (randomFill = initRandomFill())(view);
        var PATH_FS = {
          resolve: (...args) => {
            var resolvedPath = "", resolvedAbsolute = false;
            for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
              var path = i >= 0 ? args[i] : FS.cwd();
              if (typeof path != "string") {
                throw new TypeError("Arguments to path.resolve must be strings");
              } else if (!path) {
                return "";
              }
              resolvedPath = path + "/" + resolvedPath;
              resolvedAbsolute = PATH.isAbs(path);
            }
            resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p) => !!p), !resolvedAbsolute).join("/");
            return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
          },
          relative: (from, to) => {
            from = PATH_FS.resolve(from).substr(1);
            to = PATH_FS.resolve(to).substr(1);
            function trim(arr) {
              var start = 0;
              for (; start < arr.length; start++) {
                if (arr[start] !== "")
                  break;
              }
              var end = arr.length - 1;
              for (; end >= 0; end--) {
                if (arr[end] !== "")
                  break;
              }
              if (start > end)
                return [];
              return arr.slice(start, end - start + 1);
            }
            var fromParts = trim(from.split("/"));
            var toParts = trim(to.split("/"));
            var length = Math.min(fromParts.length, toParts.length);
            var samePartsLength = length;
            for (var i = 0; i < length; i++) {
              if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
              }
            }
            var outputParts = [];
            for (var i = samePartsLength; i < fromParts.length; i++) {
              outputParts.push("..");
            }
            outputParts = outputParts.concat(toParts.slice(samePartsLength));
            return outputParts.join("/");
          }
        };
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
        var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
          idx >>>= 0;
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          while (heapOrArray[endPtr] && !(endPtr >= endIdx))
            ++endPtr;
          if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
          }
          var str = "";
          while (idx < endPtr) {
            var u0 = heapOrArray[idx++];
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }
            var u1 = heapOrArray[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue;
            }
            var u2 = heapOrArray[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            } else {
              if ((u0 & 248) != 240)
                warnOnce("Invalid UTF-8 leading byte " + ptrToString(u0) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
              u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
          }
          return str;
        };
        var FS_stdin_getChar_buffer = [];
        var lengthBytesUTF8 = (str) => {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);
            if (c <= 127) {
              len++;
            } else if (c <= 2047) {
              len += 2;
            } else if (c >= 55296 && c <= 57343) {
              len += 4;
              ++i;
            } else {
              len += 3;
            }
          }
          return len;
        };
        var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
          outIdx >>>= 0;
          assert(typeof str === "string", `stringToUTF8Array expects a string (got ${typeof str})`);
          if (!(maxBytesToWrite > 0))
            return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i);
              u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
              if (outIdx >= endIdx)
                break;
              heap[outIdx++ >>> 0] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx)
                break;
              heap[outIdx++ >>> 0] = 192 | u >> 6;
              heap[outIdx++ >>> 0] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx)
                break;
              heap[outIdx++ >>> 0] = 224 | u >> 12;
              heap[outIdx++ >>> 0] = 128 | u >> 6 & 63;
              heap[outIdx++ >>> 0] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx)
                break;
              if (u > 1114111)
                warnOnce("Invalid Unicode code point " + ptrToString(u) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
              heap[outIdx++ >>> 0] = 240 | u >> 18;
              heap[outIdx++ >>> 0] = 128 | u >> 12 & 63;
              heap[outIdx++ >>> 0] = 128 | u >> 6 & 63;
              heap[outIdx++ >>> 0] = 128 | u & 63;
            }
          }
          heap[outIdx >>> 0] = 0;
          return outIdx - startIdx;
        };
        function intArrayFromString(stringy, dontAddNull, length) {
          var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
          var u8array = new Array(len);
          var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
          if (dontAddNull)
            u8array.length = numBytesWritten;
          return u8array;
        }
        var FS_stdin_getChar = () => {
          if (!FS_stdin_getChar_buffer.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              var BUFSIZE = 256;
              var buf = Buffer.alloc(BUFSIZE);
              var bytesRead = 0;
              var fd = process.stdin.fd;
              try {
                bytesRead = fs.readSync(fd, buf);
              } catch (e) {
                if (e.toString().includes("EOF"))
                  bytesRead = 0;
                else
                  throw e;
              }
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString("utf-8");
              } else {
                result = null;
              }
            } else if (typeof window != "undefined" && typeof window.prompt == "function") {
              result = window.prompt("Input: ");
              if (result !== null) {
                result += "\n";
              }
            } else if (typeof readline == "function") {
              result = readline();
              if (result !== null) {
                result += "\n";
              }
            }
            if (!result) {
              return null;
            }
            FS_stdin_getChar_buffer = intArrayFromString(result, true);
          }
          return FS_stdin_getChar_buffer.shift();
        };
        var TTY = {
          ttys: [],
          init() {
          },
          shutdown() {
          },
          register(dev, ops) {
            TTY.ttys[dev] = {
              input: [],
              output: [],
              ops
            };
            FS.registerDevice(dev, TTY.stream_ops);
          },
          stream_ops: {
            open(stream) {
              var tty = TTY.ttys[stream.node.rdev];
              if (!tty) {
                throw new FS.ErrnoError(43);
              }
              stream.tty = tty;
              stream.seekable = false;
            },
            close(stream) {
              stream.tty.ops.fsync(stream.tty);
            },
            fsync(stream) {
              stream.tty.ops.fsync(stream.tty);
            },
            read(stream, buffer, offset, length, pos) {
              if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(60);
              }
              var bytesRead = 0;
              for (var i = 0; i < length; i++) {
                var result;
                try {
                  result = stream.tty.ops.get_char(stream.tty);
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
                if (result === void 0 && bytesRead === 0) {
                  throw new FS.ErrnoError(6);
                }
                if (result === null || result === void 0)
                  break;
                bytesRead++;
                buffer[offset + i] = result;
              }
              if (bytesRead) {
                stream.node.timestamp = Date.now();
              }
              return bytesRead;
            },
            write(stream, buffer, offset, length, pos) {
              if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(60);
              }
              try {
                for (var i = 0; i < length; i++) {
                  stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                }
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (length) {
                stream.node.timestamp = Date.now();
              }
              return i;
            }
          },
          default_tty_ops: {
            get_char(tty) {
              return FS_stdin_getChar();
            },
            put_char(tty, val) {
              if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              } else {
                if (val != 0)
                  tty.output.push(val);
              }
            },
            fsync(tty) {
              if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              }
            },
            ioctl_tcgets(tty) {
              return {
                c_iflag: 25856,
                c_oflag: 5,
                c_cflag: 191,
                c_lflag: 35387,
                c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              };
            },
            ioctl_tcsets(tty, optional_actions, data) {
              return 0;
            },
            ioctl_tiocgwinsz(tty) {
              return [24, 80];
            }
          },
          default_tty1_ops: {
            put_char(tty, val) {
              if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              } else {
                if (val != 0)
                  tty.output.push(val);
              }
            },
            fsync(tty) {
              if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              }
            }
          }
        };
        var zeroMemory = (address, size) => {
          HEAPU8.fill(0, address, address + size);
          return address;
        };
        var alignMemory = (size, alignment) => {
          assert(alignment, "alignment argument is required");
          return Math.ceil(size / alignment) * alignment;
        };
        var mmapAlloc = (size) => {
          size = alignMemory(size, 65536);
          var ptr = _emscripten_builtin_memalign(65536, size);
          if (!ptr)
            return 0;
          return zeroMemory(ptr, size);
        };
        var MEMFS = {
          ops_table: null,
          mount(mount) {
            return MEMFS.createNode(
              null,
              "/",
              16384 | 511,
              /* 0777 */
              0
            );
          },
          createNode(parent, name, mode, dev) {
            if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
              throw new FS.ErrnoError(63);
            }
            MEMFS.ops_table ||= {
              dir: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  lookup: MEMFS.node_ops.lookup,
                  mknod: MEMFS.node_ops.mknod,
                  rename: MEMFS.node_ops.rename,
                  unlink: MEMFS.node_ops.unlink,
                  rmdir: MEMFS.node_ops.rmdir,
                  readdir: MEMFS.node_ops.readdir,
                  symlink: MEMFS.node_ops.symlink
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek
                }
              },
              file: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek,
                  read: MEMFS.stream_ops.read,
                  write: MEMFS.stream_ops.write,
                  allocate: MEMFS.stream_ops.allocate,
                  mmap: MEMFS.stream_ops.mmap,
                  msync: MEMFS.stream_ops.msync
                }
              },
              link: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  readlink: MEMFS.node_ops.readlink
                },
                stream: {}
              },
              chrdev: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: FS.chrdev_stream_ops
              }
            };
            var node = FS.createNode(parent, name, mode, dev);
            if (FS.isDir(node.mode)) {
              node.node_ops = MEMFS.ops_table.dir.node;
              node.stream_ops = MEMFS.ops_table.dir.stream;
              node.contents = {};
            } else if (FS.isFile(node.mode)) {
              node.node_ops = MEMFS.ops_table.file.node;
              node.stream_ops = MEMFS.ops_table.file.stream;
              node.usedBytes = 0;
              node.contents = null;
            } else if (FS.isLink(node.mode)) {
              node.node_ops = MEMFS.ops_table.link.node;
              node.stream_ops = MEMFS.ops_table.link.stream;
            } else if (FS.isChrdev(node.mode)) {
              node.node_ops = MEMFS.ops_table.chrdev.node;
              node.stream_ops = MEMFS.ops_table.chrdev.stream;
            }
            node.timestamp = Date.now();
            if (parent) {
              parent.contents[name] = node;
              parent.timestamp = node.timestamp;
            }
            return node;
          },
          getFileDataAsTypedArray(node) {
            if (!node.contents)
              return new Uint8Array(0);
            if (node.contents.subarray)
              return node.contents.subarray(0, node.usedBytes);
            return new Uint8Array(node.contents);
          },
          expandFileStorage(node, newCapacity) {
            var prevCapacity = node.contents ? node.contents.length : 0;
            if (prevCapacity >= newCapacity)
              return;
            var CAPACITY_DOUBLING_MAX = 1024 * 1024;
            newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
            if (prevCapacity != 0)
              newCapacity = Math.max(newCapacity, 256);
            var oldContents = node.contents;
            node.contents = new Uint8Array(newCapacity);
            if (node.usedBytes > 0)
              node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
          },
          resizeFileStorage(node, newSize) {
            if (node.usedBytes == newSize)
              return;
            if (newSize == 0) {
              node.contents = null;
              node.usedBytes = 0;
            } else {
              var oldContents = node.contents;
              node.contents = new Uint8Array(newSize);
              if (oldContents) {
                node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
              }
              node.usedBytes = newSize;
            }
          },
          node_ops: {
            getattr(node) {
              var attr = {};
              attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
              attr.ino = node.id;
              attr.mode = node.mode;
              attr.nlink = 1;
              attr.uid = 0;
              attr.gid = 0;
              attr.rdev = node.rdev;
              if (FS.isDir(node.mode)) {
                attr.size = 4096;
              } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes;
              } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length;
              } else {
                attr.size = 0;
              }
              attr.atime = new Date(node.timestamp);
              attr.mtime = new Date(node.timestamp);
              attr.ctime = new Date(node.timestamp);
              attr.blksize = 4096;
              attr.blocks = Math.ceil(attr.size / attr.blksize);
              return attr;
            },
            setattr(node, attr) {
              if (attr.mode !== void 0) {
                node.mode = attr.mode;
              }
              if (attr.timestamp !== void 0) {
                node.timestamp = attr.timestamp;
              }
              if (attr.size !== void 0) {
                MEMFS.resizeFileStorage(node, attr.size);
              }
            },
            lookup(parent, name) {
              throw FS.genericErrors[44];
            },
            mknod(parent, name, mode, dev) {
              return MEMFS.createNode(parent, name, mode, dev);
            },
            rename(old_node, new_dir, new_name) {
              if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                  new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {
                }
                if (new_node) {
                  for (var i in new_node.contents) {
                    throw new FS.ErrnoError(55);
                  }
                }
              }
              delete old_node.parent.contents[old_node.name];
              old_node.parent.timestamp = Date.now();
              old_node.name = new_name;
              new_dir.contents[new_name] = old_node;
              new_dir.timestamp = old_node.parent.timestamp;
              old_node.parent = new_dir;
            },
            unlink(parent, name) {
              delete parent.contents[name];
              parent.timestamp = Date.now();
            },
            rmdir(parent, name) {
              var node = FS.lookupNode(parent, name);
              for (var i in node.contents) {
                throw new FS.ErrnoError(55);
              }
              delete parent.contents[name];
              parent.timestamp = Date.now();
            },
            readdir(node) {
              var entries = [".", ".."];
              for (var key of Object.keys(node.contents)) {
                entries.push(key);
              }
              return entries;
            },
            symlink(parent, newname, oldpath) {
              var node = MEMFS.createNode(parent, newname, 511 | /* 0777 */
              40960, 0);
              node.link = oldpath;
              return node;
            },
            readlink(node) {
              if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(28);
              }
              return node.link;
            }
          },
          stream_ops: {
            read(stream, buffer, offset, length, position) {
              var contents = stream.node.contents;
              if (position >= stream.node.usedBytes)
                return 0;
              var size = Math.min(stream.node.usedBytes - position, length);
              assert(size >= 0);
              if (size > 8 && contents.subarray) {
                buffer.set(contents.subarray(position, position + size), offset);
              } else {
                for (var i = 0; i < size; i++)
                  buffer[offset + i] = contents[position + i];
              }
              return size;
            },
            write(stream, buffer, offset, length, position, canOwn) {
              assert(!(buffer instanceof ArrayBuffer));
              if (buffer.buffer === HEAP8.buffer) {
                canOwn = false;
              }
              if (!length)
                return 0;
              var node = stream.node;
              node.timestamp = Date.now();
              if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                  assert(position === 0, "canOwn must imply no weird position inside the file");
                  node.contents = buffer.subarray(offset, offset + length);
                  node.usedBytes = length;
                  return length;
                } else if (node.usedBytes === 0 && position === 0) {
                  node.contents = buffer.slice(offset, offset + length);
                  node.usedBytes = length;
                  return length;
                } else if (position + length <= node.usedBytes) {
                  node.contents.set(buffer.subarray(offset, offset + length), position);
                  return length;
                }
              }
              MEMFS.expandFileStorage(node, position + length);
              if (node.contents.subarray && buffer.subarray) {
                node.contents.set(buffer.subarray(offset, offset + length), position);
              } else {
                for (var i = 0; i < length; i++) {
                  node.contents[position + i] = buffer[offset + i];
                }
              }
              node.usedBytes = Math.max(node.usedBytes, position + length);
              return length;
            },
            llseek(stream, offset, whence) {
              var position = offset;
              if (whence === 1) {
                position += stream.position;
              } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                  position += stream.node.usedBytes;
                }
              }
              if (position < 0) {
                throw new FS.ErrnoError(28);
              }
              return position;
            },
            allocate(stream, offset, length) {
              MEMFS.expandFileStorage(stream.node, offset + length);
              stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
            },
            mmap(stream, length, position, prot, flags) {
              if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
              }
              var ptr;
              var allocated;
              var contents = stream.node.contents;
              if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
                allocated = false;
                ptr = contents.byteOffset;
              } else {
                if (position > 0 || position + length < contents.length) {
                  if (contents.subarray) {
                    contents = contents.subarray(position, position + length);
                  } else {
                    contents = Array.prototype.slice.call(contents, position, position + length);
                  }
                }
                allocated = true;
                ptr = mmapAlloc(length);
                if (!ptr) {
                  throw new FS.ErrnoError(48);
                }
                HEAP8.set(contents, ptr >>> 0);
              }
              return {
                ptr,
                allocated
              };
            },
            msync(stream, buffer, offset, length, mmapFlags) {
              MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
              return 0;
            }
          }
        };
        var asyncLoad = (url, onload, onerror, noRunDep) => {
          var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
          readAsync(url, (arrayBuffer) => {
            assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
            onload(new Uint8Array(arrayBuffer));
            if (dep)
              removeRunDependency(dep);
          }, (event) => {
            if (onerror) {
              onerror();
            } else {
              throw `Loading data file "${url}" failed.`;
            }
          });
          if (dep)
            addRunDependency(dep);
        };
        var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
          FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
        };
        var preloadPlugins = Module2["preloadPlugins"] || [];
        var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
          if (typeof Browser != "undefined")
            Browser.init();
          var handled = false;
          preloadPlugins.forEach((plugin) => {
            if (handled)
              return;
            if (plugin["canHandle"](fullname)) {
              plugin["handle"](byteArray, fullname, finish, onerror);
              handled = true;
            }
          });
          return handled;
        };
        var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
          var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
          var dep = getUniqueRunDependency(`cp ${fullname}`);
          function processData(byteArray) {
            function finish(byteArray2) {
              preFinish?.();
              if (!dontCreateFile) {
                FS_createDataFile(parent, name, byteArray2, canRead, canWrite, canOwn);
              }
              onload?.();
              removeRunDependency(dep);
            }
            if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
              onerror?.();
              removeRunDependency(dep);
            })) {
              return;
            }
            finish(byteArray);
          }
          addRunDependency(dep);
          if (typeof url == "string") {
            asyncLoad(url, processData, onerror);
          } else {
            processData(url);
          }
        };
        var FS_modeStringToFlags = (str) => {
          var flagModes = {
            "r": 0,
            "r+": 2,
            "w": 512 | 64 | 1,
            "w+": 512 | 64 | 2,
            "a": 1024 | 64 | 1,
            "a+": 1024 | 64 | 2
          };
          var flags = flagModes[str];
          if (typeof flags == "undefined") {
            throw new Error(`Unknown file open mode: ${str}`);
          }
          return flags;
        };
        var FS_getMode = (canRead, canWrite) => {
          var mode = 0;
          if (canRead)
            mode |= 292 | 73;
          if (canWrite)
            mode |= 146;
          return mode;
        };
        var ERRNO_MESSAGES = {
          0: "Success",
          1: "Arg list too long",
          2: "Permission denied",
          3: "Address already in use",
          4: "Address not available",
          5: "Address family not supported by protocol family",
          6: "No more processes",
          7: "Socket already connected",
          8: "Bad file number",
          9: "Trying to read unreadable message",
          10: "Mount device busy",
          11: "Operation canceled",
          12: "No children",
          13: "Connection aborted",
          14: "Connection refused",
          15: "Connection reset by peer",
          16: "File locking deadlock error",
          17: "Destination address required",
          18: "Math arg out of domain of func",
          19: "Quota exceeded",
          20: "File exists",
          21: "Bad address",
          22: "File too large",
          23: "Host is unreachable",
          24: "Identifier removed",
          25: "Illegal byte sequence",
          26: "Connection already in progress",
          27: "Interrupted system call",
          28: "Invalid argument",
          29: "I/O error",
          30: "Socket is already connected",
          31: "Is a directory",
          32: "Too many symbolic links",
          33: "Too many open files",
          34: "Too many links",
          35: "Message too long",
          36: "Multihop attempted",
          37: "File or path name too long",
          38: "Network interface is not configured",
          39: "Connection reset by network",
          40: "Network is unreachable",
          41: "Too many open files in system",
          42: "No buffer space available",
          43: "No such device",
          44: "No such file or directory",
          45: "Exec format error",
          46: "No record locks available",
          47: "The link has been severed",
          48: "Not enough core",
          49: "No message of desired type",
          50: "Protocol not available",
          51: "No space left on device",
          52: "Function not implemented",
          53: "Socket is not connected",
          54: "Not a directory",
          55: "Directory not empty",
          56: "State not recoverable",
          57: "Socket operation on non-socket",
          59: "Not a typewriter",
          60: "No such device or address",
          61: "Value too large for defined data type",
          62: "Previous owner died",
          63: "Not super-user",
          64: "Broken pipe",
          65: "Protocol error",
          66: "Unknown protocol",
          67: "Protocol wrong type for socket",
          68: "Math result not representable",
          69: "Read only file system",
          70: "Illegal seek",
          71: "No such process",
          72: "Stale file handle",
          73: "Connection timed out",
          74: "Text file busy",
          75: "Cross-device link",
          100: "Device not a stream",
          101: "Bad font file fmt",
          102: "Invalid slot",
          103: "Invalid request code",
          104: "No anode",
          105: "Block device required",
          106: "Channel number out of range",
          107: "Level 3 halted",
          108: "Level 3 reset",
          109: "Link number out of range",
          110: "Protocol driver not attached",
          111: "No CSI structure available",
          112: "Level 2 halted",
          113: "Invalid exchange",
          114: "Invalid request descriptor",
          115: "Exchange full",
          116: "No data (for no delay io)",
          117: "Timer expired",
          118: "Out of streams resources",
          119: "Machine is not on the network",
          120: "Package not installed",
          121: "The object is remote",
          122: "Advertise error",
          123: "Srmount error",
          124: "Communication error on send",
          125: "Cross mount point (not really error)",
          126: "Given log. name not unique",
          127: "f.d. invalid for this operation",
          128: "Remote address changed",
          129: "Can   access a needed shared lib",
          130: "Accessing a corrupted shared lib",
          131: ".lib section in a.out corrupted",
          132: "Attempting to link in too many libs",
          133: "Attempting to exec a shared library",
          135: "Streams pipe error",
          136: "Too many users",
          137: "Socket type not supported",
          138: "Not supported",
          139: "Protocol family not supported",
          140: "Can't send after socket shutdown",
          141: "Too many references",
          142: "Host is down",
          148: "No medium (in tape drive)",
          156: "Level 2 not synchronized"
        };
        var ERRNO_CODES = {
          "EPERM": 63,
          "ENOENT": 44,
          "ESRCH": 71,
          "EINTR": 27,
          "EIO": 29,
          "ENXIO": 60,
          "E2BIG": 1,
          "ENOEXEC": 45,
          "EBADF": 8,
          "ECHILD": 12,
          "EAGAIN": 6,
          "EWOULDBLOCK": 6,
          "ENOMEM": 48,
          "EACCES": 2,
          "EFAULT": 21,
          "ENOTBLK": 105,
          "EBUSY": 10,
          "EEXIST": 20,
          "EXDEV": 75,
          "ENODEV": 43,
          "ENOTDIR": 54,
          "EISDIR": 31,
          "EINVAL": 28,
          "ENFILE": 41,
          "EMFILE": 33,
          "ENOTTY": 59,
          "ETXTBSY": 74,
          "EFBIG": 22,
          "ENOSPC": 51,
          "ESPIPE": 70,
          "EROFS": 69,
          "EMLINK": 34,
          "EPIPE": 64,
          "EDOM": 18,
          "ERANGE": 68,
          "ENOMSG": 49,
          "EIDRM": 24,
          "ECHRNG": 106,
          "EL2NSYNC": 156,
          "EL3HLT": 107,
          "EL3RST": 108,
          "ELNRNG": 109,
          "EUNATCH": 110,
          "ENOCSI": 111,
          "EL2HLT": 112,
          "EDEADLK": 16,
          "ENOLCK": 46,
          "EBADE": 113,
          "EBADR": 114,
          "EXFULL": 115,
          "ENOANO": 104,
          "EBADRQC": 103,
          "EBADSLT": 102,
          "EDEADLOCK": 16,
          "EBFONT": 101,
          "ENOSTR": 100,
          "ENODATA": 116,
          "ETIME": 117,
          "ENOSR": 118,
          "ENONET": 119,
          "ENOPKG": 120,
          "EREMOTE": 121,
          "ENOLINK": 47,
          "EADV": 122,
          "ESRMNT": 123,
          "ECOMM": 124,
          "EPROTO": 65,
          "EMULTIHOP": 36,
          "EDOTDOT": 125,
          "EBADMSG": 9,
          "ENOTUNIQ": 126,
          "EBADFD": 127,
          "EREMCHG": 128,
          "ELIBACC": 129,
          "ELIBBAD": 130,
          "ELIBSCN": 131,
          "ELIBMAX": 132,
          "ELIBEXEC": 133,
          "ENOSYS": 52,
          "ENOTEMPTY": 55,
          "ENAMETOOLONG": 37,
          "ELOOP": 32,
          "EOPNOTSUPP": 138,
          "EPFNOSUPPORT": 139,
          "ECONNRESET": 15,
          "ENOBUFS": 42,
          "EAFNOSUPPORT": 5,
          "EPROTOTYPE": 67,
          "ENOTSOCK": 57,
          "ENOPROTOOPT": 50,
          "ESHUTDOWN": 140,
          "ECONNREFUSED": 14,
          "EADDRINUSE": 3,
          "ECONNABORTED": 13,
          "ENETUNREACH": 40,
          "ENETDOWN": 38,
          "ETIMEDOUT": 73,
          "EHOSTDOWN": 142,
          "EHOSTUNREACH": 23,
          "EINPROGRESS": 26,
          "EALREADY": 7,
          "EDESTADDRREQ": 17,
          "EMSGSIZE": 35,
          "EPROTONOSUPPORT": 66,
          "ESOCKTNOSUPPORT": 137,
          "EADDRNOTAVAIL": 4,
          "ENETRESET": 39,
          "EISCONN": 30,
          "ENOTCONN": 53,
          "ETOOMANYREFS": 141,
          "EUSERS": 136,
          "EDQUOT": 19,
          "ESTALE": 72,
          "ENOTSUP": 138,
          "ENOMEDIUM": 148,
          "EILSEQ": 25,
          "EOVERFLOW": 61,
          "ECANCELED": 11,
          "ENOTRECOVERABLE": 56,
          "EOWNERDEAD": 62,
          "ESTRPIPE": 135
        };
        var FS = {
          root: null,
          mounts: [],
          devices: {},
          streams: [],
          nextInode: 1,
          nameTable: null,
          currentPath: "/",
          initialized: false,
          ignorePermissions: true,
          ErrnoError: class extends Error {
            constructor(errno) {
              super(ERRNO_MESSAGES[errno]);
              this.name = "ErrnoError";
              this.errno = errno;
              for (var key in ERRNO_CODES) {
                if (ERRNO_CODES[key] === errno) {
                  this.code = key;
                  break;
                }
              }
            }
          },
          genericErrors: {},
          filesystems: null,
          syncFSRequests: 0,
          FSStream: class {
            constructor() {
              this.shared = {};
            }
            get object() {
              return this.node;
            }
            set object(val) {
              this.node = val;
            }
            get isRead() {
              return (this.flags & 2097155) !== 1;
            }
            get isWrite() {
              return (this.flags & 2097155) !== 0;
            }
            get isAppend() {
              return this.flags & 1024;
            }
            get flags() {
              return this.shared.flags;
            }
            set flags(val) {
              this.shared.flags = val;
            }
            get position() {
              return this.shared.position;
            }
            set position(val) {
              this.shared.position = val;
            }
          },
          FSNode: class {
            constructor(parent, name, mode, rdev) {
              if (!parent) {
                parent = this;
              }
              this.parent = parent;
              this.mount = parent.mount;
              this.mounted = null;
              this.id = FS.nextInode++;
              this.name = name;
              this.mode = mode;
              this.node_ops = {};
              this.stream_ops = {};
              this.rdev = rdev;
              this.readMode = 292 | /*292*/
              73;
              this.writeMode = 146;
            }
            /*146*/
            get read() {
              return (this.mode & this.readMode) === this.readMode;
            }
            set read(val) {
              val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
            }
            get write() {
              return (this.mode & this.writeMode) === this.writeMode;
            }
            set write(val) {
              val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
            }
            get isFolder() {
              return FS.isDir(this.mode);
            }
            get isDevice() {
              return FS.isChrdev(this.mode);
            }
          },
          lookupPath(path, opts = {}) {
            path = PATH_FS.resolve(path);
            if (!path)
              return {
                path: "",
                node: null
              };
            var defaults = {
              follow_mount: true,
              recurse_count: 0
            };
            opts = Object.assign(defaults, opts);
            if (opts.recurse_count > 8) {
              throw new FS.ErrnoError(32);
            }
            var parts = path.split("/").filter((p) => !!p);
            var current = FS.root;
            var current_path = "/";
            for (var i = 0; i < parts.length; i++) {
              var islast = i === parts.length - 1;
              if (islast && opts.parent) {
                break;
              }
              current = FS.lookupNode(current, parts[i]);
              current_path = PATH.join2(current_path, parts[i]);
              if (FS.isMountpoint(current)) {
                if (!islast || islast && opts.follow_mount) {
                  current = current.mounted.root;
                }
              }
              if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                  var link = FS.readlink(current_path);
                  current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                  var lookup = FS.lookupPath(current_path, {
                    recurse_count: opts.recurse_count + 1
                  });
                  current = lookup.node;
                  if (count++ > 40) {
                    throw new FS.ErrnoError(32);
                  }
                }
              }
            }
            return {
              path: current_path,
              node: current
            };
          },
          getPath(node) {
            var path;
            while (true) {
              if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path)
                  return mount;
                return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
              }
              path = path ? `${node.name}/${path}` : node.name;
              node = node.parent;
            }
          },
          hashName(parentid, name) {
            var hash = 0;
            for (var i = 0; i < name.length; i++) {
              hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
            }
            return (parentid + hash >>> 0) % FS.nameTable.length;
          },
          hashAddNode(node) {
            var hash = FS.hashName(node.parent.id, node.name);
            node.name_next = FS.nameTable[hash];
            FS.nameTable[hash] = node;
          },
          hashRemoveNode(node) {
            var hash = FS.hashName(node.parent.id, node.name);
            if (FS.nameTable[hash] === node) {
              FS.nameTable[hash] = node.name_next;
            } else {
              var current = FS.nameTable[hash];
              while (current) {
                if (current.name_next === node) {
                  current.name_next = node.name_next;
                  break;
                }
                current = current.name_next;
              }
            }
          },
          lookupNode(parent, name) {
            var errCode = FS.mayLookup(parent);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            var hash = FS.hashName(parent.id, name);
            for (var node = FS.nameTable[hash]; node; node = node.name_next) {
              var nodeName = node.name;
              if (node.parent.id === parent.id && nodeName === name) {
                return node;
              }
            }
            return FS.lookup(parent, name);
          },
          createNode(parent, name, mode, rdev) {
            assert(typeof parent == "object");
            var node = new FS.FSNode(parent, name, mode, rdev);
            FS.hashAddNode(node);
            return node;
          },
          destroyNode(node) {
            FS.hashRemoveNode(node);
          },
          isRoot(node) {
            return node === node.parent;
          },
          isMountpoint(node) {
            return !!node.mounted;
          },
          isFile(mode) {
            return (mode & 61440) === 32768;
          },
          isDir(mode) {
            return (mode & 61440) === 16384;
          },
          isLink(mode) {
            return (mode & 61440) === 40960;
          },
          isChrdev(mode) {
            return (mode & 61440) === 8192;
          },
          isBlkdev(mode) {
            return (mode & 61440) === 24576;
          },
          isFIFO(mode) {
            return (mode & 61440) === 4096;
          },
          isSocket(mode) {
            return (mode & 49152) === 49152;
          },
          flagsToPermissionString(flag) {
            var perms = ["r", "w", "rw"][flag & 3];
            if (flag & 512) {
              perms += "w";
            }
            return perms;
          },
          nodePermissions(node, perms) {
            if (FS.ignorePermissions) {
              return 0;
            }
            if (perms.includes("r") && !(node.mode & 292)) {
              return 2;
            } else if (perms.includes("w") && !(node.mode & 146)) {
              return 2;
            } else if (perms.includes("x") && !(node.mode & 73)) {
              return 2;
            }
            return 0;
          },
          mayLookup(dir) {
            if (!FS.isDir(dir.mode))
              return 54;
            var errCode = FS.nodePermissions(dir, "x");
            if (errCode)
              return errCode;
            if (!dir.node_ops.lookup)
              return 2;
            return 0;
          },
          mayCreate(dir, name) {
            try {
              var node = FS.lookupNode(dir, name);
              return 20;
            } catch (e) {
            }
            return FS.nodePermissions(dir, "wx");
          },
          mayDelete(dir, name, isdir) {
            var node;
            try {
              node = FS.lookupNode(dir, name);
            } catch (e) {
              return e.errno;
            }
            var errCode = FS.nodePermissions(dir, "wx");
            if (errCode) {
              return errCode;
            }
            if (isdir) {
              if (!FS.isDir(node.mode)) {
                return 54;
              }
              if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 10;
              }
            } else {
              if (FS.isDir(node.mode)) {
                return 31;
              }
            }
            return 0;
          },
          mayOpen(node, flags) {
            if (!node) {
              return 44;
            }
            if (FS.isLink(node.mode)) {
              return 32;
            } else if (FS.isDir(node.mode)) {
              if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                return 31;
              }
            }
            return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
          },
          MAX_OPEN_FDS: 4096,
          nextfd() {
            for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
              if (!FS.streams[fd]) {
                return fd;
              }
            }
            throw new FS.ErrnoError(33);
          },
          getStreamChecked(fd) {
            var stream = FS.getStream(fd);
            if (!stream) {
              throw new FS.ErrnoError(8);
            }
            return stream;
          },
          getStream: (fd) => FS.streams[fd],
          createStream(stream, fd = -1) {
            stream = Object.assign(new FS.FSStream(), stream);
            if (fd == -1) {
              fd = FS.nextfd();
            }
            stream.fd = fd;
            FS.streams[fd] = stream;
            return stream;
          },
          closeStream(fd) {
            FS.streams[fd] = null;
          },
          dupStream(origStream, fd = -1) {
            var stream = FS.createStream(origStream, fd);
            stream.stream_ops?.dup?.(stream);
            return stream;
          },
          chrdev_stream_ops: {
            open(stream) {
              var device = FS.getDevice(stream.node.rdev);
              stream.stream_ops = device.stream_ops;
              stream.stream_ops.open?.(stream);
            },
            llseek() {
              throw new FS.ErrnoError(70);
            }
          },
          major: (dev) => dev >> 8,
          minor: (dev) => dev & 255,
          makedev: (ma, mi) => ma << 8 | mi,
          registerDevice(dev, ops) {
            FS.devices[dev] = {
              stream_ops: ops
            };
          },
          getDevice: (dev) => FS.devices[dev],
          getMounts(mount) {
            var mounts = [];
            var check = [mount];
            while (check.length) {
              var m = check.pop();
              mounts.push(m);
              check.push(...m.mounts);
            }
            return mounts;
          },
          syncfs(populate, callback) {
            if (typeof populate == "function") {
              callback = populate;
              populate = false;
            }
            FS.syncFSRequests++;
            if (FS.syncFSRequests > 1) {
              err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
            }
            var mounts = FS.getMounts(FS.root.mount);
            var completed = 0;
            function doCallback(errCode) {
              assert(FS.syncFSRequests > 0);
              FS.syncFSRequests--;
              return callback(errCode);
            }
            function done(errCode) {
              if (errCode) {
                if (!done.errored) {
                  done.errored = true;
                  return doCallback(errCode);
                }
                return;
              }
              if (++completed >= mounts.length) {
                doCallback(null);
              }
            }
            mounts.forEach((mount) => {
              if (!mount.type.syncfs) {
                return done(null);
              }
              mount.type.syncfs(mount, populate, done);
            });
          },
          mount(type, opts, mountpoint) {
            if (typeof type == "string") {
              throw type;
            }
            var root = mountpoint === "/";
            var pseudo = !mountpoint;
            var node;
            if (root && FS.root) {
              throw new FS.ErrnoError(10);
            } else if (!root && !pseudo) {
              var lookup = FS.lookupPath(mountpoint, {
                follow_mount: false
              });
              mountpoint = lookup.path;
              node = lookup.node;
              if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
              }
              if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54);
              }
            }
            var mount = {
              type,
              opts,
              mountpoint,
              mounts: []
            };
            var mountRoot = type.mount(mount);
            mountRoot.mount = mount;
            mount.root = mountRoot;
            if (root) {
              FS.root = mountRoot;
            } else if (node) {
              node.mounted = mount;
              if (node.mount) {
                node.mount.mounts.push(mount);
              }
            }
            return mountRoot;
          },
          unmount(mountpoint) {
            var lookup = FS.lookupPath(mountpoint, {
              follow_mount: false
            });
            if (!FS.isMountpoint(lookup.node)) {
              throw new FS.ErrnoError(28);
            }
            var node = lookup.node;
            var mount = node.mounted;
            var mounts = FS.getMounts(mount);
            Object.keys(FS.nameTable).forEach((hash) => {
              var current = FS.nameTable[hash];
              while (current) {
                var next = current.name_next;
                if (mounts.includes(current.mount)) {
                  FS.destroyNode(current);
                }
                current = next;
              }
            });
            node.mounted = null;
            var idx = node.mount.mounts.indexOf(mount);
            assert(idx !== -1);
            node.mount.mounts.splice(idx, 1);
          },
          lookup(parent, name) {
            return parent.node_ops.lookup(parent, name);
          },
          mknod(path, mode, dev) {
            var lookup = FS.lookupPath(path, {
              parent: true
            });
            var parent = lookup.node;
            var name = PATH.basename(path);
            if (!name || name === "." || name === "..") {
              throw new FS.ErrnoError(28);
            }
            var errCode = FS.mayCreate(parent, name);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.mknod) {
              throw new FS.ErrnoError(63);
            }
            return parent.node_ops.mknod(parent, name, mode, dev);
          },
          create(path, mode) {
            mode = mode !== void 0 ? mode : 438;
            mode &= 4095;
            mode |= 32768;
            return FS.mknod(path, mode, 0);
          },
          mkdir(path, mode) {
            mode = mode !== void 0 ? mode : 511;
            mode &= 511 | 512;
            mode |= 16384;
            return FS.mknod(path, mode, 0);
          },
          mkdirTree(path, mode) {
            var dirs = path.split("/");
            var d = "";
            for (var i = 0; i < dirs.length; ++i) {
              if (!dirs[i])
                continue;
              d += "/" + dirs[i];
              try {
                FS.mkdir(d, mode);
              } catch (e) {
                if (e.errno != 20)
                  throw e;
              }
            }
          },
          mkdev(path, mode, dev) {
            if (typeof dev == "undefined") {
              dev = mode;
              mode = 438;
            }
            mode |= 8192;
            return FS.mknod(path, mode, dev);
          },
          symlink(oldpath, newpath) {
            if (!PATH_FS.resolve(oldpath)) {
              throw new FS.ErrnoError(44);
            }
            var lookup = FS.lookupPath(newpath, {
              parent: true
            });
            var parent = lookup.node;
            if (!parent) {
              throw new FS.ErrnoError(44);
            }
            var newname = PATH.basename(newpath);
            var errCode = FS.mayCreate(parent, newname);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.symlink) {
              throw new FS.ErrnoError(63);
            }
            return parent.node_ops.symlink(parent, newname, oldpath);
          },
          rename(old_path, new_path) {
            var old_dirname = PATH.dirname(old_path);
            var new_dirname = PATH.dirname(new_path);
            var old_name = PATH.basename(old_path);
            var new_name = PATH.basename(new_path);
            var lookup, old_dir, new_dir;
            lookup = FS.lookupPath(old_path, {
              parent: true
            });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, {
              parent: true
            });
            new_dir = lookup.node;
            if (!old_dir || !new_dir)
              throw new FS.ErrnoError(44);
            if (old_dir.mount !== new_dir.mount) {
              throw new FS.ErrnoError(75);
            }
            var old_node = FS.lookupNode(old_dir, old_name);
            var relative = PATH_FS.relative(old_path, new_dirname);
            if (relative.charAt(0) !== ".") {
              throw new FS.ErrnoError(28);
            }
            relative = PATH_FS.relative(new_path, old_dirname);
            if (relative.charAt(0) !== ".") {
              throw new FS.ErrnoError(55);
            }
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (old_node === new_node) {
              return;
            }
            var isdir = FS.isDir(old_node.mode);
            var errCode = FS.mayDelete(old_dir, old_name, isdir);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!old_dir.node_ops.rename) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
              throw new FS.ErrnoError(10);
            }
            if (new_dir !== old_dir) {
              errCode = FS.nodePermissions(old_dir, "w");
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
            }
            FS.hashRemoveNode(old_node);
            try {
              old_dir.node_ops.rename(old_node, new_dir, new_name);
            } catch (e) {
              throw e;
            } finally {
              FS.hashAddNode(old_node);
            }
          },
          rmdir(path) {
            var lookup = FS.lookupPath(path, {
              parent: true
            });
            var parent = lookup.node;
            var name = PATH.basename(path);
            var node = FS.lookupNode(parent, name);
            var errCode = FS.mayDelete(parent, name, true);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.rmdir) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            parent.node_ops.rmdir(parent, name);
            FS.destroyNode(node);
          },
          readdir(path) {
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            var node = lookup.node;
            if (!node.node_ops.readdir) {
              throw new FS.ErrnoError(54);
            }
            return node.node_ops.readdir(node);
          },
          unlink(path) {
            var lookup = FS.lookupPath(path, {
              parent: true
            });
            var parent = lookup.node;
            if (!parent) {
              throw new FS.ErrnoError(44);
            }
            var name = PATH.basename(path);
            var node = FS.lookupNode(parent, name);
            var errCode = FS.mayDelete(parent, name, false);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.unlink) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            parent.node_ops.unlink(parent, name);
            FS.destroyNode(node);
          },
          readlink(path) {
            var lookup = FS.lookupPath(path);
            var link = lookup.node;
            if (!link) {
              throw new FS.ErrnoError(44);
            }
            if (!link.node_ops.readlink) {
              throw new FS.ErrnoError(28);
            }
            return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
          },
          stat(path, dontFollow) {
            var lookup = FS.lookupPath(path, {
              follow: !dontFollow
            });
            var node = lookup.node;
            if (!node) {
              throw new FS.ErrnoError(44);
            }
            if (!node.node_ops.getattr) {
              throw new FS.ErrnoError(63);
            }
            return node.node_ops.getattr(node);
          },
          lstat(path) {
            return FS.stat(path, true);
          },
          chmod(path, mode, dontFollow) {
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, {
                follow: !dontFollow
              });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            node.node_ops.setattr(node, {
              mode: mode & 4095 | node.mode & ~4095,
              timestamp: Date.now()
            });
          },
          lchmod(path, mode) {
            FS.chmod(path, mode, true);
          },
          fchmod(fd, mode) {
            var stream = FS.getStreamChecked(fd);
            FS.chmod(stream.node, mode);
          },
          chown(path, uid, gid, dontFollow) {
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, {
                follow: !dontFollow
              });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            node.node_ops.setattr(node, {
              timestamp: Date.now()
            });
          },
          lchown(path, uid, gid) {
            FS.chown(path, uid, gid, true);
          },
          fchown(fd, uid, gid) {
            var stream = FS.getStreamChecked(fd);
            FS.chown(stream.node, uid, gid);
          },
          truncate(path, len) {
            if (len < 0) {
              throw new FS.ErrnoError(28);
            }
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, {
                follow: true
              });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isDir(node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!FS.isFile(node.mode)) {
              throw new FS.ErrnoError(28);
            }
            var errCode = FS.nodePermissions(node, "w");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            node.node_ops.setattr(node, {
              size: len,
              timestamp: Date.now()
            });
          },
          ftruncate(fd, len) {
            var stream = FS.getStreamChecked(fd);
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(28);
            }
            FS.truncate(stream.node, len);
          },
          utime(path, atime, mtime) {
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            var node = lookup.node;
            node.node_ops.setattr(node, {
              timestamp: Math.max(atime, mtime)
            });
          },
          open(path, flags, mode) {
            if (path === "") {
              throw new FS.ErrnoError(44);
            }
            flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
            mode = typeof mode == "undefined" ? 438 : (
              /* 0666 */
              mode
            );
            if (flags & 64) {
              mode = mode & 4095 | 32768;
            } else {
              mode = 0;
            }
            var node;
            if (typeof path == "object") {
              node = path;
            } else {
              path = PATH.normalize(path);
              try {
                var lookup = FS.lookupPath(path, {
                  follow: !(flags & 131072)
                });
                node = lookup.node;
              } catch (e) {
              }
            }
            var created = false;
            if (flags & 64) {
              if (node) {
                if (flags & 128) {
                  throw new FS.ErrnoError(20);
                }
              } else {
                node = FS.mknod(path, mode, 0);
                created = true;
              }
            }
            if (!node) {
              throw new FS.ErrnoError(44);
            }
            if (FS.isChrdev(node.mode)) {
              flags &= ~512;
            }
            if (flags & 65536 && !FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54);
            }
            if (!created) {
              var errCode = FS.mayOpen(node, flags);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
            }
            if (flags & 512 && !created) {
              FS.truncate(node, 0);
            }
            flags &= ~(128 | 512 | 131072);
            var stream = FS.createStream({
              node,
              path: FS.getPath(node),
              flags,
              seekable: true,
              position: 0,
              stream_ops: node.stream_ops,
              ungotten: [],
              error: false
            });
            if (stream.stream_ops.open) {
              stream.stream_ops.open(stream);
            }
            if (Module2["logReadFiles"] && !(flags & 1)) {
              if (!FS.readFiles)
                FS.readFiles = {};
              if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1;
              }
            }
            return stream;
          },
          close(stream) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (stream.getdents)
              stream.getdents = null;
            try {
              if (stream.stream_ops.close) {
                stream.stream_ops.close(stream);
              }
            } catch (e) {
              throw e;
            } finally {
              FS.closeStream(stream.fd);
            }
            stream.fd = null;
          },
          isClosed(stream) {
            return stream.fd === null;
          },
          llseek(stream, offset, whence) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (!stream.seekable || !stream.stream_ops.llseek) {
              throw new FS.ErrnoError(70);
            }
            if (whence != 0 && whence != 1 && whence != 2) {
              throw new FS.ErrnoError(28);
            }
            stream.position = stream.stream_ops.llseek(stream, offset, whence);
            stream.ungotten = [];
            return stream.position;
          },
          read(stream, buffer, offset, length, position) {
            assert(offset >= 0);
            if (length < 0 || position < 0) {
              throw new FS.ErrnoError(28);
            }
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 1) {
              throw new FS.ErrnoError(8);
            }
            if (FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!stream.stream_ops.read) {
              throw new FS.ErrnoError(28);
            }
            var seeking = typeof position != "undefined";
            if (!seeking) {
              position = stream.position;
            } else if (!stream.seekable) {
              throw new FS.ErrnoError(70);
            }
            var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
            if (!seeking)
              stream.position += bytesRead;
            return bytesRead;
          },
          write(stream, buffer, offset, length, position, canOwn) {
            assert(offset >= 0);
            if (length < 0 || position < 0) {
              throw new FS.ErrnoError(28);
            }
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(8);
            }
            if (FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!stream.stream_ops.write) {
              throw new FS.ErrnoError(28);
            }
            if (stream.seekable && stream.flags & 1024) {
              FS.llseek(stream, 0, 2);
            }
            var seeking = typeof position != "undefined";
            if (!seeking) {
              position = stream.position;
            } else if (!stream.seekable) {
              throw new FS.ErrnoError(70);
            }
            var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
            if (!seeking)
              stream.position += bytesWritten;
            return bytesWritten;
          },
          allocate(stream, offset, length) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (offset < 0 || length <= 0) {
              throw new FS.ErrnoError(28);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(8);
            }
            if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            if (!stream.stream_ops.allocate) {
              throw new FS.ErrnoError(138);
            }
            stream.stream_ops.allocate(stream, offset, length);
          },
          mmap(stream, length, position, prot, flags) {
            if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
              throw new FS.ErrnoError(2);
            }
            if ((stream.flags & 2097155) === 1) {
              throw new FS.ErrnoError(2);
            }
            if (!stream.stream_ops.mmap) {
              throw new FS.ErrnoError(43);
            }
            return stream.stream_ops.mmap(stream, length, position, prot, flags);
          },
          msync(stream, buffer, offset, length, mmapFlags) {
            assert(offset >= 0);
            if (!stream.stream_ops.msync) {
              return 0;
            }
            return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
          },
          ioctl(stream, cmd, arg) {
            if (!stream.stream_ops.ioctl) {
              throw new FS.ErrnoError(59);
            }
            return stream.stream_ops.ioctl(stream, cmd, arg);
          },
          readFile(path, opts = {}) {
            opts.flags = opts.flags || 0;
            opts.encoding = opts.encoding || "binary";
            if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
              throw new Error(`Invalid encoding type "${opts.encoding}"`);
            }
            var ret;
            var stream = FS.open(path, opts.flags);
            var stat = FS.stat(path);
            var length = stat.size;
            var buf = new Uint8Array(length);
            FS.read(stream, buf, 0, length, 0);
            if (opts.encoding === "utf8") {
              ret = UTF8ArrayToString(buf, 0);
            } else if (opts.encoding === "binary") {
              ret = buf;
            }
            FS.close(stream);
            return ret;
          },
          writeFile(path, data, opts = {}) {
            opts.flags = opts.flags || 577;
            var stream = FS.open(path, opts.flags, opts.mode);
            if (typeof data == "string") {
              var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
              var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
              FS.write(stream, buf, 0, actualNumBytes, void 0, opts.canOwn);
            } else if (ArrayBuffer.isView(data)) {
              FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
            } else {
              throw new Error("Unsupported data type");
            }
            FS.close(stream);
          },
          cwd: () => FS.currentPath,
          chdir(path) {
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            if (lookup.node === null) {
              throw new FS.ErrnoError(44);
            }
            if (!FS.isDir(lookup.node.mode)) {
              throw new FS.ErrnoError(54);
            }
            var errCode = FS.nodePermissions(lookup.node, "x");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            FS.currentPath = lookup.path;
          },
          createDefaultDirectories() {
            FS.mkdir("/tmp");
            FS.mkdir("/home");
            FS.mkdir("/home/web_user");
          },
          createDefaultDevices() {
            FS.mkdir("/dev");
            FS.registerDevice(FS.makedev(1, 3), {
              read: () => 0,
              write: (stream, buffer, offset, length, pos) => length
            });
            FS.mkdev("/dev/null", FS.makedev(1, 3));
            TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
            TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
            FS.mkdev("/dev/tty", FS.makedev(5, 0));
            FS.mkdev("/dev/tty1", FS.makedev(6, 0));
            var randomBuffer = new Uint8Array(1024), randomLeft = 0;
            var randomByte = () => {
              if (randomLeft === 0) {
                randomLeft = randomFill(randomBuffer).byteLength;
              }
              return randomBuffer[--randomLeft];
            };
            FS.createDevice("/dev", "random", randomByte);
            FS.createDevice("/dev", "urandom", randomByte);
            FS.mkdir("/dev/shm");
            FS.mkdir("/dev/shm/tmp");
          },
          createSpecialDirectories() {
            FS.mkdir("/proc");
            var proc_self = FS.mkdir("/proc/self");
            FS.mkdir("/proc/self/fd");
            FS.mount({
              mount() {
                var node = FS.createNode(
                  proc_self,
                  "fd",
                  16384 | 511,
                  /* 0777 */
                  73
                );
                node.node_ops = {
                  lookup(parent, name) {
                    var fd = +name;
                    var stream = FS.getStreamChecked(fd);
                    var ret = {
                      parent: null,
                      mount: {
                        mountpoint: "fake"
                      },
                      node_ops: {
                        readlink: () => stream.path
                      }
                    };
                    ret.parent = ret;
                    return ret;
                  }
                };
                return node;
              }
            }, {}, "/proc/self/fd");
          },
          createStandardStreams() {
            if (Module2["stdin"]) {
              FS.createDevice("/dev", "stdin", Module2["stdin"]);
            } else {
              FS.symlink("/dev/tty", "/dev/stdin");
            }
            if (Module2["stdout"]) {
              FS.createDevice("/dev", "stdout", null, Module2["stdout"]);
            } else {
              FS.symlink("/dev/tty", "/dev/stdout");
            }
            if (Module2["stderr"]) {
              FS.createDevice("/dev", "stderr", null, Module2["stderr"]);
            } else {
              FS.symlink("/dev/tty1", "/dev/stderr");
            }
            var stdin = FS.open("/dev/stdin", 0);
            var stdout = FS.open("/dev/stdout", 1);
            var stderr = FS.open("/dev/stderr", 1);
            assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
            assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
            assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
          },
          staticInit() {
            [44].forEach((code) => {
              FS.genericErrors[code] = new FS.ErrnoError(code);
              FS.genericErrors[code].stack = "<generic error, no stack>";
            });
            FS.nameTable = new Array(4096);
            FS.mount(MEMFS, {}, "/");
            FS.createDefaultDirectories();
            FS.createDefaultDevices();
            FS.createSpecialDirectories();
            FS.filesystems = {
              "MEMFS": MEMFS
            };
          },
          init(input, output, error) {
            assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
            FS.init.initialized = true;
            Module2["stdin"] = input || Module2["stdin"];
            Module2["stdout"] = output || Module2["stdout"];
            Module2["stderr"] = error || Module2["stderr"];
            FS.createStandardStreams();
          },
          quit() {
            FS.init.initialized = false;
            _fflush(0);
            for (var i = 0; i < FS.streams.length; i++) {
              var stream = FS.streams[i];
              if (!stream) {
                continue;
              }
              FS.close(stream);
            }
          },
          findObject(path, dontResolveLastLink) {
            var ret = FS.analyzePath(path, dontResolveLastLink);
            if (!ret.exists) {
              return null;
            }
            return ret.object;
          },
          analyzePath(path, dontResolveLastLink) {
            try {
              var lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
              });
              path = lookup.path;
            } catch (e) {
            }
            var ret = {
              isRoot: false,
              exists: false,
              error: 0,
              name: null,
              path: null,
              object: null,
              parentExists: false,
              parentPath: null,
              parentObject: null
            };
            try {
              var lookup = FS.lookupPath(path, {
                parent: true
              });
              ret.parentExists = true;
              ret.parentPath = lookup.path;
              ret.parentObject = lookup.node;
              ret.name = PATH.basename(path);
              lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
              });
              ret.exists = true;
              ret.path = lookup.path;
              ret.object = lookup.node;
              ret.name = lookup.node.name;
              ret.isRoot = lookup.path === "/";
            } catch (e) {
              ret.error = e.errno;
            }
            return ret;
          },
          createPath(parent, path, canRead, canWrite) {
            parent = typeof parent == "string" ? parent : FS.getPath(parent);
            var parts = path.split("/").reverse();
            while (parts.length) {
              var part = parts.pop();
              if (!part)
                continue;
              var current = PATH.join2(parent, part);
              try {
                FS.mkdir(current);
              } catch (e) {
              }
              parent = current;
            }
            return current;
          },
          createFile(parent, name, properties, canRead, canWrite) {
            var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
            var mode = FS_getMode(canRead, canWrite);
            return FS.create(path, mode);
          },
          createDataFile(parent, name, data, canRead, canWrite, canOwn) {
            var path = name;
            if (parent) {
              parent = typeof parent == "string" ? parent : FS.getPath(parent);
              path = name ? PATH.join2(parent, name) : parent;
            }
            var mode = FS_getMode(canRead, canWrite);
            var node = FS.create(path, mode);
            if (data) {
              if (typeof data == "string") {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i)
                  arr[i] = data.charCodeAt(i);
                data = arr;
              }
              FS.chmod(node, mode | 146);
              var stream = FS.open(node, 577);
              FS.write(stream, data, 0, data.length, 0, canOwn);
              FS.close(stream);
              FS.chmod(node, mode);
            }
          },
          createDevice(parent, name, input, output) {
            var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
            var mode = FS_getMode(!!input, !!output);
            if (!FS.createDevice.major)
              FS.createDevice.major = 64;
            var dev = FS.makedev(FS.createDevice.major++, 0);
            FS.registerDevice(dev, {
              open(stream) {
                stream.seekable = false;
              },
              close(stream) {
                if (output?.buffer?.length) {
                  output(10);
                }
              },
              read(stream, buffer, offset, length, pos) {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                  var result;
                  try {
                    result = input();
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                  if (result === void 0 && bytesRead === 0) {
                    throw new FS.ErrnoError(6);
                  }
                  if (result === null || result === void 0)
                    break;
                  bytesRead++;
                  buffer[offset + i] = result;
                }
                if (bytesRead) {
                  stream.node.timestamp = Date.now();
                }
                return bytesRead;
              },
              write(stream, buffer, offset, length, pos) {
                for (var i = 0; i < length; i++) {
                  try {
                    output(buffer[offset + i]);
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                }
                if (length) {
                  stream.node.timestamp = Date.now();
                }
                return i;
              }
            });
            return FS.mkdev(path, mode, dev);
          },
          forceLoadFile(obj) {
            if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
              return true;
            if (typeof XMLHttpRequest != "undefined") {
              throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
            } else if (read_) {
              try {
                obj.contents = intArrayFromString(read_(obj.url), true);
                obj.usedBytes = obj.contents.length;
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            } else {
              throw new Error("Cannot load without read() or XMLHttpRequest.");
            }
          },
          createLazyFile(parent, name, url, canRead, canWrite) {
            class LazyUint8Array {
              constructor() {
                this.lengthKnown = false;
                this.chunks = [];
              }
              get(idx) {
                if (idx > this.length - 1 || idx < 0) {
                  return void 0;
                }
                var chunkOffset = idx % this.chunkSize;
                var chunkNum = idx / this.chunkSize | 0;
                return this.getter(chunkNum)[chunkOffset];
              }
              setDataGetter(getter) {
                this.getter = getter;
              }
              cacheLength() {
                var xhr = new XMLHttpRequest();
                xhr.open("HEAD", url, false);
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                  throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                var datalength = Number(xhr.getResponseHeader("Content-length"));
                var header;
                var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
                var chunkSize = 1024 * 1024;
                if (!hasByteServing)
                  chunkSize = datalength;
                var doXHR = (from, to) => {
                  if (from > to)
                    throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                  if (to > datalength - 1)
                    throw new Error("only " + datalength + " bytes available! programmer error!");
                  var xhr2 = new XMLHttpRequest();
                  xhr2.open("GET", url, false);
                  if (datalength !== chunkSize)
                    xhr2.setRequestHeader("Range", "bytes=" + from + "-" + to);
                  xhr2.responseType = "arraybuffer";
                  if (xhr2.overrideMimeType) {
                    xhr2.overrideMimeType("text/plain; charset=x-user-defined");
                  }
                  xhr2.send(null);
                  if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304))
                    throw new Error("Couldn't load " + url + ". Status: " + xhr2.status);
                  if (xhr2.response !== void 0) {
                    return new Uint8Array(
                      /** @type{Array<number>} */
                      xhr2.response || []
                    );
                  }
                  return intArrayFromString(xhr2.responseText || "", true);
                };
                var lazyArray2 = this;
                lazyArray2.setDataGetter((chunkNum) => {
                  var start = chunkNum * chunkSize;
                  var end = (chunkNum + 1) * chunkSize - 1;
                  end = Math.min(end, datalength - 1);
                  if (typeof lazyArray2.chunks[chunkNum] == "undefined") {
                    lazyArray2.chunks[chunkNum] = doXHR(start, end);
                  }
                  if (typeof lazyArray2.chunks[chunkNum] == "undefined")
                    throw new Error("doXHR failed!");
                  return lazyArray2.chunks[chunkNum];
                });
                if (usesGzip || !datalength) {
                  chunkSize = datalength = 1;
                  datalength = this.getter(0).length;
                  chunkSize = datalength;
                  out("LazyFiles on gzip forces download of the whole file when length is accessed");
                }
                this._length = datalength;
                this._chunkSize = chunkSize;
                this.lengthKnown = true;
              }
              get length() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
              get chunkSize() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
            if (typeof XMLHttpRequest != "undefined") {
              if (!ENVIRONMENT_IS_WORKER)
                throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
              var lazyArray = new LazyUint8Array();
              var properties = {
                isDevice: false,
                contents: lazyArray
              };
            } else {
              var properties = {
                isDevice: false,
                url
              };
            }
            var node = FS.createFile(parent, name, properties, canRead, canWrite);
            if (properties.contents) {
              node.contents = properties.contents;
            } else if (properties.url) {
              node.contents = null;
              node.url = properties.url;
            }
            Object.defineProperties(node, {
              usedBytes: {
                get: function() {
                  return this.contents.length;
                }
              }
            });
            var stream_ops = {};
            var keys = Object.keys(node.stream_ops);
            keys.forEach((key) => {
              var fn = node.stream_ops[key];
              stream_ops[key] = (...args) => {
                FS.forceLoadFile(node);
                return fn(...args);
              };
            });
            function writeChunks(stream, buffer, offset, length, position) {
              var contents = stream.node.contents;
              if (position >= contents.length)
                return 0;
              var size = Math.min(contents.length - position, length);
              assert(size >= 0);
              if (contents.slice) {
                for (var i = 0; i < size; i++) {
                  buffer[offset + i] = contents[position + i];
                }
              } else {
                for (var i = 0; i < size; i++) {
                  buffer[offset + i] = contents.get(position + i);
                }
              }
              return size;
            }
            stream_ops.read = (stream, buffer, offset, length, position) => {
              FS.forceLoadFile(node);
              return writeChunks(stream, buffer, offset, length, position);
            };
            stream_ops.mmap = (stream, length, position, prot, flags) => {
              FS.forceLoadFile(node);
              var ptr = mmapAlloc(length);
              if (!ptr) {
                throw new FS.ErrnoError(48);
              }
              writeChunks(stream, HEAP8, ptr, length, position);
              return {
                ptr,
                allocated: true
              };
            };
            node.stream_ops = stream_ops;
            return node;
          },
          absolutePath() {
            abort("FS.absolutePath has been removed; use PATH_FS.resolve instead");
          },
          createFolder() {
            abort("FS.createFolder has been removed; use FS.mkdir instead");
          },
          createLink() {
            abort("FS.createLink has been removed; use FS.symlink instead");
          },
          joinPath() {
            abort("FS.joinPath has been removed; use PATH.join instead");
          },
          mmapAlloc() {
            abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
          },
          standardizePath() {
            abort("FS.standardizePath has been removed; use PATH.normalize instead");
          }
        };
        var UTF8ToString = (ptr, maxBytesToRead) => {
          assert(typeof ptr == "number", `UTF8ToString expects a number (got ${typeof ptr})`);
          ptr >>>= 0;
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        };
        var SYSCALLS = {
          DEFAULT_POLLMASK: 5,
          calculateAt(dirfd, path, allowEmpty) {
            if (PATH.isAbs(path)) {
              return path;
            }
            var dir;
            if (dirfd === -100) {
              dir = FS.cwd();
            } else {
              var dirstream = SYSCALLS.getStreamFromFD(dirfd);
              dir = dirstream.path;
            }
            if (path.length == 0) {
              if (!allowEmpty) {
                throw new FS.ErrnoError(44);
              }
              return dir;
            }
            return PATH.join2(dir, path);
          },
          doStat(func, path, buf) {
            var stat = func(path);
            HEAP32[buf >>> 2 >>> 0] = stat.dev;
            HEAP32[buf + 4 >>> 2 >>> 0] = stat.mode;
            HEAPU32[buf + 8 >>> 2 >>> 0] = stat.nlink;
            HEAP32[buf + 12 >>> 2 >>> 0] = stat.uid;
            HEAP32[buf + 16 >>> 2 >>> 0] = stat.gid;
            HEAP32[buf + 20 >>> 2 >>> 0] = stat.rdev;
            tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 24 >>> 2 >>> 0] = tempI64[0], HEAP32[buf + 28 >>> 2 >>> 0] = tempI64[1];
            HEAP32[buf + 32 >>> 2 >>> 0] = 4096;
            HEAP32[buf + 36 >>> 2 >>> 0] = stat.blocks;
            var atime = stat.atime.getTime();
            var mtime = stat.mtime.getTime();
            var ctime = stat.ctime.getTime();
            tempI64 = [Math.floor(atime / 1e3) >>> 0, (tempDouble = Math.floor(atime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >>> 2 >>> 0] = tempI64[0], HEAP32[buf + 44 >>> 2 >>> 0] = tempI64[1];
            HEAPU32[buf + 48 >>> 2 >>> 0] = atime % 1e3 * 1e3;
            tempI64 = [Math.floor(mtime / 1e3) >>> 0, (tempDouble = Math.floor(mtime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 56 >>> 2 >>> 0] = tempI64[0], HEAP32[buf + 60 >>> 2 >>> 0] = tempI64[1];
            HEAPU32[buf + 64 >>> 2 >>> 0] = mtime % 1e3 * 1e3;
            tempI64 = [Math.floor(ctime / 1e3) >>> 0, (tempDouble = Math.floor(ctime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 72 >>> 2 >>> 0] = tempI64[0], HEAP32[buf + 76 >>> 2 >>> 0] = tempI64[1];
            HEAPU32[buf + 80 >>> 2 >>> 0] = ctime % 1e3 * 1e3;
            tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 88 >>> 2 >>> 0] = tempI64[0], HEAP32[buf + 92 >>> 2 >>> 0] = tempI64[1];
            return 0;
          },
          doMsync(addr, stream, len, flags, offset) {
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            if (flags & 2) {
              return 0;
            }
            var buffer = HEAPU8.slice(addr, addr + len);
            FS.msync(stream, buffer, offset, len, flags);
          },
          varargs: void 0,
          get() {
            assert(SYSCALLS.varargs != void 0);
            var ret = HEAP32[+SYSCALLS.varargs >>> 2 >>> 0];
            SYSCALLS.varargs += 4;
            return ret;
          },
          getp() {
            return SYSCALLS.get();
          },
          getStr(ptr) {
            var ret = UTF8ToString(ptr);
            return ret;
          },
          getStreamFromFD(fd) {
            var stream = FS.getStreamChecked(fd);
            return stream;
          }
        };
        var convertI32PairToI53Checked = (lo, hi) => {
          assert(lo == lo >>> 0 || lo == (lo | 0));
          assert(hi === (hi | 0));
          return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
        };
        function ___syscall_chmod(path, mode) {
          path >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            FS.chmod(path, mode);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_dup3(fd, newfd, flags) {
          try {
            var old = SYSCALLS.getStreamFromFD(fd);
            assert(!flags);
            if (old.fd === newfd)
              return -28;
            var existing = FS.getStream(newfd);
            if (existing)
              FS.close(existing);
            return FS.dupStream(old, newfd).fd;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_faccessat(dirfd, path, amode, flags) {
          path >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            assert(flags === 0);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (amode & ~7) {
              return -28;
            }
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            var node = lookup.node;
            if (!node) {
              return -44;
            }
            var perms = "";
            if (amode & 4)
              perms += "r";
            if (amode & 2)
              perms += "w";
            if (amode & 1)
              perms += "x";
            if (perms && /* otherwise, they've just passed F_OK */
            FS.nodePermissions(node, perms)) {
              return -2;
            }
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fchmod(fd, mode) {
          try {
            FS.fchmod(fd, mode);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fchown32(fd, owner, group) {
          try {
            FS.fchown(fd, owner, group);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fcntl64(fd, cmd, varargs) {
          varargs >>>= 0;
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (cmd) {
              case 0: {
                var arg = SYSCALLS.get();
                if (arg < 0) {
                  return -28;
                }
                while (FS.streams[arg]) {
                  arg++;
                }
                var newStream;
                newStream = FS.dupStream(stream, arg);
                return newStream.fd;
              }
              case 1:
              case 2:
                return 0;
              case 3:
                return stream.flags;
              case 4: {
                var arg = SYSCALLS.get();
                stream.flags |= arg;
                return 0;
              }
              case 12: {
                var arg = SYSCALLS.getp();
                var offset = 0;
                HEAP16[arg + offset >>> 1 >>> 0] = 2;
                return 0;
              }
              case 13:
              case 14:
                return 0;
            }
            return -28;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fstat64(fd, buf) {
          buf >>>= 0;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            return SYSCALLS.doStat(FS.stat, stream.path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_ftruncate64(fd, length_low, length_high) {
          var length = convertI32PairToI53Checked(length_low, length_high);
          try {
            if (isNaN(length))
              return 61;
            FS.ftruncate(fd, length);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
          assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        };
        function ___syscall_getcwd(buf, size) {
          buf >>>= 0;
          size >>>= 0;
          try {
            if (size === 0)
              return -28;
            var cwd = FS.cwd();
            var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
            if (size < cwdLengthInBytes)
              return -68;
            stringToUTF8(cwd, buf, size);
            return cwdLengthInBytes;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_ioctl(fd, op, varargs) {
          varargs >>>= 0;
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (op) {
              case 21509: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              case 21505: {
                if (!stream.tty)
                  return -59;
                if (stream.tty.ops.ioctl_tcgets) {
                  var termios = stream.tty.ops.ioctl_tcgets(stream);
                  var argp = SYSCALLS.getp();
                  HEAP32[argp >>> 2 >>> 0] = termios.c_iflag || 0;
                  HEAP32[argp + 4 >>> 2 >>> 0] = termios.c_oflag || 0;
                  HEAP32[argp + 8 >>> 2 >>> 0] = termios.c_cflag || 0;
                  HEAP32[argp + 12 >>> 2 >>> 0] = termios.c_lflag || 0;
                  for (var i = 0; i < 32; i++) {
                    HEAP8[argp + i + 17 >>> 0] = termios.c_cc[i] || 0;
                  }
                  return 0;
                }
                return 0;
              }
              case 21510:
              case 21511:
              case 21512: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              case 21506:
              case 21507:
              case 21508: {
                if (!stream.tty)
                  return -59;
                if (stream.tty.ops.ioctl_tcsets) {
                  var argp = SYSCALLS.getp();
                  var c_iflag = HEAP32[argp >>> 2 >>> 0];
                  var c_oflag = HEAP32[argp + 4 >>> 2 >>> 0];
                  var c_cflag = HEAP32[argp + 8 >>> 2 >>> 0];
                  var c_lflag = HEAP32[argp + 12 >>> 2 >>> 0];
                  var c_cc = [];
                  for (var i = 0; i < 32; i++) {
                    c_cc.push(HEAP8[argp + i + 17 >>> 0]);
                  }
                  return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
                    c_iflag,
                    c_oflag,
                    c_cflag,
                    c_lflag,
                    c_cc
                  });
                }
                return 0;
              }
              case 21519: {
                if (!stream.tty)
                  return -59;
                var argp = SYSCALLS.getp();
                HEAP32[argp >>> 2 >>> 0] = 0;
                return 0;
              }
              case 21520: {
                if (!stream.tty)
                  return -59;
                return -28;
              }
              case 21531: {
                var argp = SYSCALLS.getp();
                return FS.ioctl(stream, op, argp);
              }
              case 21523: {
                if (!stream.tty)
                  return -59;
                if (stream.tty.ops.ioctl_tiocgwinsz) {
                  var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
                  var argp = SYSCALLS.getp();
                  HEAP16[argp >>> 1 >>> 0] = winsize[0];
                  HEAP16[argp + 2 >>> 1 >>> 0] = winsize[1];
                }
                return 0;
              }
              case 21524: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              case 21515: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              default:
                return -28;
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_lstat64(path, buf) {
          path >>>= 0;
          buf >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.lstat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_mkdirat(dirfd, path, mode) {
          path >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            path = PATH.normalize(path);
            if (path[path.length - 1] === "/")
              path = path.substr(0, path.length - 1);
            FS.mkdir(path, mode, 0);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_newfstatat(dirfd, path, buf, flags) {
          path >>>= 0;
          buf >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            var nofollow = flags & 256;
            var allowEmpty = flags & 4096;
            flags = flags & ~6400;
            assert(!flags, `unknown flags in __syscall_newfstatat: ${flags}`);
            path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
            return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_openat(dirfd, path, flags, varargs) {
          path >>>= 0;
          varargs >>>= 0;
          SYSCALLS.varargs = varargs;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            var mode = varargs ? SYSCALLS.get() : 0;
            return FS.open(path, flags, mode).fd;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
          path >>>= 0;
          buf >>>= 0;
          bufsize >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (bufsize <= 0)
              return -28;
            var ret = FS.readlink(path);
            var len = Math.min(bufsize, lengthBytesUTF8(ret));
            var endChar = HEAP8[buf + len >>> 0];
            stringToUTF8(ret, buf, bufsize + 1);
            HEAP8[buf + len >>> 0] = endChar;
            return len;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
          oldpath >>>= 0;
          newpath >>>= 0;
          try {
            oldpath = SYSCALLS.getStr(oldpath);
            newpath = SYSCALLS.getStr(newpath);
            oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
            newpath = SYSCALLS.calculateAt(newdirfd, newpath);
            FS.rename(oldpath, newpath);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_rmdir(path) {
          path >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            FS.rmdir(path);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_stat64(path, buf) {
          path >>>= 0;
          buf >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.stat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_unlinkat(dirfd, path, flags) {
          path >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (flags === 0) {
              FS.unlink(path);
            } else if (flags === 512) {
              FS.rmdir(path);
            } else {
              abort("Invalid flags passed to unlinkat");
            }
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var readI53FromI64 = (ptr) => HEAPU32[ptr >>> 2 >>> 0] + HEAP32[ptr + 4 >>> 2 >>> 0] * 4294967296;
        function ___syscall_utimensat(dirfd, path, times, flags) {
          path >>>= 0;
          times >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            assert(flags === 0);
            path = SYSCALLS.calculateAt(dirfd, path, true);
            if (!times) {
              var atime = Date.now();
              var mtime = atime;
            } else {
              var seconds = readI53FromI64(times);
              var nanoseconds = HEAP32[times + 8 >>> 2 >>> 0];
              atime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
              times += 16;
              seconds = readI53FromI64(times);
              nanoseconds = HEAP32[times + 8 >>> 2 >>> 0];
              mtime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
            }
            FS.utime(path, atime, mtime);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var nowIsMonotonic = 1;
        var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;
        function __emscripten_system(command) {
          command >>>= 0;
          if (false) {
            if (!command)
              return 1;
            var cmdstr = UTF8ToString(command);
            if (!cmdstr.length)
              return 0;
            var cp = null;
            var ret = cp.spawnSync(cmdstr, [], {
              shell: true,
              stdio: "inherit"
            });
            var _W_EXITCODE = (ret2, sig) => ret2 << 8 | sig;
            if (ret.status === null) {
              var signalToNumber = (sig) => {
                switch (sig) {
                  case "SIGHUP":
                    return 1;
                  case "SIGINT":
                    return 2;
                  case "SIGQUIT":
                    return 3;
                  case "SIGFPE":
                    return 8;
                  case "SIGKILL":
                    return 9;
                  case "SIGALRM":
                    return 14;
                  case "SIGTERM":
                    return 15;
                }
                return 2;
              };
              return _W_EXITCODE(0, signalToNumber(ret.signal));
            }
            return _W_EXITCODE(ret.status, 0);
          }
          if (!command)
            return 0;
          return -52;
        }
        var __emscripten_throw_longjmp = () => {
          throw Infinity;
        };
        function __gmtime_js(time_low, time_high, tmPtr) {
          var time = convertI32PairToI53Checked(time_low, time_high);
          tmPtr >>>= 0;
          var date = new Date(time * 1e3);
          HEAP32[tmPtr >>> 2 >>> 0] = date.getUTCSeconds();
          HEAP32[tmPtr + 4 >>> 2 >>> 0] = date.getUTCMinutes();
          HEAP32[tmPtr + 8 >>> 2 >>> 0] = date.getUTCHours();
          HEAP32[tmPtr + 12 >>> 2 >>> 0] = date.getUTCDate();
          HEAP32[tmPtr + 16 >>> 2 >>> 0] = date.getUTCMonth();
          HEAP32[tmPtr + 20 >>> 2 >>> 0] = date.getUTCFullYear() - 1900;
          HEAP32[tmPtr + 24 >>> 2 >>> 0] = date.getUTCDay();
          var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
          var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
          HEAP32[tmPtr + 28 >>> 2 >>> 0] = yday;
        }
        var isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
        var MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var ydayFromDate = (date) => {
          var leap = isLeapYear(date.getFullYear());
          var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
          var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
          return yday;
        };
        function __localtime_js(time_low, time_high, tmPtr) {
          var time = convertI32PairToI53Checked(time_low, time_high);
          tmPtr >>>= 0;
          var date = new Date(time * 1e3);
          HEAP32[tmPtr >>> 2 >>> 0] = date.getSeconds();
          HEAP32[tmPtr + 4 >>> 2 >>> 0] = date.getMinutes();
          HEAP32[tmPtr + 8 >>> 2 >>> 0] = date.getHours();
          HEAP32[tmPtr + 12 >>> 2 >>> 0] = date.getDate();
          HEAP32[tmPtr + 16 >>> 2 >>> 0] = date.getMonth();
          HEAP32[tmPtr + 20 >>> 2 >>> 0] = date.getFullYear() - 1900;
          HEAP32[tmPtr + 24 >>> 2 >>> 0] = date.getDay();
          var yday = ydayFromDate(date) | 0;
          HEAP32[tmPtr + 28 >>> 2 >>> 0] = yday;
          HEAP32[tmPtr + 36 >>> 2 >>> 0] = -(date.getTimezoneOffset() * 60);
          var start = new Date(date.getFullYear(), 0, 1);
          var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
          var winterOffset = start.getTimezoneOffset();
          var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
          HEAP32[tmPtr + 32 >>> 2 >>> 0] = dst;
        }
        var __mktime_js = function(tmPtr) {
          tmPtr >>>= 0;
          var ret = (() => {
            var date = new Date(HEAP32[tmPtr + 20 >>> 2 >>> 0] + 1900, HEAP32[tmPtr + 16 >>> 2 >>> 0], HEAP32[tmPtr + 12 >>> 2 >>> 0], HEAP32[tmPtr + 8 >>> 2 >>> 0], HEAP32[tmPtr + 4 >>> 2 >>> 0], HEAP32[tmPtr >>> 2 >>> 0], 0);
            var dst = HEAP32[tmPtr + 32 >>> 2 >>> 0];
            var guessedOffset = date.getTimezoneOffset();
            var start = new Date(date.getFullYear(), 0, 1);
            var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
            var winterOffset = start.getTimezoneOffset();
            var dstOffset = Math.min(winterOffset, summerOffset);
            if (dst < 0) {
              HEAP32[tmPtr + 32 >>> 2 >>> 0] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
            } else if (dst > 0 != (dstOffset == guessedOffset)) {
              var nonDstOffset = Math.max(winterOffset, summerOffset);
              var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
              date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
            }
            HEAP32[tmPtr + 24 >>> 2 >>> 0] = date.getDay();
            var yday = ydayFromDate(date) | 0;
            HEAP32[tmPtr + 28 >>> 2 >>> 0] = yday;
            HEAP32[tmPtr >>> 2 >>> 0] = date.getSeconds();
            HEAP32[tmPtr + 4 >>> 2 >>> 0] = date.getMinutes();
            HEAP32[tmPtr + 8 >>> 2 >>> 0] = date.getHours();
            HEAP32[tmPtr + 12 >>> 2 >>> 0] = date.getDate();
            HEAP32[tmPtr + 16 >>> 2 >>> 0] = date.getMonth();
            HEAP32[tmPtr + 20 >>> 2 >>> 0] = date.getYear();
            var timeMs = date.getTime();
            if (isNaN(timeMs)) {
              return -1;
            }
            return timeMs / 1e3;
          })();
          return setTempRet0((tempDouble = ret, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)), ret >>> 0;
        };
        function __mmap_js(len, prot, flags, fd, offset_low, offset_high, allocated, addr) {
          len >>>= 0;
          var offset = convertI32PairToI53Checked(offset_low, offset_high);
          allocated >>>= 0;
          addr >>>= 0;
          try {
            if (isNaN(offset))
              return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            var res = FS.mmap(stream, len, offset, prot, flags);
            var ptr = res.ptr;
            HEAP32[allocated >>> 2 >>> 0] = res.allocated;
            HEAPU32[addr >>> 2 >>> 0] = ptr;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function __munmap_js(addr, len, prot, flags, fd, offset_low, offset_high) {
          addr >>>= 0;
          len >>>= 0;
          var offset = convertI32PairToI53Checked(offset_low, offset_high);
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            if (prot & 2) {
              SYSCALLS.doMsync(addr, stream, len, flags, offset);
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function __tzset_js(timezone, daylight, std_name, dst_name) {
          timezone >>>= 0;
          daylight >>>= 0;
          std_name >>>= 0;
          dst_name >>>= 0;
          var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
          var winter = new Date(currentYear, 0, 1);
          var summer = new Date(currentYear, 6, 1);
          var winterOffset = winter.getTimezoneOffset();
          var summerOffset = summer.getTimezoneOffset();
          var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
          HEAPU32[timezone >>> 2 >>> 0] = stdTimezoneOffset * 60;
          HEAP32[daylight >>> 2 >>> 0] = Number(winterOffset != summerOffset);
          function extractZone(date) {
            var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
            return match ? match[1] : "GMT";
          }
          var winterName = extractZone(winter);
          var summerName = extractZone(summer);
          if (summerOffset < winterOffset) {
            stringToUTF8(winterName, std_name, 7);
            stringToUTF8(summerName, dst_name, 7);
          } else {
            stringToUTF8(winterName, dst_name, 7);
            stringToUTF8(summerName, std_name, 7);
          }
        }
        var _abort = () => {
          abort("native code called abort()");
        };
        var _emscripten_date_now = () => Date.now();
        var getHeapMax = () => 4294901760;
        function _emscripten_get_heap_max() {
          return getHeapMax();
        }
        var _emscripten_get_now;
        _emscripten_get_now = () => deterministicNow();
        function _emscripten_memcpy_js(dest, src, num) {
          dest >>>= 0;
          src >>>= 0;
          num >>>= 0;
          return HEAPU8.copyWithin(dest >>> 0, src >>> 0, src + num >>> 0);
        }
        var growMemory = (size) => {
          var b = wasmMemory.buffer;
          var pages = (size - b.byteLength + 65535) / 65536;
          try {
            wasmMemory.grow(pages);
            updateMemoryViews();
            return 1;
          } catch (e) {
            err(`growMemory: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`);
          }
        };
        function _emscripten_resize_heap(requestedSize) {
          requestedSize >>>= 0;
          var oldSize = HEAPU8.length;
          assert(requestedSize > oldSize);
          var maxHeapSize = getHeapMax();
          if (requestedSize > maxHeapSize) {
            err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
            return false;
          }
          var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
          for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
            var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
            var replacement = growMemory(newSize);
            if (replacement) {
              return true;
            }
          }
          err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
          return false;
        }
        var ENV = {};
        var getExecutableName = () => thisProgram || "./this.program";
        var getEnvStrings = () => {
          if (!getEnvStrings.strings) {
            var lang = "C.UTF-8";
            var env = {
              "USER": "web_user",
              "LOGNAME": "web_user",
              "PATH": "/",
              "PWD": "/",
              "HOME": "/home/web_user",
              "LANG": lang,
              "_": getExecutableName()
            };
            for (var x in ENV) {
              if (ENV[x] === void 0)
                delete env[x];
              else
                env[x] = ENV[x];
            }
            var strings = [];
            for (var x in env) {
              strings.push(`${x}=${env[x]}`);
            }
            getEnvStrings.strings = strings;
          }
          return getEnvStrings.strings;
        };
        var stringToAscii = (str, buffer) => {
          for (var i = 0; i < str.length; ++i) {
            assert(str.charCodeAt(i) === (str.charCodeAt(i) & 255));
            HEAP8[buffer++ >>> 0] = str.charCodeAt(i);
          }
          HEAP8[buffer >>> 0] = 0;
        };
        var _environ_get = function(__environ, environ_buf) {
          __environ >>>= 0;
          environ_buf >>>= 0;
          var bufSize = 0;
          getEnvStrings().forEach((string, i) => {
            var ptr = environ_buf + bufSize;
            HEAPU32[__environ + i * 4 >>> 2 >>> 0] = ptr;
            stringToAscii(string, ptr);
            bufSize += string.length + 1;
          });
          return 0;
        };
        var _environ_sizes_get = function(penviron_count, penviron_buf_size) {
          penviron_count >>>= 0;
          penviron_buf_size >>>= 0;
          var strings = getEnvStrings();
          HEAPU32[penviron_count >>> 2 >>> 0] = strings.length;
          var bufSize = 0;
          strings.forEach((string) => bufSize += string.length + 1);
          HEAPU32[penviron_buf_size >>> 2 >>> 0] = bufSize;
          return 0;
        };
        var runtimeKeepaliveCounter = 0;
        var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
        var _proc_exit = (code) => {
          EXITSTATUS = code;
          if (!keepRuntimeAlive()) {
            Module2["onExit"]?.(code);
            ABORT = true;
          }
          quit_(code, new ExitStatus(code));
        };
        var exitJS = (status, implicit) => {
          EXITSTATUS = status;
          checkUnflushedContent();
          if (keepRuntimeAlive() && !implicit) {
            var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
            readyPromiseReject(msg);
            err(msg);
          }
          _proc_exit(status);
        };
        var _exit = exitJS;
        function _fd_close(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.close(stream);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        function _fd_fdstat_get(fd, pbuf) {
          pbuf >>>= 0;
          try {
            var rightsBase = 0;
            var rightsInheriting = 0;
            var flags = 0;
            {
              var stream = SYSCALLS.getStreamFromFD(fd);
              var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
            }
            HEAP8[pbuf >>> 0] = type;
            HEAP16[pbuf + 2 >>> 1 >>> 0] = flags;
            tempI64 = [rightsBase >>> 0, (tempDouble = rightsBase, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[pbuf + 8 >>> 2 >>> 0] = tempI64[0], HEAP32[pbuf + 12 >>> 2 >>> 0] = tempI64[1];
            tempI64 = [rightsInheriting >>> 0, (tempDouble = rightsInheriting, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[pbuf + 16 >>> 2 >>> 0] = tempI64[0], HEAP32[pbuf + 20 >>> 2 >>> 0] = tempI64[1];
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        var doReadv = (stream, iov, iovcnt, offset) => {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >>> 2 >>> 0];
            var len = HEAPU32[iov + 4 >>> 2 >>> 0];
            iov += 8;
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
              return -1;
            ret += curr;
            if (curr < len)
              break;
            if (typeof offset !== "undefined") {
              offset += curr;
            }
          }
          return ret;
        };
        function _fd_read(fd, iov, iovcnt, pnum) {
          iov >>>= 0;
          iovcnt >>>= 0;
          pnum >>>= 0;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doReadv(stream, iov, iovcnt);
            HEAPU32[pnum >>> 2 >>> 0] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
          var offset = convertI32PairToI53Checked(offset_low, offset_high);
          newOffset >>>= 0;
          try {
            if (isNaN(offset))
              return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.llseek(stream, offset, whence);
            tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >>> 2 >>> 0] = tempI64[0], HEAP32[newOffset + 4 >>> 2 >>> 0] = tempI64[1];
            if (stream.getdents && offset === 0 && whence === 0)
              stream.getdents = null;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        function _fd_sync(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            if (stream.stream_ops?.fsync) {
              return stream.stream_ops.fsync(stream);
            }
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        var doWritev = (stream, iov, iovcnt, offset) => {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >>> 2 >>> 0];
            var len = HEAPU32[iov + 4 >>> 2 >>> 0];
            iov += 8;
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
              return -1;
            ret += curr;
            if (typeof offset !== "undefined") {
              offset += curr;
            }
          }
          return ret;
        };
        function _fd_write(fd, iov, iovcnt, pnum) {
          iov >>>= 0;
          iovcnt >>>= 0;
          pnum >>>= 0;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doWritev(stream, iov, iovcnt);
            HEAPU32[pnum >>> 2 >>> 0] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        var arraySum = (array, index) => {
          var sum = 0;
          for (var i = 0; i <= index; sum += array[i++]) {
          }
          return sum;
        };
        var MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var addDays = (date, days) => {
          var newDate = new Date(date.getTime());
          while (days > 0) {
            var leap = isLeapYear(newDate.getFullYear());
            var currentMonth = newDate.getMonth();
            var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
            if (days > daysInCurrentMonth - newDate.getDate()) {
              days -= daysInCurrentMonth - newDate.getDate() + 1;
              newDate.setDate(1);
              if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1);
              } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1);
              }
            } else {
              newDate.setDate(newDate.getDate() + days);
              return newDate;
            }
          }
          return newDate;
        };
        var writeArrayToMemory = (array, buffer) => {
          assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
          HEAP8.set(array, buffer >>> 0);
        };
        function _strftime(s, maxsize, format2, tm) {
          s >>>= 0;
          maxsize >>>= 0;
          format2 >>>= 0;
          tm >>>= 0;
          var tm_zone = HEAPU32[tm + 40 >>> 2 >>> 0];
          var date = {
            tm_sec: HEAP32[tm >>> 2 >>> 0],
            tm_min: HEAP32[tm + 4 >>> 2 >>> 0],
            tm_hour: HEAP32[tm + 8 >>> 2 >>> 0],
            tm_mday: HEAP32[tm + 12 >>> 2 >>> 0],
            tm_mon: HEAP32[tm + 16 >>> 2 >>> 0],
            tm_year: HEAP32[tm + 20 >>> 2 >>> 0],
            tm_wday: HEAP32[tm + 24 >>> 2 >>> 0],
            tm_yday: HEAP32[tm + 28 >>> 2 >>> 0],
            tm_isdst: HEAP32[tm + 32 >>> 2 >>> 0],
            tm_gmtoff: HEAP32[tm + 36 >>> 2 >>> 0],
            tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
          };
          var pattern = UTF8ToString(format2);
          var EXPANSION_RULES_1 = {
            "%c": "%a %b %d %H:%M:%S %Y",
            "%D": "%m/%d/%y",
            "%F": "%Y-%m-%d",
            "%h": "%b",
            "%r": "%I:%M:%S %p",
            "%R": "%H:%M",
            "%T": "%H:%M:%S",
            "%x": "%m/%d/%y",
            "%X": "%H:%M:%S",
            "%Ec": "%c",
            "%EC": "%C",
            "%Ex": "%m/%d/%y",
            "%EX": "%H:%M:%S",
            "%Ey": "%y",
            "%EY": "%Y",
            "%Od": "%d",
            "%Oe": "%e",
            "%OH": "%H",
            "%OI": "%I",
            "%Om": "%m",
            "%OM": "%M",
            "%OS": "%S",
            "%Ou": "%u",
            "%OU": "%U",
            "%OV": "%V",
            "%Ow": "%w",
            "%OW": "%W",
            "%Oy": "%y"
          };
          for (var rule in EXPANSION_RULES_1) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
          }
          var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          function leadingSomething(value, digits, character) {
            var str = typeof value == "number" ? value.toString() : value || "";
            while (str.length < digits) {
              str = character[0] + str;
            }
            return str;
          }
          function leadingNulls(value, digits) {
            return leadingSomething(value, digits, "0");
          }
          function compareByDay(date1, date2) {
            function sgn(value) {
              return value < 0 ? -1 : value > 0 ? 1 : 0;
            }
            var compare;
            if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
              if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate());
              }
            }
            return compare;
          }
          function getFirstWeekStartDate(janFourth) {
            switch (janFourth.getDay()) {
              case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
              case 1:
                return janFourth;
              case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
              case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
              case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
              case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
              case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30);
            }
          }
          function getWeekBasedYear(date2) {
            var thisDate = addDays(new Date(date2.tm_year + 1900, 0, 1), date2.tm_yday);
            var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
            var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
              if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1;
              }
              return thisDate.getFullYear();
            }
            return thisDate.getFullYear() - 1;
          }
          var EXPANSION_RULES_2 = {
            "%a": (date2) => WEEKDAYS[date2.tm_wday].substring(0, 3),
            "%A": (date2) => WEEKDAYS[date2.tm_wday],
            "%b": (date2) => MONTHS[date2.tm_mon].substring(0, 3),
            "%B": (date2) => MONTHS[date2.tm_mon],
            "%C": (date2) => {
              var year = date2.tm_year + 1900;
              return leadingNulls(year / 100 | 0, 2);
            },
            "%d": (date2) => leadingNulls(date2.tm_mday, 2),
            "%e": (date2) => leadingSomething(date2.tm_mday, 2, " "),
            "%g": (date2) => getWeekBasedYear(date2).toString().substring(2),
            "%G": getWeekBasedYear,
            "%H": (date2) => leadingNulls(date2.tm_hour, 2),
            "%I": (date2) => {
              var twelveHour = date2.tm_hour;
              if (twelveHour == 0)
                twelveHour = 12;
              else if (twelveHour > 12)
                twelveHour -= 12;
              return leadingNulls(twelveHour, 2);
            },
            "%j": (date2) => leadingNulls(date2.tm_mday + arraySum(isLeapYear(date2.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date2.tm_mon - 1), 3),
            "%m": (date2) => leadingNulls(date2.tm_mon + 1, 2),
            "%M": (date2) => leadingNulls(date2.tm_min, 2),
            "%n": () => "\n",
            "%p": (date2) => {
              if (date2.tm_hour >= 0 && date2.tm_hour < 12) {
                return "AM";
              }
              return "PM";
            },
            "%S": (date2) => leadingNulls(date2.tm_sec, 2),
            "%t": () => "	",
            "%u": (date2) => date2.tm_wday || 7,
            "%U": (date2) => {
              var days = date2.tm_yday + 7 - date2.tm_wday;
              return leadingNulls(Math.floor(days / 7), 2);
            },
            "%V": (date2) => {
              var val = Math.floor((date2.tm_yday + 7 - (date2.tm_wday + 6) % 7) / 7);
              if ((date2.tm_wday + 371 - date2.tm_yday - 2) % 7 <= 2) {
                val++;
              }
              if (!val) {
                val = 52;
                var dec31 = (date2.tm_wday + 7 - date2.tm_yday - 1) % 7;
                if (dec31 == 4 || dec31 == 5 && isLeapYear(date2.tm_year % 400 - 1)) {
                  val++;
                }
              } else if (val == 53) {
                var jan1 = (date2.tm_wday + 371 - date2.tm_yday) % 7;
                if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date2.tm_year)))
                  val = 1;
              }
              return leadingNulls(val, 2);
            },
            "%w": (date2) => date2.tm_wday,
            "%W": (date2) => {
              var days = date2.tm_yday + 7 - (date2.tm_wday + 6) % 7;
              return leadingNulls(Math.floor(days / 7), 2);
            },
            "%y": (date2) => (date2.tm_year + 1900).toString().substring(2),
            "%Y": (date2) => date2.tm_year + 1900,
            "%z": (date2) => {
              var off = date2.tm_gmtoff;
              var ahead = off >= 0;
              off = Math.abs(off) / 60;
              off = off / 60 * 100 + off % 60;
              return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
            },
            "%Z": (date2) => date2.tm_zone,
            "%%": () => "%"
          };
          pattern = pattern.replace(/%%/g, "\0\0");
          for (var rule in EXPANSION_RULES_2) {
            if (pattern.includes(rule)) {
              pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
            }
          }
          pattern = pattern.replace(/\0\0/g, "%");
          var bytes = intArrayFromString(pattern, false);
          if (bytes.length > maxsize) {
            return 0;
          }
          writeArrayToMemory(bytes, s);
          return bytes.length - 1;
        }
        var handleException = (e) => {
          if (e instanceof ExitStatus || e == "unwind") {
            return EXITSTATUS;
          }
          checkStackCookie();
          if (e instanceof WebAssembly.RuntimeError) {
            if (_emscripten_stack_get_current() <= 0) {
              err("Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 209715200)");
            }
          }
          quit_(1, e);
        };
        var wasmTableMirror = [];
        var wasmTable;
        var getWasmTableEntry = (funcPtr) => {
          var func = wasmTableMirror[funcPtr];
          if (!func) {
            if (funcPtr >= wasmTableMirror.length)
              wasmTableMirror.length = funcPtr + 1;
            wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
          }
          assert(wasmTable.get(funcPtr) == func, "JavaScript-side Wasm function table mirror is out of date!");
          return func;
        };
        var getCFunc = (ident) => {
          var func = Module2["_" + ident];
          assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
          return func;
        };
        var stringToUTF8OnStack = (str) => {
          var size = lengthBytesUTF8(str) + 1;
          var ret = stackAlloc(size);
          stringToUTF8(str, ret, size);
          return ret;
        };
        var ccall = (ident, returnType, argTypes, args, opts) => {
          var toC = {
            "string": (str) => {
              var ret2 = 0;
              if (str !== null && str !== void 0 && str !== 0) {
                ret2 = stringToUTF8OnStack(str);
              }
              return ret2;
            },
            "array": (arr) => {
              var ret2 = stackAlloc(arr.length);
              writeArrayToMemory(arr, ret2);
              return ret2;
            }
          };
          function convertReturnValue(ret2) {
            if (returnType === "string") {
              return UTF8ToString(ret2);
            }
            if (returnType === "boolean")
              return Boolean(ret2);
            return ret2;
          }
          var func = getCFunc(ident);
          var cArgs = [];
          var stack = 0;
          assert(returnType !== "array", 'Return type should not be "array".');
          if (args) {
            for (var i = 0; i < args.length; i++) {
              var converter = toC[argTypes[i]];
              if (converter) {
                if (stack === 0)
                  stack = stackSave();
                cArgs[i] = converter(args[i]);
              } else {
                cArgs[i] = args[i];
              }
            }
          }
          var ret = func(...cArgs);
          function onDone(ret2) {
            if (stack !== 0)
              stackRestore(stack);
            return convertReturnValue(ret2);
          }
          ret = onDone(ret);
          return ret;
        };
        var cwrap = (ident, returnType, argTypes, opts) => (...args) => ccall(ident, returnType, argTypes, args, opts);
        FS.createPreloadedFile = FS_createPreloadedFile;
        FS.staticInit();
        function checkIncomingModuleAPI() {
          ignoredModuleProp("fetchSettings");
        }
        var wasmImports = {
          /** @export */
          __syscall_chmod: ___syscall_chmod,
          /** @export */
          __syscall_dup3: ___syscall_dup3,
          /** @export */
          __syscall_faccessat: ___syscall_faccessat,
          /** @export */
          __syscall_fchmod: ___syscall_fchmod,
          /** @export */
          __syscall_fchown32: ___syscall_fchown32,
          /** @export */
          __syscall_fcntl64: ___syscall_fcntl64,
          /** @export */
          __syscall_fstat64: ___syscall_fstat64,
          /** @export */
          __syscall_ftruncate64: ___syscall_ftruncate64,
          /** @export */
          __syscall_getcwd: ___syscall_getcwd,
          /** @export */
          __syscall_ioctl: ___syscall_ioctl,
          /** @export */
          __syscall_lstat64: ___syscall_lstat64,
          /** @export */
          __syscall_mkdirat: ___syscall_mkdirat,
          /** @export */
          __syscall_newfstatat: ___syscall_newfstatat,
          /** @export */
          __syscall_openat: ___syscall_openat,
          /** @export */
          __syscall_readlinkat: ___syscall_readlinkat,
          /** @export */
          __syscall_renameat: ___syscall_renameat,
          /** @export */
          __syscall_rmdir: ___syscall_rmdir,
          /** @export */
          __syscall_stat64: ___syscall_stat64,
          /** @export */
          __syscall_unlinkat: ___syscall_unlinkat,
          /** @export */
          __syscall_utimensat: ___syscall_utimensat,
          /** @export */
          _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,
          /** @export */
          _emscripten_system: __emscripten_system,
          /** @export */
          _emscripten_throw_longjmp: __emscripten_throw_longjmp,
          /** @export */
          _gmtime_js: __gmtime_js,
          /** @export */
          _localtime_js: __localtime_js,
          /** @export */
          _mktime_js: __mktime_js,
          /** @export */
          _mmap_js: __mmap_js,
          /** @export */
          _munmap_js: __munmap_js,
          /** @export */
          _tzset_js: __tzset_js,
          /** @export */
          abort: _abort,
          /** @export */
          emscripten_date_now: _emscripten_date_now,
          /** @export */
          emscripten_get_heap_max: _emscripten_get_heap_max,
          /** @export */
          emscripten_get_now: _emscripten_get_now,
          /** @export */
          emscripten_memcpy_js: _emscripten_memcpy_js,
          /** @export */
          emscripten_resize_heap: _emscripten_resize_heap,
          /** @export */
          environ_get: _environ_get,
          /** @export */
          environ_sizes_get: _environ_sizes_get,
          /** @export */
          exit: _exit,
          /** @export */
          fd_close: _fd_close,
          /** @export */
          fd_fdstat_get: _fd_fdstat_get,
          /** @export */
          fd_read: _fd_read,
          /** @export */
          fd_seek: _fd_seek,
          /** @export */
          fd_sync: _fd_sync,
          /** @export */
          fd_write: _fd_write,
          /** @export */
          invoke_vii,
          /** @export */
          strftime: _strftime
        };
        var wasmExports = createWasm();
        var ___wasm_call_ctors = createExportWrapper("__wasm_call_ctors");
        var _handle = Module2["_handle"] = createExportWrapper("handle");
        var _main = Module2["_main"] = createExportWrapper("main");
        var setTempRet0 = createExportWrapper("setTempRet0");
        var _fflush = createExportWrapper("fflush");
        var _emscripten_builtin_memalign = createExportWrapper("emscripten_builtin_memalign");
        var _sbrk = createExportWrapper("sbrk");
        var _setThrew = createExportWrapper("setThrew");
        var _emscripten_stack_init = () => (_emscripten_stack_init = wasmExports["emscripten_stack_init"])();
        var _emscripten_stack_get_free = () => (_emscripten_stack_get_free = wasmExports["emscripten_stack_get_free"])();
        var _emscripten_stack_get_base = () => (_emscripten_stack_get_base = wasmExports["emscripten_stack_get_base"])();
        var _emscripten_stack_get_end = () => (_emscripten_stack_get_end = wasmExports["emscripten_stack_get_end"])();
        var stackSave = createExportWrapper("stackSave");
        var stackRestore = createExportWrapper("stackRestore");
        var stackAlloc = createExportWrapper("stackAlloc");
        var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"])();
        var dynCall_viiiij = Module2["dynCall_viiiij"] = createExportWrapper("dynCall_viiiij");
        var dynCall_ij = Module2["dynCall_ij"] = createExportWrapper("dynCall_ij");
        var dynCall_iiiij = Module2["dynCall_iiiij"] = createExportWrapper("dynCall_iiiij");
        var dynCall_vijii = Module2["dynCall_vijii"] = createExportWrapper("dynCall_vijii");
        var dynCall_iij = Module2["dynCall_iij"] = createExportWrapper("dynCall_iij");
        var dynCall_iijii = Module2["dynCall_iijii"] = createExportWrapper("dynCall_iijii");
        var dynCall_iiji = Module2["dynCall_iiji"] = createExportWrapper("dynCall_iiji");
        var dynCall_iiiiiij = Module2["dynCall_iiiiiij"] = createExportWrapper("dynCall_iiiiiij");
        var dynCall_iiij = Module2["dynCall_iiij"] = createExportWrapper("dynCall_iiij");
        var dynCall_jii = Module2["dynCall_jii"] = createExportWrapper("dynCall_jii");
        var dynCall_ji = Module2["dynCall_ji"] = createExportWrapper("dynCall_ji");
        var dynCall_vij = Module2["dynCall_vij"] = createExportWrapper("dynCall_vij");
        var dynCall_iiiiijii = Module2["dynCall_iiiiijii"] = createExportWrapper("dynCall_iiiiijii");
        var dynCall_j = Module2["dynCall_j"] = createExportWrapper("dynCall_j");
        var dynCall_jj = Module2["dynCall_jj"] = createExportWrapper("dynCall_jj");
        var dynCall_jiij = Module2["dynCall_jiij"] = createExportWrapper("dynCall_jiij");
        var dynCall_iiiiji = Module2["dynCall_iiiiji"] = createExportWrapper("dynCall_iiiiji");
        var dynCall_iiiijii = Module2["dynCall_iiiijii"] = createExportWrapper("dynCall_iiiijii");
        var dynCall_viiji = Module2["dynCall_viiji"] = createExportWrapper("dynCall_viiji");
        var dynCall_viijii = Module2["dynCall_viijii"] = createExportWrapper("dynCall_viijii");
        var dynCall_iiiijji = Module2["dynCall_iiiijji"] = createExportWrapper("dynCall_iiiijji");
        var dynCall_jiji = Module2["dynCall_jiji"] = createExportWrapper("dynCall_jiji");
        function invoke_vii(index, a1, a2) {
          var sp = stackSave();
          try {
            getWasmTableEntry(index)(a1, a2);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
              throw e;
            _setThrew(1, 0);
          }
        }
        function applySignatureConversions(wasmExports2) {
          wasmExports2 = Object.assign({}, wasmExports2);
          var makeWrapper_ppp = (f) => (a0, a1) => f(a0, a1) >>> 0;
          var makeWrapper_pP = (f) => (a0) => f(a0) >>> 0;
          var makeWrapper_p = (f) => () => f() >>> 0;
          var makeWrapper_pp = (f) => (a0) => f(a0) >>> 0;
          wasmExports2["emscripten_builtin_memalign"] = makeWrapper_ppp(wasmExports2["emscripten_builtin_memalign"]);
          wasmExports2["sbrk"] = makeWrapper_pP(wasmExports2["sbrk"]);
          wasmExports2["emscripten_stack_get_base"] = makeWrapper_p(wasmExports2["emscripten_stack_get_base"]);
          wasmExports2["emscripten_stack_get_end"] = makeWrapper_p(wasmExports2["emscripten_stack_get_end"]);
          wasmExports2["stackSave"] = makeWrapper_p(wasmExports2["stackSave"]);
          wasmExports2["stackAlloc"] = makeWrapper_pp(wasmExports2["stackAlloc"]);
          wasmExports2["emscripten_stack_get_current"] = makeWrapper_p(wasmExports2["emscripten_stack_get_current"]);
          return wasmExports2;
        }
        var MAGIC = 0;
        Math.random = () => {
          MAGIC = Math.pow(MAGIC + 1.8912, 3) % 1;
          return MAGIC;
        };
        var TIME = 1e4;
        function deterministicNow() {
          return TIME++;
        }
        Date.now = deterministicNow;
        Module2["thisProgram"] = "thisProgram";
        function hashMemory(id) {
          var ret = 0;
          var len = _sbrk(0);
          for (var i = 0; i < len; i++) {
            ret = ret * 17 + HEAPU8[i >>> 0] | 0;
          }
          return id + ":" + ret;
        }
        function hashString(s) {
          var ret = 0;
          for (var i = 0; i < s.length; i++) {
            ret = ret * 17 + s.charCodeAt(i) | 0;
          }
          return ret;
        }
        Module2["cwrap"] = cwrap;
        var missingLibrarySymbols = ["writeI53ToI64", "writeI53ToI64Clamped", "writeI53ToI64Signaling", "writeI53ToU64Clamped", "writeI53ToU64Signaling", "readI53FromU64", "convertI32PairToI53", "convertU32PairToI53", "inetPton4", "inetNtop4", "inetPton6", "inetNtop6", "readSockaddr", "writeSockaddr", "getCallstack", "emscriptenLog", "convertPCtoSourceLocation", "readEmAsmArgs", "jstoi_q", "listenOnce", "autoResumeAudioContext", "dynCallLegacy", "getDynCaller", "dynCall", "runtimeKeepalivePush", "runtimeKeepalivePop", "callUserCallback", "maybeExit", "asmjsMangle", "HandleAllocator", "getNativeTypeSize", "STACK_SIZE", "STACK_ALIGN", "POINTER_SIZE", "ASSERTIONS", "uleb128Encode", "sigToWasmTypes", "generateFuncType", "convertJsFunctionToWasm", "getEmptyTableSlot", "updateTableMap", "getFunctionAddress", "addFunction", "removeFunction", "reallyNegative", "unSign", "strLen", "reSign", "formatString", "intArrayToString", "AsciiToString", "UTF16ToString", "stringToUTF16", "lengthBytesUTF16", "UTF32ToString", "stringToUTF32", "lengthBytesUTF32", "stringToNewUTF8", "registerKeyEventCallback", "maybeCStringToJsString", "findEventTarget", "getBoundingClientRect", "fillMouseEventData", "registerMouseEventCallback", "registerWheelEventCallback", "registerUiEventCallback", "registerFocusEventCallback", "fillDeviceOrientationEventData", "registerDeviceOrientationEventCallback", "fillDeviceMotionEventData", "registerDeviceMotionEventCallback", "screenOrientation", "fillOrientationChangeEventData", "registerOrientationChangeEventCallback", "fillFullscreenChangeEventData", "registerFullscreenChangeEventCallback", "JSEvents_requestFullscreen", "JSEvents_resizeCanvasForFullscreen", "registerRestoreOldStyle", "hideEverythingExceptGivenElement", "restoreHiddenElements", "setLetterbox", "softFullscreenResizeWebGLRenderTarget", "doRequestFullscreen", "fillPointerlockChangeEventData", "registerPointerlockChangeEventCallback", "registerPointerlockErrorEventCallback", "requestPointerLock", "fillVisibilityChangeEventData", "registerVisibilityChangeEventCallback", "registerTouchEventCallback", "fillGamepadEventData", "registerGamepadEventCallback", "registerBeforeUnloadEventCallback", "fillBatteryEventData", "battery", "registerBatteryEventCallback", "setCanvasElementSize", "getCanvasElementSize", "jsStackTrace", "stackTrace", "checkWasiClock", "wasiRightsToMuslOFlags", "wasiOFlagsToMuslOFlags", "createDyncallWrapper", "safeSetTimeout", "setImmediateWrapped", "clearImmediateWrapped", "polyfillSetImmediate", "getPromise", "makePromise", "idsToPromises", "makePromiseCallback", "ExceptionInfo", "findMatchingCatch", "Browser_asyncPrepareDataCounter", "setMainLoop", "getSocketFromFD", "getSocketAddress", "FS_unlink", "FS_mkdirTree", "_setNetworkCallback", "heapObjectForWebGLType", "toTypedArrayIndex", "webgl_enable_ANGLE_instanced_arrays", "webgl_enable_OES_vertex_array_object", "webgl_enable_WEBGL_draw_buffers", "webgl_enable_WEBGL_multi_draw", "emscriptenWebGLGet", "computeUnpackAlignedImageSize", "colorChannelsInGlTextureFormat", "emscriptenWebGLGetTexPixelData", "emscriptenWebGLGetUniform", "webglGetUniformLocation", "webglPrepareUniformLocationsBeforeFirstUse", "webglGetLeftBracePos", "emscriptenWebGLGetVertexAttrib", "__glGetActiveAttribOrUniform", "writeGLArray", "registerWebGlEventCallback", "runAndAbortIfError", "ALLOC_NORMAL", "ALLOC_STACK", "allocate", "writeStringToMemory", "writeAsciiToMemory", "setErrNo", "demangle"];
        missingLibrarySymbols.forEach(missingLibrarySymbol);
        var unexportedSymbols = ["run", "addOnPreRun", "addOnInit", "addOnPreMain", "addOnExit", "addOnPostRun", "addRunDependency", "removeRunDependency", "FS_createFolder", "FS_createPath", "FS_createLazyFile", "FS_createLink", "FS_createDevice", "FS_readFile", "out", "err", "callMain", "abort", "wasmMemory", "wasmExports", "stackAlloc", "stackSave", "stackRestore", "getTempRet0", "setTempRet0", "writeStackCookie", "checkStackCookie", "readI53FromI64", "convertI32PairToI53Checked", "ptrToString", "zeroMemory", "exitJS", "getHeapMax", "growMemory", "ENV", "MONTH_DAYS_REGULAR", "MONTH_DAYS_LEAP", "MONTH_DAYS_REGULAR_CUMULATIVE", "MONTH_DAYS_LEAP_CUMULATIVE", "isLeapYear", "ydayFromDate", "arraySum", "addDays", "ERRNO_CODES", "ERRNO_MESSAGES", "DNS", "Protocols", "Sockets", "initRandomFill", "randomFill", "timers", "warnOnce", "UNWIND_CACHE", "readEmAsmArgsArray", "jstoi_s", "getExecutableName", "handleException", "keepRuntimeAlive", "asyncLoad", "alignMemory", "mmapAlloc", "wasmTable", "noExitRuntime", "getCFunc", "ccall", "freeTableIndexes", "functionsInTableMap", "setValue", "getValue", "PATH", "PATH_FS", "UTF8Decoder", "UTF8ArrayToString", "UTF8ToString", "stringToUTF8Array", "stringToUTF8", "lengthBytesUTF8", "intArrayFromString", "stringToAscii", "UTF16Decoder", "stringToUTF8OnStack", "writeArrayToMemory", "JSEvents", "specialHTMLTargets", "findCanvasEventTarget", "currentFullscreenStrategy", "restoreOldWindowedStyle", "ExitStatus", "getEnvStrings", "doReadv", "doWritev", "promiseMap", "uncaughtExceptionCount", "exceptionLast", "exceptionCaught", "Browser", "getPreloadedImageData__data", "wget", "SYSCALLS", "preloadPlugins", "FS_createPreloadedFile", "FS_modeStringToFlags", "FS_getMode", "FS_stdin_getChar_buffer", "FS_stdin_getChar", "FS", "FS_createDataFile", "MEMFS", "TTY", "PIPEFS", "SOCKFS", "tempFixedLengthArray", "miniTempWebGLFloatBuffers", "miniTempWebGLIntBuffers", "GL", "AL", "GLUT", "EGL", "GLEW", "IDBStore", "SDL", "SDL_gfx", "allocateUTF8", "allocateUTF8OnStack"];
        unexportedSymbols.forEach(unexportedRuntimeSymbol);
        var calledRun;
        dependenciesFulfilled = function runCaller() {
          if (!calledRun)
            run();
          if (!calledRun)
            dependenciesFulfilled = runCaller;
        };
        function callMain() {
          assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
          assert(__ATPRERUN__.length == 0, "cannot call main when preRun functions remain to be called");
          var entryFunction = _main;
          var argc = 0;
          var argv = 0;
          try {
            var ret = entryFunction(argc, argv);
            exitJS(
              ret,
              /* implicit = */
              true
            );
            return ret;
          } catch (e) {
            return handleException(e);
          }
        }
        function stackCheckInit() {
          _emscripten_stack_init();
          writeStackCookie();
        }
        function run() {
          if (runDependencies > 0) {
            return;
          }
          stackCheckInit();
          preRun();
          if (runDependencies > 0) {
            return;
          }
          function doRun() {
            if (calledRun)
              return;
            calledRun = true;
            Module2["calledRun"] = true;
            if (ABORT)
              return;
            initRuntime();
            preMain();
            readyPromiseResolve(Module2);
            if (Module2["onRuntimeInitialized"])
              Module2["onRuntimeInitialized"]();
            if (shouldRunNow)
              callMain();
            postRun();
          }
          if (Module2["setStatus"]) {
            Module2["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module2["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
          checkStackCookie();
        }
        function checkUnflushedContent() {
          var oldOut = out;
          var oldErr = err;
          var has = false;
          out = err = (x) => {
            has = true;
          };
          try {
            _fflush(0);
            ["stdout", "stderr"].forEach(function(name) {
              var info = FS.analyzePath("/dev/" + name);
              if (!info)
                return;
              var stream = info.object;
              var rdev = stream.rdev;
              var tty = TTY.ttys[rdev];
              if (tty?.output?.length) {
                has = true;
              }
            });
          } catch (e) {
          }
          out = oldOut;
          err = oldErr;
          if (has) {
            warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.");
          }
        }
        if (Module2["preInit"]) {
          if (typeof Module2["preInit"] == "function")
            Module2["preInit"] = [Module2["preInit"]];
          while (Module2["preInit"].length > 0) {
            Module2["preInit"].pop()();
          }
        }
        var shouldRunNow = true;
        if (Module2["noInitialRun"])
          shouldRunNow = false;
        run();
        Module2.resizeHeap = _emscripten_resize_heap;
        return Module2.ready;
      };
    })();
    module2.exports = Module;
  }
});

// src/formats/emscripten4.cjs
var require_emscripten4 = __commonJS({
  "src/formats/emscripten4.cjs"(exports2, module2) {
    var DEFAULT_GAS_LIMIT = 9e15;
    var Module = (() => {
      var _scriptName = typeof document != "undefined" ? document.currentScript?.src : void 0;
      if (typeof __filename != "undefined")
        _scriptName ||= __filename;
      return function(moduleArg = {}) {
        var moduleRtn;
        var Module2 = Object.assign({}, moduleArg);
        Module2.gas = {
          limit: Module2.computeLimit || DEFAULT_GAS_LIMIT,
          used: 0,
          use: (amount) => {
            Module2.gas.used += amount;
          },
          refill: (amount) => {
            if (!amount)
              Module2.gas.used = 0;
            else
              Module2.gas.used = Math.max(Module2.gas.used - amount, 0);
          },
          isEmpty: () => Module2.gas.used > Module2.gas.limit
        };
        var readyPromiseResolve, readyPromiseReject;
        var readyPromise = new Promise((resolve, reject) => {
          readyPromiseResolve = resolve;
          readyPromiseReject = reject;
        });
        ["_malloc", "_memory", "___asyncjs__weavedrive_open", "___asyncjs__weavedrive_read", "___asyncjs__weavedrive_close", "_handle", "___indirect_function_table", "onRuntimeInitialized"].forEach((prop) => {
          if (!Object.getOwnPropertyDescriptor(readyPromise, prop)) {
            Object.defineProperty(readyPromise, prop, {
              get: () => abort("You are getting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js"),
              set: () => abort("You are setting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")
            });
          }
        });
        var ENVIRONMENT_IS_WEB = typeof window == "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
        var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
        var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        if (Module2["ENVIRONMENT"]) {
          throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
        }
        if (ENVIRONMENT_IS_NODE) {
        }
        Module2.locateFile = (url) => url;
        var moduleOverrides = Object.assign({}, Module2);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow) => {
          throw toThrow;
        };
        var scriptDirectory = "";
        function locateFile(path) {
          if (Module2["locateFile"]) {
            return Module2["locateFile"](path, scriptDirectory);
          }
          return scriptDirectory + path;
        }
        var read_, readAsync, readBinary;
        if (ENVIRONMENT_IS_NODE) {
          if (typeof process == "undefined" || !process.release || process.release.name !== "node")
            throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          var nodeVersion = process.versions.node;
          var numericVersion = nodeVersion.split(".").slice(0, 3);
          numericVersion = numericVersion[0] * 1e4 + numericVersion[1] * 100 + numericVersion[2].split("-")[0] * 1;
          if (numericVersion < 16e4) {
            throw new Error("This emscripten-generated code requires node v16.0.0 (detected v" + nodeVersion + ")");
          }
          var fs = require("fs");
          var nodePath = require("path");
          scriptDirectory = __dirname + "/";
          read_ = (filename, binary) => {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            return fs.readFileSync(filename, binary ? void 0 : "utf8");
          };
          readBinary = (filename) => {
            var ret = read_(filename, true);
            if (!ret.buffer) {
              ret = new Uint8Array(ret);
            }
            assert(ret.buffer);
            return ret;
          };
          readAsync = (filename, onload, onerror, binary = true) => {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            fs.readFile(filename, binary ? void 0 : "utf8", (err2, data) => {
              if (err2)
                onerror(err2);
              else
                onload(binary ? data.buffer : data);
            });
          };
          if (!Module2["thisProgram"] && process.argv.length > 1) {
            thisProgram = process.argv[1].replace(/\\/g, "/");
          }
          arguments_ = process.argv.slice(2);
          quit_ = (status, toThrow) => {
            process.exitCode = status;
            throw toThrow;
          };
        } else if (ENVIRONMENT_IS_SHELL) {
          if (typeof process == "object" && typeof require === "function" || typeof window == "object" || typeof importScripts == "function")
            throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else if (typeof document != "undefined" && document.currentScript) {
            scriptDirectory = document.currentScript.src;
          }
          if (_scriptName) {
            scriptDirectory = _scriptName;
          }
          if (scriptDirectory.startsWith("blob:")) {
            scriptDirectory = "";
          } else {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
          }
          if (!(typeof window == "object" || typeof importScripts == "function"))
            throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          {
            read_ = (url) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.send(null);
              return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = (url) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(
                  /** @type{!ArrayBuffer} */
                  xhr.response
                );
              };
            }
            readAsync = (url, onload, onerror) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, true);
              xhr.responseType = "arraybuffer";
              xhr.onload = () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                  onload(xhr.response);
                  return;
                }
                onerror();
              };
              xhr.onerror = onerror;
              xhr.send(null);
            };
          }
        } else {
          throw new Error("environment detection error");
        }
        var out = Module2["print"] || console.log.bind(console);
        var err = Module2["printErr"] || console.error.bind(console);
        Object.assign(Module2, moduleOverrides);
        moduleOverrides = null;
        checkIncomingModuleAPI();
        if (Module2["arguments"])
          arguments_ = Module2["arguments"];
        legacyModuleProp("arguments", "arguments_");
        if (Module2["thisProgram"])
          thisProgram = Module2["thisProgram"];
        legacyModuleProp("thisProgram", "thisProgram");
        if (Module2["quit"])
          quit_ = Module2["quit"];
        legacyModuleProp("quit", "quit_");
        assert(typeof Module2["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["read"] == "undefined", "Module.read option was removed (modify read_ in JS)");
        assert(typeof Module2["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
        assert(typeof Module2["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
        assert(typeof Module2["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)");
        assert(typeof Module2["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
        legacyModuleProp("asm", "wasmExports");
        legacyModuleProp("read", "read_");
        legacyModuleProp("readAsync", "readAsync");
        legacyModuleProp("readBinary", "readBinary");
        legacyModuleProp("setWindowTitle", "setWindowTitle");
        assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");
        var wasmBinary;
        if (Module2["wasmBinary"])
          wasmBinary = Module2["wasmBinary"];
        legacyModuleProp("wasmBinary", "wasmBinary");
        if (typeof WebAssembly != "object") {
          err("no native wasm support detected");
        }
        function intArrayFromBase64(s) {
          if (typeof ENVIRONMENT_IS_NODE != "undefined" && ENVIRONMENT_IS_NODE) {
            var buf = Buffer.from(s, "base64");
            return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
          }
          var decoded = atob(s);
          var bytes = new Uint8Array(decoded.length);
          for (var i = 0; i < decoded.length; ++i) {
            bytes[i] = decoded.charCodeAt(i);
          }
          return bytes;
        }
        var wasmMemory;
        var ABORT = false;
        var EXITSTATUS;
        function assert(condition, text) {
          if (!condition) {
            abort("Assertion failed" + (text ? ": " + text : ""));
          }
        }
        var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        function updateMemoryViews() {
          var b = wasmMemory.buffer;
          Module2["HEAP8"] = HEAP8 = new Int8Array(b);
          Module2["HEAP16"] = HEAP16 = new Int16Array(b);
          Module2["HEAPU8"] = HEAPU8 = new Uint8Array(b);
          Module2["HEAPU16"] = HEAPU16 = new Uint16Array(b);
          Module2["HEAP32"] = HEAP32 = new Int32Array(b);
          Module2["HEAPU32"] = HEAPU32 = new Uint32Array(b);
          Module2["HEAPF32"] = HEAPF32 = new Float32Array(b);
          Module2["HEAPF64"] = HEAPF64 = new Float64Array(b);
        }
        assert(!Module2["STACK_SIZE"], "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");
        assert(typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != void 0 && Int32Array.prototype.set != void 0, "JS engine does not provide full typed array support");
        assert(!Module2["wasmMemory"], "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");
        assert(!Module2["INITIAL_MEMORY"], "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
        function writeStackCookie() {
          var max = _emscripten_stack_get_end();
          assert((max & 3) == 0);
          if (max == 0) {
            max += 4;
          }
          HEAPU32[max >>> 2 >>> 0] = 34821223;
          HEAPU32[max + 4 >>> 2 >>> 0] = 2310721022;
          HEAPU32[0 >>> 2 >>> 0] = 1668509029;
        }
        function checkStackCookie() {
          if (ABORT)
            return;
          var max = _emscripten_stack_get_end();
          if (max == 0) {
            max += 4;
          }
          var cookie1 = HEAPU32[max >>> 2 >>> 0];
          var cookie2 = HEAPU32[max + 4 >>> 2 >>> 0];
          if (cookie1 != 34821223 || cookie2 != 2310721022) {
            abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
          }
          if (HEAPU32[0 >>> 2 >>> 0] != 1668509029) {
            abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
          }
        }
        (function() {
          var h16 = new Int16Array(1);
          var h8 = new Int8Array(h16.buffer);
          h16[0] = 25459;
          if (h8[0] !== 115 || h8[1] !== 99)
            throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
        })();
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        function preRun() {
          if (Module2["preRun"]) {
            if (typeof Module2["preRun"] == "function")
              Module2["preRun"] = [Module2["preRun"]];
            while (Module2["preRun"].length) {
              addOnPreRun(Module2["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          assert(!runtimeInitialized);
          runtimeInitialized = true;
          checkStackCookie();
          if (!Module2["noFSInit"] && !FS.init.initialized)
            FS.init();
          FS.ignorePermissions = false;
          TTY.init();
          callRuntimeCallbacks(__ATINIT__);
        }
        function postRun() {
          checkStackCookie();
          if (Module2["postRun"]) {
            if (typeof Module2["postRun"] == "function")
              Module2["postRun"] = [Module2["postRun"]];
            while (Module2["postRun"].length) {
              addOnPostRun(Module2["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
          __ATINIT__.unshift(cb);
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        var runDependencyTracking = {};
        function getUniqueRunDependency(id) {
          var orig = id;
          while (1) {
            if (!runDependencyTracking[id])
              return id;
            id = orig + Math.random();
          }
        }
        function addRunDependency(id) {
          runDependencies++;
          Module2["monitorRunDependencies"]?.(runDependencies);
          if (id) {
            assert(!runDependencyTracking[id]);
            runDependencyTracking[id] = 1;
            if (runDependencyWatcher === null && typeof setInterval != "undefined") {
              runDependencyWatcher = setInterval(() => {
                if (ABORT) {
                  clearInterval(runDependencyWatcher);
                  runDependencyWatcher = null;
                  return;
                }
                var shown = false;
                for (var dep in runDependencyTracking) {
                  if (!shown) {
                    shown = true;
                    err("still waiting on run dependencies:");
                  }
                  err(`dependency: ${dep}`);
                }
                if (shown) {
                  err("(end of list)");
                }
              }, 1e4);
            }
          } else {
            err("warning: run dependency added without ID");
          }
        }
        function removeRunDependency(id) {
          runDependencies--;
          Module2["monitorRunDependencies"]?.(runDependencies);
          if (id) {
            assert(runDependencyTracking[id]);
            delete runDependencyTracking[id];
          } else {
            err("warning: run dependency removed without ID");
          }
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        function abort(what) {
          Module2["onAbort"]?.(what);
          what = "Aborted(" + what + ")";
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          if (what.indexOf("RuntimeError: unreachable") >= 0) {
            what += '. "unreachable" may be due to ASYNCIFY_STACK_SIZE not being large enough (try increasing it)';
          }
          var e = new WebAssembly.RuntimeError(what);
          readyPromiseReject(e);
          throw e;
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
        var isFileURI = (filename) => filename.startsWith("file://");
        function createExportWrapper(name, nargs) {
          return (...args) => {
            assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
            var f = wasmExports[name];
            assert(f, `exported native function \`${name}\` not found`);
            assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
            return f(...args);
          };
        }
        function findWasmBinary() {
          var f = "process.wasm";
          if (!isDataURI(f)) {
            return locateFile(f);
          }
          return f;
        }
        var wasmBinaryFile;
        function getBinarySync(file) {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          if (readBinary) {
            return readBinary(file);
          }
          throw "both async and sync fetching of the wasm failed";
        }
        function getBinaryPromise(binaryFile) {
          if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
            if (typeof fetch == "function" && !isFileURI(binaryFile)) {
              return fetch(binaryFile, {
                credentials: "same-origin"
              }).then((response) => {
                if (!response["ok"]) {
                  throw `failed to load wasm binary file at '${binaryFile}'`;
                }
                return response["arrayBuffer"]();
              }).catch(() => getBinarySync(binaryFile));
            } else if (readAsync) {
              return new Promise((resolve, reject) => {
                readAsync(binaryFile, (response) => resolve(new Uint8Array(
                  /** @type{!ArrayBuffer} */
                  response
                )), reject);
              });
            }
          }
          return Promise.resolve().then(() => getBinarySync(binaryFile));
        }
        function instantiateArrayBuffer(binaryFile, imports, receiver) {
          return getBinaryPromise(binaryFile).then((binary) => WebAssembly.instantiate(binary, imports)).then(receiver, (reason) => {
            err(`failed to asynchronously prepare wasm: ${reason}`);
            if (isFileURI(wasmBinaryFile)) {
              err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
            }
            abort(reason);
          });
        }
        function instantiateAsync(binary, binaryFile, imports, callback) {
          if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
            return fetch(binaryFile, {
              credentials: "same-origin"
            }).then((response) => {
              var result = WebAssembly.instantiateStreaming(response, imports);
              return result.then(callback, function(reason) {
                err(`wasm streaming compile failed: ${reason}`);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(binaryFile, imports, callback);
              });
            });
          }
          return instantiateArrayBuffer(binaryFile, imports, callback);
        }
        function getWasmImports() {
          Asyncify.instrumentWasmImports(wasmImports);
          return {
            "env": wasmImports,
            "wasi_snapshot_preview1": wasmImports,
            metering: { usegas: function(gas) {
              Module2.gas.use(gas);
              if (Module2.gas.isEmpty())
                throw Error("out of gas!");
            } }
          };
        }
        function createWasm() {
          var info = getWasmImports();
          function receiveInstance(instance, module3) {
            wasmExports = instance.exports;
            wasmExports = Asyncify.instrumentWasmExports(wasmExports);
            wasmExports = applySignatureConversions(wasmExports);
            wasmMemory = wasmExports["memory"];
            assert(wasmMemory, "memory not found in wasm exports");
            updateMemoryViews();
            wasmTable = wasmExports["__indirect_function_table"];
            assert(wasmTable, "table not found in wasm exports");
            addOnInit(wasmExports["__wasm_call_ctors"]);
            removeRunDependency("wasm-instantiate");
            return wasmExports;
          }
          addRunDependency("wasm-instantiate");
          var trueModule = Module2;
          function receiveInstantiationResult(result) {
            assert(Module2 === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
            trueModule = null;
            receiveInstance(result["instance"]);
          }
          if (Module2["instantiateWasm"]) {
            try {
              return Module2["instantiateWasm"](info, receiveInstance);
            } catch (e) {
              err(`Module.instantiateWasm callback failed with error: ${e}`);
              readyPromiseReject(e);
            }
          }
          if (!wasmBinaryFile)
            wasmBinaryFile = findWasmBinary();
          instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
          return {};
        }
        var tempDouble;
        var tempI64;
        function legacyModuleProp(prop, newName, incoming = true) {
          if (!Object.getOwnPropertyDescriptor(Module2, prop)) {
            Object.defineProperty(Module2, prop, {
              configurable: true,
              get() {
                let extra = incoming ? " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)" : "";
                abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);
              }
            });
          }
        }
        function ignoredModuleProp(prop) {
          if (Object.getOwnPropertyDescriptor(Module2, prop)) {
            abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
          }
        }
        function isExportedByForceFilesystem(name) {
          return name === "FS_createPath" || name === "FS_createDataFile" || name === "FS_createPreloadedFile" || name === "FS_unlink" || name === "addRunDependency" || name === "FS_createLazyFile" || name === "FS_createDevice" || name === "removeRunDependency";
        }
        function missingGlobal(sym, msg) {
          if (typeof globalThis != "undefined") {
            Object.defineProperty(globalThis, sym, {
              configurable: true,
              get() {
                warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
                return void 0;
              }
            });
          }
        }
        missingGlobal("buffer", "Please use HEAP8.buffer or wasmMemory.buffer");
        missingGlobal("asm", "Please use wasmExports instead");
        function missingLibrarySymbol(sym) {
          if (typeof globalThis != "undefined" && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
            Object.defineProperty(globalThis, sym, {
              configurable: true,
              get() {
                var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
                var librarySymbol = sym;
                if (!librarySymbol.startsWith("_")) {
                  librarySymbol = "$" + sym;
                }
                msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
                if (isExportedByForceFilesystem(sym)) {
                  msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
                }
                warnOnce(msg);
                return void 0;
              }
            });
          }
          unexportedRuntimeSymbol(sym);
        }
        function unexportedRuntimeSymbol(sym) {
          if (!Object.getOwnPropertyDescriptor(Module2, sym)) {
            Object.defineProperty(Module2, sym, {
              configurable: true,
              get() {
                var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
                if (isExportedByForceFilesystem(sym)) {
                  msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
                }
                abort(msg);
              }
            });
          }
        }
        function __asyncjs__weavedrive_open(c_filename, mode) {
          return Asyncify.handleAsync(async () => {
            const filename = UTF8ToString(Number(c_filename));
            if (!Module2.WeaveDrive) {
              return Promise.resolve(null);
            }
            const drive = Module2.WeaveDrive(Module2, FS);
            return await drive.open(filename);
          });
        }
        function __asyncjs__weavedrive_read(fd, dst_ptr, length) {
          return Asyncify.handleAsync(async () => {
            const drive = Module2.WeaveDrive(Module2, FS);
            return Promise.resolve(await drive.read(fd, dst_ptr, length));
          });
        }
        function __asyncjs__weavedrive_close(fd) {
          return Asyncify.handleAsync(async () => {
            const drive = Module2.WeaveDrive(Module2, FS);
            return drive.close(fd);
          });
        }
        function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = `Program terminated with exit(${status})`;
          this.status = status;
        }
        var callRuntimeCallbacks = (callbacks) => {
          while (callbacks.length > 0) {
            callbacks.shift()(Module2);
          }
        };
        var noExitRuntime = Module2["noExitRuntime"] || true;
        var ptrToString = (ptr) => {
          assert(typeof ptr === "number");
          return "0x" + ptr.toString(16).padStart(8, "0");
        };
        var stackRestore = (val) => __emscripten_stack_restore(val);
        var stackSave = () => _emscripten_stack_get_current();
        var warnOnce = (text) => {
          warnOnce.shown ||= {};
          if (!warnOnce.shown[text]) {
            warnOnce.shown[text] = 1;
            if (ENVIRONMENT_IS_NODE)
              text = "warning: " + text;
            err(text);
          }
        };
        var convertI32PairToI53Checked = (lo, hi) => {
          assert(lo == lo >>> 0 || lo == (lo | 0));
          assert(hi === (hi | 0));
          return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
        };
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
        var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
          idx >>>= 0;
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          while (heapOrArray[endPtr] && !(endPtr >= endIdx))
            ++endPtr;
          if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
          }
          var str = "";
          while (idx < endPtr) {
            var u0 = heapOrArray[idx++];
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }
            var u1 = heapOrArray[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue;
            }
            var u2 = heapOrArray[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            } else {
              if ((u0 & 248) != 240)
                warnOnce("Invalid UTF-8 leading byte " + ptrToString(u0) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
              u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
          }
          return str;
        };
        var UTF8ToString = (ptr, maxBytesToRead) => {
          assert(typeof ptr == "number", `UTF8ToString expects a number (got ${typeof ptr})`);
          ptr >>>= 0;
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        };
        function ___assert_fail(condition, filename, line, func) {
          condition >>>= 0;
          filename >>>= 0;
          func >>>= 0;
          abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]);
        }
        class ExceptionInfo {
          constructor(excPtr) {
            this.excPtr = excPtr;
            this.ptr = excPtr - 24;
          }
          set_type(type) {
            HEAPU32[this.ptr + 4 >>> 2 >>> 0] = type;
          }
          get_type() {
            return HEAPU32[this.ptr + 4 >>> 2 >>> 0];
          }
          set_destructor(destructor) {
            HEAPU32[this.ptr + 8 >>> 2 >>> 0] = destructor;
          }
          get_destructor() {
            return HEAPU32[this.ptr + 8 >>> 2 >>> 0];
          }
          set_caught(caught) {
            caught = caught ? 1 : 0;
            HEAP8[this.ptr + 12 >>> 0] = caught;
          }
          get_caught() {
            return HEAP8[this.ptr + 12 >>> 0] != 0;
          }
          set_rethrown(rethrown) {
            rethrown = rethrown ? 1 : 0;
            HEAP8[this.ptr + 13 >>> 0] = rethrown;
          }
          get_rethrown() {
            return HEAP8[this.ptr + 13 >>> 0] != 0;
          }
          init(type, destructor) {
            this.set_adjusted_ptr(0);
            this.set_type(type);
            this.set_destructor(destructor);
          }
          set_adjusted_ptr(adjustedPtr) {
            HEAPU32[this.ptr + 16 >>> 2 >>> 0] = adjustedPtr;
          }
          get_adjusted_ptr() {
            return HEAPU32[this.ptr + 16 >>> 2 >>> 0];
          }
          get_exception_ptr() {
            var isPointer = ___cxa_is_pointer_type(this.get_type());
            if (isPointer) {
              return HEAPU32[this.excPtr >>> 2 >>> 0];
            }
            var adjusted = this.get_adjusted_ptr();
            if (adjusted !== 0)
              return adjusted;
            return this.excPtr;
          }
        }
        var exceptionLast = 0;
        var uncaughtExceptionCount = 0;
        function ___cxa_throw(ptr, type, destructor) {
          ptr >>>= 0;
          type >>>= 0;
          destructor >>>= 0;
          var info = new ExceptionInfo(ptr);
          info.init(type, destructor);
          exceptionLast = ptr;
          uncaughtExceptionCount++;
          assert(false, "Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.");
        }
        var PATH = {
          isAbs: (path) => path.charAt(0) === "/",
          splitPath: (filename) => {
            var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            return splitPathRe.exec(filename).slice(1);
          },
          normalizeArray: (parts, allowAboveRoot) => {
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
              var last = parts[i];
              if (last === ".") {
                parts.splice(i, 1);
              } else if (last === "..") {
                parts.splice(i, 1);
                up++;
              } else if (up) {
                parts.splice(i, 1);
                up--;
              }
            }
            if (allowAboveRoot) {
              for (; up; up--) {
                parts.unshift("..");
              }
            }
            return parts;
          },
          normalize: (path) => {
            var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
            path = PATH.normalizeArray(path.split("/").filter((p) => !!p), !isAbsolute).join("/");
            if (!path && !isAbsolute) {
              path = ".";
            }
            if (path && trailingSlash) {
              path += "/";
            }
            return (isAbsolute ? "/" : "") + path;
          },
          dirname: (path) => {
            var result = PATH.splitPath(path), root = result[0], dir = result[1];
            if (!root && !dir) {
              return ".";
            }
            if (dir) {
              dir = dir.substr(0, dir.length - 1);
            }
            return root + dir;
          },
          basename: (path) => {
            if (path === "/")
              return "/";
            path = PATH.normalize(path);
            path = path.replace(/\/$/, "");
            var lastSlash = path.lastIndexOf("/");
            if (lastSlash === -1)
              return path;
            return path.substr(lastSlash + 1);
          },
          join: (...paths) => PATH.normalize(paths.join("/")),
          join2: (l, r) => PATH.normalize(l + "/" + r)
        };
        var initRandomFill = () => {
          if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
            return (view) => crypto.getRandomValues(view);
          } else if (ENVIRONMENT_IS_NODE) {
            try {
              var crypto_module = require("crypto");
              var randomFillSync = crypto_module["randomFillSync"];
              if (randomFillSync) {
                return (view) => crypto_module["randomFillSync"](view);
              }
              var randomBytes = crypto_module["randomBytes"];
              return (view) => (view.set(randomBytes(view.byteLength)), view);
            } catch (e) {
            }
          }
          abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: (array) => { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
        };
        var randomFill = (view) => (randomFill = initRandomFill())(view);
        var PATH_FS = {
          resolve: (...args) => {
            var resolvedPath = "", resolvedAbsolute = false;
            for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
              var path = i >= 0 ? args[i] : FS.cwd();
              if (typeof path != "string") {
                throw new TypeError("Arguments to path.resolve must be strings");
              } else if (!path) {
                return "";
              }
              resolvedPath = path + "/" + resolvedPath;
              resolvedAbsolute = PATH.isAbs(path);
            }
            resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p) => !!p), !resolvedAbsolute).join("/");
            return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
          },
          relative: (from, to) => {
            from = PATH_FS.resolve(from).substr(1);
            to = PATH_FS.resolve(to).substr(1);
            function trim(arr) {
              var start = 0;
              for (; start < arr.length; start++) {
                if (arr[start] !== "")
                  break;
              }
              var end = arr.length - 1;
              for (; end >= 0; end--) {
                if (arr[end] !== "")
                  break;
              }
              if (start > end)
                return [];
              return arr.slice(start, end - start + 1);
            }
            var fromParts = trim(from.split("/"));
            var toParts = trim(to.split("/"));
            var length = Math.min(fromParts.length, toParts.length);
            var samePartsLength = length;
            for (var i = 0; i < length; i++) {
              if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
              }
            }
            var outputParts = [];
            for (var i = samePartsLength; i < fromParts.length; i++) {
              outputParts.push("..");
            }
            outputParts = outputParts.concat(toParts.slice(samePartsLength));
            return outputParts.join("/");
          }
        };
        var FS_stdin_getChar_buffer = [];
        var lengthBytesUTF8 = (str) => {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);
            if (c <= 127) {
              len++;
            } else if (c <= 2047) {
              len += 2;
            } else if (c >= 55296 && c <= 57343) {
              len += 4;
              ++i;
            } else {
              len += 3;
            }
          }
          return len;
        };
        var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
          outIdx >>>= 0;
          assert(typeof str === "string", `stringToUTF8Array expects a string (got ${typeof str})`);
          if (!(maxBytesToWrite > 0))
            return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i);
              u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
              if (outIdx >= endIdx)
                break;
              heap[outIdx++ >>> 0] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx)
                break;
              heap[outIdx++ >>> 0] = 192 | u >> 6;
              heap[outIdx++ >>> 0] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx)
                break;
              heap[outIdx++ >>> 0] = 224 | u >> 12;
              heap[outIdx++ >>> 0] = 128 | u >> 6 & 63;
              heap[outIdx++ >>> 0] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx)
                break;
              if (u > 1114111)
                warnOnce("Invalid Unicode code point " + ptrToString(u) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
              heap[outIdx++ >>> 0] = 240 | u >> 18;
              heap[outIdx++ >>> 0] = 128 | u >> 12 & 63;
              heap[outIdx++ >>> 0] = 128 | u >> 6 & 63;
              heap[outIdx++ >>> 0] = 128 | u & 63;
            }
          }
          heap[outIdx >>> 0] = 0;
          return outIdx - startIdx;
        };
        function intArrayFromString(stringy, dontAddNull, length) {
          var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
          var u8array = new Array(len);
          var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
          if (dontAddNull)
            u8array.length = numBytesWritten;
          return u8array;
        }
        var FS_stdin_getChar = () => {
          if (!FS_stdin_getChar_buffer.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              var BUFSIZE = 256;
              var buf = Buffer.alloc(BUFSIZE);
              var bytesRead = 0;
              var fd = process.stdin.fd;
              try {
                bytesRead = fs.readSync(fd, buf);
              } catch (e) {
                if (e.toString().includes("EOF"))
                  bytesRead = 0;
                else
                  throw e;
              }
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString("utf-8");
              } else {
                result = null;
              }
            } else if (typeof window != "undefined" && typeof window.prompt == "function") {
              result = window.prompt("Input: ");
              if (result !== null) {
                result += "\n";
              }
            } else if (typeof readline == "function") {
              result = readline();
              if (result !== null) {
                result += "\n";
              }
            }
            if (!result) {
              return null;
            }
            FS_stdin_getChar_buffer = intArrayFromString(result, true);
          }
          return FS_stdin_getChar_buffer.shift();
        };
        var TTY = {
          ttys: [],
          init() {
          },
          shutdown() {
          },
          register(dev, ops) {
            TTY.ttys[dev] = {
              input: [],
              output: [],
              ops
            };
            FS.registerDevice(dev, TTY.stream_ops);
          },
          stream_ops: {
            open(stream) {
              var tty = TTY.ttys[stream.node.rdev];
              if (!tty) {
                throw new FS.ErrnoError(43);
              }
              stream.tty = tty;
              stream.seekable = false;
            },
            close(stream) {
              stream.tty.ops.fsync(stream.tty);
            },
            fsync(stream) {
              stream.tty.ops.fsync(stream.tty);
            },
            read(stream, buffer, offset, length, pos) {
              if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(60);
              }
              var bytesRead = 0;
              for (var i = 0; i < length; i++) {
                var result;
                try {
                  result = stream.tty.ops.get_char(stream.tty);
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
                if (result === void 0 && bytesRead === 0) {
                  throw new FS.ErrnoError(6);
                }
                if (result === null || result === void 0)
                  break;
                bytesRead++;
                buffer[offset + i] = result;
              }
              if (bytesRead) {
                stream.node.timestamp = Date.now();
              }
              return bytesRead;
            },
            write(stream, buffer, offset, length, pos) {
              if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(60);
              }
              try {
                for (var i = 0; i < length; i++) {
                  stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                }
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (length) {
                stream.node.timestamp = Date.now();
              }
              return i;
            }
          },
          default_tty_ops: {
            get_char(tty) {
              return FS_stdin_getChar();
            },
            put_char(tty, val) {
              if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              } else {
                if (val != 0)
                  tty.output.push(val);
              }
            },
            fsync(tty) {
              if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              }
            },
            ioctl_tcgets(tty) {
              return {
                c_iflag: 25856,
                c_oflag: 5,
                c_cflag: 191,
                c_lflag: 35387,
                c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              };
            },
            ioctl_tcsets(tty, optional_actions, data) {
              return 0;
            },
            ioctl_tiocgwinsz(tty) {
              return [24, 80];
            }
          },
          default_tty1_ops: {
            put_char(tty, val) {
              if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              } else {
                if (val != 0)
                  tty.output.push(val);
              }
            },
            fsync(tty) {
              if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              }
            }
          }
        };
        var zeroMemory = (address, size) => {
          HEAPU8.fill(0, address, address + size);
          return address;
        };
        var alignMemory = (size, alignment) => {
          assert(alignment, "alignment argument is required");
          return Math.ceil(size / alignment) * alignment;
        };
        var mmapAlloc = (size) => {
          size = alignMemory(size, 65536);
          var ptr = _emscripten_builtin_memalign(65536, size);
          if (!ptr)
            return 0;
          return zeroMemory(ptr, size);
        };
        var MEMFS = {
          ops_table: null,
          mount(mount) {
            return MEMFS.createNode(
              null,
              "/",
              16384 | 511,
              /* 0777 */
              0
            );
          },
          createNode(parent, name, mode, dev) {
            if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
              throw new FS.ErrnoError(63);
            }
            MEMFS.ops_table ||= {
              dir: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  lookup: MEMFS.node_ops.lookup,
                  mknod: MEMFS.node_ops.mknod,
                  rename: MEMFS.node_ops.rename,
                  unlink: MEMFS.node_ops.unlink,
                  rmdir: MEMFS.node_ops.rmdir,
                  readdir: MEMFS.node_ops.readdir,
                  symlink: MEMFS.node_ops.symlink
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek
                }
              },
              file: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek,
                  read: MEMFS.stream_ops.read,
                  write: MEMFS.stream_ops.write,
                  allocate: MEMFS.stream_ops.allocate,
                  mmap: MEMFS.stream_ops.mmap,
                  msync: MEMFS.stream_ops.msync
                }
              },
              link: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  readlink: MEMFS.node_ops.readlink
                },
                stream: {}
              },
              chrdev: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: FS.chrdev_stream_ops
              }
            };
            var node = FS.createNode(parent, name, mode, dev);
            if (FS.isDir(node.mode)) {
              node.node_ops = MEMFS.ops_table.dir.node;
              node.stream_ops = MEMFS.ops_table.dir.stream;
              node.contents = {};
            } else if (FS.isFile(node.mode)) {
              node.node_ops = MEMFS.ops_table.file.node;
              node.stream_ops = MEMFS.ops_table.file.stream;
              node.usedBytes = 0;
              node.contents = null;
            } else if (FS.isLink(node.mode)) {
              node.node_ops = MEMFS.ops_table.link.node;
              node.stream_ops = MEMFS.ops_table.link.stream;
            } else if (FS.isChrdev(node.mode)) {
              node.node_ops = MEMFS.ops_table.chrdev.node;
              node.stream_ops = MEMFS.ops_table.chrdev.stream;
            }
            node.timestamp = Date.now();
            if (parent) {
              parent.contents[name] = node;
              parent.timestamp = node.timestamp;
            }
            return node;
          },
          getFileDataAsTypedArray(node) {
            if (!node.contents)
              return new Uint8Array(0);
            if (node.contents.subarray)
              return node.contents.subarray(0, node.usedBytes);
            return new Uint8Array(node.contents);
          },
          expandFileStorage(node, newCapacity) {
            var prevCapacity = node.contents ? node.contents.length : 0;
            if (prevCapacity >= newCapacity)
              return;
            var CAPACITY_DOUBLING_MAX = 1024 * 1024;
            newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
            if (prevCapacity != 0)
              newCapacity = Math.max(newCapacity, 256);
            var oldContents = node.contents;
            node.contents = new Uint8Array(newCapacity);
            if (node.usedBytes > 0)
              node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
          },
          resizeFileStorage(node, newSize) {
            if (node.usedBytes == newSize)
              return;
            if (newSize == 0) {
              node.contents = null;
              node.usedBytes = 0;
            } else {
              var oldContents = node.contents;
              node.contents = new Uint8Array(newSize);
              if (oldContents) {
                node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
              }
              node.usedBytes = newSize;
            }
          },
          node_ops: {
            getattr(node) {
              var attr = {};
              attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
              attr.ino = node.id;
              attr.mode = node.mode;
              attr.nlink = 1;
              attr.uid = 0;
              attr.gid = 0;
              attr.rdev = node.rdev;
              if (FS.isDir(node.mode)) {
                attr.size = 4096;
              } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes;
              } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length;
              } else {
                attr.size = 0;
              }
              attr.atime = new Date(node.timestamp);
              attr.mtime = new Date(node.timestamp);
              attr.ctime = new Date(node.timestamp);
              attr.blksize = 4096;
              attr.blocks = Math.ceil(attr.size / attr.blksize);
              return attr;
            },
            setattr(node, attr) {
              if (attr.mode !== void 0) {
                node.mode = attr.mode;
              }
              if (attr.timestamp !== void 0) {
                node.timestamp = attr.timestamp;
              }
              if (attr.size !== void 0) {
                MEMFS.resizeFileStorage(node, attr.size);
              }
            },
            lookup(parent, name) {
              throw FS.genericErrors[44];
            },
            mknod(parent, name, mode, dev) {
              return MEMFS.createNode(parent, name, mode, dev);
            },
            rename(old_node, new_dir, new_name) {
              if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                  new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {
                }
                if (new_node) {
                  for (var i in new_node.contents) {
                    throw new FS.ErrnoError(55);
                  }
                }
              }
              delete old_node.parent.contents[old_node.name];
              old_node.parent.timestamp = Date.now();
              old_node.name = new_name;
              new_dir.contents[new_name] = old_node;
              new_dir.timestamp = old_node.parent.timestamp;
              old_node.parent = new_dir;
            },
            unlink(parent, name) {
              delete parent.contents[name];
              parent.timestamp = Date.now();
            },
            rmdir(parent, name) {
              var node = FS.lookupNode(parent, name);
              for (var i in node.contents) {
                throw new FS.ErrnoError(55);
              }
              delete parent.contents[name];
              parent.timestamp = Date.now();
            },
            readdir(node) {
              var entries = [".", ".."];
              for (var key of Object.keys(node.contents)) {
                entries.push(key);
              }
              return entries;
            },
            symlink(parent, newname, oldpath) {
              var node = MEMFS.createNode(parent, newname, 511 | /* 0777 */
              40960, 0);
              node.link = oldpath;
              return node;
            },
            readlink(node) {
              if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(28);
              }
              return node.link;
            }
          },
          stream_ops: {
            read(stream, buffer, offset, length, position) {
              var contents = stream.node.contents;
              if (position >= stream.node.usedBytes)
                return 0;
              var size = Math.min(stream.node.usedBytes - position, length);
              assert(size >= 0);
              if (size > 8 && contents.subarray) {
                buffer.set(contents.subarray(position, position + size), offset);
              } else {
                for (var i = 0; i < size; i++)
                  buffer[offset + i] = contents[position + i];
              }
              return size;
            },
            write(stream, buffer, offset, length, position, canOwn) {
              assert(!(buffer instanceof ArrayBuffer));
              if (buffer.buffer === HEAP8.buffer) {
                canOwn = false;
              }
              if (!length)
                return 0;
              var node = stream.node;
              node.timestamp = Date.now();
              if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                  assert(position === 0, "canOwn must imply no weird position inside the file");
                  node.contents = buffer.subarray(offset, offset + length);
                  node.usedBytes = length;
                  return length;
                } else if (node.usedBytes === 0 && position === 0) {
                  node.contents = buffer.slice(offset, offset + length);
                  node.usedBytes = length;
                  return length;
                } else if (position + length <= node.usedBytes) {
                  node.contents.set(buffer.subarray(offset, offset + length), position);
                  return length;
                }
              }
              MEMFS.expandFileStorage(node, position + length);
              if (node.contents.subarray && buffer.subarray) {
                node.contents.set(buffer.subarray(offset, offset + length), position);
              } else {
                for (var i = 0; i < length; i++) {
                  node.contents[position + i] = buffer[offset + i];
                }
              }
              node.usedBytes = Math.max(node.usedBytes, position + length);
              return length;
            },
            llseek(stream, offset, whence) {
              var position = offset;
              if (whence === 1) {
                position += stream.position;
              } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                  position += stream.node.usedBytes;
                }
              }
              if (position < 0) {
                throw new FS.ErrnoError(28);
              }
              return position;
            },
            allocate(stream, offset, length) {
              MEMFS.expandFileStorage(stream.node, offset + length);
              stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
            },
            mmap(stream, length, position, prot, flags) {
              if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
              }
              var ptr;
              var allocated;
              var contents = stream.node.contents;
              if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
                allocated = false;
                ptr = contents.byteOffset;
              } else {
                if (position > 0 || position + length < contents.length) {
                  if (contents.subarray) {
                    contents = contents.subarray(position, position + length);
                  } else {
                    contents = Array.prototype.slice.call(contents, position, position + length);
                  }
                }
                allocated = true;
                ptr = mmapAlloc(length);
                if (!ptr) {
                  throw new FS.ErrnoError(48);
                }
                HEAP8.set(contents, ptr >>> 0);
              }
              return {
                ptr,
                allocated
              };
            },
            msync(stream, buffer, offset, length, mmapFlags) {
              MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
              return 0;
            }
          }
        };
        var asyncLoad = (url, onload, onerror, noRunDep) => {
          var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
          readAsync(url, (arrayBuffer) => {
            assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
            onload(new Uint8Array(arrayBuffer));
            if (dep)
              removeRunDependency(dep);
          }, (event) => {
            if (onerror) {
              onerror();
            } else {
              throw `Loading data file "${url}" failed.`;
            }
          });
          if (dep)
            addRunDependency(dep);
        };
        var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
          FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
        };
        var preloadPlugins = Module2["preloadPlugins"] || [];
        var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
          if (typeof Browser != "undefined")
            Browser.init();
          var handled = false;
          preloadPlugins.forEach((plugin) => {
            if (handled)
              return;
            if (plugin["canHandle"](fullname)) {
              plugin["handle"](byteArray, fullname, finish, onerror);
              handled = true;
            }
          });
          return handled;
        };
        var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
          var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
          var dep = getUniqueRunDependency(`cp ${fullname}`);
          function processData(byteArray) {
            function finish(byteArray2) {
              preFinish?.();
              if (!dontCreateFile) {
                FS_createDataFile(parent, name, byteArray2, canRead, canWrite, canOwn);
              }
              onload?.();
              removeRunDependency(dep);
            }
            if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
              onerror?.();
              removeRunDependency(dep);
            })) {
              return;
            }
            finish(byteArray);
          }
          addRunDependency(dep);
          if (typeof url == "string") {
            asyncLoad(url, processData, onerror);
          } else {
            processData(url);
          }
        };
        var FS_modeStringToFlags = (str) => {
          var flagModes = {
            "r": 0,
            "r+": 2,
            "w": 512 | 64 | 1,
            "w+": 512 | 64 | 2,
            "a": 1024 | 64 | 1,
            "a+": 1024 | 64 | 2
          };
          var flags = flagModes[str];
          if (typeof flags == "undefined") {
            throw new Error(`Unknown file open mode: ${str}`);
          }
          return flags;
        };
        var FS_getMode = (canRead, canWrite) => {
          var mode = 0;
          if (canRead)
            mode |= 292 | 73;
          if (canWrite)
            mode |= 146;
          return mode;
        };
        var ERRNO_MESSAGES = {
          0: "Success",
          1: "Arg list too long",
          2: "Permission denied",
          3: "Address already in use",
          4: "Address not available",
          5: "Address family not supported by protocol family",
          6: "No more processes",
          7: "Socket already connected",
          8: "Bad file number",
          9: "Trying to read unreadable message",
          10: "Mount device busy",
          11: "Operation canceled",
          12: "No children",
          13: "Connection aborted",
          14: "Connection refused",
          15: "Connection reset by peer",
          16: "File locking deadlock error",
          17: "Destination address required",
          18: "Math arg out of domain of func",
          19: "Quota exceeded",
          20: "File exists",
          21: "Bad address",
          22: "File too large",
          23: "Host is unreachable",
          24: "Identifier removed",
          25: "Illegal byte sequence",
          26: "Connection already in progress",
          27: "Interrupted system call",
          28: "Invalid argument",
          29: "I/O error",
          30: "Socket is already connected",
          31: "Is a directory",
          32: "Too many symbolic links",
          33: "Too many open files",
          34: "Too many links",
          35: "Message too long",
          36: "Multihop attempted",
          37: "File or path name too long",
          38: "Network interface is not configured",
          39: "Connection reset by network",
          40: "Network is unreachable",
          41: "Too many open files in system",
          42: "No buffer space available",
          43: "No such device",
          44: "No such file or directory",
          45: "Exec format error",
          46: "No record locks available",
          47: "The link has been severed",
          48: "Not enough core",
          49: "No message of desired type",
          50: "Protocol not available",
          51: "No space left on device",
          52: "Function not implemented",
          53: "Socket is not connected",
          54: "Not a directory",
          55: "Directory not empty",
          56: "State not recoverable",
          57: "Socket operation on non-socket",
          59: "Not a typewriter",
          60: "No such device or address",
          61: "Value too large for defined data type",
          62: "Previous owner died",
          63: "Not super-user",
          64: "Broken pipe",
          65: "Protocol error",
          66: "Unknown protocol",
          67: "Protocol wrong type for socket",
          68: "Math result not representable",
          69: "Read only file system",
          70: "Illegal seek",
          71: "No such process",
          72: "Stale file handle",
          73: "Connection timed out",
          74: "Text file busy",
          75: "Cross-device link",
          100: "Device not a stream",
          101: "Bad font file fmt",
          102: "Invalid slot",
          103: "Invalid request code",
          104: "No anode",
          105: "Block device required",
          106: "Channel number out of range",
          107: "Level 3 halted",
          108: "Level 3 reset",
          109: "Link number out of range",
          110: "Protocol driver not attached",
          111: "No CSI structure available",
          112: "Level 2 halted",
          113: "Invalid exchange",
          114: "Invalid request descriptor",
          115: "Exchange full",
          116: "No data (for no delay io)",
          117: "Timer expired",
          118: "Out of streams resources",
          119: "Machine is not on the network",
          120: "Package not installed",
          121: "The object is remote",
          122: "Advertise error",
          123: "Srmount error",
          124: "Communication error on send",
          125: "Cross mount point (not really error)",
          126: "Given log. name not unique",
          127: "f.d. invalid for this operation",
          128: "Remote address changed",
          129: "Can   access a needed shared lib",
          130: "Accessing a corrupted shared lib",
          131: ".lib section in a.out corrupted",
          132: "Attempting to link in too many libs",
          133: "Attempting to exec a shared library",
          135: "Streams pipe error",
          136: "Too many users",
          137: "Socket type not supported",
          138: "Not supported",
          139: "Protocol family not supported",
          140: "Can't send after socket shutdown",
          141: "Too many references",
          142: "Host is down",
          148: "No medium (in tape drive)",
          156: "Level 2 not synchronized"
        };
        var ERRNO_CODES = {
          "EPERM": 63,
          "ENOENT": 44,
          "ESRCH": 71,
          "EINTR": 27,
          "EIO": 29,
          "ENXIO": 60,
          "E2BIG": 1,
          "ENOEXEC": 45,
          "EBADF": 8,
          "ECHILD": 12,
          "EAGAIN": 6,
          "EWOULDBLOCK": 6,
          "ENOMEM": 48,
          "EACCES": 2,
          "EFAULT": 21,
          "ENOTBLK": 105,
          "EBUSY": 10,
          "EEXIST": 20,
          "EXDEV": 75,
          "ENODEV": 43,
          "ENOTDIR": 54,
          "EISDIR": 31,
          "EINVAL": 28,
          "ENFILE": 41,
          "EMFILE": 33,
          "ENOTTY": 59,
          "ETXTBSY": 74,
          "EFBIG": 22,
          "ENOSPC": 51,
          "ESPIPE": 70,
          "EROFS": 69,
          "EMLINK": 34,
          "EPIPE": 64,
          "EDOM": 18,
          "ERANGE": 68,
          "ENOMSG": 49,
          "EIDRM": 24,
          "ECHRNG": 106,
          "EL2NSYNC": 156,
          "EL3HLT": 107,
          "EL3RST": 108,
          "ELNRNG": 109,
          "EUNATCH": 110,
          "ENOCSI": 111,
          "EL2HLT": 112,
          "EDEADLK": 16,
          "ENOLCK": 46,
          "EBADE": 113,
          "EBADR": 114,
          "EXFULL": 115,
          "ENOANO": 104,
          "EBADRQC": 103,
          "EBADSLT": 102,
          "EDEADLOCK": 16,
          "EBFONT": 101,
          "ENOSTR": 100,
          "ENODATA": 116,
          "ETIME": 117,
          "ENOSR": 118,
          "ENONET": 119,
          "ENOPKG": 120,
          "EREMOTE": 121,
          "ENOLINK": 47,
          "EADV": 122,
          "ESRMNT": 123,
          "ECOMM": 124,
          "EPROTO": 65,
          "EMULTIHOP": 36,
          "EDOTDOT": 125,
          "EBADMSG": 9,
          "ENOTUNIQ": 126,
          "EBADFD": 127,
          "EREMCHG": 128,
          "ELIBACC": 129,
          "ELIBBAD": 130,
          "ELIBSCN": 131,
          "ELIBMAX": 132,
          "ELIBEXEC": 133,
          "ENOSYS": 52,
          "ENOTEMPTY": 55,
          "ENAMETOOLONG": 37,
          "ELOOP": 32,
          "EOPNOTSUPP": 138,
          "EPFNOSUPPORT": 139,
          "ECONNRESET": 15,
          "ENOBUFS": 42,
          "EAFNOSUPPORT": 5,
          "EPROTOTYPE": 67,
          "ENOTSOCK": 57,
          "ENOPROTOOPT": 50,
          "ESHUTDOWN": 140,
          "ECONNREFUSED": 14,
          "EADDRINUSE": 3,
          "ECONNABORTED": 13,
          "ENETUNREACH": 40,
          "ENETDOWN": 38,
          "ETIMEDOUT": 73,
          "EHOSTDOWN": 142,
          "EHOSTUNREACH": 23,
          "EINPROGRESS": 26,
          "EALREADY": 7,
          "EDESTADDRREQ": 17,
          "EMSGSIZE": 35,
          "EPROTONOSUPPORT": 66,
          "ESOCKTNOSUPPORT": 137,
          "EADDRNOTAVAIL": 4,
          "ENETRESET": 39,
          "EISCONN": 30,
          "ENOTCONN": 53,
          "ETOOMANYREFS": 141,
          "EUSERS": 136,
          "EDQUOT": 19,
          "ESTALE": 72,
          "ENOTSUP": 138,
          "ENOMEDIUM": 148,
          "EILSEQ": 25,
          "EOVERFLOW": 61,
          "ECANCELED": 11,
          "ENOTRECOVERABLE": 56,
          "EOWNERDEAD": 62,
          "ESTRPIPE": 135
        };
        var FS = {
          root: null,
          mounts: [],
          devices: {},
          streams: [],
          nextInode: 1,
          nameTable: null,
          currentPath: "/",
          initialized: false,
          ignorePermissions: true,
          ErrnoError: class extends Error {
            constructor(errno) {
              super(ERRNO_MESSAGES[errno]);
              this.name = "ErrnoError";
              this.errno = errno;
              for (var key in ERRNO_CODES) {
                if (ERRNO_CODES[key] === errno) {
                  this.code = key;
                  break;
                }
              }
            }
          },
          genericErrors: {},
          filesystems: null,
          syncFSRequests: 0,
          FSStream: class {
            constructor() {
              this.shared = {};
            }
            get object() {
              return this.node;
            }
            set object(val) {
              this.node = val;
            }
            get isRead() {
              return (this.flags & 2097155) !== 1;
            }
            get isWrite() {
              return (this.flags & 2097155) !== 0;
            }
            get isAppend() {
              return this.flags & 1024;
            }
            get flags() {
              return this.shared.flags;
            }
            set flags(val) {
              this.shared.flags = val;
            }
            get position() {
              return this.shared.position;
            }
            set position(val) {
              this.shared.position = val;
            }
          },
          FSNode: class {
            constructor(parent, name, mode, rdev) {
              if (!parent) {
                parent = this;
              }
              this.parent = parent;
              this.mount = parent.mount;
              this.mounted = null;
              this.id = FS.nextInode++;
              this.name = name;
              this.mode = mode;
              this.node_ops = {};
              this.stream_ops = {};
              this.rdev = rdev;
              this.readMode = 292 | /*292*/
              73;
              this.writeMode = 146;
            }
            /*146*/
            get read() {
              return (this.mode & this.readMode) === this.readMode;
            }
            set read(val) {
              val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
            }
            get write() {
              return (this.mode & this.writeMode) === this.writeMode;
            }
            set write(val) {
              val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
            }
            get isFolder() {
              return FS.isDir(this.mode);
            }
            get isDevice() {
              return FS.isChrdev(this.mode);
            }
          },
          lookupPath(path, opts = {}) {
            path = PATH_FS.resolve(path);
            if (!path)
              return {
                path: "",
                node: null
              };
            var defaults = {
              follow_mount: true,
              recurse_count: 0
            };
            opts = Object.assign(defaults, opts);
            if (opts.recurse_count > 8) {
              throw new FS.ErrnoError(32);
            }
            var parts = path.split("/").filter((p) => !!p);
            var current = FS.root;
            var current_path = "/";
            for (var i = 0; i < parts.length; i++) {
              var islast = i === parts.length - 1;
              if (islast && opts.parent) {
                break;
              }
              current = FS.lookupNode(current, parts[i]);
              current_path = PATH.join2(current_path, parts[i]);
              if (FS.isMountpoint(current)) {
                if (!islast || islast && opts.follow_mount) {
                  current = current.mounted.root;
                }
              }
              if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                  var link = FS.readlink(current_path);
                  current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                  var lookup = FS.lookupPath(current_path, {
                    recurse_count: opts.recurse_count + 1
                  });
                  current = lookup.node;
                  if (count++ > 40) {
                    throw new FS.ErrnoError(32);
                  }
                }
              }
            }
            return {
              path: current_path,
              node: current
            };
          },
          getPath(node) {
            var path;
            while (true) {
              if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path)
                  return mount;
                return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
              }
              path = path ? `${node.name}/${path}` : node.name;
              node = node.parent;
            }
          },
          hashName(parentid, name) {
            var hash = 0;
            for (var i = 0; i < name.length; i++) {
              hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
            }
            return (parentid + hash >>> 0) % FS.nameTable.length;
          },
          hashAddNode(node) {
            var hash = FS.hashName(node.parent.id, node.name);
            node.name_next = FS.nameTable[hash];
            FS.nameTable[hash] = node;
          },
          hashRemoveNode(node) {
            var hash = FS.hashName(node.parent.id, node.name);
            if (FS.nameTable[hash] === node) {
              FS.nameTable[hash] = node.name_next;
            } else {
              var current = FS.nameTable[hash];
              while (current) {
                if (current.name_next === node) {
                  current.name_next = node.name_next;
                  break;
                }
                current = current.name_next;
              }
            }
          },
          lookupNode(parent, name) {
            var errCode = FS.mayLookup(parent);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            var hash = FS.hashName(parent.id, name);
            for (var node = FS.nameTable[hash]; node; node = node.name_next) {
              var nodeName = node.name;
              if (node.parent.id === parent.id && nodeName === name) {
                return node;
              }
            }
            return FS.lookup(parent, name);
          },
          createNode(parent, name, mode, rdev) {
            assert(typeof parent == "object");
            var node = new FS.FSNode(parent, name, mode, rdev);
            FS.hashAddNode(node);
            return node;
          },
          destroyNode(node) {
            FS.hashRemoveNode(node);
          },
          isRoot(node) {
            return node === node.parent;
          },
          isMountpoint(node) {
            return !!node.mounted;
          },
          isFile(mode) {
            return (mode & 61440) === 32768;
          },
          isDir(mode) {
            return (mode & 61440) === 16384;
          },
          isLink(mode) {
            return (mode & 61440) === 40960;
          },
          isChrdev(mode) {
            return (mode & 61440) === 8192;
          },
          isBlkdev(mode) {
            return (mode & 61440) === 24576;
          },
          isFIFO(mode) {
            return (mode & 61440) === 4096;
          },
          isSocket(mode) {
            return (mode & 49152) === 49152;
          },
          flagsToPermissionString(flag) {
            var perms = ["r", "w", "rw"][flag & 3];
            if (flag & 512) {
              perms += "w";
            }
            return perms;
          },
          nodePermissions(node, perms) {
            if (FS.ignorePermissions) {
              return 0;
            }
            if (perms.includes("r") && !(node.mode & 292)) {
              return 2;
            } else if (perms.includes("w") && !(node.mode & 146)) {
              return 2;
            } else if (perms.includes("x") && !(node.mode & 73)) {
              return 2;
            }
            return 0;
          },
          mayLookup(dir) {
            if (!FS.isDir(dir.mode))
              return 54;
            var errCode = FS.nodePermissions(dir, "x");
            if (errCode)
              return errCode;
            if (!dir.node_ops.lookup)
              return 2;
            return 0;
          },
          mayCreate(dir, name) {
            try {
              var node = FS.lookupNode(dir, name);
              return 20;
            } catch (e) {
            }
            return FS.nodePermissions(dir, "wx");
          },
          mayDelete(dir, name, isdir) {
            var node;
            try {
              node = FS.lookupNode(dir, name);
            } catch (e) {
              return e.errno;
            }
            var errCode = FS.nodePermissions(dir, "wx");
            if (errCode) {
              return errCode;
            }
            if (isdir) {
              if (!FS.isDir(node.mode)) {
                return 54;
              }
              if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 10;
              }
            } else {
              if (FS.isDir(node.mode)) {
                return 31;
              }
            }
            return 0;
          },
          mayOpen(node, flags) {
            if (!node) {
              return 44;
            }
            if (FS.isLink(node.mode)) {
              return 32;
            } else if (FS.isDir(node.mode)) {
              if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                return 31;
              }
            }
            return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
          },
          MAX_OPEN_FDS: 4096,
          nextfd() {
            for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
              if (!FS.streams[fd]) {
                return fd;
              }
            }
            throw new FS.ErrnoError(33);
          },
          getStreamChecked(fd) {
            var stream = FS.getStream(fd);
            if (!stream) {
              throw new FS.ErrnoError(8);
            }
            return stream;
          },
          getStream: (fd) => FS.streams[fd],
          createStream(stream, fd = -1) {
            stream = Object.assign(new FS.FSStream(), stream);
            if (fd == -1) {
              fd = FS.nextfd();
            }
            stream.fd = fd;
            FS.streams[fd] = stream;
            return stream;
          },
          closeStream(fd) {
            FS.streams[fd] = null;
          },
          dupStream(origStream, fd = -1) {
            var stream = FS.createStream(origStream, fd);
            stream.stream_ops?.dup?.(stream);
            return stream;
          },
          chrdev_stream_ops: {
            open(stream) {
              var device = FS.getDevice(stream.node.rdev);
              stream.stream_ops = device.stream_ops;
              stream.stream_ops.open?.(stream);
            },
            llseek() {
              throw new FS.ErrnoError(70);
            }
          },
          major: (dev) => dev >> 8,
          minor: (dev) => dev & 255,
          makedev: (ma, mi) => ma << 8 | mi,
          registerDevice(dev, ops) {
            FS.devices[dev] = {
              stream_ops: ops
            };
          },
          getDevice: (dev) => FS.devices[dev],
          getMounts(mount) {
            var mounts = [];
            var check = [mount];
            while (check.length) {
              var m = check.pop();
              mounts.push(m);
              check.push(...m.mounts);
            }
            return mounts;
          },
          syncfs(populate, callback) {
            if (typeof populate == "function") {
              callback = populate;
              populate = false;
            }
            FS.syncFSRequests++;
            if (FS.syncFSRequests > 1) {
              err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
            }
            var mounts = FS.getMounts(FS.root.mount);
            var completed = 0;
            function doCallback(errCode) {
              assert(FS.syncFSRequests > 0);
              FS.syncFSRequests--;
              return callback(errCode);
            }
            function done(errCode) {
              if (errCode) {
                if (!done.errored) {
                  done.errored = true;
                  return doCallback(errCode);
                }
                return;
              }
              if (++completed >= mounts.length) {
                doCallback(null);
              }
            }
            mounts.forEach((mount) => {
              if (!mount.type.syncfs) {
                return done(null);
              }
              mount.type.syncfs(mount, populate, done);
            });
          },
          mount(type, opts, mountpoint) {
            if (typeof type == "string") {
              throw type;
            }
            var root = mountpoint === "/";
            var pseudo = !mountpoint;
            var node;
            if (root && FS.root) {
              throw new FS.ErrnoError(10);
            } else if (!root && !pseudo) {
              var lookup = FS.lookupPath(mountpoint, {
                follow_mount: false
              });
              mountpoint = lookup.path;
              node = lookup.node;
              if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
              }
              if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54);
              }
            }
            var mount = {
              type,
              opts,
              mountpoint,
              mounts: []
            };
            var mountRoot = type.mount(mount);
            mountRoot.mount = mount;
            mount.root = mountRoot;
            if (root) {
              FS.root = mountRoot;
            } else if (node) {
              node.mounted = mount;
              if (node.mount) {
                node.mount.mounts.push(mount);
              }
            }
            return mountRoot;
          },
          unmount(mountpoint) {
            var lookup = FS.lookupPath(mountpoint, {
              follow_mount: false
            });
            if (!FS.isMountpoint(lookup.node)) {
              throw new FS.ErrnoError(28);
            }
            var node = lookup.node;
            var mount = node.mounted;
            var mounts = FS.getMounts(mount);
            Object.keys(FS.nameTable).forEach((hash) => {
              var current = FS.nameTable[hash];
              while (current) {
                var next = current.name_next;
                if (mounts.includes(current.mount)) {
                  FS.destroyNode(current);
                }
                current = next;
              }
            });
            node.mounted = null;
            var idx = node.mount.mounts.indexOf(mount);
            assert(idx !== -1);
            node.mount.mounts.splice(idx, 1);
          },
          lookup(parent, name) {
            return parent.node_ops.lookup(parent, name);
          },
          mknod(path, mode, dev) {
            var lookup = FS.lookupPath(path, {
              parent: true
            });
            var parent = lookup.node;
            var name = PATH.basename(path);
            if (!name || name === "." || name === "..") {
              throw new FS.ErrnoError(28);
            }
            var errCode = FS.mayCreate(parent, name);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.mknod) {
              throw new FS.ErrnoError(63);
            }
            return parent.node_ops.mknod(parent, name, mode, dev);
          },
          create(path, mode) {
            mode = mode !== void 0 ? mode : 438;
            mode &= 4095;
            mode |= 32768;
            return FS.mknod(path, mode, 0);
          },
          mkdir(path, mode) {
            mode = mode !== void 0 ? mode : 511;
            mode &= 511 | 512;
            mode |= 16384;
            return FS.mknod(path, mode, 0);
          },
          mkdirTree(path, mode) {
            var dirs = path.split("/");
            var d = "";
            for (var i = 0; i < dirs.length; ++i) {
              if (!dirs[i])
                continue;
              d += "/" + dirs[i];
              try {
                FS.mkdir(d, mode);
              } catch (e) {
                if (e.errno != 20)
                  throw e;
              }
            }
          },
          mkdev(path, mode, dev) {
            if (typeof dev == "undefined") {
              dev = mode;
              mode = 438;
            }
            mode |= 8192;
            return FS.mknod(path, mode, dev);
          },
          symlink(oldpath, newpath) {
            if (!PATH_FS.resolve(oldpath)) {
              throw new FS.ErrnoError(44);
            }
            var lookup = FS.lookupPath(newpath, {
              parent: true
            });
            var parent = lookup.node;
            if (!parent) {
              throw new FS.ErrnoError(44);
            }
            var newname = PATH.basename(newpath);
            var errCode = FS.mayCreate(parent, newname);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.symlink) {
              throw new FS.ErrnoError(63);
            }
            return parent.node_ops.symlink(parent, newname, oldpath);
          },
          rename(old_path, new_path) {
            var old_dirname = PATH.dirname(old_path);
            var new_dirname = PATH.dirname(new_path);
            var old_name = PATH.basename(old_path);
            var new_name = PATH.basename(new_path);
            var lookup, old_dir, new_dir;
            lookup = FS.lookupPath(old_path, {
              parent: true
            });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, {
              parent: true
            });
            new_dir = lookup.node;
            if (!old_dir || !new_dir)
              throw new FS.ErrnoError(44);
            if (old_dir.mount !== new_dir.mount) {
              throw new FS.ErrnoError(75);
            }
            var old_node = FS.lookupNode(old_dir, old_name);
            var relative = PATH_FS.relative(old_path, new_dirname);
            if (relative.charAt(0) !== ".") {
              throw new FS.ErrnoError(28);
            }
            relative = PATH_FS.relative(new_path, old_dirname);
            if (relative.charAt(0) !== ".") {
              throw new FS.ErrnoError(55);
            }
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (old_node === new_node) {
              return;
            }
            var isdir = FS.isDir(old_node.mode);
            var errCode = FS.mayDelete(old_dir, old_name, isdir);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!old_dir.node_ops.rename) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
              throw new FS.ErrnoError(10);
            }
            if (new_dir !== old_dir) {
              errCode = FS.nodePermissions(old_dir, "w");
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
            }
            FS.hashRemoveNode(old_node);
            try {
              old_dir.node_ops.rename(old_node, new_dir, new_name);
            } catch (e) {
              throw e;
            } finally {
              FS.hashAddNode(old_node);
            }
          },
          rmdir(path) {
            var lookup = FS.lookupPath(path, {
              parent: true
            });
            var parent = lookup.node;
            var name = PATH.basename(path);
            var node = FS.lookupNode(parent, name);
            var errCode = FS.mayDelete(parent, name, true);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.rmdir) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            parent.node_ops.rmdir(parent, name);
            FS.destroyNode(node);
          },
          readdir(path) {
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            var node = lookup.node;
            if (!node.node_ops.readdir) {
              throw new FS.ErrnoError(54);
            }
            return node.node_ops.readdir(node);
          },
          unlink(path) {
            var lookup = FS.lookupPath(path, {
              parent: true
            });
            var parent = lookup.node;
            if (!parent) {
              throw new FS.ErrnoError(44);
            }
            var name = PATH.basename(path);
            var node = FS.lookupNode(parent, name);
            var errCode = FS.mayDelete(parent, name, false);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.unlink) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            parent.node_ops.unlink(parent, name);
            FS.destroyNode(node);
          },
          readlink(path) {
            var lookup = FS.lookupPath(path);
            var link = lookup.node;
            if (!link) {
              throw new FS.ErrnoError(44);
            }
            if (!link.node_ops.readlink) {
              throw new FS.ErrnoError(28);
            }
            return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
          },
          stat(path, dontFollow) {
            var lookup = FS.lookupPath(path, {
              follow: !dontFollow
            });
            var node = lookup.node;
            if (!node) {
              throw new FS.ErrnoError(44);
            }
            if (!node.node_ops.getattr) {
              throw new FS.ErrnoError(63);
            }
            return node.node_ops.getattr(node);
          },
          lstat(path) {
            return FS.stat(path, true);
          },
          chmod(path, mode, dontFollow) {
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, {
                follow: !dontFollow
              });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            node.node_ops.setattr(node, {
              mode: mode & 4095 | node.mode & ~4095,
              timestamp: Date.now()
            });
          },
          lchmod(path, mode) {
            FS.chmod(path, mode, true);
          },
          fchmod(fd, mode) {
            var stream = FS.getStreamChecked(fd);
            FS.chmod(stream.node, mode);
          },
          chown(path, uid, gid, dontFollow) {
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, {
                follow: !dontFollow
              });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            node.node_ops.setattr(node, {
              timestamp: Date.now()
            });
          },
          lchown(path, uid, gid) {
            FS.chown(path, uid, gid, true);
          },
          fchown(fd, uid, gid) {
            var stream = FS.getStreamChecked(fd);
            FS.chown(stream.node, uid, gid);
          },
          truncate(path, len) {
            if (len < 0) {
              throw new FS.ErrnoError(28);
            }
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, {
                follow: true
              });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isDir(node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!FS.isFile(node.mode)) {
              throw new FS.ErrnoError(28);
            }
            var errCode = FS.nodePermissions(node, "w");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            node.node_ops.setattr(node, {
              size: len,
              timestamp: Date.now()
            });
          },
          ftruncate(fd, len) {
            var stream = FS.getStreamChecked(fd);
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(28);
            }
            FS.truncate(stream.node, len);
          },
          utime(path, atime, mtime) {
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            var node = lookup.node;
            node.node_ops.setattr(node, {
              timestamp: Math.max(atime, mtime)
            });
          },
          open(path, flags, mode) {
            if (path === "") {
              throw new FS.ErrnoError(44);
            }
            flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
            mode = typeof mode == "undefined" ? 438 : (
              /* 0666 */
              mode
            );
            if (flags & 64) {
              mode = mode & 4095 | 32768;
            } else {
              mode = 0;
            }
            var node;
            if (typeof path == "object") {
              node = path;
            } else {
              path = PATH.normalize(path);
              try {
                var lookup = FS.lookupPath(path, {
                  follow: !(flags & 131072)
                });
                node = lookup.node;
              } catch (e) {
              }
            }
            var created = false;
            if (flags & 64) {
              if (node) {
                if (flags & 128) {
                  throw new FS.ErrnoError(20);
                }
              } else {
                node = FS.mknod(path, mode, 0);
                created = true;
              }
            }
            if (!node) {
              throw new FS.ErrnoError(44);
            }
            if (FS.isChrdev(node.mode)) {
              flags &= ~512;
            }
            if (flags & 65536 && !FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54);
            }
            if (!created) {
              var errCode = FS.mayOpen(node, flags);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
            }
            if (flags & 512 && !created) {
              FS.truncate(node, 0);
            }
            flags &= ~(128 | 512 | 131072);
            var stream = FS.createStream({
              node,
              path: FS.getPath(node),
              flags,
              seekable: true,
              position: 0,
              stream_ops: node.stream_ops,
              ungotten: [],
              error: false
            });
            if (stream.stream_ops.open) {
              stream.stream_ops.open(stream);
            }
            if (Module2["logReadFiles"] && !(flags & 1)) {
              if (!FS.readFiles)
                FS.readFiles = {};
              if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1;
              }
            }
            return stream;
          },
          close(stream) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (stream.getdents)
              stream.getdents = null;
            try {
              if (stream.stream_ops.close) {
                stream.stream_ops.close(stream);
              }
            } catch (e) {
              throw e;
            } finally {
              FS.closeStream(stream.fd);
            }
            stream.fd = null;
          },
          isClosed(stream) {
            return stream.fd === null;
          },
          llseek(stream, offset, whence) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (!stream.seekable || !stream.stream_ops.llseek) {
              throw new FS.ErrnoError(70);
            }
            if (whence != 0 && whence != 1 && whence != 2) {
              throw new FS.ErrnoError(28);
            }
            stream.position = stream.stream_ops.llseek(stream, offset, whence);
            stream.ungotten = [];
            return stream.position;
          },
          read(stream, buffer, offset, length, position) {
            assert(offset >= 0);
            if (length < 0 || position < 0) {
              throw new FS.ErrnoError(28);
            }
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 1) {
              throw new FS.ErrnoError(8);
            }
            if (FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!stream.stream_ops.read) {
              throw new FS.ErrnoError(28);
            }
            var seeking = typeof position != "undefined";
            if (!seeking) {
              position = stream.position;
            } else if (!stream.seekable) {
              throw new FS.ErrnoError(70);
            }
            var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
            if (!seeking)
              stream.position += bytesRead;
            return bytesRead;
          },
          write(stream, buffer, offset, length, position, canOwn) {
            assert(offset >= 0);
            if (length < 0 || position < 0) {
              throw new FS.ErrnoError(28);
            }
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(8);
            }
            if (FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!stream.stream_ops.write) {
              throw new FS.ErrnoError(28);
            }
            if (stream.seekable && stream.flags & 1024) {
              FS.llseek(stream, 0, 2);
            }
            var seeking = typeof position != "undefined";
            if (!seeking) {
              position = stream.position;
            } else if (!stream.seekable) {
              throw new FS.ErrnoError(70);
            }
            var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
            if (!seeking)
              stream.position += bytesWritten;
            return bytesWritten;
          },
          allocate(stream, offset, length) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (offset < 0 || length <= 0) {
              throw new FS.ErrnoError(28);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(8);
            }
            if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            if (!stream.stream_ops.allocate) {
              throw new FS.ErrnoError(138);
            }
            stream.stream_ops.allocate(stream, offset, length);
          },
          mmap(stream, length, position, prot, flags) {
            if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
              throw new FS.ErrnoError(2);
            }
            if ((stream.flags & 2097155) === 1) {
              throw new FS.ErrnoError(2);
            }
            if (!stream.stream_ops.mmap) {
              throw new FS.ErrnoError(43);
            }
            return stream.stream_ops.mmap(stream, length, position, prot, flags);
          },
          msync(stream, buffer, offset, length, mmapFlags) {
            assert(offset >= 0);
            if (!stream.stream_ops.msync) {
              return 0;
            }
            return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
          },
          ioctl(stream, cmd, arg) {
            if (!stream.stream_ops.ioctl) {
              throw new FS.ErrnoError(59);
            }
            return stream.stream_ops.ioctl(stream, cmd, arg);
          },
          readFile(path, opts = {}) {
            opts.flags = opts.flags || 0;
            opts.encoding = opts.encoding || "binary";
            if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
              throw new Error(`Invalid encoding type "${opts.encoding}"`);
            }
            var ret;
            var stream = FS.open(path, opts.flags);
            var stat = FS.stat(path);
            var length = stat.size;
            var buf = new Uint8Array(length);
            FS.read(stream, buf, 0, length, 0);
            if (opts.encoding === "utf8") {
              ret = UTF8ArrayToString(buf, 0);
            } else if (opts.encoding === "binary") {
              ret = buf;
            }
            FS.close(stream);
            return ret;
          },
          writeFile(path, data, opts = {}) {
            opts.flags = opts.flags || 577;
            var stream = FS.open(path, opts.flags, opts.mode);
            if (typeof data == "string") {
              var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
              var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
              FS.write(stream, buf, 0, actualNumBytes, void 0, opts.canOwn);
            } else if (ArrayBuffer.isView(data)) {
              FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
            } else {
              throw new Error("Unsupported data type");
            }
            FS.close(stream);
          },
          cwd: () => FS.currentPath,
          chdir(path) {
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            if (lookup.node === null) {
              throw new FS.ErrnoError(44);
            }
            if (!FS.isDir(lookup.node.mode)) {
              throw new FS.ErrnoError(54);
            }
            var errCode = FS.nodePermissions(lookup.node, "x");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            FS.currentPath = lookup.path;
          },
          createDefaultDirectories() {
            FS.mkdir("/tmp");
            FS.mkdir("/home");
            FS.mkdir("/home/web_user");
          },
          createDefaultDevices() {
            FS.mkdir("/dev");
            FS.registerDevice(FS.makedev(1, 3), {
              read: () => 0,
              write: (stream, buffer, offset, length, pos) => length
            });
            FS.mkdev("/dev/null", FS.makedev(1, 3));
            TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
            TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
            FS.mkdev("/dev/tty", FS.makedev(5, 0));
            FS.mkdev("/dev/tty1", FS.makedev(6, 0));
            var randomBuffer = new Uint8Array(1024), randomLeft = 0;
            var randomByte = () => {
              if (randomLeft === 0) {
                randomLeft = randomFill(randomBuffer).byteLength;
              }
              return randomBuffer[--randomLeft];
            };
            FS.createDevice("/dev", "random", randomByte);
            FS.createDevice("/dev", "urandom", randomByte);
            FS.mkdir("/dev/shm");
            FS.mkdir("/dev/shm/tmp");
          },
          createSpecialDirectories() {
            FS.mkdir("/proc");
            var proc_self = FS.mkdir("/proc/self");
            FS.mkdir("/proc/self/fd");
            FS.mount({
              mount() {
                var node = FS.createNode(
                  proc_self,
                  "fd",
                  16384 | 511,
                  /* 0777 */
                  73
                );
                node.node_ops = {
                  lookup(parent, name) {
                    var fd = +name;
                    var stream = FS.getStreamChecked(fd);
                    var ret = {
                      parent: null,
                      mount: {
                        mountpoint: "fake"
                      },
                      node_ops: {
                        readlink: () => stream.path
                      }
                    };
                    ret.parent = ret;
                    return ret;
                  }
                };
                return node;
              }
            }, {}, "/proc/self/fd");
          },
          createStandardStreams() {
            if (Module2["stdin"]) {
              FS.createDevice("/dev", "stdin", Module2["stdin"]);
            } else {
              FS.symlink("/dev/tty", "/dev/stdin");
            }
            if (Module2["stdout"]) {
              FS.createDevice("/dev", "stdout", null, Module2["stdout"]);
            } else {
              FS.symlink("/dev/tty", "/dev/stdout");
            }
            if (Module2["stderr"]) {
              FS.createDevice("/dev", "stderr", null, Module2["stderr"]);
            } else {
              FS.symlink("/dev/tty1", "/dev/stderr");
            }
            var stdin = FS.open("/dev/stdin", 0);
            var stdout = FS.open("/dev/stdout", 1);
            var stderr = FS.open("/dev/stderr", 1);
            assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
            assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
            assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
          },
          staticInit() {
            [44].forEach((code) => {
              FS.genericErrors[code] = new FS.ErrnoError(code);
              FS.genericErrors[code].stack = "<generic error, no stack>";
            });
            FS.nameTable = new Array(4096);
            FS.mount(MEMFS, {}, "/");
            FS.createDefaultDirectories();
            FS.createDefaultDevices();
            FS.createSpecialDirectories();
            FS.filesystems = {
              "MEMFS": MEMFS
            };
          },
          init(input, output, error) {
            assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
            FS.init.initialized = true;
            Module2["stdin"] = input || Module2["stdin"];
            Module2["stdout"] = output || Module2["stdout"];
            Module2["stderr"] = error || Module2["stderr"];
            FS.createStandardStreams();
          },
          quit() {
            FS.init.initialized = false;
            _fflush(0);
            for (var i = 0; i < FS.streams.length; i++) {
              var stream = FS.streams[i];
              if (!stream) {
                continue;
              }
              FS.close(stream);
            }
          },
          findObject(path, dontResolveLastLink) {
            var ret = FS.analyzePath(path, dontResolveLastLink);
            if (!ret.exists) {
              return null;
            }
            return ret.object;
          },
          analyzePath(path, dontResolveLastLink) {
            try {
              var lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
              });
              path = lookup.path;
            } catch (e) {
            }
            var ret = {
              isRoot: false,
              exists: false,
              error: 0,
              name: null,
              path: null,
              object: null,
              parentExists: false,
              parentPath: null,
              parentObject: null
            };
            try {
              var lookup = FS.lookupPath(path, {
                parent: true
              });
              ret.parentExists = true;
              ret.parentPath = lookup.path;
              ret.parentObject = lookup.node;
              ret.name = PATH.basename(path);
              lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
              });
              ret.exists = true;
              ret.path = lookup.path;
              ret.object = lookup.node;
              ret.name = lookup.node.name;
              ret.isRoot = lookup.path === "/";
            } catch (e) {
              ret.error = e.errno;
            }
            return ret;
          },
          createPath(parent, path, canRead, canWrite) {
            parent = typeof parent == "string" ? parent : FS.getPath(parent);
            var parts = path.split("/").reverse();
            while (parts.length) {
              var part = parts.pop();
              if (!part)
                continue;
              var current = PATH.join2(parent, part);
              try {
                FS.mkdir(current);
              } catch (e) {
              }
              parent = current;
            }
            return current;
          },
          createFile(parent, name, properties, canRead, canWrite) {
            var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
            var mode = FS_getMode(canRead, canWrite);
            return FS.create(path, mode);
          },
          createDataFile(parent, name, data, canRead, canWrite, canOwn) {
            var path = name;
            if (parent) {
              parent = typeof parent == "string" ? parent : FS.getPath(parent);
              path = name ? PATH.join2(parent, name) : parent;
            }
            var mode = FS_getMode(canRead, canWrite);
            var node = FS.create(path, mode);
            if (data) {
              if (typeof data == "string") {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i)
                  arr[i] = data.charCodeAt(i);
                data = arr;
              }
              FS.chmod(node, mode | 146);
              var stream = FS.open(node, 577);
              FS.write(stream, data, 0, data.length, 0, canOwn);
              FS.close(stream);
              FS.chmod(node, mode);
            }
          },
          createDevice(parent, name, input, output) {
            var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
            var mode = FS_getMode(!!input, !!output);
            if (!FS.createDevice.major)
              FS.createDevice.major = 64;
            var dev = FS.makedev(FS.createDevice.major++, 0);
            FS.registerDevice(dev, {
              open(stream) {
                stream.seekable = false;
              },
              close(stream) {
                if (output?.buffer?.length) {
                  output(10);
                }
              },
              read(stream, buffer, offset, length, pos) {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                  var result;
                  try {
                    result = input();
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                  if (result === void 0 && bytesRead === 0) {
                    throw new FS.ErrnoError(6);
                  }
                  if (result === null || result === void 0)
                    break;
                  bytesRead++;
                  buffer[offset + i] = result;
                }
                if (bytesRead) {
                  stream.node.timestamp = Date.now();
                }
                return bytesRead;
              },
              write(stream, buffer, offset, length, pos) {
                for (var i = 0; i < length; i++) {
                  try {
                    output(buffer[offset + i]);
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                }
                if (length) {
                  stream.node.timestamp = Date.now();
                }
                return i;
              }
            });
            return FS.mkdev(path, mode, dev);
          },
          forceLoadFile(obj) {
            if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
              return true;
            if (typeof XMLHttpRequest != "undefined") {
              throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
            } else if (read_) {
              try {
                obj.contents = intArrayFromString(read_(obj.url), true);
                obj.usedBytes = obj.contents.length;
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            } else {
              throw new Error("Cannot load without read() or XMLHttpRequest.");
            }
          },
          createLazyFile(parent, name, url, canRead, canWrite) {
            class LazyUint8Array {
              constructor() {
                this.lengthKnown = false;
                this.chunks = [];
              }
              get(idx) {
                if (idx > this.length - 1 || idx < 0) {
                  return void 0;
                }
                var chunkOffset = idx % this.chunkSize;
                var chunkNum = idx / this.chunkSize | 0;
                return this.getter(chunkNum)[chunkOffset];
              }
              setDataGetter(getter) {
                this.getter = getter;
              }
              cacheLength() {
                var xhr = new XMLHttpRequest();
                xhr.open("HEAD", url, false);
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                  throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                var datalength = Number(xhr.getResponseHeader("Content-length"));
                var header;
                var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
                var chunkSize = 1024 * 1024;
                if (!hasByteServing)
                  chunkSize = datalength;
                var doXHR = (from, to) => {
                  if (from > to)
                    throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                  if (to > datalength - 1)
                    throw new Error("only " + datalength + " bytes available! programmer error!");
                  var xhr2 = new XMLHttpRequest();
                  xhr2.open("GET", url, false);
                  if (datalength !== chunkSize)
                    xhr2.setRequestHeader("Range", "bytes=" + from + "-" + to);
                  xhr2.responseType = "arraybuffer";
                  if (xhr2.overrideMimeType) {
                    xhr2.overrideMimeType("text/plain; charset=x-user-defined");
                  }
                  xhr2.send(null);
                  if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304))
                    throw new Error("Couldn't load " + url + ". Status: " + xhr2.status);
                  if (xhr2.response !== void 0) {
                    return new Uint8Array(
                      /** @type{Array<number>} */
                      xhr2.response || []
                    );
                  }
                  return intArrayFromString(xhr2.responseText || "", true);
                };
                var lazyArray2 = this;
                lazyArray2.setDataGetter((chunkNum) => {
                  var start = chunkNum * chunkSize;
                  var end = (chunkNum + 1) * chunkSize - 1;
                  end = Math.min(end, datalength - 1);
                  if (typeof lazyArray2.chunks[chunkNum] == "undefined") {
                    lazyArray2.chunks[chunkNum] = doXHR(start, end);
                  }
                  if (typeof lazyArray2.chunks[chunkNum] == "undefined")
                    throw new Error("doXHR failed!");
                  return lazyArray2.chunks[chunkNum];
                });
                if (usesGzip || !datalength) {
                  chunkSize = datalength = 1;
                  datalength = this.getter(0).length;
                  chunkSize = datalength;
                  out("LazyFiles on gzip forces download of the whole file when length is accessed");
                }
                this._length = datalength;
                this._chunkSize = chunkSize;
                this.lengthKnown = true;
              }
              get length() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
              get chunkSize() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
            if (typeof XMLHttpRequest != "undefined") {
              if (!ENVIRONMENT_IS_WORKER)
                throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
              var lazyArray = new LazyUint8Array();
              var properties = {
                isDevice: false,
                contents: lazyArray
              };
            } else {
              var properties = {
                isDevice: false,
                url
              };
            }
            var node = FS.createFile(parent, name, properties, canRead, canWrite);
            if (properties.contents) {
              node.contents = properties.contents;
            } else if (properties.url) {
              node.contents = null;
              node.url = properties.url;
            }
            Object.defineProperties(node, {
              usedBytes: {
                get: function() {
                  return this.contents.length;
                }
              }
            });
            var stream_ops = {};
            var keys = Object.keys(node.stream_ops);
            keys.forEach((key) => {
              var fn = node.stream_ops[key];
              stream_ops[key] = (...args) => {
                FS.forceLoadFile(node);
                return fn(...args);
              };
            });
            function writeChunks(stream, buffer, offset, length, position) {
              var contents = stream.node.contents;
              if (position >= contents.length)
                return 0;
              var size = Math.min(contents.length - position, length);
              assert(size >= 0);
              if (contents.slice) {
                for (var i = 0; i < size; i++) {
                  buffer[offset + i] = contents[position + i];
                }
              } else {
                for (var i = 0; i < size; i++) {
                  buffer[offset + i] = contents.get(position + i);
                }
              }
              return size;
            }
            stream_ops.read = (stream, buffer, offset, length, position) => {
              FS.forceLoadFile(node);
              return writeChunks(stream, buffer, offset, length, position);
            };
            stream_ops.mmap = (stream, length, position, prot, flags) => {
              FS.forceLoadFile(node);
              var ptr = mmapAlloc(length);
              if (!ptr) {
                throw new FS.ErrnoError(48);
              }
              writeChunks(stream, HEAP8, ptr, length, position);
              return {
                ptr,
                allocated: true
              };
            };
            node.stream_ops = stream_ops;
            return node;
          },
          absolutePath() {
            abort("FS.absolutePath has been removed; use PATH_FS.resolve instead");
          },
          createFolder() {
            abort("FS.createFolder has been removed; use FS.mkdir instead");
          },
          createLink() {
            abort("FS.createLink has been removed; use FS.symlink instead");
          },
          joinPath() {
            abort("FS.joinPath has been removed; use PATH.join instead");
          },
          mmapAlloc() {
            abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
          },
          standardizePath() {
            abort("FS.standardizePath has been removed; use PATH.normalize instead");
          }
        };
        var SYSCALLS = {
          DEFAULT_POLLMASK: 5,
          calculateAt(dirfd, path, allowEmpty) {
            if (PATH.isAbs(path)) {
              return path;
            }
            var dir;
            if (dirfd === -100) {
              dir = FS.cwd();
            } else {
              var dirstream = SYSCALLS.getStreamFromFD(dirfd);
              dir = dirstream.path;
            }
            if (path.length == 0) {
              if (!allowEmpty) {
                throw new FS.ErrnoError(44);
              }
              return dir;
            }
            return PATH.join2(dir, path);
          },
          doStat(func, path, buf) {
            var stat = func(path);
            HEAP32[buf >>> 2 >>> 0] = stat.dev;
            HEAP32[buf + 4 >>> 2 >>> 0] = stat.mode;
            HEAPU32[buf + 8 >>> 2 >>> 0] = stat.nlink;
            HEAP32[buf + 12 >>> 2 >>> 0] = stat.uid;
            HEAP32[buf + 16 >>> 2 >>> 0] = stat.gid;
            HEAP32[buf + 20 >>> 2 >>> 0] = stat.rdev;
            tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 24 >>> 2 >>> 0] = tempI64[0], HEAP32[buf + 28 >>> 2 >>> 0] = tempI64[1];
            HEAP32[buf + 32 >>> 2 >>> 0] = 4096;
            HEAP32[buf + 36 >>> 2 >>> 0] = stat.blocks;
            var atime = stat.atime.getTime();
            var mtime = stat.mtime.getTime();
            var ctime = stat.ctime.getTime();
            tempI64 = [Math.floor(atime / 1e3) >>> 0, (tempDouble = Math.floor(atime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >>> 2 >>> 0] = tempI64[0], HEAP32[buf + 44 >>> 2 >>> 0] = tempI64[1];
            HEAPU32[buf + 48 >>> 2 >>> 0] = atime % 1e3 * 1e3;
            tempI64 = [Math.floor(mtime / 1e3) >>> 0, (tempDouble = Math.floor(mtime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 56 >>> 2 >>> 0] = tempI64[0], HEAP32[buf + 60 >>> 2 >>> 0] = tempI64[1];
            HEAPU32[buf + 64 >>> 2 >>> 0] = mtime % 1e3 * 1e3;
            tempI64 = [Math.floor(ctime / 1e3) >>> 0, (tempDouble = Math.floor(ctime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 72 >>> 2 >>> 0] = tempI64[0], HEAP32[buf + 76 >>> 2 >>> 0] = tempI64[1];
            HEAPU32[buf + 80 >>> 2 >>> 0] = ctime % 1e3 * 1e3;
            tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 88 >>> 2 >>> 0] = tempI64[0], HEAP32[buf + 92 >>> 2 >>> 0] = tempI64[1];
            return 0;
          },
          doMsync(addr, stream, len, flags, offset) {
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            if (flags & 2) {
              return 0;
            }
            var buffer = HEAPU8.slice(addr, addr + len);
            FS.msync(stream, buffer, offset, len, flags);
          },
          getStreamFromFD(fd) {
            var stream = FS.getStreamChecked(fd);
            return stream;
          },
          varargs: void 0,
          getStr(ptr) {
            var ret = UTF8ToString(ptr);
            return ret;
          }
        };
        function ___syscall_chmod(path, mode) {
          try {
            path = SYSCALLS.getStr(path);
            FS.chmod(path, mode);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_dup3(fd, newfd, flags) {
          try {
            var old = SYSCALLS.getStreamFromFD(fd);
            assert(!flags);
            if (old.fd === newfd)
              return -28;
            var existing = FS.getStream(newfd);
            if (existing)
              FS.close(existing);
            return FS.dupStream(old, newfd).fd;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_faccessat(dirfd, path, amode, flags) {
          try {
            path = SYSCALLS.getStr(path);
            assert(flags === 0);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (amode & ~7) {
              return -28;
            }
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            var node = lookup.node;
            if (!node) {
              return -44;
            }
            var perms = "";
            if (amode & 4)
              perms += "r";
            if (amode & 2)
              perms += "w";
            if (amode & 1)
              perms += "x";
            if (perms && /* otherwise, they've just passed F_OK */
            FS.nodePermissions(node, perms)) {
              return -2;
            }
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fchmod(fd, mode) {
          try {
            FS.fchmod(fd, mode);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fchown32(fd, owner, group) {
          try {
            FS.fchown(fd, owner, group);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function syscallGetVarargI() {
          assert(SYSCALLS.varargs != void 0);
          var ret = HEAP32[+SYSCALLS.varargs >>> 2 >>> 0];
          SYSCALLS.varargs += 4;
          return ret;
        }
        var syscallGetVarargP = syscallGetVarargI;
        function ___syscall_fcntl64(fd, cmd, varargs) {
          varargs >>>= 0;
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (cmd) {
              case 0: {
                var arg = syscallGetVarargI();
                if (arg < 0) {
                  return -28;
                }
                while (FS.streams[arg]) {
                  arg++;
                }
                var newStream;
                newStream = FS.dupStream(stream, arg);
                return newStream.fd;
              }
              case 1:
              case 2:
                return 0;
              case 3:
                return stream.flags;
              case 4: {
                var arg = syscallGetVarargI();
                stream.flags |= arg;
                return 0;
              }
              case 12: {
                var arg = syscallGetVarargP();
                var offset = 0;
                HEAP16[arg + offset >>> 1 >>> 0] = 2;
                return 0;
              }
              case 13:
              case 14:
                return 0;
            }
            return -28;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fstat64(fd, buf) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            return SYSCALLS.doStat(FS.stat, stream.path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var convertI32PairToI53Checked = (lo, hi) => {
          assert(lo == lo >>> 0 || lo == (lo | 0));
          assert(hi === (hi | 0));
          return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
        };
        function ___syscall_ftruncate64(fd, length_low, length_high) {
          var length = convertI32PairToI53Checked(length_low, length_high);
          try {
            if (isNaN(length))
              return 61;
            FS.ftruncate(fd, length);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
          assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        };
        function ___syscall_getcwd(buf, size) {
          try {
            if (size === 0)
              return -28;
            var cwd = FS.cwd();
            var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
            if (size < cwdLengthInBytes)
              return -68;
            stringToUTF8(cwd, buf, size);
            return cwdLengthInBytes;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_ioctl(fd, op, varargs) {
          varargs >>>= 0;
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (op) {
              case 21509: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              case 21505: {
                if (!stream.tty)
                  return -59;
                if (stream.tty.ops.ioctl_tcgets) {
                  var termios = stream.tty.ops.ioctl_tcgets(stream);
                  var argp = syscallGetVarargP();
                  HEAP32[argp >>> 2 >>> 0] = termios.c_iflag || 0;
                  HEAP32[argp + 4 >>> 2 >>> 0] = termios.c_oflag || 0;
                  HEAP32[argp + 8 >>> 2 >>> 0] = termios.c_cflag || 0;
                  HEAP32[argp + 12 >>> 2 >>> 0] = termios.c_lflag || 0;
                  for (var i = 0; i < 32; i++) {
                    HEAP8[argp + i + 17 >>> 0] = termios.c_cc[i] || 0;
                  }
                  return 0;
                }
                return 0;
              }
              case 21510:
              case 21511:
              case 21512: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              case 21506:
              case 21507:
              case 21508: {
                if (!stream.tty)
                  return -59;
                if (stream.tty.ops.ioctl_tcsets) {
                  var argp = syscallGetVarargP();
                  var c_iflag = HEAP32[argp >>> 2 >>> 0];
                  var c_oflag = HEAP32[argp + 4 >>> 2 >>> 0];
                  var c_cflag = HEAP32[argp + 8 >>> 2 >>> 0];
                  var c_lflag = HEAP32[argp + 12 >>> 2 >>> 0];
                  var c_cc = [];
                  for (var i = 0; i < 32; i++) {
                    c_cc.push(HEAP8[argp + i + 17 >>> 0]);
                  }
                  return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
                    c_iflag,
                    c_oflag,
                    c_cflag,
                    c_lflag,
                    c_cc
                  });
                }
                return 0;
              }
              case 21519: {
                if (!stream.tty)
                  return -59;
                var argp = syscallGetVarargP();
                HEAP32[argp >>> 2 >>> 0] = 0;
                return 0;
              }
              case 21520: {
                if (!stream.tty)
                  return -59;
                return -28;
              }
              case 21531: {
                var argp = syscallGetVarargP();
                return FS.ioctl(stream, op, argp);
              }
              case 21523: {
                if (!stream.tty)
                  return -59;
                if (stream.tty.ops.ioctl_tiocgwinsz) {
                  var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
                  var argp = syscallGetVarargP();
                  HEAP16[argp >>> 1 >>> 0] = winsize[0];
                  HEAP16[argp + 2 >>> 1 >>> 0] = winsize[1];
                }
                return 0;
              }
              case 21524: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              case 21515: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              default:
                return -28;
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_lstat64(path, buf) {
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.lstat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_mkdirat(dirfd, path, mode) {
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            path = PATH.normalize(path);
            if (path[path.length - 1] === "/")
              path = path.substr(0, path.length - 1);
            FS.mkdir(path, mode, 0);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_newfstatat(dirfd, path, buf, flags) {
          try {
            path = SYSCALLS.getStr(path);
            var nofollow = flags & 256;
            var allowEmpty = flags & 4096;
            flags = flags & ~6400;
            assert(!flags, `unknown flags in __syscall_newfstatat: ${flags}`);
            path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
            return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_openat(dirfd, path, flags, varargs) {
          path >>>= 0;
          varargs >>>= 0;
          SYSCALLS.varargs = varargs;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            var mode = varargs ? syscallGetVarargI() : 0;
            return FS.open(path, flags, mode).fd;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
          assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        };
        function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
          path >>>= 0;
          buf >>>= 0;
          bufsize >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (bufsize <= 0)
              return -28;
            var ret = FS.readlink(path);
            var len = Math.min(bufsize, lengthBytesUTF8(ret));
            var endChar = HEAP8[buf + len >>> 0];
            stringToUTF8(ret, buf, bufsize + 1);
            HEAP8[buf + len >>> 0] = endChar;
            return len;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
          oldpath >>>= 0;
          newpath >>>= 0;
          try {
            oldpath = SYSCALLS.getStr(oldpath);
            newpath = SYSCALLS.getStr(newpath);
            oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
            newpath = SYSCALLS.calculateAt(newdirfd, newpath);
            FS.rename(oldpath, newpath);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_rmdir(path) {
          path >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            FS.rmdir(path);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_stat64(path, buf) {
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.stat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_unlinkat(dirfd, path, flags) {
          path >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (flags === 0) {
              FS.unlink(path);
            } else if (flags === 512) {
              FS.rmdir(path);
            } else {
              abort("Invalid flags passed to unlinkat");
            }
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var readI53FromI64 = (ptr) => HEAPU32[ptr >> 2] + HEAP32[ptr + 4 >> 2] * 4294967296;
        function ___syscall_utimensat(dirfd, path, times, flags) {
          try {
            path = SYSCALLS.getStr(path);
            assert(flags === 0);
            path = SYSCALLS.calculateAt(dirfd, path, true);
            if (!times) {
              var atime = Date.now();
              var mtime = atime;
            } else {
              var seconds = readI53FromI64(times);
              var nanoseconds = HEAP32[times + 8 >> 2];
              atime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
              times += 16;
              seconds = readI53FromI64(times);
              nanoseconds = HEAP32[times + 8 >> 2];
              mtime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
            }
            FS.utime(path, atime, mtime);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var __abort_js = () => {
          abort("native code called abort()");
        };
        var nowIsMonotonic = 1;
        var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;
        function __emscripten_memcpy_js(dest, src, num) {
          dest >>>= 0;
          src >>>= 0;
          num >>>= 0;
          return HEAPU8.copyWithin(dest >>> 0, src >>> 0, src + num >>> 0);
        }
        function __emscripten_system(command) {
          command >>>= 0;
          if (ENVIRONMENT_IS_NODE) {
            if (!command)
              return 1;
            var cmdstr = UTF8ToString(command);
            if (!cmdstr.length)
              return 0;
            var cp = require("child_process");
            var ret = cp.spawnSync(cmdstr, [], {
              shell: true,
              stdio: "inherit"
            });
            var _W_EXITCODE = (ret2, sig) => ret2 << 8 | sig;
            if (ret.status === null) {
              var signalToNumber = (sig) => {
                switch (sig) {
                  case "SIGHUP":
                    return 1;
                  case "SIGINT":
                    return 2;
                  case "SIGQUIT":
                    return 3;
                  case "SIGFPE":
                    return 8;
                  case "SIGKILL":
                    return 9;
                  case "SIGALRM":
                    return 14;
                  case "SIGTERM":
                    return 15;
                }
                return 2;
              };
              return _W_EXITCODE(0, signalToNumber(ret.signal));
            }
            return _W_EXITCODE(ret.status, 0);
          }
          if (!command)
            return 0;
          return -52;
        }
        var __emscripten_throw_longjmp = () => {
          throw Infinity;
        };
        function __gmtime_js(time_low, time_high, tmPtr) {
          var time = convertI32PairToI53Checked(time_low, time_high);
          tmPtr >>>= 0;
          var date = new Date(time * 1e3);
          HEAP32[tmPtr >>> 2 >>> 0] = date.getUTCSeconds();
          HEAP32[tmPtr + 4 >>> 2 >>> 0] = date.getUTCMinutes();
          HEAP32[tmPtr + 8 >>> 2 >>> 0] = date.getUTCHours();
          HEAP32[tmPtr + 12 >>> 2 >>> 0] = date.getUTCDate();
          HEAP32[tmPtr + 16 >>> 2 >>> 0] = date.getUTCMonth();
          HEAP32[tmPtr + 20 >>> 2 >>> 0] = date.getUTCFullYear() - 1900;
          HEAP32[tmPtr + 24 >>> 2 >>> 0] = date.getUTCDay();
          var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
          var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
          HEAP32[tmPtr + 28 >>> 2 >>> 0] = yday;
        }
        var isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
        var MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var ydayFromDate = (date) => {
          var leap = isLeapYear(date.getFullYear());
          var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
          var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
          return yday;
        };
        function __localtime_js(time_low, time_high, tmPtr) {
          var time = convertI32PairToI53Checked(time_low, time_high);
          tmPtr >>>= 0;
          var date = new Date(time * 1e3);
          HEAP32[tmPtr >>> 2 >>> 0] = date.getSeconds();
          HEAP32[tmPtr + 4 >>> 2 >>> 0] = date.getMinutes();
          HEAP32[tmPtr + 8 >>> 2 >>> 0] = date.getHours();
          HEAP32[tmPtr + 12 >>> 2 >>> 0] = date.getDate();
          HEAP32[tmPtr + 16 >>> 2 >>> 0] = date.getMonth();
          HEAP32[tmPtr + 20 >>> 2 >>> 0] = date.getFullYear() - 1900;
          HEAP32[tmPtr + 24 >>> 2 >>> 0] = date.getDay();
          var yday = ydayFromDate(date) | 0;
          HEAP32[tmPtr + 28 >>> 2 >>> 0] = yday;
          HEAP32[tmPtr + 36 >>> 2 >>> 0] = -(date.getTimezoneOffset() * 60);
          var start = new Date(date.getFullYear(), 0, 1);
          var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
          var winterOffset = start.getTimezoneOffset();
          var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
          HEAP32[tmPtr + 32 >>> 2 >>> 0] = dst;
        }
        var setTempRet0 = (val) => __emscripten_tempret_set(val);
        var __mktime_js = function(tmPtr) {
          tmPtr >>>= 0;
          var ret = (() => {
            var date = new Date(HEAP32[tmPtr + 20 >>> 2 >>> 0] + 1900, HEAP32[tmPtr + 16 >>> 2 >>> 0], HEAP32[tmPtr + 12 >>> 2 >>> 0], HEAP32[tmPtr + 8 >>> 2 >>> 0], HEAP32[tmPtr + 4 >>> 2 >>> 0], HEAP32[tmPtr >>> 2 >>> 0], 0);
            var dst = HEAP32[tmPtr + 32 >>> 2 >>> 0];
            var guessedOffset = date.getTimezoneOffset();
            var start = new Date(date.getFullYear(), 0, 1);
            var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
            var winterOffset = start.getTimezoneOffset();
            var dstOffset = Math.min(winterOffset, summerOffset);
            if (dst < 0) {
              HEAP32[tmPtr + 32 >>> 2 >>> 0] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
            } else if (dst > 0 != (dstOffset == guessedOffset)) {
              var nonDstOffset = Math.max(winterOffset, summerOffset);
              var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
              date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
            }
            HEAP32[tmPtr + 24 >>> 2 >>> 0] = date.getDay();
            var yday = ydayFromDate(date) | 0;
            HEAP32[tmPtr + 28 >>> 2 >>> 0] = yday;
            HEAP32[tmPtr >>> 2 >>> 0] = date.getSeconds();
            HEAP32[tmPtr + 4 >>> 2 >>> 0] = date.getMinutes();
            HEAP32[tmPtr + 8 >>> 2 >>> 0] = date.getHours();
            HEAP32[tmPtr + 12 >>> 2 >>> 0] = date.getDate();
            HEAP32[tmPtr + 16 >>> 2 >>> 0] = date.getMonth();
            HEAP32[tmPtr + 20 >>> 2 >>> 0] = date.getYear();
            var timeMs = date.getTime();
            if (isNaN(timeMs)) {
              return -1;
            }
            return timeMs / 1e3;
          })();
          return setTempRet0((tempDouble = ret, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)), ret >>> 0;
        };
        function __munmap_js(addr, len, prot, flags, fd, offset_low, offset_high) {
          var offset = convertI32PairToI53Checked(offset_low, offset_high);
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            if (prot & 2) {
              SYSCALLS.doMsync(addr, stream, len, flags, offset);
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var __tzset_js = function(timezone, daylight, std_name, dst_name) {
          timezone >>>= 0;
          daylight >>>= 0;
          std_name >>>= 0;
          dst_name >>>= 0;
          var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
          var winter = new Date(currentYear, 0, 1);
          var summer = new Date(currentYear, 6, 1);
          var winterOffset = winter.getTimezoneOffset();
          var summerOffset = summer.getTimezoneOffset();
          var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
          HEAPU32[timezone >>> 2 >>> 0] = stdTimezoneOffset * 60;
          HEAP32[daylight >>> 2 >>> 0] = Number(winterOffset != summerOffset);
          var extractZone = (date) => date.toLocaleTimeString(void 0, {
            hour12: false,
            timeZoneName: "short"
          }).split(" ")[1];
          var winterName = extractZone(winter);
          var summerName = extractZone(summer);
          assert(winterName);
          assert(summerName);
          assert(lengthBytesUTF8(winterName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${winterName})`);
          assert(lengthBytesUTF8(summerName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${summerName})`);
          if (summerOffset < winterOffset) {
            stringToUTF8(winterName, std_name, 17);
            stringToUTF8(summerName, dst_name, 17);
          } else {
            stringToUTF8(winterName, dst_name, 17);
            stringToUTF8(summerName, std_name, 17);
          }
        };
        var _emscripten_date_now = () => Date.now();
        var getHeapMax = () => 4294901760;
        function _emscripten_get_heap_max() {
          return getHeapMax();
        }
        var _emscripten_get_now;
        _emscripten_get_now = () => deterministicNow();
        var growMemory = (size) => {
          var b = wasmMemory.buffer;
          var pages = (size - b.byteLength + 65535) / 65536;
          try {
            wasmMemory.grow(pages);
            updateMemoryViews();
            return 1;
          } catch (e) {
            err(`growMemory: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`);
          }
        };
        function _emscripten_resize_heap(requestedSize) {
          requestedSize >>>= 0;
          var oldSize = HEAPU8.length;
          assert(requestedSize > oldSize);
          var maxHeapSize = getHeapMax();
          if (requestedSize > maxHeapSize) {
            err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
            return false;
          }
          var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
          for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
            var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
            var replacement = growMemory(newSize);
            if (replacement) {
              return true;
            }
          }
          err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
          return false;
        }
        var ENV = {};
        var getExecutableName = () => thisProgram || "./this.program";
        var getEnvStrings = () => {
          if (!getEnvStrings.strings) {
            var lang = "C.UTF-8";
            var env = {
              "USER": "web_user",
              "LOGNAME": "web_user",
              "PATH": "/",
              "PWD": "/",
              "HOME": "/home/web_user",
              "LANG": lang,
              "_": getExecutableName()
            };
            for (var x in ENV) {
              if (ENV[x] === void 0)
                delete env[x];
              else
                env[x] = ENV[x];
            }
            var strings = [];
            for (var x in env) {
              strings.push(`${x}=${env[x]}`);
            }
            getEnvStrings.strings = strings;
          }
          return getEnvStrings.strings;
        };
        var stringToAscii = (str, buffer) => {
          for (var i = 0; i < str.length; ++i) {
            assert(str.charCodeAt(i) === (str.charCodeAt(i) & 255));
            HEAP8[buffer++ >>> 0] = str.charCodeAt(i);
          }
          HEAP8[buffer >>> 0] = 0;
        };
        var _environ_get = function(__environ, environ_buf) {
          __environ >>>= 0;
          environ_buf >>>= 0;
          var bufSize = 0;
          getEnvStrings().forEach((string, i) => {
            var ptr = environ_buf + bufSize;
            HEAPU32[__environ + i * 4 >>> 2 >>> 0] = ptr;
            stringToAscii(string, ptr);
            bufSize += string.length + 1;
          });
          return 0;
        };
        var _environ_sizes_get = function(penviron_count, penviron_buf_size) {
          penviron_count >>>= 0;
          penviron_buf_size >>>= 0;
          var strings = getEnvStrings();
          HEAPU32[penviron_count >>> 2 >>> 0] = strings.length;
          var bufSize = 0;
          strings.forEach((string) => bufSize += string.length + 1);
          HEAPU32[penviron_buf_size >>> 2 >>> 0] = bufSize;
          return 0;
        };
        var runtimeKeepaliveCounter = 0;
        var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
        var _proc_exit = (code) => {
          EXITSTATUS = code;
          if (!keepRuntimeAlive()) {
            Module2["onExit"]?.(code);
            ABORT = true;
          }
          quit_(code, new ExitStatus(code));
        };
        var exitJS = (status, implicit) => {
          EXITSTATUS = status;
          checkUnflushedContent();
          if (keepRuntimeAlive() && !implicit) {
            var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
            readyPromiseReject(msg);
            err(msg);
          }
          _proc_exit(status);
        };
        var _exit = exitJS;
        function _fd_close(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.close(stream);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        function _fd_fdstat_get(fd, pbuf) {
          try {
            var rightsBase = 0;
            var rightsInheriting = 0;
            var flags = 0;
            {
              var stream = SYSCALLS.getStreamFromFD(fd);
              var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
            }
            HEAP8[pbuf] = type;
            HEAP16[pbuf + 2 >> 1] = flags;
            tempI64 = [rightsBase >>> 0, (tempDouble = rightsBase, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[pbuf + 8 >> 2] = tempI64[0], HEAP32[pbuf + 12 >> 2] = tempI64[1];
            tempI64 = [rightsInheriting >>> 0, (tempDouble = rightsInheriting, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[pbuf + 16 >> 2] = tempI64[0], HEAP32[pbuf + 20 >> 2] = tempI64[1];
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        var doReadv = (stream, iov, iovcnt, offset) => {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >>> 2 >>> 0];
            var len = HEAPU32[iov + 4 >>> 2 >>> 0];
            iov += 8;
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
              return -1;
            ret += curr;
            if (curr < len)
              break;
            if (typeof offset != "undefined") {
              offset += curr;
            }
          }
          return ret;
        };
        function _fd_read(fd, iov, iovcnt, pnum) {
          iov >>>= 0;
          iovcnt >>>= 0;
          pnum >>>= 0;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doReadv(stream, iov, iovcnt);
            HEAPU32[pnum >>> 2 >>> 0] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
          var offset = convertI32PairToI53Checked(offset_low, offset_high);
          newOffset >>>= 0;
          try {
            if (isNaN(offset))
              return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.llseek(stream, offset, whence);
            tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >>> 2 >>> 0] = tempI64[0], HEAP32[newOffset + 4 >>> 2 >>> 0] = tempI64[1];
            if (stream.getdents && offset === 0 && whence === 0)
              stream.getdents = null;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        var _fd_sync = function(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            return Asyncify.handleSleep((wakeUp) => {
              var mount = stream.node.mount;
              if (!mount.type.syncfs) {
                wakeUp(0);
                return;
              }
              mount.type.syncfs(mount, false, (err2) => {
                if (err2) {
                  wakeUp(29);
                  return;
                }
                wakeUp(0);
              });
            });
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        };
        _fd_sync.isAsync = true;
        var doWritev = (stream, iov, iovcnt, offset) => {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >>> 2 >>> 0];
            var len = HEAPU32[iov + 4 >>> 2 >>> 0];
            iov += 8;
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
              return -1;
            ret += curr;
            if (typeof offset != "undefined") {
              offset += curr;
            }
          }
          return ret;
        };
        function _fd_write(fd, iov, iovcnt, pnum) {
          iov >>>= 0;
          iovcnt >>>= 0;
          pnum >>>= 0;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doWritev(stream, iov, iovcnt);
            HEAPU32[pnum >>> 2 >>> 0] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        var arraySum = (array, index) => {
          var sum = 0;
          for (var i = 0; i <= index; sum += array[i++]) {
          }
          return sum;
        };
        var MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var addDays = (date, days) => {
          var newDate = new Date(date.getTime());
          while (days > 0) {
            var leap = isLeapYear(newDate.getFullYear());
            var currentMonth = newDate.getMonth();
            var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
            if (days > daysInCurrentMonth - newDate.getDate()) {
              days -= daysInCurrentMonth - newDate.getDate() + 1;
              newDate.setDate(1);
              if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1);
              } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1);
              }
            } else {
              newDate.setDate(newDate.getDate() + days);
              return newDate;
            }
          }
          return newDate;
        };
        var writeArrayToMemory = (array, buffer) => {
          assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
          HEAP8.set(array, buffer >>> 0);
        };
        function _strftime(s, maxsize, format, tm) {
          s >>>= 0;
          maxsize >>>= 0;
          format >>>= 0;
          tm >>>= 0;
          var tm_zone = HEAPU32[tm + 40 >>> 2 >>> 0];
          var date = {
            tm_sec: HEAP32[tm >>> 2 >>> 0],
            tm_min: HEAP32[tm + 4 >>> 2 >>> 0],
            tm_hour: HEAP32[tm + 8 >>> 2 >>> 0],
            tm_mday: HEAP32[tm + 12 >>> 2 >>> 0],
            tm_mon: HEAP32[tm + 16 >>> 2 >>> 0],
            tm_year: HEAP32[tm + 20 >>> 2 >>> 0],
            tm_wday: HEAP32[tm + 24 >>> 2 >>> 0],
            tm_yday: HEAP32[tm + 28 >>> 2 >>> 0],
            tm_isdst: HEAP32[tm + 32 >>> 2 >>> 0],
            tm_gmtoff: HEAP32[tm + 36 >>> 2 >>> 0],
            tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
          };
          var pattern = UTF8ToString(format);
          var EXPANSION_RULES_1 = {
            "%c": "%a %b %d %H:%M:%S %Y",
            "%D": "%m/%d/%y",
            "%F": "%Y-%m-%d",
            "%h": "%b",
            "%r": "%I:%M:%S %p",
            "%R": "%H:%M",
            "%T": "%H:%M:%S",
            "%x": "%m/%d/%y",
            "%X": "%H:%M:%S",
            "%Ec": "%c",
            "%EC": "%C",
            "%Ex": "%m/%d/%y",
            "%EX": "%H:%M:%S",
            "%Ey": "%y",
            "%EY": "%Y",
            "%Od": "%d",
            "%Oe": "%e",
            "%OH": "%H",
            "%OI": "%I",
            "%Om": "%m",
            "%OM": "%M",
            "%OS": "%S",
            "%Ou": "%u",
            "%OU": "%U",
            "%OV": "%V",
            "%Ow": "%w",
            "%OW": "%W",
            "%Oy": "%y"
          };
          for (var rule in EXPANSION_RULES_1) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
          }
          var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          function leadingSomething(value, digits, character) {
            var str = typeof value == "number" ? value.toString() : value || "";
            while (str.length < digits) {
              str = character[0] + str;
            }
            return str;
          }
          function leadingNulls(value, digits) {
            return leadingSomething(value, digits, "0");
          }
          function compareByDay(date1, date2) {
            function sgn(value) {
              return value < 0 ? -1 : value > 0 ? 1 : 0;
            }
            var compare;
            if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
              if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate());
              }
            }
            return compare;
          }
          function getFirstWeekStartDate(janFourth) {
            switch (janFourth.getDay()) {
              case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
              case 1:
                return janFourth;
              case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
              case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
              case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
              case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
              case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30);
            }
          }
          function getWeekBasedYear(date2) {
            var thisDate = addDays(new Date(date2.tm_year + 1900, 0, 1), date2.tm_yday);
            var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
            var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
              if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1;
              }
              return thisDate.getFullYear();
            }
            return thisDate.getFullYear() - 1;
          }
          var EXPANSION_RULES_2 = {
            "%a": (date2) => WEEKDAYS[date2.tm_wday].substring(0, 3),
            "%A": (date2) => WEEKDAYS[date2.tm_wday],
            "%b": (date2) => MONTHS[date2.tm_mon].substring(0, 3),
            "%B": (date2) => MONTHS[date2.tm_mon],
            "%C": (date2) => {
              var year = date2.tm_year + 1900;
              return leadingNulls(year / 100 | 0, 2);
            },
            "%d": (date2) => leadingNulls(date2.tm_mday, 2),
            "%e": (date2) => leadingSomething(date2.tm_mday, 2, " "),
            "%g": (date2) => getWeekBasedYear(date2).toString().substring(2),
            "%G": getWeekBasedYear,
            "%H": (date2) => leadingNulls(date2.tm_hour, 2),
            "%I": (date2) => {
              var twelveHour = date2.tm_hour;
              if (twelveHour == 0)
                twelveHour = 12;
              else if (twelveHour > 12)
                twelveHour -= 12;
              return leadingNulls(twelveHour, 2);
            },
            "%j": (date2) => leadingNulls(date2.tm_mday + arraySum(isLeapYear(date2.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date2.tm_mon - 1), 3),
            "%m": (date2) => leadingNulls(date2.tm_mon + 1, 2),
            "%M": (date2) => leadingNulls(date2.tm_min, 2),
            "%n": () => "\n",
            "%p": (date2) => {
              if (date2.tm_hour >= 0 && date2.tm_hour < 12) {
                return "AM";
              }
              return "PM";
            },
            "%S": (date2) => leadingNulls(date2.tm_sec, 2),
            "%t": () => "	",
            "%u": (date2) => date2.tm_wday || 7,
            "%U": (date2) => {
              var days = date2.tm_yday + 7 - date2.tm_wday;
              return leadingNulls(Math.floor(days / 7), 2);
            },
            "%V": (date2) => {
              var val = Math.floor((date2.tm_yday + 7 - (date2.tm_wday + 6) % 7) / 7);
              if ((date2.tm_wday + 371 - date2.tm_yday - 2) % 7 <= 2) {
                val++;
              }
              if (!val) {
                val = 52;
                var dec31 = (date2.tm_wday + 7 - date2.tm_yday - 1) % 7;
                if (dec31 == 4 || dec31 == 5 && isLeapYear(date2.tm_year % 400 - 1)) {
                  val++;
                }
              } else if (val == 53) {
                var jan1 = (date2.tm_wday + 371 - date2.tm_yday) % 7;
                if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date2.tm_year)))
                  val = 1;
              }
              return leadingNulls(val, 2);
            },
            "%w": (date2) => date2.tm_wday,
            "%W": (date2) => {
              var days = date2.tm_yday + 7 - (date2.tm_wday + 6) % 7;
              return leadingNulls(Math.floor(days / 7), 2);
            },
            "%y": (date2) => (date2.tm_year + 1900).toString().substring(2),
            "%Y": (date2) => date2.tm_year + 1900,
            "%z": (date2) => {
              var off = date2.tm_gmtoff;
              var ahead = off >= 0;
              off = Math.abs(off) / 60;
              off = off / 60 * 100 + off % 60;
              return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
            },
            "%Z": (date2) => date2.tm_zone,
            "%%": () => "%"
          };
          pattern = pattern.replace(/%%/g, "\0\0");
          for (var rule in EXPANSION_RULES_2) {
            if (pattern.includes(rule)) {
              pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
            }
          }
          pattern = pattern.replace(/\0\0/g, "%");
          var bytes = intArrayFromString(pattern, false);
          if (bytes.length > maxsize) {
            return 0;
          }
          writeArrayToMemory(bytes, s);
          return bytes.length - 1;
        }
        function _strftime_l(s, maxsize, format, tm, loc) {
          s >>>= 0;
          maxsize >>>= 0;
          format >>>= 0;
          tm >>>= 0;
          loc >>>= 0;
          return _strftime(s, maxsize, format, tm);
        }
        var wasmTableMirror = [];
        var wasmTable;
        var runAndAbortIfError = (func) => {
          try {
            return func();
          } catch (e) {
            abort(e);
          }
        };
        var handleException = (e) => {
          if (e instanceof ExitStatus || e == "unwind") {
            return EXITSTATUS;
          }
          checkStackCookie();
          if (e instanceof WebAssembly.RuntimeError) {
            if (_emscripten_stack_get_current() <= 0) {
              err("Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 100663296)");
            }
          }
          quit_(1, e);
        };
        var maybeExit = () => {
          if (!keepRuntimeAlive()) {
            try {
              _exit(EXITSTATUS);
            } catch (e) {
              handleException(e);
            }
          }
        };
        var callUserCallback = (func) => {
          if (ABORT) {
            err("user callback triggered after runtime exited or application aborted.  Ignoring.");
            return;
          }
          try {
            func();
            maybeExit();
          } catch (e) {
            handleException(e);
          }
        };
        var runtimeKeepalivePush = () => {
          runtimeKeepaliveCounter += 1;
        };
        var runtimeKeepalivePop = () => {
          assert(runtimeKeepaliveCounter > 0);
          runtimeKeepaliveCounter -= 1;
        };
        var Asyncify = {
          instrumentWasmImports(imports) {
            var importPattern = /^(invoke_.*|__asyncjs__.*)$/;
            for (let [x, original] of Object.entries(imports)) {
              if (typeof original == "function") {
                let isAsyncifyImport = original.isAsync || importPattern.test(x);
                imports[x] = (...args) => {
                  var originalAsyncifyState = Asyncify.state;
                  try {
                    return original(...args);
                  } finally {
                    var changedToDisabled = originalAsyncifyState === Asyncify.State.Normal && Asyncify.state === Asyncify.State.Disabled;
                    var ignoredInvoke = x.startsWith("invoke_") && true;
                    if (Asyncify.state !== originalAsyncifyState && !isAsyncifyImport && !changedToDisabled && !ignoredInvoke) {
                      throw new Error(`import ${x} was not in ASYNCIFY_IMPORTS, but changed the state`);
                    }
                  }
                };
              }
            }
          },
          instrumentWasmExports(exports3) {
            var ret = {};
            for (let [x, original] of Object.entries(exports3)) {
              if (typeof original == "function") {
                ret[x] = (...args) => {
                  Asyncify.exportCallStack.push(x);
                  try {
                    return original(...args);
                  } finally {
                    if (!ABORT) {
                      var y = Asyncify.exportCallStack.pop();
                      assert(y === x);
                      Asyncify.maybeStopUnwind();
                    }
                  }
                };
              } else {
                ret[x] = original;
              }
            }
            return ret;
          },
          State: {
            Normal: 0,
            Unwinding: 1,
            Rewinding: 2,
            Disabled: 3
          },
          state: 0,
          StackSize: 100663296,
          currData: null,
          handleSleepReturnValue: 0,
          exportCallStack: [],
          callStackNameToId: {},
          callStackIdToName: {},
          callStackId: 0,
          asyncPromiseHandlers: null,
          sleepCallbacks: [],
          getCallStackId(funcName) {
            var id = Asyncify.callStackNameToId[funcName];
            if (id === void 0) {
              id = Asyncify.callStackId++;
              Asyncify.callStackNameToId[funcName] = id;
              Asyncify.callStackIdToName[id] = funcName;
            }
            return id;
          },
          maybeStopUnwind() {
            if (Asyncify.currData && Asyncify.state === Asyncify.State.Unwinding && Asyncify.exportCallStack.length === 0) {
              Asyncify.state = Asyncify.State.Normal;
              runAndAbortIfError(_asyncify_stop_unwind);
              if (typeof Fibers != "undefined") {
                Fibers.trampoline();
              }
            }
          },
          whenDone() {
            assert(Asyncify.currData, "Tried to wait for an async operation when none is in progress.");
            assert(!Asyncify.asyncPromiseHandlers, "Cannot have multiple async operations in flight at once");
            return new Promise((resolve, reject) => {
              Asyncify.asyncPromiseHandlers = {
                resolve,
                reject
              };
            });
          },
          allocateData() {
            var ptr = _malloc(12 + Asyncify.StackSize);
            Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
            Asyncify.setDataRewindFunc(ptr);
            return ptr;
          },
          setDataHeader(ptr, stack, stackSize) {
            HEAPU32[ptr >>> 2 >>> 0] = stack;
            HEAPU32[ptr + 4 >>> 2 >>> 0] = stack + stackSize;
          },
          setDataRewindFunc(ptr) {
            var bottomOfCallStack = Asyncify.exportCallStack[0];
            var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
            HEAP32[ptr + 8 >>> 2 >>> 0] = rewindId;
          },
          getDataRewindFunc(ptr) {
            var id = HEAP32[ptr + 8 >>> 2 >>> 0];
            var name = Asyncify.callStackIdToName[id];
            var func = wasmExports[name];
            return func;
          },
          doRewind(ptr) {
            var start = Asyncify.getDataRewindFunc(ptr);
            return start();
          },
          handleSleep(startAsync) {
            assert(Asyncify.state !== Asyncify.State.Disabled, "Asyncify cannot be done during or after the runtime exits");
            if (ABORT)
              return;
            if (Asyncify.state === Asyncify.State.Normal) {
              var reachedCallback = false;
              var reachedAfterCallback = false;
              startAsync((handleSleepReturnValue = 0) => {
                assert(!handleSleepReturnValue || typeof handleSleepReturnValue == "number" || typeof handleSleepReturnValue == "boolean");
                if (ABORT)
                  return;
                Asyncify.handleSleepReturnValue = handleSleepReturnValue;
                reachedCallback = true;
                if (!reachedAfterCallback) {
                  return;
                }
                assert(!Asyncify.exportCallStack.length, "Waking up (starting to rewind) must be done from JS, without compiled code on the stack.");
                Asyncify.state = Asyncify.State.Rewinding;
                runAndAbortIfError(() => _asyncify_start_rewind(Asyncify.currData));
                if (typeof Browser != "undefined" && Browser.mainLoop.func) {
                  Browser.mainLoop.resume();
                }
                var asyncWasmReturnValue, isError = false;
                try {
                  asyncWasmReturnValue = Asyncify.doRewind(Asyncify.currData);
                } catch (err2) {
                  asyncWasmReturnValue = err2;
                  isError = true;
                }
                var handled = false;
                if (!Asyncify.currData) {
                  var asyncPromiseHandlers = Asyncify.asyncPromiseHandlers;
                  if (asyncPromiseHandlers) {
                    Asyncify.asyncPromiseHandlers = null;
                    (isError ? asyncPromiseHandlers.reject : asyncPromiseHandlers.resolve)(asyncWasmReturnValue);
                    handled = true;
                  }
                }
                if (isError && !handled) {
                  throw asyncWasmReturnValue;
                }
              });
              reachedAfterCallback = true;
              if (!reachedCallback) {
                Asyncify.state = Asyncify.State.Unwinding;
                Asyncify.currData = Asyncify.allocateData();
                if (typeof Browser != "undefined" && Browser.mainLoop.func) {
                  Browser.mainLoop.pause();
                }
                runAndAbortIfError(() => _asyncify_start_unwind(Asyncify.currData));
              }
            } else if (Asyncify.state === Asyncify.State.Rewinding) {
              Asyncify.state = Asyncify.State.Normal;
              runAndAbortIfError(_asyncify_stop_rewind);
              _free(Asyncify.currData);
              Asyncify.currData = null;
              Asyncify.sleepCallbacks.forEach(callUserCallback);
            } else {
              abort(`invalid state: ${Asyncify.state}`);
            }
            return Asyncify.handleSleepReturnValue;
          },
          handleAsync(startAsync) {
            return Asyncify.handleSleep((wakeUp) => {
              startAsync().then(wakeUp);
            });
          }
        };
        var getCFunc = (ident) => {
          var func = Module2["_" + ident];
          assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
          return func;
        };
        var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
        var stringToUTF8OnStack = (str) => {
          var size = lengthBytesUTF8(str) + 1;
          var ret = stackAlloc(size);
          stringToUTF8(str, ret, size);
          return ret;
        };
        var ccall = (ident, returnType, argTypes, args, opts) => {
          var toC = {
            "string": (str) => {
              var ret2 = 0;
              if (str !== null && str !== void 0 && str !== 0) {
                ret2 = stringToUTF8OnStack(str);
              }
              return ret2;
            },
            "array": (arr) => {
              var ret2 = stackAlloc(arr.length);
              writeArrayToMemory(arr, ret2);
              return ret2;
            }
          };
          function convertReturnValue(ret2) {
            if (returnType === "string") {
              return UTF8ToString(ret2);
            }
            if (returnType === "boolean")
              return Boolean(ret2);
            return ret2;
          }
          var func = getCFunc(ident);
          var cArgs = [];
          var stack = 0;
          assert(returnType !== "array", 'Return type should not be "array".');
          if (args) {
            for (var i = 0; i < args.length; i++) {
              var converter = toC[argTypes[i]];
              if (converter) {
                if (stack === 0)
                  stack = stackSave();
                cArgs[i] = converter(args[i]);
              } else {
                cArgs[i] = args[i];
              }
            }
          }
          var previousAsync = Asyncify.currData;
          var ret = func(...cArgs);
          function onDone(ret2) {
            runtimeKeepalivePop();
            if (stack !== 0)
              stackRestore(stack);
            return convertReturnValue(ret2);
          }
          var asyncMode = opts?.async;
          runtimeKeepalivePush();
          if (Asyncify.currData != previousAsync) {
            assert(!(previousAsync && Asyncify.currData), "We cannot start an async operation when one is already flight");
            assert(!(previousAsync && !Asyncify.currData), "We cannot stop an async operation in flight");
            assert(asyncMode, "The call to " + ident + " is running asynchronously. If this was intended, add the async option to the ccall/cwrap call.");
            return Asyncify.whenDone().then(onDone);
          }
          ret = onDone(ret);
          if (asyncMode)
            return Promise.resolve(ret);
          return ret;
        };
        var cwrap = (ident, returnType, argTypes, opts) => (...args) => ccall(ident, returnType, argTypes, args, opts);
        FS.createPreloadedFile = FS_createPreloadedFile;
        FS.staticInit();
        Module2["FS_createPath"] = FS.createPath;
        Module2["FS_createDataFile"] = FS.createDataFile;
        Module2["FS_createPreloadedFile"] = FS.createPreloadedFile;
        Module2["FS_unlink"] = FS.unlink;
        Module2["FS_createLazyFile"] = FS.createLazyFile;
        Module2["FS_createDevice"] = FS.createDevice;
        function checkIncomingModuleAPI() {
          ignoredModuleProp("fetchSettings");
        }
        var wasmImports = {
          /** @export */
          __assert_fail: ___assert_fail,
          /** @export */
          __asyncjs__weavedrive_close,
          /** @export */
          __asyncjs__weavedrive_open,
          /** @export */
          __asyncjs__weavedrive_read,
          /** @export */
          __cxa_throw: ___cxa_throw,
          /** @export */
          __syscall_chmod: ___syscall_chmod,
          /** @export */
          __syscall_dup3: ___syscall_dup3,
          /** @export */
          __syscall_faccessat: ___syscall_faccessat,
          /** @export */
          __syscall_fchmod: ___syscall_fchmod,
          /** @export */
          __syscall_fchown32: ___syscall_fchown32,
          /** @export */
          __syscall_fcntl64: ___syscall_fcntl64,
          /** @export */
          __syscall_fstat64: ___syscall_fstat64,
          /** @export */
          __syscall_ftruncate64: ___syscall_ftruncate64,
          /** @export */
          __syscall_getcwd: ___syscall_getcwd,
          /** @export */
          __syscall_ioctl: ___syscall_ioctl,
          /** @export */
          __syscall_lstat64: ___syscall_lstat64,
          /** @export */
          __syscall_mkdirat: ___syscall_mkdirat,
          /** @export */
          __syscall_newfstatat: ___syscall_newfstatat,
          /** @export */
          __syscall_openat: ___syscall_openat,
          /** @export */
          __syscall_readlinkat: ___syscall_readlinkat,
          /** @export */
          __syscall_renameat: ___syscall_renameat,
          /** @export */
          __syscall_rmdir: ___syscall_rmdir,
          /** @export */
          __syscall_stat64: ___syscall_stat64,
          /** @export */
          __syscall_unlinkat: ___syscall_unlinkat,
          /** @export */
          __syscall_utimensat: ___syscall_utimensat,
          /** @export */
          _abort_js: __abort_js,
          /** @export */
          _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,
          /** @export */
          _emscripten_memcpy_js: __emscripten_memcpy_js,
          /** @export */
          _emscripten_system: __emscripten_system,
          /** @export */
          _emscripten_throw_longjmp: __emscripten_throw_longjmp,
          /** @export */
          _gmtime_js: __gmtime_js,
          /** @export */
          _localtime_js: __localtime_js,
          /** @export */
          _mktime_js: __mktime_js,
          /** @export */
          _munmap_js: __munmap_js,
          /** @export */
          _tzset_js: __tzset_js,
          /** @export */
          emscripten_date_now: _emscripten_date_now,
          /** @export */
          emscripten_get_heap_max: _emscripten_get_heap_max,
          /** @export */
          emscripten_get_now: _emscripten_get_now,
          /** @export */
          emscripten_resize_heap: _emscripten_resize_heap,
          /** @export */
          environ_get: _environ_get,
          /** @export */
          environ_sizes_get: _environ_sizes_get,
          /** @export */
          exit: _exit,
          /** @export */
          fd_close: _fd_close,
          /** @export */
          fd_fdstat_get: _fd_fdstat_get,
          /** @export */
          fd_read: _fd_read,
          /** @export */
          fd_seek: _fd_seek,
          /** @export */
          fd_sync: _fd_sync,
          /** @export */
          fd_write: _fd_write,
          /** @export */
          invoke_vii,
          /** @export */
          strftime: _strftime,
          /** @export */
          strftime_l: _strftime_l
        };
        var wasmExports = createWasm();
        var ___wasm_call_ctors = createExportWrapper("__wasm_call_ctors", 0);
        var _malloc = Module2["_malloc"] = createExportWrapper("malloc", 1);
        var _handle = Module2["_handle"] = createExportWrapper("handle", 2);
        var _free = createExportWrapper("free", 1);
        var _fflush = createExportWrapper("fflush", 1);
        var _main = createExportWrapper("main", 2);
        var _emscripten_builtin_memalign = createExportWrapper("emscripten_builtin_memalign", 2);
        var _sbrk = createExportWrapper("sbrk", 1);
        var _setThrew = createExportWrapper("setThrew", 2);
        var __emscripten_tempret_set = createExportWrapper("_emscripten_tempret_set", 1);
        var _emscripten_stack_init = () => (_emscripten_stack_init = wasmExports["emscripten_stack_init"])();
        var _emscripten_stack_get_free = () => (_emscripten_stack_get_free = wasmExports["emscripten_stack_get_free"])();
        var _emscripten_stack_get_base = () => (_emscripten_stack_get_base = wasmExports["emscripten_stack_get_base"])();
        var _emscripten_stack_get_end = () => (_emscripten_stack_get_end = wasmExports["emscripten_stack_get_end"])();
        var __emscripten_stack_restore = (a0) => (__emscripten_stack_restore = wasmExports["_emscripten_stack_restore"])(a0);
        var __emscripten_stack_alloc = (a0) => (__emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"])(a0);
        var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"])();
        var ___cxa_is_pointer_type = createExportWrapper("__cxa_is_pointer_type", 1);
        var dynCall_iii = Module2["dynCall_iii"] = createExportWrapper("dynCall_iii", 3);
        var dynCall_vii = Module2["dynCall_vii"] = createExportWrapper("dynCall_vii", 3);
        var dynCall_ii = Module2["dynCall_ii"] = createExportWrapper("dynCall_ii", 2);
        var dynCall_iiii = Module2["dynCall_iiii"] = createExportWrapper("dynCall_iiii", 4);
        var dynCall_iiiii = Module2["dynCall_iiiii"] = createExportWrapper("dynCall_iiiii", 5);
        var dynCall_vi = Module2["dynCall_vi"] = createExportWrapper("dynCall_vi", 2);
        var dynCall_viii = Module2["dynCall_viii"] = createExportWrapper("dynCall_viii", 4);
        var dynCall_v = Module2["dynCall_v"] = createExportWrapper("dynCall_v", 1);
        var dynCall_jiii = Module2["dynCall_jiii"] = createExportWrapper("dynCall_jiii", 4);
        var dynCall_vij = Module2["dynCall_vij"] = createExportWrapper("dynCall_vij", 4);
        var dynCall_viij = Module2["dynCall_viij"] = createExportWrapper("dynCall_viij", 5);
        var dynCall_iiiiii = Module2["dynCall_iiiiii"] = createExportWrapper("dynCall_iiiiii", 6);
        var dynCall_viiiii = Module2["dynCall_viiiii"] = createExportWrapper("dynCall_viiiii", 6);
        var dynCall_viiiiii = Module2["dynCall_viiiiii"] = createExportWrapper("dynCall_viiiiii", 7);
        var dynCall_i = Module2["dynCall_i"] = createExportWrapper("dynCall_i", 1);
        var dynCall_viiii = Module2["dynCall_viiii"] = createExportWrapper("dynCall_viiii", 5);
        var dynCall_fi = Module2["dynCall_fi"] = createExportWrapper("dynCall_fi", 2);
        var dynCall_jii = Module2["dynCall_jii"] = createExportWrapper("dynCall_jii", 3);
        var dynCall_viiiiiii = Module2["dynCall_viiiiiii"] = createExportWrapper("dynCall_viiiiiii", 8);
        var dynCall_viiiiifii = Module2["dynCall_viiiiifii"] = createExportWrapper("dynCall_viiiiifii", 9);
        var dynCall_viiiiiiii = Module2["dynCall_viiiiiiii"] = createExportWrapper("dynCall_viiiiiiii", 9);
        var dynCall_viiiiiiiiiii = Module2["dynCall_viiiiiiiiiii"] = createExportWrapper("dynCall_viiiiiiiiiii", 12);
        var dynCall_viiiiiiiii = Module2["dynCall_viiiiiiiii"] = createExportWrapper("dynCall_viiiiiiiii", 10);
        var dynCall_vif = Module2["dynCall_vif"] = createExportWrapper("dynCall_vif", 3);
        var dynCall_iif = Module2["dynCall_iif"] = createExportWrapper("dynCall_iif", 3);
        var dynCall_iiff = Module2["dynCall_iiff"] = createExportWrapper("dynCall_iiff", 4);
        var dynCall_fiiii = Module2["dynCall_fiiii"] = createExportWrapper("dynCall_fiiii", 5);
        var dynCall_viifiii = Module2["dynCall_viifiii"] = createExportWrapper("dynCall_viifiii", 7);
        var dynCall_viiifiii = Module2["dynCall_viiifiii"] = createExportWrapper("dynCall_viiifiii", 8);
        var dynCall_vifi = Module2["dynCall_vifi"] = createExportWrapper("dynCall_vifi", 4);
        var dynCall_viiiiiiiiii = Module2["dynCall_viiiiiiiiii"] = createExportWrapper("dynCall_viiiiiiiiii", 11);
        var dynCall_fiif = Module2["dynCall_fiif"] = createExportWrapper("dynCall_fiif", 4);
        var dynCall_vifiiii = Module2["dynCall_vifiiii"] = createExportWrapper("dynCall_vifiiii", 7);
        var dynCall_jiji = Module2["dynCall_jiji"] = createExportWrapper("dynCall_jiji", 5);
        var dynCall_iidiiii = Module2["dynCall_iidiiii"] = createExportWrapper("dynCall_iidiiii", 7);
        var dynCall_viijii = Module2["dynCall_viijii"] = createExportWrapper("dynCall_viijii", 7);
        var dynCall_iiiiiiiii = Module2["dynCall_iiiiiiiii"] = createExportWrapper("dynCall_iiiiiiiii", 9);
        var dynCall_iiiiiii = Module2["dynCall_iiiiiii"] = createExportWrapper("dynCall_iiiiiii", 7);
        var dynCall_iiiiij = Module2["dynCall_iiiiij"] = createExportWrapper("dynCall_iiiiij", 7);
        var dynCall_iiiiid = Module2["dynCall_iiiiid"] = createExportWrapper("dynCall_iiiiid", 6);
        var dynCall_iiiiijj = Module2["dynCall_iiiiijj"] = createExportWrapper("dynCall_iiiiijj", 9);
        var dynCall_iiiiiiii = Module2["dynCall_iiiiiiii"] = createExportWrapper("dynCall_iiiiiiii", 8);
        var dynCall_iiiiiijj = Module2["dynCall_iiiiiijj"] = createExportWrapper("dynCall_iiiiiijj", 10);
        var _asyncify_start_unwind = createExportWrapper("asyncify_start_unwind", 1);
        var _asyncify_stop_unwind = createExportWrapper("asyncify_stop_unwind", 0);
        var _asyncify_start_rewind = createExportWrapper("asyncify_start_rewind", 1);
        var _asyncify_stop_rewind = createExportWrapper("asyncify_stop_rewind", 0);
        var ___start_em_js = Module2["___start_em_js"] = 408104;
        var ___stop_em_js = Module2["___stop_em_js"] = 408718;
        function invoke_vii(index, a1, a2) {
          var sp = stackSave();
          try {
            dynCall_vii(index, a1, a2);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
              throw e;
            _setThrew(1, 0);
          }
        }
        function applySignatureConversions(wasmExports2) {
          wasmExports2 = Object.assign({}, wasmExports2);
          var makeWrapper_pp = (f) => (a0) => f(a0) >>> 0;
          var makeWrapper_pP = (f) => (a0) => f(a0) >>> 0;
          var makeWrapper_p = (f) => () => f() >>> 0;
          wasmExports2["malloc"] = makeWrapper_pp(wasmExports2["malloc"]);
          wasmExports2["sbrk"] = makeWrapper_pP(wasmExports2["sbrk"]);
          wasmExports2["emscripten_stack_get_base"] = makeWrapper_p(wasmExports2["emscripten_stack_get_base"]);
          wasmExports2["emscripten_stack_get_end"] = makeWrapper_p(wasmExports2["emscripten_stack_get_end"]);
          wasmExports2["_emscripten_stack_alloc"] = makeWrapper_pp(wasmExports2["_emscripten_stack_alloc"]);
          wasmExports2["emscripten_stack_get_current"] = makeWrapper_p(wasmExports2["emscripten_stack_get_current"]);
          return wasmExports2;
        }
        var MAGIC = 0;
        Math.random = () => {
          MAGIC = Math.pow(MAGIC + 1.8912, 3) % 1;
          return MAGIC;
        };
        var TIME = 1e4;
        function deterministicNow() {
          return TIME++;
        }
        Date.now = deterministicNow;
        Module2["thisProgram"] = "thisProgram";
        Module2["addRunDependency"] = addRunDependency;
        Module2["removeRunDependency"] = removeRunDependency;
        Module2["FS_createPath"] = FS.createPath;
        Module2["FS_createLazyFile"] = FS.createLazyFile;
        Module2["FS_createDevice"] = FS.createDevice;
        Module2["cwrap"] = cwrap;
        Module2["FS_createPreloadedFile"] = FS.createPreloadedFile;
        Module2["FS_createDataFile"] = FS.createDataFile;
        Module2["FS_unlink"] = FS.unlink;
        var missingLibrarySymbols = ["writeI53ToI64", "writeI53ToI64Clamped", "writeI53ToI64Signaling", "writeI53ToU64Clamped", "writeI53ToU64Signaling", "readI53FromU64", "convertI32PairToI53", "convertU32PairToI53", "getTempRet0", "inetPton4", "inetNtop4", "inetPton6", "inetNtop6", "readSockaddr", "writeSockaddr", "emscriptenLog", "readEmAsmArgs", "jstoi_q", "listenOnce", "autoResumeAudioContext", "dynCallLegacy", "getDynCaller", "dynCall", "asmjsMangle", "HandleAllocator", "getNativeTypeSize", "STACK_SIZE", "STACK_ALIGN", "POINTER_SIZE", "ASSERTIONS", "uleb128Encode", "generateFuncType", "convertJsFunctionToWasm", "getEmptyTableSlot", "updateTableMap", "getFunctionAddress", "addFunction", "removeFunction", "reallyNegative", "unSign", "strLen", "reSign", "formatString", "intArrayToString", "AsciiToString", "UTF16ToString", "stringToUTF16", "lengthBytesUTF16", "UTF32ToString", "stringToUTF32", "lengthBytesUTF32", "stringToNewUTF8", "registerKeyEventCallback", "maybeCStringToJsString", "findEventTarget", "getBoundingClientRect", "fillMouseEventData", "registerMouseEventCallback", "registerWheelEventCallback", "registerUiEventCallback", "registerFocusEventCallback", "fillDeviceOrientationEventData", "registerDeviceOrientationEventCallback", "fillDeviceMotionEventData", "registerDeviceMotionEventCallback", "screenOrientation", "fillOrientationChangeEventData", "registerOrientationChangeEventCallback", "fillFullscreenChangeEventData", "registerFullscreenChangeEventCallback", "JSEvents_requestFullscreen", "JSEvents_resizeCanvasForFullscreen", "registerRestoreOldStyle", "hideEverythingExceptGivenElement", "restoreHiddenElements", "setLetterbox", "softFullscreenResizeWebGLRenderTarget", "doRequestFullscreen", "fillPointerlockChangeEventData", "registerPointerlockChangeEventCallback", "registerPointerlockErrorEventCallback", "requestPointerLock", "fillVisibilityChangeEventData", "registerVisibilityChangeEventCallback", "registerTouchEventCallback", "fillGamepadEventData", "registerGamepadEventCallback", "registerBeforeUnloadEventCallback", "fillBatteryEventData", "battery", "registerBatteryEventCallback", "setCanvasElementSize", "getCanvasElementSize", "jsStackTrace", "getCallstack", "convertPCtoSourceLocation", "checkWasiClock", "wasiRightsToMuslOFlags", "wasiOFlagsToMuslOFlags", "createDyncallWrapper", "safeSetTimeout", "setImmediateWrapped", "clearImmediateWrapped", "polyfillSetImmediate", "getPromise", "makePromise", "idsToPromises", "makePromiseCallback", "findMatchingCatch", "Browser_asyncPrepareDataCounter", "setMainLoop", "getSocketFromFD", "getSocketAddress", "FS_mkdirTree", "_setNetworkCallback", "heapObjectForWebGLType", "toTypedArrayIndex", "webgl_enable_ANGLE_instanced_arrays", "webgl_enable_OES_vertex_array_object", "webgl_enable_WEBGL_draw_buffers", "webgl_enable_WEBGL_multi_draw", "emscriptenWebGLGet", "computeUnpackAlignedImageSize", "colorChannelsInGlTextureFormat", "emscriptenWebGLGetTexPixelData", "emscriptenWebGLGetUniform", "webglGetUniformLocation", "webglPrepareUniformLocationsBeforeFirstUse", "webglGetLeftBracePos", "emscriptenWebGLGetVertexAttrib", "__glGetActiveAttribOrUniform", "writeGLArray", "registerWebGlEventCallback", "ALLOC_NORMAL", "ALLOC_STACK", "allocate", "writeStringToMemory", "writeAsciiToMemory", "setErrNo", "demangle", "stackTrace"];
        missingLibrarySymbols.forEach(missingLibrarySymbol);
        var unexportedSymbols = ["run", "addOnPreRun", "addOnInit", "addOnPreMain", "addOnExit", "addOnPostRun", "FS_createFolder", "FS_createLink", "FS_readFile", "out", "err", "callMain", "abort", "wasmMemory", "wasmExports", "writeStackCookie", "checkStackCookie", "readI53FromI64", "convertI32PairToI53Checked", "stackSave", "stackRestore", "stackAlloc", "setTempRet0", "ptrToString", "zeroMemory", "exitJS", "getHeapMax", "growMemory", "ENV", "MONTH_DAYS_REGULAR", "MONTH_DAYS_LEAP", "MONTH_DAYS_REGULAR_CUMULATIVE", "MONTH_DAYS_LEAP_CUMULATIVE", "isLeapYear", "ydayFromDate", "arraySum", "addDays", "ERRNO_CODES", "ERRNO_MESSAGES", "DNS", "Protocols", "Sockets", "initRandomFill", "randomFill", "timers", "warnOnce", "readEmAsmArgsArray", "jstoi_s", "getExecutableName", "handleException", "keepRuntimeAlive", "runtimeKeepalivePush", "runtimeKeepalivePop", "callUserCallback", "maybeExit", "asyncLoad", "alignMemory", "mmapAlloc", "wasmTable", "noExitRuntime", "getCFunc", "ccall", "sigToWasmTypes", "freeTableIndexes", "functionsInTableMap", "setValue", "getValue", "PATH", "PATH_FS", "UTF8Decoder", "UTF8ArrayToString", "UTF8ToString", "stringToUTF8Array", "stringToUTF8", "lengthBytesUTF8", "intArrayFromString", "stringToAscii", "UTF16Decoder", "stringToUTF8OnStack", "writeArrayToMemory", "JSEvents", "specialHTMLTargets", "findCanvasEventTarget", "currentFullscreenStrategy", "restoreOldWindowedStyle", "UNWIND_CACHE", "ExitStatus", "getEnvStrings", "doReadv", "doWritev", "promiseMap", "uncaughtExceptionCount", "exceptionLast", "exceptionCaught", "ExceptionInfo", "Browser", "getPreloadedImageData__data", "wget", "SYSCALLS", "preloadPlugins", "FS_modeStringToFlags", "FS_getMode", "FS_stdin_getChar_buffer", "FS_stdin_getChar", "FS", "MEMFS", "TTY", "PIPEFS", "SOCKFS", "tempFixedLengthArray", "miniTempWebGLFloatBuffers", "miniTempWebGLIntBuffers", "GL", "AL", "GLUT", "EGL", "GLEW", "IDBStore", "runAndAbortIfError", "Asyncify", "Fibers", "SDL", "SDL_gfx", "allocateUTF8", "allocateUTF8OnStack"];
        unexportedSymbols.forEach(unexportedRuntimeSymbol);
        var calledRun;
        dependenciesFulfilled = function runCaller() {
          if (!calledRun)
            run();
          if (!calledRun)
            dependenciesFulfilled = runCaller;
        };
        function stackCheckInit() {
          _emscripten_stack_init();
          writeStackCookie();
        }
        function run() {
          if (runDependencies > 0) {
            return;
          }
          stackCheckInit();
          preRun();
          if (runDependencies > 0) {
            return;
          }
          function doRun() {
            if (calledRun)
              return;
            calledRun = true;
            Module2["calledRun"] = true;
            if (ABORT)
              return;
            initRuntime();
            readyPromiseResolve(Module2);
            if (Module2["onRuntimeInitialized"])
              Module2["onRuntimeInitialized"]();
            assert(!Module2["_main"], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');
            postRun();
          }
          if (Module2["setStatus"]) {
            Module2["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module2["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
          checkStackCookie();
        }
        function checkUnflushedContent() {
          var oldOut = out;
          var oldErr = err;
          var has = false;
          out = err = (x) => {
            has = true;
          };
          try {
            _fflush(0);
            ["stdout", "stderr"].forEach(function(name) {
              var info = FS.analyzePath("/dev/" + name);
              if (!info)
                return;
              var stream = info.object;
              var rdev = stream.rdev;
              var tty = TTY.ttys[rdev];
              if (tty?.output?.length) {
                has = true;
              }
            });
          } catch (e) {
          }
          out = oldOut;
          err = oldErr;
          if (has) {
            warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.");
          }
        }
        if (Module2["preInit"]) {
          if (typeof Module2["preInit"] == "function")
            Module2["preInit"] = [Module2["preInit"]];
          while (Module2["preInit"].length > 0) {
            Module2["preInit"].pop()();
          }
        }
        run();
        moduleRtn = readyPromise;
        Module2.resizeHeap = _emscripten_resize_heap;
        for (const prop of Object.keys(Module2)) {
          if (!(prop in moduleArg)) {
            Object.defineProperty(moduleArg, prop, {
              configurable: true,
              get() {
                abort(`Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
              }
            });
          }
        }
        return moduleRtn;
      };
    })();
    if (typeof exports2 === "object" && typeof module2 === "object")
      module2.exports = Module;
    else if (typeof define === "function" && define["amd"])
      define([], () => Module);
  }
});

// src/formats/wasm64-emscripten.cjs
var require_wasm64_emscripten = __commonJS({
  "src/formats/wasm64-emscripten.cjs"(exports2, module2) {
    var DEFAULT_GAS_LIMIT = 9e15;
    var Module = (() => {
      var _scriptName = typeof document != "undefined" ? document.currentScript?.src : void 0;
      if (typeof __filename != "undefined")
        _scriptName ||= __filename;
      return function(moduleArg = {}) {
        var moduleRtn;
        var Module2 = Object.assign({}, moduleArg);
        Module2.gas = {
          limit: Module2.computeLimit || DEFAULT_GAS_LIMIT,
          used: 0,
          use: (amount) => {
            Module2.gas.used += amount;
          },
          refill: (amount) => {
            if (!amount)
              Module2.gas.used = 0;
            else
              Module2.gas.used = Math.max(Module2.gas.used - amount, 0);
          },
          isEmpty: () => Module2.gas.used > Module2.gas.limit
        };
        var readyPromiseResolve, readyPromiseReject;
        var readyPromise = new Promise((resolve, reject) => {
          readyPromiseResolve = resolve;
          readyPromiseReject = reject;
        });
        ["_malloc", "_memory", "___asyncjs__weavedrive_open", "___asyncjs__weavedrive_read", "___asyncjs__weavedrive_close", "_handle", "___indirect_function_table", "onRuntimeInitialized"].forEach((prop) => {
          if (!Object.getOwnPropertyDescriptor(readyPromise, prop)) {
            Object.defineProperty(readyPromise, prop, {
              get: () => abort("You are getting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js"),
              set: () => abort("You are setting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")
            });
          }
        });
        var ENVIRONMENT_IS_WEB = typeof window == "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
        var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
        var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        if (Module2["ENVIRONMENT"]) {
          throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
        }
        if (ENVIRONMENT_IS_NODE) {
        }
        Module2.locateFile = (url) => url;
        var moduleOverrides = Object.assign({}, Module2);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow) => {
          throw toThrow;
        };
        var scriptDirectory = "";
        function locateFile(path) {
          if (Module2["locateFile"]) {
            return Module2["locateFile"](path, scriptDirectory);
          }
          return scriptDirectory + path;
        }
        var read_, readAsync, readBinary;
        if (ENVIRONMENT_IS_NODE) {
          if (typeof process == "undefined" || !process.release || process.release.name !== "node")
            throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          var nodeVersion = process.versions.node;
          var numericVersion = nodeVersion.split(".").slice(0, 3);
          numericVersion = numericVersion[0] * 1e4 + numericVersion[1] * 100 + numericVersion[2].split("-")[0] * 1;
          if (numericVersion < 16e4) {
            throw new Error("This emscripten-generated code requires node v16.0.0 (detected v" + nodeVersion + ")");
          }
          var fs = require("fs");
          var nodePath = require("path");
          scriptDirectory = __dirname + "/";
          read_ = (filename, binary) => {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            return fs.readFileSync(filename, binary ? void 0 : "utf8");
          };
          readBinary = (filename) => {
            var ret = read_(filename, true);
            if (!ret.buffer) {
              ret = new Uint8Array(ret);
            }
            assert(ret.buffer);
            return ret;
          };
          readAsync = (filename, onload, onerror, binary = true) => {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            fs.readFile(filename, binary ? void 0 : "utf8", (err2, data) => {
              if (err2)
                onerror(err2);
              else
                onload(binary ? data.buffer : data);
            });
          };
          if (!Module2["thisProgram"] && process.argv.length > 1) {
            thisProgram = process.argv[1].replace(/\\/g, "/");
          }
          arguments_ = process.argv.slice(2);
          quit_ = (status, toThrow) => {
            process.exitCode = status;
            throw toThrow;
          };
        } else if (ENVIRONMENT_IS_SHELL) {
          if (typeof process == "object" && typeof require === "function" || typeof window == "object" || typeof importScripts == "function")
            throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else if (typeof document != "undefined" && document.currentScript) {
            scriptDirectory = document.currentScript.src;
          }
          if (_scriptName) {
            scriptDirectory = _scriptName;
          }
          if (scriptDirectory.startsWith("blob:")) {
            scriptDirectory = "";
          } else {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
          }
          if (!(typeof window == "object" || typeof importScripts == "function"))
            throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
          {
            read_ = (url) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.send(null);
              return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = (url) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(
                  /** @type{!ArrayBuffer} */
                  xhr.response
                );
              };
            }
            readAsync = (url, onload, onerror) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, true);
              xhr.responseType = "arraybuffer";
              xhr.onload = () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                  onload(xhr.response);
                  return;
                }
                onerror();
              };
              xhr.onerror = onerror;
              xhr.send(null);
            };
          }
        } else {
          throw new Error("environment detection error");
        }
        var out = Module2["print"] || console.log.bind(console);
        var err = Module2["printErr"] || console.error.bind(console);
        Object.assign(Module2, moduleOverrides);
        moduleOverrides = null;
        checkIncomingModuleAPI();
        if (Module2["arguments"])
          arguments_ = Module2["arguments"];
        legacyModuleProp("arguments", "arguments_");
        if (Module2["thisProgram"])
          thisProgram = Module2["thisProgram"];
        legacyModuleProp("thisProgram", "thisProgram");
        if (Module2["quit"])
          quit_ = Module2["quit"];
        legacyModuleProp("quit", "quit_");
        assert(typeof Module2["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module2["read"] == "undefined", "Module.read option was removed (modify read_ in JS)");
        assert(typeof Module2["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
        assert(typeof Module2["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
        assert(typeof Module2["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)");
        assert(typeof Module2["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
        legacyModuleProp("asm", "wasmExports");
        legacyModuleProp("read", "read_");
        legacyModuleProp("readAsync", "readAsync");
        legacyModuleProp("readBinary", "readBinary");
        legacyModuleProp("setWindowTitle", "setWindowTitle");
        assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");
        var wasmBinary;
        if (Module2["wasmBinary"])
          wasmBinary = Module2["wasmBinary"];
        legacyModuleProp("wasmBinary", "wasmBinary");
        if (typeof WebAssembly != "object") {
          err("no native wasm support detected");
        }
        function intArrayFromBase64(s) {
          if (typeof ENVIRONMENT_IS_NODE != "undefined" && ENVIRONMENT_IS_NODE) {
            var buf = Buffer.from(s, "base64");
            return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
          }
          var decoded = atob(s);
          var bytes = new Uint8Array(decoded.length);
          for (var i = 0; i < decoded.length; ++i) {
            bytes[i] = decoded.charCodeAt(i);
          }
          return bytes;
        }
        var wasmMemory;
        var ABORT = false;
        var EXITSTATUS;
        function assert(condition, text) {
          if (!condition) {
            abort("Assertion failed" + (text ? ": " + text : ""));
          }
        }
        var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAP64, HEAPU64, HEAPF64;
        function updateMemoryViews() {
          var b = wasmMemory.buffer;
          Module2["HEAP8"] = HEAP8 = new Int8Array(b);
          Module2["HEAP16"] = HEAP16 = new Int16Array(b);
          Module2["HEAPU8"] = HEAPU8 = new Uint8Array(b);
          Module2["HEAPU16"] = HEAPU16 = new Uint16Array(b);
          Module2["HEAP32"] = HEAP32 = new Int32Array(b);
          Module2["HEAPU32"] = HEAPU32 = new Uint32Array(b);
          Module2["HEAPF32"] = HEAPF32 = new Float32Array(b);
          Module2["HEAPF64"] = HEAPF64 = new Float64Array(b);
          Module2["HEAP64"] = HEAP64 = new BigInt64Array(b);
          Module2["HEAPU64"] = HEAPU64 = new BigUint64Array(b);
        }
        assert(!Module2["STACK_SIZE"], "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");
        assert(typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != void 0 && Int32Array.prototype.set != void 0, "JS engine does not provide full typed array support");
        assert(!Module2["wasmMemory"], "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");
        assert(!Module2["INITIAL_MEMORY"], "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
        function writeStackCookie() {
          var max = _emscripten_stack_get_end();
          assert((max & 3) == 0);
          if (max == 0) {
            max += 4;
          }
          HEAPU32[max / 4] = 34821223;
          HEAPU32[(max + 4) / 4] = 2310721022;
          HEAPU32[0 / 4] = 1668509029;
        }
        function checkStackCookie() {
          if (ABORT)
            return;
          var max = _emscripten_stack_get_end();
          if (max == 0) {
            max += 4;
          }
          var cookie1 = HEAPU32[max / 4];
          var cookie2 = HEAPU32[(max + 4) / 4];
          if (cookie1 != 34821223 || cookie2 != 2310721022) {
            abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
          }
          if (HEAPU32[0 / 4] != 1668509029) {
            abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
          }
        }
        (function() {
          var h16 = new Int16Array(1);
          var h8 = new Int8Array(h16.buffer);
          h16[0] = 25459;
          if (h8[0] !== 115 || h8[1] !== 99)
            throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
        })();
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        function preRun() {
          if (Module2["preRun"]) {
            if (typeof Module2["preRun"] == "function")
              Module2["preRun"] = [Module2["preRun"]];
            while (Module2["preRun"].length) {
              addOnPreRun(Module2["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          assert(!runtimeInitialized);
          runtimeInitialized = true;
          checkStackCookie();
          if (!Module2["noFSInit"] && !FS.init.initialized)
            FS.init();
          FS.ignorePermissions = false;
          TTY.init();
          callRuntimeCallbacks(__ATINIT__);
        }
        function postRun() {
          checkStackCookie();
          if (Module2["postRun"]) {
            if (typeof Module2["postRun"] == "function")
              Module2["postRun"] = [Module2["postRun"]];
            while (Module2["postRun"].length) {
              addOnPostRun(Module2["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
          __ATINIT__.unshift(cb);
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        var runDependencyTracking = {};
        function getUniqueRunDependency(id) {
          var orig = id;
          while (1) {
            if (!runDependencyTracking[id])
              return id;
            id = orig + Math.random();
          }
        }
        function addRunDependency(id) {
          runDependencies++;
          Module2["monitorRunDependencies"]?.(runDependencies);
          if (id) {
            assert(!runDependencyTracking[id]);
            runDependencyTracking[id] = 1;
            if (runDependencyWatcher === null && typeof setInterval != "undefined") {
              runDependencyWatcher = setInterval(() => {
                if (ABORT) {
                  clearInterval(runDependencyWatcher);
                  runDependencyWatcher = null;
                  return;
                }
                var shown = false;
                for (var dep in runDependencyTracking) {
                  if (!shown) {
                    shown = true;
                    err("still waiting on run dependencies:");
                  }
                  err(`dependency: ${dep}`);
                }
                if (shown) {
                  err("(end of list)");
                }
              }, 1e4);
            }
          } else {
            err("warning: run dependency added without ID");
          }
        }
        function removeRunDependency(id) {
          runDependencies--;
          Module2["monitorRunDependencies"]?.(runDependencies);
          if (id) {
            assert(runDependencyTracking[id]);
            delete runDependencyTracking[id];
          } else {
            err("warning: run dependency removed without ID");
          }
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        function abort(what) {
          Module2["onAbort"]?.(what);
          what = "Aborted(" + what + ")";
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          if (what.indexOf("RuntimeError: unreachable") >= 0) {
            what += '. "unreachable" may be due to ASYNCIFY_STACK_SIZE not being large enough (try increasing it)';
          }
          var e = new WebAssembly.RuntimeError(what);
          readyPromiseReject(e);
          throw e;
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
        var isFileURI = (filename) => filename.startsWith("file://");
        function createExportWrapper(name, nargs) {
          return (...args) => {
            assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
            var f = wasmExports[name];
            assert(f, `exported native function \`${name}\` not found`);
            assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
            return f(...args);
          };
        }
        function findWasmBinary() {
          var f = "AOS.wasm";
          if (!isDataURI(f)) {
            return locateFile(f);
          }
          return f;
        }
        var wasmBinaryFile;
        function getBinarySync(file) {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          if (readBinary) {
            return readBinary(file);
          }
          throw "both async and sync fetching of the wasm failed";
        }
        function getBinaryPromise(binaryFile) {
          if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
            if (typeof fetch == "function" && !isFileURI(binaryFile)) {
              return fetch(binaryFile, {
                credentials: "same-origin"
              }).then((response) => {
                if (!response["ok"]) {
                  throw `failed to load wasm binary file at '${binaryFile}'`;
                }
                return response["arrayBuffer"]();
              }).catch(() => getBinarySync(binaryFile));
            } else if (readAsync) {
              return new Promise((resolve, reject) => {
                readAsync(binaryFile, (response) => resolve(new Uint8Array(
                  /** @type{!ArrayBuffer} */
                  response
                )), reject);
              });
            }
          }
          return Promise.resolve().then(() => getBinarySync(binaryFile));
        }
        function instantiateArrayBuffer(binaryFile, imports, receiver) {
          return getBinaryPromise(binaryFile).then((binary) => WebAssembly.instantiate(binary, imports)).then(receiver, (reason) => {
            err(`failed to asynchronously prepare wasm: ${reason}`);
            if (isFileURI(wasmBinaryFile)) {
              err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
            }
            abort(reason);
          });
        }
        function instantiateAsync(binary, binaryFile, imports, callback) {
          if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
            return fetch(binaryFile, {
              credentials: "same-origin"
            }).then((response) => {
              var result = WebAssembly.instantiateStreaming(response, imports);
              return result.then(callback, function(reason) {
                err(`wasm streaming compile failed: ${reason}`);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(binaryFile, imports, callback);
              });
            });
          }
          return instantiateArrayBuffer(binaryFile, imports, callback);
        }
        function getWasmImports() {
          Asyncify.instrumentWasmImports(wasmImports);
          return {
            "env": wasmImports,
            "wasi_snapshot_preview1": wasmImports,
            metering: { usegas: function(gas) {
              Module2.gas.use(gas);
              if (Module2.gas.isEmpty())
                throw Error("out of gas!");
            } }
          };
        }
        function createWasm() {
          var info = getWasmImports();
          function receiveInstance(instance, module3) {
            wasmExports = instance.exports;
            wasmExports = Asyncify.instrumentWasmExports(wasmExports);
            wasmExports = applySignatureConversions(wasmExports);
            wasmMemory = wasmExports["memory"];
            assert(wasmMemory, "memory not found in wasm exports");
            updateMemoryViews();
            wasmTable = wasmExports["__indirect_function_table"];
            assert(wasmTable, "table not found in wasm exports");
            addOnInit(wasmExports["__wasm_call_ctors"]);
            removeRunDependency("wasm-instantiate");
            return wasmExports;
          }
          addRunDependency("wasm-instantiate");
          var trueModule = Module2;
          function receiveInstantiationResult(result) {
            assert(Module2 === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
            trueModule = null;
            receiveInstance(result["instance"]);
          }
          if (Module2["instantiateWasm"]) {
            try {
              return Module2["instantiateWasm"](info, receiveInstance);
            } catch (e) {
              err(`Module.instantiateWasm callback failed with error: ${e}`);
              readyPromiseReject(e);
            }
          }
          if (!wasmBinaryFile)
            wasmBinaryFile = findWasmBinary();
          instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
          return {};
        }
        function legacyModuleProp(prop, newName, incoming = true) {
          if (!Object.getOwnPropertyDescriptor(Module2, prop)) {
            Object.defineProperty(Module2, prop, {
              configurable: true,
              get() {
                let extra = incoming ? " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)" : "";
                abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);
              }
            });
          }
        }
        function ignoredModuleProp(prop) {
          if (Object.getOwnPropertyDescriptor(Module2, prop)) {
            abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
          }
        }
        function isExportedByForceFilesystem(name) {
          return name === "FS_createPath" || name === "FS_createDataFile" || name === "FS_createPreloadedFile" || name === "FS_unlink" || name === "addRunDependency" || name === "FS_createLazyFile" || name === "FS_createDevice" || name === "removeRunDependency";
        }
        function missingGlobal(sym, msg) {
          if (typeof globalThis != "undefined") {
            Object.defineProperty(globalThis, sym, {
              configurable: true,
              get() {
                warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
                return void 0;
              }
            });
          }
        }
        missingGlobal("buffer", "Please use HEAP8.buffer or wasmMemory.buffer");
        missingGlobal("asm", "Please use wasmExports instead");
        function missingLibrarySymbol(sym) {
          if (typeof globalThis != "undefined" && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
            Object.defineProperty(globalThis, sym, {
              configurable: true,
              get() {
                var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
                var librarySymbol = sym;
                if (!librarySymbol.startsWith("_")) {
                  librarySymbol = "$" + sym;
                }
                msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
                if (isExportedByForceFilesystem(sym)) {
                  msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
                }
                warnOnce(msg);
                return void 0;
              }
            });
          }
          unexportedRuntimeSymbol(sym);
        }
        function unexportedRuntimeSymbol(sym) {
          if (!Object.getOwnPropertyDescriptor(Module2, sym)) {
            Object.defineProperty(Module2, sym, {
              configurable: true,
              get() {
                var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
                if (isExportedByForceFilesystem(sym)) {
                  msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
                }
                abort(msg);
              }
            });
          }
        }
        function __asyncjs__weavedrive_open(c_filename, mode) {
          return Asyncify.handleAsync(async () => {
            const filename = UTF8ToString(Number(c_filename));
            if (!Module2.WeaveDrive) {
              return Promise.resolve(null);
            }
            const drive = Module2.WeaveDrive(Module2, FS);
            return await drive.open(filename);
          });
        }
        function __asyncjs__weavedrive_read(fd, dst_ptr, length) {
          return Asyncify.handleAsync(async () => {
            const drive = Module2.WeaveDrive(Module2, FS);
            return Promise.resolve(await drive.read(fd, dst_ptr, length));
          });
        }
        function __asyncjs__weavedrive_close(fd) {
          return Asyncify.handleAsync(async () => {
            const drive = Module2.WeaveDrive(Module2, FS);
            return drive.close(fd);
          });
        }
        function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = `Program terminated with exit(${status})`;
          this.status = status;
        }
        var callRuntimeCallbacks = (callbacks) => {
          while (callbacks.length > 0) {
            callbacks.shift()(Module2);
          }
        };
        var noExitRuntime = Module2["noExitRuntime"] || true;
        var ptrToString = (ptr) => {
          assert(typeof ptr === "number");
          return "0x" + ptr.toString(16).padStart(8, "0");
        };
        var stackRestore = (val) => __emscripten_stack_restore(val);
        var stackSave = () => _emscripten_stack_get_current();
        var warnOnce = (text) => {
          warnOnce.shown ||= {};
          if (!warnOnce.shown[text]) {
            warnOnce.shown[text] = 1;
            if (ENVIRONMENT_IS_NODE)
              text = "warning: " + text;
            err(text);
          }
        };
        var MAX_INT53 = 9007199254740992;
        var MIN_INT53 = -9007199254740992;
        var bigintToI53Checked = (num) => num < MIN_INT53 || num > MAX_INT53 ? NaN : Number(num);
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
        var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          while (heapOrArray[endPtr] && !(endPtr >= endIdx))
            ++endPtr;
          if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
          }
          var str = "";
          while (idx < endPtr) {
            var u0 = heapOrArray[idx++];
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }
            var u1 = heapOrArray[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue;
            }
            var u2 = heapOrArray[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            } else {
              if ((u0 & 248) != 240)
                warnOnce("Invalid UTF-8 leading byte " + ptrToString(u0) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
              u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
          }
          return str;
        };
        var UTF8ToString = (ptr, maxBytesToRead) => {
          assert(typeof ptr == "number", `UTF8ToString expects a number (got ${typeof ptr})`);
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        };
        function ___assert_fail(condition, filename, line, func) {
          condition = bigintToI53Checked(condition);
          filename = bigintToI53Checked(filename);
          func = bigintToI53Checked(func);
          abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]);
        }
        class ExceptionInfo {
          constructor(excPtr) {
            this.excPtr = excPtr;
            this.ptr = excPtr - 48;
          }
          set_type(type) {
            HEAPU64[(this.ptr + 8) / 8] = BigInt(type);
          }
          get_type() {
            return Number(HEAPU64[(this.ptr + 8) / 8]);
          }
          set_destructor(destructor) {
            HEAPU64[(this.ptr + 16) / 8] = BigInt(destructor);
          }
          get_destructor() {
            return Number(HEAPU64[(this.ptr + 16) / 8]);
          }
          set_caught(caught) {
            caught = caught ? 1 : 0;
            HEAP8[this.ptr + 24] = caught;
          }
          get_caught() {
            return HEAP8[this.ptr + 24] != 0;
          }
          set_rethrown(rethrown) {
            rethrown = rethrown ? 1 : 0;
            HEAP8[this.ptr + 25] = rethrown;
          }
          get_rethrown() {
            return HEAP8[this.ptr + 25] != 0;
          }
          init(type, destructor) {
            this.set_adjusted_ptr(0);
            this.set_type(type);
            this.set_destructor(destructor);
          }
          set_adjusted_ptr(adjustedPtr) {
            HEAPU64[(this.ptr + 32) / 8] = BigInt(adjustedPtr);
          }
          get_adjusted_ptr() {
            return Number(HEAPU64[(this.ptr + 32) / 8]);
          }
          get_exception_ptr() {
            var isPointer = ___cxa_is_pointer_type(this.get_type());
            if (isPointer) {
              return Number(HEAPU64[this.excPtr / 8]);
            }
            var adjusted = this.get_adjusted_ptr();
            if (adjusted !== 0)
              return adjusted;
            return this.excPtr;
          }
        }
        var exceptionLast = 0;
        var uncaughtExceptionCount = 0;
        function ___cxa_throw(ptr, type, destructor) {
          ptr = bigintToI53Checked(ptr);
          type = bigintToI53Checked(type);
          destructor = bigintToI53Checked(destructor);
          var info = new ExceptionInfo(ptr);
          info.init(type, destructor);
          exceptionLast = ptr;
          uncaughtExceptionCount++;
          assert(false, "Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.");
        }
        var PATH = {
          isAbs: (path) => path.charAt(0) === "/",
          splitPath: (filename) => {
            var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            return splitPathRe.exec(filename).slice(1);
          },
          normalizeArray: (parts, allowAboveRoot) => {
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
              var last = parts[i];
              if (last === ".") {
                parts.splice(i, 1);
              } else if (last === "..") {
                parts.splice(i, 1);
                up++;
              } else if (up) {
                parts.splice(i, 1);
                up--;
              }
            }
            if (allowAboveRoot) {
              for (; up; up--) {
                parts.unshift("..");
              }
            }
            return parts;
          },
          normalize: (path) => {
            var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
            path = PATH.normalizeArray(path.split("/").filter((p) => !!p), !isAbsolute).join("/");
            if (!path && !isAbsolute) {
              path = ".";
            }
            if (path && trailingSlash) {
              path += "/";
            }
            return (isAbsolute ? "/" : "") + path;
          },
          dirname: (path) => {
            var result = PATH.splitPath(path), root = result[0], dir = result[1];
            if (!root && !dir) {
              return ".";
            }
            if (dir) {
              dir = dir.substr(0, dir.length - 1);
            }
            return root + dir;
          },
          basename: (path) => {
            if (path === "/")
              return "/";
            path = PATH.normalize(path);
            path = path.replace(/\/$/, "");
            var lastSlash = path.lastIndexOf("/");
            if (lastSlash === -1)
              return path;
            return path.substr(lastSlash + 1);
          },
          join: (...paths) => PATH.normalize(paths.join("/")),
          join2: (l, r) => PATH.normalize(l + "/" + r)
        };
        var initRandomFill = () => {
          if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
            return (view) => crypto.getRandomValues(view);
          } else if (ENVIRONMENT_IS_NODE) {
            try {
              var crypto_module = require("crypto");
              var randomFillSync = crypto_module["randomFillSync"];
              if (randomFillSync) {
                return (view) => crypto_module["randomFillSync"](view);
              }
              var randomBytes = crypto_module["randomBytes"];
              return (view) => (view.set(randomBytes(view.byteLength)), view);
            } catch (e) {
            }
          }
          abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: (array) => { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
        };
        var randomFill = (view) => (randomFill = initRandomFill())(view);
        var PATH_FS = {
          resolve: (...args) => {
            var resolvedPath = "", resolvedAbsolute = false;
            for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
              var path = i >= 0 ? args[i] : FS.cwd();
              if (typeof path != "string") {
                throw new TypeError("Arguments to path.resolve must be strings");
              } else if (!path) {
                return "";
              }
              resolvedPath = path + "/" + resolvedPath;
              resolvedAbsolute = PATH.isAbs(path);
            }
            resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p) => !!p), !resolvedAbsolute).join("/");
            return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
          },
          relative: (from, to) => {
            from = PATH_FS.resolve(from).substr(1);
            to = PATH_FS.resolve(to).substr(1);
            function trim(arr) {
              var start = 0;
              for (; start < arr.length; start++) {
                if (arr[start] !== "")
                  break;
              }
              var end = arr.length - 1;
              for (; end >= 0; end--) {
                if (arr[end] !== "")
                  break;
              }
              if (start > end)
                return [];
              return arr.slice(start, end - start + 1);
            }
            var fromParts = trim(from.split("/"));
            var toParts = trim(to.split("/"));
            var length = Math.min(fromParts.length, toParts.length);
            var samePartsLength = length;
            for (var i = 0; i < length; i++) {
              if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
              }
            }
            var outputParts = [];
            for (var i = samePartsLength; i < fromParts.length; i++) {
              outputParts.push("..");
            }
            outputParts = outputParts.concat(toParts.slice(samePartsLength));
            return outputParts.join("/");
          }
        };
        var FS_stdin_getChar_buffer = [];
        var lengthBytesUTF8 = (str) => {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);
            if (c <= 127) {
              len++;
            } else if (c <= 2047) {
              len += 2;
            } else if (c >= 55296 && c <= 57343) {
              len += 4;
              ++i;
            } else {
              len += 3;
            }
          }
          return len;
        };
        var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
          assert(typeof str === "string", `stringToUTF8Array expects a string (got ${typeof str})`);
          if (!(maxBytesToWrite > 0))
            return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i);
              u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
              if (outIdx >= endIdx)
                break;
              heap[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx)
                break;
              heap[outIdx++] = 192 | u >> 6;
              heap[outIdx++] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx)
                break;
              heap[outIdx++] = 224 | u >> 12;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx)
                break;
              if (u > 1114111)
                warnOnce("Invalid Unicode code point " + ptrToString(u) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
              heap[outIdx++] = 240 | u >> 18;
              heap[outIdx++] = 128 | u >> 12 & 63;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            }
          }
          heap[outIdx] = 0;
          return outIdx - startIdx;
        };
        function intArrayFromString(stringy, dontAddNull, length) {
          var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
          var u8array = new Array(len);
          var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
          if (dontAddNull)
            u8array.length = numBytesWritten;
          return u8array;
        }
        var FS_stdin_getChar = () => {
          if (!FS_stdin_getChar_buffer.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              var BUFSIZE = 256;
              var buf = Buffer.alloc(BUFSIZE);
              var bytesRead = 0;
              var fd = process.stdin.fd;
              try {
                bytesRead = fs.readSync(fd, buf);
              } catch (e) {
                if (e.toString().includes("EOF"))
                  bytesRead = 0;
                else
                  throw e;
              }
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString("utf-8");
              } else {
                result = null;
              }
            } else if (typeof window != "undefined" && typeof window.prompt == "function") {
              result = window.prompt("Input: ");
              if (result !== null) {
                result += "\n";
              }
            } else if (typeof readline == "function") {
              result = readline();
              if (result !== null) {
                result += "\n";
              }
            }
            if (!result) {
              return null;
            }
            FS_stdin_getChar_buffer = intArrayFromString(result, true);
          }
          return FS_stdin_getChar_buffer.shift();
        };
        var TTY = {
          ttys: [],
          init() {
          },
          shutdown() {
          },
          register(dev, ops) {
            TTY.ttys[dev] = {
              input: [],
              output: [],
              ops
            };
            FS.registerDevice(dev, TTY.stream_ops);
          },
          stream_ops: {
            open(stream) {
              var tty = TTY.ttys[stream.node.rdev];
              if (!tty) {
                throw new FS.ErrnoError(43);
              }
              stream.tty = tty;
              stream.seekable = false;
            },
            close(stream) {
              stream.tty.ops.fsync(stream.tty);
            },
            fsync(stream) {
              stream.tty.ops.fsync(stream.tty);
            },
            read(stream, buffer, offset, length, pos) {
              if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(60);
              }
              var bytesRead = 0;
              for (var i = 0; i < length; i++) {
                var result;
                try {
                  result = stream.tty.ops.get_char(stream.tty);
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
                if (result === void 0 && bytesRead === 0) {
                  throw new FS.ErrnoError(6);
                }
                if (result === null || result === void 0)
                  break;
                bytesRead++;
                buffer[offset + i] = result;
              }
              if (bytesRead) {
                stream.node.timestamp = Date.now();
              }
              return bytesRead;
            },
            write(stream, buffer, offset, length, pos) {
              if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(60);
              }
              try {
                for (var i = 0; i < length; i++) {
                  stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                }
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (length) {
                stream.node.timestamp = Date.now();
              }
              return i;
            }
          },
          default_tty_ops: {
            get_char(tty) {
              return FS_stdin_getChar();
            },
            put_char(tty, val) {
              if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              } else {
                if (val != 0)
                  tty.output.push(val);
              }
            },
            fsync(tty) {
              if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              }
            },
            ioctl_tcgets(tty) {
              return {
                c_iflag: 25856,
                c_oflag: 5,
                c_cflag: 191,
                c_lflag: 35387,
                c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              };
            },
            ioctl_tcsets(tty, optional_actions, data) {
              return 0;
            },
            ioctl_tiocgwinsz(tty) {
              return [24, 80];
            }
          },
          default_tty1_ops: {
            put_char(tty, val) {
              if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              } else {
                if (val != 0)
                  tty.output.push(val);
              }
            },
            fsync(tty) {
              if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
              }
            }
          }
        };
        var zeroMemory = (address, size) => {
          HEAPU8.fill(0, address, address + size);
          return address;
        };
        var alignMemory = (size, alignment) => {
          assert(alignment, "alignment argument is required");
          return Math.ceil(size / alignment) * alignment;
        };
        var mmapAlloc = (size) => {
          size = alignMemory(size, 65536);
          var ptr = _emscripten_builtin_memalign(65536, size);
          if (!ptr)
            return 0;
          return zeroMemory(ptr, size);
        };
        var MEMFS = {
          ops_table: null,
          mount(mount) {
            return MEMFS.createNode(
              null,
              "/",
              16384 | 511,
              /* 0777 */
              0
            );
          },
          createNode(parent, name, mode, dev) {
            if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
              throw new FS.ErrnoError(63);
            }
            MEMFS.ops_table ||= {
              dir: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  lookup: MEMFS.node_ops.lookup,
                  mknod: MEMFS.node_ops.mknod,
                  rename: MEMFS.node_ops.rename,
                  unlink: MEMFS.node_ops.unlink,
                  rmdir: MEMFS.node_ops.rmdir,
                  readdir: MEMFS.node_ops.readdir,
                  symlink: MEMFS.node_ops.symlink
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek
                }
              },
              file: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek,
                  read: MEMFS.stream_ops.read,
                  write: MEMFS.stream_ops.write,
                  allocate: MEMFS.stream_ops.allocate,
                  mmap: MEMFS.stream_ops.mmap,
                  msync: MEMFS.stream_ops.msync
                }
              },
              link: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  readlink: MEMFS.node_ops.readlink
                },
                stream: {}
              },
              chrdev: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: FS.chrdev_stream_ops
              }
            };
            var node = FS.createNode(parent, name, mode, dev);
            if (FS.isDir(node.mode)) {
              node.node_ops = MEMFS.ops_table.dir.node;
              node.stream_ops = MEMFS.ops_table.dir.stream;
              node.contents = {};
            } else if (FS.isFile(node.mode)) {
              node.node_ops = MEMFS.ops_table.file.node;
              node.stream_ops = MEMFS.ops_table.file.stream;
              node.usedBytes = 0;
              node.contents = null;
            } else if (FS.isLink(node.mode)) {
              node.node_ops = MEMFS.ops_table.link.node;
              node.stream_ops = MEMFS.ops_table.link.stream;
            } else if (FS.isChrdev(node.mode)) {
              node.node_ops = MEMFS.ops_table.chrdev.node;
              node.stream_ops = MEMFS.ops_table.chrdev.stream;
            }
            node.timestamp = Date.now();
            if (parent) {
              parent.contents[name] = node;
              parent.timestamp = node.timestamp;
            }
            return node;
          },
          getFileDataAsTypedArray(node) {
            if (!node.contents)
              return new Uint8Array(0);
            if (node.contents.subarray)
              return node.contents.subarray(0, node.usedBytes);
            return new Uint8Array(node.contents);
          },
          expandFileStorage(node, newCapacity) {
            var prevCapacity = node.contents ? node.contents.length : 0;
            if (prevCapacity >= newCapacity)
              return;
            var CAPACITY_DOUBLING_MAX = 1024 * 1024;
            newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
            if (prevCapacity != 0)
              newCapacity = Math.max(newCapacity, 256);
            var oldContents = node.contents;
            node.contents = new Uint8Array(newCapacity);
            if (node.usedBytes > 0)
              node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
          },
          resizeFileStorage(node, newSize) {
            if (node.usedBytes == newSize)
              return;
            if (newSize == 0) {
              node.contents = null;
              node.usedBytes = 0;
            } else {
              var oldContents = node.contents;
              node.contents = new Uint8Array(newSize);
              if (oldContents) {
                node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
              }
              node.usedBytes = newSize;
            }
          },
          node_ops: {
            getattr(node) {
              var attr = {};
              attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
              attr.ino = node.id;
              attr.mode = node.mode;
              attr.nlink = 1;
              attr.uid = 0;
              attr.gid = 0;
              attr.rdev = node.rdev;
              if (FS.isDir(node.mode)) {
                attr.size = 4096;
              } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes;
              } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length;
              } else {
                attr.size = 0;
              }
              attr.atime = new Date(node.timestamp);
              attr.mtime = new Date(node.timestamp);
              attr.ctime = new Date(node.timestamp);
              attr.blksize = 4096;
              attr.blocks = Math.ceil(attr.size / attr.blksize);
              return attr;
            },
            setattr(node, attr) {
              if (attr.mode !== void 0) {
                node.mode = attr.mode;
              }
              if (attr.timestamp !== void 0) {
                node.timestamp = attr.timestamp;
              }
              if (attr.size !== void 0) {
                MEMFS.resizeFileStorage(node, attr.size);
              }
            },
            lookup(parent, name) {
              throw FS.genericErrors[44];
            },
            mknod(parent, name, mode, dev) {
              return MEMFS.createNode(parent, name, mode, dev);
            },
            rename(old_node, new_dir, new_name) {
              if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                  new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {
                }
                if (new_node) {
                  for (var i in new_node.contents) {
                    throw new FS.ErrnoError(55);
                  }
                }
              }
              delete old_node.parent.contents[old_node.name];
              old_node.parent.timestamp = Date.now();
              old_node.name = new_name;
              new_dir.contents[new_name] = old_node;
              new_dir.timestamp = old_node.parent.timestamp;
              old_node.parent = new_dir;
            },
            unlink(parent, name) {
              delete parent.contents[name];
              parent.timestamp = Date.now();
            },
            rmdir(parent, name) {
              var node = FS.lookupNode(parent, name);
              for (var i in node.contents) {
                throw new FS.ErrnoError(55);
              }
              delete parent.contents[name];
              parent.timestamp = Date.now();
            },
            readdir(node) {
              var entries = [".", ".."];
              for (var key of Object.keys(node.contents)) {
                entries.push(key);
              }
              return entries;
            },
            symlink(parent, newname, oldpath) {
              var node = MEMFS.createNode(parent, newname, 511 | /* 0777 */
              40960, 0);
              node.link = oldpath;
              return node;
            },
            readlink(node) {
              if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(28);
              }
              return node.link;
            }
          },
          stream_ops: {
            read(stream, buffer, offset, length, position) {
              var contents = stream.node.contents;
              if (position >= stream.node.usedBytes)
                return 0;
              var size = Math.min(stream.node.usedBytes - position, length);
              assert(size >= 0);
              if (size > 8 && contents.subarray) {
                buffer.set(contents.subarray(position, position + size), offset);
              } else {
                for (var i = 0; i < size; i++)
                  buffer[offset + i] = contents[position + i];
              }
              return size;
            },
            write(stream, buffer, offset, length, position, canOwn) {
              assert(!(buffer instanceof ArrayBuffer));
              if (buffer.buffer === HEAP8.buffer) {
                canOwn = false;
              }
              if (!length)
                return 0;
              var node = stream.node;
              node.timestamp = Date.now();
              if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                  assert(position === 0, "canOwn must imply no weird position inside the file");
                  node.contents = buffer.subarray(offset, offset + length);
                  node.usedBytes = length;
                  return length;
                } else if (node.usedBytes === 0 && position === 0) {
                  node.contents = buffer.slice(offset, offset + length);
                  node.usedBytes = length;
                  return length;
                } else if (position + length <= node.usedBytes) {
                  node.contents.set(buffer.subarray(offset, offset + length), position);
                  return length;
                }
              }
              MEMFS.expandFileStorage(node, position + length);
              if (node.contents.subarray && buffer.subarray) {
                node.contents.set(buffer.subarray(offset, offset + length), position);
              } else {
                for (var i = 0; i < length; i++) {
                  node.contents[position + i] = buffer[offset + i];
                }
              }
              node.usedBytes = Math.max(node.usedBytes, position + length);
              return length;
            },
            llseek(stream, offset, whence) {
              var position = offset;
              if (whence === 1) {
                position += stream.position;
              } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                  position += stream.node.usedBytes;
                }
              }
              if (position < 0) {
                throw new FS.ErrnoError(28);
              }
              return position;
            },
            allocate(stream, offset, length) {
              MEMFS.expandFileStorage(stream.node, offset + length);
              stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
            },
            mmap(stream, length, position, prot, flags) {
              if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
              }
              var ptr;
              var allocated;
              var contents = stream.node.contents;
              if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
                allocated = false;
                ptr = contents.byteOffset;
              } else {
                if (position > 0 || position + length < contents.length) {
                  if (contents.subarray) {
                    contents = contents.subarray(position, position + length);
                  } else {
                    contents = Array.prototype.slice.call(contents, position, position + length);
                  }
                }
                allocated = true;
                ptr = mmapAlloc(length);
                if (!ptr) {
                  throw new FS.ErrnoError(48);
                }
                HEAP8.set(contents, ptr);
              }
              return {
                ptr,
                allocated
              };
            },
            msync(stream, buffer, offset, length, mmapFlags) {
              MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
              return 0;
            }
          }
        };
        var asyncLoad = (url, onload, onerror, noRunDep) => {
          var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
          readAsync(url, (arrayBuffer) => {
            assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
            onload(new Uint8Array(arrayBuffer));
            if (dep)
              removeRunDependency(dep);
          }, (event) => {
            if (onerror) {
              onerror();
            } else {
              throw `Loading data file "${url}" failed.`;
            }
          });
          if (dep)
            addRunDependency(dep);
        };
        var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
          FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
        };
        var preloadPlugins = Module2["preloadPlugins"] || [];
        var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
          if (typeof Browser != "undefined")
            Browser.init();
          var handled = false;
          preloadPlugins.forEach((plugin) => {
            if (handled)
              return;
            if (plugin["canHandle"](fullname)) {
              plugin["handle"](byteArray, fullname, finish, onerror);
              handled = true;
            }
          });
          return handled;
        };
        var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
          var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
          var dep = getUniqueRunDependency(`cp ${fullname}`);
          function processData(byteArray) {
            function finish(byteArray2) {
              preFinish?.();
              if (!dontCreateFile) {
                FS_createDataFile(parent, name, byteArray2, canRead, canWrite, canOwn);
              }
              onload?.();
              removeRunDependency(dep);
            }
            if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
              onerror?.();
              removeRunDependency(dep);
            })) {
              return;
            }
            finish(byteArray);
          }
          addRunDependency(dep);
          if (typeof url == "string") {
            asyncLoad(url, processData, onerror);
          } else {
            processData(url);
          }
        };
        var FS_modeStringToFlags = (str) => {
          var flagModes = {
            "r": 0,
            "r+": 2,
            "w": 512 | 64 | 1,
            "w+": 512 | 64 | 2,
            "a": 1024 | 64 | 1,
            "a+": 1024 | 64 | 2
          };
          var flags = flagModes[str];
          if (typeof flags == "undefined") {
            throw new Error(`Unknown file open mode: ${str}`);
          }
          return flags;
        };
        var FS_getMode = (canRead, canWrite) => {
          var mode = 0;
          if (canRead)
            mode |= 292 | 73;
          if (canWrite)
            mode |= 146;
          return mode;
        };
        var ERRNO_MESSAGES = {
          0: "Success",
          1: "Arg list too long",
          2: "Permission denied",
          3: "Address already in use",
          4: "Address not available",
          5: "Address family not supported by protocol family",
          6: "No more processes",
          7: "Socket already connected",
          8: "Bad file number",
          9: "Trying to read unreadable message",
          10: "Mount device busy",
          11: "Operation canceled",
          12: "No children",
          13: "Connection aborted",
          14: "Connection refused",
          15: "Connection reset by peer",
          16: "File locking deadlock error",
          17: "Destination address required",
          18: "Math arg out of domain of func",
          19: "Quota exceeded",
          20: "File exists",
          21: "Bad address",
          22: "File too large",
          23: "Host is unreachable",
          24: "Identifier removed",
          25: "Illegal byte sequence",
          26: "Connection already in progress",
          27: "Interrupted system call",
          28: "Invalid argument",
          29: "I/O error",
          30: "Socket is already connected",
          31: "Is a directory",
          32: "Too many symbolic links",
          33: "Too many open files",
          34: "Too many links",
          35: "Message too long",
          36: "Multihop attempted",
          37: "File or path name too long",
          38: "Network interface is not configured",
          39: "Connection reset by network",
          40: "Network is unreachable",
          41: "Too many open files in system",
          42: "No buffer space available",
          43: "No such device",
          44: "No such file or directory",
          45: "Exec format error",
          46: "No record locks available",
          47: "The link has been severed",
          48: "Not enough core",
          49: "No message of desired type",
          50: "Protocol not available",
          51: "No space left on device",
          52: "Function not implemented",
          53: "Socket is not connected",
          54: "Not a directory",
          55: "Directory not empty",
          56: "State not recoverable",
          57: "Socket operation on non-socket",
          59: "Not a typewriter",
          60: "No such device or address",
          61: "Value too large for defined data type",
          62: "Previous owner died",
          63: "Not super-user",
          64: "Broken pipe",
          65: "Protocol error",
          66: "Unknown protocol",
          67: "Protocol wrong type for socket",
          68: "Math result not representable",
          69: "Read only file system",
          70: "Illegal seek",
          71: "No such process",
          72: "Stale file handle",
          73: "Connection timed out",
          74: "Text file busy",
          75: "Cross-device link",
          100: "Device not a stream",
          101: "Bad font file fmt",
          102: "Invalid slot",
          103: "Invalid request code",
          104: "No anode",
          105: "Block device required",
          106: "Channel number out of range",
          107: "Level 3 halted",
          108: "Level 3 reset",
          109: "Link number out of range",
          110: "Protocol driver not attached",
          111: "No CSI structure available",
          112: "Level 2 halted",
          113: "Invalid exchange",
          114: "Invalid request descriptor",
          115: "Exchange full",
          116: "No data (for no delay io)",
          117: "Timer expired",
          118: "Out of streams resources",
          119: "Machine is not on the network",
          120: "Package not installed",
          121: "The object is remote",
          122: "Advertise error",
          123: "Srmount error",
          124: "Communication error on send",
          125: "Cross mount point (not really error)",
          126: "Given log. name not unique",
          127: "f.d. invalid for this operation",
          128: "Remote address changed",
          129: "Can   access a needed shared lib",
          130: "Accessing a corrupted shared lib",
          131: ".lib section in a.out corrupted",
          132: "Attempting to link in too many libs",
          133: "Attempting to exec a shared library",
          135: "Streams pipe error",
          136: "Too many users",
          137: "Socket type not supported",
          138: "Not supported",
          139: "Protocol family not supported",
          140: "Can't send after socket shutdown",
          141: "Too many references",
          142: "Host is down",
          148: "No medium (in tape drive)",
          156: "Level 2 not synchronized"
        };
        var ERRNO_CODES = {
          "EPERM": 63,
          "ENOENT": 44,
          "ESRCH": 71,
          "EINTR": 27,
          "EIO": 29,
          "ENXIO": 60,
          "E2BIG": 1,
          "ENOEXEC": 45,
          "EBADF": 8,
          "ECHILD": 12,
          "EAGAIN": 6,
          "EWOULDBLOCK": 6,
          "ENOMEM": 48,
          "EACCES": 2,
          "EFAULT": 21,
          "ENOTBLK": 105,
          "EBUSY": 10,
          "EEXIST": 20,
          "EXDEV": 75,
          "ENODEV": 43,
          "ENOTDIR": 54,
          "EISDIR": 31,
          "EINVAL": 28,
          "ENFILE": 41,
          "EMFILE": 33,
          "ENOTTY": 59,
          "ETXTBSY": 74,
          "EFBIG": 22,
          "ENOSPC": 51,
          "ESPIPE": 70,
          "EROFS": 69,
          "EMLINK": 34,
          "EPIPE": 64,
          "EDOM": 18,
          "ERANGE": 68,
          "ENOMSG": 49,
          "EIDRM": 24,
          "ECHRNG": 106,
          "EL2NSYNC": 156,
          "EL3HLT": 107,
          "EL3RST": 108,
          "ELNRNG": 109,
          "EUNATCH": 110,
          "ENOCSI": 111,
          "EL2HLT": 112,
          "EDEADLK": 16,
          "ENOLCK": 46,
          "EBADE": 113,
          "EBADR": 114,
          "EXFULL": 115,
          "ENOANO": 104,
          "EBADRQC": 103,
          "EBADSLT": 102,
          "EDEADLOCK": 16,
          "EBFONT": 101,
          "ENOSTR": 100,
          "ENODATA": 116,
          "ETIME": 117,
          "ENOSR": 118,
          "ENONET": 119,
          "ENOPKG": 120,
          "EREMOTE": 121,
          "ENOLINK": 47,
          "EADV": 122,
          "ESRMNT": 123,
          "ECOMM": 124,
          "EPROTO": 65,
          "EMULTIHOP": 36,
          "EDOTDOT": 125,
          "EBADMSG": 9,
          "ENOTUNIQ": 126,
          "EBADFD": 127,
          "EREMCHG": 128,
          "ELIBACC": 129,
          "ELIBBAD": 130,
          "ELIBSCN": 131,
          "ELIBMAX": 132,
          "ELIBEXEC": 133,
          "ENOSYS": 52,
          "ENOTEMPTY": 55,
          "ENAMETOOLONG": 37,
          "ELOOP": 32,
          "EOPNOTSUPP": 138,
          "EPFNOSUPPORT": 139,
          "ECONNRESET": 15,
          "ENOBUFS": 42,
          "EAFNOSUPPORT": 5,
          "EPROTOTYPE": 67,
          "ENOTSOCK": 57,
          "ENOPROTOOPT": 50,
          "ESHUTDOWN": 140,
          "ECONNREFUSED": 14,
          "EADDRINUSE": 3,
          "ECONNABORTED": 13,
          "ENETUNREACH": 40,
          "ENETDOWN": 38,
          "ETIMEDOUT": 73,
          "EHOSTDOWN": 142,
          "EHOSTUNREACH": 23,
          "EINPROGRESS": 26,
          "EALREADY": 7,
          "EDESTADDRREQ": 17,
          "EMSGSIZE": 35,
          "EPROTONOSUPPORT": 66,
          "ESOCKTNOSUPPORT": 137,
          "EADDRNOTAVAIL": 4,
          "ENETRESET": 39,
          "EISCONN": 30,
          "ENOTCONN": 53,
          "ETOOMANYREFS": 141,
          "EUSERS": 136,
          "EDQUOT": 19,
          "ESTALE": 72,
          "ENOTSUP": 138,
          "ENOMEDIUM": 148,
          "EILSEQ": 25,
          "EOVERFLOW": 61,
          "ECANCELED": 11,
          "ENOTRECOVERABLE": 56,
          "EOWNERDEAD": 62,
          "ESTRPIPE": 135
        };
        var FS = {
          root: null,
          mounts: [],
          devices: {},
          streams: [],
          nextInode: 1,
          nameTable: null,
          currentPath: "/",
          initialized: false,
          ignorePermissions: true,
          ErrnoError: class extends Error {
            constructor(errno) {
              super(ERRNO_MESSAGES[errno]);
              this.name = "ErrnoError";
              this.errno = errno;
              for (var key in ERRNO_CODES) {
                if (ERRNO_CODES[key] === errno) {
                  this.code = key;
                  break;
                }
              }
            }
          },
          genericErrors: {},
          filesystems: null,
          syncFSRequests: 0,
          FSStream: class {
            constructor() {
              this.shared = {};
            }
            get object() {
              return this.node;
            }
            set object(val) {
              this.node = val;
            }
            get isRead() {
              return (this.flags & 2097155) !== 1;
            }
            get isWrite() {
              return (this.flags & 2097155) !== 0;
            }
            get isAppend() {
              return this.flags & 1024;
            }
            get flags() {
              return this.shared.flags;
            }
            set flags(val) {
              this.shared.flags = val;
            }
            get position() {
              return this.shared.position;
            }
            set position(val) {
              this.shared.position = val;
            }
          },
          FSNode: class {
            constructor(parent, name, mode, rdev) {
              if (!parent) {
                parent = this;
              }
              this.parent = parent;
              this.mount = parent.mount;
              this.mounted = null;
              this.id = FS.nextInode++;
              this.name = name;
              this.mode = mode;
              this.node_ops = {};
              this.stream_ops = {};
              this.rdev = rdev;
              this.readMode = 292 | /*292*/
              73;
              this.writeMode = 146;
            }
            /*146*/
            get read() {
              return (this.mode & this.readMode) === this.readMode;
            }
            set read(val) {
              val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
            }
            get write() {
              return (this.mode & this.writeMode) === this.writeMode;
            }
            set write(val) {
              val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
            }
            get isFolder() {
              return FS.isDir(this.mode);
            }
            get isDevice() {
              return FS.isChrdev(this.mode);
            }
          },
          lookupPath(path, opts = {}) {
            path = PATH_FS.resolve(path);
            if (!path)
              return {
                path: "",
                node: null
              };
            var defaults = {
              follow_mount: true,
              recurse_count: 0
            };
            opts = Object.assign(defaults, opts);
            if (opts.recurse_count > 8) {
              throw new FS.ErrnoError(32);
            }
            var parts = path.split("/").filter((p) => !!p);
            var current = FS.root;
            var current_path = "/";
            for (var i = 0; i < parts.length; i++) {
              var islast = i === parts.length - 1;
              if (islast && opts.parent) {
                break;
              }
              current = FS.lookupNode(current, parts[i]);
              current_path = PATH.join2(current_path, parts[i]);
              if (FS.isMountpoint(current)) {
                if (!islast || islast && opts.follow_mount) {
                  current = current.mounted.root;
                }
              }
              if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                  var link = FS.readlink(current_path);
                  current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                  var lookup = FS.lookupPath(current_path, {
                    recurse_count: opts.recurse_count + 1
                  });
                  current = lookup.node;
                  if (count++ > 40) {
                    throw new FS.ErrnoError(32);
                  }
                }
              }
            }
            return {
              path: current_path,
              node: current
            };
          },
          getPath(node) {
            var path;
            while (true) {
              if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path)
                  return mount;
                return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
              }
              path = path ? `${node.name}/${path}` : node.name;
              node = node.parent;
            }
          },
          hashName(parentid, name) {
            var hash = 0;
            for (var i = 0; i < name.length; i++) {
              hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
            }
            return (parentid + hash >>> 0) % FS.nameTable.length;
          },
          hashAddNode(node) {
            var hash = FS.hashName(node.parent.id, node.name);
            node.name_next = FS.nameTable[hash];
            FS.nameTable[hash] = node;
          },
          hashRemoveNode(node) {
            var hash = FS.hashName(node.parent.id, node.name);
            if (FS.nameTable[hash] === node) {
              FS.nameTable[hash] = node.name_next;
            } else {
              var current = FS.nameTable[hash];
              while (current) {
                if (current.name_next === node) {
                  current.name_next = node.name_next;
                  break;
                }
                current = current.name_next;
              }
            }
          },
          lookupNode(parent, name) {
            var errCode = FS.mayLookup(parent);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            var hash = FS.hashName(parent.id, name);
            for (var node = FS.nameTable[hash]; node; node = node.name_next) {
              var nodeName = node.name;
              if (node.parent.id === parent.id && nodeName === name) {
                return node;
              }
            }
            return FS.lookup(parent, name);
          },
          createNode(parent, name, mode, rdev) {
            assert(typeof parent == "object");
            var node = new FS.FSNode(parent, name, mode, rdev);
            FS.hashAddNode(node);
            return node;
          },
          destroyNode(node) {
            FS.hashRemoveNode(node);
          },
          isRoot(node) {
            return node === node.parent;
          },
          isMountpoint(node) {
            return !!node.mounted;
          },
          isFile(mode) {
            return (mode & 61440) === 32768;
          },
          isDir(mode) {
            return (mode & 61440) === 16384;
          },
          isLink(mode) {
            return (mode & 61440) === 40960;
          },
          isChrdev(mode) {
            return (mode & 61440) === 8192;
          },
          isBlkdev(mode) {
            return (mode & 61440) === 24576;
          },
          isFIFO(mode) {
            return (mode & 61440) === 4096;
          },
          isSocket(mode) {
            return (mode & 49152) === 49152;
          },
          flagsToPermissionString(flag) {
            var perms = ["r", "w", "rw"][flag & 3];
            if (flag & 512) {
              perms += "w";
            }
            return perms;
          },
          nodePermissions(node, perms) {
            if (FS.ignorePermissions) {
              return 0;
            }
            if (perms.includes("r") && !(node.mode & 292)) {
              return 2;
            } else if (perms.includes("w") && !(node.mode & 146)) {
              return 2;
            } else if (perms.includes("x") && !(node.mode & 73)) {
              return 2;
            }
            return 0;
          },
          mayLookup(dir) {
            if (!FS.isDir(dir.mode))
              return 54;
            var errCode = FS.nodePermissions(dir, "x");
            if (errCode)
              return errCode;
            if (!dir.node_ops.lookup)
              return 2;
            return 0;
          },
          mayCreate(dir, name) {
            try {
              var node = FS.lookupNode(dir, name);
              return 20;
            } catch (e) {
            }
            return FS.nodePermissions(dir, "wx");
          },
          mayDelete(dir, name, isdir) {
            var node;
            try {
              node = FS.lookupNode(dir, name);
            } catch (e) {
              return e.errno;
            }
            var errCode = FS.nodePermissions(dir, "wx");
            if (errCode) {
              return errCode;
            }
            if (isdir) {
              if (!FS.isDir(node.mode)) {
                return 54;
              }
              if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 10;
              }
            } else {
              if (FS.isDir(node.mode)) {
                return 31;
              }
            }
            return 0;
          },
          mayOpen(node, flags) {
            if (!node) {
              return 44;
            }
            if (FS.isLink(node.mode)) {
              return 32;
            } else if (FS.isDir(node.mode)) {
              if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                return 31;
              }
            }
            return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
          },
          MAX_OPEN_FDS: 4096,
          nextfd() {
            for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
              if (!FS.streams[fd]) {
                return fd;
              }
            }
            throw new FS.ErrnoError(33);
          },
          getStreamChecked(fd) {
            var stream = FS.getStream(fd);
            if (!stream) {
              throw new FS.ErrnoError(8);
            }
            return stream;
          },
          getStream: (fd) => FS.streams[fd],
          createStream(stream, fd = -1) {
            stream = Object.assign(new FS.FSStream(), stream);
            if (fd == -1) {
              fd = FS.nextfd();
            }
            stream.fd = fd;
            FS.streams[fd] = stream;
            return stream;
          },
          closeStream(fd) {
            FS.streams[fd] = null;
          },
          dupStream(origStream, fd = -1) {
            var stream = FS.createStream(origStream, fd);
            stream.stream_ops?.dup?.(stream);
            return stream;
          },
          chrdev_stream_ops: {
            open(stream) {
              var device = FS.getDevice(stream.node.rdev);
              stream.stream_ops = device.stream_ops;
              stream.stream_ops.open?.(stream);
            },
            llseek() {
              throw new FS.ErrnoError(70);
            }
          },
          major: (dev) => dev >> 8,
          minor: (dev) => dev & 255,
          makedev: (ma, mi) => ma << 8 | mi,
          registerDevice(dev, ops) {
            FS.devices[dev] = {
              stream_ops: ops
            };
          },
          getDevice: (dev) => FS.devices[dev],
          getMounts(mount) {
            var mounts = [];
            var check = [mount];
            while (check.length) {
              var m = check.pop();
              mounts.push(m);
              check.push(...m.mounts);
            }
            return mounts;
          },
          syncfs(populate, callback) {
            if (typeof populate == "function") {
              callback = populate;
              populate = false;
            }
            FS.syncFSRequests++;
            if (FS.syncFSRequests > 1) {
              err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
            }
            var mounts = FS.getMounts(FS.root.mount);
            var completed = 0;
            function doCallback(errCode) {
              assert(FS.syncFSRequests > 0);
              FS.syncFSRequests--;
              return callback(errCode);
            }
            function done(errCode) {
              if (errCode) {
                if (!done.errored) {
                  done.errored = true;
                  return doCallback(errCode);
                }
                return;
              }
              if (++completed >= mounts.length) {
                doCallback(null);
              }
            }
            mounts.forEach((mount) => {
              if (!mount.type.syncfs) {
                return done(null);
              }
              mount.type.syncfs(mount, populate, done);
            });
          },
          mount(type, opts, mountpoint) {
            if (typeof type == "string") {
              throw type;
            }
            var root = mountpoint === "/";
            var pseudo = !mountpoint;
            var node;
            if (root && FS.root) {
              throw new FS.ErrnoError(10);
            } else if (!root && !pseudo) {
              var lookup = FS.lookupPath(mountpoint, {
                follow_mount: false
              });
              mountpoint = lookup.path;
              node = lookup.node;
              if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
              }
              if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54);
              }
            }
            var mount = {
              type,
              opts,
              mountpoint,
              mounts: []
            };
            var mountRoot = type.mount(mount);
            mountRoot.mount = mount;
            mount.root = mountRoot;
            if (root) {
              FS.root = mountRoot;
            } else if (node) {
              node.mounted = mount;
              if (node.mount) {
                node.mount.mounts.push(mount);
              }
            }
            return mountRoot;
          },
          unmount(mountpoint) {
            var lookup = FS.lookupPath(mountpoint, {
              follow_mount: false
            });
            if (!FS.isMountpoint(lookup.node)) {
              throw new FS.ErrnoError(28);
            }
            var node = lookup.node;
            var mount = node.mounted;
            var mounts = FS.getMounts(mount);
            Object.keys(FS.nameTable).forEach((hash) => {
              var current = FS.nameTable[hash];
              while (current) {
                var next = current.name_next;
                if (mounts.includes(current.mount)) {
                  FS.destroyNode(current);
                }
                current = next;
              }
            });
            node.mounted = null;
            var idx = node.mount.mounts.indexOf(mount);
            assert(idx !== -1);
            node.mount.mounts.splice(idx, 1);
          },
          lookup(parent, name) {
            return parent.node_ops.lookup(parent, name);
          },
          mknod(path, mode, dev) {
            var lookup = FS.lookupPath(path, {
              parent: true
            });
            var parent = lookup.node;
            var name = PATH.basename(path);
            if (!name || name === "." || name === "..") {
              throw new FS.ErrnoError(28);
            }
            var errCode = FS.mayCreate(parent, name);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.mknod) {
              throw new FS.ErrnoError(63);
            }
            return parent.node_ops.mknod(parent, name, mode, dev);
          },
          create(path, mode) {
            mode = mode !== void 0 ? mode : 438;
            mode &= 4095;
            mode |= 32768;
            return FS.mknod(path, mode, 0);
          },
          mkdir(path, mode) {
            mode = mode !== void 0 ? mode : 511;
            mode &= 511 | 512;
            mode |= 16384;
            return FS.mknod(path, mode, 0);
          },
          mkdirTree(path, mode) {
            var dirs = path.split("/");
            var d = "";
            for (var i = 0; i < dirs.length; ++i) {
              if (!dirs[i])
                continue;
              d += "/" + dirs[i];
              try {
                FS.mkdir(d, mode);
              } catch (e) {
                if (e.errno != 20)
                  throw e;
              }
            }
          },
          mkdev(path, mode, dev) {
            if (typeof dev == "undefined") {
              dev = mode;
              mode = 438;
            }
            mode |= 8192;
            return FS.mknod(path, mode, dev);
          },
          symlink(oldpath, newpath) {
            if (!PATH_FS.resolve(oldpath)) {
              throw new FS.ErrnoError(44);
            }
            var lookup = FS.lookupPath(newpath, {
              parent: true
            });
            var parent = lookup.node;
            if (!parent) {
              throw new FS.ErrnoError(44);
            }
            var newname = PATH.basename(newpath);
            var errCode = FS.mayCreate(parent, newname);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.symlink) {
              throw new FS.ErrnoError(63);
            }
            return parent.node_ops.symlink(parent, newname, oldpath);
          },
          rename(old_path, new_path) {
            var old_dirname = PATH.dirname(old_path);
            var new_dirname = PATH.dirname(new_path);
            var old_name = PATH.basename(old_path);
            var new_name = PATH.basename(new_path);
            var lookup, old_dir, new_dir;
            lookup = FS.lookupPath(old_path, {
              parent: true
            });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, {
              parent: true
            });
            new_dir = lookup.node;
            if (!old_dir || !new_dir)
              throw new FS.ErrnoError(44);
            if (old_dir.mount !== new_dir.mount) {
              throw new FS.ErrnoError(75);
            }
            var old_node = FS.lookupNode(old_dir, old_name);
            var relative = PATH_FS.relative(old_path, new_dirname);
            if (relative.charAt(0) !== ".") {
              throw new FS.ErrnoError(28);
            }
            relative = PATH_FS.relative(new_path, old_dirname);
            if (relative.charAt(0) !== ".") {
              throw new FS.ErrnoError(55);
            }
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (old_node === new_node) {
              return;
            }
            var isdir = FS.isDir(old_node.mode);
            var errCode = FS.mayDelete(old_dir, old_name, isdir);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!old_dir.node_ops.rename) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
              throw new FS.ErrnoError(10);
            }
            if (new_dir !== old_dir) {
              errCode = FS.nodePermissions(old_dir, "w");
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
            }
            FS.hashRemoveNode(old_node);
            try {
              old_dir.node_ops.rename(old_node, new_dir, new_name);
            } catch (e) {
              throw e;
            } finally {
              FS.hashAddNode(old_node);
            }
          },
          rmdir(path) {
            var lookup = FS.lookupPath(path, {
              parent: true
            });
            var parent = lookup.node;
            var name = PATH.basename(path);
            var node = FS.lookupNode(parent, name);
            var errCode = FS.mayDelete(parent, name, true);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.rmdir) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            parent.node_ops.rmdir(parent, name);
            FS.destroyNode(node);
          },
          readdir(path) {
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            var node = lookup.node;
            if (!node.node_ops.readdir) {
              throw new FS.ErrnoError(54);
            }
            return node.node_ops.readdir(node);
          },
          unlink(path) {
            var lookup = FS.lookupPath(path, {
              parent: true
            });
            var parent = lookup.node;
            if (!parent) {
              throw new FS.ErrnoError(44);
            }
            var name = PATH.basename(path);
            var node = FS.lookupNode(parent, name);
            var errCode = FS.mayDelete(parent, name, false);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            if (!parent.node_ops.unlink) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            parent.node_ops.unlink(parent, name);
            FS.destroyNode(node);
          },
          readlink(path) {
            var lookup = FS.lookupPath(path);
            var link = lookup.node;
            if (!link) {
              throw new FS.ErrnoError(44);
            }
            if (!link.node_ops.readlink) {
              throw new FS.ErrnoError(28);
            }
            return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
          },
          stat(path, dontFollow) {
            var lookup = FS.lookupPath(path, {
              follow: !dontFollow
            });
            var node = lookup.node;
            if (!node) {
              throw new FS.ErrnoError(44);
            }
            if (!node.node_ops.getattr) {
              throw new FS.ErrnoError(63);
            }
            return node.node_ops.getattr(node);
          },
          lstat(path) {
            return FS.stat(path, true);
          },
          chmod(path, mode, dontFollow) {
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, {
                follow: !dontFollow
              });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            node.node_ops.setattr(node, {
              mode: mode & 4095 | node.mode & ~4095,
              timestamp: Date.now()
            });
          },
          lchmod(path, mode) {
            FS.chmod(path, mode, true);
          },
          fchmod(fd, mode) {
            var stream = FS.getStreamChecked(fd);
            FS.chmod(stream.node, mode);
          },
          chown(path, uid, gid, dontFollow) {
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, {
                follow: !dontFollow
              });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            node.node_ops.setattr(node, {
              timestamp: Date.now()
            });
          },
          lchown(path, uid, gid) {
            FS.chown(path, uid, gid, true);
          },
          fchown(fd, uid, gid) {
            var stream = FS.getStreamChecked(fd);
            FS.chown(stream.node, uid, gid);
          },
          truncate(path, len) {
            if (len < 0) {
              throw new FS.ErrnoError(28);
            }
            var node;
            if (typeof path == "string") {
              var lookup = FS.lookupPath(path, {
                follow: true
              });
              node = lookup.node;
            } else {
              node = path;
            }
            if (!node.node_ops.setattr) {
              throw new FS.ErrnoError(63);
            }
            if (FS.isDir(node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!FS.isFile(node.mode)) {
              throw new FS.ErrnoError(28);
            }
            var errCode = FS.nodePermissions(node, "w");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            node.node_ops.setattr(node, {
              size: len,
              timestamp: Date.now()
            });
          },
          ftruncate(fd, len) {
            var stream = FS.getStreamChecked(fd);
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(28);
            }
            FS.truncate(stream.node, len);
          },
          utime(path, atime, mtime) {
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            var node = lookup.node;
            node.node_ops.setattr(node, {
              timestamp: Math.max(atime, mtime)
            });
          },
          open(path, flags, mode) {
            if (path === "") {
              throw new FS.ErrnoError(44);
            }
            flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
            mode = typeof mode == "undefined" ? 438 : (
              /* 0666 */
              mode
            );
            if (flags & 64) {
              mode = mode & 4095 | 32768;
            } else {
              mode = 0;
            }
            var node;
            if (typeof path == "object") {
              node = path;
            } else {
              path = PATH.normalize(path);
              try {
                var lookup = FS.lookupPath(path, {
                  follow: !(flags & 131072)
                });
                node = lookup.node;
              } catch (e) {
              }
            }
            var created = false;
            if (flags & 64) {
              if (node) {
                if (flags & 128) {
                  throw new FS.ErrnoError(20);
                }
              } else {
                node = FS.mknod(path, mode, 0);
                created = true;
              }
            }
            if (!node) {
              throw new FS.ErrnoError(44);
            }
            if (FS.isChrdev(node.mode)) {
              flags &= ~512;
            }
            if (flags & 65536 && !FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54);
            }
            if (!created) {
              var errCode = FS.mayOpen(node, flags);
              if (errCode) {
                throw new FS.ErrnoError(errCode);
              }
            }
            if (flags & 512 && !created) {
              FS.truncate(node, 0);
            }
            flags &= ~(128 | 512 | 131072);
            var stream = FS.createStream({
              node,
              path: FS.getPath(node),
              flags,
              seekable: true,
              position: 0,
              stream_ops: node.stream_ops,
              ungotten: [],
              error: false
            });
            if (stream.stream_ops.open) {
              stream.stream_ops.open(stream);
            }
            if (Module2["logReadFiles"] && !(flags & 1)) {
              if (!FS.readFiles)
                FS.readFiles = {};
              if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1;
              }
            }
            return stream;
          },
          close(stream) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (stream.getdents)
              stream.getdents = null;
            try {
              if (stream.stream_ops.close) {
                stream.stream_ops.close(stream);
              }
            } catch (e) {
              throw e;
            } finally {
              FS.closeStream(stream.fd);
            }
            stream.fd = null;
          },
          isClosed(stream) {
            return stream.fd === null;
          },
          llseek(stream, offset, whence) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (!stream.seekable || !stream.stream_ops.llseek) {
              throw new FS.ErrnoError(70);
            }
            if (whence != 0 && whence != 1 && whence != 2) {
              throw new FS.ErrnoError(28);
            }
            stream.position = stream.stream_ops.llseek(stream, offset, whence);
            stream.ungotten = [];
            return stream.position;
          },
          read(stream, buffer, offset, length, position) {
            assert(offset >= 0);
            if (length < 0 || position < 0) {
              throw new FS.ErrnoError(28);
            }
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 1) {
              throw new FS.ErrnoError(8);
            }
            if (FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!stream.stream_ops.read) {
              throw new FS.ErrnoError(28);
            }
            var seeking = typeof position != "undefined";
            if (!seeking) {
              position = stream.position;
            } else if (!stream.seekable) {
              throw new FS.ErrnoError(70);
            }
            var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
            if (!seeking)
              stream.position += bytesRead;
            return bytesRead;
          },
          write(stream, buffer, offset, length, position, canOwn) {
            assert(offset >= 0);
            if (length < 0 || position < 0) {
              throw new FS.ErrnoError(28);
            }
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(8);
            }
            if (FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(31);
            }
            if (!stream.stream_ops.write) {
              throw new FS.ErrnoError(28);
            }
            if (stream.seekable && stream.flags & 1024) {
              FS.llseek(stream, 0, 2);
            }
            var seeking = typeof position != "undefined";
            if (!seeking) {
              position = stream.position;
            } else if (!stream.seekable) {
              throw new FS.ErrnoError(70);
            }
            var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
            if (!seeking)
              stream.position += bytesWritten;
            return bytesWritten;
          },
          allocate(stream, offset, length) {
            if (FS.isClosed(stream)) {
              throw new FS.ErrnoError(8);
            }
            if (offset < 0 || length <= 0) {
              throw new FS.ErrnoError(28);
            }
            if ((stream.flags & 2097155) === 0) {
              throw new FS.ErrnoError(8);
            }
            if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            if (!stream.stream_ops.allocate) {
              throw new FS.ErrnoError(138);
            }
            stream.stream_ops.allocate(stream, offset, length);
          },
          mmap(stream, length, position, prot, flags) {
            if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
              throw new FS.ErrnoError(2);
            }
            if ((stream.flags & 2097155) === 1) {
              throw new FS.ErrnoError(2);
            }
            if (!stream.stream_ops.mmap) {
              throw new FS.ErrnoError(43);
            }
            return stream.stream_ops.mmap(stream, length, position, prot, flags);
          },
          msync(stream, buffer, offset, length, mmapFlags) {
            assert(offset >= 0);
            if (!stream.stream_ops.msync) {
              return 0;
            }
            return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
          },
          ioctl(stream, cmd, arg) {
            if (!stream.stream_ops.ioctl) {
              throw new FS.ErrnoError(59);
            }
            return stream.stream_ops.ioctl(stream, cmd, arg);
          },
          readFile(path, opts = {}) {
            opts.flags = opts.flags || 0;
            opts.encoding = opts.encoding || "binary";
            if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
              throw new Error(`Invalid encoding type "${opts.encoding}"`);
            }
            var ret;
            var stream = FS.open(path, opts.flags);
            var stat = FS.stat(path);
            var length = stat.size;
            var buf = new Uint8Array(length);
            FS.read(stream, buf, 0, length, 0);
            if (opts.encoding === "utf8") {
              ret = UTF8ArrayToString(buf, 0);
            } else if (opts.encoding === "binary") {
              ret = buf;
            }
            FS.close(stream);
            return ret;
          },
          writeFile(path, data, opts = {}) {
            opts.flags = opts.flags || 577;
            var stream = FS.open(path, opts.flags, opts.mode);
            if (typeof data == "string") {
              var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
              var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
              FS.write(stream, buf, 0, actualNumBytes, void 0, opts.canOwn);
            } else if (ArrayBuffer.isView(data)) {
              FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
            } else {
              throw new Error("Unsupported data type");
            }
            FS.close(stream);
          },
          cwd: () => FS.currentPath,
          chdir(path) {
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            if (lookup.node === null) {
              throw new FS.ErrnoError(44);
            }
            if (!FS.isDir(lookup.node.mode)) {
              throw new FS.ErrnoError(54);
            }
            var errCode = FS.nodePermissions(lookup.node, "x");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
            FS.currentPath = lookup.path;
          },
          createDefaultDirectories() {
            FS.mkdir("/tmp");
            FS.mkdir("/home");
            FS.mkdir("/home/web_user");
          },
          createDefaultDevices() {
            FS.mkdir("/dev");
            FS.registerDevice(FS.makedev(1, 3), {
              read: () => 0,
              write: (stream, buffer, offset, length, pos) => length
            });
            FS.mkdev("/dev/null", FS.makedev(1, 3));
            TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
            TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
            FS.mkdev("/dev/tty", FS.makedev(5, 0));
            FS.mkdev("/dev/tty1", FS.makedev(6, 0));
            var randomBuffer = new Uint8Array(1024), randomLeft = 0;
            var randomByte = () => {
              if (randomLeft === 0) {
                randomLeft = randomFill(randomBuffer).byteLength;
              }
              return randomBuffer[--randomLeft];
            };
            FS.createDevice("/dev", "random", randomByte);
            FS.createDevice("/dev", "urandom", randomByte);
            FS.mkdir("/dev/shm");
            FS.mkdir("/dev/shm/tmp");
          },
          createSpecialDirectories() {
            FS.mkdir("/proc");
            var proc_self = FS.mkdir("/proc/self");
            FS.mkdir("/proc/self/fd");
            FS.mount({
              mount() {
                var node = FS.createNode(
                  proc_self,
                  "fd",
                  16384 | 511,
                  /* 0777 */
                  73
                );
                node.node_ops = {
                  lookup(parent, name) {
                    var fd = +name;
                    var stream = FS.getStreamChecked(fd);
                    var ret = {
                      parent: null,
                      mount: {
                        mountpoint: "fake"
                      },
                      node_ops: {
                        readlink: () => stream.path
                      }
                    };
                    ret.parent = ret;
                    return ret;
                  }
                };
                return node;
              }
            }, {}, "/proc/self/fd");
          },
          createStandardStreams() {
            if (Module2["stdin"]) {
              FS.createDevice("/dev", "stdin", Module2["stdin"]);
            } else {
              FS.symlink("/dev/tty", "/dev/stdin");
            }
            if (Module2["stdout"]) {
              FS.createDevice("/dev", "stdout", null, Module2["stdout"]);
            } else {
              FS.symlink("/dev/tty", "/dev/stdout");
            }
            if (Module2["stderr"]) {
              FS.createDevice("/dev", "stderr", null, Module2["stderr"]);
            } else {
              FS.symlink("/dev/tty1", "/dev/stderr");
            }
            var stdin = FS.open("/dev/stdin", 0);
            var stdout = FS.open("/dev/stdout", 1);
            var stderr = FS.open("/dev/stderr", 1);
            assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
            assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
            assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
          },
          staticInit() {
            [44].forEach((code) => {
              FS.genericErrors[code] = new FS.ErrnoError(code);
              FS.genericErrors[code].stack = "<generic error, no stack>";
            });
            FS.nameTable = new Array(4096);
            FS.mount(MEMFS, {}, "/");
            FS.createDefaultDirectories();
            FS.createDefaultDevices();
            FS.createSpecialDirectories();
            FS.filesystems = {
              "MEMFS": MEMFS
            };
          },
          init(input, output, error) {
            assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
            FS.init.initialized = true;
            Module2["stdin"] = input || Module2["stdin"];
            Module2["stdout"] = output || Module2["stdout"];
            Module2["stderr"] = error || Module2["stderr"];
            FS.createStandardStreams();
          },
          quit() {
            FS.init.initialized = false;
            _fflush(0);
            for (var i = 0; i < FS.streams.length; i++) {
              var stream = FS.streams[i];
              if (!stream) {
                continue;
              }
              FS.close(stream);
            }
          },
          findObject(path, dontResolveLastLink) {
            var ret = FS.analyzePath(path, dontResolveLastLink);
            if (!ret.exists) {
              return null;
            }
            return ret.object;
          },
          analyzePath(path, dontResolveLastLink) {
            try {
              var lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
              });
              path = lookup.path;
            } catch (e) {
            }
            var ret = {
              isRoot: false,
              exists: false,
              error: 0,
              name: null,
              path: null,
              object: null,
              parentExists: false,
              parentPath: null,
              parentObject: null
            };
            try {
              var lookup = FS.lookupPath(path, {
                parent: true
              });
              ret.parentExists = true;
              ret.parentPath = lookup.path;
              ret.parentObject = lookup.node;
              ret.name = PATH.basename(path);
              lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
              });
              ret.exists = true;
              ret.path = lookup.path;
              ret.object = lookup.node;
              ret.name = lookup.node.name;
              ret.isRoot = lookup.path === "/";
            } catch (e) {
              ret.error = e.errno;
            }
            return ret;
          },
          createPath(parent, path, canRead, canWrite) {
            parent = typeof parent == "string" ? parent : FS.getPath(parent);
            var parts = path.split("/").reverse();
            while (parts.length) {
              var part = parts.pop();
              if (!part)
                continue;
              var current = PATH.join2(parent, part);
              try {
                FS.mkdir(current);
              } catch (e) {
              }
              parent = current;
            }
            return current;
          },
          createFile(parent, name, properties, canRead, canWrite) {
            var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
            var mode = FS_getMode(canRead, canWrite);
            return FS.create(path, mode);
          },
          createDataFile(parent, name, data, canRead, canWrite, canOwn) {
            var path = name;
            if (parent) {
              parent = typeof parent == "string" ? parent : FS.getPath(parent);
              path = name ? PATH.join2(parent, name) : parent;
            }
            var mode = FS_getMode(canRead, canWrite);
            var node = FS.create(path, mode);
            if (data) {
              if (typeof data == "string") {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i)
                  arr[i] = data.charCodeAt(i);
                data = arr;
              }
              FS.chmod(node, mode | 146);
              var stream = FS.open(node, 577);
              FS.write(stream, data, 0, data.length, 0, canOwn);
              FS.close(stream);
              FS.chmod(node, mode);
            }
          },
          createDevice(parent, name, input, output) {
            var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
            var mode = FS_getMode(!!input, !!output);
            if (!FS.createDevice.major)
              FS.createDevice.major = 64;
            var dev = FS.makedev(FS.createDevice.major++, 0);
            FS.registerDevice(dev, {
              open(stream) {
                stream.seekable = false;
              },
              close(stream) {
                if (output?.buffer?.length) {
                  output(10);
                }
              },
              read(stream, buffer, offset, length, pos) {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                  var result;
                  try {
                    result = input();
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                  if (result === void 0 && bytesRead === 0) {
                    throw new FS.ErrnoError(6);
                  }
                  if (result === null || result === void 0)
                    break;
                  bytesRead++;
                  buffer[offset + i] = result;
                }
                if (bytesRead) {
                  stream.node.timestamp = Date.now();
                }
                return bytesRead;
              },
              write(stream, buffer, offset, length, pos) {
                for (var i = 0; i < length; i++) {
                  try {
                    output(buffer[offset + i]);
                  } catch (e) {
                    throw new FS.ErrnoError(29);
                  }
                }
                if (length) {
                  stream.node.timestamp = Date.now();
                }
                return i;
              }
            });
            return FS.mkdev(path, mode, dev);
          },
          forceLoadFile(obj) {
            if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
              return true;
            if (typeof XMLHttpRequest != "undefined") {
              throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
            } else if (read_) {
              try {
                obj.contents = intArrayFromString(read_(obj.url), true);
                obj.usedBytes = obj.contents.length;
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            } else {
              throw new Error("Cannot load without read() or XMLHttpRequest.");
            }
          },
          createLazyFile(parent, name, url, canRead, canWrite) {
            class LazyUint8Array {
              constructor() {
                this.lengthKnown = false;
                this.chunks = [];
              }
              get(idx) {
                if (idx > this.length - 1 || idx < 0) {
                  return void 0;
                }
                var chunkOffset = idx % this.chunkSize;
                var chunkNum = idx / this.chunkSize | 0;
                return this.getter(chunkNum)[chunkOffset];
              }
              setDataGetter(getter) {
                this.getter = getter;
              }
              cacheLength() {
                var xhr = new XMLHttpRequest();
                xhr.open("HEAD", url, false);
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                  throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                var datalength = Number(xhr.getResponseHeader("Content-length"));
                var header;
                var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
                var chunkSize = 1024 * 1024;
                if (!hasByteServing)
                  chunkSize = datalength;
                var doXHR = (from, to) => {
                  if (from > to)
                    throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                  if (to > datalength - 1)
                    throw new Error("only " + datalength + " bytes available! programmer error!");
                  var xhr2 = new XMLHttpRequest();
                  xhr2.open("GET", url, false);
                  if (datalength !== chunkSize)
                    xhr2.setRequestHeader("Range", "bytes=" + from + "-" + to);
                  xhr2.responseType = "arraybuffer";
                  if (xhr2.overrideMimeType) {
                    xhr2.overrideMimeType("text/plain; charset=x-user-defined");
                  }
                  xhr2.send(null);
                  if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304))
                    throw new Error("Couldn't load " + url + ". Status: " + xhr2.status);
                  if (xhr2.response !== void 0) {
                    return new Uint8Array(
                      /** @type{Array<number>} */
                      xhr2.response || []
                    );
                  }
                  return intArrayFromString(xhr2.responseText || "", true);
                };
                var lazyArray2 = this;
                lazyArray2.setDataGetter((chunkNum) => {
                  var start = chunkNum * chunkSize;
                  var end = (chunkNum + 1) * chunkSize - 1;
                  end = Math.min(end, datalength - 1);
                  if (typeof lazyArray2.chunks[chunkNum] == "undefined") {
                    lazyArray2.chunks[chunkNum] = doXHR(start, end);
                  }
                  if (typeof lazyArray2.chunks[chunkNum] == "undefined")
                    throw new Error("doXHR failed!");
                  return lazyArray2.chunks[chunkNum];
                });
                if (usesGzip || !datalength) {
                  chunkSize = datalength = 1;
                  datalength = this.getter(0).length;
                  chunkSize = datalength;
                  out("LazyFiles on gzip forces download of the whole file when length is accessed");
                }
                this._length = datalength;
                this._chunkSize = chunkSize;
                this.lengthKnown = true;
              }
              get length() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
              get chunkSize() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
            if (typeof XMLHttpRequest != "undefined") {
              if (!ENVIRONMENT_IS_WORKER)
                throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
              var lazyArray = new LazyUint8Array();
              var properties = {
                isDevice: false,
                contents: lazyArray
              };
            } else {
              var properties = {
                isDevice: false,
                url
              };
            }
            var node = FS.createFile(parent, name, properties, canRead, canWrite);
            if (properties.contents) {
              node.contents = properties.contents;
            } else if (properties.url) {
              node.contents = null;
              node.url = properties.url;
            }
            Object.defineProperties(node, {
              usedBytes: {
                get: function() {
                  return this.contents.length;
                }
              }
            });
            var stream_ops = {};
            var keys = Object.keys(node.stream_ops);
            keys.forEach((key) => {
              var fn = node.stream_ops[key];
              stream_ops[key] = (...args) => {
                FS.forceLoadFile(node);
                return fn(...args);
              };
            });
            function writeChunks(stream, buffer, offset, length, position) {
              var contents = stream.node.contents;
              if (position >= contents.length)
                return 0;
              var size = Math.min(contents.length - position, length);
              assert(size >= 0);
              if (contents.slice) {
                for (var i = 0; i < size; i++) {
                  buffer[offset + i] = contents[position + i];
                }
              } else {
                for (var i = 0; i < size; i++) {
                  buffer[offset + i] = contents.get(position + i);
                }
              }
              return size;
            }
            stream_ops.read = (stream, buffer, offset, length, position) => {
              FS.forceLoadFile(node);
              return writeChunks(stream, buffer, offset, length, position);
            };
            stream_ops.mmap = (stream, length, position, prot, flags) => {
              FS.forceLoadFile(node);
              var ptr = mmapAlloc(length);
              if (!ptr) {
                throw new FS.ErrnoError(48);
              }
              writeChunks(stream, HEAP8, ptr, length, position);
              return {
                ptr,
                allocated: true
              };
            };
            node.stream_ops = stream_ops;
            return node;
          },
          absolutePath() {
            abort("FS.absolutePath has been removed; use PATH_FS.resolve instead");
          },
          createFolder() {
            abort("FS.createFolder has been removed; use FS.mkdir instead");
          },
          createLink() {
            abort("FS.createLink has been removed; use FS.symlink instead");
          },
          joinPath() {
            abort("FS.joinPath has been removed; use PATH.join instead");
          },
          mmapAlloc() {
            abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
          },
          standardizePath() {
            abort("FS.standardizePath has been removed; use PATH.normalize instead");
          }
        };
        var SYSCALLS = {
          DEFAULT_POLLMASK: 5,
          calculateAt(dirfd, path, allowEmpty) {
            if (PATH.isAbs(path)) {
              return path;
            }
            var dir;
            if (dirfd === -100) {
              dir = FS.cwd();
            } else {
              var dirstream = SYSCALLS.getStreamFromFD(dirfd);
              dir = dirstream.path;
            }
            if (path.length == 0) {
              if (!allowEmpty) {
                throw new FS.ErrnoError(44);
              }
              return dir;
            }
            return PATH.join2(dir, path);
          },
          doStat(func, path, buf) {
            var stat = func(path);
            HEAP32[buf / 4] = stat.dev;
            HEAP32[(buf + 4) / 4] = stat.mode;
            HEAPU64[(buf + 8) / 8] = BigInt(stat.nlink);
            HEAP32[(buf + 16) / 4] = stat.uid;
            HEAP32[(buf + 20) / 4] = stat.gid;
            HEAP32[(buf + 24) / 4] = stat.rdev;
            HEAP64[(buf + 32) / 8] = BigInt(stat.size);
            HEAP32[(buf + 40) / 4] = 4096;
            HEAP32[(buf + 44) / 4] = stat.blocks;
            var atime = stat.atime.getTime();
            var mtime = stat.mtime.getTime();
            var ctime = stat.ctime.getTime();
            HEAP64[(buf + 48) / 8] = BigInt(Math.floor(atime / 1e3));
            HEAPU64[(buf + 56) / 8] = BigInt(atime % 1e3 * 1e3);
            HEAP64[(buf + 64) / 8] = BigInt(Math.floor(mtime / 1e3));
            HEAPU64[(buf + 72) / 8] = BigInt(mtime % 1e3 * 1e3);
            HEAP64[(buf + 80) / 8] = BigInt(Math.floor(ctime / 1e3));
            HEAPU64[(buf + 88) / 8] = BigInt(ctime % 1e3 * 1e3);
            HEAP64[(buf + 96) / 8] = BigInt(stat.ino);
            return 0;
          },
          doMsync(addr, stream, len, flags, offset) {
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(43);
            }
            if (flags & 2) {
              return 0;
            }
            var buffer = HEAPU8.slice(addr, addr + len);
            FS.msync(stream, buffer, offset, len, flags);
          },
          getStreamFromFD(fd) {
            var stream = FS.getStreamChecked(fd);
            return stream;
          },
          varargs: void 0,
          getStr(ptr) {
            var ret = UTF8ToString(ptr);
            return ret;
          }
        };
        function ___syscall_chmod(path, mode) {
          path = bigintToI53Checked(path);
          try {
            path = SYSCALLS.getStr(path);
            FS.chmod(path, mode);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_dup3(fd, newfd, flags) {
          try {
            var old = SYSCALLS.getStreamFromFD(fd);
            assert(!flags);
            if (old.fd === newfd)
              return -28;
            var existing = FS.getStream(newfd);
            if (existing)
              FS.close(existing);
            return FS.dupStream(old, newfd).fd;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_faccessat(dirfd, path, amode, flags) {
          path = bigintToI53Checked(path);
          try {
            path = SYSCALLS.getStr(path);
            assert(flags === 0);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (amode & ~7) {
              return -28;
            }
            var lookup = FS.lookupPath(path, {
              follow: true
            });
            var node = lookup.node;
            if (!node) {
              return -44;
            }
            var perms = "";
            if (amode & 4)
              perms += "r";
            if (amode & 2)
              perms += "w";
            if (amode & 1)
              perms += "x";
            if (perms && /* otherwise, they've just passed F_OK */
            FS.nodePermissions(node, perms)) {
              return -2;
            }
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fchmod(fd, mode) {
          try {
            FS.fchmod(fd, mode);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fchown32(fd, owner, group) {
          try {
            FS.fchown(fd, owner, group);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function syscallGetVarargP() {
          assert(SYSCALLS.varargs != void 0);
          var ret = Number(HEAPU64[SYSCALLS.varargs / 8]);
          SYSCALLS.varargs += 8;
          return ret;
        }
        function syscallGetVarargI() {
          assert(SYSCALLS.varargs != void 0);
          var ret = HEAP32[+SYSCALLS.varargs / 4];
          SYSCALLS.varargs += 4;
          return ret;
        }
        function ___syscall_fcntl64(fd, cmd, varargs) {
          varargs = bigintToI53Checked(varargs);
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (cmd) {
              case 0: {
                var arg = syscallGetVarargI();
                if (arg < 0) {
                  return -28;
                }
                while (FS.streams[arg]) {
                  arg++;
                }
                var newStream;
                newStream = FS.dupStream(stream, arg);
                return newStream.fd;
              }
              case 1:
              case 2:
                return 0;
              case 3:
                return stream.flags;
              case 4: {
                var arg = syscallGetVarargI();
                stream.flags |= arg;
                return 0;
              }
              case 5: {
                var arg = syscallGetVarargP();
                var offset = 0;
                HEAP16[(arg + offset) / 2] = 2;
                return 0;
              }
              case 6:
              case 7:
                return 0;
            }
            return -28;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_fstat64(fd, buf) {
          buf = bigintToI53Checked(buf);
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            return SYSCALLS.doStat(FS.stat, stream.path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_ftruncate64(fd, length) {
          length = bigintToI53Checked(length);
          try {
            if (isNaN(length))
              return 61;
            FS.ftruncate(fd, length);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
          assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        };
        function ___syscall_getcwd(buf, size) {
          buf = bigintToI53Checked(buf);
          size = bigintToI53Checked(size);
          try {
            if (size === 0)
              return -28;
            var cwd = FS.cwd();
            var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
            if (size < cwdLengthInBytes)
              return -68;
            stringToUTF8(cwd, buf, size);
            return cwdLengthInBytes;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_ioctl(fd, op, varargs) {
          varargs = bigintToI53Checked(varargs);
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (op) {
              case 21509: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              case 21505: {
                if (!stream.tty)
                  return -59;
                if (stream.tty.ops.ioctl_tcgets) {
                  var termios = stream.tty.ops.ioctl_tcgets(stream);
                  var argp = syscallGetVarargP();
                  HEAP32[argp / 4] = termios.c_iflag || 0;
                  HEAP32[(argp + 4) / 4] = termios.c_oflag || 0;
                  HEAP32[(argp + 8) / 4] = termios.c_cflag || 0;
                  HEAP32[(argp + 12) / 4] = termios.c_lflag || 0;
                  for (var i = 0; i < 32; i++) {
                    HEAP8[argp + i + 17] = termios.c_cc[i] || 0;
                  }
                  return 0;
                }
                return 0;
              }
              case 21510:
              case 21511:
              case 21512: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              case 21506:
              case 21507:
              case 21508: {
                if (!stream.tty)
                  return -59;
                if (stream.tty.ops.ioctl_tcsets) {
                  var argp = syscallGetVarargP();
                  var c_iflag = HEAP32[argp / 4];
                  var c_oflag = HEAP32[(argp + 4) / 4];
                  var c_cflag = HEAP32[(argp + 8) / 4];
                  var c_lflag = HEAP32[(argp + 12) / 4];
                  var c_cc = [];
                  for (var i = 0; i < 32; i++) {
                    c_cc.push(HEAP8[argp + i + 17]);
                  }
                  return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
                    c_iflag,
                    c_oflag,
                    c_cflag,
                    c_lflag,
                    c_cc
                  });
                }
                return 0;
              }
              case 21519: {
                if (!stream.tty)
                  return -59;
                var argp = syscallGetVarargP();
                HEAP32[argp / 4] = 0;
                return 0;
              }
              case 21520: {
                if (!stream.tty)
                  return -59;
                return -28;
              }
              case 21531: {
                var argp = syscallGetVarargP();
                return FS.ioctl(stream, op, argp);
              }
              case 21523: {
                if (!stream.tty)
                  return -59;
                if (stream.tty.ops.ioctl_tiocgwinsz) {
                  var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
                  var argp = syscallGetVarargP();
                  HEAP16[argp / 2] = winsize[0];
                  HEAP16[(argp + 2) / 2] = winsize[1];
                }
                return 0;
              }
              case 21524: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              case 21515: {
                if (!stream.tty)
                  return -59;
                return 0;
              }
              default:
                return -28;
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_lstat64(path, buf) {
          path = bigintToI53Checked(path);
          buf = bigintToI53Checked(buf);
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.lstat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_mkdirat(dirfd, path, mode) {
          path = bigintToI53Checked(path);
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            path = PATH.normalize(path);
            if (path[path.length - 1] === "/")
              path = path.substr(0, path.length - 1);
            FS.mkdir(path, mode, 0);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_newfstatat(dirfd, path, buf, flags) {
          path = bigintToI53Checked(path);
          buf = bigintToI53Checked(buf);
          try {
            path = SYSCALLS.getStr(path);
            var nofollow = flags & 256;
            var allowEmpty = flags & 4096;
            flags = flags & ~6400;
            assert(!flags, `unknown flags in __syscall_newfstatat: ${flags}`);
            path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
            return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_openat(dirfd, path, flags, varargs) {
          path = bigintToI53Checked(path);
          varargs = bigintToI53Checked(varargs);
          SYSCALLS.varargs = varargs;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            var mode = varargs ? syscallGetVarargI() : 0;
            return FS.open(path, flags, mode).fd;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
          path = bigintToI53Checked(path);
          buf = bigintToI53Checked(buf);
          bufsize = bigintToI53Checked(bufsize);
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (bufsize <= 0)
              return -28;
            var ret = FS.readlink(path);
            var len = Math.min(bufsize, lengthBytesUTF8(ret));
            var endChar = HEAP8[buf + len];
            stringToUTF8(ret, buf, bufsize + 1);
            HEAP8[buf + len] = endChar;
            return len;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
          oldpath = bigintToI53Checked(oldpath);
          newpath = bigintToI53Checked(newpath);
          try {
            oldpath = SYSCALLS.getStr(oldpath);
            newpath = SYSCALLS.getStr(newpath);
            oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
            newpath = SYSCALLS.calculateAt(newdirfd, newpath);
            FS.rename(oldpath, newpath);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_rmdir(path) {
          path = bigintToI53Checked(path);
          try {
            path = SYSCALLS.getStr(path);
            FS.rmdir(path);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_stat64(path, buf) {
          path = bigintToI53Checked(path);
          buf = bigintToI53Checked(buf);
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.stat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        function ___syscall_unlinkat(dirfd, path, flags) {
          path = bigintToI53Checked(path);
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (flags === 0) {
              FS.unlink(path);
            } else if (flags === 512) {
              FS.rmdir(path);
            } else {
              abort("Invalid flags passed to unlinkat");
            }
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var readI53FromI64 = (ptr) => HEAPU32[ptr / 4] + HEAP32[(ptr + 4) / 4] * 4294967296;
        function ___syscall_utimensat(dirfd, path, times, flags) {
          path = bigintToI53Checked(path);
          times = bigintToI53Checked(times);
          try {
            path = SYSCALLS.getStr(path);
            assert(flags === 0);
            path = SYSCALLS.calculateAt(dirfd, path, true);
            if (!times) {
              var atime = Date.now();
              var mtime = atime;
            } else {
              var seconds = readI53FromI64(times);
              var nanoseconds = HEAP32[(times + 8) / 4];
              atime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
              times += 16;
              seconds = readI53FromI64(times);
              nanoseconds = HEAP32[(times + 8) / 4];
              mtime = seconds * 1e3 + nanoseconds / (1e3 * 1e3);
            }
            FS.utime(path, atime, mtime);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var __abort_js = () => {
          abort("native code called abort()");
        };
        var nowIsMonotonic = 1;
        var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;
        function __emscripten_memcpy_js(dest, src, num) {
          dest = bigintToI53Checked(dest);
          src = bigintToI53Checked(src);
          num = bigintToI53Checked(num);
          return HEAPU8.copyWithin(dest, src, src + num);
        }
        function __emscripten_system(command) {
          command = bigintToI53Checked(command);
          if (false) {
            if (!command)
              return 1;
            var cmdstr = UTF8ToString(command);
            if (!cmdstr.length)
              return 0;
            var cp = null;
            var ret = cp.spawnSync(cmdstr, [], {
              shell: true,
              stdio: "inherit"
            });
            var _W_EXITCODE = (ret2, sig) => ret2 << 8 | sig;
            if (ret.status === null) {
              var signalToNumber = (sig) => {
                switch (sig) {
                  case "SIGHUP":
                    return 1;
                  case "SIGINT":
                    return 2;
                  case "SIGQUIT":
                    return 3;
                  case "SIGFPE":
                    return 8;
                  case "SIGKILL":
                    return 9;
                  case "SIGALRM":
                    return 14;
                  case "SIGTERM":
                    return 15;
                }
                return 2;
              };
              return _W_EXITCODE(0, signalToNumber(ret.signal));
            }
            return _W_EXITCODE(ret.status, 0);
          }
          if (!command)
            return 0;
          return -52;
        }
        var __emscripten_throw_longjmp = () => {
          throw Infinity;
        };
        function __gmtime_js(time, tmPtr) {
          time = bigintToI53Checked(time);
          tmPtr = bigintToI53Checked(tmPtr);
          var date = new Date(time * 1e3);
          HEAP32[tmPtr / 4] = date.getUTCSeconds();
          HEAP32[(tmPtr + 4) / 4] = date.getUTCMinutes();
          HEAP32[(tmPtr + 8) / 4] = date.getUTCHours();
          HEAP32[(tmPtr + 12) / 4] = date.getUTCDate();
          HEAP32[(tmPtr + 16) / 4] = date.getUTCMonth();
          HEAP32[(tmPtr + 20) / 4] = date.getUTCFullYear() - 1900;
          HEAP32[(tmPtr + 24) / 4] = date.getUTCDay();
          var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
          var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
          HEAP32[(tmPtr + 28) / 4] = yday;
        }
        var isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
        var MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var ydayFromDate = (date) => {
          var leap = isLeapYear(date.getFullYear());
          var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
          var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
          return yday;
        };
        function __localtime_js(time, tmPtr) {
          time = bigintToI53Checked(time);
          tmPtr = bigintToI53Checked(tmPtr);
          var date = new Date(time * 1e3);
          HEAP32[tmPtr / 4] = date.getSeconds();
          HEAP32[(tmPtr + 4) / 4] = date.getMinutes();
          HEAP32[(tmPtr + 8) / 4] = date.getHours();
          HEAP32[(tmPtr + 12) / 4] = date.getDate();
          HEAP32[(tmPtr + 16) / 4] = date.getMonth();
          HEAP32[(tmPtr + 20) / 4] = date.getFullYear() - 1900;
          HEAP32[(tmPtr + 24) / 4] = date.getDay();
          var yday = ydayFromDate(date) | 0;
          HEAP32[(tmPtr + 28) / 4] = yday;
          HEAP64[(tmPtr + 40) / 8] = BigInt(-(date.getTimezoneOffset() * 60));
          var start = new Date(date.getFullYear(), 0, 1);
          var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
          var winterOffset = start.getTimezoneOffset();
          var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
          HEAP32[(tmPtr + 32) / 4] = dst;
        }
        var __mktime_js = function(tmPtr) {
          tmPtr = bigintToI53Checked(tmPtr);
          var ret = (() => {
            var date = new Date(HEAP32[(tmPtr + 20) / 4] + 1900, HEAP32[(tmPtr + 16) / 4], HEAP32[(tmPtr + 12) / 4], HEAP32[(tmPtr + 8) / 4], HEAP32[(tmPtr + 4) / 4], HEAP32[tmPtr / 4], 0);
            var dst = HEAP32[(tmPtr + 32) / 4];
            var guessedOffset = date.getTimezoneOffset();
            var start = new Date(date.getFullYear(), 0, 1);
            var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
            var winterOffset = start.getTimezoneOffset();
            var dstOffset = Math.min(winterOffset, summerOffset);
            if (dst < 0) {
              HEAP32[(tmPtr + 32) / 4] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
            } else if (dst > 0 != (dstOffset == guessedOffset)) {
              var nonDstOffset = Math.max(winterOffset, summerOffset);
              var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
              date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
            }
            HEAP32[(tmPtr + 24) / 4] = date.getDay();
            var yday = ydayFromDate(date) | 0;
            HEAP32[(tmPtr + 28) / 4] = yday;
            HEAP32[tmPtr / 4] = date.getSeconds();
            HEAP32[(tmPtr + 4) / 4] = date.getMinutes();
            HEAP32[(tmPtr + 8) / 4] = date.getHours();
            HEAP32[(tmPtr + 12) / 4] = date.getDate();
            HEAP32[(tmPtr + 16) / 4] = date.getMonth();
            HEAP32[(tmPtr + 20) / 4] = date.getYear();
            var timeMs = date.getTime();
            if (isNaN(timeMs)) {
              return -1;
            }
            return timeMs / 1e3;
          })();
          return BigInt(ret);
        };
        function __munmap_js(addr, len, prot, flags, fd, offset) {
          addr = bigintToI53Checked(addr);
          len = bigintToI53Checked(len);
          offset = bigintToI53Checked(offset);
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            if (prot & 2) {
              SYSCALLS.doMsync(addr, stream, len, flags, offset);
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return -e.errno;
          }
        }
        var __tzset_js = function(timezone, daylight, std_name, dst_name) {
          timezone = bigintToI53Checked(timezone);
          daylight = bigintToI53Checked(daylight);
          std_name = bigintToI53Checked(std_name);
          dst_name = bigintToI53Checked(dst_name);
          var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
          var winter = new Date(currentYear, 0, 1);
          var summer = new Date(currentYear, 6, 1);
          var winterOffset = winter.getTimezoneOffset();
          var summerOffset = summer.getTimezoneOffset();
          var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
          HEAPU64[timezone / 8] = BigInt(stdTimezoneOffset * 60);
          HEAP32[daylight / 4] = Number(winterOffset != summerOffset);
          var extractZone = (date) => date.toLocaleTimeString(void 0, {
            hour12: false,
            timeZoneName: "short"
          }).split(" ")[1];
          var winterName = extractZone(winter);
          var summerName = extractZone(summer);
          assert(winterName);
          assert(summerName);
          assert(lengthBytesUTF8(winterName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${winterName})`);
          assert(lengthBytesUTF8(summerName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${summerName})`);
          if (summerOffset < winterOffset) {
            stringToUTF8(winterName, std_name, 17);
            stringToUTF8(summerName, dst_name, 17);
          } else {
            stringToUTF8(winterName, dst_name, 17);
            stringToUTF8(summerName, std_name, 17);
          }
        };
        var _emscripten_date_now = () => Date.now();
        function _emscripten_err(str) {
          str = bigintToI53Checked(str);
          return err(UTF8ToString(str));
        }
        var getHeapMax = () => 17179869184;
        var _emscripten_get_heap_max = () => BigInt(getHeapMax());
        var _emscripten_get_now;
        _emscripten_get_now = () => deterministicNow();
        var growMemory = (size) => {
          var b = wasmMemory.buffer;
          var pages = (size - b.byteLength + 65535) / 65536;
          try {
            wasmMemory.grow(pages);
            updateMemoryViews();
            return 1;
          } catch (e) {
            err(`growMemory: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`);
          }
        };
        function _emscripten_resize_heap(requestedSize) {
          requestedSize = bigintToI53Checked(requestedSize);
          var oldSize = HEAPU8.length;
          assert(requestedSize > oldSize);
          var maxHeapSize = getHeapMax();
          if (requestedSize > maxHeapSize) {
            err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
            return false;
          }
          var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
          for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
            var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
            var replacement = growMemory(newSize);
            if (replacement) {
              return true;
            }
          }
          err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
          return false;
        }
        var ENV = {};
        var getExecutableName = () => thisProgram || "./this.program";
        var getEnvStrings = () => {
          if (!getEnvStrings.strings) {
            var lang = "C.UTF-8";
            var env = {
              "USER": "web_user",
              "LOGNAME": "web_user",
              "PATH": "/",
              "PWD": "/",
              "HOME": "/home/web_user",
              "LANG": lang,
              "_": getExecutableName()
            };
            for (var x in ENV) {
              if (ENV[x] === void 0)
                delete env[x];
              else
                env[x] = ENV[x];
            }
            var strings = [];
            for (var x in env) {
              strings.push(`${x}=${env[x]}`);
            }
            getEnvStrings.strings = strings;
          }
          return getEnvStrings.strings;
        };
        var stringToAscii = (str, buffer) => {
          for (var i = 0; i < str.length; ++i) {
            assert(str.charCodeAt(i) === (str.charCodeAt(i) & 255));
            HEAP8[buffer++] = str.charCodeAt(i);
          }
          HEAP8[buffer] = 0;
        };
        var _environ_get = function(__environ, environ_buf) {
          __environ = bigintToI53Checked(__environ);
          environ_buf = bigintToI53Checked(environ_buf);
          var bufSize = 0;
          getEnvStrings().forEach((string, i) => {
            var ptr = environ_buf + bufSize;
            HEAPU64[(__environ + i * 8) / 8] = BigInt(ptr);
            stringToAscii(string, ptr);
            bufSize += string.length + 1;
          });
          return 0;
        };
        var _environ_sizes_get = function(penviron_count, penviron_buf_size) {
          penviron_count = bigintToI53Checked(penviron_count);
          penviron_buf_size = bigintToI53Checked(penviron_buf_size);
          var strings = getEnvStrings();
          HEAPU64[penviron_count / 8] = BigInt(strings.length);
          var bufSize = 0;
          strings.forEach((string) => bufSize += string.length + 1);
          HEAPU64[penviron_buf_size / 8] = BigInt(bufSize);
          return 0;
        };
        var runtimeKeepaliveCounter = 0;
        var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
        var _proc_exit = (code) => {
          EXITSTATUS = code;
          if (!keepRuntimeAlive()) {
            Module2["onExit"]?.(code);
            ABORT = true;
          }
          quit_(code, new ExitStatus(code));
        };
        var exitJS = (status, implicit) => {
          EXITSTATUS = status;
          checkUnflushedContent();
          if (keepRuntimeAlive() && !implicit) {
            var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
            readyPromiseReject(msg);
            err(msg);
          }
          _proc_exit(status);
        };
        var _exit = exitJS;
        function _fd_close(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.close(stream);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        function _fd_fdstat_get(fd, pbuf) {
          pbuf = bigintToI53Checked(pbuf);
          try {
            var rightsBase = 0;
            var rightsInheriting = 0;
            var flags = 0;
            {
              var stream = SYSCALLS.getStreamFromFD(fd);
              var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
            }
            HEAP8[pbuf] = type;
            HEAP16[(pbuf + 2) / 2] = flags;
            HEAP64[(pbuf + 8) / 8] = BigInt(rightsBase);
            HEAP64[(pbuf + 16) / 8] = BigInt(rightsInheriting);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        var doReadv = (stream, iov, iovcnt, offset) => {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = Number(HEAPU64[iov / 8]);
            var len = Number(HEAPU64[(iov + 8) / 8]);
            iov += 16;
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
              return -1;
            ret += curr;
            if (curr < len)
              break;
            if (typeof offset != "undefined") {
              offset += curr;
            }
          }
          return ret;
        };
        function _fd_read(fd, iov, iovcnt, pnum) {
          iov = bigintToI53Checked(iov);
          iovcnt = bigintToI53Checked(iovcnt);
          pnum = bigintToI53Checked(pnum);
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doReadv(stream, iov, iovcnt);
            HEAPU64[pnum / 8] = BigInt(num);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        function _fd_seek(fd, offset, whence, newOffset) {
          offset = bigintToI53Checked(offset);
          newOffset = bigintToI53Checked(newOffset);
          try {
            if (isNaN(offset))
              return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.llseek(stream, offset, whence);
            HEAP64[newOffset / 8] = BigInt(stream.position);
            if (stream.getdents && offset === 0 && whence === 0)
              stream.getdents = null;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        var _fd_sync = function(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            return Asyncify.handleSleep((wakeUp) => {
              var mount = stream.node.mount;
              if (!mount.type.syncfs) {
                wakeUp(0);
                return;
              }
              mount.type.syncfs(mount, false, (err2) => {
                if (err2) {
                  wakeUp(29);
                  return;
                }
                wakeUp(0);
              });
            });
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        };
        _fd_sync.isAsync = true;
        var doWritev = (stream, iov, iovcnt, offset) => {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = Number(HEAPU64[iov / 8]);
            var len = Number(HEAPU64[(iov + 8) / 8]);
            iov += 16;
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
              return -1;
            ret += curr;
            if (typeof offset != "undefined") {
              offset += curr;
            }
          }
          return ret;
        };
        function _fd_write(fd, iov, iovcnt, pnum) {
          iov = bigintToI53Checked(iov);
          iovcnt = bigintToI53Checked(iovcnt);
          pnum = bigintToI53Checked(pnum);
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doWritev(stream, iov, iovcnt);
            HEAPU64[pnum / 8] = BigInt(num);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
              throw e;
            return e.errno;
          }
        }
        var arraySum = (array, index) => {
          var sum = 0;
          for (var i = 0; i <= index; sum += array[i++]) {
          }
          return sum;
        };
        var MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var addDays = (date, days) => {
          var newDate = new Date(date.getTime());
          while (days > 0) {
            var leap = isLeapYear(newDate.getFullYear());
            var currentMonth = newDate.getMonth();
            var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
            if (days > daysInCurrentMonth - newDate.getDate()) {
              days -= daysInCurrentMonth - newDate.getDate() + 1;
              newDate.setDate(1);
              if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1);
              } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1);
              }
            } else {
              newDate.setDate(newDate.getDate() + days);
              return newDate;
            }
          }
          return newDate;
        };
        var writeArrayToMemory = (array, buffer) => {
          assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
          HEAP8.set(array, buffer);
        };
        var _strftime = function(s, maxsize, format, tm) {
          s = bigintToI53Checked(s);
          maxsize = bigintToI53Checked(maxsize);
          format = bigintToI53Checked(format);
          tm = bigintToI53Checked(tm);
          var ret = (() => {
            var tm_zone = Number(HEAPU64[(tm + 48) / 8]);
            var date = {
              tm_sec: HEAP32[tm / 4],
              tm_min: HEAP32[(tm + 4) / 4],
              tm_hour: HEAP32[(tm + 8) / 4],
              tm_mday: HEAP32[(tm + 12) / 4],
              tm_mon: HEAP32[(tm + 16) / 4],
              tm_year: HEAP32[(tm + 20) / 4],
              tm_wday: HEAP32[(tm + 24) / 4],
              tm_yday: HEAP32[(tm + 28) / 4],
              tm_isdst: HEAP32[(tm + 32) / 4],
              tm_gmtoff: HEAP64[(tm + 40) / 8],
              tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
            };
            date.tm_gmtoff = Number(date.tm_gmtoff);
            var pattern = UTF8ToString(format);
            var EXPANSION_RULES_1 = {
              "%c": "%a %b %d %H:%M:%S %Y",
              "%D": "%m/%d/%y",
              "%F": "%Y-%m-%d",
              "%h": "%b",
              "%r": "%I:%M:%S %p",
              "%R": "%H:%M",
              "%T": "%H:%M:%S",
              "%x": "%m/%d/%y",
              "%X": "%H:%M:%S",
              "%Ec": "%c",
              "%EC": "%C",
              "%Ex": "%m/%d/%y",
              "%EX": "%H:%M:%S",
              "%Ey": "%y",
              "%EY": "%Y",
              "%Od": "%d",
              "%Oe": "%e",
              "%OH": "%H",
              "%OI": "%I",
              "%Om": "%m",
              "%OM": "%M",
              "%OS": "%S",
              "%Ou": "%u",
              "%OU": "%U",
              "%OV": "%V",
              "%Ow": "%w",
              "%OW": "%W",
              "%Oy": "%y"
            };
            for (var rule in EXPANSION_RULES_1) {
              pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
            }
            var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            function leadingSomething(value, digits, character) {
              var str = typeof value == "number" ? value.toString() : value || "";
              while (str.length < digits) {
                str = character[0] + str;
              }
              return str;
            }
            function leadingNulls(value, digits) {
              return leadingSomething(value, digits, "0");
            }
            function compareByDay(date1, date2) {
              function sgn(value) {
                return value < 0 ? -1 : value > 0 ? 1 : 0;
              }
              var compare;
              if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
                if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                  compare = sgn(date1.getDate() - date2.getDate());
                }
              }
              return compare;
            }
            function getFirstWeekStartDate(janFourth) {
              switch (janFourth.getDay()) {
                case 0:
                  return new Date(janFourth.getFullYear() - 1, 11, 29);
                case 1:
                  return janFourth;
                case 2:
                  return new Date(janFourth.getFullYear(), 0, 3);
                case 3:
                  return new Date(janFourth.getFullYear(), 0, 2);
                case 4:
                  return new Date(janFourth.getFullYear(), 0, 1);
                case 5:
                  return new Date(janFourth.getFullYear() - 1, 11, 31);
                case 6:
                  return new Date(janFourth.getFullYear() - 1, 11, 30);
              }
            }
            function getWeekBasedYear(date2) {
              var thisDate = addDays(new Date(date2.tm_year + 1900, 0, 1), date2.tm_yday);
              var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
              var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
              var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
              var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
              if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
                if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                  return thisDate.getFullYear() + 1;
                }
                return thisDate.getFullYear();
              }
              return thisDate.getFullYear() - 1;
            }
            var EXPANSION_RULES_2 = {
              "%a": (date2) => WEEKDAYS[date2.tm_wday].substring(0, 3),
              "%A": (date2) => WEEKDAYS[date2.tm_wday],
              "%b": (date2) => MONTHS[date2.tm_mon].substring(0, 3),
              "%B": (date2) => MONTHS[date2.tm_mon],
              "%C": (date2) => {
                var year = date2.tm_year + 1900;
                return leadingNulls(year / 100 | 0, 2);
              },
              "%d": (date2) => leadingNulls(date2.tm_mday, 2),
              "%e": (date2) => leadingSomething(date2.tm_mday, 2, " "),
              "%g": (date2) => getWeekBasedYear(date2).toString().substring(2),
              "%G": getWeekBasedYear,
              "%H": (date2) => leadingNulls(date2.tm_hour, 2),
              "%I": (date2) => {
                var twelveHour = date2.tm_hour;
                if (twelveHour == 0)
                  twelveHour = 12;
                else if (twelveHour > 12)
                  twelveHour -= 12;
                return leadingNulls(twelveHour, 2);
              },
              "%j": (date2) => leadingNulls(date2.tm_mday + arraySum(isLeapYear(date2.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date2.tm_mon - 1), 3),
              "%m": (date2) => leadingNulls(date2.tm_mon + 1, 2),
              "%M": (date2) => leadingNulls(date2.tm_min, 2),
              "%n": () => "\n",
              "%p": (date2) => {
                if (date2.tm_hour >= 0 && date2.tm_hour < 12) {
                  return "AM";
                }
                return "PM";
              },
              "%S": (date2) => leadingNulls(date2.tm_sec, 2),
              "%t": () => "	",
              "%u": (date2) => date2.tm_wday || 7,
              "%U": (date2) => {
                var days = date2.tm_yday + 7 - date2.tm_wday;
                return leadingNulls(Math.floor(days / 7), 2);
              },
              "%V": (date2) => {
                var val = Math.floor((date2.tm_yday + 7 - (date2.tm_wday + 6) % 7) / 7);
                if ((date2.tm_wday + 371 - date2.tm_yday - 2) % 7 <= 2) {
                  val++;
                }
                if (!val) {
                  val = 52;
                  var dec31 = (date2.tm_wday + 7 - date2.tm_yday - 1) % 7;
                  if (dec31 == 4 || dec31 == 5 && isLeapYear(date2.tm_year % 400 - 1)) {
                    val++;
                  }
                } else if (val == 53) {
                  var jan1 = (date2.tm_wday + 371 - date2.tm_yday) % 7;
                  if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date2.tm_year)))
                    val = 1;
                }
                return leadingNulls(val, 2);
              },
              "%w": (date2) => date2.tm_wday,
              "%W": (date2) => {
                var days = date2.tm_yday + 7 - (date2.tm_wday + 6) % 7;
                return leadingNulls(Math.floor(days / 7), 2);
              },
              "%y": (date2) => (date2.tm_year + 1900).toString().substring(2),
              "%Y": (date2) => date2.tm_year + 1900,
              "%z": (date2) => {
                var off = date2.tm_gmtoff;
                var ahead = off >= 0;
                off = Math.abs(off) / 60;
                off = off / 60 * 100 + off % 60;
                return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
              },
              "%Z": (date2) => date2.tm_zone,
              "%%": () => "%"
            };
            pattern = pattern.replace(/%%/g, "\0\0");
            for (var rule in EXPANSION_RULES_2) {
              if (pattern.includes(rule)) {
                pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
              }
            }
            pattern = pattern.replace(/\0\0/g, "%");
            var bytes = intArrayFromString(pattern, false);
            if (bytes.length > maxsize) {
              return 0;
            }
            writeArrayToMemory(bytes, s);
            return bytes.length - 1;
          })();
          return BigInt(ret);
        };
        var _strftime_l = function(s, maxsize, format, tm, loc) {
          s = bigintToI53Checked(s);
          maxsize = bigintToI53Checked(maxsize);
          format = bigintToI53Checked(format);
          tm = bigintToI53Checked(tm);
          loc = bigintToI53Checked(loc);
          var ret = (() => _strftime(s, maxsize, format, tm))();
          return BigInt(ret);
        };
        var wasmTableMirror = [];
        var wasmTable;
        var runAndAbortIfError = (func) => {
          try {
            return func();
          } catch (e) {
            abort(e);
          }
        };
        var handleException = (e) => {
          if (e instanceof ExitStatus || e == "unwind") {
            return EXITSTATUS;
          }
          checkStackCookie();
          if (e instanceof WebAssembly.RuntimeError) {
            if (_emscripten_stack_get_current() <= 0) {
              err("Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 41943040)");
            }
          }
          quit_(1, e);
        };
        var maybeExit = () => {
          if (!keepRuntimeAlive()) {
            try {
              _exit(EXITSTATUS);
            } catch (e) {
              handleException(e);
            }
          }
        };
        var callUserCallback = (func) => {
          if (ABORT) {
            err("user callback triggered after runtime exited or application aborted.  Ignoring.");
            return;
          }
          try {
            func();
            maybeExit();
          } catch (e) {
            handleException(e);
          }
        };
        var runtimeKeepalivePush = () => {
          runtimeKeepaliveCounter += 1;
        };
        var runtimeKeepalivePop = () => {
          assert(runtimeKeepaliveCounter > 0);
          runtimeKeepaliveCounter -= 1;
        };
        var Asyncify = {
          rewindArguments: {},
          instrumentWasmImports(imports) {
            var importPattern = /^(invoke_.*|__asyncjs__.*)$/;
            for (let [x, original] of Object.entries(imports)) {
              if (typeof original == "function") {
                let isAsyncifyImport = original.isAsync || importPattern.test(x);
                imports[x] = (...args) => {
                  var originalAsyncifyState = Asyncify.state;
                  try {
                    return original(...args);
                  } finally {
                    var changedToDisabled = originalAsyncifyState === Asyncify.State.Normal && Asyncify.state === Asyncify.State.Disabled;
                    var ignoredInvoke = x.startsWith("invoke_") && true;
                    if (Asyncify.state !== originalAsyncifyState && !isAsyncifyImport && !changedToDisabled && !ignoredInvoke) {
                      throw new Error(`import ${x} was not in ASYNCIFY_IMPORTS, but changed the state`);
                    }
                  }
                };
              }
            }
          },
          saveOrRestoreRewindArguments(funcName, passedArguments) {
            if (passedArguments.length === 0) {
              return Asyncify.rewindArguments[funcName] || [];
            }
            return Asyncify.rewindArguments[funcName] = Array.from(passedArguments);
          },
          instrumentWasmExports(exports3) {
            var ret = {};
            for (let [x, original] of Object.entries(exports3)) {
              if (typeof original == "function") {
                ret[x] = (...args) => {
                  Asyncify.exportCallStack.push(x);
                  try {
                    return original(...Asyncify.saveOrRestoreRewindArguments(x, args));
                  } finally {
                    if (!ABORT) {
                      var y = Asyncify.exportCallStack.pop();
                      assert(y === x);
                      Asyncify.maybeStopUnwind();
                    }
                  }
                };
              } else {
                ret[x] = original;
              }
            }
            return ret;
          },
          State: {
            Normal: 0,
            Unwinding: 1,
            Rewinding: 2,
            Disabled: 3
          },
          state: 0,
          StackSize: 41943040,
          currData: null,
          handleSleepReturnValue: 0,
          exportCallStack: [],
          callStackNameToId: {},
          callStackIdToName: {},
          callStackId: 0,
          asyncPromiseHandlers: null,
          sleepCallbacks: [],
          getCallStackId(funcName) {
            var id = Asyncify.callStackNameToId[funcName];
            if (id === void 0) {
              id = Asyncify.callStackId++;
              Asyncify.callStackNameToId[funcName] = id;
              Asyncify.callStackIdToName[id] = funcName;
            }
            return id;
          },
          maybeStopUnwind() {
            if (Asyncify.currData && Asyncify.state === Asyncify.State.Unwinding && Asyncify.exportCallStack.length === 0) {
              Asyncify.state = Asyncify.State.Normal;
              runAndAbortIfError(_asyncify_stop_unwind);
              if (typeof Fibers != "undefined") {
                Fibers.trampoline();
              }
            }
          },
          whenDone() {
            assert(Asyncify.currData, "Tried to wait for an async operation when none is in progress.");
            assert(!Asyncify.asyncPromiseHandlers, "Cannot have multiple async operations in flight at once");
            return new Promise((resolve, reject) => {
              Asyncify.asyncPromiseHandlers = {
                resolve,
                reject
              };
            });
          },
          allocateData() {
            var ptr = _malloc(24 + Asyncify.StackSize);
            Asyncify.setDataHeader(ptr, ptr + 24, Asyncify.StackSize);
            Asyncify.setDataRewindFunc(ptr);
            return ptr;
          },
          setDataHeader(ptr, stack, stackSize) {
            HEAPU64[ptr / 8] = BigInt(stack);
            HEAPU64[(ptr + 8) / 8] = BigInt(stack + stackSize);
          },
          setDataRewindFunc(ptr) {
            var bottomOfCallStack = Asyncify.exportCallStack[0];
            var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
            HEAP32[(ptr + 16) / 4] = rewindId;
          },
          getDataRewindFunc(ptr) {
            var id = HEAP32[(ptr + 16) / 4];
            var name = Asyncify.callStackIdToName[id];
            var func = wasmExports[name];
            return func;
          },
          doRewind(ptr) {
            var start = Asyncify.getDataRewindFunc(ptr);
            return start();
          },
          handleSleep(startAsync) {
            assert(Asyncify.state !== Asyncify.State.Disabled, "Asyncify cannot be done during or after the runtime exits");
            if (ABORT)
              return;
            if (Asyncify.state === Asyncify.State.Normal) {
              var reachedCallback = false;
              var reachedAfterCallback = false;
              startAsync((handleSleepReturnValue = 0) => {
                assert(!handleSleepReturnValue || typeof handleSleepReturnValue == "number" || typeof handleSleepReturnValue == "boolean");
                if (ABORT)
                  return;
                Asyncify.handleSleepReturnValue = handleSleepReturnValue;
                reachedCallback = true;
                if (!reachedAfterCallback) {
                  return;
                }
                assert(!Asyncify.exportCallStack.length, "Waking up (starting to rewind) must be done from JS, without compiled code on the stack.");
                Asyncify.state = Asyncify.State.Rewinding;
                runAndAbortIfError(() => _asyncify_start_rewind(Asyncify.currData));
                if (typeof Browser != "undefined" && Browser.mainLoop.func) {
                  Browser.mainLoop.resume();
                }
                var asyncWasmReturnValue, isError = false;
                try {
                  asyncWasmReturnValue = Asyncify.doRewind(Asyncify.currData);
                } catch (err2) {
                  asyncWasmReturnValue = err2;
                  isError = true;
                }
                var handled = false;
                if (!Asyncify.currData) {
                  var asyncPromiseHandlers = Asyncify.asyncPromiseHandlers;
                  if (asyncPromiseHandlers) {
                    Asyncify.asyncPromiseHandlers = null;
                    (isError ? asyncPromiseHandlers.reject : asyncPromiseHandlers.resolve)(asyncWasmReturnValue);
                    handled = true;
                  }
                }
                if (isError && !handled) {
                  throw asyncWasmReturnValue;
                }
              });
              reachedAfterCallback = true;
              if (!reachedCallback) {
                Asyncify.state = Asyncify.State.Unwinding;
                Asyncify.currData = Asyncify.allocateData();
                if (typeof Browser != "undefined" && Browser.mainLoop.func) {
                  Browser.mainLoop.pause();
                }
                runAndAbortIfError(() => _asyncify_start_unwind(Asyncify.currData));
              }
            } else if (Asyncify.state === Asyncify.State.Rewinding) {
              Asyncify.state = Asyncify.State.Normal;
              runAndAbortIfError(_asyncify_stop_rewind);
              _free(Asyncify.currData);
              Asyncify.currData = null;
              Asyncify.sleepCallbacks.forEach(callUserCallback);
            } else {
              abort(`invalid state: ${Asyncify.state}`);
            }
            return Asyncify.handleSleepReturnValue;
          },
          handleAsync(startAsync) {
            return Asyncify.handleSleep((wakeUp) => {
              startAsync().then(wakeUp);
            });
          }
        };
        var getCFunc = (ident) => {
          var func = Module2["_" + ident];
          assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
          return func;
        };
        var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
        var stringToUTF8OnStack = (str) => {
          var size = lengthBytesUTF8(str) + 1;
          var ret = stackAlloc(size);
          stringToUTF8(str, ret, size);
          return ret;
        };
        var ccall = (ident, returnType, argTypes, args, opts) => {
          var toC = {
            "pointer": (p) => BigInt(p),
            "string": (str) => {
              var ret2 = 0;
              if (str !== null && str !== void 0 && str !== 0) {
                ret2 = stringToUTF8OnStack(str);
              }
              return BigInt(ret2);
            },
            "array": (arr) => {
              var ret2 = stackAlloc(arr.length);
              writeArrayToMemory(arr, ret2);
              return BigInt(ret2);
            }
          };
          function convertReturnValue(ret2) {
            if (returnType === "string") {
              ret2 = Number(ret2);
              return UTF8ToString(ret2);
            }
            if (returnType === "pointer")
              return Number(ret2);
            if (returnType === "boolean")
              return Boolean(ret2);
            return ret2;
          }
          var func = getCFunc(ident);
          var cArgs = [];
          var stack = 0;
          assert(returnType !== "array", 'Return type should not be "array".');
          if (args) {
            for (var i = 0; i < args.length; i++) {
              var converter = toC[argTypes[i]];
              if (converter) {
                if (stack === 0)
                  stack = stackSave();
                cArgs[i] = converter(args[i]);
              } else {
                cArgs[i] = args[i];
              }
            }
          }
          var previousAsync = Asyncify.currData;
          var ret = func(...cArgs);
          function onDone(ret2) {
            runtimeKeepalivePop();
            if (stack !== 0)
              stackRestore(stack);
            return convertReturnValue(ret2);
          }
          var asyncMode = opts?.async;
          runtimeKeepalivePush();
          if (Asyncify.currData != previousAsync) {
            assert(!(previousAsync && Asyncify.currData), "We cannot start an async operation when one is already flight");
            assert(!(previousAsync && !Asyncify.currData), "We cannot stop an async operation in flight");
            assert(asyncMode, "The call to " + ident + " is running asynchronously. If this was intended, add the async option to the ccall/cwrap call.");
            return Asyncify.whenDone().then(onDone);
          }
          ret = onDone(ret);
          if (asyncMode)
            return Promise.resolve(ret);
          return ret;
        };
        var cwrap = (ident, returnType, argTypes, opts) => (...args) => ccall(ident, returnType, argTypes, args, opts);
        FS.createPreloadedFile = FS_createPreloadedFile;
        FS.staticInit();
        Module2["FS_createPath"] = FS.createPath;
        Module2["FS_createDataFile"] = FS.createDataFile;
        Module2["FS_createPreloadedFile"] = FS.createPreloadedFile;
        Module2["FS_unlink"] = FS.unlink;
        Module2["FS_createLazyFile"] = FS.createLazyFile;
        Module2["FS_createDevice"] = FS.createDevice;
        function checkIncomingModuleAPI() {
          ignoredModuleProp("fetchSettings");
        }
        var wasmImports = {
          /** @export */
          __assert_fail: ___assert_fail,
          /** @export */
          __asyncjs__weavedrive_close,
          /** @export */
          __asyncjs__weavedrive_open,
          /** @export */
          __asyncjs__weavedrive_read,
          /** @export */
          __cxa_throw: ___cxa_throw,
          /** @export */
          __syscall_chmod: ___syscall_chmod,
          /** @export */
          __syscall_dup3: ___syscall_dup3,
          /** @export */
          __syscall_faccessat: ___syscall_faccessat,
          /** @export */
          __syscall_fchmod: ___syscall_fchmod,
          /** @export */
          __syscall_fchown32: ___syscall_fchown32,
          /** @export */
          __syscall_fcntl64: ___syscall_fcntl64,
          /** @export */
          __syscall_fstat64: ___syscall_fstat64,
          /** @export */
          __syscall_ftruncate64: ___syscall_ftruncate64,
          /** @export */
          __syscall_getcwd: ___syscall_getcwd,
          /** @export */
          __syscall_ioctl: ___syscall_ioctl,
          /** @export */
          __syscall_lstat64: ___syscall_lstat64,
          /** @export */
          __syscall_mkdirat: ___syscall_mkdirat,
          /** @export */
          __syscall_newfstatat: ___syscall_newfstatat,
          /** @export */
          __syscall_openat: ___syscall_openat,
          /** @export */
          __syscall_readlinkat: ___syscall_readlinkat,
          /** @export */
          __syscall_renameat: ___syscall_renameat,
          /** @export */
          __syscall_rmdir: ___syscall_rmdir,
          /** @export */
          __syscall_stat64: ___syscall_stat64,
          /** @export */
          __syscall_unlinkat: ___syscall_unlinkat,
          /** @export */
          __syscall_utimensat: ___syscall_utimensat,
          /** @export */
          _abort_js: __abort_js,
          /** @export */
          _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,
          /** @export */
          _emscripten_memcpy_js: __emscripten_memcpy_js,
          /** @export */
          _emscripten_system: __emscripten_system,
          /** @export */
          _emscripten_throw_longjmp: __emscripten_throw_longjmp,
          /** @export */
          _gmtime_js: __gmtime_js,
          /** @export */
          _localtime_js: __localtime_js,
          /** @export */
          _mktime_js: __mktime_js,
          /** @export */
          _munmap_js: __munmap_js,
          /** @export */
          _tzset_js: __tzset_js,
          /** @export */
          emscripten_date_now: _emscripten_date_now,
          /** @export */
          emscripten_err: _emscripten_err,
          /** @export */
          emscripten_get_heap_max: _emscripten_get_heap_max,
          /** @export */
          emscripten_get_now: _emscripten_get_now,
          /** @export */
          emscripten_resize_heap: _emscripten_resize_heap,
          /** @export */
          environ_get: _environ_get,
          /** @export */
          environ_sizes_get: _environ_sizes_get,
          /** @export */
          exit: _exit,
          /** @export */
          fd_close: _fd_close,
          /** @export */
          fd_fdstat_get: _fd_fdstat_get,
          /** @export */
          fd_read: _fd_read,
          /** @export */
          fd_seek: _fd_seek,
          /** @export */
          fd_sync: _fd_sync,
          /** @export */
          fd_write: _fd_write,
          /** @export */
          invoke_vjj,
          /** @export */
          strftime: _strftime,
          /** @export */
          strftime_l: _strftime_l
        };
        var wasmExports = createWasm();
        var ___wasm_call_ctors = createExportWrapper("__wasm_call_ctors", 0);
        var _malloc = Module2["_malloc"] = createExportWrapper("malloc", 1);
        var _handle = Module2["_handle"] = createExportWrapper("handle", 2);
        var _main = createExportWrapper("main", 2);
        var _free = createExportWrapper("free", 1);
        var _fflush = createExportWrapper("fflush", 1);
        var _emscripten_builtin_memalign = createExportWrapper("emscripten_builtin_memalign", 2);
        var _sbrk = createExportWrapper("sbrk", 1);
        var _setThrew = createExportWrapper("setThrew", 2);
        var _emscripten_stack_init = () => (_emscripten_stack_init = wasmExports["emscripten_stack_init"])();
        var _emscripten_stack_get_free = () => (_emscripten_stack_get_free = wasmExports["emscripten_stack_get_free"])();
        var _emscripten_stack_get_base = () => (_emscripten_stack_get_base = wasmExports["emscripten_stack_get_base"])();
        var _emscripten_stack_get_end = () => (_emscripten_stack_get_end = wasmExports["emscripten_stack_get_end"])();
        var __emscripten_stack_restore = (a0) => (__emscripten_stack_restore = wasmExports["_emscripten_stack_restore"])(a0);
        var __emscripten_stack_alloc = (a0) => (__emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"])(a0);
        var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"])();
        var ___cxa_is_pointer_type = createExportWrapper("__cxa_is_pointer_type", 1);
        var dynCall_ij = Module2["dynCall_ij"] = createExportWrapper("dynCall_ij", 2);
        var dynCall_vi = Module2["dynCall_vi"] = createExportWrapper("dynCall_vi", 2);
        var dynCall_vjj = Module2["dynCall_vjj"] = createExportWrapper("dynCall_vjj", 3);
        var dynCall_jjj = Module2["dynCall_jjj"] = createExportWrapper("dynCall_jjj", 3);
        var dynCall_jjjj = Module2["dynCall_jjjj"] = createExportWrapper("dynCall_jjjj", 4);
        var dynCall_jjjjj = Module2["dynCall_jjjjj"] = createExportWrapper("dynCall_jjjjj", 5);
        var dynCall_ijij = Module2["dynCall_ijij"] = createExportWrapper("dynCall_ijij", 4);
        var dynCall_ijjjj = Module2["dynCall_ijjjj"] = createExportWrapper("dynCall_ijjjj", 5);
        var dynCall_vjij = Module2["dynCall_vjij"] = createExportWrapper("dynCall_vjij", 4);
        var dynCall_vj = Module2["dynCall_vj"] = createExportWrapper("dynCall_vj", 2);
        var dynCall_ijijij = Module2["dynCall_ijijij"] = createExportWrapper("dynCall_ijijij", 6);
        var dynCall_iji = Module2["dynCall_iji"] = createExportWrapper("dynCall_iji", 3);
        var dynCall_vjijjj = Module2["dynCall_vjijjj"] = createExportWrapper("dynCall_vjijjj", 6);
        var dynCall_ijijj = Module2["dynCall_ijijj"] = createExportWrapper("dynCall_ijijj", 5);
        var dynCall_i = Module2["dynCall_i"] = createExportWrapper("dynCall_i", 1);
        var dynCall_ji = Module2["dynCall_ji"] = createExportWrapper("dynCall_ji", 2);
        var dynCall_ijjjiji = Module2["dynCall_ijjjiji"] = createExportWrapper("dynCall_ijjjiji", 7);
        var dynCall_vjjj = Module2["dynCall_vjjj"] = createExportWrapper("dynCall_vjjj", 4);
        var dynCall_ijj = Module2["dynCall_ijj"] = createExportWrapper("dynCall_ijj", 3);
        var dynCall_ijiji = Module2["dynCall_ijiji"] = createExportWrapper("dynCall_ijiji", 5);
        var dynCall_ijiij = Module2["dynCall_ijiij"] = createExportWrapper("dynCall_ijiij", 5);
        var dynCall_ijjji = Module2["dynCall_ijjji"] = createExportWrapper("dynCall_ijjji", 5);
        var dynCall_ijjjjj = Module2["dynCall_ijjjjj"] = createExportWrapper("dynCall_ijjjjj", 6);
        var dynCall_vjjjij = Module2["dynCall_vjjjij"] = createExportWrapper("dynCall_vjjjij", 6);
        var dynCall_iijj = Module2["dynCall_iijj"] = createExportWrapper("dynCall_iijj", 4);
        var dynCall_jj = Module2["dynCall_jj"] = createExportWrapper("dynCall_jj", 2);
        var dynCall_vjjii = Module2["dynCall_vjjii"] = createExportWrapper("dynCall_vjjii", 5);
        var dynCall_ijijiii = Module2["dynCall_ijijiii"] = createExportWrapper("dynCall_ijijiii", 7);
        var dynCall_ijjj = Module2["dynCall_ijjj"] = createExportWrapper("dynCall_ijjj", 4);
        var dynCall_ijjij = Module2["dynCall_ijjij"] = createExportWrapper("dynCall_ijjij", 5);
        var dynCall_vjjji = Module2["dynCall_vjjji"] = createExportWrapper("dynCall_vjjji", 5);
        var dynCall_vjjjj = Module2["dynCall_vjjjj"] = createExportWrapper("dynCall_vjjjj", 5);
        var dynCall_vjjij = Module2["dynCall_vjjij"] = createExportWrapper("dynCall_vjjij", 5);
        var dynCall_ijjjij = Module2["dynCall_ijjjij"] = createExportWrapper("dynCall_ijjjij", 6);
        var dynCall_ijji = Module2["dynCall_ijji"] = createExportWrapper("dynCall_ijji", 4);
        var dynCall_ijiiij = Module2["dynCall_ijiiij"] = createExportWrapper("dynCall_ijiiij", 6);
        var dynCall_ijiii = Module2["dynCall_ijiii"] = createExportWrapper("dynCall_ijiii", 5);
        var dynCall_ijii = Module2["dynCall_ijii"] = createExportWrapper("dynCall_ijii", 4);
        var dynCall_ii = Module2["dynCall_ii"] = createExportWrapper("dynCall_ii", 2);
        var dynCall_iij = Module2["dynCall_iij"] = createExportWrapper("dynCall_iij", 3);
        var dynCall_iiij = Module2["dynCall_iiij"] = createExportWrapper("dynCall_iiij", 4);
        var dynCall_jijj = Module2["dynCall_jijj"] = createExportWrapper("dynCall_jijj", 4);
        var dynCall_iii = Module2["dynCall_iii"] = createExportWrapper("dynCall_iii", 3);
        var dynCall_iiii = Module2["dynCall_iiii"] = createExportWrapper("dynCall_iiii", 4);
        var dynCall_jjjiiij = Module2["dynCall_jjjiiij"] = createExportWrapper("dynCall_jjjiiij", 7);
        var dynCall_ijjijjj = Module2["dynCall_ijjijjj"] = createExportWrapper("dynCall_ijjijjj", 7);
        var dynCall_jji = Module2["dynCall_jji"] = createExportWrapper("dynCall_jji", 3);
        var dynCall_ijid = Module2["dynCall_ijid"] = createExportWrapper("dynCall_ijid", 4);
        var dynCall_dji = Module2["dynCall_dji"] = createExportWrapper("dynCall_dji", 3);
        var dynCall_ijjijj = Module2["dynCall_ijjijj"] = createExportWrapper("dynCall_ijjijj", 6);
        var dynCall_ijjiijjjj = Module2["dynCall_ijjiijjjj"] = createExportWrapper("dynCall_ijjiijjjj", 9);
        var dynCall_ijjjjjj = Module2["dynCall_ijjjjjj"] = createExportWrapper("dynCall_ijjjjjj", 7);
        var dynCall_j = Module2["dynCall_j"] = createExportWrapper("dynCall_j", 1);
        var dynCall_vjijj = Module2["dynCall_vjijj"] = createExportWrapper("dynCall_vjijj", 5);
        var dynCall_vjd = Module2["dynCall_vjd"] = createExportWrapper("dynCall_vjd", 3);
        var dynCall_vjji = Module2["dynCall_vjji"] = createExportWrapper("dynCall_vjji", 4);
        var dynCall_vji = Module2["dynCall_vji"] = createExportWrapper("dynCall_vji", 3);
        var dynCall_jijjj = Module2["dynCall_jijjj"] = createExportWrapper("dynCall_jijjj", 5);
        var dynCall_ijjjjjjjjj = Module2["dynCall_ijjjjjjjjj"] = createExportWrapper("dynCall_ijjjjjjjjj", 10);
        var dynCall_v = Module2["dynCall_v"] = createExportWrapper("dynCall_v", 1);
        var dynCall_dj = Module2["dynCall_dj"] = createExportWrapper("dynCall_dj", 2);
        var dynCall_ijjjjjij = Module2["dynCall_ijjjjjij"] = createExportWrapper("dynCall_ijjjjjij", 8);
        var dynCall_ijjii = Module2["dynCall_ijjii"] = createExportWrapper("dynCall_ijjii", 5);
        var dynCall_vij = Module2["dynCall_vij"] = createExportWrapper("dynCall_vij", 3);
        var dynCall_iijji = Module2["dynCall_iijji"] = createExportWrapper("dynCall_iijji", 5);
        var dynCall_ijjiijjjjj = Module2["dynCall_ijjiijjjjj"] = createExportWrapper("dynCall_ijjiijjjjj", 10);
        var dynCall_ijijji = Module2["dynCall_ijijji"] = createExportWrapper("dynCall_ijijji", 6);
        var dynCall_vijj = Module2["dynCall_vijj"] = createExportWrapper("dynCall_vijj", 4);
        var dynCall_ijijjj = Module2["dynCall_ijijjj"] = createExportWrapper("dynCall_ijijjj", 6);
        var dynCall_ijijjji = Module2["dynCall_ijijjji"] = createExportWrapper("dynCall_ijijjji", 7);
        var dynCall_vjjjji = Module2["dynCall_vjjjji"] = createExportWrapper("dynCall_vjjjji", 6);
        var dynCall_ijjiijj = Module2["dynCall_ijjiijj"] = createExportWrapper("dynCall_ijjiijj", 7);
        var dynCall_vjii = Module2["dynCall_vjii"] = createExportWrapper("dynCall_vjii", 4);
        var dynCall_ijjiijjjjjj = Module2["dynCall_ijjiijjjjjj"] = createExportWrapper("dynCall_ijjiijjjjjj", 11);
        var dynCall_jjjjij = Module2["dynCall_jjjjij"] = createExportWrapper("dynCall_jjjjij", 6);
        var dynCall_ijjjjji = Module2["dynCall_ijjjjji"] = createExportWrapper("dynCall_ijjjjji", 7);
        var dynCall_jjjji = Module2["dynCall_jjjji"] = createExportWrapper("dynCall_jjjji", 5);
        var dynCall_dd = Module2["dynCall_dd"] = createExportWrapper("dynCall_dd", 2);
        var dynCall_ddd = Module2["dynCall_ddd"] = createExportWrapper("dynCall_ddd", 3);
        var dynCall_jiii = Module2["dynCall_jiii"] = createExportWrapper("dynCall_jiii", 4);
        var dynCall_jjii = Module2["dynCall_jjii"] = createExportWrapper("dynCall_jjii", 4);
        var dynCall_ijiijj = Module2["dynCall_ijiijj"] = createExportWrapper("dynCall_ijiijj", 6);
        var dynCall_ijjijij = Module2["dynCall_ijjijij"] = createExportWrapper("dynCall_ijjijij", 7);
        var dynCall_jjji = Module2["dynCall_jjji"] = createExportWrapper("dynCall_jjji", 4);
        var dynCall_ijdiiii = Module2["dynCall_ijdiiii"] = createExportWrapper("dynCall_ijdiiii", 7);
        var dynCall_vjjjii = Module2["dynCall_vjjjii"] = createExportWrapper("dynCall_vjjjii", 6);
        var dynCall_ijjjjjjjj = Module2["dynCall_ijjjjjjjj"] = createExportWrapper("dynCall_ijjjjjjjj", 9);
        var dynCall_jjjjjjj = Module2["dynCall_jjjjjjj"] = createExportWrapper("dynCall_jjjjjjj", 7);
        var dynCall_jjjjii = Module2["dynCall_jjjjii"] = createExportWrapper("dynCall_jjjjii", 6);
        var dynCall_jjjjid = Module2["dynCall_jjjjid"] = createExportWrapper("dynCall_jjjjid", 6);
        var dynCall_jjjjijj = Module2["dynCall_jjjjijj"] = createExportWrapper("dynCall_jjjjijj", 7);
        var dynCall_jjjjjjjii = Module2["dynCall_jjjjjjjii"] = createExportWrapper("dynCall_jjjjjjjii", 9);
        var dynCall_jjjjijii = Module2["dynCall_jjjjijii"] = createExportWrapper("dynCall_jjjjijii", 8);
        var dynCall_jjjjijjj = Module2["dynCall_jjjjijjj"] = createExportWrapper("dynCall_jjjjijjj", 8);
        var dynCall_jjjijijj = Module2["dynCall_jjjijijj"] = createExportWrapper("dynCall_jjjijijj", 8);
        var dynCall_jjjijij = Module2["dynCall_jjjijij"] = createExportWrapper("dynCall_jjjijij", 7);
        var dynCall_vjjjiij = Module2["dynCall_vjjjiij"] = createExportWrapper("dynCall_vjjjiij", 7);
        var dynCall_vjjjjii = Module2["dynCall_vjjjjii"] = createExportWrapper("dynCall_vjjjjii", 7);
        var dynCall_ifj = Module2["dynCall_ifj"] = createExportWrapper("dynCall_ifj", 3);
        var dynCall_vijjjjjji = Module2["dynCall_vijjjjjji"] = createExportWrapper("dynCall_vijjjjjji", 9);
        var dynCall_vjjjjj = Module2["dynCall_vjjjjj"] = createExportWrapper("dynCall_vjjjjj", 6);
        var _asyncify_start_unwind = createExportWrapper("asyncify_start_unwind", 1);
        var _asyncify_stop_unwind = createExportWrapper("asyncify_stop_unwind", 0);
        var _asyncify_start_rewind = createExportWrapper("asyncify_start_rewind", 1);
        var _asyncify_stop_rewind = createExportWrapper("asyncify_stop_rewind", 0);
        var ___start_em_js = Module2["___start_em_js"] = 543408;
        var ___stop_em_js = Module2["___stop_em_js"] = 543834;
        function invoke_vjj(index, a1, a2) {
          var sp = stackSave();
          try {
            dynCall_vjj(Number(index), a1, a2);
          } catch (e) {
            stackRestore(sp);
            if (e !== e + 0)
              throw e;
            _setThrew(1, 0);
          }
        }
        function applySignatureConversions(wasmExports2) {
          wasmExports2 = Object.assign({}, wasmExports2);
          var makeWrapper_pp = (f) => function(a0) {
            return Number(f(BigInt(a0)));
          };
          var makeWrapper___PP = (f) => function(a0, a1, a2) {
            return f(a0, BigInt(a1 ? a1 : 0), BigInt(a2 ? a2 : 0));
          };
          var makeWrapper__p = (f) => function(a0) {
            return f(BigInt(a0));
          };
          var makeWrapper_ppp = (f) => function(a0, a1) {
            return Number(f(BigInt(a0), BigInt(a1)));
          };
          var makeWrapper_pP = (f) => function(a0) {
            return Number(f(BigInt(a0 ? a0 : 0)));
          };
          var makeWrapper_p = (f) => function() {
            return Number(f());
          };
          wasmExports2["malloc"] = makeWrapper_pp(wasmExports2["malloc"]);
          wasmExports2["main"] = makeWrapper___PP(wasmExports2["main"]);
          wasmExports2["free"] = makeWrapper__p(wasmExports2["free"]);
          wasmExports2["fflush"] = makeWrapper__p(wasmExports2["fflush"]);
          wasmExports2["emscripten_builtin_memalign"] = makeWrapper_ppp(wasmExports2["emscripten_builtin_memalign"]);
          wasmExports2["sbrk"] = makeWrapper_pP(wasmExports2["sbrk"]);
          wasmExports2["setThrew"] = makeWrapper__p(wasmExports2["setThrew"]);
          wasmExports2["emscripten_stack_get_base"] = makeWrapper_p(wasmExports2["emscripten_stack_get_base"]);
          wasmExports2["emscripten_stack_get_end"] = makeWrapper_p(wasmExports2["emscripten_stack_get_end"]);
          wasmExports2["_emscripten_stack_restore"] = makeWrapper__p(wasmExports2["_emscripten_stack_restore"]);
          wasmExports2["_emscripten_stack_alloc"] = makeWrapper_pp(wasmExports2["_emscripten_stack_alloc"]);
          wasmExports2["emscripten_stack_get_current"] = makeWrapper_p(wasmExports2["emscripten_stack_get_current"]);
          wasmExports2["__cxa_is_pointer_type"] = makeWrapper__p(wasmExports2["__cxa_is_pointer_type"]);
          wasmExports2["asyncify_start_unwind"] = makeWrapper__p(wasmExports2["asyncify_start_unwind"]);
          wasmExports2["asyncify_start_rewind"] = makeWrapper__p(wasmExports2["asyncify_start_rewind"]);
          return wasmExports2;
        }
        var MAGIC = 0;
        Math.random = () => {
          MAGIC = Math.pow(MAGIC + 1.8912, 3) % 1;
          return MAGIC;
        };
        var TIME = 1e4;
        function deterministicNow() {
          return TIME++;
        }
        Date.now = deterministicNow;
        Module2["thisProgram"] = "thisProgram";
        Module2["addRunDependency"] = addRunDependency;
        Module2["removeRunDependency"] = removeRunDependency;
        Module2["FS_createPath"] = FS.createPath;
        Module2["FS_createLazyFile"] = FS.createLazyFile;
        Module2["FS_createDevice"] = FS.createDevice;
        Module2["cwrap"] = cwrap;
        Module2["FS_createPreloadedFile"] = FS.createPreloadedFile;
        Module2["FS_createDataFile"] = FS.createDataFile;
        Module2["FS_unlink"] = FS.unlink;
        var missingLibrarySymbols = ["writeI53ToI64", "writeI53ToI64Clamped", "writeI53ToI64Signaling", "writeI53ToU64Clamped", "writeI53ToU64Signaling", "readI53FromU64", "convertI32PairToI53", "convertI32PairToI53Checked", "convertU32PairToI53", "getTempRet0", "setTempRet0", "inetPton4", "inetNtop4", "inetPton6", "inetNtop6", "readSockaddr", "writeSockaddr", "emscriptenLog", "readEmAsmArgs", "jstoi_q", "listenOnce", "autoResumeAudioContext", "dynCallLegacy", "getDynCaller", "dynCall", "asmjsMangle", "HandleAllocator", "getNativeTypeSize", "STACK_SIZE", "STACK_ALIGN", "POINTER_SIZE", "ASSERTIONS", "uleb128Encode", "generateFuncType", "convertJsFunctionToWasm", "getEmptyTableSlot", "updateTableMap", "getFunctionAddress", "addFunction", "removeFunction", "reallyNegative", "unSign", "strLen", "reSign", "formatString", "intArrayToString", "AsciiToString", "UTF16ToString", "stringToUTF16", "lengthBytesUTF16", "UTF32ToString", "stringToUTF32", "lengthBytesUTF32", "stringToNewUTF8", "registerKeyEventCallback", "maybeCStringToJsString", "findEventTarget", "getBoundingClientRect", "fillMouseEventData", "registerMouseEventCallback", "registerWheelEventCallback", "registerUiEventCallback", "registerFocusEventCallback", "fillDeviceOrientationEventData", "registerDeviceOrientationEventCallback", "fillDeviceMotionEventData", "registerDeviceMotionEventCallback", "screenOrientation", "fillOrientationChangeEventData", "registerOrientationChangeEventCallback", "fillFullscreenChangeEventData", "registerFullscreenChangeEventCallback", "JSEvents_requestFullscreen", "JSEvents_resizeCanvasForFullscreen", "registerRestoreOldStyle", "hideEverythingExceptGivenElement", "restoreHiddenElements", "setLetterbox", "softFullscreenResizeWebGLRenderTarget", "doRequestFullscreen", "fillPointerlockChangeEventData", "registerPointerlockChangeEventCallback", "registerPointerlockErrorEventCallback", "requestPointerLock", "fillVisibilityChangeEventData", "registerVisibilityChangeEventCallback", "registerTouchEventCallback", "fillGamepadEventData", "registerGamepadEventCallback", "registerBeforeUnloadEventCallback", "fillBatteryEventData", "battery", "registerBatteryEventCallback", "setCanvasElementSize", "getCanvasElementSize", "jsStackTrace", "getCallstack", "convertPCtoSourceLocation", "checkWasiClock", "wasiRightsToMuslOFlags", "wasiOFlagsToMuslOFlags", "createDyncallWrapper", "safeSetTimeout", "setImmediateWrapped", "clearImmediateWrapped", "polyfillSetImmediate", "getPromise", "makePromise", "idsToPromises", "makePromiseCallback", "findMatchingCatch", "Browser_asyncPrepareDataCounter", "setMainLoop", "getSocketFromFD", "getSocketAddress", "FS_mkdirTree", "_setNetworkCallback", "heapObjectForWebGLType", "toTypedArrayIndex", "webgl_enable_ANGLE_instanced_arrays", "webgl_enable_OES_vertex_array_object", "webgl_enable_WEBGL_draw_buffers", "webgl_enable_WEBGL_multi_draw", "emscriptenWebGLGet", "computeUnpackAlignedImageSize", "colorChannelsInGlTextureFormat", "emscriptenWebGLGetTexPixelData", "emscriptenWebGLGetUniform", "webglGetUniformLocation", "webglPrepareUniformLocationsBeforeFirstUse", "webglGetLeftBracePos", "emscriptenWebGLGetVertexAttrib", "__glGetActiveAttribOrUniform", "writeGLArray", "registerWebGlEventCallback", "ALLOC_NORMAL", "ALLOC_STACK", "allocate", "writeStringToMemory", "writeAsciiToMemory", "setErrNo", "demangle", "stackTrace"];
        missingLibrarySymbols.forEach(missingLibrarySymbol);
        var unexportedSymbols = ["run", "addOnPreRun", "addOnInit", "addOnPreMain", "addOnExit", "addOnPostRun", "FS_createFolder", "FS_createLink", "FS_readFile", "out", "err", "callMain", "abort", "wasmMemory", "wasmExports", "writeStackCookie", "checkStackCookie", "readI53FromI64", "MAX_INT53", "MIN_INT53", "bigintToI53Checked", "stackSave", "stackRestore", "stackAlloc", "ptrToString", "zeroMemory", "exitJS", "getHeapMax", "growMemory", "ENV", "MONTH_DAYS_REGULAR", "MONTH_DAYS_LEAP", "MONTH_DAYS_REGULAR_CUMULATIVE", "MONTH_DAYS_LEAP_CUMULATIVE", "isLeapYear", "ydayFromDate", "arraySum", "addDays", "ERRNO_CODES", "ERRNO_MESSAGES", "DNS", "Protocols", "Sockets", "initRandomFill", "randomFill", "timers", "warnOnce", "readEmAsmArgsArray", "jstoi_s", "getExecutableName", "handleException", "keepRuntimeAlive", "runtimeKeepalivePush", "runtimeKeepalivePop", "callUserCallback", "maybeExit", "asyncLoad", "alignMemory", "mmapAlloc", "wasmTable", "noExitRuntime", "getCFunc", "ccall", "sigToWasmTypes", "freeTableIndexes", "functionsInTableMap", "setValue", "getValue", "PATH", "PATH_FS", "UTF8Decoder", "UTF8ArrayToString", "UTF8ToString", "stringToUTF8Array", "stringToUTF8", "lengthBytesUTF8", "intArrayFromString", "stringToAscii", "UTF16Decoder", "stringToUTF8OnStack", "writeArrayToMemory", "JSEvents", "specialHTMLTargets", "findCanvasEventTarget", "currentFullscreenStrategy", "restoreOldWindowedStyle", "UNWIND_CACHE", "ExitStatus", "getEnvStrings", "doReadv", "doWritev", "promiseMap", "uncaughtExceptionCount", "exceptionLast", "exceptionCaught", "ExceptionInfo", "Browser", "getPreloadedImageData__data", "wget", "SYSCALLS", "preloadPlugins", "FS_modeStringToFlags", "FS_getMode", "FS_stdin_getChar_buffer", "FS_stdin_getChar", "FS", "MEMFS", "TTY", "PIPEFS", "SOCKFS", "tempFixedLengthArray", "miniTempWebGLFloatBuffers", "miniTempWebGLIntBuffers", "GL", "AL", "GLUT", "EGL", "GLEW", "IDBStore", "runAndAbortIfError", "Asyncify", "Fibers", "SDL", "SDL_gfx", "allocateUTF8", "allocateUTF8OnStack"];
        unexportedSymbols.forEach(unexportedRuntimeSymbol);
        var calledRun;
        dependenciesFulfilled = function runCaller() {
          if (!calledRun)
            run();
          if (!calledRun)
            dependenciesFulfilled = runCaller;
        };
        function stackCheckInit() {
          _emscripten_stack_init();
          writeStackCookie();
        }
        function run() {
          if (runDependencies > 0) {
            return;
          }
          stackCheckInit();
          preRun();
          if (runDependencies > 0) {
            return;
          }
          function doRun() {
            if (calledRun)
              return;
            calledRun = true;
            Module2["calledRun"] = true;
            if (ABORT)
              return;
            initRuntime();
            readyPromiseResolve(Module2);
            if (Module2["onRuntimeInitialized"])
              Module2["onRuntimeInitialized"]();
            assert(!Module2["_main"], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');
            postRun();
          }
          if (Module2["setStatus"]) {
            Module2["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module2["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
          checkStackCookie();
        }
        function checkUnflushedContent() {
          var oldOut = out;
          var oldErr = err;
          var has = false;
          out = err = (x) => {
            has = true;
          };
          try {
            _fflush(0);
            ["stdout", "stderr"].forEach(function(name) {
              var info = FS.analyzePath("/dev/" + name);
              if (!info)
                return;
              var stream = info.object;
              var rdev = stream.rdev;
              var tty = TTY.ttys[rdev];
              if (tty?.output?.length) {
                has = true;
              }
            });
          } catch (e) {
          }
          out = oldOut;
          err = oldErr;
          if (has) {
            warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.");
          }
        }
        if (Module2["preInit"]) {
          if (typeof Module2["preInit"] == "function")
            Module2["preInit"] = [Module2["preInit"]];
          while (Module2["preInit"].length > 0) {
            Module2["preInit"].pop()();
          }
        }
        run();
        moduleRtn = readyPromise;
        Module2.resizeHeap = _emscripten_resize_heap;
        for (const prop of Object.keys(Module2)) {
          if (!(prop in moduleArg)) {
            Object.defineProperty(moduleArg, prop, {
              configurable: true,
              get() {
                abort(`Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
              }
            });
          }
        }
        return moduleRtn;
      };
    })();
    if (typeof exports2 === "object" && typeof module2 === "object")
      module2.exports = Module;
    else if (typeof define === "function" && define["amd"])
      define([], () => Module);
  }
});

// src/index.cjs
var Emscripten = require_emscripten();
var Emscripten2 = require_emscripten2();
var Emscripten3 = require_emscripten3();
var Emscripten4 = require_emscripten4();
var Wasm64 = require_wasm64_emscripten();
module.exports = async function(binary, options) {
  let instance = null;
  let doHandle = null;
  if (options === null) {
    options = { format: "wasm32-unknown-emscripten" };
  }
  if (options.format === "wasm32-unknown-emscripten") {
    instance = await Emscripten(binary, options);
  } else if (options.format === "wasm32-unknown-emscripten2") {
    instance = await Emscripten2(binary, options);
  } else if (options.format === "wasm32-unknown-emscripten3") {
    instance = await Emscripten3(binary, options);
  } else {
    if (typeof binary === "function") {
      options.instantiateWasm = binary;
    } else {
      options.wasmBinary = binary;
    }
    if (options.format === "wasm64-unknown-emscripten-draft_2024_02_15") {
      instance = await Wasm64(options);
    } else if (options.format === "wasm32-unknown-emscripten4") {
      instance = await Emscripten4(binary, options);
    }
    await instance["FS_createPath"]("/", "data");
    doHandle = instance.cwrap("handle", "string", ["string", "string"], { async: true });
  }
  if (instance.cleanupListeners) {
    instance.cleanupListeners();
  }
  if (options.format !== "wasm64-unknown-emscripten-draft_2024_02_15" && options.format !== "wasm32-unknown-emscripten4") {
    doHandle = instance.cwrap("handle", "string", ["string", "string"]);
  }
  return async (buffer, msg, env) => {
    const originalRandom = Math.random;
    const originalLog = console.log;
    try {
      Math.random = function() {
        return 0.5;
      };
      console.log = function() {
        return null;
      };
      if (buffer) {
        if (instance.HEAPU8.byteLength < buffer.byteLength) {
          console.log("RESIZE HEAP");
          instance.resizeHeap(buffer.byteLength);
        }
        instance.HEAPU8.set(buffer);
      }
      instance.gas.refill();
      const res = await doHandle(JSON.stringify(msg), JSON.stringify(env));
      const { ok, response } = JSON.parse(res);
      if (!ok)
        throw response;
      Math.random = originalRandom;
      console.log = originalLog;
      console.log('Memory used:', instance.HEAP8.length)

      return {
        Memory: instance.HEAPU8.slice(),
        Error: response.Error,
        Output: response.Output,
        Messages: response.Messages,
        Spawns: response.Spawns,
        Assignments: response.Assignments,
        GasUsed: instance.gas.used
      };
    } finally {
      Math.random = originalRandom;
      console.log = originalLog;
      buffer = null;
    }
  };
};
