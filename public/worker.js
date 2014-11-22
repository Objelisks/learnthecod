
onmessage = function (__event) {
    var console = {
        'log': function() {
            var msg = Array.prototype.slice.call(arguments).join(' ');
            postMessage({type: 'console', data: msg});
        }
    }
    var __result = "error";
    try {
        // clear context for eval
        (function() {

            var XMLHttpRequest = null;
            var onmessage = null;
            var Worker = null;
            var postMessage = null;

            __result = eval(__event.data);
        })();
    } finally {
        postMessage({type: 'line', data: JSON.stringify(__result)});
    }
}