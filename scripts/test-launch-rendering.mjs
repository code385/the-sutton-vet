import assert from "node:assert/strict";
import { build } from "esbuild";
import { createRequire } from "node:module";
import test from "node:test";

const bundle=await build({
  stdin:{resolveDir:process.cwd(),loader:"tsx",contents:`
    import Home from './src/app/page';
    import {renderToStaticMarkup} from 'react-dom/server';
    export async function render(mode) {globalThis.__launchMode=mode; return renderToStaticMarkup(await Home());}
  `},
  plugins:[{name:"server-fixtures",setup(plugin){
    plugin.onResolve({filter:/^@\/sanity\/lib\/(siteSettings|homePage|services|reviews)$/}, args=>({path:args.path,namespace:"cms"}));
    plugin.onLoad({filter:/.*/,namespace:"cms"},args=>({loader:"ts",resolveDir:process.cwd(),contents:args.path.endsWith("siteSettings")
      ? `import {resolveLaunchSettings,resolveTikTokSettings} from './src/lib/launch';
         export async function getSiteSettingsDocument(){return {};}
         export function resolveSiteSettings(){return {practiceName:'The Sutton Vet',tagline:'Passionate about Animals and Our Local Community',address:'Sutton',openingHours:[],ctas:{register:'/register'},launchSettings:resolveLaunchSettings({mode:globalThis.__launchMode}),tiktokFeed:resolveTikTokSettings()};}`
      : args.path.endsWith("homePage") ? "export async function getHomePageDocument(){return null;}"
      : args.path.endsWith("services") ? "export async function getServiceDocuments(){return [];}"
      : "export async function getClientReviews(){return [];}"}));
    plugin.onResolve({filter:/^next\/(image|link)$/},args=>({path:args.path,namespace:"next"}));
    plugin.onLoad({filter:/.*/,namespace:"next"},args=>({loader:"jsx",resolveDir:process.cwd(),contents: args.path.endsWith("link")
      ? "import React from 'react';export default props=><a {...props}/>;"
      : "import React from 'react';export default function Image({fill,priority,...props}){return <img {...props}/>;}"}));
  }}],
  loader:{".module.css":"empty",".css":"empty"},bundle:true,write:false,outdir:"launch-server-test",platform:"node",format:"cjs",packages:"external",jsx:"automatic",
});
const mod={exports:{}};
new Function("require","module","exports",bundle.outputFiles.find(file=>file.path.endsWith('.js')).text)(createRequire(import.meta.url),mod,mod.exports);

test("coming soon renders only launch content, not a hidden full homepage",async()=>{
  const html=await mod.exports.render("comingSoon");
  assert.match(html,/Coming Soon in February 2027/);
  assert.match(html,/href="\/register"/);
  assert.doesNotMatch(html,/See All Services|Check available times|tiktok-heading|Book Online/);
});

test("full mode restores homepage services and places TikTok below reviews/location",async()=>{
  const html=await mod.exports.render("full");
  assert.match(html,/See All Services/);
  assert.match(html,/tiktok-heading/);
  assert(html.indexOf("tiktok-heading")>html.indexOf("sv-home-location-v1"));
  assert.match(html,/Our latest moments, on your terms/);
  assert.doesNotMatch(html,/<iframe[^>]*tiktok/,'Provider does not load in server HTML before consent');
});
