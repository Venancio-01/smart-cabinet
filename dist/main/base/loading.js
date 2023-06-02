"use strict";
function domReady() {
    var condition = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        "complete",
        "interactive"
    ];
    return new Promise(function(resolve) {
        if (condition.includes(document.readyState)) {
            resolve(true);
        } else {
            document.addEventListener("readystatechange", function() {
                if (condition.includes(document.readyState)) resolve(true);
            });
        }
    });
}
var safeDOM = {
    append: function append(parent, child) {
        if (!Array.from(parent.children).find(function(e) {
            return e === child;
        })) return parent.appendChild(child);
    },
    remove: function remove(parent, child) {
        if (Array.from(parent.children).find(function(e) {
            return e === child;
        })) return parent.removeChild(child);
    }
};
/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */ function useLoading() {
    var className = "loaders-css__square-spin";
    var styleContent = "\n@keyframes square-spin {\n  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }\n  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }\n  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }\n  100% { transform: perspective(100px) rotateX(0) rotateY(0); }\n}\n.".concat(className, " > div {\n  animation-fill-mode: both;\n  width: 50px;\n  height: 50px;\n  background: #fff;\n  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;\n}\n.app-loading-wrap {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #282c34;\n  z-index: 9;\n}\n    ");
    var oStyle = document.createElement("style");
    var oDiv = document.createElement("div");
    oStyle.id = "app-loading-style";
    oStyle.innerHTML = styleContent;
    oDiv.className = "app-loading-wrap";
    oDiv.innerHTML = '<div class="'.concat(className, '"><div></div></div>');
    return {
        appendLoading: function appendLoading() {
            safeDOM.append(document.head, oStyle);
            safeDOM.append(document.body, oDiv);
        },
        removeLoading: function removeLoading() {
            safeDOM.remove(document.head, oStyle);
            safeDOM.remove(document.body, oDiv);
        }
    };
}
// ----------------------------------------------------------------------
var _useLoading = useLoading(), appendLoading = _useLoading.appendLoading, removeLoading = _useLoading.removeLoading;
domReady().then(appendLoading);
window.onmessage = function(ev) {
    ev.data.payload === "removeLoading" && removeLoading();
};
setTimeout(removeLoading, 4999);

//# sourceMappingURL=loading.js.map