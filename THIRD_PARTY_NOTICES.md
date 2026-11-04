# Third-party notices

OneWebDev uses the following work by others. Each license continues to apply to its part.

## Project base

The initial dashboard scaffold comes from **TailAdmin React** (MIT):

```
MIT License

Copyright (c) 2023 TailAdmin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Loaded at runtime (not bundled)

| Component | License | Used for |
|---|---|---|
| three.js (jsDelivr CDN) | MIT | 3D elements (`owd3d`) |
| A-Frame (jsDelivr CDN) | MIT | Optional A-Frame library in Page Design |
| Chart.js (jsDelivr CDN) | MIT | Chart elements |
| BiRefNet lite model (`onnx-community/BiRefNet_lite-ONNX`, Hugging Face) | MIT (check the model card whenever the model changes) | In-browser image background removal |
| Plus Jakarta Sans, JetBrains Mono, other Google Fonts | SIL OFL 1.1 | App and template typography |
| Motion 11 (jsDelivr CDN) | MIT | Animation in code templates |
| Lenis 1.1 (jsDelivr CDN) | MIT | Smooth scrolling in code templates |
| Swiper 11 (jsDelivr CDN) | MIT | Sliders in code templates |
| AOS 2.3 (jsDelivr CDN) | MIT | Entrance animations in code templates |
| canvas-confetti 1.9 (jsDelivr CDN) | ISC | Confetti effect in invitation templates |

Scroll animation in the 3D templates uses an in-house engine (OWD Scrub, `src/tools/codeTemplates/scrub.ts`), not GSAP. Every sample image in the templates and Page Maker elements is an in-house SVG; 3D objects are procedural, with no external models or textures. Pure CSS animation templates use no library at all. Business names, people, partners, and testimonials in the templates are fictional.

Animation effects (replacing AOS, Animate.css, and Vanilla Tilt) are rewritten as `owd-motion`. The Animate.css style keyframes follow Animate.css 4.1.1 (MIT, © Daniel Eden).

## Bundled npm packages (303 packages)

Summary: MIT (218), ISC (26), Apache-2.0 (17), BSD-3-Clause (16), BSD-2-Clause (7), MPL-2.0 (5), BlueOak-1.0.0 (5), Unlicense (2), MIT/X11 (package README) (1), MIT/X11 (1), (MIT OR GPL-3.0-or-later) (1), CC0-1.0 (1), (MIT AND Zlib) (1), 0BSD (1), (MIT OR CC0-1.0) (1).

| Package | Version | License | Source |
|---|---|---|---|
| @babel/runtime | 7.29.10 | MIT | https://github.com/babel/babel |
| @fast-csv/format | 4.3.5 | MIT | https://github.com/C2FO/fast-csv |
| @fast-csv/parse | 4.3.6 | MIT | https://github.com/C2FO/fast-csv |
| @huggingface/jinja | 0.5.10 | MIT | https://github.com/huggingface/huggingface.js |
| @huggingface/transformers | 3.8.1 | Apache-2.0 | https://github.com/huggingface/transformers.js |
| @img/colour | 1.1.0 | MIT | https://github.com/lovell/colour |
| @isaacs/fs-minipass | 4.0.1 | ISC | https://github.com/npm/fs-minipass |
| @jsquash/avif | 2.1.1 | Apache-2.0 | jamsinclair/jSquash |
| @jsquash/jpeg | 1.6.0 | Apache-2.0 | jamsinclair/jSquash |
| @jsquash/jxl | 1.3.0 | Apache-2.0 | jamsinclair/jSquash |
| @jsquash/png | 3.1.1 | Apache-2.0 | https://github.com/jamsinclair/jSquash |
| @jsquash/qoi | 1.1.0 | Apache-2.0 | jamsinclair/jSquash |
| @jsquash/webp | 1.5.0 | Apache-2.0 | jamsinclair/jSquash |
| @mediabunny/aac-encoder | 1.62.1 | MPL-2.0 | https://github.com/Vanilagy/mediabunny |
| @mediabunny/flac-encoder | 1.62.1 | MPL-2.0 | https://github.com/Vanilagy/mediabunny |
| @mediabunny/mp3-encoder | 1.62.1 | MPL-2.0 | https://github.com/Vanilagy/mediabunny |
| @pdf-lib/standard-fonts | 1.0.0 | MIT | https://github.com/Hopding/standard-fonts |
| @pdf-lib/upng | 1.0.1 | MIT | https://github.com/Hopding/upng |
| @protobufjs/aspromise | 1.1.2 | BSD-3-Clause | https://github.com/dcodeIO/protobuf.js |
| @protobufjs/base64 | 1.1.2 | BSD-3-Clause | https://github.com/dcodeIO/protobuf.js |
| @protobufjs/codegen | 2.0.5 | BSD-3-Clause | https://github.com/dcodeIO/protobuf.js |
| @protobufjs/eventemitter | 1.1.1 | BSD-3-Clause | https://github.com/dcodeIO/protobuf.js |
| @protobufjs/fetch | 1.1.1 | BSD-3-Clause | https://github.com/dcodeIO/protobuf.js |
| @protobufjs/float | 1.0.2 | BSD-3-Clause | https://github.com/dcodeIO/protobuf.js |
| @protobufjs/path | 1.1.2 | BSD-3-Clause | https://github.com/dcodeIO/protobuf.js |
| @protobufjs/pool | 1.1.0 | BSD-3-Clause | https://github.com/dcodeIO/protobuf.js |
| @protobufjs/utf8 | 1.1.2 | BSD-3-Clause | https://github.com/protobufjs/protobuf.js |
| @sentry/browser | 11.8.0 | MIT | git://github.com/getsentry/sentry-javascript |
| @sentry/browser-utils | 11.8.0 | MIT | git://github.com/getsentry/sentry-javascript |
| @sentry/conventions | 0.27.0 | MIT | https://github.com/getsentry/sentry-conventions |
| @sentry/core | 11.8.0 | MIT | git://github.com/getsentry/sentry-javascript |
| @sentry/feedback | 11.8.0 | MIT | git://github.com/getsentry/sentry-javascript |
| @sentry/react | 11.8.0 | MIT | git://github.com/getsentry/sentry-javascript |
| @sentry/replay | 11.8.0 | MIT | https://github.com/getsentry/sentry-javascript |
| @sentry/replay-canvas | 11.8.0 | MIT | https://github.com/getsentry/sentry-javascript |
| @swc/helpers | 0.5.23 | Apache-2.0 | https://github.com/swc-project/swc |
| @tanstack/query-core | 5.104.5 | MIT | https://github.com/TanStack/query |
| @tanstack/react-query | 5.104.5 | MIT | https://github.com/TanStack/query |
| @types/dom-mediacapture-transform | 0.1.12 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/dom-webcodecs | 0.1.13 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/node | 22.20.5 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @vercel/analytics | 1.6.1 | MPL-2.0 | github:vercel/analytics |
| ansi-regex | 5.0.1 | MIT | chalk/ansi-regex |
| ansi-styles | 4.3.0 | MIT | chalk/ansi-styles |
| archiver | 5.3.2 | MIT | https://github.com/archiverjs/node-archiver |
| archiver-utils | 2.1.0 | MIT | https://github.com/archiverjs/archiver-utils |
| array-buffer-byte-length | 1.0.2 | MIT | https://github.com/inspect-js/array-buffer-byte-length |
| arraybuffer.prototype.slice | 1.0.4 | MIT | https://github.com/es-shims/ArrayBuffer.prototype.slice |
| async | 3.2.6 | MIT | https://github.com/caolan/async |
| async-function | 1.0.0 | MIT | https://github.com/ljharb/async-function |
| available-typed-arrays | 1.0.7 | MIT | https://github.com/inspect-js/available-typed-arrays |
| balanced-match | 4.0.4 | MIT | git://github.com/juliangruber/balanced-match |
| base64-js | 1.5.1 | MIT | git://github.com/beatgammit/base64-js |
| big-integer | 1.6.52 | Unlicense | git@github.com:peterolson/BigInteger.js |
| binary | 0.3.0 | MIT | http://github.com/substack/node-binary |
| bl | 4.1.0 | MIT | https://github.com/rvagg/bl |
| bluebird | 3.4.7 | MIT | git://github.com/petkaantonov/bluebird |
| boolbase | 1.0.0 | ISC | https://github.com/fb55/boolbase |
| boolean | 3.2.0 | MIT | git://github.com/thenativeweb/boolean |
| brace-expansion | 5.0.12 | MIT | https://github.com/juliangruber/brace-expansion |
| buffer | 5.7.1 | MIT | git://github.com/feross/buffer |
| buffer-crc32 | 0.2.13 | MIT | git://github.com/brianloveswords/buffer-crc32 |
| buffer-indexof-polyfill | 1.0.2 | MIT | https://github.com/sarosia/buffer-indexof-polyfill |
| buffers | 0.1.1 | MIT/X11 (package README) | http://github.com/substack/node-buffers |
| call-bind | 1.0.9 | MIT | https://github.com/ljharb/call-bind |
| call-bind-apply-helpers | 1.0.2 | MIT | https://github.com/ljharb/call-bind-apply-helpers |
| call-bound | 1.0.4 | MIT | https://github.com/ljharb/call-bound |
| camelcase | 5.3.1 | MIT | sindresorhus/camelcase |
| chainsaw | 0.1.0 | MIT/X11 | http://github.com/substack/node-chainsaw |
| chownr | 3.0.0 | BlueOak-1.0.0 | git://github.com/isaacs/chownr |
| cliui | 6.0.0 | ISC | http://github.com/yargs/cliui |
| color-convert | 2.0.1 | MIT | Qix-/color-convert |
| color-name | 1.1.4 | MIT | git@github.com:colorjs/color-name |
| commander | 2.20.3 | MIT | https://github.com/tj/commander.js |
| compress-commons | 4.1.2 | MIT | https://github.com/archiverjs/node-compress-commons |
| cookie | 1.1.1 | MIT | jshttp/cookie |
| crc-32 | 1.2.2 | Apache-2.0 | git://github.com/SheetJS/js-crc32 |
| crc32-stream | 4.0.3 | MIT | https://github.com/archiverjs/node-crc32-stream |
| css-select | 5.2.2 | BSD-2-Clause | git://github.com/fb55/css-select |
| css-tree | 3.2.1 | MIT | csstree/csstree |
| css-what | 6.2.2 | BSD-2-Clause | https://github.com/fb55/css-what |
| csso | 5.0.5 | MIT | css/csso |
| data-view-buffer | 1.0.2 | MIT | https://github.com/inspect-js/data-view-buffer |
| data-view-byte-length | 1.0.2 | MIT | https://github.com/inspect-js/data-view-byte-length |
| data-view-byte-offset | 1.0.1 | MIT | https://github.com/inspect-js/data-view-byte-offset |
| dayjs | 1.11.23 | MIT | https://github.com/iamkun/dayjs |
| decamelize | 1.2.0 | MIT | sindresorhus/decamelize |
| define-data-property | 1.1.4 | MIT | https://github.com/ljharb/define-data-property |
| define-properties | 1.2.1 | MIT | git://github.com/ljharb/define-properties |
| detect-libc | 2.1.2 | Apache-2.0 | git://github.com/lovell/detect-libc |
| detect-node | 2.1.0 | MIT | https://github.com/iliakan/detect-node |
| dijkstrajs | 1.0.3 | MIT | git://github.com/tcort/dijkstrajs |
| dom-serializer | 2.0.0 | MIT | git://github.com/cheeriojs/dom-serializer |
| domelementtype | 2.3.0 | BSD-2-Clause | git://github.com/fb55/domelementtype |
| domhandler | 5.0.3 | BSD-2-Clause | git://github.com/fb55/domhandler |
| domutils | 3.2.2 | BSD-2-Clause | git://github.com/fb55/domutils |
| dunder-proto | 1.0.1 | MIT | https://github.com/es-shims/dunder-proto |
| duplexer2 | 0.1.4 | BSD-3-Clause | deoxxa/duplexer2 |
| emoji-regex | 8.0.0 | MIT | https://github.com/mathiasbynens/emoji-regex |
| end-of-stream | 1.4.5 | MIT | git://github.com/mafintosh/end-of-stream |
| entities | 4.5.0 | BSD-2-Clause | git://github.com/fb55/entities |
| es-abstract | 1.24.2 | MIT | git://github.com/ljharb/es-abstract |
| es-abstract-get | 1.0.0 | MIT | https://github.com/ljharb/es-abstract-get |
| es-define-property | 1.0.1 | MIT | https://github.com/ljharb/es-define-property |
| es-errors | 1.3.0 | MIT | https://github.com/ljharb/es-errors |
| es-object-atoms | 1.1.2 | MIT | https://github.com/ljharb/es-object-atoms |
| es-set-tostringtag | 2.1.0 | MIT | https://github.com/es-shims/es-set-tostringtag |
| es-to-primitive | 1.3.4 | MIT | git://github.com/ljharb/es-to-primitive |
| es6-error | 4.1.1 | MIT | https://github.com/bjyoungblood/es6-error |
| escape-string-regexp | 4.0.0 | MIT | sindresorhus/escape-string-regexp |
| exceljs | 4.4.0 | MIT | https://github.com/exceljs/exceljs |
| fast-csv | 4.3.6 | MIT | https://github.com/C2FO/fast-csv |
| find-up | 5.0.0 | MIT | sindresorhus/find-up |
| flatbuffers | 25.9.23 | Apache-2.0 | https://github.com/google/flatbuffers |
| for-each | 0.3.5 | MIT | https://github.com/Raynos/for-each |
| fs-constants | 1.0.0 | MIT | https://github.com/mafintosh/fs-constants |
| fs.realpath | 1.0.0 | ISC | https://github.com/isaacs/fs.realpath |
| fstream | 1.0.12 | ISC | https://github.com/npm/fstream |
| function-bind | 1.1.2 | MIT | https://github.com/Raynos/function-bind |
| function.prototype.name | 1.2.0 | MIT | git://github.com/es-shims/Function.prototype.name |
| functions-have-names | 1.2.3 | MIT | https://github.com/inspect-js/functions-have-names |
| generator-function | 2.0.1 | MIT | https://github.com/TimothyGu/generator-function |
| get-caller-file | 2.0.5 | ISC | https://github.com/stefanpenner/get-caller-file |
| get-intrinsic | 1.3.0 | MIT | https://github.com/ljharb/get-intrinsic |
| get-proto | 1.0.1 | MIT | https://github.com/ljharb/get-proto |
| get-symbol-description | 1.1.0 | MIT | https://github.com/inspect-js/get-symbol-description |
| gifenc | 1.0.3 | MIT | git://github.com/mattdesl/gifenc |
| glob | 7.2.3 | ISC | git://github.com/isaacs/node-glob |
| global-agent | 3.0.0 | BSD-3-Clause | https://github.com/gajus/global-agent |
| globalthis | 1.0.4 | MIT | git://github.com/ljharb/System.global |
| gopd | 1.2.0 | MIT | https://github.com/ljharb/gopd |
| graceful-fs | 4.2.11 | ISC | https://github.com/isaacs/node-graceful-fs |
| guid-typescript | 1.0.9 | ISC | https://github.com/NicolasDeveloper/guid-typescript |
| has-bigints | 1.1.0 | MIT | https://github.com/ljharb/has-bigints |
| has-property-descriptors | 1.0.2 | MIT | https://github.com/inspect-js/has-property-descriptors |
| has-proto | 1.2.0 | MIT | https://github.com/inspect-js/has-proto |
| has-symbols | 1.1.0 | MIT | git://github.com/inspect-js/has-symbols |
| has-tostringtag | 1.0.2 | MIT | https://github.com/inspect-js/has-tostringtag |
| hasown | 2.0.4 | MIT | https://github.com/inspect-js/hasOwn |
| html-parse-stringify | 3.1.0 | MIT | https://github.com/henrikjoreteg/html-parse-stringify |
| i18next | 25.10.10 | MIT | https://github.com/i18next/i18next |
| ieee754 | 1.2.1 | BSD-3-Clause | git://github.com/feross/ieee754 |
| imagetracerjs | 1.2.6 | Unlicense | https://github.com/jankovicsandras/imagetracerjs |
| immediate | 3.0.6 | MIT | git://github.com/calvinmetcalf/immediate |
| inflight | 1.0.6 | ISC | https://github.com/npm/inflight |
| inherits | 2.0.4 | ISC | git://github.com/isaacs/inherits |
| internal-slot | 1.1.0 | MIT | https://github.com/ljharb/internal-slot |
| is-array-buffer | 3.0.5 | MIT | https://github.com/inspect-js/is-array-buffer |
| is-async-function | 2.1.1 | MIT | git://github.com/inspect-js/is-async-function |
| is-bigint | 1.1.0 | MIT | https://github.com/inspect-js/is-bigint |
| is-boolean-object | 1.2.2 | MIT | git://github.com/inspect-js/is-boolean-object |
| is-callable | 1.2.7 | MIT | git://github.com/inspect-js/is-callable |
| is-data-view | 1.0.2 | MIT | https://github.com/inspect-js/is-data-view |
| is-date-object | 1.1.0 | MIT | git://github.com/inspect-js/is-date-object |
| is-document.all | 1.0.0 | MIT | https://github.com/inspect-js/is-document.all |
| is-finalizationregistry | 1.1.1 | MIT | https://github.com/inspect-js/is-finalizationregistry |
| is-fullwidth-code-point | 3.0.0 | MIT | sindresorhus/is-fullwidth-code-point |
| is-generator-function | 1.1.2 | MIT | git://github.com/inspect-js/is-generator-function |
| is-map | 2.0.3 | MIT | https://github.com/inspect-js/is-map |
| is-negative-zero | 2.0.3 | MIT | git://github.com/inspect-js/is-negative-zero |
| is-number-object | 1.1.1 | MIT | git://github.com/inspect-js/is-number-object |
| is-regex | 1.2.1 | MIT | git://github.com/inspect-js/is-regex |
| is-set | 2.0.3 | MIT | https://github.com/inspect-js/is-set |
| is-shared-array-buffer | 1.0.4 | MIT | https://github.com/inspect-js/is-shared-array-buffer |
| is-string | 1.1.1 | MIT | git://github.com/inspect-js/is-string |
| is-symbol | 1.1.1 | MIT | git://github.com/inspect-js/is-symbol |
| is-typed-array | 1.1.15 | MIT | git://github.com/inspect-js/is-typed-array |
| is-weakmap | 2.0.2 | MIT | https://github.com/inspect-js/is-weakmap |
| is-weakref | 1.1.1 | MIT | https://github.com/inspect-js/is-weakref |
| is-weakset | 2.0.4 | MIT | https://github.com/inspect-js/is-weakset |
| isarray | 2.0.5 | MIT | git://github.com/juliangruber/isarray |
| json-stringify-safe | 5.0.1 | ISC | git://github.com/isaacs/json-stringify-safe |
| jszip | 3.10.2 | (MIT OR GPL-3.0-or-later) | https://github.com/Stuk/jszip |
| lazystream | 1.0.1 | MIT | https://github.com/jpommerening/node-lazystream |
| lie | 3.3.0 | MIT | https://github.com/calvinmetcalf/lie |
| listenercount | 1.0.1 | ISC | git@github.com:jden/node-listenercount |
| locate-path | 6.0.0 | MIT | sindresorhus/locate-path |
| lodash.defaults | 4.2.0 | MIT | lodash/lodash |
| lodash.difference | 4.5.0 | MIT | lodash/lodash |
| lodash.escaperegexp | 4.1.2 | MIT | lodash/lodash |
| lodash.flatten | 4.4.0 | MIT | lodash/lodash |
| lodash.groupby | 4.6.0 | MIT | lodash/lodash |
| lodash.isboolean | 3.0.3 | MIT | lodash/lodash |
| lodash.isequal | 4.5.0 | MIT | lodash/lodash |
| lodash.isfunction | 3.0.9 | MIT | lodash/lodash |
| lodash.isnil | 4.0.0 | MIT | lodash/lodash |
| lodash.isplainobject | 4.0.6 | MIT | lodash/lodash |
| lodash.isundefined | 3.0.1 | MIT | lodash/lodash |
| lodash.union | 4.6.0 | MIT | lodash/lodash |
| lodash.uniq | 4.5.0 | MIT | lodash/lodash |
| long | 5.3.2 | Apache-2.0 | https://github.com/dcodeIO/long.js |
| lucide-react | 0.540.0 | ISC | https://github.com/lucide-icons/lucide |
| matcher | 3.0.0 | MIT | sindresorhus/matcher |
| math-intrinsics | 1.1.0 | MIT | https://github.com/es-shims/math-intrinsics |
| mdn-data | 2.27.1 | CC0-1.0 | https://github.com/mdn/data |
| mediabunny | 1.62.1 | MPL-2.0 | https://github.com/Vanilagy/mediabunny |
| minimatch | 10.2.6 | BlueOak-1.0.0 | git@github.com:isaacs/minimatch |
| minimist | 1.2.8 | MIT | git://github.com/minimistjs/minimist |
| minipass | 7.1.3 | BlueOak-1.0.0 | https://github.com/isaacs/minipass |
| minizlib | 3.1.0 | MIT | https://github.com/isaacs/minizlib |
| mkdirp | 0.5.6 | MIT | https://github.com/substack/node-mkdirp |
| normalize-path | 3.0.0 | MIT | jonschlinkert/normalize-path |
| nth-check | 2.1.1 | BSD-2-Clause | https://github.com/fb55/nth-check |
| object-inspect | 1.13.4 | MIT | git://github.com/inspect-js/object-inspect |
| object-keys | 1.1.1 | MIT | git://github.com/ljharb/object-keys |
| object.assign | 4.1.7 | MIT | git://github.com/ljharb/object.assign |
| once | 1.4.0 | ISC | git://github.com/isaacs/once |
| onnxruntime-common | 1.21.0 | MIT | https://github.com/Microsoft/onnxruntime |
| onnxruntime-node | 1.21.0 | MIT | https://github.com/Microsoft/onnxruntime |
| onnxruntime-web | 1.22.0-dev.20250409-89f8206ba4 | MIT | https://github.com/Microsoft/onnxruntime |
| own-keys | 1.0.2 | MIT | https://github.com/ljharb/own-keys |
| p-limit | 3.1.0 | MIT | sindresorhus/p-limit |
| p-locate | 5.0.0 | MIT | sindresorhus/p-locate |
| pako | 1.0.11 | (MIT AND Zlib) | nodeca/pako |
| path-exists | 4.0.0 | MIT | sindresorhus/path-exists |
| path-is-absolute | 1.0.1 | MIT | sindresorhus/path-is-absolute |
| pdf-lib | 1.17.1 | MIT | https://github.com/Hopding/pdf-lib |
| pdfjs-dist | 5.4.394 | Apache-2.0 | https://github.com/mozilla/pdf.js |
| picocolors | 1.1.1 | ISC | alexeyraspopov/picocolors |
| platform | 1.3.6 | MIT | bestiejs/platform.js |
| pngjs | 5.0.0 | MIT | git://github.com/lukeapage/pngjs |
| possible-typed-array-names | 1.1.0 | MIT | https://github.com/ljharb/possible-typed-array-names |
| protobufjs | 7.6.6 | BSD-3-Clause | protobufjs/protobuf.js |
| qrcode | 1.5.4 | MIT | git://github.com/soldair/node-qrcode |
| react | 19.3.1 | MIT | https://github.com/react/react |
| react-dom | 19.3.1 | MIT | https://github.com/react/react |
| react-i18next | 15.7.4 | MIT | https://github.com/i18next/react-i18next |
| react-router | 7.18.4 | MIT | https://github.com/remix-run/react-router |
| readable-stream | 3.6.2 | MIT | git://github.com/nodejs/readable-stream |
| readdir-glob | 1.1.3 | Apache-2.0 | git://github.com/Yqnn/node-readdir-glob |
| reflect.getprototypeof | 1.0.10 | MIT | https://github.com/es-shims/Reflect.getPrototypeOf |
| regexp.prototype.flags | 1.5.4 | MIT | git://github.com/es-shims/RegExp.prototype.flags |
| require-directory | 2.1.1 | MIT | git://github.com/troygoode/node-require-directory |
| require-main-filename | 2.0.0 | ISC | ssh://git@github.com/yargs/require-main-filename |
| rimraf | 2.7.1 | ISC | git://github.com/isaacs/rimraf |
| roarr | 2.15.4 | BSD-3-Clause | git@github.com:gajus/roarr |
| safe-array-concat | 1.1.4 | MIT | https://github.com/ljharb/safe-array-concat |
| safe-buffer | 5.2.1 | MIT | git://github.com/feross/safe-buffer |
| safe-push-apply | 1.0.0 | MIT | https://github.com/ljharb/safe-push-apply |
| safe-regex-test | 1.1.0 | MIT | https://github.com/ljharb/safe-regex-test |
| sax | 1.6.1 | BlueOak-1.0.0 | ssh://git@github.com/isaacs/sax-js |
| saxes | 5.0.1 | ISC | https://github.com/lddubeau/saxes |
| scheduler | 0.28.0 | MIT | https://github.com/react/react |
| semver | 6.3.1 | ISC | https://github.com/npm/node-semver |
| semver-compare | 1.0.0 | MIT | git://github.com/substack/semver-compare |
| serialize-error | 7.0.1 | MIT | sindresorhus/serialize-error |
| set-blocking | 2.0.0 | ISC | https://github.com/yargs/set-blocking |
| set-cookie-parser | 2.7.2 | MIT | nfriedly/set-cookie-parser |
| set-function-length | 1.2.2 | MIT | https://github.com/ljharb/set-function-length |
| set-function-name | 2.0.2 | MIT | https://github.com/ljharb/set-function-name |
| set-proto | 1.0.0 | MIT | https://github.com/ljharb/set-proto |
| setimmediate | 1.0.5 | MIT | YuzuJS/setImmediate |
| sharp | 0.35.5 | Apache-2.0 | https://github.com/lovell/sharp |
| side-channel | 1.1.1 | MIT | https://github.com/ljharb/side-channel |
| side-channel-list | 1.0.1 | MIT | https://github.com/ljharb/side-channel-list |
| side-channel-map | 1.0.1 | MIT | https://github.com/ljharb/side-channel-map |
| side-channel-weakmap | 1.0.2 | MIT | https://github.com/ljharb/side-channel-weakmap |
| source-map-js | 1.2.2 | BSD-3-Clause | 7rulnik/source-map-js |
| sprintf-js | 1.1.3 | BSD-3-Clause | https://github.com/alexei/sprintf.js |
| stop-iteration-iterator | 1.1.0 | MIT | https://github.com/ljharb/stop-iteration-iterator |
| string_decoder | 1.3.0 | MIT | git://github.com/nodejs/string_decoder |
| string-width | 4.2.3 | MIT | sindresorhus/string-width |
| string.prototype.trim | 1.2.11 | MIT | git://github.com/es-shims/String.prototype.trim |
| string.prototype.trimend | 1.0.10 | MIT | git://github.com/es-shims/String.prototype.trimEnd |
| string.prototype.trimstart | 1.0.8 | MIT | git://github.com/es-shims/String.prototype.trimStart |
| strip-ansi | 6.0.1 | MIT | chalk/strip-ansi |
| svgo | 4.0.0 | MIT | git://github.com/svg/svgo |
| tar | 7.5.22 | BlueOak-1.0.0 | https://github.com/isaacs/node-tar |
| tar-stream | 2.2.0 | MIT | https://github.com/mafintosh/tar-stream |
| tmp | 0.2.7 | MIT | https://github.com/raszi/node-tmp |
| traverse | 0.3.10 | MIT | git://github.com/ljharb/js-traverse |
| tslib | 2.8.1 | 0BSD | https://github.com/Microsoft/tslib |
| type-fest | 0.13.1 | (MIT OR CC0-1.0) | sindresorhus/type-fest |
| typed-array-buffer | 1.0.3 | MIT | https://github.com/inspect-js/typed-array-buffer |
| typed-array-byte-length | 1.0.3 | MIT | https://github.com/inspect-js/typed-array-byte-length |
| typed-array-byte-offset | 1.0.5 | MIT | https://github.com/inspect-js/typed-array-byte-offset |
| typed-array-length | 1.0.8 | MIT | https://github.com/inspect-js/typed-array-length |
| typedarray.prototype.slice | 1.0.6 | MIT | https://github.com/es-shims/TypedArray.prototype.slice |
| unbox-primitive | 1.1.0 | MIT | https://github.com/ljharb/unbox-primitive |
| undici-types | 6.21.0 | MIT | https://github.com/nodejs/undici |
| unzipper | 0.10.14 | MIT | https://github.com/ZJONSSON/node-unzipper |
| utif2 | 4.1.0 | MIT | github:photopea/UTIF.js |
| util-deprecate | 1.0.2 | MIT | git://github.com/TooTallNate/util-deprecate |
| uuid | 11.1.1 | MIT | https://github.com/uuidjs/uuid |
| void-elements | 3.1.0 | MIT | pugjs/void-elements |
| wasm-feature-detect | 1.9.0 | Apache-2.0 | GoogleChromeLabs/wasm-feature-detect |
| wasm-media-encoders | 0.7.0 | MIT | https://github.com/arseneyr/wasm-media-encoders |
| web-vitals | 6.2.3 | Apache-2.0 | https://github.com/GoogleChrome/web-vitals |
| which-boxed-primitive | 1.1.1 | MIT | https://github.com/inspect-js/which-boxed-primitive |
| which-builtin-type | 1.2.1 | MIT | https://github.com/inspect-js/which-builtin-type |
| which-collection | 1.0.2 | MIT | https://github.com/inspect-js/which-collection |
| which-module | 2.0.1 | ISC | https://github.com/nexdrew/which-module |
| which-typed-array | 1.1.24 | MIT | git://github.com/inspect-js/which-typed-array |
| wrap-ansi | 6.2.0 | MIT | chalk/wrap-ansi |
| wrappy | 1.0.2 | ISC | https://github.com/npm/wrappy |
| xmlchars | 2.2.0 | MIT | https://github.com/lddubeau/xmlchars |
| y18n | 4.0.3 | ISC | git@github.com:yargs/y18n |
| yallist | 3.1.1 | ISC | https://github.com/isaacs/yallist |
| yargs | 15.4.1 | MIT | https://github.com/yargs/yargs |
| yargs-parser | 18.1.3 | ISC | https://github.com/yargs/yargs-parser |
| yocto-queue | 0.1.0 | MIT | sindresorhus/yocto-queue |
| zip-stream | 4.1.1 | MIT | https://github.com/archiverjs/node-zip-stream |
| zustand | 5.0.16 | MIT | https://github.com/pmndrs/zustand |

_Generated automatically by `scripts/third-party-notices.mjs`._
