import 'kleur/colors';
import { d as decodeKey } from './chunks/astro/server_C8Ft_gEr.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_n-uazuSJ.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/alex/Projects/yogaCarsAstro/","cacheDir":"file:///home/alex/Projects/yogaCarsAstro/node_modules/.astro/","outDir":"file:///home/alex/Projects/yogaCarsAstro/dist/","srcDir":"file:///home/alex/Projects/yogaCarsAstro/src/","publicDir":"file:///home/alex/Projects/yogaCarsAstro/public/","buildClientDir":"file:///home/alex/Projects/yogaCarsAstro/dist/client/","buildServerDir":"file:///home/alex/Projects/yogaCarsAstro/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/fetchvehiclecount","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/fetchVehicleCount\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"fetchVehicleCount","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/fetchVehicleCount.ts","pathname":"/api/fetchVehicleCount","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/fetchvehiclefilters","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/fetchVehicleFilters\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"fetchVehicleFilters","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/fetchVehicleFilters.ts","pathname":"/api/fetchVehicleFilters","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/fetchvehicles","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/fetchVehicles\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"fetchVehicles","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/fetchVehicles.ts","pathname":"/api/fetchVehicles","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/vehicles","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/vehicles\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"vehicles","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/vehicles.ts","pathname":"/api/vehicles","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/import","isIndex":false,"type":"endpoint","pattern":"^\\/import\\/?$","segments":[[{"content":"import","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/import.ts","pathname":"/import","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.DaDMuhCF.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/alex/Projects/yogaCarsAstro/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/api/fetchVehicleCount@_@ts":"pages/api/fetchvehiclecount.astro.mjs","\u0000@astro-page:src/pages/api/fetchVehicleFilters@_@ts":"pages/api/fetchvehiclefilters.astro.mjs","\u0000@astro-page:src/pages/api/fetchVehicles@_@ts":"pages/api/fetchvehicles.astro.mjs","\u0000@astro-page:src/pages/api/vehicles@_@ts":"pages/api/vehicles.astro.mjs","\u0000@astro-page:src/pages/import@_@ts":"pages/import.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","/home/alex/Projects/yogaCarsAstro/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DuWqMEal.mjs","\u0000@astrojs-manifest":"manifest_Ckks8sR0.mjs","/home/alex/Projects/yogaCarsAstro/src/components/Home/Branding":"_astro/Branding.B751gIau.js","/home/alex/Projects/yogaCarsAstro/src/components/Car/CarPage":"_astro/CarPage.XiOD1jMy.js","@astrojs/react/client.js":"_astro/client.CqBhBUpr.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.DaDMuhCF.css","/favicon.svg","/_astro/Branding.B751gIau.js","/_astro/CarPage.XiOD1jMy.js","/_astro/client.CqBhBUpr.js","/_astro/index.CDlOlYQx.js","/_astro/index.CclUD5iE.js","/_astro/utils.Du0zYwT5.js","/css/global.css","/assets/Chevrolet_logo.svg","/assets/images/Convertible.png","/assets/images/Coupe.png","/assets/images/Group 76.png","/assets/images/Group 77.png","/assets/images/Hatchback.png","/assets/images/SUV.png","/assets/images/Sedan.png","/assets/images/Truck.png","/assets/images/about-bg.png","/assets/images/about.png","/assets/images/bg-image-2.jpg","/assets/images/bg-image.png","/assets/images/car-bg-row.png","/assets/images/car-detail.png","/assets/images/car-diff.png","/assets/images/car-how-it-works-2.png","/assets/images/car-how-it-works.png","/assets/images/car-row.png","/assets/images/carlists-car-1.png","/assets/images/carlists-car-2.png","/assets/images/carlists-car-3.png","/assets/images/carlists-car-4.png","/assets/images/carlists-card-bg-1.png","/assets/images/carlists-card-bg-2.png","/assets/images/customer-image-full.png","/assets/images/customer-image.png","/assets/images/dealer-photos.jpg","/assets/images/extrior-thumbnail.jpg","/assets/images/favicon.png","/assets/images/favicon_yoga.png","/assets/images/filter-icon.png","/assets/images/icon.png","/assets/images/interior-thumbnail.jpg","/assets/images/mob-menu-icon-dark.png","/assets/images/mob-menu-icon.png","/assets/images/our-dealership.jpg","/assets/images/provide-sec.png","/assets/images/sell-trade-bg-car.png","/assets/images/sell-trade-bg.png","/assets/images/stock-photos.jpg","/assets/images/volvo-car.png","/assets/images/exteriorImages/54306_spin_2400_FT7_001.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_002.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_003.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_004.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_005.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_006.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_007.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_008.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_009.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_010.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_011.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_012.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_013.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_014.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_015.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_016.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_017.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_018.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_019.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_020.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_021.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_022.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_023.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_024.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_025.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_026.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_027.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_028.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_029.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_030.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_031.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_032.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_033.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_034.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_035.jpg","/assets/images/exteriorImages/54306_spin_2400_FT7_036.jpg","/assets/images/pano/54306_ineq_4000.png","/assets/images/svg/24-services-icon.svg","/assets/images/svg/Chevrolet_logo.svg","/assets/images/svg/Facebook.svg","/assets/images/svg/Ford_logo.svg","/assets/images/svg/Group 70.svg","/assets/images/svg/Group 71.svg","/assets/images/svg/Group 72.svg","/assets/images/svg/Group 73.svg","/assets/images/svg/Group 74 (1).svg","/assets/images/svg/Group 74.svg","/assets/images/svg/Group 75.svg","/assets/images/svg/Hyundai_logo.svg","/assets/images/svg/Instagram.svg","/assets/images/svg/Jeep_logo.svg","/assets/images/svg/KIA_logo.svg","/assets/images/svg/Lexus.svg","/assets/images/svg/Mazda_logo.svg","/assets/images/svg/Mercedes-Benz_logo.svg","/assets/images/svg/Nissan_logo.svg","/assets/images/svg/QuirkLogo.svg","/assets/images/svg/Suv.svg","/assets/images/svg/Toyota_logo.svg","/assets/images/svg/Twitter.svg","/assets/images/svg/Volkswagen_logo.svg","/assets/images/svg/admin-pic.svg","/assets/images/svg/alloy.svg","/assets/images/svg/android.svg","/assets/images/svg/arrow-down.svg","/assets/images/svg/arrow-next-slider.svg","/assets/images/svg/arrow-next.svg","/assets/images/svg/arrow-prev-slider.svg","/assets/images/svg/arrow-prev.svg","/assets/images/svg/arrow-up-active.svg","/assets/images/svg/arrow-up.svg","/assets/images/svg/automatic.svg","/assets/images/svg/bags.svg","/assets/images/svg/bluetooth.svg","/assets/images/svg/buick.svg","/assets/images/svg/camera.svg","/assets/images/svg/card-line-bar.svg","/assets/images/svg/chrysler.svg","/assets/images/svg/column-grid-active.svg","/assets/images/svg/column-grid.svg","/assets/images/svg/convertible-active.svg","/assets/images/svg/convertibles.svg","/assets/images/svg/coupe-active.svg","/assets/images/svg/coupe.svg","/assets/images/svg/customer-card-element.svg","/assets/images/svg/customer-image.svg","/assets/images/svg/degree360-rotate-icon.svg","/assets/images/svg/dodge.svg","/assets/images/svg/dollar.svg","/assets/images/svg/drop-down-active-icon.svg","/assets/images/svg/drop-down-icon.svg","/assets/images/svg/ellipse-how-it-works.svg","/assets/images/svg/fast-car-icon.svg","/assets/images/svg/favorite.svg","/assets/images/svg/fb-icon.svg","/assets/images/svg/full-services-icon.svg","/assets/images/svg/genesis.svg","/assets/images/svg/gmc.svg","/assets/images/svg/hatchback-active.svg","/assets/images/svg/hatchback.svg","/assets/images/svg/instagram-icon.svg","/assets/images/svg/keyless.svg","/assets/images/svg/line-bar-arrow.svg","/assets/images/svg/line-bar-icon.svg","/assets/images/svg/line-sm-icon.svg","/assets/images/svg/logo.svg","/assets/images/svg/meter.svg","/assets/images/svg/next-arrow-slider.svg","/assets/images/svg/people.svg","/assets/images/svg/phone.svg","/assets/images/svg/prev-arrow-slider.svg","/assets/images/svg/ram.svg","/assets/images/svg/row-grid-active.svg","/assets/images/svg/row-grid.svg","/assets/images/svg/search-icon.svg","/assets/images/svg/seat.svg","/assets/images/svg/sedan-active.svg","/assets/images/svg/sedan.svg","/assets/images/svg/service.svg","/assets/images/svg/staff.svg","/assets/images/svg/subaru.svg","/assets/images/svg/support.svg","/assets/images/svg/suv-active.svg","/assets/images/svg/twitter-icon.svg","/assets/images/svg/whatsapp.svg","/assets/images/svg/workers-icon.svg"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"03C0SM+R8a70mfhSidKzxKFbPlU+pgpszKkcFcyQT+g="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
