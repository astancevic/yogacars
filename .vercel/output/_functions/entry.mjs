import { renderers } from './renderers.mjs';
import { a as actions } from './chunks/_noop-actions_CfKMStZn.mjs';
import { c as createExports } from './chunks/entrypoint_CjdkDbj9.mjs';
import { manifest } from './manifest_Ckks8sR0.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/fetchvehiclecount.astro.mjs');
const _page2 = () => import('./pages/api/fetchvehiclefilters.astro.mjs');
const _page3 = () => import('./pages/api/fetchvehicles.astro.mjs');
const _page4 = () => import('./pages/api/vehicles.astro.mjs');
const _page5 = () => import('./pages/import.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/fetchVehicleCount.ts", _page1],
    ["src/pages/api/fetchVehicleFilters.ts", _page2],
    ["src/pages/api/fetchVehicles.ts", _page3],
    ["src/pages/api/vehicles.ts", _page4],
    ["src/pages/import.ts", _page5],
    ["src/pages/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "136172e3-f72c-4895-9c6c-5f448853c35c",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
