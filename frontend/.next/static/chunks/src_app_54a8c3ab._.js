(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/components/audio_playback.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// components/HLSAudioPlayer.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$hls$2e$js$2f$dist$2f$hls$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/hls.js/dist/hls.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const HLSAudioPlayer = ({ src })=>{
    _s();
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HLSAudioPlayer.useEffect": ()=>{
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$hls$2e$js$2f$dist$2f$hls$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isSupported() && audioRef.current) {
                const hls = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$hls$2e$js$2f$dist$2f$hls$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
                    maxBufferLength: 10,
                    maxMaxBufferLength: 20,
                    maxBufferSize: 640000
                });
                hls.startLevel = 0; // index in the manifest (0 = lowest = 64k)
                hls.loadSource(src);
                hls.attachMedia(audioRef.current);
                hls.on(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$hls$2e$js$2f$dist$2f$hls$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Events.MANIFEST_PARSED, {
                    "HLSAudioPlayer.useEffect": ()=>{
                        audioRef.current?.play().catch({
                            "HLSAudioPlayer.useEffect": (err)=>console.error(err)
                        }["HLSAudioPlayer.useEffect"]);
                    }
                }["HLSAudioPlayer.useEffect"]);
                return ({
                    "HLSAudioPlayer.useEffect": ()=>{
                        hls.destroy();
                    }
                })["HLSAudioPlayer.useEffect"];
            } else if (audioRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
                // For Safari
                audioRef.current.src = src;
                audioRef.current.play().catch({
                    "HLSAudioPlayer.useEffect": (err)=>console.error(err)
                }["HLSAudioPlayer.useEffect"]);
            }
        }
    }["HLSAudioPlayer.useEffect"], [
        src
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
        ref: audioRef,
        controls: true
    }, void 0, false, {
        fileName: "[project]/src/app/components/audio_playback.tsx",
        lineNumber: 41,
        columnNumber: 10
    }, this);
};
_s(HLSAudioPlayer, "+byXHHf22FzALubYzgUeSQRtz1Y=");
_c = HLSAudioPlayer;
const __TURBOPACK__default__export__ = HLSAudioPlayer;
var _c;
__turbopack_context__.k.register(_c, "HLSAudioPlayer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/playback/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$audio_playback$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/audio_playback.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const Playbox = ({})=>{
    _s();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new AudioContext());
    const flag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const gainNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(ctx.current.createGain());
    const bassFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(ctx.current.createBiquadFilter());
    const [volume, setVolume] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const oscillatorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Playbox.useEffect": ()=>{
            // Configure bass filter
            bassFilter.current.type = "lowshelf";
            bassFilter.current.frequency.setValueAtTime(200, ctx.current.currentTime); // Frequencies below 200Hz
            bassFilter.current.gain.setValueAtTime(105, ctx.current.currentTime); // Boost bass by 15dB
            // Chain: bassFilter → gainNode → destination
            bassFilter.current.connect(gainNode.current);
            gainNode.current.connect(ctx.current.destination);
        }
    }["Playbox.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                "data-playing": "false",
                role: "switch",
                "aria-checked": "false",
                onClick: ()=>{
                    if (!flag.current) {
                        console.log("music on");
                        const oscillator = ctx.current.createOscillator();
                        oscillator.type = "sawtooth";
                        oscillator.connect(bassFilter.current); // Connect to bass filter
                        oscillator.start();
                        oscillatorRef.current = oscillator;
                    } else {
                        oscillatorRef.current?.stop();
                        oscillatorRef.current = null;
                    }
                    flag.current = !flag.current;
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: "Play/Pause"
                }, void 0, false, {
                    fileName: "[project]/src/app/playback/page.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/playback/page.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>{
                    gainNode.current.gain.setValueAtTime(0.1, ctx.current.currentTime);
                    setVolume(3);
                },
                children: [
                    "volume ",
                    `${volume}`
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/playback/page.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$audio_playback$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: "./audios/master.m3u8"
            }, void 0, false, {
                fileName: "[project]/src/app/playback/page.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/playback/page.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
};
_s(Playbox, "mWzqHVmlMkiOlgh72PZX77z0eyU=");
_c = Playbox;
const __TURBOPACK__default__export__ = Playbox;
var _c;
__turbopack_context__.k.register(_c, "Playbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_54a8c3ab._.js.map