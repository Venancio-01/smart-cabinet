"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _renderer = require("electron/renderer");
var _services = require("../services");
require("./loading");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function createJsBridge() {
    return _services.services.reduce(function(acc, cur) {
        acc[cur.name] = {};
        Object.keys(cur.fns).forEach(function(fnName) {
            var _ipcRenderer;
            acc[cur.name][fnName] = function() {
                for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                    args[_key] = arguments[_key];
                }
                return (_ipcRenderer = _renderer.ipcRenderer).invoke.apply(_ipcRenderer, [
                    (0, _services.makeChannelName)(cur.name, fnName)
                ].concat(_to_consumable_array(args)));
            };
        });
        return acc;
    }, {});
}
var bridge = createJsBridge();
_renderer.contextBridge.exposeInMainWorld("JSBridge", bridge);

//# sourceMappingURL=preload.js.map