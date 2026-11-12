import assert from "node:assert/strict";
import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const bundle = await build({
  stdin: { loader: "jsx", resolveDir: process.cwd(), contents: `
    import React from 'react'; import {createRoot} from 'react-dom/client';
    import {ComingSoon, LaunchHeader, LaunchFooter,launchMainClassName} from './src/components/launch/ComingSoon';
    import {TikTokFeed} from './src/components/home/TikTokFeed';
    import {resolveLaunchSettings, resolveTikTokSettings, resolveCompanyLines} from './src/lib/launch';
    import {saveCookieConsent} from './src/lib/cookie-consent';
    window.setConsent = externalMedia => saveCookieConsent({necessary:true,analytics:false,externalMedia});
    const siteSettings = {
      practiceName:'The Sutton Vet', tagline:'Passionate about Animals and Our Local Community',
      launchSettings:resolveLaunchSettings(), companyLines:resolveCompanyLines({registeredName:'Vet ER LTD'}),
      phone:'0203 603 0298',email:'info@thesuttonvet.co.uk',address:'4 Spinning Wheel Way, Hackbridge, SM6 7DS',
      ctas:{call:'tel:02036030298',register:'/register',whatsapp:'https://wa.me/447440278373'},
      legalLinks:[{label:'Privacy Policy',href:'/privacy-policy'},{label:'Terms of Business',href:'/terms'}]
    };
    createRoot(document.getElementById('root')).render(location.pathname==='/feed'
      ? <main className="page-shell"><TikTokFeed settings={resolveTikTokSettings()}/></main>
      : <><LaunchHeader siteSettings={siteSettings}/><main className={'page-shell '+launchMainClassName}><div className="shell"><ComingSoon siteSettings={siteSettings}/><a href="/book" data-test-booking-success>Legacy registration success booking link</a></div></main><LaunchFooter siteSettings={siteSettings}/></>);
  ` },
  plugins: [{name:"next-fixtures",setup(plugin) {
    plugin.onResolve({filter:/^next\/(image|link)$/}, args => ({path:args.path,namespace:"fixture"}));
    plugin.onLoad({filter:/.*/,namespace:"fixture"}, args => ({loader:"jsx",resolveDir:process.cwd(),contents: args.path === "next/link"
      ? "import React from 'react'; export default p => <a {...p}/>;"
      : "import React from 'react'; export default function Image({fill,priority,sizes,...p}){return <img {...p} style={fill?{position:'absolute',width:'100%',height:'100%'}:undefined}/>;}"}));
  }}],
  bundle:true,write:false,outdir:"launch-test",jsx:"automatic",define:{"process.env.NODE_ENV":'"production"'},
});

const {chromium} = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const browser = await chromium.launch({channel:"msedge",headless:true});
try {
  const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
  const errors = []; const requests = []; const consoleErrors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("request", request => {if(request.url().includes("tiktok.com")) requests.push(request.url());});
  await page.route("https://launch.test/**", route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith(".png") || path.endsWith(".webp")) return route.fulfill({body:readFileSync("public"+path),contentType:path.endsWith(".png")?"image/png":"image/webp"});
    return route.fulfill({body:'<html><meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div></html>',contentType:"text/html"});
  });
  // Stub only the external provider, never a practice API or a registration write.
  if (!process.env.REAL_TIKTOK) await page.route("https://www.tiktok.com/**", route => route.fulfill({contentType:"text/html",body:'<!doctype html><title>TikTok provider fixture</title><p>Provider frame</p><script>parent.postMessage(JSON.stringify({height:390}),"*")</script>'}));
  async function mount(path) {
    await page.goto("https://launch.test"+path);
    for (const file of ["theme.css","globals.css","reference-theme.css"]) await page.addStyleTag({content:readFileSync("src/app/"+file,"utf8")});
    await page.addStyleTag({content:bundle.outputFiles.find(file => file.path.endsWith(".css")).text});
    await page.addScriptTag({content:bundle.outputFiles.find(file => file.path.endsWith(".js")).text});
  }
  await mount("/");
  await page.getByRole("heading",{name:"A new home for local pet care."}).waitFor();
  assert.equal(await page.getByRole("navigation").count(),0);
  assert.equal(await page.getByRole("link",{name:/Book Online/i}).count(),0);
  assert.equal(await page.getByRole("link",{name:/Register Now/}).count(),2);
  assert.equal(await page.locator('[data-test-booking-success]').isVisible(),false,"Coming soon also hides the registration success booking link");
  assert.equal(await page.getByRole("link",{name:"Privacy Policy"}).getAttribute("href"),"/privacy-policy");
  assert.match(await page.getByRole("contentinfo").innerText(),/trading name of Vet ER LTD/);
  assert.doesNotMatch(await page.getByRole("contentinfo").innerText(),/VAT|to be confirmed/);
  for (const width of [320,375,640,768,800,1024,1440,1920]) {
    await page.setViewportSize({width,height:1000});
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1),`Overflow at ${width}`);
    const logo = await page.getByRole("link",{name:"The Sutton Vet home"}).boundingBox();
    assert(logo.x>=12,`Logo inset at ${width}`);
    const register = await page.getByRole("banner").getByRole("link",{name:"Register Now"}).boundingBox();
    assert(register.x+register.width<=width-12,`Register inset at ${width}`);
    if ([375,1440].includes(width)) await page.screenshot({path:join(tmpdir(),`sutton-launch-${width}.png`),fullPage:true});
  }
  await page.setViewportSize({width:375,height:1000});
  await mount("/feed");
  await page.getByRole("heading",{name:"Our latest moments, on your terms."}).waitFor();
  assert.equal(requests.length,0,"No TikTok requests before consent");
  assert.equal(await page.locator("iframe").count(),0);
  if (process.env.REAL_TIKTOK) await page.evaluate(() => { window.providerMessages=[]; window.addEventListener('message',event=>{if(event.origin==='https://www.tiktok.com') window.providerMessages.push(event.data);}); });
  await page.evaluate(() => window.setConsent(true));
  const frame = page.locator("iframe");
  await frame.waitFor(); await frame.scrollIntoViewIfNeeded();
  assert.equal(new URL(await frame.getAttribute("src")).origin,"https://www.tiktok.com","Provider is cross-origin, not a privileged srcdoc");
  await page.waitForEvent("requestfinished", {predicate: r => r.url().startsWith("https://www.tiktok.com/embed/@the.sutton.vet"),timeout:10000}).catch(() => assert(requests.length>0, JSON.stringify(consoleErrors)));
  assert(requests.length>0,"Provider loads only after consent");
  if (!process.env.REAL_TIKTOK) {
    await page.waitForFunction(()=>document.querySelector('iframe')?.style.height==='392px');
    await page.evaluate(()=>window.dispatchEvent(new MessageEvent('message',{origin:'https://www.tiktok.com',source:window,data:JSON.stringify({height:1000})})));
    assert.equal(await frame.evaluate(element=>element.style.height),'392px','Ignore resize messages from a different browsing context');
  }
  if (process.env.REAL_TIKTOK) {
    await page.waitForTimeout(8000);
    console.log("TikTok live frame URLs:", page.frames().map(frame => frame.url()));
    console.log("TikTok provider console:", consoleErrors);
    console.log("TikTok resize messages:",await page.evaluate(()=>window.providerMessages));
    const provider=page.frames().find(frame=>frame.url().startsWith("https://www.tiktok.com/embed/@"));
    assert(provider,"Real creator frame loaded");
    console.log("TikTok provider text:",(await provider.locator('body').innerText()).slice(0,700));
    await page.screenshot({path:join(tmpdir(),"sutton-tiktok-provider.png"),fullPage:true});
  }
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1));
  await page.evaluate(() => window.setConsent(false));
  await page.getByRole("heading",{name:"Our latest moments, on your terms."}).waitFor();
  assert.equal(await page.locator("iframe").count(),0,"Consent revocation destroys the provider frame");
  const afterRevoke=requests.length;
  await page.waitForTimeout(300);
  assert.equal(requests.length,afterRevoke,"No new provider requests after revoke");
  assert.equal(await page.getByRole("link",{name:"Follow on TikTok"}).getAttribute("href"),"https://www.tiktok.com/@the.sutton.vet");
  assert.deepEqual(errors,[]);
  console.log("PASS launch at eight widths; registration/legal links; company disclosures; TikTok consent, isolation, revocation and fallback");
} finally {await browser.close();}
