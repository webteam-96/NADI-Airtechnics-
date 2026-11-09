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

/* v3 stance voting (Yes/No/Thinking) removed — the V6 reframe uses
   the lighter Projects model of holds + comments + revised dates (§13). */

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

/* v3 operator JOBS list removed — shop-floor status now comes from the
   MOS model and the Shop floor view (START/STOP at MO level, §11). */

/* ============================================================
   V6 FUNCTIONAL FLOW — scheduling / capacity / shop-floor model
   ------------------------------------------------------------
   The Functional Flow (v1.5) re-centres the platform on three
   ranked pillars around SAP Business One: finite-capacity
   SCHEDULING (§9), CAPACITY planning (§10) and shop-floor
   START/STOP tracking (§11). The unit of work is the
   Manufacturing Order (MO) under a sales-order line, each with a
   ROUTE of operations on WORK CENTRES. SAP B1 is read for
   masters; the platform owns the schedule, the frozen schedule,
   load-vs-capacity, START/STOP, stoppages/rejections and the
   closure it posts back (§5.3, §7).

   These are side-structures keyed by OA (same pattern as
   DISCUSSIONS / REVENUE) so existing views keep working while
   the pillar views are built on top. Fixed "today" = 08-09-2026.
   ============================================================ */

/* Work groups — read from SAP B1 (§7.1.2); no duplicate set-up here. */
const WORKGROUPS = [
  { id: "MS",    name: "Machine Shop" },
  { id: "FAB",   name: "Fabrication & Casing Shop" },
  { id: "ASM",   name: "Assembly" },
  { id: "TEST",  name: "Testing & Balancing" },
  { id: "PAINT", name: "Paint & Finish" },
  { id: "PACK",  name: "Packing" },
  { id: "SUB",   name: "Subcontract" },
];

/* Work centres under each group. Capacity = shiftHrs × shifts per
   working day (Mon–Sat), from the shift calendar read from SAP B1
   (§7.1.3). Each work centre runs one job at a time; set-up time is
   already in the route hours (§9.1.2). Subcontract centres are dated
   by lead time, not by in-house hours (§9.1.7). */
const WORKCENTRES = [
  { id: "VTL-1",   name: "Vertical turret lathe",       group: "MS",   shiftHrs: 8, shifts: 1, downtime: 0 },
  { id: "HMC-1",   name: "Horizontal machining centre", group: "MS",   shiftHrs: 8, shifts: 2, downtime: 0 },
  { id: "DRILL-1", name: "Radial drill",                group: "MS",   shiftHrs: 8, shifts: 1, downtime: 0 },
  { id: "ROLL-1",  name: "Plate rolling",               group: "FAB",  shiftHrs: 8, shifts: 1, downtime: 0 },
  { id: "WELD-1",  name: "Welding bay 1",               group: "FAB",  shiftHrs: 8, shifts: 2, downtime: 0 },
  { id: "WELD-2",  name: "Welding bay 2",               group: "FAB",  shiftHrs: 8, shifts: 1, downtime: 0 },
  { id: "FITUP-1", name: "Casing fit-up",               group: "FAB",  shiftHrs: 8, shifts: 1, downtime: 0 },
  { id: "ASM-1",   name: "Assembly bay 1",              group: "ASM",  shiftHrs: 8, shifts: 1, downtime: 0 },
  { id: "ASM-2",   name: "Assembly bay 2",              group: "ASM",  shiftHrs: 8, shifts: 1, downtime: 0 },
  { id: "BAL-1",   name: "Dynamic balancing",           group: "TEST", shiftHrs: 8, shifts: 1, downtime: 0 },
  { id: "TEST-1",  name: "Test rig",                    group: "TEST", shiftHrs: 8, shifts: 1, downtime: 0 },
  { id: "PAINT-1", name: "Paint booth",                 group: "PAINT",shiftHrs: 8, shifts: 1, downtime: 0 },
  { id: "PACK-1",  name: "Packing & crating",           group: "PACK", shiftHrs: 8, shifts: 1, downtime: 0 },
  { id: "SC-GALV", name: "Galvanising (subcontract)",   group: "SUB",  subcontract: true, leadDays: 7 },
  { id: "SC-MACH", name: "Heavy machining (subcontract)",group: "SUB", subcontract: true, leadDays: 10 },
];

/* Overtime / extra-shift changes are made in the platform and sent
   back to SAP B1 (§9.1.9). Each entry adds hours to a work centre's
   available capacity for the dates concerned. Platform-held (§7.2). */
const CAL_ADJUST = [
  { wc: "WELD-1", from: "08-09-2026", to: "13-09-2026", kind: "Extra shift", addHrsPerDay: 8, by: "Planning — A. Nair", note: "Carrying the WP-1600 casing-welding load" },
];

/* Bought-out material, keyed by OA. Scheduling dates the start of an
   order that waits on an item: the lead time set against the item
   code is used first; where none is set, the due date of the open
   purchase order is used (§9.1.5). Read from SAP B1 (§7.1.4, §7.1.8). */
const BOUGHTOUT = {
  "19962": [
    { item: "Motor 15 kW", scope: "Nadi (NM)", supplier: "Crompton Greaves", leadDays: null, poDue: "25-08-2026", received: null },
    { item: "Bearing set",  scope: "Nadi (NM)", supplier: "SKF India",       leadDays: 21,   poDue: "20-07-2026", received: "19-07-2026" },
  ],
  "20422": [
    { item: "Motor 7.5 kW", scope: "Customer (CM)", supplier: "Customer scope", leadDays: null, poDue: "26-08-2026", received: null },
  ],
  "20790": [
    { item: "Plate IS 2062 Gr.B", scope: "Nadi (NM)", supplier: "JSW Steel", leadDays: 21, poDue: "15-07-2026", received: "14-07-2026" },
    { item: "Motor 160 kW",       scope: "Nadi (NM)", supplier: "ABB",       leadDays: 90, poDue: "10-10-2026", received: null },
  ],
  "19449": [
    { item: "Oil level indicator (Dodge)", scope: "Nadi (NM)", supplier: "Dodge / local", leadDays: null, poDue: "26-08-2026", received: null },
  ],
  "15288": [
    { item: "Motors (7 off)", scope: "Nadi (NM)", supplier: "—", leadDays: 60, poDue: "15-06-2026", received: "15-06-2026 (6 of 7)" },
  ],
};

/* How an MO's status renders. Reuses STATE_MAP CSS classes.
   Lifecycle: unscheduled → scheduled → started → stopped (closed). */
const MO_STATE = {
  unscheduled: { cls: "watch",    glyph: "○", label: "Unscheduled" },
  scheduled:   { cls: "on-track", glyph: "◷", label: "Scheduled" },
  started:     { cls: "watch",    glyph: "▶", label: "Started" },
  stopped:     { cls: "on-track", glyph: "■", label: "Stopped (closed)" },
};

/* How a closure posts back to SAP B1 on STOP (§11, §16.1). The
   message is numbered and idempotent; "pending" means STOP is done
   but the closure has not yet posted (retried, surfaced on Today). */
const CLOSURE_STATE = {
  "false":   { cls: "watch",    glyph: "—", label: "Open" },
  pending:   { cls: "warn",     glyph: "◴", label: "Closure not posted" },
  "true":    { cls: "on-track", glyph: "✓", label: "Closed in SAP" },
};

/* Manufacturing orders, keyed by OA. Each MO sits under a sales-order
   line (soLine), carries a route of operations on work centres (wc +
   hrs + per-op state), scheduled start/end from the firmed schedule,
   a freeze flag, START/STOP, stoppages/rejections and the closure
   state. Route op state: done | wip | waiting | queued | hold-waiting
   | not-started. Service / spare / cancelled lines carry no MO — they
   are not manufactured (absent key). */
const MOS = {
  "19962": [
    { mo: "MO-19962-1", soLine: "019962-1-1", item: "NAF/1050/255/6", kind: "fg", qty: 1, needDate: "30-07-2026",
      direction: "backward", schedStart: "02-07-2026", schedEnd: "28-07-2026", frozen: true,
      status: "started", startAt: "02-07-26 08:10", stopAt: null, waitingFor: "material:Motor 15 kW", closurePosted: false,
      route: [
        { op: "Impeller fab & balancing", wc: "BAL-1",   hrs: 12, s: "done" },
        { op: "Casing fit-up & welding",  wc: "FITUP-1", hrs: 14, s: "done" },
        { op: "Final assembly",           wc: "ASM-1",   hrs: 10, s: "waiting", note: "Motor not received" },
        { op: "Testing",                  wc: "TEST-1",  hrs: 4,  s: "queued" },
      ], stoppages: [], rejections: [] },
    { mo: "MO-19962-2", soLine: "019962-2-1", item: "NAF-900-350-09", kind: "fg", qty: 1, needDate: "30-07-2026",
      direction: "backward", schedStart: "04-07-2026", schedEnd: "28-07-2026", frozen: true,
      status: "started", startAt: "04-07-26 08:20", stopAt: null, waitingFor: "material:Motor 15 kW", closurePosted: false,
      route: [
        { op: "Impeller fab & balancing", wc: "BAL-1",   hrs: 10, s: "done" },
        { op: "Casing fit-up & welding",  wc: "FITUP-1", hrs: 12, s: "done" },
        { op: "Final assembly",           wc: "ASM-2",   hrs: 9,  s: "waiting", note: "Motor not received" },
        { op: "Testing",                  wc: "TEST-1",  hrs: 4,  s: "queued" },
      ], stoppages: [], rejections: [] },
    { mo: "MO-19962-3", soLine: "019962-3-1", item: "NAF/630/150/5/21", kind: "fg", qty: 1, needDate: "30-07-2026",
      direction: "backward", schedStart: "06-07-2026", schedEnd: "28-07-2026", frozen: true,
      status: "started", startAt: "06-07-26 08:00", stopAt: null, waitingFor: "material:Motor 15 kW", closurePosted: false,
      route: [
        { op: "Hub machining",           wc: "VTL-1",   hrs: 6,  s: "done" },
        { op: "Impeller balancing",      wc: "BAL-1",   hrs: 8,  s: "done" },
        { op: "Casing fit-up & welding", wc: "FITUP-1", hrs: 12, s: "done" },
        { op: "Final assembly",          wc: "ASM-2",   hrs: 8,  s: "waiting", note: "Waiting 15 kW motor" },
        { op: "Testing",                 wc: "TEST-1",  hrs: 4,  s: "queued" },
        { op: "Paint & pack",            wc: "PACK-1",  hrs: 4,  s: "queued" },
      ], stoppages: [], rejections: [] },
    { mo: "MO-19962-6", soLine: "019962-6-1", item: "NAF/560/150/5", kind: "fg", qty: 1, needDate: "30-07-2026",
      direction: "backward", schedStart: "10-07-2026", schedEnd: "30-07-2026", frozen: true,
      status: "started", startAt: "10-07-26 09:00", stopAt: null, waitingFor: null, closurePosted: false,
      route: [
        { op: "Parts machining", wc: "HMC-1",   hrs: 6, s: "done" },
        { op: "Casing fit-up",   wc: "FITUP-1", hrs: 8, s: "wip" },
        { op: "Final assembly",  wc: "ASM-1",   hrs: 6, s: "queued" },
      ], stoppages: [], rejections: [] },
    { mo: "MO-19962-20", soLine: "019962-20-1", item: "NAF/315/150/5/10", kind: "fg", qty: 1, needDate: "30-07-2026",
      direction: "backward", schedStart: "12-07-2026", schedEnd: "30-07-2026", frozen: true,
      status: "started", startAt: "12-07-26 09:00", stopAt: null, waitingFor: null, closurePosted: false,
      route: [
        { op: "Parts machining", wc: "HMC-1",   hrs: 5, s: "done" },
        { op: "Casing fit-up",   wc: "FITUP-1", hrs: 6, s: "wip" },
        { op: "Final assembly",  wc: "ASM-2",   hrs: 5, s: "queued" },
      ], stoppages: [], rejections: [] },
  ],
  "18616": [
    { mo: "MO-18616-1", soLine: "018616-1-1", item: "HP-900-WP", kind: "fg", qty: 1, needDate: "24-08-2026",
      direction: "backward", schedStart: "05-08-2026", schedEnd: "22-08-2026", frozen: true,
      status: "started", startAt: "05-08-26 08:00", stopAt: null, waitingFor: null, closurePosted: false,
      route: [
        { op: "Impeller machining & balancing", wc: "BAL-1",   hrs: 10, s: "done" },
        { op: "Casing fit-up & welding",        wc: "FITUP-1", hrs: 12, s: "done" },
        { op: "Final assembly",                 wc: "ASM-1",   hrs: 8,  s: "done" },
        { op: "Leak & performance test",        wc: "TEST-1",  hrs: 6,  s: "wip", note: "Third leak — rework" },
      ],
      stoppages: [ { reason: "Repeat seal leak — line held", mins: 480, when: "28-08-26 16:40" } ],
      rejections: [ { qty: 1, reason: "Mechanical seal — repeat leak, scrapped", when: "28-08-26" } ] },
  ],
  "20422": [
    { mo: "MO-20422-2", soLine: "020422-2-1", item: "LVSC-900", kind: "fg", qty: 1, needDate: "20-08-2026",
      direction: "backward", schedStart: "05-08-2026", schedEnd: "24-08-2026", frozen: true,
      status: "started", startAt: "05-08-26 08:30", stopAt: null, waitingFor: "material:Motor 7.5 kW (customer)", closurePosted: false,
      route: [
        { op: "Impeller balancing",   wc: "BAL-1",   hrs: 6, s: "done" },
        { op: "Casing fit-up & paint",wc: "PAINT-1", hrs: 8, s: "done" },
        { op: "Final assembly",       wc: "ASM-1",   hrs: 6, s: "waiting", note: "Customer motor not received" },
        { op: "Testing",              wc: "TEST-1",  hrs: 3, s: "queued" },
      ], stoppages: [], rejections: [] },
  ],
  "19415": [
    { mo: "MO-19415-1", soLine: "019415-2-1", item: "Silencer (×8)", kind: "fg", qty: 8, needDate: "20-08-2026",
      direction: "backward", schedStart: "20-07-2026", schedEnd: "25-08-2026", frozen: true,
      status: "stopped", startAt: "20-07-26 08:00", stopAt: "24-08-26 16:00", waitingFor: null, closurePosted: true,
      route: [
        { op: "Plate cutting",    wc: "ROLL-1", hrs: 16, s: "done" },
        { op: "Fabrication",      wc: "WELD-2", hrs: 40, s: "done" },
        { op: "Paint",            wc: "PAINT-1",hrs: 12, s: "done" },
        { op: "Packing & crating",wc: "PACK-1", hrs: 8,  s: "done" },
      ], stoppages: [], rejections: [] },
  ],
  "20736": [
    { mo: "MO-20736-1", soLine: "020736-1-1", item: "RBI490-619", kind: "fg", qty: 1, needDate: "20-08-2026",
      direction: "backward", schedStart: "04-08-2026", schedEnd: "20-08-2026", frozen: true,
      status: "stopped", startAt: "04-08-26 08:00", stopAt: "02-09-26 11:30", waitingFor: null, closurePosted: "pending",
      route: [
        { op: "Parts machining", wc: "HMC-1",  hrs: 5, s: "done" },
        { op: "Final assembly",  wc: "ASM-1",  hrs: 5, s: "done" },
        { op: "Testing",         wc: "TEST-1", hrs: 3, s: "done" },
        { op: "Packing",         wc: "PACK-1", hrs: 3, s: "done" },
      ], stoppages: [], rejections: [] },
  ],
  "20790": [
    { mo: "MO-20790-1", soLine: "020790-1-1", item: "WP-1600 engineered fan", kind: "fg", qty: 1, needDate: "20-11-2026",
      direction: "backward", schedStart: "15-07-2026", schedEnd: "18-11-2026", frozen: true,
      status: "started", startAt: "15-07-26 08:00", stopAt: null, waitingFor: null, closurePosted: false,
      route: [
        { op: "Material cutting",                wc: "ROLL-1",  hrs: 8,  s: "done" },
        { op: "Flange machining",                wc: "HMC-1",   hrs: 16, s: "done" },
        { op: "Casing rolling & long-seam weld", wc: "WELD-1",  hrs: 40, s: "done" },
        { op: "Radiography test",                wc: "TEST-1",  hrs: 6,  s: "hold-waiting", hold: true, note: "Contractual hold — customer inspector 12-09" },
        { op: "Galvanising",                     wc: "SC-GALV", hrs: 0,  subcontract: true, leadDays: 7, s: "queued" },
        { op: "Casing fit-up & welding",         wc: "FITUP-1", hrs: 24, s: "queued" },
        { op: "Dye penetrant test",              wc: "TEST-1",  hrs: 4,  hold: true, s: "queued" },
        { op: "Final assembly",                  wc: "ASM-1",   hrs: 20, s: "queued", note: "Starts on 160 kW motor receipt (due 10-10)" },
        { op: "Testing & balancing",             wc: "BAL-1",   hrs: 12, s: "queued" },
        { op: "Paint & pack",                    wc: "PACK-1",  hrs: 8,  s: "queued" },
      ], stoppages: [], rejections: [] },
  ],
  "15288": [
    { mo: "MO-15288-1", soLine: "015288-1-1", item: "NAF/1120-35012 (E-Block ×7)", kind: "fg", qty: 7, needDate: "22-08-2026",
      direction: "backward", schedStart: null, schedEnd: null, frozen: false,
      status: "unscheduled", startAt: null, stopAt: null, waitingFor: "route", closurePosted: false,
      route: [
        { op: "Parts machining",    wc: "HMC-1",  hrs: 30, s: "not-started" },
        { op: "Casing fabrication", wc: "WELD-2", hrs: 60, s: "not-started" },
        { op: "Final assembly",     wc: "ASM-1",  hrs: 40, s: "not-started", note: "6 of 7 motors received 15-06; order stalled, route not re-entered" },
      ], stoppages: [], rejections: [] },
  ],
  /* 20262 (service), 19449 (bought-out spare), 18902 (cancelled):
     no manufacturing order — not scheduled or tracked here. */
};

/* The agreed SAP Business One interfaces (§16.1). dir: from | to | both.
   st: ok | retry | fail — the live state of each connection. */
const INTERFACES = [
  { n: "Operations, resources & resource groups", dir: "from", st: "ok",    passes: "Operations, work groups and work centres used for scheduling and capacity planning." },
  { n: "Factory shift hours & calendar",          dir: "both", st: "ok",    passes: "Base shift calendar per work centre; overtime / extra-shift changes made here and sent back." },
  { n: "Item master & lead times",                dir: "from", st: "ok",    passes: "Item codes, project-specific / stock flag, and the purchase lead time per item code." },
  { n: "Manufacturing orders vs open sales orders",dir: "from", st: "ok",   passes: "Open MOs read for scheduling and for visibility under each sales-order line." },
  { n: "Bill of material & route",                dir: "from", st: "ok",    passes: "The BOM and route against each MO, used for scheduling." },
  { n: "Inventory on hand",                       dir: "from", st: "ok",    passes: "Stock used to check material availability for the start of each order." },
  { n: "Open purchase orders",                    dir: "from", st: "ok",    passes: "Open orders and the lead time per item code; dates bought-out material." },
  { n: "Manufacturing order closure",             dir: "to",   st: "retry", passes: "START/STOP closure; SAP closes the MO and issues material by backflush." },
];

/* One audit trail of every interface message: numbered, idempotent,
   retried on failure, searchable by document / order / user / time
   (§16.1, §7.2). st: posted | retry | fail. */
const AUDIT = [
  { id: "MSG-20481", dir: "to",   doc: "MO closure",           order: "20736", ref: "MO-20736-1", st: "retry",  tries: 2, when: "02-09-26 11:31", note: "Closure not yet acknowledged by SAP B1 — retrying" },
  { id: "MSG-20480", dir: "to",   doc: "MO closure",           order: "19415", ref: "MO-19415-1", st: "posted", tries: 1, when: "24-08-26 16:02", note: "Manufacturing order closed; material issued by backflush" },
  { id: "MSG-20479", dir: "both", doc: "Calendar change",      order: "—",     ref: "WELD-1",     st: "posted", tries: 1, when: "08-09-26 09:05", note: "Extra shift 08–13 Sep sent back to SAP B1" },
  { id: "MSG-20478", dir: "from", doc: "BOM & route",          order: "20790", ref: "MO-20790-1", st: "posted", tries: 1, when: "08-09-26 06:00", note: "Nightly read — routes refreshed" },
  { id: "MSG-20477", dir: "from", doc: "Open purchase orders", order: "19962", ref: "Motor 15 kW",st: "posted", tries: 1, when: "08-09-26 06:00", note: "Still open, due 25-08 — overdue" },
];

/* ============================================================
   V6 completeness — everything else the Functional Flow names
   ============================================================ */

/* Notifications (§15). NOTIF_RULES = the configured triggers per role;
   NOTIFICATIONS = the live instances, filtered by role. Thresholds that
   fire them are set by Nadi Airtechnics (§15, §17.15). */
const NOTIF_RULES = {
  planning:   ["Work centre overloaded", "Schedule slipping against the committed date", "Closure delayed", "Bought-out item or subcontract part late", "SAP Business One data not current"],
  supervisor: ["Manufacturing order scheduled or re-scheduled for the section", "Start or stop overdue against the schedule", "Downtime beyond the threshold"],
  projects:   ["Delivery date at risk", "Order put on hold", "Revised delivery date recorded"],
  management: ["Orders behind the schedule", "Delivery date at risk", "Overloaded work centres", "Interface failure that does not clear"],
  admin:      ["Interface failure that does not clear", "SAP Business One data not current"],
};
const NOTIFICATIONS = [
  { id: "N1", roles: ["planning", "management"], level: "risk", title: "Work centre overloaded — Casing fit-up", sub: "FITUP-1 at 183% this week; 5 jobs share the 30-07 need date.", when: "08-09 · 08:05", oa: null },
  { id: "N2", roles: ["planning", "projects", "management"], level: "risk", title: "Schedule slipping against the committed date", sub: "OA 19962 — 15 kW motor 14 days overdue; committed date moved to 08-09.", when: "08-09 · 09:20", oa: "19962" },
  { id: "N3", roles: ["planning", "management"], level: "warn", title: "Closure delayed", sub: "OA 20736 stopped 02-09 but the closure has not posted to SAP B1.", when: "02-09 · 11:31", oa: "20736" },
  { id: "N4", roles: ["planning"], level: "warn", title: "Bought-out part late", sub: "OA 20422 — customer motor 13 days past the open-PO due date.", when: "08-09 · 09:00", oa: "20422" },
  { id: "N5", roles: ["supervisor"], level: "warn", title: "Stop overdue against the schedule", sub: "MO-19962-3 should have stopped by 28-07; still running (held on motor).", when: "08-09 · 07:30", oa: "19962" },
  { id: "N6", roles: ["supervisor"], level: "info", title: "Manufacturing order re-scheduled for your section", sub: "MO-20790-1 fit-up moved after the 12-09 radiography hold.", when: "06-09 · 16:10", oa: "20790" },
  { id: "N7", roles: ["projects"], level: "warn", title: "Order put on hold", sub: "OA 15288 marked on hold — awaiting a commercial decision.", when: "01-09 · 10:00", oa: "15288" },
  { id: "N8", roles: ["projects", "planning"], level: "info", title: "Revised delivery date recorded", sub: "OA 18616 committed date moved to 07-09 (third rework).", when: "28-08 · 17:30", oa: "18616" },
  { id: "N9", roles: ["management", "admin"], level: "risk", title: "Interface failure not clearing", sub: "MO closure to SAP B1 has retried twice (MSG-20481).", when: "02-09 · 11:31", oa: "20736" },
];

/* Thresholds that trigger notifications & exceptions — set by Nadi
   Airtechnics; some still to be confirmed (§15, §17.15). */
const THRESHOLDS = [
  { k: "Work-centre overload", v: "Load > 100% of available hours", src: "Nadi Airtechnics", tbc: false },
  { k: "Schedule slip", v: "Scheduled end later than the committed date", src: "Nadi Airtechnics", tbc: false },
  { k: "Closure overdue", v: "No STOP within 1 day of the scheduled end", src: "Nadi Airtechnics", tbc: true },
  { k: "Bought-out late", v: "Past the item lead time / open-PO due date", src: "Nadi Airtechnics", tbc: false },
  { k: "Machine downtime", v: "Downtime beyond threshold hours/day", src: "Nadi Airtechnics", tbc: true },
  { k: "SAP data not current", v: "Last successful read older than 1 day", src: "Nadi Airtechnics", tbc: true },
];

/* Users & roles (§6). Counts are tentative and subject to change. */
const USERS = [
  { name: "A. Nair", role: "planning", active: true },
  { name: "V. Kamat", role: "planning", active: true },
  { name: "D. Shirke", role: "supervisor", active: true },
  { name: "P. Jadhav", role: "supervisor", active: true },
  { name: "R. Mehta", role: "projects", active: true },
  { name: "P. Joshi", role: "management", active: true },
  { name: "S. Rao", role: "admin", active: true },
];
const USER_COUNTS = [
  { role: "Planning", planned: "5", note: "tentative" },
  { role: "Production supervisor", planned: "10–12", note: "tentative" },
  { role: "Management & dashboard viewers", planned: "≥10", note: "tentative" },
  { role: "Projects", planned: "as required", note: "" },
  { role: "System administrator", planned: "1+", note: "" },
];

/* Who owns which record — the binding SAP-vs-platform position (§5.3). */
const OWNERSHIP = [
  { rec: "Operations, resources, resource groups & shift calendar", sys: "SAP Business One", note: "Read; overtime / extra-shift changes made in the platform and sent back" },
  { rec: "Bill of material & route per manufacturing order", sys: "SAP Business One", note: "Read for scheduling; Planning updates on change, planner re-schedules" },
  { rec: "Inventory on hand & open purchase orders", sys: "SAP Business One", note: "Read to check material availability" },
  { rec: "Schedule, frozen schedule & load vs capacity", sys: "Platform", note: "Calculated and held here" },
  { rec: "Item master & lead times", sys: "SAP Business One", note: "Project-specific / stock flag and purchase lead time" },
  { rec: "Manufacturing order", sys: "SAP Business One", note: "Read; closure sent back on STOP" },
  { rec: "START, STOP, line stoppages & rejections", sys: "Platform", note: "Captured against the MO by the supervisor" },
  { rec: "Stock, stock value & ledgers", sys: "SAP Business One", note: "System of record for everything carrying a value" },
];

/* Points to confirm (§17). */
const TOCONFIRM = [
  { g: "Scheduling & capacity", q: "Who at Nadi Airtechnics owns the schedule and approves this flow?" },
  { g: "Scheduling & capacity", q: "Which roles may firm a schedule and which may unfreeze it?" },
  { g: "Scheduling & capacity", q: "Forward or backward scheduling: per order, per work-centre group, or one factory rule?" },
  { g: "Scheduling & capacity", q: "Where is a subcontract process lead time held, and who keeps it current?" },
  { g: "Scheduling & capacity", q: "How many work centres, groups and open MOs today, and expected growth?" },
  { g: "Scheduling & capacity", q: "Where are planned maintenance and downtime held, and how do they reduce capacity?" },
  { g: "Shop floor & dashboards", q: "Where are line stoppages and rejections recorded today, and by whom?" },
  { g: "Shop floor & dashboards", q: "Does each planner see all orders, or only their own section?" },
  { g: "Shop floor & dashboards", q: "Who sees which dashboard, and how often should they refresh?" },
  { g: "Shop floor & dashboards", q: "Which reports export to Excel, and in what layout?" },
  { g: "Shop floor & dashboards", q: "Is mobile access wanted for Planning and the production supervisors?" },
  { g: "Shop floor & dashboards", q: "Full meaning of the status codes RE, FQC, PD, FCP, ASS, ASS/B, ASS/CM, B, CI, DI, FAB, FCP/CM, PRE-MAN, TE?" },
  { g: "Systems & data", q: "Which SAP B1 version and database, and how should the closure be sent back?" },
  { g: "Systems & data", q: "What are the shop-floor sections, stations, shifts and network coverage?" },
  { g: "Process details", q: "What thresholds trigger notifications and exceptions?" },
  { g: "Baselines", q: "What is delivery performance against committed dates today?" },
];

/* Mobile access (§16.2) — whether it is wanted is to be confirmed. */
const MOBILE = [
  { role: "Planning", items: "See order & production progress and the schedule; see overloaded work centres; act on exceptions." },
  { role: "Production supervisor", items: "Open the sales-order line and its MOs; START / STOP (closure to SAP B1); record stoppages & rejections." },
  { role: "Management", items: "Dashboards, exception feed, order status and delivery risk." },
];

/* Revised-delivery-date history (§13): original committed date + each
   revision, with the reason and the author kept. Keyed by OA. */
const REVISIONS = {
  "19962": [
    { date: "25-08-2026", kind: "Committed", by: "Planning — A. Nair", reason: "Committed date from the firmed schedule" },
    { date: "08-09-2026", kind: "Revised",   by: "Planning — A. Nair", reason: "15 kW motor not received — two weeks lost on Crompton" },
  ],
  "18616": [
    { date: "26-08-2026", kind: "Committed", by: "Planning — A. Nair", reason: "Committed date from the firmed schedule" },
    { date: "02-09-2026", kind: "Revised",   by: "Projects — R. Mehta", reason: "First leak at customer inspection; reseal" },
    { date: "07-09-2026", kind: "Revised",   by: "Projects — R. Mehta", reason: "Third leak after reassembly — needs a decision, not another rebuild" },
  ],
  "20422": [
    { date: "26-08-2026", kind: "Committed", by: "Planning — A. Nair", reason: "Committed date from the firmed schedule" },
    { date: "08-09-2026", kind: "Revised",   by: "Projects — R. Mehta", reason: "Customer-scope motor not received — delay recorded as the customer's" },
  ],
  "15288": [
    { date: "20-08-2026", kind: "Committed", by: "Planning — A. Nair", reason: "Committed date from the firmed schedule" },
    { date: "02-09-2026", kind: "Revised",   by: "Management — P. Joshi", reason: "Order stalled; held pending a commercial decision" },
  ],
};

/* Planned maintenance & downtime that reduce a work centre's available
   hours (§10.1.4). kind: maintenance | downtime (downtime also feeds OEE). */
const MAINTENANCE = [
  { wc: "HMC-1",  kind: "maintenance", from: "10-09-2026", to: "10-09-2026", hrsPerDay: 2, note: "Preventive — spindle service" },
  { wc: "ROLL-1", kind: "downtime",    from: "08-09-2026", to: "09-09-2026", hrsPerDay: 8, note: "Breakdown — hydraulic repair (logged for OEE)" },
];

/* Exception tables, per area, from the role flows (§9, §10, §11). Shown
   as the "handled here" reference beside each pillar. */
const EXCEPTIONS = {
  schedule: [
    { s: "Bill of material not released or route not entered", h: "Order left unscheduled, listed as waiting", to: "Planning" },
    { s: "Calculated end date misses the delivery requirement", h: "Re-schedule to another WC / time slot, or Projects reviews the committed date", to: "Planning, Projects" },
    { s: "Bought-out item late against the open purchase order", h: "Start follows receipt; the delay shows against the schedule", to: "Planning" },
    { s: "No shift calendar linked to a work centre", h: "Work centre cannot be scheduled; listed for Planning to correct", to: "Planning" },
    { s: "Equal need-date jobs need the same work centre", h: "Platform flags the clash; the planner sequences it", to: "Planning" },
    { s: "BOM or route changes while the MO is in progress", h: "Planning updates the MO BOM/route; the planner re-schedules", to: "Planning" },
    { s: "Subcontract lead time changes or the part is late", h: "The next consuming process moves; the delay shows", to: "Planning" },
    { s: "SAP Business One data cannot be read", h: "Last read used and flagged not current; re-run on reconnect", to: "Planning, Management" },
  ],
  capacity: [
    { s: "Hours required on a work centre exceed hours available", h: "Work centre highlighted; overtime / extra shift, or re-schedule", to: "Planning" },
    { s: "Overtime or an additional shift is not agreed", h: "Re-schedule to another WC / time slot, or Projects reviews the committed date", to: "Planning, Projects" },
    { s: "No shift calendar linked to a work centre", h: "Work centre cannot be loaded; listed for Planning", to: "Planning" },
  ],
  shopfloor: [
    { s: "Closure of the MO or operation not posted in time", h: "Delay shown against the schedule; the frozen schedule is not changed", to: "Production, Planning" },
    { s: "Closure does not post to SAP Business One", h: "Held and re-sent; the MO stays open in SAP until it posts", to: "Production, Management" },
    { s: "A closed MO needs correction", h: "Not reopened here; the correction is made in SAP Business One", to: "Production, Planning" },
  ],
};

/* BOM/route changes in progress — Planning updates, planner re-schedules (§9.1.8). */
const BOM_CHANGES = [
  { oa: "20790", mo: "MO-20790-1", what: "Route change — dye-penetrant test added after fit-up", by: "Planning — A. Nair", when: "06-09-2026" },
];

/* The order process at a glance — the five stages the platform follows (§8). */
const ORDER_STAGES = [
  { n: "Manufacturing scheduling", what: "All open MOs scheduled on finite capacity from SAP B1, then firmed and frozen.", who: "Planning" },
  { n: "Capacity planning", what: "Load set against available capacity by day, week and month; overloaded centres highlighted.", who: "Planning" },
  { n: "Shop-floor tracking", what: "MOs shown under each sales-order line; supervisors START/STOP; closure goes to SAP B1.", who: "Production, SAP B1" },
  { n: "Committed date & order visibility", what: "Planning commits the delivery date; Projects records holds, comments and revised dates.", who: "Planning, Projects" },
  { n: "Dashboards", what: "On-time delivery, job status, machine utilisation, OEE and capacity against load.", who: "Management, Planning, Projects" },
];

/* How the platform is put together — the six layers (§5.2). */
const LAYERS = [
  { n: "Scheduling", what: "Schedules open MOs on finite capacity; load vs resources; overloaded centres; holds the frozen schedule; overtime & extra shifts." },
  { n: "Integration", what: "Connects SAP B1 and the platform. Every message held, numbered, retried and written to one audit trail." },
  { n: "Master data", what: "Links and validation rules so incomplete or duplicate order / material / production data does not enter the process." },
  { n: "Process", what: "Runs scheduling, capacity and START/STOP: planning actions, MO status, exceptions and holds." },
  { n: "Reporting", what: "Keeps data ready for schedule, capacity, delivery performance, utilisation, OEE and job status." },
  { n: "Screens", what: "Planning, Production, Projects and Management screens, with mobile access where wanted." },
];

/* Assumptions to confirm before development (§2). */
const ASSUMPTIONS = [
  "Work groups, work centres and the shift calendar are set up in SAP B1 and linked to each other.",
  "The BOM is released by Engineering and the route entered by Planning in SAP B1 before scheduling.",
  "Sales orders are booked in SAP B1 on PO receipt and released for manufacturing once the GAD is approved and points cleared.",
  "The platform schedules on finite capacity using SAP B1 resources & calendars; one job per work centre; set-up time in the route hours.",
  "For a purchased item the item-code lead time is used first; where none is set, the open-PO due date.",
  "Shop-floor entries are made at supervisor level; staff below update the supervisor and do not use the platform.",
  "No data is taken from or uploaded to Excel; Excel is used only as an export format.",
  "SAP B1 goes live for the full order-to-cash cycle on 1 April 2027.",
  "Overtime and extra-shift calendar changes are made in the platform and sent back to SAP B1.",
  "START and STOP are at MO level; a closed MO is not reopened here; corrections are made in SAP B1.",
  "Subcontracted jobs are part of the schedule.",
  "Jobs with the same need date carry equal priority; the platform flags the clash and the planner sequences (proposed).",
  "Line stoppages and rejections count in machine utilisation and OEE; their source is to be confirmed.",
  "Use is planned for 5 planners, 10–12 supervisors and ≥10 dashboard viewers (tentative).",
  "The Pending Order Excel is the Projects department's property and stays in use until its users accept the platform.",
  "SAP B1 remains the system of record for all masters and all valued transactions.",
  "The interfaces required from SAP B1 are made available and agreed before development.",
  "Production information required for manufacturing is available in SAP B1 or via the agreed process.",
  "A single owner is named inside Nadi Airtechnics with authority across the departments.",
  "Planners and supervisors schedule, start and stop MOs as described; otherwise the dashboards are incomplete.",
  "The shop floor uses shared devices with fast switching between users.",
];

/* The five roles the Functional Flow defines (§6). Sales, design,
   purchase, stores, quality, service and dispatch are out of scope —
   their data lives in SAP B1 and the other systems (§3). */
const ROLES = {
  planning:   { label: "Planning", person: "A. Nair", nav: ["today", "schedule", "capacity", "stands", "dashboards", "notifications", "orders"] },
  supervisor: { label: "Production supervisor", person: "D. Shirke", nav: ["today", "shopfloor", "stands", "notifications", "orders"] },
  projects:   { label: "Projects", person: "R. Mehta", nav: ["today", "stands", "dashboards", "notifications", "orders"] },
  management: { label: "Management & dashboards", person: "P. Joshi", nav: ["today", "dashboards", "capacity", "stands", "notifications", "orders"] },
  admin:      { label: "System administrator", person: "S. Rao", nav: ["integration", "admin", "notifications", "today"] },
};

const NAV = {
  today: "Today", schedule: "Schedule", capacity: "Capacity", shopfloor: "Shop floor",
  stands: "Where orders stand", dashboards: "Dashboards", notifications: "Notifications",
  integration: "Integration & audit", admin: "Administration", orders: "Orders",
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

/* v3 revenue plan removed — the platform holds no money figures;
   everything that carries a value stays in SAP Business One (§5.3). */

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

/* Display labels for departments that comment historically but are not
   platform roles in the V6 scope (their work lives in SAP B1 / others). */
const HIST_ROLE = { sales: "Sales", design: "Design", purchase: "Purchase", stores: "Stores", quality: "Quality", dispatch: "Dispatch", operator: "Operator", service: "Service" };
function roleLabel(r) { return (ROLES[r] && ROLES[r].label) || HIST_ROLE[r] || r; }
function roleAvatar(r) { return ROLES[r] ? initials(ROLES[r].person) : roleLabel(r).slice(0, 2).toUpperCase(); }

/* Order rail — the Projects model from the Functional Flow (§13):
   holds, the committed-vs-promised dates, and threaded comments.
   No silent handoffs; everything stays on the order, not a spreadsheet. */
function Discussion({ order, role, disc, onPost }) {
  const [text, setText] = useState("");
  const comments = disc?.comments || [];
  const moved = order.revised && order.revised !== order.promise && order.revised !== "—";

  const submit = () => {
    if (!text.trim()) return;
    onPost(order.oa, { role, text: text.trim(), when: "Just now" });
    setText("");
  };

  return (
    <>
      <div className="rail-card">
        <div className="rail-head">
          <span className="rail-title">Holds &amp; dates</span>
          <span className="tiny muted">Projects</span>
        </div>
        <div style={{ padding: "6px 14px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
            <span className="muted tiny">Current state</span><State level={order.state} text={order.stateNote} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
            <span className="muted tiny">Promised</span><span className="mono tiny">{order.promise}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
            <span className="muted tiny">Committed</span>
            <span className="mono tiny" style={{ color: moved ? "var(--warn)" : "inherit" }}>{order.revised}{moved ? " · revised" : ""}</span>
          </div>
          {REVISIONS[order.oa] && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--line)" }}>
              <div className="tiny muted" style={{ marginBottom: 4 }}>Delivery-date history (original + revisions kept)</div>
              {REVISIONS[order.oa].map((rv, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "3px 0" }}>
                  <span className="mono tiny" style={{ color: rv.kind === "Revised" ? "var(--warn)" : "inherit", whiteSpace: "nowrap" }}>{rv.date}</span>
                  <div className="tiny muted" style={{ flex: 1 }}>{rv.kind} · {rv.reason} <span style={{ opacity: 0.8 }}>— {rv.by}</span></div>
                </div>
              ))}
            </div>
          )}
          {(order.exceptions || []).length === 0
            ? <div className="tiny muted" style={{ paddingTop: 6 }}>No holds recorded.</div>
            : (order.exceptions || []).map((e, i) => (
              <div className="cmt" key={i} style={{ marginTop: 8 }}>
                <div className="cmt-body">
                  <div className="cmt-top"><span className="cmt-role">{e.t}</span><span className="cmt-when">{e.due}</span></div>
                  <div className="cmt-text">{e.sub} <span className="tiny muted">— {e.owner}</span></div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="rail-card">
        <div className="rail-head">
          <span className="rail-title">Comments</span>
          <span className="tiny muted">{comments.length}</span>
        </div>
        <div className="thread">
          {comments.length === 0
            ? <div className="cmt-empty">No comments yet on this order.</div>
            : comments.map((c) => (
              <div className="cmt" key={c.id}>
                <span className="cmt-av">{roleAvatar(c.role)}</span>
                <div className="cmt-body">
                  <div className="cmt-top">
                    <span className="cmt-role">{roleLabel(c.role)}</span>
                    <span className="cmt-when">{c.when}</span>
                  </div>
                  <div className="cmt-text">{c.text}</div>
                </div>
              </div>
            ))}
        </div>
        <div className="compose">
          <div className="compose-lbl">Commenting as <b>{roleLabel(role)}</b> · {ROLES[role]?.person}</div>
          <textarea placeholder="Add a comment…" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="compose-foot">
            <span className="tiny soft">No silent handoffs — comments stay on the order</span>
            <button className="btn sm" onClick={submit} disabled={!text.trim()}>Post</button>
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
  const load = wcLoad();
  const overloaded = WORKCENTRES.filter((w) => !w.subcontract && (load[w.id] || 0) > wcAvailable(w, "week"));
  const unposted = allMOs().filter((m) => m.closurePosted === "pending");
  const unscheduled = allMOs().filter((m) => m.status === "unscheduled");
  const withStoppage = allMOs().filter((m) => (m.stoppages && m.stoppages.length) || (m.rejections && m.rejections.length));
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
          <div className="card">
            <div className="card-head"><span className="card-title">Operational signals</span><span className="tiny muted">From the schedule, capacity &amp; closures</span></div>
            <div className="sub">
              <State level={overloaded.length ? "warn" : "on-track"} text={`${overloaded.length} overloaded`} />
              <div style={{ flex: 1 }} className="tiny muted">Work centres over capacity this week{overloaded.length ? ": " + overloaded.map((w) => w.id).join(", ") : ""}</div>
            </div>
            {unposted.map((m) => (
              <div className="sub click" key={m.mo} onClick={() => open(m.order.oa)}>
                <State level="warn" text="Closure not posted" />
                <div style={{ flex: 1 }} className="tiny muted"><span className="mono">OA {m.order.oa}</span> · {m.mo} stopped, closure retrying to SAP B1</div>
              </div>
            ))}
            {unscheduled.map((m) => (
              <div className="sub click" key={m.mo} onClick={() => open(m.order.oa)}>
                <State level="warn" text="Unscheduled" />
                <div style={{ flex: 1 }} className="tiny muted"><span className="mono">OA {m.order.oa}</span> · waiting for the {m.waitingFor === "route" ? "route" : "bill of material"}</div>
              </div>
            ))}
            {withStoppage.map((m) => (
              <div className="sub click" key={m.mo + "-stp"} onClick={() => open(m.order.oa)}>
                <State level="warn" text="Stoppage / rejection" />
                <div style={{ flex: 1 }} className="tiny muted"><span className="mono">OA {m.order.oa}</span> · {m.mo} logged {m.stoppages.length ? `${m.stoppages.length} stoppage` : ""}{m.stoppages.length && m.rejections.length ? ", " : ""}{m.rejections.length ? `${m.rejections.length} rejection` : ""}</div>
              </div>
            ))}
          </div>
          <div className="note">
            One connected history per order. The schedule, capacity and shop-floor closure all read the same SAP Business One record — nothing is tracked in a second list.
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

/* ------------------------------------------------------------
   Shell
   ------------------------------------------------------------ */
/* ============================================================
   V6 pillar views — Schedule (§9), Capacity (§10), Shop floor (§11)
   ============================================================ */
const WC = Object.fromEntries(WORKCENTRES.map((w) => [w.id, w]));
const WG = Object.fromEntries(WORKGROUPS.map((g) => [g.id, g]));
const WORKDAYS = { day: 1, week: 6, month: 26 };

/* Every MO flattened with its parent order. */
function allMOs() {
  const out = [];
  for (const o of ORDERS) for (const m of (MOS[o.oa] || [])) out.push({ ...m, order: o });
  return out;
}
/* Daily in-house hours of a work centre (subcontract has none). */
function wcDailyHours(w) {
  if (w.subcontract) return null;
  return (w.shiftHrs || 0) * (w.shifts || 1) - (w.downtime || 0);
}
/* Planned maintenance / downtime hours that reduce a WC this period (§10.1.4). */
function wcMaintenance(wcId, period) {
  return MAINTENANCE.filter((m) => m.wc === wcId).reduce((s, m) => s + (m.hrsPerDay || 0), 0) * WORKDAYS[period];
}
/* Available hours for a period: base calendar + overtime / extra shift,
   less planned maintenance and downtime (§10.1.1, §10.1.4). */
function wcAvailable(w, period) {
  const base = (wcDailyHours(w) || 0) * WORKDAYS[period];
  const ot = CAL_ADJUST.filter((a) => a.wc === w.id).reduce((s, a) => s + (a.addHrsPerDay || 0), 0) * WORKDAYS[period];
  return Math.max(0, base + ot - wcMaintenance(w.id, period));
}
/* Load = sum of route operation hours on each work centre, across every
   scheduled MO. Subcontract ops are dated by lead time, not WC hours (§10.1.2). */
function wcLoad() {
  const load = {};
  for (const w of WORKCENTRES) load[w.id] = 0;
  for (const m of allMOs()) {
    if (m.status === "unscheduled") continue;
    for (const op of m.route) {
      if (op.subcontract) continue;
      load[op.wc] = (load[op.wc] || 0) + (op.hrs || 0);
    }
  }
  return load;
}
/* Equal need-date jobs queued on one work centre — the clash the planner
   sequences (§9.1.3, proposed assumption). */
function wcClashes() {
  const seen = {};
  for (const m of allMOs()) {
    if (m.status === "unscheduled") continue;
    const wcs = new Set(m.route.filter((op) => !op.subcontract).map((op) => op.wc));
    for (const wc of wcs) { const k = wc + "|" + m.needDate; (seen[k] = seen[k] || []).push(m); }
  }
  return Object.entries(seen).filter(([, a]) => a.length > 1)
    .map(([k, a]) => { const [wc, need] = k.split("|"); return { wc, need, mos: a }; });
}
/* Material-available date for a bought-out item: lead time first, else open-PO due (§9.1.5). */
function materialDate(bo) {
  if (bo.received) return { d: bo.received, basis: "received" };
  if (bo.leadDays != null) return { d: bo.poDue, basis: bo.leadDays + "-day item lead time" };
  return { d: bo.poDue, basis: "open-PO due date" };
}
function moPill(status) {
  const m = MO_STATE[status] || MO_STATE.scheduled;
  return <State level={m.cls} text={m.label} />;
}
function routeProgress(route) {
  const done = route.filter((op) => op.s === "done").length;
  return `${done}/${route.length} ops`;
}

/* Exception table for a pillar (§9 / §10 / §11), rendered as reference. */
function ExceptionsCard({ area, title, cite }) {
  const rows = EXCEPTIONS[area] || [];
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-head"><span className="card-title">{title}</span><span className="tiny muted">{cite}</span></div>
      <table className="tbl">
        <thead><tr><th>Situation</th><th>How it is handled</th><th>Referred to</th></tr></thead>
        <tbody>
          {rows.map((e, i) => (
            <tr key={i}><td>{e.s}</td><td className="tiny muted">{e.h}</td><td className="tiny muted">{e.to}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---- Schedule (§9) ---- */
function Schedule({ open, toast }) {
  const [dir, setDir] = useState("backward");
  const [frozen, setFrozen] = useState(() =>
    Object.fromEntries(allMOs().map((m) => [m.mo, m.frozen])));
  const [published, setPublished] = useState({});
  const [moved, setMoved] = useState({});
  const mos = allMOs();
  const scheduled = mos.filter((m) => m.status !== "unscheduled");
  const waiting = mos.filter((m) => m.status === "unscheduled" || m.waitingFor === "route" || m.waitingFor === "BOM");
  const onMaterial = mos.filter((m) => (m.waitingFor || "").startsWith("material:"));
  const clashes = wcClashes();
  const frozenCount = Object.values(frozen).filter(Boolean).length;

  const publish = (oa, d) => { setPublished((p) => ({ ...p, [oa]: d })); toast(`Committed date ${d} published to Projects & Management (OA ${oa})`); };
  const moveMo = (m, wc) => { setMoved((x) => ({ ...x, [m.mo]: wc })); toast(`${m.mo} moved to ${WC[wc] ? WC[wc].name : wc} — schedule recalculated`); };

  const toggleFreeze = (m) => {
    setFrozen((f) => ({ ...f, [m.mo]: !f[m.mo] }));
    toast(frozen[m.mo] ? `${m.mo} unfrozen — planner can re-schedule` : `${m.mo} firmed and frozen`);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Schedule</h1>
          <div className="subtitle">Every open manufacturing order on finite capacity, from SAP Business One. The planner firms it; then it is frozen.</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span className="tiny muted">Direction</span>
          <button className={`chip ${dir === "forward" ? "on" : ""}`} onClick={() => setDir("forward")}>Forward from today</button>
          <button className={`chip ${dir === "backward" ? "on" : ""}`} onClick={() => setDir("backward")}>Backward from need date</button>
        </div>
      </div>

      <div className="kpis" style={{ marginBottom: 18 }}>
        <div className="kpi"><div className="kpi-k">Manufacturing orders scheduled</div><div className="kpi-v">{scheduled.length}</div><div className="kpi-s">of {mos.length} open</div></div>
        <div className="kpi"><div className="kpi-k">Frozen</div><div className="kpi-v">{frozenCount}</div><div className="kpi-s">changed only by the planner</div></div>
        <div className="kpi"><div className="kpi-k">Waiting on material</div><div className="kpi-v" style={{ color: "var(--risk)" }}>{onMaterial.length}</div><div className="kpi-s">start follows receipt</div></div>
        <div className="kpi"><div className="kpi-k">Waiting for BOM / route</div><div className="kpi-v" style={{ color: onMaterial.length ? "var(--warn)" : "inherit" }}>{waiting.length}</div><div className="kpi-s">left unscheduled</div></div>
      </div>

      {waiting.length > 0 && (
        <div className="card" style={{ marginBottom: 16, borderColor: "var(--warn-line)" }}>
          <div className="card-head"><span className="card-title">Waiting for the bill of material or the route</span><span className="tiny muted">Not scheduled until released (§9 exc.1)</span></div>
          {waiting.map((m) => (
            <div key={m.mo} className="sub click" onClick={() => open(m.order.oa)}>
              <State level="warn" text="Unscheduled" />
              <div style={{ flex: 1 }}><span className="mono">OA {m.order.oa}</span> · {m.item} <span className="tiny muted">— waiting for {m.waitingFor === "route" ? "the route" : m.waitingFor === "BOM" ? "the bill of material" : "release"}</span></div>
              <span className="mono tiny muted">{m.mo}</span>
            </div>
          ))}
        </div>
      )}

      {clashes.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-head"><span className="card-title">Equal-priority clashes</span><span className="tiny muted">Same need date, same work centre — planner sequences (§9.1.3)</span></div>
          {clashes.map((c) => (
            <div key={c.wc + c.need} className="sub">
              <State level="watch" text="Clash" />
              <div style={{ flex: 1 }}><b>{WC[c.wc] ? WC[c.wc].name : c.wc}</b> — {c.mos.length} jobs all need <span className="mono">{c.need}</span></div>
              <button className="btn sm ghost" onClick={() => toast("Planner sequences the clash — equal priority, client has set no rule")}>Sequence</button>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><span className="card-title">Scheduled manufacturing orders</span><span className="tiny muted">Start on material availability; series / parallel per route &amp; BOM</span></div>
        <table className="tbl">
          <thead><tr><th>OA</th><th>Manufacturing order</th><th>Route</th><th>Scheduled</th><th>Need</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {scheduled.map((m) => (
              <tr key={m.mo}>
                <td className="mono link click" onClick={() => open(m.order.oa)}>{m.order.oa}</td>
                <td><div>{m.item}</div><div className="mono tiny muted">{m.mo} · {m.soLine}</div></td>
                <td className="tiny muted">{routeProgress(m.route)}{m.route.some((op) => op.subcontract) ? " · incl. subcontract" : ""}{m.route.some((op) => op.hold) ? " · hold point" : ""}{moved[m.mo] ? ` · moved → ${WC[moved[m.mo]] ? WC[moved[m.mo]].name : moved[m.mo]}` : ""}</td>
                <td className="mono tiny">{m.schedStart || "—"} → {m.schedEnd || "—"}</td>
                <td className="mono tiny">{m.needDate}</td>
                <td>{m.waitingFor && m.waitingFor.startsWith("material:")
                  ? <State level="blocked" text={"Waiting " + m.waitingFor.slice(9)} />
                  : moPill(m.status)}</td>
                <td>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "flex-end" }}>
                    <select className="role-select" style={{ width: "auto", padding: "4px 6px", fontSize: 12 }}
                      value={moved[m.mo] || ""} onChange={(e) => e.target.value && moveMo(m, e.target.value)} title="Re-schedule to another work centre (§9.1.6)">
                      <option value="">Move…</option>
                      {WORKCENTRES.filter((w) => !w.subcontract).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                    <button className={`chip ${frozen[m.mo] ? "on" : ""}`} onClick={() => toggleFreeze(m)}>
                      {frozen[m.mo] ? "Frozen" : "Freeze"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><span className="card-title">Committed delivery dates</span><span className="tiny muted">Taken from the firmed schedule; feasibility against the need date (§12.1)</span></div>
        <table className="tbl">
          <thead><tr><th>OA</th><th>Need</th><th>Scheduled end</th><th>Feasibility</th><th>Committed</th><th></th></tr></thead>
          <tbody>
            {ORDERS.filter((o) => (MOS[o.oa] || []).length).map((o) => {
              const se = scheduledEndOf(o.oa);
              const need = ((MOS[o.oa] || [])[0] || {}).needDate || o.need;
              const feasible = se && need && need !== "—" ? cmpDate(se, need) <= 0 : null;
              const pub = published[o.oa] || committedOf(o);
              return (
                <tr key={o.oa}>
                  <td className="mono link click" onClick={() => open(o.oa)}>{o.oa}</td>
                  <td className="mono tiny">{need}</td>
                  <td className="mono tiny">{se || "—"}</td>
                  <td>{feasible == null ? <span className="tiny muted">—</span> : feasible ? <State level="on-track" text="Meets need date" /> : <State level="warn" text="Later than need" />}</td>
                  <td className="mono tiny">{pub}{published[o.oa] ? " · published" : ""}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      {feasible === false ? <button className="btn sm ghost" onClick={() => toast(`OA ${o.oa} escalated to Projects & Management — delivery date at risk`)}>Escalate</button> : null}
                      <button className="btn sm" onClick={() => publish(o.oa, se || committedOf(o))}>Publish</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {BOM_CHANGES.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-head"><span className="card-title">Changes in progress</span><span className="tiny muted">BOM / route changed — planner re-schedules (§9.1.8)</span></div>
          {BOM_CHANGES.map((b, i) => (
            <div key={i} className="sub">
              <State level="watch" text="Re-schedule" />
              <div style={{ flex: 1 }}><span className="mono">OA {b.oa}</span> · {b.what}<div className="tiny muted">{b.by} · {b.when}</div></div>
              <button className="btn sm ghost" onClick={() => toast(`${b.mo} re-scheduled after the route change`)}>Re-schedule</button>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="card-head"><span className="card-title">Bought-out material dating</span><span className="tiny muted">Lead time against the item code first; else the open-PO due date (§9.1.5)</span></div>
        <table className="tbl">
          <thead><tr><th>OA</th><th>Item</th><th>Scope</th><th>Basis</th><th>Available from</th></tr></thead>
          <tbody>
            {ORDERS.flatMap((o) => (BOUGHTOUT[o.oa] || []).map((bo) => {
              const md = materialDate(bo);
              const late = !bo.received && bo.poDue && cmpDate(bo.poDue, "08-09-2026") < 0;
              return (
                <tr key={o.oa + bo.item} className="click" onClick={() => open(o.oa)}>
                  <td className="mono link">{o.oa}</td>
                  <td>{bo.item}</td>
                  <td className="tiny muted">{bo.scope}</td>
                  <td className="tiny muted">{md.basis}</td>
                  <td className="mono tiny" style={{ color: late ? "var(--risk)" : "inherit" }}>{md.d}{late ? " · overdue" : ""}</td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>

      <ExceptionsCard area="schedule" title="Exceptions handled on the schedule" cite="§9" />
    </div>
  );
}

/* dd-mm-yyyy compare: <0 if a before b. */
function cmpDate(a, b) {
  const p = (s) => { const [d, m, y] = s.split("-").map(Number); return y * 10000 + m * 100 + d; };
  return p(a) - p(b);
}

/* ---- Capacity (§10) ---- */
function Capacity({ toast }) {
  const [period, setPeriod] = useState("week");
  const load = wcLoad();
  const centres = WORKCENTRES.filter((w) => !w.subcontract);
  const rows = centres.map((w) => {
    const avail = wcAvailable(w, period);
    const l = load[w.id] || 0;
    return { w, avail, load: l, pct: avail ? Math.round((l / avail) * 100) : 0, over: l > avail };
  });
  const overloaded = rows.filter((r) => r.over);
  const totalLoad = rows.reduce((s, r) => s + r.load, 0);
  const totalAvail = rows.reduce((s, r) => s + r.avail, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Capacity</h1>
          <div className="subtitle">The load the schedule creates, set against the hours the work centres have. Overloaded centres are flagged.</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span className="tiny muted">Per</span>
          {["day", "week", "month"].map((p) => (
            <button key={p} className={`chip ${period === p ? "on" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
      </div>

      <div className="kpis" style={{ marginBottom: 18 }}>
        <div className="kpi"><div className="kpi-k">Overloaded work centres</div><div className="kpi-v" style={{ color: overloaded.length ? "var(--risk)" : "var(--ok)" }}>{overloaded.length}</div><div className="kpi-s">this {period}</div></div>
        <div className="kpi"><div className="kpi-k">Load</div><div className="kpi-v">{totalLoad}<span className="tiny muted"> h</span></div><div className="kpi-s">route hours scheduled</div></div>
        <div className="kpi"><div className="kpi-k">Available</div><div className="kpi-v">{totalAvail}<span className="tiny muted"> h</span></div><div className="kpi-s">incl. overtime arranged</div></div>
        <div className="kpi"><div className="kpi-k">Spare</div><div className="kpi-v" style={{ color: totalAvail - totalLoad < 0 ? "var(--risk)" : "inherit" }}>{totalAvail - totalLoad}<span className="tiny muted"> h</span></div><div className="kpi-s">across the factory</div></div>
      </div>

      {WORKGROUPS.filter((g) => g.id !== "SUB").map((g) => {
        const grp = rows.filter((r) => r.w.group === g.id);
        if (!grp.length) return null;
        return (
          <div className="card" key={g.id} style={{ marginBottom: 14 }}>
            <div className="card-head"><span className="card-title">{g.name}</span><span className="tiny muted">{grp.filter((r) => r.over).length} overloaded</span></div>
            <table className="tbl">
              <thead><tr><th>Work centre</th><th>Load</th><th>Available</th><th style={{ width: "32%" }}>Utilisation</th><th></th></tr></thead>
              <tbody>
                {grp.map((r) => {
                  const adj = CAL_ADJUST.find((a) => a.wc === r.w.id);
                  return (
                    <tr key={r.w.id}>
                      <td>{r.w.name}<div className="mono tiny muted">{r.w.id} · {r.w.shifts} shift{r.w.shifts > 1 ? "s" : ""}{adj ? " · +OT" : ""}</div></td>
                      <td className="mono">{r.load} h</td>
                      <td className="mono">{r.avail} h</td>
                      <td>
                        <div className="bar"><i className={r.over ? "red" : ""} style={{ width: `${Math.min(r.pct, 100)}%` }} /></div>
                        <div className="tiny muted" style={{ marginTop: 3, color: r.over ? "var(--risk)" : "inherit" }}>{r.pct}%{r.over ? " — overloaded" : ""}</div>
                      </td>
                      <td>{r.over
                        ? <button className="btn sm ghost" onClick={() => toast(`Resolve ${r.w.name}: overtime, an extra shift, or re-schedule the job`)}>Resolve</button>
                        : <span className="tiny muted">spare {r.avail - r.load} h</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      <div className="card">
        <div className="card-head"><span className="card-title">Overtime &amp; extra shifts</span><span className="tiny muted">Made in the platform, sent back to SAP Business One (§9.1.9)</span></div>
        {CAL_ADJUST.length === 0 ? <div className="kb-empty">None arranged.</div> : CAL_ADJUST.map((a, i) => (
          <div key={i} className="sub">
            <State level="on-track" text={a.kind} />
            <div style={{ flex: 1 }}><b>{WC[a.wc] ? WC[a.wc].name : a.wc}</b> — +{a.addHrsPerDay} h/day, <span className="mono tiny">{a.from} → {a.to}</span><div className="tiny muted">{a.note} · {a.by}</div></div>
          </div>
        ))}
        <div className="card-pad tiny muted">Overtime adds to the available hours below; planned maintenance and downtime reduce them.</div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-head"><span className="card-title">Planned maintenance &amp; downtime</span><span className="tiny muted">Reduces available hours; downtime also feeds OEE (§10.1.4)</span></div>
        {MAINTENANCE.length === 0 ? <div className="kb-empty">None logged.</div> : MAINTENANCE.map((m, i) => (
          <div key={i} className="sub">
            <State level={m.kind === "downtime" ? "warn" : "watch"} text={m.kind === "downtime" ? "Downtime" : "Maintenance"} />
            <div style={{ flex: 1 }}><b>{WC[m.wc] ? WC[m.wc].name : m.wc}</b> — −{m.hrsPerDay} h/day, <span className="mono tiny">{m.from}{m.from !== m.to ? " → " + m.to : ""}</span><div className="tiny muted">{m.note}</div></div>
          </div>
        ))}
        <div className="card-pad tiny muted">Where planned maintenance and downtime are held, and the exact source, is to be confirmed (§10.1.4, §17).</div>
      </div>

      <ExceptionsCard area="capacity" title="Exceptions handled in capacity planning" cite="§10" />
    </div>
  );
}

/* ---- Shop floor (§11) ---- */
function ShopFloor({ open, toast }) {
  const [st, setSt] = useState(() =>
    Object.fromEntries(allMOs().map((m) => [m.mo, {
      status: m.status, startAt: m.startAt, stopAt: m.stopAt, closurePosted: m.closurePosted,
      stoppages: m.stoppages.slice(), rejections: m.rejections.slice(),
    }])));
  const [cap, setCap] = useState({ mo: null, type: null, a: "", b: "" });
  const mos = allMOs().filter((m) => m.status !== "unscheduled");
  const byOrder = {};
  for (const m of mos) (byOrder[m.order.oa] = byOrder[m.order.oa] || []).push(m);

  const now = "08-09-26 ";
  const start = (m) => { setSt((s) => ({ ...s, [m.mo]: { ...s[m.mo], status: "started", startAt: now + "09:00" } })); toast(`${m.mo} started — visible to Planning`); };
  const stop = (m) => { setSt((s) => ({ ...s, [m.mo]: { ...s[m.mo], status: "stopped", stopAt: now + "17:00", closurePosted: "pending" } })); toast(`${m.mo} stopped — closure sent to SAP Business One`); };
  const openCap = (mo, type) => setCap({ mo, type, a: "", b: "" });
  const closeCap = () => setCap({ mo: null, type: null, a: "", b: "" });
  const addCapture = (m) => {
    if (!cap.a.trim()) return;
    if (cap.type === "stoppage") {
      const entry = { reason: cap.a.trim(), mins: Number(cap.b) || 0, when: now + "—" };
      setSt((s) => ({ ...s, [m.mo]: { ...s[m.mo], stoppages: [entry, ...s[m.mo].stoppages] } }));
      toast(`Stoppage recorded on ${m.mo} — held for machine utilisation & OEE`);
    } else {
      const entry = { qty: Number(cap.a) || 1, reason: cap.b.trim(), when: now + "—" };
      setSt((s) => ({ ...s, [m.mo]: { ...s[m.mo], rejections: [entry, ...s[m.mo].rejections] } }));
      toast(`Rejection recorded on ${m.mo} — held for OEE`);
    }
    closeCap();
  };
  const inp = { padding: "5px 8px", border: "1px solid var(--line)", borderRadius: 5, font: "inherit", fontSize: 12, background: "var(--white)", color: "var(--ink)", flex: 1 };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Shop floor</h1>
          <div className="subtitle">Manufacturing orders under each sales-order line. Start and stop at the order; the closure goes to SAP Business One.</div>
        </div>
      </div>

      {Object.entries(byOrder).map(([oa, list]) => {
        const o = list[0].order;
        return (
          <div className="card" key={oa} style={{ marginBottom: 14 }}>
            <div className="card-head">
              <span className="card-title click link" onClick={() => open(oa)}>OA {oa} — {o.customer}</span>
              <span className="tiny muted">{list.length} manufacturing order{list.length > 1 ? "s" : ""}</span>
            </div>
            <table className="tbl">
              <thead><tr><th>Manufacturing order</th><th>Scheduled</th><th>Route</th><th>Status</th><th>Closure</th><th>Action</th></tr></thead>
              <tbody>
                {list.map((m) => {
                  const s = st[m.mo];
                  const cl = CLOSURE_STATE[String(s.closurePosted)] || CLOSURE_STATE["false"];
                  const held = (m.waitingFor || "").startsWith("material:");
                  const capturing = cap.mo === m.mo;
                  return (
                    <React.Fragment key={m.mo}>
                      <tr className={m.route.some((op) => op.hold && op.s !== "done") ? "hold" : ""}>
                        <td><div>{m.item}</div><div className="mono tiny muted">{m.mo}
                          {s.stoppages.length ? <span className="pill warn" style={{ marginLeft: 6 }}><span className="glyph">◆</span>{s.stoppages.length} stoppage</span> : null}
                          {s.rejections.length ? <span className="pill risk" style={{ marginLeft: 6 }}><span className="glyph">▲</span>{s.rejections.length} rejection</span> : null}
                        </div></td>
                        <td className="mono tiny">{m.schedStart || "—"} → {m.schedEnd || "—"}</td>
                        <td className="tiny muted">{routeProgress(m.route)}</td>
                        <td>{held ? <State level="blocked" text={"Held — " + m.waitingFor.slice(9)} /> : moPill(s.status)}</td>
                        <td>{s.status === "stopped"
                          ? <span className={`pill ${cl.cls === "on-track" ? "ok" : cl.cls}`}><span className="glyph">{cl.glyph}</span>{cl.label}</span>
                          : <span className="tiny muted">—</span>}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                            {s.status === "started" && !held ? <button className="btn sm" onClick={() => stop(m)}>Stop</button> : null}
                            {s.status === "scheduled" ? <button className="btn sm" onClick={() => start(m)}>Start</button> : null}
                            {s.status !== "stopped" ? <button className="btn sm ghost" onClick={() => openCap(m.mo, "stoppage")}>Stoppage</button> : null}
                            {s.status !== "stopped" ? <button className="btn sm ghost" onClick={() => openCap(m.mo, "rejection")}>Reject</button> : null}
                            {s.status === "stopped" ? <span className="tiny muted">closed</span> : null}
                          </div>
                        </td>
                      </tr>
                      {capturing && (
                        <tr>
                          <td colSpan={6} style={{ background: "var(--page)" }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <span className="tiny muted" style={{ whiteSpace: "nowrap" }}>{cap.type === "stoppage" ? "Record stoppage:" : "Record rejection:"}</span>
                              {cap.type === "stoppage" ? (
                                <>
                                  <input style={inp} placeholder="Reason (e.g. seal leak — line held)" value={cap.a} onChange={(e) => setCap((c) => ({ ...c, a: e.target.value }))} />
                                  <input style={{ ...inp, flex: "none", width: 90 }} placeholder="Minutes" value={cap.b} onChange={(e) => setCap((c) => ({ ...c, b: e.target.value }))} />
                                </>
                              ) : (
                                <>
                                  <input style={{ ...inp, flex: "none", width: 70 }} placeholder="Qty" value={cap.a} onChange={(e) => setCap((c) => ({ ...c, a: e.target.value }))} />
                                  <input style={inp} placeholder="Reason (e.g. mechanical seal — scrapped)" value={cap.b} onChange={(e) => setCap((c) => ({ ...c, b: e.target.value }))} />
                                </>
                              )}
                              <button className="btn sm" onClick={() => addCapture(m)}>Add</button>
                              <button className="btn sm ghost" onClick={closeCap}>Cancel</button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
      <div className="tiny muted" style={{ padding: "4px 2px" }}>A closed manufacturing order is not reopened here — corrections are made in SAP Business One (§11, assumption 10).</div>
      <ExceptionsCard area="shopfloor" title="Exceptions handled on the shop floor" cite="§11" />
    </div>
  );
}

/* ============================================================
   V6 Phase C — dashboards (§14.1), where orders stand (§14.3),
   integration & audit (§16.1)
   ============================================================ */
function toDate(s) {
  if (!s || s === "—") return null;
  const d = s.split(" ")[0];
  const [dd, mm, yy] = d.split("-").map(Number);
  if (!dd || !mm || !yy) return null;
  return new Date(yy < 100 ? 2000 + yy : yy, mm - 1, dd);
}
function daysBetween(a, b) {
  const A = toDate(a), B = toDate(b);
  if (!A || !B) return null;
  return Math.round((A - B) / 86400000);
}
/* Committed delivery date in force (from the firmed schedule, §12.1). */
function committedOf(o) { return o.revised && o.revised !== "—" ? o.revised : o.promise; }
/* Scheduled end of the top-level finished-goods MO for an order. */
function scheduledEndOf(oa) {
  const list = (MOS[oa] || []).filter((m) => m.schedEnd);
  if (!list.length) return null;
  return list.map((m) => m.schedEnd).sort((a, b) => cmpDate(a, b)).pop();
}

/* ---- Reports & dashboards (§14.1) ---- */
function Dashboards({ open }) {
  const mos = allMOs();
  const stopped = mos.filter((m) => m.status === "stopped");

  // (1) On-time delivery — component level (MO stop vs scheduled end)
  const comp = stopped.map((m) => ({ m, d: daysBetween(m.stopAt, m.schedEnd) }));
  const compOnTime = comp.filter((c) => c.d != null && c.d <= 0).length;
  // (1) On-time — sales-order-line level (promise vs closure of top FG MO)
  const lineRows = ORDERS.filter((o) => (MOS[o.oa] || []).some((m) => m.status === "stopped"))
    .map((o) => {
      const fg = (MOS[o.oa] || []).find((m) => m.status === "stopped");
      return { o, promise: o.promise, closed: fg.stopAt, d: daysBetween(fg.stopAt, o.promise) };
    });
  const lineOnTime = lineRows.filter((r) => r.d != null && r.d <= 0).length;

  // (3) Utilisation & OEE
  const load = wcLoad();
  const centres = WORKCENTRES.filter((w) => !w.subcontract);
  const util = centres.map((w) => ({ w, pct: wcAvailable(w, "week") ? Math.round((load[w.id] || 0) / wcAvailable(w, "week") * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct);
  const stoppages = mos.reduce((s, m) => s + m.stoppages.length, 0);
  const rejections = mos.reduce((s, m) => s + m.rejections.length, 0);
  const avA = 90, avP = 92, avQ = rejections ? 94 : 98;
  const oee = Math.round(avA * avP * avQ / 10000);

  // (2) Job status
  const byStatus = { started: 0, scheduled: 0, stopped: 0, unscheduled: 0 };
  for (const m of mos) byStatus[m.status] = (byStatus[m.status] || 0) + 1;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Dashboards</h1>
          <div className="subtitle">On-time delivery, job status, machine utilisation &amp; OEE, and capacity against load. Every figure opens the records behind it.</div>
        </div>
        <button className="btn ghost">Export to Excel</button>
      </div>

      <div className="grid2">
        <div className="stack">
          {/* Dashboard 1 — on-time */}
          <div className="card">
            <div className="card-head"><span className="card-title">On-time delivery</span><span className="tiny muted">Scheduled vs actual completion</span></div>
            <div className="duo">
              <div className="card-pad">
                <div className="tiny muted">Component level</div>
                <div className="kpi-v">{stopped.length ? Math.round(compOnTime / stopped.length * 100) : 0}%</div>
                <div className="tiny muted">{compOnTime} of {stopped.length} MOs stopped on or before schedule</div>
              </div>
              <div className="card-pad">
                <div className="tiny muted">Sales-order-line level</div>
                <div className="kpi-v">{lineRows.length ? Math.round(lineOnTime / lineRows.length * 100) : 0}%</div>
                <div className="tiny muted">{lineOnTime} of {lineRows.length} lines closed by promise date</div>
              </div>
            </div>
            <table className="tbl">
              <thead><tr><th>OA</th><th>MO</th><th>Scheduled end</th><th>Stopped</th><th>Delta</th></tr></thead>
              <tbody>
                {comp.map((c) => (
                  <tr key={c.m.mo} className="click" onClick={() => open(c.m.order.oa)}>
                    <td className="mono link">{c.m.order.oa}</td>
                    <td className="mono tiny">{c.m.mo}</td>
                    <td className="mono tiny">{c.m.schedEnd}</td>
                    <td className="mono tiny">{c.m.stopAt}</td>
                    <td className="mono tiny" style={{ color: c.d > 0 ? "var(--risk)" : "var(--ok)" }}>{c.d > 0 ? `+${c.d}d late` : `${c.d}d`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delivery performance — reasons for misses (§12.1, §14) */}
          <div className="card">
            <div className="card-head"><span className="card-title">Delivery performance — reasons for misses</span><span className="tiny muted">Committed vs promise, with the reason recorded (§12.1)</span></div>
            {(() => {
              const slipped = ORDERS.filter((o) => o.revised && o.promise && o.revised !== o.promise && o.revised !== "—");
              const tally = {};
              slipped.forEach((o) => { const t = (o.exceptions && o.exceptions[0] && o.exceptions[0].t) || "Other"; tally[t] = (tally[t] || 0) + 1; });
              const rows = Object.entries(tally).sort((a, b) => b[1] - a[1]);
              const max = Math.max(1, ...rows.map((r) => r[1]));
              return (
                <>
                  {rows.map(([r, n]) => (
                    <div key={r} style={{ padding: "10px 20px", borderBottom: "1px solid var(--line)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span>{r}</span><span className="mono muted">{n} order{n > 1 ? "s" : ""}</span></div>
                      <div className="bar"><i style={{ width: `${(n / max) * 100}%` }} /></div>
                    </div>
                  ))}
                  <div className="card-pad tiny muted">{slipped.length} of {ORDERS.length} orders committed later than promised — countable because every delay is an exception with a type.</div>
                </>
              );
            })()}
          </div>

          {/* Dashboard 3 — utilisation & OEE */}
          <div className="card">
            <div className="card-head"><span className="card-title">Machine utilisation &amp; OEE</span><span className="tiny muted">OEE takes stoppages &amp; rejections into account (§14.1.3)</span></div>
            <div className="duo">
              <div className="card-pad"><div className="tiny muted">Factory OEE</div><div className="kpi-v">{oee}%</div><div className="tiny muted">Avail {avA}% · Perf {avP}% · Qual {avQ}%</div></div>
              <div className="card-pad"><div className="tiny muted">Logged this period</div><div className="kpi-v">{stoppages}<span className="tiny muted"> stoppages</span></div><div className="tiny muted">{rejections} rejection{rejections === 1 ? "" : "s"}</div></div>
            </div>
            {util.slice(0, 6).map((u) => (
              <div key={u.w.id} style={{ padding: "10px 20px", borderBottom: "1px solid var(--line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span>{u.w.name}</span><span className="mono muted">{u.pct}%</span>
                </div>
                <div className="bar"><i className={u.pct > 100 ? "red" : ""} style={{ width: `${Math.min(u.pct, 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="stack">
          {/* Dashboard 2 — job status */}
          <div className="card card-pad">
            <h2 className="sec">Job status</h2>
            {[["Started", byStatus.started, ""], ["Stopped (closed)", byStatus.stopped, ""], ["Scheduled", byStatus.scheduled, ""], ["Unscheduled", byStatus.unscheduled, "warn"]].map(([k, v, c]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span className="muted">{k}</span>
                <b style={{ color: c === "warn" ? "var(--warn)" : "inherit" }}>{v}</b>
              </div>
            ))}
          </div>

          {/* Dashboard 4 — capacity vs load */}
          <div className="card card-pad">
            <h2 className="sec">Capacity vs load</h2>
            {(() => {
              const over = centres.filter((w) => (load[w.id] || 0) > wcAvailable(w, "week"));
              const tl = centres.reduce((s, w) => s + (load[w.id] || 0), 0);
              const ta = centres.reduce((s, w) => s + wcAvailable(w, "week"), 0);
              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span className="muted">Overloaded centres (week)</span><b style={{ color: over.length ? "var(--risk)" : "var(--ok)" }}>{over.length}</b></div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span className="muted">Load</span><b className="mono">{tl} h</b></div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span className="muted">Available</span><b className="mono">{ta} h</b></div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span className="muted">Spare</span><b className="mono" style={{ color: ta - tl < 0 ? "var(--risk)" : "inherit" }}>{ta - tl} h</b></div>
                </>
              );
            })()}
          </div>
          <div className="note">Reports export to Excel. Excel is an export format only — no data is taken from it (assumption 7).</div>
        </div>
      </div>
    </div>
  );
}

/* ---- Where each order stands (§14.3) ---- */
function OrderStands({ open }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Where each order stands</h1>
          <div className="subtitle">One line per sales-order line: committed date, scheduled end, the manufacturing orders under it and the closure position.</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><span className="card-title">The order process at a glance</span><span className="tiny muted">The five stages the platform follows (§8)</span></div>
        <table className="tbl">
          <thead><tr><th style={{ width: 28 }}>#</th><th>Stage</th><th>What happens</th><th>Main actors</th></tr></thead>
          <tbody>
            {ORDER_STAGES.map((s, i) => (
              <tr key={s.n}>
                <td className="mono tiny muted">{i + 1}</td>
                <td>{s.n}</td>
                <td className="tiny muted">{s.what}</td>
                <td className="tiny muted">{s.who}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <table className="tbl">
          <thead><tr><th>OA</th><th>Customer</th><th>Committed</th><th>Scheduled end</th><th>Manufacturing orders</th><th>Closure</th></tr></thead>
          <tbody>
            {ORDERS.map((o) => {
              const list = MOS[o.oa] || [];
              const se = scheduledEndOf(o.oa);
              const started = list.filter((m) => m.status === "started").length;
              const stoppedN = list.filter((m) => m.status === "stopped").length;
              const posted = list.filter((m) => m.closurePosted === true).length;
              const pending = list.filter((m) => m.closurePosted === "pending").length;
              return (
                <tr key={o.oa} className="click" onClick={() => open(o.oa)}>
                  <td className="mono link">{o.oa}</td>
                  <td>{o.customer}<div className="tiny muted">{o.model}</div></td>
                  <td className="mono tiny">{committedOf(o)}</td>
                  <td className="mono tiny">{se || "—"}</td>
                  <td className="tiny">
                    {list.length === 0
                      ? <span className="muted">No MO — {o.code === "SERVICE" ? "service / spare line" : o.lifecycle === "cancelled" ? "cancelled" : "—"}</span>
                      : <span>{list.length} MO · {stoppedN} closed · {started} running</span>}
                  </td>
                  <td>{pending
                    ? <span className="pill warn"><span className="glyph">◴</span>{pending} not posted</span>
                    : posted
                    ? <span className="pill ok"><span className="glyph">✓</span>{posted} in SAP</span>
                    : <span className="tiny muted">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---- Integration & audit (§16.1) ---- */
const IFACE_DIR = { from: "← from SAP", to: "→ to SAP", both: "↔ both ways" };
function Integration({ toast }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Integration &amp; audit</h1>
          <div className="subtitle">Every message to and from SAP Business One — numbered, idempotent, retried on failure, and searchable.</div>
        </div>
        <div className="search" style={{ maxWidth: 280 }}>
          <span className="muted">⌕</span><input placeholder="Search by document, order, user or time" />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><span className="card-title">Interfaces</span><span className="tiny muted">The agreed SAP Business One connections</span></div>
        <table className="tbl">
          <thead><tr><th>Connection</th><th>Direction</th><th>What passes</th><th>State</th></tr></thead>
          <tbody>
            {INTERFACES.map((f) => (
              <tr key={f.n}>
                <td>{f.n}</td>
                <td className="tiny muted">{IFACE_DIR[f.dir]}</td>
                <td className="tiny muted">{f.passes}</td>
                <td>{f.st === "ok" ? <State level="on-track" text="Connected" /> : f.st === "retry" ? <State level="warn" text="Retrying" /> : <State level="blocked" text="Failed" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-head"><span className="card-title">Message audit trail</span><span className="tiny muted">Sending the same message twice cannot create two documents</span></div>
        <table className="tbl">
          <thead><tr><th>Message</th><th>Document</th><th>Order / ref</th><th>When</th><th>State</th><th></th></tr></thead>
          <tbody>
            {AUDIT.map((a) => (
              <tr key={a.id}>
                <td className="mono tiny">{a.id}<div className="tiny muted">{IFACE_DIR[a.dir]} · try {a.tries}</div></td>
                <td>{a.doc}<div className="tiny muted">{a.note}</div></td>
                <td className="mono tiny">{a.order !== "—" ? a.order : ""} {a.ref}</td>
                <td className="mono tiny">{a.when}</td>
                <td>{a.st === "posted" ? <State level="on-track" text="Posted" /> : a.st === "retry" ? <State level="warn" text="Retrying" /> : <State level="blocked" text="Failed" />}</td>
                <td>{a.st !== "posted" ? <button className="btn sm ghost" onClick={() => toast(`${a.id} re-sent to SAP Business One`)}>Retry</button> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---- Notifications (§15) ---- */
function Notifications({ role, open }) {
  const items = NOTIFICATIONS.filter((n) => n.roles.includes(role));
  const rules = NOTIF_RULES[role] || [];
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Notifications</h1>
          <div className="subtitle">Configurable per role; the thresholds that fire them are set by Nadi Airtechnics (§15).</div>
        </div>
      </div>
      <div className="grid2">
        <div className="card">
          <div className="card-head"><span className="card-title">For you now</span><span className="tiny muted">{items.length}</span></div>
          {items.length === 0
            ? <div className="empty"><b>No notifications</b>Nothing has crossed a threshold for your role.</div>
            : items.map((n) => (
              <div className="att" key={n.id}>
                <div className={`att-bar ${n.level}`} />
                <div className="att-body">
                  <div className="att-top">
                    <span className="att-title">{n.title}</span>
                    {n.oa ? <button className="link mono tiny" onClick={() => open(n.oa)}>OA {n.oa}</button> : null}
                  </div>
                  <div className="att-sub">{n.sub}</div>
                </div>
                <span className="mono tiny muted">{n.when}</span>
              </div>
            ))}
        </div>
        <div className="card card-pad">
          <h2 className="sec">What you're notified about</h2>
          {rules.map((r) => (
            <div key={r} style={{ display: "flex", gap: 8, padding: "6px 0", alignItems: "flex-start" }}>
              <span className="muted">•</span><span>{r}</span>
            </div>
          ))}
          <div className="note" style={{ marginTop: 10 }}>Triggers, dashboards and reports are configurable for Planning, Production, Projects and Management. Thresholds are to be confirmed (§15, §17).</div>
        </div>
      </div>
    </div>
  );
}

/* ---- Administration (§6 users/roles & thresholds, §5.3 ownership,
       §16.2 mobile, §17 points to confirm) ---- */
function Admin({ toast }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="title">Administration</h1>
          <div className="subtitle">Users and roles, thresholds, record ownership, mobile and the open points — the System administrator's surface.</div>
        </div>
      </div>

      <div className="grid2">
        <div className="stack">
          <div className="card">
            <div className="card-head"><span className="card-title">Users &amp; roles</span><span className="tiny muted">Access is by role (§6)</span></div>
            <table className="tbl">
              <thead><tr><th>User</th><th>Role</th><th>Status</th></tr></thead>
              <tbody>
                {USERS.map((u) => (
                  <tr key={u.name}>
                    <td>{u.name}</td>
                    <td className="tiny muted">{(ROLES[u.role] && ROLES[u.role].label) || u.role}</td>
                    <td><State level={u.active ? "on-track" : "warn"} text={u.active ? "Active" : "Disabled"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="card-pad">
              {USER_COUNTS.map((c) => (
                <div key={c.role} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                  <span className="muted tiny">{c.role}</span>
                  <span className="mono tiny">{c.planned}{c.note ? <span className="muted"> · {c.note}</span> : null}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><span className="card-title">Thresholds</span><span className="tiny muted">Set by Nadi Airtechnics (§15, §17)</span></div>
            <table className="tbl">
              <thead><tr><th>Trigger</th><th>Threshold</th><th></th></tr></thead>
              <tbody>
                {THRESHOLDS.map((t) => (
                  <tr key={t.k}>
                    <td>{t.k}{t.tbc ? <span className="op-hold-tag" style={{ marginLeft: 6 }}>to confirm</span> : null}</td>
                    <td className="tiny muted">{t.v}</td>
                    <td><button className="btn sm ghost" onClick={() => toast(`Threshold "${t.k}" — set by Nadi Airtechnics`)}>Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-head"><span className="card-title">Who owns which record</span><span className="tiny muted">Binding SAP-vs-platform position (§5.3)</span></div>
            <table className="tbl">
              <thead><tr><th>Record</th><th>System of record</th></tr></thead>
              <tbody>
                {OWNERSHIP.map((o) => (
                  <tr key={o.rec}>
                    <td>{o.rec}<div className="tiny muted">{o.note}</div></td>
                    <td><span className={`pill ${o.sys === "Platform" ? "info" : "hollow"}`}>{o.sys}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-head"><span className="card-title">How the platform is put together</span><span className="tiny muted">The six layers (§5.2)</span></div>
            <table className="tbl">
              <thead><tr><th>Layer</th><th>What it does</th></tr></thead>
              <tbody>
                {LAYERS.map((l) => (
                  <tr key={l.n}><td>{l.n}</td><td className="tiny muted">{l.what}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-head"><span className="card-title">Mobile access</span><span className="tiny muted">To be confirmed (§16.2)</span></div>
            {MOBILE.map((m) => (
              <div key={m.role} className="sub" style={{ alignItems: "flex-start" }}>
                <State level="watch" text={m.role} />
                <div style={{ flex: 1 }} className="tiny muted">{m.items}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-head"><span className="card-title">Points to confirm</span><span className="tiny muted">{TOCONFIRM.length} open (§17)</span></div>
            {["Scheduling & capacity", "Shop floor & dashboards", "Systems & data", "Process details", "Baselines"].map((g) => {
              const rows = TOCONFIRM.filter((t) => t.g === g);
              if (!rows.length) return null;
              return (
                <div key={g}>
                  <div className="sub" style={{ background: "var(--page)" }}><b className="tiny">{g}</b></div>
                  {rows.map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, padding: "8px 20px", borderBottom: "1px solid var(--line)" }}>
                      <span className="muted tiny">○</span><span className="tiny">{t.q}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="card">
            <div className="card-head"><span className="card-title">Assumptions</span><span className="tiny muted">{ASSUMPTIONS.length} to confirm before development (§2)</span></div>
            {ASSUMPTIONS.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "7px 20px", borderBottom: "1px solid var(--line)" }}>
                <span className="mono tiny muted">{i + 1}</span><span className="tiny">{a}</span>
              </div>
            ))}
          </div>
          <div className="note">Interface monitoring and message retry live on the <b>Integration &amp; audit</b> screen.</div>
        </div>
      </div>
    </div>
  );
}

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
    const cur = d[oaId] || { comments: [] };
    const comment = { id: "u" + Date.now(), ...entry };
    return { ...d, [oaId]: { ...cur, comments: [comment, ...cur.comments] } };
  });

  const moList = allMOs();
  const schedCount = moList.filter((m) => m.status !== "unscheduled").length;
  const loadMap = wcLoad();
  const overCount = WORKCENTRES.filter((w) => !w.subcontract && (loadMap[w.id] || 0) > wcAvailable(w, "week")).length;
  const notifCount = NOTIFICATIONS.filter((n) => n.roles.includes(role)).length;
  const counts = { today: attn, schedule: schedCount, capacity: overCount, shopfloor: schedCount, stands: ORDERS.length, dashboards: 4, notifications: notifCount, integration: AUDIT.filter((a) => a.st !== "posted").length, admin: TOCONFIRM.length, orders: ORDERS.length };

  let body;
  if (order) body = <Workspace order={order} back={() => setOa(null)} role={role} disc={disc[order.oa]} onPost={postComment} />;
  else if (view === "today") body = <Today role={role} open={open} />;
  else if (view === "schedule") body = <Schedule open={open} toast={toast} />;
  else if (view === "capacity") body = <Capacity toast={toast} />;
  else if (view === "shopfloor") body = <ShopFloor open={open} toast={toast} />;
  else if (view === "stands") body = <OrderStands open={open} />;
  else if (view === "dashboards") body = <Dashboards open={open} />;
  else if (view === "integration") body = <Integration toast={toast} />;
  else if (view === "notifications") body = <Notifications role={role} open={open} />;
  else if (view === "admin") body = <Admin toast={toast} />;
  else if (view === "orders") body = <Orders open={open} toast={toast} />;
  else body = <Today role={role} open={open} />;

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
