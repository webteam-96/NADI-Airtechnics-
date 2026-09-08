import React, { useState, useMemo } from "react";

/* ============================================================
   Nadi Airtechnics — Unified Operations Platform
   v2 — built on the revamped workflow

   One spine of 8 checkpoints · stage + exception (not 4 status columns)
   Two order classes · supply items with ageing · dispatch gate
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.nadi *, .nadi *::before, .nadi *::after { box-sizing: border-box; }
.nadi {
  --blue:#12459E; --blue-deep:#0B2C68; --blue-tint:#EAF0FA; --blue-line:#C3D3EE;
  --ink:#101418; --grey:#5C6672; --grey-soft:#8B949E; --line:#E1E5EA; --page:#F4F6F9; --white:#fff;
  --risk:#A3231C; --risk-bg:#FBECEB; --risk-line:#EFC9C6;
  --warn:#8A5200; --warn-bg:#FBF2E3; --warn-line:#EBD6AE;
  --ok:#1D6B41; --ok-bg:#EAF3ED; --ok-line:#C2DDCD;
  font-family:'IBM Plex Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  color:var(--ink); background:var(--page); min-height:100vh; display:flex;
  font-size:14px; line-height:1.5; -webkit-font-smoothing:antialiased;
}
.nadi button{font:inherit;color:inherit;cursor:pointer;border:none;background:none;}
.nadi button:focus-visible,.nadi a:focus-visible{outline:2px solid var(--blue);outline-offset:2px;}
.mono{font-family:'IBM Plex Mono',ui-monospace,monospace;font-feature-settings:'tnum';}

.rail{width:238px;flex-shrink:0;background:var(--white);border-right:1px solid var(--line);
  display:flex;flex-direction:column;position:sticky;top:0;height:100vh;}
.brand{padding:20px 20px 18px;border-bottom:1px solid var(--line);}
.brand-mark{display:flex;align-items:center;gap:9px;}
.brand-dot{width:22px;height:22px;border-radius:3px;background:var(--blue);display:grid;
  place-items:center;color:#fff;font-size:12px;font-weight:700;}
.brand-name{font-weight:600;letter-spacing:-.01em;}
.brand-sub{color:var(--grey-soft);font-size:12px;margin-top:3px;padding-left:31px;}
.nav{padding:12px 10px;flex:1;overflow-y:auto;}
.nav-item{width:100%;text-align:left;display:flex;align-items:center;justify-content:space-between;
  gap:10px;padding:8px 10px;border-radius:5px;color:var(--grey);margin-bottom:1px;}
.nav-item:hover{background:var(--page);color:var(--ink);}
.nav-item.on{background:var(--blue-tint);color:var(--blue-deep);font-weight:600;}
.nav-count{font-size:11px;font-weight:600;padding:1px 6px;border-radius:9px;background:var(--page);color:var(--grey);}
.nav-item.on .nav-count{background:var(--white);color:var(--blue);}
.nav-count.hot{background:var(--risk-bg);color:var(--risk);}
.role-box{border-top:1px solid var(--line);padding:12px;}
.role-label{font-size:11px;color:var(--grey-soft);margin-bottom:6px;}
.role-select{width:100%;padding:7px 9px;border:1px solid var(--line);border-radius:5px;
  background:var(--white);font:inherit;font-size:13px;color:var(--ink);}
.role-who{display:flex;align-items:center;gap:8px;margin-top:10px;}
.avatar{width:26px;height:26px;border-radius:50%;background:var(--blue-tint);color:var(--blue-deep);
  display:grid;place-items:center;font-size:11px;font-weight:600;}
.main{flex:1;min-width:0;}
.topbar{height:56px;background:var(--white);border-bottom:1px solid var(--line);display:flex;
  align-items:center;gap:16px;padding:0 24px;position:sticky;top:0;z-index:20;}
.search{flex:1;max-width:430px;display:flex;align-items:center;gap:8px;border:1px solid var(--line);
  border-radius:5px;padding:7px 11px;background:var(--page);}
.search input{border:none;background:none;outline:none;font:inherit;width:100%;color:var(--ink);}
.search input::placeholder{color:var(--grey-soft);}
.topbar-meta{margin-left:auto;color:var(--grey);font-size:13px;display:flex;align-items:center;gap:16px;}
.page{padding:24px;max-width:1300px;}
.page-head{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:18px;}
h1.title{font-size:21px;font-weight:600;letter-spacing:-.015em;margin:0;}
.subtitle{color:var(--grey);margin-top:4px;font-size:13px;}
h2.sec{font-size:13px;font-weight:600;color:var(--grey);margin:0 0 10px;}

.btn{padding:8px 14px;border-radius:5px;background:var(--blue);color:#fff;font-weight:500;font-size:13px;white-space:nowrap;}
.btn:hover{background:var(--blue-deep);}
.btn.ghost{background:var(--white);color:var(--ink);border:1px solid var(--line);}
.btn.ghost:hover{background:var(--page);}
.btn.sm{padding:5px 10px;font-size:12px;}
.btn:disabled{opacity:.45;cursor:not-allowed;}

.card{background:var(--white);border:1px solid var(--line);border-radius:6px;}
.card-pad{padding:18px 20px;}
.card-head{padding:13px 20px;border-bottom:1px solid var(--line);display:flex;align-items:center;
  justify-content:space-between;gap:12px;}
.card-title{font-size:13px;font-weight:600;}
.grid2{display:grid;grid-template-columns:1fr 340px;gap:16px;align-items:start;}
.stack{display:flex;flex-direction:column;gap:16px;}

.pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:500;
  padding:2px 8px 2px 7px;border-radius:3px;white-space:nowrap;background:var(--page);
  color:var(--grey);border:1px solid var(--line);}
.pill .glyph{font-size:10px;line-height:1;}
.pill.risk{background:var(--risk-bg);color:var(--risk);border-color:var(--risk-line);}
.pill.warn{background:var(--warn-bg);color:var(--warn);border-color:var(--warn-line);}
.pill.ok{background:var(--ok-bg);color:var(--ok);border-color:var(--ok-line);}
.pill.info{background:var(--blue-tint);color:var(--blue-deep);border-color:var(--blue-line);}
.pill.hollow{background:var(--white);}

.att{display:flex;gap:14px;padding:13px 20px;border-bottom:1px solid var(--line);align-items:flex-start;}
.att:last-child{border-bottom:none;}
.att-bar{width:3px;align-self:stretch;border-radius:2px;background:var(--line);flex-shrink:0;}
.att-bar.risk{background:var(--risk);} .att-bar.warn{background:var(--warn);} .att-bar.info{background:var(--blue);}
.att-body{flex:1;min-width:0;}
.att-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.att-title{font-weight:500;}
.att-sub{color:var(--grey);font-size:13px;margin-top:3px;}
.att-actions{display:flex;gap:7px;align-items:center;flex-shrink:0;}

table.tbl{width:100%;border-collapse:collapse;}
.tbl th{text-align:left;font-size:12px;font-weight:600;color:var(--grey);padding:9px 14px;
  border-bottom:1px solid var(--line);white-space:nowrap;}
.tbl td{padding:11px 14px;border-bottom:1px solid var(--line);vertical-align:middle;}
.tbl tr:last-child td{border-bottom:none;}
.tbl tbody tr.click{cursor:pointer;}
.tbl tbody tr.click:hover{background:var(--blue-tint);}
.link{color:var(--blue);font-weight:500;}
.muted{color:var(--grey);} .tiny{font-size:12px;} .soft{color:var(--grey-soft);}

.stages{display:flex;align-items:flex-start;overflow-x:auto;padding:4px 0 2px;}
.stage{flex:1;min-width:86px;position:relative;padding-top:20px;}
.stage::before{content:'';position:absolute;top:6px;left:0;right:0;height:2px;background:var(--line);}
.stage.done::before,.stage.now::before{background:var(--blue);}
.stage:first-child::before{left:50%;} .stage:last-child::before{right:50%;}
.stage .knob{position:absolute;top:0;left:calc(50% - 7px);width:14px;height:14px;border-radius:50%;
  background:var(--white);border:2px solid var(--line);display:grid;place-items:center;font-size:9px;color:#fff;line-height:1;}
.stage.done .knob{background:var(--blue);border-color:var(--blue);}
.stage.now .knob{border-color:var(--blue);border-width:4px;}
.stage.stop .knob{background:var(--risk);border-color:var(--risk);}
.stage .nm{font-size:12px;text-align:center;color:var(--grey-soft);padding:0 4px;}
.stage.done .nm{color:var(--grey);} .stage.now .nm{color:var(--blue-deep);font-weight:600;}

.ohead{background:var(--white);border:1px solid var(--line);border-radius:6px;}
.ohead-top{padding:16px 20px;display:flex;align-items:flex-start;justify-content:space-between;gap:20px;flex-wrap:wrap;}
.ono{font-size:19px;font-weight:600;letter-spacing:-.01em;}
.ofacts{display:flex;gap:20px;flex-wrap:wrap;margin-top:10px;}
.fact-k{font-size:11px;color:var(--grey-soft);}
.fact-v{font-size:13px;margin-top:1px;}
.ohead-stages{padding:14px 24px 16px;border-top:1px solid var(--line);}

.catch{border:1px solid var(--blue-line);background:var(--blue-tint);border-radius:6px;padding:16px 18px;}
.catch-h{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;}
.catch-t{font-weight:600;color:var(--blue-deep);font-size:13px;}
.catch-row{display:flex;gap:12px;padding:5px 0;align-items:baseline;}
.catch-k{width:112px;flex-shrink:0;font-size:12px;color:var(--blue-deep);opacity:.8;}
.catch-v{font-size:13px;}

.duo{display:grid;grid-template-columns:1fr 1fr;}
.duo>div{padding:16px 20px;}
.duo>div:first-child{border-right:1px solid var(--line);}
.duo-k{font-size:11px;color:var(--grey-soft);margin-bottom:6px;}
.duo-v{font-weight:600;}
.duo-s{color:var(--grey);font-size:13px;margin-top:3px;}
.bar{height:5px;background:var(--page);border-radius:3px;margin-top:10px;overflow:hidden;}
.bar>i{display:block;height:100%;background:var(--blue);border-radius:3px;}
.bar>i.red{background:var(--risk);}

.tl{padding:4px 20px 16px;}
.tl-row{display:flex;gap:14px;padding:12px 0 0;}
.tl-when{width:80px;flex-shrink:0;font-size:12px;color:var(--grey-soft);padding-top:1px;}
.tl-line{width:9px;flex-shrink:0;position:relative;}
.tl-line::before{content:'';position:absolute;left:4px;top:12px;bottom:-12px;width:1px;background:var(--line);}
.tl-row:last-child .tl-line::before{display:none;}
.tl-dot{width:9px;height:9px;border-radius:50%;background:var(--white);border:2px solid var(--blue-line);margin-top:5px;}
.tl-dot.mark{background:var(--blue);border-color:var(--blue);}
.tl-dot.bad{background:var(--risk);border-color:var(--risk);}
.tl-body{flex:1;padding-bottom:4px;}
.tl-act{font-weight:500;}
.tl-meta{font-size:12px;color:var(--grey-soft);margin-top:2px;}
.tl-note{font-size:13px;color:var(--grey);margin-top:5px;padding-left:10px;border-left:2px solid var(--line);}

.tabs{display:flex;gap:2px;border-bottom:1px solid var(--line);overflow-x:auto;padding:0 6px;}
.tab{padding:10px 12px;font-size:13px;color:var(--grey);border-bottom:2px solid transparent;
  margin-bottom:-1px;white-space:nowrap;}
.tab:hover{color:var(--ink);}
.tab.on{color:var(--blue-deep);border-bottom-color:var(--blue);font-weight:600;}

.gate{padding:6px 20px 16px;}
.gate-row{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--line);}
.gate-row:last-child{border-bottom:none;}
.gate-mark{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font-size:11px;flex-shrink:0;}
.gate-mark.pass{background:var(--ok-bg);color:var(--ok);border:1px solid var(--ok-line);}
.gate-mark.fail{background:var(--risk-bg);color:var(--risk);border:1px solid var(--risk-line);}
.gate-mark.na{background:var(--page);color:var(--grey-soft);border:1px solid var(--line);}
.gate-t{flex:1;}
.gate-s{font-size:12px;color:var(--grey-soft);margin-top:1px;}
.gate-verdict{padding:14px 20px;border-top:1px solid var(--line);display:flex;align-items:center;
  justify-content:space-between;gap:12px;background:var(--page);border-radius:0 0 6px 6px;}

.sub{display:flex;align-items:center;gap:12px;padding:11px 20px;border-bottom:1px solid var(--line);}
.sub:last-child{border-bottom:none;}
.sub-n{flex:1;font-weight:500;}
.hold td{background:var(--warn-bg);}
.op-hold-tag{font-size:11px;color:var(--warn);border:1px solid var(--warn-line);
  background:var(--white);padding:1px 6px;border-radius:3px;}

.kb{display:grid;grid-template-columns:repeat(5,minmax(178px,1fr));gap:12px;overflow-x:auto;}
.kb-col{background:var(--white);border:1px solid var(--line);border-radius:6px;}
.kb-h{padding:10px 12px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;
  align-items:center;font-size:12px;font-weight:600;}
.kb-card{padding:10px 12px;border-bottom:1px solid var(--line);cursor:pointer;}
.kb-card:last-child{border-bottom:none;}
.kb-card:hover{background:var(--blue-tint);}
.kb-id{font-size:12px;font-weight:600;}
.kb-sub{font-size:11px;color:var(--grey-soft);margin-top:2px;}
.kb-empty{padding:14px 12px;font-size:12px;color:var(--grey-soft);}

.op-wrap{max-width:520px;margin:0 auto;}
.op-card{background:var(--white);border:1px solid var(--line);border-radius:8px;overflow:hidden;}
.op-head{padding:20px;border-bottom:1px solid var(--line);}
.op-job{font-size:23px;font-weight:600;letter-spacing:-.01em;}
.op-oper{color:var(--grey);margin-top:4px;}
.op-body{padding:20px;}
.op-btn{width:100%;padding:22px;border-radius:6px;background:var(--blue);color:#fff;font-size:19px;font-weight:600;}
.op-btn:hover{background:var(--blue-deep);}
.op-btn.stop{background:var(--ink);} .op-btn.stop:hover{background:#000;}
.op-sec{width:100%;padding:13px;border-radius:6px;border:1px solid var(--line);margin-top:10px;
  font-weight:500;background:var(--white);}
.op-sec:hover{background:var(--page);}
.op-state{text-align:center;padding:14px 0 18px;}
.op-state-k{font-size:12px;color:var(--grey-soft);}
.op-state-v{font-size:17px;font-weight:600;margin-top:3px;}
.op-choices{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.op-choice{padding:18px 12px;border:1px solid var(--line);border-radius:6px;font-weight:500;background:var(--white);}
.op-choice:hover{border-color:var(--blue);background:var(--blue-tint);}
.op-choice.pick{border-color:var(--blue);background:var(--blue-tint);color:var(--blue-deep);}
.qty{display:flex;align-items:center;gap:12px;justify-content:center;margin:16px 0;}
.qty button{width:46px;height:46px;border:1px solid var(--line);border-radius:6px;font-size:20px;background:var(--white);}
.qty button:hover{background:var(--page);}
.qty-v{font-size:30px;font-weight:600;min-width:62px;text-align:center;}
.done-note{text-align:center;padding:30px 10px;}
.done-tick{width:46px;height:46px;border-radius:50%;background:var(--ok-bg);color:var(--ok);
  display:grid;place-items:center;margin:0 auto 12px;font-size:22px;}

.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.kpi{background:var(--white);border:1px solid var(--line);border-radius:6px;padding:15px 16px;}
.kpi-k{font-size:12px;color:var(--grey);}
.kpi-v{font-size:25px;font-weight:600;margin-top:5px;letter-spacing:-.02em;}
.kpi-s{font-size:12px;color:var(--grey-soft);margin-top:3px;}
.empty{padding:40px 20px;text-align:center;color:var(--grey);}
.empty b{display:block;color:var(--ink);font-weight:600;margin-bottom:4px;}
.crumb{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--grey);margin-bottom:12px;}
.filters{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px;}
.chip{padding:5px 11px;border:1px solid var(--line);border-radius:14px;font-size:12px;background:var(--white);color:var(--grey);}
.chip.on{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:500;}
.toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;
  padding:11px 18px;border-radius:6px;font-size:13px;z-index:50;box-shadow:0 4px 14px rgba(0,0,0,.18);}
.note{background:var(--blue-tint);border:1px solid var(--blue-line);border-radius:6px;
  padding:12px 14px;font-size:13px;color:var(--blue-deep);}

@media (max-width:1080px){.grid2{grid-template-columns:1fr;}.kpis{grid-template-columns:repeat(2,1fr);}}
@media (max-width:760px){.rail{display:none;}.page{padding:16px;}.duo{grid-template-columns:1fr;}
  .duo>div:first-child{border-right:none;border-bottom:1px solid var(--line);}}
@media (prefers-reduced-motion:reduce){.nadi *{transition:none!important;animation:none!important;}}

/* ---- v3: order workspace + right rail ---- */
.ws-layout{display:flex;gap:16px;align-items:flex-start;}
.ws-main{flex:1;min-width:0;}
.ws-rail{width:344px;flex-shrink:0;position:sticky;top:72px;max-height:calc(100vh - 88px);overflow-y:auto;}

/* stance vocabulary */
.stance{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;
  padding:2px 8px 2px 7px;border-radius:3px;white-space:nowrap;border:1px solid;}
.stance .glyph{font-size:10px;line-height:1;}
.stance.yes{background:var(--ok-bg);color:var(--ok);border-color:var(--ok-line);}
.stance.no{background:var(--risk-bg);color:var(--risk);border-color:var(--risk-line);}
.stance.thinking{background:var(--warn-bg);color:var(--warn);border-color:var(--warn-line);}
.stance.awaiting{background:var(--page);color:var(--grey-soft);border-color:var(--line);}

/* positions board */
.rail-card{background:var(--white);border:1px solid var(--line);border-radius:6px;margin-bottom:14px;}
.rail-head{padding:12px 14px;border-bottom:1px solid var(--line);display:flex;align-items:center;
  justify-content:space-between;gap:10px;}
.rail-title{font-size:13px;font-weight:600;}
.tally{display:flex;gap:6px;flex-wrap:wrap;padding:11px 14px;border-bottom:1px solid var(--line);}
.tally-b{font-size:11px;font-weight:600;padding:2px 7px;border-radius:9px;border:1px solid var(--line);
  background:var(--page);color:var(--grey);}
.tally-b.yes{background:var(--ok-bg);color:var(--ok);border-color:var(--ok-line);}
.tally-b.no{background:var(--risk-bg);color:var(--risk);border-color:var(--risk-line);}
.tally-b.thinking{background:var(--warn-bg);color:var(--warn);border-color:var(--warn-line);}
.pos{display:flex;align-items:center;gap:10px;padding:9px 14px;border-bottom:1px solid var(--line);}
.pos:last-child{border-bottom:none;}
.pos-who{flex:1;min-width:0;}
.pos-role{font-size:13px;font-weight:500;}
.pos-name{font-size:11px;color:var(--grey-soft);}
.pos.me{background:var(--blue-tint);}
.pos-me-tag{font-size:10px;color:var(--blue);font-weight:600;}

/* comment thread */
.thread{max-height:none;}
.cmt{display:flex;gap:10px;padding:12px 14px;border-bottom:1px solid var(--line);}
.cmt:last-child{border-bottom:none;}
.cmt-av{width:26px;height:26px;border-radius:50%;flex-shrink:0;background:var(--blue-tint);
  color:var(--blue-deep);display:grid;place-items:center;font-size:10px;font-weight:600;}
.cmt-body{flex:1;min-width:0;}
.cmt-top{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.cmt-role{font-size:12px;font-weight:600;}
.cmt-when{font-size:11px;color:var(--grey-soft);}
.cmt-text{font-size:13px;color:var(--ink);margin-top:4px;line-height:1.5;}
.cmt-empty{padding:22px 14px;text-align:center;color:var(--grey-soft);font-size:12px;}

/* composer */
.compose{padding:12px 14px;border-top:1px solid var(--line);background:var(--page);border-radius:0 0 6px 6px;}
.compose-lbl{font-size:11px;color:var(--grey-soft);margin-bottom:7px;}
.stance-pick{display:flex;gap:6px;margin-bottom:9px;}
.stance-opt{flex:1;padding:7px 4px;border:1px solid var(--line);border-radius:5px;font-size:12px;
  font-weight:500;background:var(--white);display:flex;align-items:center;justify-content:center;gap:5px;}
.stance-opt:hover{border-color:var(--blue);}
.stance-opt.pick.yes{background:var(--ok-bg);color:var(--ok);border-color:var(--ok-line);}
.stance-opt.pick.no{background:var(--risk-bg);color:var(--risk);border-color:var(--risk-line);}
.stance-opt.pick.thinking{background:var(--warn-bg);color:var(--warn);border-color:var(--warn-line);}
.compose textarea{width:100%;border:1px solid var(--line);border-radius:5px;padding:9px 10px;font:inherit;
  font-size:13px;resize:vertical;min-height:58px;background:var(--white);color:var(--ink);}
.compose textarea:focus{outline:none;border-color:var(--blue);}
.compose-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:9px;}

/* order lines strip + decode + payment */
.lines-strip{display:flex;gap:8px;overflow-x:auto;padding:4px 0;}
.line-chip{flex-shrink:0;min-width:150px;border:1px solid var(--line);border-radius:5px;padding:9px 11px;background:var(--white);}
.line-chip.on{border-color:var(--blue);background:var(--blue-tint);}
.line-chip .lc-no{font-size:11px;font-weight:600;}
.line-chip .lc-model{font-size:12px;color:var(--grey);margin-top:2px;}
.decode{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--grey);
  background:var(--page);border:1px dashed var(--line);border-radius:3px;padding:2px 7px;}
.decode b{color:var(--ink);font-weight:600;font-family:'IBM Plex Mono',monospace;}

/* revenue view */
.rev-tbl td.num,.rev-tbl th.num{text-align:right;font-family:'IBM Plex Mono',monospace;font-feature-settings:'tnum';white-space:nowrap;}
.rev-tbl td.pos{color:var(--ok);} .rev-tbl td.neg{color:var(--risk);}
.rev-tbl tr.total td{font-weight:600;background:var(--page);}
.rev-scroll{overflow-x:auto;}
@media (max-width:1180px){.ws-layout{flex-direction:column;}.ws-rail{width:100%;position:static;}}
`;

/* ------------------------------------------------------------
   The spine — both order classes ride these eight checkpoints
   ------------------------------------------------------------ */
const SPINE = [
  "Order accepted", "Drawing released", "Plan confirmed", "Material ready",
  "Parts made", "Assembled & tested", "Quality released", "Dispatched",
];

/* Legacy production status codes carried on the Pending Order sheet.
   Shown transitionally beside the plain-language checkpoint (PRD §29). */
const LEGACY_MAP = {
  RE: "Ready", FQC: "Final quality check", FAB: "In fabrication", ASS: "In assembly",
  "ASS/B": "Assembly — balancing", "ASS/CM": "Assembly — waiting customer motor",
  B: "Balancing", CI: "Customer inspection", DI: "Despatch inspection",
  PD: "Pending despatch", FCP: "Final coat & paint", "FCP/CM": "Paint — waiting customer motor",
  TE: "Testing", "MFG-BL": "Manufacturing backlog", SHORT: "Short supply",
};

/* Drive type governs which sub-assemblies exist (Manufacturing Plan sheet).
   Direct-drive fans have no separate shaft — the motor shaft is used. */
const DRIVE_NOTE = {
  Direct: "Direct drive — no separate shaft (motor shaft used)",
  Coupled: "Coupled drive — separate shaft on a coupling",
  Belt: "Belt drive — separate shaft and pulleys",
};

/* Product code from the sheet's CODE column (not a lifecycle field). */
const CODE_LABEL = { A: "Axial (NAF)", C: "Centrifugal", S: "Silencer", SERVICE: "Service / spares" };

const STANCE_MAP = {
  yes:      { cls: "yes", glyph: "●", label: "Yes" },
  no:       { cls: "no", glyph: "■", label: "No" },
  thinking: { cls: "thinking", glyph: "◆", label: "Thinking" },
  awaiting: { cls: "awaiting", glyph: "○", label: "Awaiting" },
};

/* Roles that hold a position on an order decision, in handoff order. */
const STAKEHOLDERS = ["sales", "projects", "planning", "design", "purchase", "stores", "supervisor", "quality", "dispatch", "management"];

/* ------------------------------------------------------------
   Data, shaped from the live Pending Order workbook
   ------------------------------------------------------------ */
const ORDERS = [
  {
    oa: "19962", epicor: "019962-3-1", sap: "SO-40211", custPo: "SR9/4020115683",
    customer: "Cochin Shipyard Limited", model: "NAF/630/150/5/21", qty: 1, amount: "2,61,990",
    insp: "Self", agent: "Satheesh Kumar R", cls: "Catalogue",
    code: "A", drive: "Direct", legacy: "ASS/CM", lifecycle: "active", openedDays: 118,
    payTerms: "50% advance, balance before despatch", payState: "advance-only",
    mfgMonth: "Aug-26", revenueMonth: "Aug-26", drgRecd: "24-05-2026", drgRevised: "—",
    lines: [
      { epicor: "019962-1-1", model: "NAF/1050/255/6", qty: 1, checkpoint: "Assembled & tested", state: "blocked", note: "Waiting motor" },
      { epicor: "019962-2-1", model: "NAF-900-350-09", qty: 1, checkpoint: "Assembled & tested", state: "blocked", note: "Waiting motor" },
      { epicor: "019962-3-1", model: "NAF/630/150/5/21", qty: 1, checkpoint: "Material ready", state: "blocked", note: "This line" },
      { epicor: "019962-6-1", model: "NAF/560/150/5", qty: 1, checkpoint: "Parts made", state: "on-track", note: "" },
      { epicor: "019962-20-1", model: "NAF/315/150/5/10", qty: 1, checkpoint: "Parts made", state: "on-track", note: "" },
    ],
    poDate: "12-05-2026", poCleared: "20-05-2026", oaReleased: "22-05-2026", gaApproval: "05-06-2026",
    need: "30-07-2026", promise: "25-08-2026", revised: "08-09-2026",
    planMonth: "Aug-26", planWeek: "Wk-4", weight: "1,240",
    checkpoint: "Material ready", state: "blocked", stateNote: "Blocked — motor",
    owner: "Purchase — S. Kulkarni", pct: 40,
    current: "Waiting for the motor",
    currentSub: "All four sub-assemblies finished. Motor was due 25-08 and has not arrived.",
    next: "Confirm a delivery date with Crompton", nextOwner: "Purchase", nextDue: "Overdue by 14 days",
    subitems: [
      { n: "Hub", s: "Ready", d: "12-07-2026" },
      { n: "Shaft", s: "Ready", d: "18-07-2026" },
      { n: "Impeller", s: "Ready", d: "24-07-2026" },
      { n: "Casing", s: "Ready", d: "28-07-2026" },
    ],
    supply: [
      { item: "Motor 15 kW", scope: "Nadi (NM)", supplier: "Crompton Greaves", expected: "25-08-2026", received: null, age: 14 },
      { item: "Bearing set", scope: "Nadi (NM)", supplier: "SKF India", expected: "20-07-2026", received: "19-07-2026", age: 0 },
    ],
    gate: [
      { t: "Quality released", s: "fail", n: "Cannot test without the motor" },
      { t: "Customer inspection", s: "na", n: "Not required — inspection is Self" },
      { t: "Crate ready", s: "fail", n: "Not raised" },
      { t: "Documents complete", s: "pass", n: "Drawing R2 and test format ready" },
      { t: "As-built BOM frozen", s: "fail", n: "Freezes at assembly completion" },
    ],
    exceptions: [
      { t: "Motor shortage", sub: "15 kW motor expected 25-08, still not received. Delivery moved to 08-09.", owner: "Purchase", due: "Overdue 14 days", level: "risk" },
    ],
    catch: {
      promised: "1 × NAF/630/150/5/21 to Cochin Shipyard. Promised 25-08, now committed 08-09.",
      done: "All four sub-assemblies ready — hub, shaft, impeller and casing complete by 28-07.",
      blocking: "The 15 kW motor has not arrived. It was due 25-08 and is 14 days overdue.",
      next: "Purchase confirms a supplier date. Nothing else on this order can move until then.",
    },
    timeline: [
      { when: "08-09-26", time: "09:15", who: "Planning — A. Nair", act: "Delivery date revised to 08-09", note: "Motor shortage. Two weeks lost waiting on Crompton.", next: "Purchase to confirm supplier date", kind: "bad" },
      { when: "25-08-26", time: "17:00", who: "System", act: "Motor became overdue", note: "Expected date passed with no receipt. Shortage raised automatically.", next: "Purchase owns the chase", kind: "bad" },
      { when: "28-07-26", time: "14:30", who: "Production — D. Shirke", act: "Casing complete", note: "All four sub-assemblies now ready.", next: "Assembly, once the motor lands", kind: "mark" },
      { when: "05-06-26", time: "11:00", who: "Design — V. Rane", act: "GA approval received", note: "Customer approved the general arrangement.", next: "Planning to confirm the plan", kind: "" },
      { when: "22-05-26", time: "10:20", who: "Projects — R. Mehta", act: "OA released", note: "PO cleared 20-05, OA released two days later.", next: "Design to release the drawing", kind: "mark" },
    ],
  },
  {
    oa: "18616", epicor: "018616-1-1", sap: "SO-39804", custPo: "2700015204",
    customer: "Chemplast Sanmar Ltd", model: "HP-900-WP", qty: 1, amount: "7,32,734",
    insp: "Client", agent: "Rajesh C", cls: "Catalogue",
    code: "C", drive: "Coupled", legacy: "TE", lifecycle: "active", openedDays: 100,
    payTerms: "50% advance, balance before despatch", payState: "advance-only",
    mfgMonth: "Sep-26", revenueMonth: "Sep-26", drgRecd: "20-05-2026", drgRevised: "—",
    poDate: "30-04-2026", poCleared: "10-05-2026", oaReleased: "20-05-2026", gaApproval: "25-05-2026",
    need: "24-08-2026", promise: "26-08-2026", revised: "07-09-2026",
    planMonth: "Sep-26", planWeek: "Back log", weight: "2,150",
    checkpoint: "Assembled & tested", state: "at-risk", stateNote: "Repeat leak — rework",
    owner: "Quality — S. Deshpande", pct: 70,
    current: "Rework after a repeat leak",
    currentSub: "Leak returned after reassembly on 28-08. Third failure on the same unit.",
    next: "Root-cause the seal failure before another rebuild", nextOwner: "Quality", nextDue: "Overdue",
    subitems: [
      { n: "Hub", s: "Ready", d: "18-08-2026" },
      { n: "Shaft", s: "Ready", d: "20-08-2026" },
      { n: "Impeller", s: "Ready", d: "22-08-2026" },
      { n: "Casing", s: "Rework", d: "—" },
    ],
    supply: [
      { item: "Mechanical seal (replacement)", scope: "Nadi (NM)", supplier: "Eagle Burgmann", expected: "24-08-2026", received: "22-08-2026", age: 0 },
    ],
    gate: [
      { t: "Quality released", s: "fail", n: "Leak test not passed" },
      { t: "Customer inspection", s: "fail", n: "Required — leak was found at the last call" },
      { t: "Crate ready", s: "na", n: "Raise after quality release" },
      { t: "Documents complete", s: "pass", n: "Complete" },
      { t: "As-built BOM frozen", s: "fail", n: "Seal part number changed, needs re-freeze" },
    ],
    exceptions: [
      { t: "Repeat leak failure", sub: "Third leak on the same unit, detected after reassembly on 28-08-2026.", owner: "Quality", due: "Overdue", level: "risk" },
      { t: "Repeat rework — slipping", sub: "Promised 26-08, now committed 07-09. Third rework — needs a decision, not another rebuild.", owner: "Projects", due: "This week", level: "warn" },
    ],
    catch: {
      promised: "1 × HP-900-WP to Chemplast Sanmar. Promised 26-08, now committed 07-09.",
      done: "Built and tested 20-08. A leak was found at the customer inspection and a new seal fitted.",
      blocking: "The leak came back after reassembly on 28-08-2026. Third failure on the same joint.",
      next: "Quality root-causes the seal. Projects needs a decision before another rebuild.",
    },
    timeline: [
      { when: "28-08-26", time: "16:40", who: "Quality — S. Deshpande", act: "Leak detected again after reassembly", note: "Third failure, same joint. Replacing the seal has not solved it.", next: "Root cause before another rebuild", kind: "bad" },
      { when: "22-08-26", time: "10:00", who: "Stores — M. Pawar", act: "Replacement seal received", note: "Eagle Burgmann seal in stores.", next: "Production to reassemble", kind: "" },
      { when: "20-08-26", time: "15:20", who: "Quality — S. Deshpande", act: "Leak found at customer inspection", note: "Testing completed the same day. Leak highlighted by the customer's inspector.", next: "Order a replacement seal", kind: "bad" },
      { when: "20-05-26", time: "09:00", who: "Design — V. Rane", act: "Manufacturing drawing released", note: "", next: "Planning to load", kind: "mark" },
    ],
  },
  {
    oa: "20422", epicor: "020422-2-1", sap: "SO-40188", custPo: "2100021775",
    customer: "Ganesh Consumer Products", model: "LVSC-900", qty: 1, amount: "94,113",
    insp: "Self", agent: "Subhamoy Sarkar", cls: "Catalogue",
    code: "C", drive: "Direct", legacy: "FCP/CM", lifecycle: "active", openedDays: 117,
    payTerms: "50% advance, balance before despatch", payState: "advance-only",
    mfgMonth: "Sep-26", revenueMonth: "Sep-26", drgRecd: "05-06-2026", drgRevised: "—",
    poDate: "14-05-2026", poCleared: "27-05-2026", oaReleased: "27-05-2026", gaApproval: "05-06-2026",
    need: "20-08-2026", promise: "26-08-2026", revised: "08-09-2026",
    planMonth: "Sep-26", planWeek: "Back log", weight: "680",
    checkpoint: "Material ready", state: "blocked", stateNote: "Blocked — customer motor",
    owner: "Projects — R. Mehta", pct: 55,
    current: "Waiting for the customer's motor",
    currentSub: "Casing and impeller finished under FCP-24.08. The motor is in the customer's scope.",
    next: "Get a despatch date from the customer", nextOwner: "Projects", nextDue: "Overdue by 13 days",
    subitems: [
      { n: "Hub", s: "Ready", d: "18-08-2026" },
      { n: "Shaft", s: "Ready", d: "20-08-2026" },
      { n: "Impeller", s: "Ready", d: "24-08-2026" },
      { n: "Casing", s: "Ready", d: "24-08-2026" },
    ],
    supply: [
      { item: "Motor 7.5 kW", scope: "Customer (CM)", supplier: "Customer scope", expected: "26-08-2026", received: null, age: 13 },
    ],
    gate: [
      { t: "Quality released", s: "fail", n: "Not assembled" },
      { t: "Customer inspection", s: "na", n: "Not required — inspection is Self" },
      { t: "Crate ready", s: "na", n: "Raise after quality release" },
      { t: "Documents complete", s: "pass", n: "Complete" },
      { t: "As-built BOM frozen", s: "fail", n: "Freezes at assembly completion" },
    ],
    exceptions: [
      { t: "Customer-scope motor not received", sub: "13 days past the promise date. The delay sits with the customer and the record should show that.", owner: "Projects", due: "Overdue", level: "risk" },
    ],
    catch: {
      promised: "1 × LVSC-900 to Ganesh Consumer Products. Promised 26-08, now committed 08-09.",
      done: "Everything in Nadi's scope is finished — casing and impeller completed 24-08.",
      blocking: "The motor is in the customer's scope and has not arrived. 13 days and counting.",
      next: "Projects gets a despatch date. The delay is the customer's and the record says so.",
    },
    timeline: [
      { when: "26-08-26", time: "18:00", who: "System", act: "Customer motor became overdue", note: "Promise date reached with no motor. Ageing from here.", next: "Projects to raise with the customer", kind: "bad" },
      { when: "24-08-26", time: "13:10", who: "Production — D. Shirke", act: "Casing and impeller complete", note: "Finished under FCP-24.08. All Nadi-scope work done.", next: "Hold for the customer's motor", kind: "mark" },
      { when: "27-05-26", time: "09:40", who: "Projects — R. Mehta", act: "OA released", note: "PO cleared and OA released the same day.", next: "Design to release the drawing", kind: "mark" },
    ],
  },
  {
    oa: "19415", epicor: "019415-2-1", sap: "SO-39912", custPo: "3693505",
    customer: "Systemair for Electrical Equipment Co", model: "Silencer", qty: 8, amount: "16,75,262",
    insp: "Self", agent: "Systemair", cls: "Catalogue",
    code: "S", drive: "—", legacy: "PD", lifecycle: "active", openedDays: 110,
    payTerms: "Advance received in full (export)", payState: "received",
    mfgMonth: "Aug-26", revenueMonth: "Aug-26", drgRecd: "22-05-2026", drgRevised: "—",
    poDate: "01-05-2026", poCleared: "08-05-2026", oaReleased: "22-05-2026", gaApproval: "—",
    need: "20-08-2026", promise: "26-08-2026", revised: "26-08-2026",
    planMonth: "Aug-26", planWeek: "Wk-1", weight: "3,400",
    checkpoint: "Quality released", state: "warn", stateNote: "Billed, not moved",
    owner: "Dispatch — K. Salvi", pct: 90,
    current: "Invoiced but still in the yard",
    currentSub: "8 units billed in late August. Crate clearance was never raised.",
    next: "Raise crate clearance and book transport", nextOwner: "Dispatch", nextDue: "Overdue",
    subitems: [],
    supply: [],
    gate: [
      { t: "Quality released", s: "pass", n: "Released 24-08-2026" },
      { t: "Customer inspection", s: "na", n: "Not required — inspection is Self" },
      { t: "Crate ready", s: "fail", n: "Wooden crate not raised. The only thing holding 8 units." },
      { t: "Documents complete", s: "pass", n: "Invoice raised August 2026" },
      { t: "As-built BOM frozen", s: "pass", n: "Frozen 24-08-2026" },
    ],
    exceptions: [
      { t: "Billed but not moved", sub: "8 units invoiced at ₹16,75,262, sitting undispatched. Crate is the only open item.", owner: "Dispatch", due: "Overdue", level: "warn" },
      { t: "Slow to release", sub: "PO cleared 08-05, OA released 22-05. 14 days before work could start.", owner: "Projects", due: "Review", level: "warn" },
    ],
    catch: {
      promised: "8 silencers to Systemair. Promised 26-08 and invoiced in late August.",
      done: "Built, quality released 24-08, as-built BOM frozen, invoice raised.",
      blocking: "Nobody raised the wooden crate. Eight finished units, ₹16.75 lakh, sitting in the yard.",
      next: "Dispatch raises crate clearance and books transport. Half a day of work.",
    },
    timeline: [
      { when: "24-08-26", time: "16:00", who: "Quality — S. Deshpande", act: "Released for dispatch", note: "All 8 units passed. As-built BOM frozen.", next: "Dispatch to pack", kind: "mark" },
      { when: "22-05-26", time: "10:00", who: "Projects — R. Mehta", act: "OA released", note: "PO had been cleared on 08-05. 14 days between clearing and release.", next: "Planning to load", kind: "bad" },
    ],
  },
  {
    oa: "20736", epicor: "020736-1-1", sap: "SO-40245", custPo: "CTSPL/2026/118",
    customer: "Crescent Techno Solutions Pvt Ltd", model: "RBI490-619", qty: 1, amount: "1,10,400",
    insp: "Self", agent: "Banumathy K", cls: "Catalogue",
    code: "C", drive: "Direct", legacy: "RE", lifecycle: "active", openedDays: 62,
    payTerms: "100% advance with PO", payState: "received",
    mfgMonth: "Sep-26", revenueMonth: "Sep-26", drgRecd: "30-07-2026", drgRevised: "—",
    poDate: "08-07-2026", poCleared: "25-07-2026", oaReleased: "30-07-2026", gaApproval: "—",
    need: "20-08-2026", promise: "28-08-2026", revised: "28-08-2026",
    planMonth: "Sep-26", planWeek: "Wk-2", weight: "410",
    checkpoint: "Quality released", state: "on-track", stateNote: "Ready to leave",
    owner: "Dispatch — K. Salvi", pct: 95,
    current: "Packed and ready",
    currentSub: "Manufacturing drawing received 30-07. Packed and ready since 02-09.",
    next: "Book transport", nextOwner: "Dispatch", nextDue: "Today",
    subitems: [
      { n: "Hub", s: "Ready", d: "10-08-2026" },
      { n: "Shaft", s: "Ready", d: "12-08-2026" },
      { n: "Impeller", s: "Ready", d: "18-08-2026" },
      { n: "Casing", s: "Ready", d: "20-08-2026" },
    ],
    supply: [
      { item: "Motor 3 kW", scope: "Not applicable (NA)", supplier: "—", expected: "—", received: "—", age: 0 },
    ],
    gate: [
      { t: "Quality released", s: "pass", n: "Released 01-09-2026" },
      { t: "Customer inspection", s: "na", n: "Not required — inspection is Self" },
      { t: "Crate ready", s: "pass", n: "Packed 02-09-2026" },
      { t: "Documents complete", s: "pass", n: "Complete" },
      { t: "As-built BOM frozen", s: "pass", n: "Frozen 01-09-2026" },
    ],
    exceptions: [],
    catch: {
      promised: "1 × RBI490-619 to Crescent Techno Solutions by 28-08.",
      done: "Everything. Built, released, packed and ready since 02-09.",
      blocking: "Nothing. All five dispatch conditions are met.",
      next: "Dispatch books transport. This one can leave today.",
    },
    timeline: [
      { when: "02-09-26", time: "11:30", who: "Dispatch — K. Salvi", act: "Packed and ready", note: "Crate complete, documents attached.", next: "Book transport", kind: "mark" },
      { when: "30-07-26", time: "09:00", who: "Design — V. Rane", act: "Manufacturing drawing received", note: "", next: "Planning to load", kind: "" },
    ],
  },
  {
    oa: "20790", epicor: "020790-1-1", sap: "SO-40260", custPo: "CE/2026/0114",
    customer: "Core Energy Systems", model: "WP-1600 engineered fan", qty: 1, amount: "48,20,000",
    insp: "Client", agent: "Rajesh C", cls: "Project",
    code: "A", drive: "Belt", legacy: "FAB", lifecycle: "active", openedDays: 90,
    payTerms: "40% advance, 50% against proforma, 10% before despatch", payState: "advance-only",
    mfgMonth: "Nov-26", revenueMonth: "Nov-26", drgRecd: "12-06-2026", drgRevised: "—",
    poDate: "02-06-2026", poCleared: "10-06-2026", oaReleased: "12-06-2026", gaApproval: "01-07-2026",
    need: "20-11-2026", promise: "30-11-2026", revised: "30-11-2026",
    planMonth: "Nov-26", planWeek: "Wk-3", weight: "6,900",
    checkpoint: "Parts made", state: "watch", stateNote: "Hold point due",
    owner: "Quality — S. Deshpande", pct: 45,
    current: "Casing rolled, awaiting radiography",
    currentSub: "Long-seam welding finished 05-09. Radiography is a contractual hold point.",
    next: "Radiography with the customer's inspector", nextOwner: "Quality", nextDue: "12-09-2026",
    subitems: [],
    supply: [
      { item: "Plate IS 2062 Gr.B", scope: "Nadi (NM)", supplier: "JSW Steel", expected: "15-07-2026", received: "14-07-2026", age: 0 },
      { item: "Motor 160 kW", scope: "Nadi (NM)", supplier: "ABB", expected: "10-10-2026", received: null, age: 0 },
    ],
    operations: [
      { n: "Material procurement", start: "15-07", end: "15-07", s: "Complete", hold: false },
      { n: "Raw material stamping for test piece", start: "17-07", end: "17-07", s: "Passed", hold: true },
      { n: "Chemical & mechanical testing", start: "17-07", end: "20-07", s: "Passed", hold: true },
      { n: "Raw material stamping transfer", start: "22-07", end: "22-07", s: "Complete", hold: false },
      { n: "Material cutting", start: "22-07", end: "23-07", s: "Complete", hold: false },
      { n: "Flange machining", start: "23-07", end: "26-07", s: "Complete", hold: false },
      { n: "Casing rolling & long-seam welding", start: "23-08", end: "05-09", s: "Complete", hold: false },
      { n: "Radiography test", start: "12-09", end: "13-09", s: "Waiting", hold: true },
      { n: "Flange dimension check", start: "14-09", end: "14-09", s: "Not started", hold: true },
      { n: "Casing fitup & welding", start: "16-09", end: "20-09", s: "Not started", hold: false },
      { n: "Dye penetrant test", start: "22-09", end: "23-09", s: "Not started", hold: true },
    ],
    gate: [
      { t: "Quality released", s: "fail", n: "4 hold points still open" },
      { t: "Customer inspection", s: "fail", n: "Required throughout — inspection is Client" },
      { t: "Crate ready", s: "na", n: "Raise after quality release" },
      { t: "Documents complete", s: "fail", n: "QAP records incomplete" },
      { t: "As-built BOM frozen", s: "fail", n: "Freezes at assembly completion" },
    ],
    exceptions: [],
    catch: {
      promised: "1 × WP-1600 engineered fan to Core Energy by 30-11. Customer inspection throughout.",
      done: "Material tested and cleared, flanges machined, casing rolled and long-seam welded by 05-09.",
      blocking: "Nothing yet. The next operation is a radiography hold point needing the customer's inspector on site.",
      next: "Quality schedules radiography for 12-09. Fit-up cannot start until it passes.",
    },
    timeline: [
      { when: "05-09-26", time: "17:00", who: "Production — D. Shirke", act: "Long-seam welding complete", note: "Casing rolled and welded, ready for radiography.", next: "Quality to schedule the hold point", kind: "mark" },
      { when: "20-07-26", time: "14:00", who: "Quality — S. Deshpande", act: "Chemical & mechanical test passed", note: "Hold point cleared with the customer's inspector present.", next: "Release material for cutting", kind: "mark" },
      { when: "12-06-26", time: "10:00", who: "Projects — R. Mehta", act: "OA released", note: "Engineered order. Operation schedule built with QAP hold points.", next: "Design to release drawings", kind: "mark" },
    ],
  },
  {
    oa: "20262", epicor: "020262-5-1", sap: "SO-40118", custPo: "PME/2026-27",
    customer: "Powermech Engineering", model: "Service charges of fan", qty: 1, amount: "20,000",
    insp: "Self", agent: "Rajesh C", cls: "Catalogue",
    code: "SERVICE", drive: "—", legacy: "RE", lifecycle: "active", openedDays: 106,
    payTerms: "100% against invoice", payState: "advance-only",
    mfgMonth: "Sep-26", revenueMonth: "Oct-26", drgRecd: "30-06-2026", drgRevised: "—",
    need: "25-05-2026", promise: "05-06-2026", revised: "05-06-2026",
    planMonth: "Oct-26", planWeek: "Back log", weight: "0",
    checkpoint: "Quality released", state: "warn", stateNote: "Service, not built",
    owner: "Projects — R. Mehta", pct: 80,
    current: "Service order — no manufacturing",
    currentSub: "Repair/service charge line. Rides the spine but skips the build checkpoints.",
    next: "Raise invoice and close", nextOwner: "Projects", nextDue: "This week",
    subitems: [], supply: [],
    gate: [
      { t: "Quality released", s: "na", n: "Service order — nothing to inspect" },
      { t: "Customer inspection", s: "na", n: "Not required" },
      { t: "Crate ready", s: "na", n: "Nothing to crate" },
      { t: "Documents complete", s: "pass", n: "Service report ready" },
      { t: "As-built BOM frozen", s: "na", n: "No BOM on a service line" },
    ],
    exceptions: [],
    catch: {
      promised: "Service charge line to Powermech Engineering, ₹20,000.",
      done: "Service performed. Report attached.",
      blocking: "Nothing. This is a commercial/service line, not a manufactured fan.",
      next: "Projects raises the invoice and closes the line.",
    },
    timeline: [
      { when: "05-06-26", time: "12:00", who: "Service — R. Mehta", act: "Service completed", note: "On-site service charge. No manufacturing.", next: "Raise invoice", kind: "mark" },
    ],
  },
  {
    oa: "19449", epicor: "019449-1-1", sap: "SO-39770", custPo: "MAK/2026/077",
    customer: "M/s MAK Clean", model: "Oil level indicator (2 nos), bearing block", qty: 2, amount: "—",
    insp: "Self", agent: "Raja A", cls: "Catalogue",
    code: "SERVICE", drive: "—", legacy: "SHORT", lifecycle: "active", openedDays: 110,
    payTerms: "100% advance with PO", payState: "received",
    mfgMonth: "Sep-26", revenueMonth: "Aug-26", drgRecd: "—", drgRevised: "—",
    need: "—", promise: "—", revised: "—",
    planMonth: "Aug-26", planWeek: "Short supply", weight: "0",
    checkpoint: "Material ready", state: "blocked", stateNote: "Short supply — bought-out",
    owner: "Purchase — S. Kulkarni", pct: 30,
    current: "Waiting on a bought-out spare",
    currentSub: "Spare-part supply order (Dodge-make bearings). Nothing to manufacture — purely a bought-out item.",
    next: "Receive the bought-out item, then pack", nextOwner: "Purchase", nextDue: "Overdue",
    subitems: [],
    supply: [
      { item: "Oil level indicator (Dodge)", scope: "Nadi (NM)", supplier: "Dodge / local", expected: "26-08-2026", received: null, age: 13 },
    ],
    gate: [
      { t: "Quality released", s: "na", n: "Bought-out spare, no build" },
      { t: "Customer inspection", s: "na", n: "Not required" },
      { t: "Crate ready", s: "fail", n: "Pack after receipt" },
      { t: "Documents complete", s: "pass", n: "PO on file" },
      { t: "As-built BOM frozen", s: "na", n: "No BOM on a spare line" },
    ],
    exceptions: [
      { t: "Bought-out spare not received", sub: "Dodge-make items on order and overdue. Spare-part line, easy to lose on the sheet.", owner: "Purchase", due: "Overdue", level: "warn" },
    ],
    catch: {
      promised: "2 × oil level indicator + bearing block to M/s MAK Clean.",
      done: "PO placed on the supplier.",
      blocking: "The bought-out spares have not arrived.",
      next: "Purchase receives the items, then Dispatch packs and ships.",
    },
    timeline: [
      { when: "26-08-26", time: "10:00", who: "Purchase — S. Kulkarni", act: "Bought-out became overdue", note: "Spare-part supply line. Ageing on the shortage list.", next: "Chase supplier", kind: "bad" },
    ],
  },
  {
    oa: "15288", epicor: "015288-1-1", sap: "SO-33110", custPo: "ALS/2026/E-BLOCK",
    customer: "Ballestra Engineering & Projects", model: "NAF/1120-35012 (E-Block)", qty: 7, amount: "19,95,000",
    insp: "Client", agent: "Satheesh Kumar R", cls: "Project",
    code: "A", drive: "Belt", legacy: "MFG-BL", lifecycle: "dead", openedDays: 130,
    payTerms: "20% adv, 70% against readiness, 10% within 30 days", payState: "advance-only",
    mfgMonth: "Hold", revenueMonth: "Hold", drgRecd: "05-05-2026", drgRevised: "—",
    need: "22-08-2026", promise: "20-08-2026", revised: "02-09-2026",
    planMonth: "Hold", planWeek: "Dead", weight: "0",
    checkpoint: "Parts made", state: "at-risk", stateNote: "Stalled — no movement",
    owner: "Projects — R. Mehta", pct: 50,
    current: "Stalled order — no movement in weeks",
    currentSub: "6 of 7 motors received 15-06, then stalled. Sitting on HOLD in every plan column since — needs a decision.",
    next: "Commercial decision — close, cancel or revive", nextOwner: "Management", nextDue: "Escalated",
    subitems: [], supply: [],
    gate: [
      { t: "Quality released", s: "fail", n: "Never completed" },
      { t: "Customer inspection", s: "fail", n: "Client inspection, never held" },
      { t: "Crate ready", s: "na", n: "—" },
      { t: "Documents complete", s: "fail", n: "Stale" },
      { t: "As-built BOM frozen", s: "fail", n: "—" },
    ],
    exceptions: [
      { t: "Stalled order — needs a decision", sub: "Promised 20-08, no movement since. Sitting on HOLD in every plan column — needs a call, not another status update.", owner: "Management", due: "Escalated", level: "risk" },
    ],
    catch: {
      promised: "7 × NAF/1120 to Ballestra (E-Block). Promised 20-08-2026.",
      done: "6 of 7 motors received 15-06. Then the order stalled.",
      blocking: "No movement in weeks. The order still consumes a row and a status every review.",
      next: "Management decides: close, cancel, or formally revive with a fresh date.",
    },
    timeline: [
      { when: "15-06-26", time: "10:00", who: "Stores", act: "6 of 7 motors received", note: "Order stalled shortly after. No movement since.", next: "Awaiting a commercial decision", kind: "bad" },
    ],
  },
  {
    oa: "18902", epicor: "018902-1-1", sap: "SO-38540", custPo: "GEM/2026/C-441",
    customer: "Gemini Cooling Systems", model: "Motor pulley (replace on site)", qty: 2, amount: "—",
    insp: "Self", agent: "Raja A", cls: "Catalogue",
    code: "SERVICE", drive: "—", legacy: "SHORT", lifecycle: "cancelled", openedDays: 120,
    payTerms: "100% advance with PO", payState: "na",
    mfgMonth: "—", revenueMonth: "—", drgRecd: "—", drgRevised: "—",
    need: "—", promise: "—", revised: "—",
    planMonth: "—", planWeek: "Cancelled", weight: "0",
    checkpoint: "Order accepted", state: "warn", stateNote: "Cancelled by customer",
    owner: "Projects — R. Mehta", pct: 0,
    current: "Cancelled",
    currentSub: "Customer cancelled the replacement-pulley order. Kept for audit, out of the live plan.",
    next: "Confirm cancellation credit and close", nextOwner: "Projects", nextDue: "—",
    subitems: [], supply: [],
    gate: [
      { t: "Quality released", s: "na", n: "Cancelled" },
      { t: "Customer inspection", s: "na", n: "Cancelled" },
      { t: "Crate ready", s: "na", n: "Cancelled" },
      { t: "Documents complete", s: "na", n: "Cancelled" },
      { t: "As-built BOM frozen", s: "na", n: "Cancelled" },
    ],
    exceptions: [],
    catch: {
      promised: "2 × motor pulley to Gemini Cooling.",
      done: "Order accepted, then cancelled by the customer.",
      blocking: "Nothing — cancelled. Retained for audit only.",
      next: "Projects confirms any cancellation credit and closes the record.",
    },
    timeline: [
      { when: "02-08-26", time: "15:00", who: "Projects — R. Mehta", act: "Order cancelled by customer", note: "Retained for audit. Removed from the live plan.", next: "Confirm credit and close", kind: "bad" },
    ],
  },
];

const JOBS = [
  { job: "JOB-4423", oa: "20790", op: "Flange machining", section: "Machine Shop", qty: 4, done: 2, state: "In progress", by: "P. Jadhav", since: "08:15" },
  { job: "JOB-4420", oa: "20790", op: "Casing fitup & welding", section: "Fabrication", qty: 1, done: 0, state: "Ready", by: "—", since: "—" },
  { job: "JOB-4412", oa: "19962", op: "Final assembly", section: "Assembly", qty: 1, done: 0, state: "Blocked", by: "—", since: "25-08" },
  { job: "JOB-4415", oa: "18616", op: "Seal reassembly", section: "Assembly", qty: 1, done: 0, state: "Rework", by: "—", since: "28-08" },
  { job: "JOB-4421", oa: "20736", op: "Final packing", section: "Packing", qty: 1, done: 1, state: "Complete", by: "N. Gawde", since: "—" },
];

const ROLES = {
  sales:      { label: "Sales", person: "N. Iyer", nav: ["today", "orders", "reports"] },
  projects:   { label: "Projects", person: "R. Mehta", nav: ["today", "orders", "planning", "revenue", "reports"] },
  planning:   { label: "Planning", person: "A. Nair", nav: ["today", "orders", "planning", "supply", "revenue", "reports"] },
  design:     { label: "Design", person: "V. Rane", nav: ["today", "orders"] },
  purchase:   { label: "Purchase & Stores", person: "S. Kulkarni", nav: ["today", "orders", "supply"] },
  stores:     { label: "Stores", person: "M. Pawar", nav: ["today", "orders", "supply"] },
  supervisor: { label: "Production supervisor", person: "D. Shirke", nav: ["today", "orders", "production"] },
  operator:   { label: "Operator", person: "P. Jadhav", nav: ["myjobs"] },
  quality:    { label: "Quality", person: "S. Deshpande", nav: ["today", "orders", "quality"] },
  dispatch:   { label: "Dispatch", person: "K. Salvi", nav: ["today", "orders", "dispatch"] },
  management: { label: "Management", person: "P. Joshi", nav: ["today", "orders", "revenue", "reports"] },
};

const NAV = {
  today: "Today", orders: "Orders", planning: "Planning", supply: "Supply & shortages",
  production: "Production", quality: "Quality", dispatch: "Dispatch", revenue: "Revenue plan",
  reports: "Reports", myjobs: "My jobs",
};

const ATTENTION = [
  { id: 1, roles: ["purchase", "planning", "management"], level: "risk", oa: "19962", title: "Motor 14 days overdue", sub: "15 kW from Crompton. All four sub-assemblies are ready and waiting on it.", due: "Overdue", action: "Chase supplier" },
  { id: 2, roles: ["projects", "planning", "management"], level: "risk", oa: "20422", title: "Customer motor 13 days overdue", sub: "Motor is in the customer's scope. Nadi's work has been finished since 24-08.", due: "Overdue", action: "Raise with customer" },
  { id: 3, roles: ["quality", "supervisor", "management"], level: "risk", oa: "18616", title: "Third leak on the same unit", sub: "Leak returned after reassembly. Replacing the seal has not fixed it.", due: "Overdue", action: "Root cause" },
  { id: 4, roles: ["dispatch", "management"], level: "warn", oa: "19415", title: "8 units billed but not moved", sub: "₹16,75,262 invoiced in August. Only the crate is missing.", due: "Overdue", action: "Raise crate" },
  { id: 5, roles: ["quality"], level: "warn", oa: "20790", title: "Radiography hold point due 12-09", sub: "Customer inspector needs to be on site. Fit-up cannot start until it passes.", due: "Due 12-09", action: "Schedule" },
  { id: 6, roles: ["dispatch"], level: "info", oa: "20736", title: "Ready to leave today", sub: "All five dispatch conditions met. Packed since 02-09.", due: "Due today", action: "Book transport" },
  { id: 7, roles: ["projects", "management"], level: "warn", oa: "18616", title: "Repeat leak — needs a decision", sub: "Third leak after reassembly. A call is needed, not another rebuild.", due: "This week", action: "Review" },
  { id: 8, roles: ["supervisor"], level: "warn", oa: "19962", title: "Assembly bay held since 25-08", sub: "JOB-4412 cannot start without the motor. Bay 2 idle.", due: "14 days", action: "Reassign bay" },
];

const WEEK_COLS = ["Wk-1", "Wk-2", "Wk-3", "Wk-4", "Back log"];

/* ------------------------------------------------------------
   v3 — per-order discussion: each stakeholder holds a position
   (Yes / No / Thinking) and a threaded comment. Seeded, then
   extended live from the "Viewing as" role. Contained to the order.
   ------------------------------------------------------------ */
const DISCUSSIONS = {
  "19962": {
    stances: { purchase: "thinking", planning: "no", supervisor: "no", projects: "thinking" },
    comments: [
      { id: "d1", role: "planning", stance: "no", text: "Won't commit a firm date until Purchase confirms the motor. The four sub-assemblies are ready — this is a supplier problem, not a plan problem.", when: "08-09 · 09:20" },
      { id: "d2", role: "purchase", stance: "thinking", text: "Crompton now say 08-09. Chasing a written confirmation before I stand behind it.", when: "07-09 · 16:05" },
      { id: "d3", role: "supervisor", stance: "no", text: "Assembly bay 2 has been idle since 25-08 waiting on this. Can't hold it much longer.", when: "06-09 · 11:40" },
    ],
  },
  "18616": {
    stances: { quality: "no", projects: "thinking", planning: "thinking" },
    comments: [
      { id: "d1", role: "quality", stance: "no", text: "Third leak on the same joint. Replacing the seal has not fixed it — I won't release another rebuild until we root-cause the failure.", when: "28-08 · 16:45" },
      { id: "d2", role: "projects", stance: "thinking", text: "This order has slipped through three rebuilds now. We may need a commercial decision with the customer rather than a fourth rebuild.", when: "28-08 · 17:30" },
      { id: "d3", role: "planning", stance: "thinking", text: "Agree — holding the slot but not re-loading production until Quality closes the root cause.", when: "29-08 · 09:15" },
    ],
  },
  "20422": {
    stances: { projects: "no", planning: "thinking" },
    comments: [
      { id: "d1", role: "projects", stance: "no", text: "The motor is in the customer's scope and 13 days overdue. The revised date must record the delay as theirs, not ours.", when: "26-08 · 18:10" },
      { id: "d2", role: "planning", stance: "thinking", text: "Nadi-scope work finished 24-08. Ready to close the moment their motor lands.", when: "27-08 · 10:00" },
    ],
  },
  "19415": {
    stances: { dispatch: "yes", management: "thinking" },
    comments: [
      { id: "d1", role: "dispatch", stance: "yes", text: "Only the wooden crate is open. Raise clearance and I can book transport for all 8 units today.", when: "05-09 · 14:20" },
      { id: "d2", role: "management", stance: "thinking", text: "₹16.75 L billed and sitting in the yard since late August. Why did crate clearance never get raised?", when: "05-09 · 15:00" },
    ],
  },
  "20736": {
    stances: { dispatch: "yes", quality: "yes" },
    comments: [
      { id: "d1", role: "quality", stance: "yes", text: "Released 01-09. As-built BOM frozen. No open points from my side.", when: "01-09 · 12:00" },
      { id: "d2", role: "dispatch", stance: "yes", text: "Packed since 02-09. All five conditions met — this one can leave today.", when: "02-09 · 11:35" },
    ],
  },
  "20790": {
    stances: { quality: "thinking", projects: "yes" },
    comments: [
      { id: "d1", role: "quality", stance: "thinking", text: "Radiography on 12-09 is a contractual hold point — need the customer's inspector on site. Fit-up cannot start until it passes.", when: "05-09 · 17:10" },
      { id: "d2", role: "projects", stance: "yes", text: "Customer inspector confirmed for 12-09. On track for the 30-11 promise.", when: "06-09 · 09:30" },
    ],
  },
  "15288": {
    stances: { management: "no", projects: "thinking" },
    comments: [
      { id: "d1", role: "management", stance: "no", text: "Stalled for weeks with no movement. Stop carrying it as live — either cancel it or revive it with a real date and a fresh commercial position.", when: "01-09 · 10:00" },
      { id: "d2", role: "projects", stance: "thinking", text: "Checking whether the customer still wants the 7 units or if we scrap the WIP against the advance.", when: "02-09 · 14:15" },
    ],
  },
};

/* ------------------------------------------------------------
   v3 — management revenue plan (from the Pending Order Summery
   tab). Amounts in ₹ lakhs. Fixes: monthly target vs invoiced
   vs shortfall, order-in-hand, inventory — none of which the
   operational views carry. Domestic, YEAR 2026-27.
   ------------------------------------------------------------ */
const REVENUE = {
  reportDate: "05-09-2026",
  orderInHand: 3466,           // ₹ lakhs, ~₹34.66 cr in hand
  billedNotMoved: 1675000,     // ₹ (one order, 8 units)
  months: [
    { m: "May-26", target: 583, invoiced: 618, actual: true },
    { m: "Jun-26", target: 583, invoiced: 438, actual: true },
    { m: "Jul-26", target: 642, invoiced: 534, actual: true },
    { m: "Aug-26", target: 700, invoiced: 631, actual: true },
    { m: "Sep-26", target: 817, invoiced: 172, actual: false }, // month in progress
    { m: "Oct-26", target: 875, invoiced: 0, actual: false },
    { m: "Nov-26", target: 817, invoiced: 0, actual: false },
    { m: "Dec-26", target: 875, invoiced: 0, actual: false },
  ],
  inventory: [
    { k: "Finished goods (FG)", v: "₹1.30 cr" },
    { k: "Semi-finished (SFG)", v: "₹6.21 cr" },
    { k: "Work in progress (WIP)", v: "₹1.58 cr" },
  ],
  entities: [
    { k: "Domestic", v: "₹12.44 cr" },
    { k: "Systemair (export)", v: "₹34.15 cr" },
    { k: "Alstom", v: "₹3.37 cr" },
    { k: "US LLC / other", v: "₹0.68 cr" },
  ],
};

/* ------------------------------------------------------------
   Shared bits
   ------------------------------------------------------------ */
const STATE_MAP = {
  "at-risk": { cls: "risk", glyph: "▲", label: "At risk" },
  blocked:   { cls: "risk", glyph: "■", label: "Blocked" },
  warn:      { cls: "warn", glyph: "◆", label: "Attention" },
  watch:     { cls: "warn", glyph: "◆", label: "Watch" },
  "on-track":{ cls: "ok",   glyph: "●", label: "On track" },
};

function State({ level, text }) {
  const m = STATE_MAP[level] || STATE_MAP["on-track"];
  return <span className={`pill ${m.cls}`}><span className="glyph" aria-hidden="true">{m.glyph}</span>{text || m.label}</span>;
}

function Spine({ current, blocked }) {
  const idx = SPINE.indexOf(current);
  return (
    <div className="stages">
      {SPINE.map((s, i) => {
        const cls = i < idx ? "done" : i === idx ? (blocked ? "now stop" : "now") : "";
        return (
          <div key={s} className={`stage ${cls}`}>
            <span className="knob">{i < idx ? "✓" : ""}</span>
            <div className="nm">{s}</div>
          </div>
        );
      })}
    </div>
  );
}

function Fact({ k, v, mono }) {
  return <div><div className="fact-k">{k}</div><div className={`fact-v ${mono ? "mono" : ""}`}>{v}</div></div>;
}

function GateBody({ order }) {
  const payRow = order.payState === "received"
    ? { t: "Payment cleared", s: "pass", n: order.payTerms }
    : order.payState === "na"
      ? { t: "Payment cleared", s: "na", n: order.payTerms }
      : { t: "Payment cleared", s: "fail", n: `${order.payTerms} — balance not yet received` };
  const gate = [...order.gate, payRow];
  const open = gate.filter((g) => g.s === "fail");
  return (
    <>
      <div className="gate">
        {gate.map((g) => (
          <div className="gate-row" key={g.t}>
            <span className={`gate-mark ${g.s}`}>{g.s === "pass" ? "✓" : g.s === "fail" ? "✕" : "–"}</span>
            <div className="gate-t">
              <div style={{ fontWeight: 500 }}>{g.t}</div>
              <div className="gate-s">{g.n}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="gate-verdict">
        <div>
          {open.length === 0
            ? <b style={{ color: "var(--ok)" }}>Cleared to dispatch</b>
            : <><b>Not dispatchable</b><span className="muted tiny"> — waiting on {open.map((g) => g.t.toLowerCase()).join(", ")}</span></>}
        </div>
        <button className="btn" disabled={open.length > 0}>Dispatch</button>
      </div>
    </>
  );
}

/* ---- v3 shared bits: stakeholder positions + comments ---- */
function initials(name) {
  return (name || "?").split(" ").map((p) => p[0]).join("").slice(0, 2);
}

function StancePill({ s }) {
  const m = STANCE_MAP[s] || STANCE_MAP.awaiting;
  return <span className={`stance ${m.cls}`}><span className="glyph" aria-hidden="true">{m.glyph}</span>{m.label}</span>;
}

function Discussion({ order, role, disc, onPost }) {
  const [text, setText] = useState("");
  const [stance, setStance] = useState(null);
  const stances = disc?.stances || {};
  const comments = disc?.comments || [];
  const tally = { yes: 0, no: 0, thinking: 0, awaiting: 0 };
  STAKEHOLDERS.forEach((r) => { tally[stances[r] || "awaiting"]++; });
  const canStance = STAKEHOLDERS.includes(role);

  const submit = () => {
    if (!text.trim() && !(canStance && stance)) return;
    onPost(order.oa, { role, stance: canStance ? stance : null, text: text.trim(), when: "Just now" });
    setText(""); setStance(null);
  };

  return (
    <>
      <div className="rail-card">
        <div className="rail-head">
          <span className="rail-title">Stakeholder positions</span>
          <span className="tiny muted">Formal response</span>
        </div>
        <div className="tally">
          <span className="tally-b yes">{tally.yes} Yes</span>
          <span className="tally-b no">{tally.no} No</span>
          <span className="tally-b thinking">{tally.thinking} Thinking</span>
          <span className="tally-b">{tally.awaiting} awaiting</span>
        </div>
        {STAKEHOLDERS.map((r) => {
          const cfg = ROLES[r];
          return (
            <div className={`pos ${r === role ? "me" : ""}`} key={r}>
              <span className="avatar">{cfg ? initials(cfg.person) : "?"}</span>
              <div className="pos-who">
                <div className="pos-role">{cfg ? cfg.label : r}{r === role && <span className="pos-me-tag"> · you</span>}</div>
                <div className="pos-name">{cfg ? cfg.person : ""}</div>
              </div>
              <StancePill s={stances[r] || "awaiting"} />
            </div>
          );
        })}
      </div>

      <div className="rail-card">
        <div className="rail-head">
          <span className="rail-title">Comments</span>
          <span className="tiny muted">{comments.length}</span>
        </div>
        <div className="thread">
          {comments.length === 0
            ? <div className="cmt-empty">No comments yet on this order.</div>
            : comments.map((c) => {
              const cfg = ROLES[c.role];
              return (
                <div className="cmt" key={c.id}>
                  <span className="cmt-av">{cfg ? initials(cfg.person) : "?"}</span>
                  <div className="cmt-body">
                    <div className="cmt-top">
                      <span className="cmt-role">{cfg ? cfg.label : c.role}</span>
                      {c.stance && <StancePill s={c.stance} />}
                      <span className="cmt-when">{c.when}</span>
                    </div>
                    <div className="cmt-text">{c.text}</div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="compose">
          <div className="compose-lbl">Responding as <b>{ROLES[role]?.label || role}</b> · {ROLES[role]?.person}</div>
          {canStance && (
            <div className="stance-pick">
              {["yes", "no", "thinking"].map((v) => (
                <button key={v} className={`stance-opt ${stance === v ? `pick ${v}` : ""}`}
                  onClick={() => setStance(stance === v ? null : v)}>
                  <span className="glyph" aria-hidden="true">{STANCE_MAP[v].glyph}</span>{STANCE_MAP[v].label}
                </button>
              ))}
            </div>
          )}
          <textarea
            placeholder={canStance ? "Add a comment, and set your position above (optional)…" : "Add a comment…"}
            value={text} onChange={(e) => setText(e.target.value)} />
          <div className="compose-foot">
            <span className="tiny soft">
              {canStance ? (stance ? `Position → ${STANCE_MAP[stance].label}` : "No position change") : "Comment only"}
            </span>
            <button className="btn sm" onClick={submit} disabled={!text.trim() && !(canStance && stance)}>Post</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------
   Views
   ------------------------------------------------------------ */

function Today({ role, open }) {
  const items = ATTENTION.filter((a) => a.roles.includes(role));
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Today</h1>
          <div className="subtitle">
            {items.length ? `${items.length} items need you. Everything else is running.` : "Nothing is waiting on you."}
          </div>
        </div>
      </div>
      <div className="grid2">
        <div className="stack">
          <div className="card">
            <div className="card-head">
              <span className="card-title">Needs your attention</span>
              <span className="tiny muted">Ordered by impact on delivery</span>
            </div>
            {items.length === 0
              ? <div className="empty"><b>Your queue is clear</b>Nothing is blocked or waiting on you.</div>
              : items.map((a) => (
                <div className="att" key={a.id}>
                  <div className={`att-bar ${a.level}`} />
                  <div className="att-body">
                    <div className="att-top">
                      <span className="att-title">{a.title}</span>
                      <button className="link mono tiny" onClick={() => open(a.oa)}>OA {a.oa}</button>
                    </div>
                    <div className="att-sub">{a.sub}</div>
                  </div>
                  <div className="att-actions">
                    <span className={`pill ${a.level === "risk" ? "risk" : a.level === "warn" ? "warn" : ""}`}>{a.due}</span>
                    <button className="btn sm" onClick={() => open(a.oa)}>{a.action}</button>
                  </div>
                </div>
              ))}
          </div>
          <div className="card">
            <div className="card-head"><span className="card-title">Handoffs waiting for you</span></div>
            <div className="att">
              <div className="att-bar info" />
              <div className="att-body">
                <div className="att-title">Radiography hold point ready to schedule</div>
                <div className="att-sub">OA 20790 · sent 05-09 by Production · casing welded, awaiting inspection</div>
              </div>
              <button className="btn sm ghost">Accept</button>
            </div>
            <div className="att">
              <div className="att-bar info" />
              <div className="att-body">
                <div className="att-title">Production release for casing fit-up</div>
                <div className="att-sub">OA 20790 · sent 05-09 by Planning · drawing R1 attached</div>
              </div>
              <button className="btn sm ghost">Accept</button>
            </div>
          </div>
        </div>
        <div className="stack">
          <div className="card card-pad">
            <h2 className="sec">Delivery position</h2>
            {[["On promise", 18, ""], ["At risk", 4, "warn"], ["Blocked", 3, "risk"], ["Ready to leave", 2, ""]].map(([k, v, c]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span className="muted">{k}</span>
                <b style={{ color: c === "risk" ? "var(--risk)" : c === "warn" ? "var(--warn)" : "inherit" }}>{v}</b>
              </div>
            ))}
          </div>
          <div className="note">
            Everything below sits on the same eight checkpoints, whichever department you belong to.
            Nothing is tracked in a second list.
          </div>
        </div>
      </div>
    </div>
  );
}

function Orders({ open, toast }) {
  const [f, setF] = useState("Live plan");
  const opts = ["Live plan", "All", "Blocked", "At risk", "Ready to dispatch", "Project orders", "Service / spares", "Aged & dead", "Cancelled"];
  const list = useMemo(() => {
    if (f === "Live plan") return ORDERS.filter((o) => o.lifecycle !== "cancelled" && o.lifecycle !== "dead");
    if (f === "Blocked") return ORDERS.filter((o) => o.state === "blocked");
    if (f === "At risk") return ORDERS.filter((o) => o.state === "at-risk" || o.state === "warn");
    if (f === "Ready to dispatch") return ORDERS.filter((o) => o.gate.every((g) => g.s !== "fail") && o.payState !== "advance-only");
    if (f === "Project orders") return ORDERS.filter((o) => o.cls === "Project");
    if (f === "Service / spares") return ORDERS.filter((o) => o.code === "SERVICE");
    if (f === "Aged & dead") return ORDERS.filter((o) => o.lifecycle === "aged" || o.lifecycle === "dead");
    if (f === "Cancelled") return ORDERS.filter((o) => o.lifecycle === "cancelled");
    return ORDERS;
  }, [f]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Orders</h1>
          <div className="subtitle">One row per order line. A checkpoint and a state, not four status columns.</div>
        </div>
        <button className="btn ghost" onClick={() => toast("Pending Order sheet exported — same columns, same order")}>
          Export as Pending Order sheet
        </button>
      </div>
      <div className="filters">
        {opts.map((x) => <button key={x} className={`chip ${f === x ? "on" : ""}`} onClick={() => setF(x)}>{x}</button>)}
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr>
            <th>OA</th><th>Epicor line</th><th>Customer</th><th>Model</th><th>Qty</th>
            <th>Promise</th><th>Checkpoint</th><th>State</th><th>Owner</th>
          </tr></thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.epicor} className="click" onClick={() => open(o.oa)}>
                <td className="mono link">{o.oa}</td>
                <td className="mono tiny muted">{o.epicor}</td>
                <td>{o.customer}</td>
                <td className="muted tiny">
                  {o.model}
                  {o.cls === "Project" && <span className="pill hollow tiny" style={{ marginLeft: 6 }}>Project</span>}
                  {o.code === "SERVICE" && <span className="pill hollow tiny" style={{ marginLeft: 6 }}>Service/spares</span>}
                  {o.lines && <span className="pill info tiny" style={{ marginLeft: 6 }}>+{o.lines.length - 1} lines</span>}
                  {o.lifecycle === "dead" && <span className="pill risk tiny" style={{ marginLeft: 6 }}>Dead</span>}
                  {o.lifecycle === "cancelled" && <span className="pill hollow tiny" style={{ marginLeft: 6 }}>Cancelled</span>}
                </td>
                <td className="mono">{o.qty}</td>
                <td className="mono">
                  {o.promise}
                  {o.revised !== o.promise && <span className="tiny" style={{ color: "var(--risk)" }}> → {o.revised}</span>}
                </td>
                <td className="tiny">{o.checkpoint}</td>
                <td><State level={o.state} text={o.stateNote} /></td>
                <td className="muted tiny">{o.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Workspace({ order, back, role, disc, onPost }) {
  const buildTab = order.cls === "Project" ? "Operations" : "Build";
  const [tab, setTab] = useState("Overview");
  const [catchOpen, setCatchOpen] = useState(true);
  const tabs = ["Overview", buildTab, "Supply", "Dispatch gate", "Documents"];
  const slowIntake = order.oa === "19415";
  const decode = LEGACY_MAP[order.legacy];

  return (
    <div className="page">
      <div className="ws-layout">
        <div className="ws-main">
      <div className="crumb">
        <button className="link" onClick={back}>Orders</button><span>/</span>
        <span className="mono">OA {order.oa}</span>
      </div>

      <div className="ohead" style={{ marginBottom: 16 }}>
        <div className="ohead-top">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span className="ono mono">OA {order.oa}</span>
              <span style={{ fontSize: 16 }}>{order.customer}</span>
              <State level={order.state} text={order.stateNote} />
              {order.cls === "Project" && <span className="pill info">Project order</span>}
              {order.insp === "Client" && <span className="pill warn"><span className="glyph">◆</span>Customer inspection</span>}
              {decode && <span className="decode" title="Legacy status code carried on the Pending Order sheet"><b>{order.legacy}</b>{decode}</span>}
              {order.lifecycle === "aged" && <span className="pill warn">Aged &gt; 1 yr</span>}
              {order.lifecycle === "dead" && <span className="pill risk"><span className="glyph">■</span>Dead order</span>}
              {order.lifecycle === "cancelled" && <span className="pill hollow">Cancelled</span>}
            </div>
            <div className="ofacts">
              <Fact k="Epicor line" v={order.epicor} mono />
              <Fact k="SAP order" v={order.sap} mono />
              <Fact k="Customer PO" v={order.custPo} mono />
              <Fact k="Model" v={order.model} />
              <Fact k="Qty" v={order.qty} mono />
              <Fact k="Value" v={`₹${order.amount}`} mono />
              <Fact k="Need" v={order.need} mono />
              <Fact k="Promise" v={order.promise} mono />
              <Fact k="Committed" v={order.revised} mono />
              <Fact k="Plan" v={`${order.planMonth} · ${order.planWeek}`} />
              <Fact k="Weight" v={`${order.weight} kg`} mono />
              <Fact k="Product" v={CODE_LABEL[order.code] || order.code} />
              <Fact k="Drive" v={order.drive} />
              <Fact k="MFG / Revenue plan" v={`${order.mfgMonth} · ${order.revenueMonth}`} />
              <Fact k="Payment terms" v={order.payTerms} />
              <Fact k="Drawing received" v={order.drgRecd} mono />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn ghost">Add note</button>
            <button className="btn">Raise exception</button>
          </div>
        </div>
        <div className="ohead-stages"><Spine current={order.checkpoint} blocked={order.state === "blocked"} /></div>
      </div>

      {order.lines && (
        <div className="card card-pad" style={{ marginBottom: 16 }}>
          <h2 className="sec">OA {order.oa} carries {order.lines.length} Epicor lines</h2>
          <div className="lines-strip">
            {order.lines.map((l) => (
              <div className={`line-chip ${l.note === "This line" ? "on" : ""}`} key={l.epicor}>
                <div className="lc-no mono">{l.epicor}</div>
                <div className="lc-model">{l.model} · {l.qty} pc</div>
                <div style={{ marginTop: 6 }}><State level={l.state} text={l.checkpoint} /></div>
              </div>
            ))}
          </div>
          <div className="tiny muted" style={{ marginTop: 10 }}>
            One OA can carry several fan models as separate Epicor lines. Each line rides its own spine — the sheet showed these as separate rows under one OA.
          </div>
        </div>
      )}

      {catchOpen && (
        <div className="catch" style={{ marginBottom: 16 }}>
          <div className="catch-h">
            <span className="catch-t">Catch up on this order</span>
            <button className="link tiny" onClick={() => setCatchOpen(false)}>Hide</button>
          </div>
          <div className="catch-row"><div className="catch-k">We promised</div><div className="catch-v">{order.catch.promised}</div></div>
          <div className="catch-row"><div className="catch-k">Done so far</div><div className="catch-v">{order.catch.done}</div></div>
          <div className="catch-row"><div className="catch-k">Holding it up</div><div className="catch-v">{order.catch.blocking}</div></div>
          <div className="catch-row"><div className="catch-k">Happens next</div><div className="catch-v">{order.catch.next}</div></div>
        </div>
      )}

      <div className="card duo" style={{ marginBottom: 16 }}>
        <div>
          <div className="duo-k">Where it is now</div>
          <div className="duo-v">{order.current}</div>
          <div className="duo-s">{order.currentSub}</div>
          <div className="bar"><i className={order.state === "blocked" ? "red" : ""} style={{ width: `${order.pct}%` }} /></div>
        </div>
        <div>
          <div className="duo-k">What happens next</div>
          <div className="duo-v">{order.next}</div>
          <div className="duo-s">{order.nextOwner} · {order.nextDue}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn sm">Mark done</button>
            <button className="btn sm ghost">Reassign</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          {tabs.map((t) => <button key={t} className={`tab ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>{t}</button>)}
        </div>

        {tab === "Overview" && (
          <div className="grid2" style={{ padding: 16, gap: 16 }}>
            <div>
              <h2 className="sec">History</h2>
              <div className="card">
                <div className="tl">
                  {order.timeline.map((e, i) => (
                    <div className="tl-row" key={i}>
                      <div className="tl-when mono">{e.when}<br /><span style={{ fontSize: 11 }}>{e.time}</span></div>
                      <div className="tl-line"><div className={`tl-dot ${e.kind}`} /></div>
                      <div className="tl-body">
                        <div className="tl-act">{e.act}</div>
                        <div className="tl-meta">{e.who}</div>
                        {e.note && <div className="tl-note">{e.note}</div>}
                        <div className="tl-meta" style={{ marginTop: 5 }}>Next: {e.next}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="stack">
              <div className="card">
                <div className="card-head"><span className="card-title">Open exceptions</span></div>
                {order.exceptions.length === 0
                  ? <div className="empty"><b>No open exceptions</b>Nothing is blocking this order.</div>
                  : order.exceptions.map((x, i) => (
                    <div className="att" key={i}>
                      <div className={`att-bar ${x.level}`} />
                      <div className="att-body">
                        <div className="att-title">{x.t}</div>
                        <div className="att-sub">{x.sub}</div>
                        <div className="tiny soft" style={{ marginTop: 6 }}>{x.owner} · {x.due}</div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="card card-pad">
                <h2 className="sec">Order intake</h2>
                {[["PO received", order.poDate], ["PO cleared", order.poCleared], ["OA released", order.oaReleased], ["GA approval", order.gaApproval]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                    <span className="muted tiny">{k}</span><span className="mono tiny">{v}</span>
                  </div>
                ))}
                {slowIntake && (
                  <div className="tiny" style={{ color: "var(--risk)", marginTop: 8 }}>
                    14 days between PO cleared and OA released.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "Build" && (
          order.subitems.length ? (
            <>
              <div className="card-head" style={{ borderBottom: "1px solid var(--line)" }}>
                <span className="card-title">Sub-assembly readiness</span>
                <span className="tiny muted">Replaces the Manufacturing Plan sheet</span>
              </div>
              <div className="tiny muted" style={{ padding: "10px 20px 0" }}>{DRIVE_NOTE[order.drive] || ""}</div>
              {order.subitems.map((s) => {
                const na = order.drive === "Direct" && s.n === "Shaft";
                return (
                  <div className="sub" key={s.n}>
                    <span className="sub-n">{s.n}</span>
                    <span className="mono tiny muted">{na ? "—" : s.d}</span>
                    {na
                      ? <State level="on-track" text="Not applicable — direct drive" />
                      : <State level={s.s === "Ready" ? "on-track" : "at-risk"} text={s.s} />}
                  </div>
                );
              })}
            </>
          ) : <div className="empty"><b>No sub-assemblies</b>This line is bought and resold (service, spare or bought-out), not built in sections.</div>
        )}

        {tab === "Operations" && (
          !order.operations ? <div className="empty"><b>No operation schedule</b>This project line has no detailed operation plan yet.</div> : (
            <>
            <div className="card-head" style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="card-title">Operation schedule</span>
              <span className="tiny muted">A hold point stops the next operation until Quality passes it</span>
            </div>
            <table className="tbl">
              <thead><tr><th>Operation</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
              <tbody>
                {order.operations.map((op) => (
                  <tr key={op.n} className={op.hold ? "hold" : ""}>
                    <td>
                      {op.n}
                      {op.hold && <span className="op-hold-tag" style={{ marginLeft: 8 }}>Hold point</span>}
                    </td>
                    <td className="mono tiny">{op.start}</td>
                    <td className="mono tiny">{op.end}</td>
                    <td><State level={op.s === "Waiting" ? "warn" : op.s === "Not started" ? "watch" : "on-track"} text={op.s} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </>
          )
        )}

        {tab === "Supply" && (
          order.supply.length ? (
            <table className="tbl">
              <thead><tr><th>Item</th><th>Scope</th><th>Supplier</th><th>Expected</th><th>Received</th><th>Status</th></tr></thead>
              <tbody>
                {order.supply.map((s) => (
                  <tr key={s.item}>
                    <td>{s.item}</td>
                    <td className="tiny muted">{s.scope}</td>
                    <td className="tiny muted">{s.supplier}</td>
                    <td className="mono tiny">{s.expected}</td>
                    <td className="mono tiny">{s.received || <span className="soft">—</span>}</td>
                    <td>
                      {s.scope.includes("Not applicable")
                        ? <State level="on-track" text="Not applicable" />
                        : s.received
                          ? <State level="on-track" text="Received" />
                          : s.age > 0
                            ? <State level="blocked" text={`Overdue ${s.age} days`} />
                            : <State level="watch" text="On order" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="empty"><b>No supply items</b>Nothing bought in for this line.</div>
        )}

        {tab === "Dispatch gate" && <GateBody order={order} />}

        {tab === "Documents" && (
          <div className="card-pad">
            {["General arrangement drawing", "Manufacturing drawing", "BOM", "Customer PO", "Test certificate", "QAP records"].map((d) => (
              <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                <span className="tiny">{d}</span><button className="link tiny">Open</button>
              </div>
            ))}
            <div className="tiny muted" style={{ marginTop: 12 }}>
              Drawings are read from AutoCAD Vault. The platform holds a link and the revision number, never a second copy.
            </div>
          </div>
        )}
      </div>
        </div>
        <aside className="ws-rail">
          <Discussion order={order} role={role} disc={disc} onPost={onPost} />
        </aside>
      </div>
    </div>
  );
}

function Planning({ open }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Planning</h1>
          <div className="subtitle">Plan week is a week again. State sits beside it, not inside it.</div>
        </div>
        <button className="btn">Confirm plan</button>
      </div>

      <div className="kpis" style={{ marginBottom: 18 }}>
        <div className="kpi"><div className="kpi-k">Orders in plan</div><div className="kpi-v">27</div><div className="kpi-s">Sep-26 loading</div></div>
        <div className="kpi"><div className="kpi-k">Blocked on supply</div><div className="kpi-v" style={{ color: "var(--risk)" }}>2</div><div className="kpi-s">Both motors</div></div>
        <div className="kpi"><div className="kpi-k">Weight loaded, Sep-26</div><div className="kpi-v">58,488<span className="tiny muted"> kg</span></div><div className="kpi-s">Summed from confirmed orders</div></div>
        <div className="kpi"><div className="kpi-k">Hold points this month</div><div className="kpi-v">4</div><div className="kpi-s">3 need the customer on site</div></div>
      </div>

      <h2 className="sec">Plan week</h2>
      <div className="kb" style={{ marginBottom: 18 }}>
        {WEEK_COLS.map((w) => {
          const rows = ORDERS.filter((o) => o.planWeek === w);
          return (
            <div className="kb-col" key={w}>
              <div className="kb-h"><span>{w}</span><span className="nav-count">{rows.length}</span></div>
              {rows.length === 0
                ? <div className="kb-empty">Nothing loaded</div>
                : rows.map((o) => (
                  <div className="kb-card" key={o.epicor} onClick={() => open(o.oa)}>
                    <div className="kb-id mono">OA {o.oa}</div>
                    <div className="kb-sub">{o.customer}</div>
                    <div style={{ marginTop: 6 }}><State level={o.state} text={o.stateNote} /></div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-head">
          <span className="card-title">Dates that moved</span>
          <span className="tiny muted">Committed against promise, with the reason</span>
        </div>
        <table className="tbl">
          <thead><tr><th>OA</th><th>Promise</th><th>Committed</th><th>State</th><th>Reason</th><th>Owner</th></tr></thead>
          <tbody>
            {ORDERS.filter((o) => o.revised !== o.promise).map((o) => (
              <tr key={o.epicor} className="click" onClick={() => open(o.oa)}>
                <td className="mono link">{o.oa}</td>
                <td className="mono">{o.promise}</td>
                <td className="mono">{o.revised}</td>
                <td><State level={o.state} text={o.stateNote} /></td>
                <td className="tiny muted">{o.exceptions[0] ? o.exceptions[0].t : "—"}</td>
                <td className="tiny muted">{o.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Supply({ open }) {
  const rows = [];
  ORDERS.forEach((o) => o.supply.forEach((s) => {
    if (!s.received && !s.scope.includes("Not applicable")) rows.push({ ...s, o });
  }));
  rows.sort((a, b) => b.age - a.age);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Supply and shortages</h1>
          <div className="subtitle">Every shortage has an owner and an age. Nothing is a note typed into a cell.</div>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><span className="card-title">Open items, oldest first</span></div>
        <table className="tbl">
          <thead><tr><th>OA</th><th>Item</th><th>Scope</th><th>Supplier</th><th>Expected</th><th>Status</th><th /></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="click" onClick={() => open(r.o.oa)}>
                <td className="mono link">{r.o.oa}</td>
                <td>{r.item}</td>
                <td className="tiny muted">{r.scope}</td>
                <td className="tiny muted">{r.supplier}</td>
                <td className="mono tiny">{r.expected}</td>
                <td>{r.age > 0 ? <State level="blocked" text={`Overdue ${r.age} days`} /> : <State level="watch" text="On order" />}</td>
                <td><button className="btn sm">Chase</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="note">
        Customer-scope items age separately. OA 20422 has waited 13 days on a motor the customer owes —
        the record should show whose delay it is when the date is renegotiated.
      </div>
    </div>
  );
}

function Production({ open }) {
  const groups = ["In progress", "Ready", "Blocked", "Rework", "Complete"];
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Production</h1>
          <div className="subtitle">Status comes from the operator's taps, not from a supervisor typing codes.</div>
        </div>
      </div>
      {groups.map((g) => {
        const rows = JOBS.filter((j) => j.state === g);
        if (!rows.length) return null;
        return (
          <div className="card" key={g} style={{ marginBottom: 14 }}>
            <div className="card-head">
              <span className="card-title">{g}</span>
              <span className="tiny muted">{rows.length} job{rows.length > 1 ? "s" : ""}</span>
            </div>
            <table className="tbl">
              <thead><tr><th>Job</th><th>OA</th><th>Operation</th><th>Section</th><th>Done</th><th>Operator</th><th>Since</th></tr></thead>
              <tbody>
                {rows.map((j) => (
                  <tr key={j.job} className="click" onClick={() => open(j.oa)}>
                    <td className="mono">{j.job}</td>
                    <td className="mono link">{j.oa}</td>
                    <td>{j.op}</td>
                    <td className="muted tiny">{j.section}</td>
                    <td className="mono">{j.done} of {j.qty}</td>
                    <td className="muted tiny">{j.by}</td>
                    <td className="mono tiny muted">{j.since}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function Operator() {
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);
  const [qty, setQty] = useState(1);
  const job = JOBS[0];
  const reset = () => { setPhase("idle"); setResult(null); setQty(1); };

  return (
    <div className="page">
      <div className="op-wrap">
        <div className="op-card">
          <div className="op-head">
            <div className="op-job mono">OA {job.oa}</div>
            <div className="op-oper">{job.op} · {job.section}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <span className="pill info">Drawing R1</span>
              <span className="pill">Quantity {job.qty}</span>
              <span className="pill">{job.job}</span>
            </div>
          </div>
          <div className="op-body">
            {phase === "idle" && (<>
              <div className="op-state"><div className="op-state-k">Current</div><div className="op-state-v">Not started</div></div>
              <button className="op-btn" onClick={() => setPhase("running")}>Start job</button>
              <button className="op-sec">Report a problem</button>
            </>)}
            {phase === "running" && (<>
              <div className="op-state"><div className="op-state-k">Started at</div><div className="op-state-v mono">08:15 AM</div></div>
              <button className="op-btn stop" onClick={() => setPhase("result")}>Stop job</button>
              <button className="op-sec">Report a problem</button>
            </>)}
            {phase === "result" && (<>
              <div className="op-state"><div className="op-state-k">Ran for</div><div className="op-state-v mono">2 h 10 min</div></div>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>What happened?</div>
              <div className="op-choices">
                {["Completed", "Rework", "Scrap", "Downtime"].map((r) => (
                  <button key={r} className={`op-choice ${result === r ? "pick" : ""}`} onClick={() => setResult(r)}>{r}</button>
                ))}
              </div>
              {result && (<>
                <div className="qty">
                  <button onClick={() => setQty(Math.max(0, qty - 1))} aria-label="Reduce quantity">−</button>
                  <div className="qty-v mono">{qty}</div>
                  <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity">+</button>
                </div>
                <div className="tiny muted" style={{ textAlign: "center", marginBottom: 14 }}>
                  Quantity {result.toLowerCase()}, out of {job.qty}
                </div>
              </>)}
              <button className="op-btn" disabled={!result} onClick={() => setPhase("done")} style={{ marginTop: 6 }}>Confirm</button>
            </>)}
            {phase === "done" && (
              <div className="done-note">
                <div className="done-tick">✓</div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>
                  {qty} {result === "Completed" ? "completed" : result.toLowerCase()} on {job.op}
                </div>
                <div className="muted" style={{ marginTop: 6 }}>
                  Recorded against OA {job.oa}. Fabrication has been told the flanges are ready.
                </div>
                <button className="btn ghost" style={{ marginTop: 18 }} onClick={reset}>Next job</button>
              </div>
            )}
          </div>
        </div>
        <div className="tiny muted" style={{ textAlign: "center", marginTop: 14 }}>
          Signed in as P. Jadhav on shared device SHOP-02. Work is saved even if the network drops.
        </div>
      </div>
    </div>
  );
}

function Quality({ open }) {
  const holds = [];
  ORDERS.forEach((o) => (o.operations || []).forEach((op) => {
    if (op.hold && op.s !== "Passed") holds.push({ ...op, o });
  }));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Quality</h1>
          <div className="subtitle">A hold point is a stop, not a status. Nothing downstream starts until it passes.</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <span className="card-title">Hold points</span>
          <span className="tiny muted">Contractual inspections on engineered orders</span>
        </div>
        <table className="tbl">
          <thead><tr><th>OA</th><th>Inspection</th><th>Planned</th><th>Inspector</th><th>Status</th><th /></tr></thead>
          <tbody>
            {holds.map((h, i) => (
              <tr key={i} className="click" onClick={() => open(h.o.oa)}>
                <td className="mono link">{h.o.oa}</td>
                <td>{h.n}</td>
                <td className="mono tiny">{h.start}</td>
                <td className="tiny muted">{h.o.insp === "Client" ? "Customer inspector required" : "Nadi"}</td>
                <td><State level={h.s === "Waiting" ? "warn" : "watch"} text={h.s} /></td>
                <td><button className="btn sm">Schedule</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-head"><span className="card-title">Failures and rework</span></div>
        <div className="att">
          <div className="att-bar risk" />
          <div className="att-body">
            <div className="att-top">
              <span className="att-title">Third leak on the same unit</span>
              <button className="link mono tiny" onClick={() => open("18616")}>OA 18616</button>
            </div>
            <div className="att-sub">
              Failed at customer inspection 20-08-2026, seal replaced 22-08-2026, leak returned after reassembly 28-08-2026.
              Each failure is its own record, so the pattern is countable.
            </div>
          </div>
          <button className="btn sm">Open analysis</button>
        </div>
      </div>
    </div>
  );
}

function Dispatch({ open }) {
  const list = ORDERS.filter((o) => ["20736", "19415", "19962"].includes(o.oa));
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Dispatch</h1>
          <div className="subtitle">Five conditions. The screen names the one that is missing.</div>
        </div>
      </div>
      {list.map((o) => {
        const openCount = o.gate.filter((g) => g.s === "fail").length;
        return (
          <div className="card" key={o.oa} style={{ marginBottom: 14 }}>
            <div className="card-head">
              <span className="card-title">
                <button className="link mono" onClick={() => open(o.oa)}>OA {o.oa}</button>
                <span className="muted" style={{ fontWeight: 400 }}>
                  {" "}· {o.customer} · {o.qty} unit{o.qty > 1 ? "s" : ""} · ₹{o.amount}
                </span>
              </span>
              {openCount === 0
                ? <State level="on-track" text="Cleared to dispatch" />
                : <State level={o.state === "blocked" ? "blocked" : "warn"} text={`${openCount} open`} />}
            </div>
            <GateBody order={o} />
          </div>
        );
      })}
    </div>
  );
}

function Reports({ open }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Where attention is needed</h1>
          <div className="subtitle">Live, and every number opens the orders behind it.</div>
        </div>
        <button className="btn ghost">Export</button>
      </div>

      <div className="kpis" style={{ marginBottom: 16 }}>
        <div className="kpi"><div className="kpi-k">Order in hand</div><div className="kpi-v">₹8.20 cr</div><div className="kpi-s">Derived, not typed</div></div>
        <div className="kpi"><div className="kpi-k">Billed but not moved</div><div className="kpi-v" style={{ color: "var(--warn)" }}>₹16.75 L</div><div className="kpi-s">8 units on one order</div></div>
        <div className="kpi"><div className="kpi-k">Delivered on promise</div><div className="kpi-v">82%</div><div className="kpi-s">Last 30 days</div></div>
        <div className="kpi"><div className="kpi-k">PO cleared to OA released</div><div className="kpi-v">9<span className="tiny muted"> days avg</span></div><div className="kpi-s">Worst case 15 days</div></div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-head"><span className="card-title">Why orders slipped</span></div>
          {[["Motor not received", 6, 60], ["Bought-out shortage", 4, 40], ["Quality rework", 3, 30], ["Customer-scope material", 2, 20], ["Drawing revision", 2, 20]].map(([r, n, w]) => (
            <div key={r} style={{ padding: "12px 20px", borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span>{r}</span><span className="mono muted">{n} orders</span>
              </div>
              <div className="bar"><i style={{ width: `${w}%` }} /></div>
            </div>
          ))}
          <div className="card-pad tiny muted">
            Countable because every delay is an exception with a type, rather than a sentence inside a status cell.
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Needs a decision</span></div>
          {ATTENTION.filter((a) => a.roles.includes("management")).map((a) => (
            <div className="att" key={a.id}>
              <div className={`att-bar ${a.level}`} />
              <div className="att-body">
                <div className="att-top">
                  <span className="att-title">{a.title}</span>
                  <button className="link mono tiny" onClick={() => open(a.oa)}>OA {a.oa}</button>
                </div>
                <div className="att-sub">{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function fmtCr(lakhs) { return "₹" + (lakhs / 100).toFixed(2) + " cr"; }
function fmtL(lakhs) { return "₹" + lakhs.toLocaleString("en-IN") + " L"; }

function Revenue() {
  const actuals = REVENUE.months.filter((m) => m.actual);
  const tgt = actuals.reduce((a, m) => a + m.target, 0);
  const inv = actuals.reduce((a, m) => a + m.invoiced, 0);
  const short = inv - tgt;
  const sign = (n) => (n < 0 ? "−" : "+") + "₹" + Math.abs(n).toLocaleString("en-IN") + " L";

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Revenue plan</h1>
          <div className="subtitle">Monthly target against what was actually billed. From the Pending Order Summary — derived from orders, not kept by hand.</div>
        </div>
        <span className="tiny muted">Report date {REVENUE.reportDate} · Domestic · FY 2026-27</span>
      </div>

      <div className="kpis" style={{ marginBottom: 16 }}>
        <div className="kpi"><div className="kpi-k">Order in hand</div><div className="kpi-v">{fmtCr(REVENUE.orderInHand)}</div><div className="kpi-s">Confirmed, not yet billed</div></div>
        <div className="kpi"><div className="kpi-k">Billed, not moved</div><div className="kpi-v" style={{ color: "var(--warn)" }}>₹16.75 L</div><div className="kpi-s">8 units on OA 19415</div></div>
        <div className="kpi"><div className="kpi-k">Invoiced YTD</div><div className="kpi-v">{fmtL(inv)}</div><div className="kpi-s">against {fmtL(tgt)} target</div></div>
        <div className="kpi"><div className="kpi-k">Shortfall YTD</div><div className="kpi-v" style={{ color: short < 0 ? "var(--risk)" : "var(--ok)" }}>{sign(short)}</div><div className="kpi-s">Invoiced minus target</div></div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-head"><span className="card-title">Target vs billed, by month</span><span className="tiny muted">₹ lakhs</span></div>
          <div className="rev-scroll">
            <table className="tbl rev-tbl">
              <thead><tr><th>Month</th><th className="num">Target</th><th className="num">Invoiced</th><th className="num">Shortfall</th><th style={{ width: 120 }} /></tr></thead>
              <tbody>
                {REVENUE.months.map((m) => {
                  const s = m.invoiced - m.target;
                  return (
                    <tr key={m.m}>
                      <td>{m.m}{!m.actual && <span className="tiny soft"> · planned</span>}</td>
                      <td className="num">{m.target.toLocaleString("en-IN")}</td>
                      <td className="num">{m.actual ? m.invoiced.toLocaleString("en-IN") : <span className="soft">—</span>}</td>
                      <td className={`num ${m.actual ? (s < 0 ? "neg" : "pos") : ""}`}>{m.actual ? (s < 0 ? "−" : "+") + Math.abs(s).toLocaleString("en-IN") : <span className="soft">—</span>}</td>
                      <td>{m.actual && <div className="bar"><i className={s < 0 ? "red" : ""} style={{ width: `${Math.min(100, Math.round(m.invoiced / m.target * 100))}%` }} /></div>}</td>
                    </tr>
                  );
                })}
                <tr className="total">
                  <td>YTD (billed months)</td>
                  <td className="num">{tgt.toLocaleString("en-IN")}</td>
                  <td className="num">{inv.toLocaleString("en-IN")}</td>
                  <td className={`num ${short < 0 ? "neg" : "pos"}`}>{(short < 0 ? "−" : "+") + Math.abs(short).toLocaleString("en-IN")}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card-pad tiny muted">Every month has run short of target. The operational cause is on the Orders spine — motor shortages, customer-scope delays, and billed-but-not-moved units.</div>
        </div>

        <div className="stack">
          <div className="card card-pad">
            <h2 className="sec">Order in hand by entity</h2>
            {REVENUE.entities.map((e) => (
              <div key={e.k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span className="muted">{e.k}</span><b className="mono">{e.v}</b>
              </div>
            ))}
          </div>
          <div className="card card-pad">
            <h2 className="sec">Inventory value</h2>
            {REVENUE.inventory.map((e) => (
              <div key={e.k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span className="muted">{e.k}</span><b className="mono">{e.v}</b>
              </div>
            ))}
          </div>
          <div className="note">Management's billing view used to live in a separate summary tab. Here it reads from the same orders that Planning and Production update.</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Shell
   ------------------------------------------------------------ */
export default function App() {
  const [role, setRole] = useState("planning");
  const [view, setView] = useState("today");
  const [oa, setOa] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [disc, setDisc] = useState(DISCUSSIONS);

  const cfg = ROLES[role];
  const order = ORDERS.find((o) => o.oa === oa);
  const attn = ATTENTION.filter((a) => a.roles.includes(role)).length;

  const toast = (m) => { setToastMsg(m); setTimeout(() => setToastMsg(null), 2600); };
  const open = (id) => setOa(id);
  const go = (v) => { setOa(null); setView(v); };
  const changeRole = (r) => { setRole(r); setOa(null); setView(ROLES[r].nav[0]); };
  const postComment = (oaId, entry) => setDisc((d) => {
    const cur = d[oaId] || { stances: {}, comments: [] };
    const stances = entry.stance ? { ...cur.stances, [entry.role]: entry.stance } : cur.stances;
    const comment = { id: "u" + Date.now(), ...entry };
    return { ...d, [oaId]: { stances, comments: [comment, ...cur.comments] } };
  });

  const counts = { today: attn, orders: ORDERS.length, planning: 6, supply: 3, production: 5, quality: 4, dispatch: 3, myjobs: 1 };

  let body;
  if (order) body = <Workspace order={order} back={() => setOa(null)} role={role} disc={disc[order.oa]} onPost={postComment} />;
  else if (view === "today") body = <Today role={role} open={open} />;
  else if (view === "orders") body = <Orders open={open} toast={toast} />;
  else if (view === "planning") body = <Planning open={open} />;
  else if (view === "supply") body = <Supply open={open} />;
  else if (view === "production") body = <Production open={open} />;
  else if (view === "myjobs") body = <Operator />;
  else if (view === "quality") body = <Quality open={open} />;
  else if (view === "dispatch") body = <Dispatch open={open} />;
  else if (view === "revenue") body = <Revenue />;
  else body = <Reports open={open} />;

  return (
    <div className="nadi">
      <style>{CSS}</style>

      <aside className="rail">
        <div className="brand">
          <div className="brand-mark">
            <span className="brand-dot">N</span>
            <span className="brand-name">Nadi Airtechnics</span>
          </div>
          <div className="brand-sub">Operations platform</div>
        </div>
        <nav className="nav">
          {cfg.nav.map((n) => (
            <button key={n} className={`nav-item ${view === n && !order ? "on" : ""}`} onClick={() => go(n)}>
              <span>{NAV[n]}</span>
              {counts[n] ? <span className={`nav-count ${n === "today" && attn > 3 ? "hot" : ""}`}>{counts[n]}</span> : null}
            </button>
          ))}
        </nav>
        <div className="role-box">
          <div className="role-label">Viewing as</div>
          <select className="role-select" value={role} onChange={(e) => changeRole(e.target.value)}>
            {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <div className="role-who">
            <span className="avatar">{cfg.person.split(" ").map((p) => p[0]).join("").slice(0, 2)}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{cfg.person}</div>
              <div className="tiny muted">{cfg.label}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="search">
            <span className="muted">⌕</span>
            <input placeholder="Search OA, Epicor line, SAP order, customer PO, customer or model" />
          </div>
          <div className="topbar-meta">
            <span>Tuesday, 8 September 2026</span>
            <span className="pill ok"><span className="glyph">●</span>SAP connected</span>
          </div>
        </header>
        {body}
      </main>

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}
