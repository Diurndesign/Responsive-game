/* =====================================================================
   MOTEUR COMMUN des jeux HTML · CSS · Flexbox · Grid
   Les données du jeu (ateliers, missions, page Découvrir) sont dans game.js.
   La mascotte (la maison de Bip ou Kami) est dans mascot.js.
   ===================================================================== */
"use strict";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const wait = ms => new Promise(r => setTimeout(r, ms));

/* Mini markdown : `code`, **gras**, *italique* */
function md(s) {
  const codes = [];
  // on met le code de côté, on applique **gras** et *italique*, puis on remet le code
  const t = String(s || "").replace(/`([^`]*)`/g, (all, c) => { codes.push(c); return "\u0000" + (codes.length - 1) + "\u0000"; });
  return esc(t)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^\w*])\*(?!\s)([^*]+?)\*(?![\w*])/g, "$1<em>$2</em>")
    .replace(/\u0000(\d+)\u0000/g, (all, n) => `<code>${esc(codes[+n])}</code>`);
}

/* =====================================================================
   SAUVEGARDE
   ===================================================================== */
// initialisés au chargement de la page, une fois game.js lu
let LEVELS, CHAPTERS, KEY, store;
function initStore() {
  LEVELS = GAME.levels; CHAPTERS = GAME.chapters; KEY = GAME.id + "-v1";
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
  store = Object.assign({ progress: {}, drafts: {}, unlockAll: false, seenDiscover: false }, s || {});
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* stockage indisponible : on continue sans */ } if (window.BipCloud) BipCloud.queue(); }
/* suivi pour l’espace formateur (essais, erreurs, indices, solutions, temps) : voir cloud.js */
const trk = (kind, id, extra) => { if (window.BipCloud && id) BipCloud.track(kind, id, extra); };

const levelIndex = id => LEVELS.findIndex(l => l.id === id);
const isDone = id => !!store.progress[id];
const isUnlocked = i => i === 0 || store.unlockAll || isDone(LEVELS[i].id) || (i > 0 && isDone(LEVELS[i - 1].id));
const nextLevel = () => LEVELS.find(l => !isDone(l.id)) || null;
const chapterDone = n => LEVELS.filter(l => l.ch === n).every(l => isDone(l.id));
const doneChapters = () => new Set(CHAPTERS.filter(c => chapterDone(c.n)).map(c => c.n));
const totalStars = () => Object.values(store.progress).reduce((a, p) => a + (p.stars || 0), 0);
const starsHTML = n => [1, 2, 3].map(k => `<span class="${k <= n ? "on" : "off"}">★</span>`).join("");
const mascot = mood => MASCOT.svg(doneChapters(), mood);

let current = null;      // mission ouverte
let session = null;      // état de la mission en cours (indices, essais…)

/* =====================================================================
   COLORATION DU CODE (HTML et CSS)
   ===================================================================== */
function hlHTML(src) {
  let out = "", i = 0;
  const re = /<!--[\s\S]*?(?:-->|$)|<!doctype[^>]*>?|<\/?[a-zA-Z][\w-]*|>|\/>|&[#\w]+;/gi;
  let inTag = false, m, last = 0;
  // on parcourt les jetons ; à l’intérieur d’une balise on colore attributs et valeurs
  const tagInner = s => s.replace(/("[^"]*"?|'[^']*'?)|([^\s=/"']+)|(=)/g, (all, str, name, eq) => str ? `<span class="t-str">${esc(str)}</span>` : name ? `<span class="t-attr">${esc(name)}</span>` : `<span class="t-punc">=</span>`);
  while ((m = re.exec(src))) {
    const before = src.slice(last, m.index);
    out += inTag ? tagInner(before) : esc(before);
    const t = m[0];
    if (t.startsWith("<!--")) out += `<span class="t-com">${esc(t)}</span>`;
    else if (/^<!doctype/i.test(t)) out += `<span class="t-doc">${esc(t)}</span>`;
    else if (t[0] === "<") { out += `<span class="t-tag">${esc(t)}</span>`; inTag = true; }
    else if (t === ">" || t === "/>") { out += inTag ? `<span class="t-tag">${esc(t)}</span>` : esc(t); inTag = false; }
    else out += `<span class="t-ent">${esc(t)}</span>`;
    last = re.lastIndex;
  }
  const rest = src.slice(last);
  out += inTag ? tagInner(rest) : esc(rest);
  return out;
}
function hlCSS(src) {
  let out = "", i = 0, buf = "", mode = "sel"; // sel | prop | val
  if (!/[{}]/.test(src) && /^\s*(--)?[a-z-]+\s*:[^:]/i.test(src.replace(/\/\*[\s\S]*?\*\//g, ""))) mode = "prop"; // ex. « color: red; » tout seul
  const stack = []; // "at" (bloc @media qui contient des règles) ou "rule"
  const flush = () => {
    if (!buf) return;
    const wrap = cls => buf.replace(/^(\s*)([\s\S]*?)(\s*)$/, (a, s1, body, s2) => esc(s1) + (body ? `<span class="${cls}">${esc(body)}</span>` : "") + esc(s2));
    if (mode === "sel") out += wrap(buf.trim().startsWith("@") ? "t-at" : "t-sel");
    else if (mode === "prop") out += wrap("t-prop");
    else out += esc(buf).replace(/(#[0-9a-fA-F]{3,8}\b)|(-?\d*\.?\d+)(px|rem|em|%|fr|vh|vw|s|ms|deg)?|(!important)/g, (a, hex, num, unit, imp) => hex ? `<span class="t-num">${hex}</span>` : imp ? `<span class="t-at">${imp}</span>` : `<span class="t-num">${num}</span>${unit ? `<span class="t-unit">${unit}</span>` : ""}`);
    buf = "";
  };
  while (i < src.length) {
    const ch = src[i];
    if (ch === "/" && src[i + 1] === "*") {
      flush(); let j = src.indexOf("*/", i + 2); j = j < 0 ? src.length : j + 2;
      out += `<span class="t-com">${esc(src.slice(i, j))}</span>`; i = j; continue;
    }
    if ((ch === '"' || ch === "'") && mode !== "sel") { let j = src.indexOf(ch, i + 1); const nl = src.indexOf("\n", i + 1); if (j < 0 || (nl >= 0 && nl < j)) j = nl < 0 ? src.length : nl; else j++; flush(); out += `<span class="t-str">${esc(src.slice(i, j))}</span>`; i = j; continue; }
    if (ch === "{") {
      const isAt = mode === "sel" && /^\s*@(media|supports|container|layer)\b/i.test(buf);
      flush(); out += `<span class="t-punc">{</span>`;
      stack.push(isAt ? "at" : "rule"); mode = isAt ? "sel" : "prop"; i++; continue;
    }
    if (ch === "}") { flush(); out += `<span class="t-punc">}</span>`; stack.pop(); mode = stack[stack.length - 1] === "rule" ? "prop" : "sel"; i++; continue; }
    if (ch === ":" && mode === "prop") { flush(); out += `<span class="t-punc">:</span>`; mode = "val"; i++; continue; }
    if (ch === ";" && mode !== "sel") { flush(); out += `<span class="t-punc">;</span>`; mode = "prop"; i++; continue; }
    buf += ch; i++;
  }
  flush();
  return out;
}
const highlight = (src, lang) => (lang || GAME.lang) === "css" ? hlCSS(src) : hlHTML(src);

/* =====================================================================
   VÉRIFICATEUR HTML : balises non fermées, mal imbriquées, inconnues…
   ===================================================================== */
const VOID_TAGS = new Set("area base br col embed hr img input link meta source track wbr".split(" "));
const lineAt = (src, idx) => src.slice(0, idx).split("\n").length;
const COMMON_ATTRS = ["href", "src", "alt", "class", "id", "type", "name", "for", "value", "placeholder", "title", "lang", "charset", "content", "rel", "target", "width", "height", "required", "action", "method", "colspan", "rowspan", "style", "loading", "min", "max", "checked", "disabled", "label", "role"];
function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
const closest = (w, list, max = 2) => { let best = null, bd = max + 1; list.forEach(x => { const k = lev(w, x); if (k < bd) { bd = k; best = x; } }); return best; };
const KNOWN_TAGS = "html head body title meta link style script main header footer nav section article aside h1 h2 h3 h4 h5 h6 p br hr strong em b i u small mark span div a img ul ol li dl dt dd table thead tbody tfoot tr th td caption form label input button textarea select option fieldset legend figure figcaption blockquote q cite code pre abbr time address video audio source iframe picture sup sub del ins details summary dialog canvas svg noscript template base".split(" ");
function isKnownTag(t) { return KNOWN_TAGS.includes(t) || !(document.createElement(t) instanceof HTMLUnknownElement) || t.includes("-"); }

function lintHTML(src) {
  const issues = [];
  const add = (level, line, msg) => issues.push({ level, line, msg });
  const stack = [];
  const tagRe = /<(\/?)([a-zA-Z][\w-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/y;
  let i = 0;
  while (i < src.length) {
    const lt = src.indexOf("<", i);
    if (lt < 0) break;
    if (src.startsWith("<!--", lt)) {
      const end = src.indexOf("-->", lt + 4);
      if (end < 0) { add("error", lineAt(src, lt), "Ce commentaire `<!--` n’est jamais fermé : il manque `-->`. Tout ce qui suit est caché."); break; }
      i = end + 3; continue;
    }
    if (/^<!doctype/i.test(src.slice(lt, lt + 9))) { const end = src.indexOf(">", lt); i = end < 0 ? src.length : end + 1; continue; }
    tagRe.lastIndex = lt;
    const m = tagRe.exec(src);
    const line = lineAt(src, lt);
    if (!m) {
      const nx = src[lt + 1] || "";
      if (/[a-zA-Z/]/.test(nx)) {
        const frag = src.slice(lt, lt + 30).split(/\n/)[0];
        const q = (frag.match(/"/g) || []).length % 2 ? " Vérifie aussi les guillemets des attributs : il en manque un." : "";
        add("error", line, `La balise \`${frag.trim()}…\` n’est pas terminée : il manque le \`>\` final.${q}`);
      }
      i = lt + 1; continue;
    }
    i = tagRe.lastIndex;
    const closing = m[1] === "/";
    const name = m[2].toLowerCase();
    const attrs = m[3] || "";
    if (!isKnownTag(name)) {
      const s = closest(name, KNOWN_TAGS);
      if (!closing) add("error", line, `\`<${name}>\` n’est pas une balise HTML.${s ? ` Tu voulais peut-être écrire \`<${s}>\` ?` : " Le navigateur ne sait pas quoi en faire."}`);
    }
    if (closing) {
      if (VOID_TAGS.has(name)) { add("warn", line, `\`</${name}>\` est inutile : \`<${name}>\` est une balise orpheline, elle ne se ferme pas.`); continue; }
      const pos = stack.map(s => s.name).lastIndexOf(name);
      if (pos < 0) { add("error", line, `\`</${name}>\` ferme une balise \`<${name}>\` qui n’a jamais été ouverte.`); continue; }
      if (pos < stack.length - 1) {
        const inner = stack[stack.length - 1];
        add("error", line, `\`</${name}>\` arrive trop tôt : \`<${inner.name}>\` (ligne ${inner.line}) est encore ouverte. On ferme toujours la dernière balise ouverte en premier, comme des poupées russes.`);
      }
      stack.length = pos;
      continue;
    }
    // attributs
    const attrRe = /([^\s"'>\/=]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g;
    let a; const seen = {};
    const el = isKnownTag(name) ? document.createElement(name) : null;
    while ((a = attrRe.exec(attrs))) {
      const an = a[1].toLowerCase(); seen[an] = a[2] != null ? a[2].replace(/^["']|["']$/g, "") : "";
      if (el && !an.startsWith("data-") && !an.startsWith("aria-") && !COMMON_ATTRS.includes(an) && !(an in el) && !(an.replace(/-/g, "") in el)) {
        const s = closest(an, COMMON_ATTRS);
        add("warn", line, `L’attribut \`${an}\` n’existe pas sur \`<${name}>\`.${s ? ` Tu voulais peut-être écrire \`${s}\` ?` : ""}`);
      }
    }
    if (name === "img") {
      if (!("src" in seen)) add("error", line, "Cette image n’a pas d’attribut `src` : le navigateur ne sait pas quel fichier afficher.");
      if (!("alt" in seen)) add("warn", line, "Ajoute un attribut `alt` à l’image : c’est le texte lu par les lecteurs d’écran et affiché si l’image ne charge pas.");
    }
    if (name === "a" && !("href" in seen)) add("warn", line, "Ce lien `<a>` n’a pas d’attribut `href` : il ne mène nulle part.");
    if (name === "label" && !("for" in seen)) add("tip", line, "Un `<label>` se relie à son champ avec `for=\"…\"`, qui reprend l’`id` du champ.");
    const top = stack[stack.length - 1];
    if (top && top.name === name && /^(p|h[1-6]|li|a|strong|em|title|button|label|span|td|th)$/.test(name)) {
      // <p>Bonjour<p> : la barre / a sûrement été oubliée
      add("error", line, `Une nouvelle balise \`<${name}>\` s’ouvre alors que celle de la ligne ${top.line} n’est pas fermée. Tu voulais sûrement écrire \`</${name}>\`, avec une barre \`/\`.`);
      stack.pop();
      continue;
    }
    if (!VOID_TAGS.has(name) && m[4] !== "/") stack.push({ name, line });
    if (name === "script" || name === "style") {
      const end = src.toLowerCase().indexOf(`</${name}`, i);
      i = end < 0 ? src.length : end;
    }
  }
  stack.forEach(s => add(["html", "head", "body"].includes(s.name) ? "warn" : "error", s.line, `La balise \`<${s.name}>\` (ligne ${s.line}) n’est jamais fermée : il manque \`</${s.name}>\`.`));
  return issues.sort((x, y) => x.line - y.line);
}

/* =====================================================================
   VÉRIFICATEUR CSS : accolades, deux-points, propriétés et valeurs
   ===================================================================== */
const FR_COLORS = { rouge: "red", bleu: "blue", vert: "green", jaune: "yellow", noir: "black", blanc: "white", gris: "gray", rose: "pink", violet: "purple", orange: "orange", marron: "brown", "bleu ciel": "skyblue", or: "gold", argent: "silver" };
const FR_VALUES = { centre: "center", centré: "center", gauche: "left", droite: "right", gras: "bold", aucun: "none", rien: "none", haut: "top", bas: "bottom", colonne: "column", ligne: "row", espace: "space-between", auto: "auto", début: "flex-start", fin: "flex-end" };
let ALL_PROPS = null;
function allProps() {
  if (ALL_PROPS) return ALL_PROPS;
  const st = document.documentElement.style; const set = new Set();
  for (const k in st) { if (typeof st[k] === "string" && !/^\d/.test(k)) set.add(k.replace(/[A-Z]/g, c => "-" + c.toLowerCase()).replace(/^webkit-/, "-webkit-")); }
  ALL_PROPS = Array.from(set).filter(p => !p.startsWith("-webkit-") && !p.startsWith("css-"));
  return ALL_PROPS;
}
const propOK = p => p.startsWith("--") || CSS.supports(p, "inherit");

function parseCSS(src) {
  // renvoie { rules: [{sel, line, media, decls:[{prop, value, line}]}], issues: [...] }
  const issues = []; const rules = [];
  const add = (level, line, msg) => issues.push({ level, line, msg });
  const clean = src.replace(/\/\*[\s\S]*?(\*\/|$)/g, s => s.replace(/[^\n]/g, " "));
  if (/\/\*/.test(src) && !/\*\//.test(src.slice(src.lastIndexOf("/*")))) add("error", lineAt(src, src.lastIndexOf("/*")), "Ce commentaire `/*` n’est jamais fermé : il manque `*/`. Tout ce qui suit est ignoré.");
  let i = 0;
  function block(media) {
    while (i < clean.length) {
      // lire un sélecteur jusqu’à { ou }
      const start = i;
      while (i < clean.length && clean[i] !== "{" && clean[i] !== "}") i++;
      const sel = clean.slice(start, i).trim();
      const selLine = lineAt(clean, start + (clean.slice(start, i).length - clean.slice(start, i).trimStart().length));
      if (i >= clean.length) {
        if (sel) {
          if (/:\s*[^;]+;?/.test(sel) && !/[{}]/.test(sel)) add("error", selLine, `Cette ligne ressemble à une déclaration (\`${sel.split("\n")[0].trim()}\`) mais elle n’est dans aucune règle. Elle doit être entre les accolades \`{ }\` d’un sélecteur.`);
          else add("error", selLine, `Le sélecteur \`${sel.split("\n")[0].trim()}\` n’a pas d’accolade ouvrante \`{\`.`);
        }
        if (media) add("error", lineAt(clean, clean.length), `Le bloc \`${media}\` n’est jamais fermé : il manque une accolade \`}\` à la fin.`);
        return;
      }
      if (clean[i] === "}") {
        // un texte suivi de } : soit la { a été oubliée (cette } ferme la règle cassée), soit la } est en trop
        if (sel) { add("error", selLine, `Il manque l’accolade ouvrante \`{\` après \`${sel.split("\n")[0].trim()}\`.`); i++; continue; }
        if (media) { i++; return; }
        add("error", lineAt(clean, i), "Cette accolade fermante `}` est en trop : aucune règle n’est ouverte ici.");
        i++; continue;
      }
      // clean[i] === "{"
      i++;
      if (!sel) { add("error", lineAt(clean, i - 1), "Il manque le sélecteur avant `{` : sur quel élément s’applique cette règle ?"); }
      if (/^@(media|supports|container|layer)\b/i.test(sel)) { block(sel); continue; }
      if (/^@keyframes\b/i.test(sel)) { let depth = 1; while (i < clean.length && depth) { if (clean[i] === "{") depth++; else if (clean[i] === "}") depth--; i++; } continue; }
      if (sel && !sel.startsWith("@")) {
        try { document.createDocumentFragment().querySelector(sel); }
        catch (e) {
          let tip = "";
          if (/\s-\s|^-|\.$/.test(sel)) tip = "";
          if (/[{};:]$/.test(sel)) tip = "";
          add("error", selLine, `Le sélecteur \`${sel.split("\n")[0]}\` n’est pas valide.${/,\s*$/.test(sel) ? " Il y a une virgule en trop à la fin." : " Vérifie les points, les dièses et les espaces."}${tip}`);
        }
      }
      // déclarations jusqu’à }
      const dStart = i;
      let depth = 0;
      while (i < clean.length && !(clean[i] === "}" && depth === 0)) { if (clean[i] === "{") depth++; if (clean[i] === "}") depth--; i++; }
      const body = clean.slice(dStart, i);
      if (i >= clean.length) add("error", selLine, `La règle \`${sel || "?"}\` (ligne ${selLine}) n’est jamais fermée : il manque l’accolade \`}\`.`);
      else i++;
      if (/{/.test(body)) { add("error", lineAt(clean, dStart + body.indexOf("{")), "Une accolade `{` est ouverte à l’intérieur d’une règle : il manque sûrement un `}` avant."); }
      const rule = { sel, line: selLine, media: media || null, decls: [] };
      let off = 0;
      body.split(";").forEach(raw => {
        const pos = dStart + off; off += raw.length + 1;
        const lead = raw.length - raw.trimStart().length;
        const line = lineAt(clean, pos + lead);
        const d = raw.trim();
        if (!d || /^[{}]/.test(d)) return;
        const colon = d.indexOf(":");
        if (colon < 0) {
          const parts = d.split(/\s+/);
          add("error", line, parts.length > 1 && propOK(parts[0]) ? `Il manque les deux-points \`:\` entre la propriété et la valeur : \`${parts[0]}: ${parts.slice(1).join(" ")};\`` : `\`${d.split("\n")[0]}\` n’est pas une déclaration : on écrit \`propriété: valeur;\`.`);
          return;
        }
        const prop = d.slice(0, colon).trim().toLowerCase();
        let value = d.slice(colon + 1).trim();
        // point-virgule oublié : la valeur contient un retour à la ligne suivi d’une autre déclaration
        const nl = value.match(/\n\s*([a-z-]+)\s*:/i);
        if (nl) {
          const before = value.slice(0, value.indexOf("\n")).trim();
          add("error", line, `Il manque le point-virgule \`;\` à la fin de la ligne ${line} (après \`${before}\`).`);
          value = before;
        }
        const important = /!important$/i.test(value);
        const v = value.replace(/\s*!important$/i, "").trim();
        rule.decls.push({ prop, value: v, line, important });
        if (!/^[a-z-]+$/.test(prop) && !prop.startsWith("--")) { add("error", line, `\`${prop}\` n’est pas un nom de propriété valide.`); return; }
        if (!propOK(prop)) {
          const s = closest(prop, allProps(), 3);
          add("error", line, `La propriété \`${prop}\` n’existe pas.${s ? ` Tu voulais peut-être écrire \`${s}\` ?` : ""}`);
          return;
        }
        if (!v) { add("error", line, `La propriété \`${prop}\` n’a pas de valeur.`); return; }
        if (!prop.startsWith("--") && !CSS.supports(prop, v)) {
          let tip = "";
          const low = v.toLowerCase();
          if (FR_COLORS[low]) tip = ` Les couleurs s’écrivent en anglais : \`${FR_COLORS[low]}\`.`;
          else if (FR_VALUES[low]) tip = ` Les valeurs CSS sont en anglais : essaie \`${FR_VALUES[low]}\`.`;
          else if (/^-?\d*\.?\d+$/.test(v) && v !== "0" && CSS.supports(prop, v + "px")) tip = ` Il manque l’unité : par exemple \`${v}px\`.`;
          else if (/\d\s+(px|rem|em|%)/.test(v)) tip = " Pas d’espace entre le nombre et l’unité : `20px`, pas `20 px`.";
          else if (/^#/.test(v)) tip = " Un code hexadécimal a 3 ou 6 caractères de 0 à 9 et de a à f, comme `#ff6b4a`.";
          else if (/,/.test(v) && /^(margin|padding)/.test(prop)) tip = " Les valeurs se séparent par des espaces, pas par des virgules.";
          else if (/^["'].*["']$/.test(v) && prop !== "font-family" && prop !== "content" && prop !== "grid-template-areas") tip = " Ici, pas de guillemets autour de la valeur.";
          add("error", line, `La valeur \`${v}\` n’est pas valide pour \`${prop}\`.${tip}`);
        }
      });
      rules.push(rule);
    }
    if (media) add("error", lineAt(clean, clean.length), `Le bloc \`${media}\` n’est jamais fermé : il manque une accolade \`}\`.`);
  }
  block(null);
  return { rules, issues: issues.sort((a, b) => a.line - b.line) };
}
function lintCSS(src, doc) {
  const res = parseCSS(src);
  if (doc) res.rules.forEach(r => {
    if (!r.sel || r.sel.startsWith("@")) return;
    r.sel.split(",").map(s => s.trim()).forEach(s => {
      if (/^[a-z][\w-]*$/i.test(s) && !isKnownTag(s.toLowerCase())) {
        if (doc.querySelector("." + CSS.escape(s))) res.issues.push({ level: "error", line: r.line, msg: `\`${s}\` n’est pas une balise HTML. Pour viser la classe \`${s}\`, mets un point devant : \`.${s}\`.` });
        else if (doc.getElementById(s)) res.issues.push({ level: "error", line: r.line, msg: `Pour viser l’id \`${s}\`, mets un dièse devant : \`#${s}\`.` });
        else res.issues.push({ level: "warn", line: r.line, msg: `\`${s}\` n’est pas une balise HTML : cette règle ne s’applique à rien.` });
      } else {
        try { if (doc.body && !doc.querySelector(s.replace(/::?[\w-]+(\([^)]*\))?/g, "") || "*")) res.issues.push({ level: "warn", line: r.line, msg: `Le sélecteur \`${s}\` ne trouve aucun élément dans la page. Vérifie l’orthographe de la classe ou de la balise.` }); } catch (e) { /* sélecteur invalide : déjà signalé */ }
      }
    });
  });
  res.issues.sort((a, b) => a.line - b.line);
  return res;
}

/* =====================================================================
   OUTILS POUR LES OBJECTIFS (utilisés dans game.js)
   ===================================================================== */
const stripComments = (code, lang) => lang === "css" ? code.replace(/\/\*[\s\S]*?(\*\/|$)/g, "") : code.replace(/<!--[\s\S]*?(-->|$)/g, "");
const norm = s => String(s || "").replace(/\s+/g, " ").trim().toLowerCase();
/* q(c, sel) : premier élément de la page ; qa : tous */
const q = (c, sel) => c.doc ? c.doc.querySelector(sel) : null;
const qa = (c, sel) => c.doc ? Array.from(c.doc.querySelectorAll(sel)) : [];
const txt = (c, sel) => { const e = q(c, sel); return e ? e.textContent.replace(/\s+/g, " ").trim() : ""; };
/* cs(c, sel, prop) : valeur calculée par le navigateur */
const cs = (c, sel, prop) => { const e = typeof sel === "string" ? q(c, sel) : sel; return e ? c.doc.defaultView.getComputedStyle(e).getPropertyValue(prop).trim() : ""; };
/* decl(c, sel, prop) : valeur écrite par l’élève pour ce sélecteur (la dernière gagne) */
/* hors des @media, sauf si on passe media (ex. "@media (max-width: 600px)", ou true pour n’importe laquelle) */
function decl(c, sel, prop, media) {
  let v = null; const want = norm(sel);
  (c.rules || []).forEach(r => {
    const okMedia = media == null ? !r.media : media === true ? !!r.media : norm(r.media) === norm(media);
    if (okMedia && r.sel && r.sel.split(",").map(norm).includes(want)) r.decls.forEach(d => { if (d.prop === prop) v = d.value; });
  });
  return v;
}
/* declAny(c, prop) : l’élève a-t-il utilisé cette propriété quelque part ? */
const declAny = (c, prop, val) => (c.rules || []).some(r => r.decls.some(d => d.prop === prop && (val == null || norm(d.value) === norm(val))));
/* sameColor("red", "rgb(255, 0, 0)") */
const _cx = document.createElement("canvas").getContext("2d");
function sameColor(a, b) { const n = x => { _cx.fillStyle = "#010203"; _cx.fillStyle = x; return _cx.fillStyle; }; const na = n(a), nb = n(b); return na !== "#010203" && na === nb; }
const isColorSet = (c, sel, prop, def) => { const v = cs(c, sel, prop); return v && !sameColor(v, def || "rgba(0, 0, 0, 0)") && v !== "rgba(0, 0, 0, 0)"; };
const px = v => parseFloat(v) || 0;
const hasCode = (c, re) => re.test(c.clean);
const noErrors = c => !c.issues.some(x => x.level === "error") || `Le vérificateur trouve encore ${c.issues.filter(x => x.level === "error").length} erreur(s) : regarde l’onglet **Remarques**.`;
/* Jeu responsive : la page de l’élève est rendue à chaque largeur de GAME.screens.
   qAt(c, "mobile", sel), csAt(c, "tablette", sel, prop), boxAt(c, "ordi", sel) → {left, top, width, height},
   visibleAt(c, "mobile", sel) → l’élément est-il affiché à cette largeur ? */
const docAt = (c, id) => (c.at && c.at[id]) || null;
const qAt = (c, id, sel) => { const d = docAt(c, id); return d ? d.querySelector(sel) : null; };
const qaAt = (c, id, sel) => { const d = docAt(c, id); return d ? Array.from(d.querySelectorAll(sel)) : []; };
const csAt = (c, id, sel, prop) => { const d = docAt(c, id); const e = d && (typeof sel === "string" ? d.querySelector(sel) : sel); return e ? d.defaultView.getComputedStyle(e).getPropertyValue(prop).trim() : ""; };
const boxAt = (c, id, sel) => { const e = typeof sel === "string" ? qAt(c, id, sel) : sel; if (!e) return null; const r = e.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
const visibleAt = (c, id, sel) => { const e = qAt(c, id, sel); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && csAt(c, id, e, "visibility") !== "hidden"; };
const overflowAt = (c, id) => { const d = docAt(c, id); return d ? d.documentElement.scrollWidth > d.documentElement.clientWidth + 1 : false; };
const boardOK = c => c.board ? (c.board.ok || `${c.board.placed} / ${c.board.total} à la bonne place pour l’instant.`) : false;

/* =====================================================================
   APERÇU (iframe) : page HTML, page + CSS, ou plateau de jeu
   ===================================================================== */
const PAGE_BASE = `html{color-scheme:light}body{margin:16px;font:16px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1B2440;background:#fff}img{max-width:100%;height:auto}`;
const killStyleEnd = s => String(s).replace(/<\/style/gi, "<\\/style");

function pageDoc(L, code) {
  const mode = L.mode || GAME.mode;
  // les <script> de l’élève restent dans la page (les tests les voient) mais ne s’exécutent pas dans l’aperçu
  if (mode === "html") return code.replace(/<script\b(?![^>]*\btype\s*=)/gi, '<script type="text/plain"');
  const html = L.html != null ? L.html : (GAME.pageHTML || "");
  // GAME.pageBase remplace le style de base (le jeu responsive veut des images qui débordent au départ)
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><style>${GAME.pageBase != null ? GAME.pageBase : PAGE_BASE}${L.base || ""}</style><style id="user-css">${killStyleEnd(code)}</style></head><body>${html}</body></html>`;
}
function boardDoc(L, css, kind) {
  const b = L.board || GAME.board;
  const skin = kind === "target" ? GAME.boardSkin.target : GAME.boardSkin.game;
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><style>html,body{margin:0;height:100%;color-scheme:light;background:transparent;overflow:hidden}${GAME.boardSkin.base || ""}${skin}${b.base || ""}${L.boardBase || ""}</style><style id="user-css">${killStyleEnd(css)}</style></head><body>${L.boardHTML || b.html}</body></html>`;
}
function loadFrame(frame, srcdoc) {
  return new Promise(res => {
    const done = () => { frame.removeEventListener("load", done); res(frame.contentDocument); };
    frame.addEventListener("load", done);
    frame.srcdoc = srcdoc;
  });
}
async function injectBase(doc) {
  if (!doc || !doc.head) return;
  const st = doc.createElement("style"); st.textContent = PAGE_BASE; doc.head.insertBefore(st, doc.head.firstChild);
  doc.querySelectorAll("a").forEach(a => a.addEventListener("click", e => e.preventDefault()));
  doc.querySelectorAll("form").forEach(f => f.addEventListener("submit", e => e.preventDefault()));
}

let preview = null;      // { doc, targetDoc, lastUpdate }
async function renderPreview(code, first) {
  const L = current; if (!L || L.quiz) return;
  const mode = L.mode || GAME.mode;
  if (mode === "board") {
    const g = $("#frame-game"), t = $("#frame-target");
    if (first || !preview || !preview.doc) {
      const [doc, tdoc] = await Promise.all([loadFrame(g, boardDoc(L, code, "game")), loadFrame(t, boardDoc(L, L.sandbox ? "" : L.solution, "target"))]);
      preview = { doc, targetDoc: tdoc, lastUpdate: performance.now() };
      if (L.sandbox) tdoc.body.classList.add("sandbox");
    } else {
      // on note la place de chaque élément, on applique le CSS, puis on anime le trajet (technique « FLIP »)
      const sel = (L.board || GAME.board).items;
      const items = Array.from(preview.doc.querySelectorAll(sel));
      const before = items.map(e => e.getBoundingClientRect());
      preview.doc.getElementById("user-css").textContent = killStyleEnd(code);
      preview.lastUpdate = performance.now();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      items.forEach((e, k) => {
        const a = e.getBoundingClientRect(), b = before[k];
        const dx = b.left - a.left, dy = b.top - a.top;
        if (!reduce && (Math.abs(dx) > 1 || Math.abs(dy) > 1) && e.animate) e.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 380, easing: "cubic-bezier(.3, 1.3, .5, 1)" });
      });
    }
    fitDevices();
    setTimeout(updateBoardStatus, 420);
    return;
  }
  const f = $("#frame-page");
  if (mode === "css" && preview && preview.doc && !first) {
    preview.doc.getElementById("user-css").textContent = killStyleEnd(code);
  } else {
    const doc = await loadFrame(f, pageDoc(L, code));
    if (mode === "html") await injectBase(doc);
    preview = { doc, lastUpdate: performance.now() };
    const pn = $("#page-name");
    if (pn && mode === "html" && !$("#frame-page").hidden) pn.textContent = (doc && doc.title.trim()) || "index.html";
  }
  if (!L.sandbox && $("#frame-model") && !$("#frame-model").dataset.loaded) {
    $("#frame-model").dataset.loaded = "1";
    const md2 = await loadFrame($("#frame-model"), pageDoc(L, L.model || L.solution));
    if (mode === "html") await injectBase(md2);
  }
  fitFrames();
}
/* Missions responsive (devices: true) : en mode « Ordinateur », la page est toujours
   rendue sur au moins 800 px, même si la colonne est plus étroite, puis réduite à l’écran.
   Les media queries voient donc bien un écran d’ordinateur. */
const PC_MIN = 800;
function fitDevices() {
  if (!current || !current.devices) return;
  const phone = !!$(".workbench .phone");
  $$(".workbench .board iframe").forEach(f => {
    const box = f.parentElement, w = box.clientWidth, h = box.clientHeight;
    if (!phone && w && w < PC_MIN) { const sc = w / PC_MIN; Object.assign(f.style, { width: PC_MIN + "px", height: (h / sc) + "px", transformOrigin: "0 0", transform: `scale(${sc})` }); }
    else Object.assign(f.style, { width: "", height: "", transform: "" });
  });
  ["#frame-page", "#frame-model"].forEach(sel => {
    const f = $(sel); if (!f || f.hidden) return;
    const w = f.parentElement.clientWidth, h = parseFloat(f.style.height) || f.clientHeight;
    if (!phone && w && w < PC_MIN) { const sc = w / PC_MIN; Object.assign(f.style, { width: PC_MIN + "px", transformOrigin: "0 0", transform: `scale(${sc})`, marginBottom: (-(h - h * sc)) + "px" }); }
    else Object.assign(f.style, { width: "", transform: "", marginBottom: "" });
  });
}
/* jeu responsive : l’iframe a la vraie largeur de l’écran choisi, puis elle est réduite pour tenir */
function fitScreens() {
  if (!current || !session) return;
  const sc0 = GAME.screens.find(x => x.id === session.screen) || GAME.screens[GAME.screens.length - 1];
  ["#frame-page", "#frame-model"].forEach(sel => {
    const f = $(sel); if (!f || f.hidden || !f.contentDocument || !f.contentDocument.documentElement) return;
    const pw = f.parentElement.clientWidth || sc0.w;
    Object.assign(f.style, { width: sc0.w + "px", transform: "", marginLeft: "", marginBottom: "", height: "0px" });
    const h = Math.max(240, Math.min(1600, f.contentDocument.documentElement.scrollHeight + 4));
    const sc = Math.min(1, pw / sc0.w);
    Object.assign(f.style, { height: h + "px", transformOrigin: "0 0", transform: sc < 1 ? `scale(${sc})` : "", marginLeft: sc < 1 ? "0" : Math.max(0, (pw - sc0.w) / 2) + "px", marginBottom: sc < 1 ? (-(h - h * sc)) + "px" : "" });
  });
  const pn = $("#page-name"); if (pn) pn.textContent = pn.textContent.split(" · ")[0] + " · " + sc0.label;
}
function fitFrames() {
  if (GAME.screens) return fitScreens();
  // la hauteur de l’aperçu suit le contenu (entre 220 et 560 px)
  ["#frame-page", "#frame-model"].forEach(s => {
    const f = $(s); if (!f || f.hidden || !f.contentDocument || !f.contentDocument.documentElement) return;
    f.style.height = "0px"; // on mesure le contenu, pas la hauteur actuelle de l’iframe
    const h = f.contentDocument.documentElement.scrollHeight;
    f.style.height = Math.max(220, Math.min(560, h + 4)) + "px";
  });
  fitDevices();
}

/* Plateau : chaque élément du jeu est-il sur sa cible ? */
function measureBoard() {
  if (!preview || !preview.doc || !preview.targetDoc) return null;
  const sel = (current.board || GAME.board).items;
  const items = Array.from(preview.doc.querySelectorAll(sel));
  const targets = Array.from(preview.targetDoc.querySelectorAll(sel));
  let placed = 0;
  items.forEach((el, k) => {
    const t = targets[k]; if (!t) return;
    const a = el.getBoundingClientRect(), b = t.getBoundingClientRect();
    const ok = Math.abs(a.left - b.left) < 5 && Math.abs(a.top - b.top) < 5 && Math.abs(a.width - b.width) < 5 && Math.abs(a.height - b.height) < 5;
    el.classList.toggle("on-target", ok);
    t.classList.toggle("reached", ok);
    if (ok) placed++;
  });
  return { placed, total: items.length, ok: items.length > 0 && placed === items.length };
}
function updateBoardStatus() {
  if (!current || (current.mode || GAME.mode) !== "board" || current.sandbox) return;
  const r = measureBoard(); const el = $("#board-status"); if (!r || !el) return;
  el.innerHTML = `<b>${r.placed} / ${r.total}</b> ${esc(GAME.boardSkin.word)}`;
  el.classList.toggle("all", r.ok);
}

/* =====================================================================
   NAVIGATION
   ===================================================================== */
const VIEWS = ["map", "level", "notebook", "discover", "lexique"];
function setView(name) {
  VIEWS.forEach(v => { $("#view-" + v).hidden = v !== name; });
  const nav = { map: "nav-map", notebook: "nav-notebook", discover: "nav-discover", lexique: "nav-lexique" };
  ["nav-map", "nav-notebook", "nav-discover", "nav-sandbox", "nav-lexique"].forEach(id => $("#" + id).removeAttribute("aria-current"));
  if (nav[name]) $("#" + nav[name]).setAttribute("aria-current", "page");
  if (name === "level" && current && current.sandbox) $("#nav-sandbox").setAttribute("aria-current", "page");
  window.scrollTo(0, 0);
}
function setHash(h) { if (location.hash !== "#" + h) history.replaceState(null, "", "#" + h); }
function route() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (h === "carnet") return showNotebook();
  if (h === "decouvrir") return showDiscover();
  if (h === "lexique") return showLexique();
  if (h === "bac-a-sable") return openLevel("bac-a-sable");
  if (h.startsWith("mission-")) { const id = h.slice(8); const i = levelIndex(id); if (i >= 0 && isUnlocked(i)) return openLevel(id); }
  showMap();
}
function updateStats() {
  $("#stat-stars").textContent = totalStars();
  $("#stat-max").textContent = LEVELS.length * 3;
  $("#stat-done").textContent = LEVELS.filter(l => isDone(l.id)).length;
  $("#stat-total").textContent = LEVELS.length;
  $("#brand-mascot").innerHTML = mascot();
}

/* =====================================================================
   VUE : CARTE
   ===================================================================== */
function showMap() {
  current = null; preview = null; setHash("carte");
  const done = doneChapters();
  const nb = LEVELS.filter(l => isDone(l.id)).length;
  const pct = Math.round(nb / LEVELS.length * 100);
  const nxt = nextLevel();
  const nxtIdx = nxt ? levelIndex(nxt.id) + 1 : 0;
  const allDone = nb === LEVELS.length;
  const D = GAME.discover;
  $("#view-map").innerHTML = `
  <section class="hero">
    <div>
      <p class="kicker">${esc(GAME.kicker)} · ${LEVELS.length} missions</p>
      <h1>${esc(GAME.title[0])} <span>${esc(GAME.title[1])}</span></h1>
      <p class="lead">${md(GAME.lead)}</p>
      <div class="hero-actions">
        ${allDone && GAME.next ? `<a class="btn btn-primary" href="${GAME.next.url}">${esc(MASCOT.name)} a réussi ! La suite : ${esc(GAME.next.name)} →</a>` : nxt ? `<button class="btn btn-primary" type="button" data-open="${nxt.id}">${nb ? "Continuer" : "Commencer"} : mission ${nxtIdx}</button>` : ""}
        <button class="btn ${store.seenDiscover ? "" : "btn-yellow"}" type="button" data-go="discover">${esc(D.button)}</button>
        <button class="btn btn-ghost" type="button" data-open="bac-a-sable">Bac à sable</button>
      </div>
      <div class="progress">
        <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progression"><span style="width: ${pct}%"></span></div>
        <p>${nb} / ${LEVELS.length} missions · ${totalStars()} ★ sur ${LEVELS.length * 3} · ${done.size} / ${CHAPTERS.length} ${esc(GAME.rewardWord)}</p>
      </div>
    </div>
    <div class="hero-mascot">
      <div class="bob">${mascot(allDone ? "happy" : null)}</div>
      <ul class="parts">${CHAPTERS.map(c => `<li class="${done.has(c.n) ? "got" : ""}">${done.has(c.n) ? "✓ " : ""}${esc(c.piece)}</li>`).join("")}</ul>
    </div>
  </section>
  ${window.BipCloud ? BipCloud.bannerHTML() : ""}
  ${allDone && GAME.next ? `<section class="suite-block">
    <div><p class="kicker">La suite</p><h2>${esc(GAME.next.title)}</h2><p>${md(GAME.next.text)}</p></div>
    <div><a class="btn btn-primary" href="${GAME.next.url}">Continuer dans ${esc(GAME.next.name)} →</a></div>
  </section>` : ""}
  <section class="howto" aria-label="Comment jouer">
    <div><b>1</b><p>Lis ce que demande ${esc(MASCOT.name)}, la mission et la petite leçon.</p></div>
    <div><b>2</b><p>Écris ton code : ${GAME.mode === "board" ? "le plateau" : "la page"} se met à jour <strong>en direct</strong>.</p></div>
    <div><b>3</b><p>Clique sur <strong>Vérifier</strong> (ou Ctrl + Entrée) : regarde les <strong>Objectifs</strong> et les <strong>Remarques</strong>.</p></div>
    <div><b>★</b><p>3 étoiles sans indice, 2 avec un indice, 1 avec la solution.</p></div>
  </section>
  <button class="discover-card" type="button" data-go="discover">
    <span class="dc-num">0</span>
    <span class="dc-body"><span class="kicker">Avant de commencer</span><strong>${esc(D.cardTitle)}</strong><span>${esc(D.cardText)}</span></span>
    <span class="dc-go">${store.seenDiscover ? "Relire" : "Lire"} →</span>
  </button>
  <div class="section-title"><h2>Les ${CHAPTERS.length} ateliers</h2><p>${esc(GAME.chapterNote)}</p></div>
  <section class="chapters">
    ${CHAPTERS.map(c => `
      <article class="chap ${done.has(c.n) ? "done" : ""}">
        <div class="chap-top"><span>Atelier ${c.n}</span><span class="chap-piece ${done.has(c.n) ? "got" : ""}">${done.has(c.n) ? "✓ " : esc(GAME.rewardLabel) + " : "}${esc(c.piece)}</span></div>
        <h3>${esc(c.title)}</h3>
        <div class="chips">${c.notions.map(n => `<code>${esc(n)}</code>`).join("")}</div>
        ${c.skills ? `<details class="skills"><summary>${done.has(c.n) ? "Ce que tu sais faire" : "Ce que tu vas apprendre"}</summary><ul>${c.skills.map(k => `<li class="${done.has(c.n) ? "got" : ""}">${md(k)}</li>`).join("")}</ul></details>` : ""}
        <ol class="nodes">
          ${LEVELS.map((l, i) => ({ l, i })).filter(o => o.l.ch === c.n).map(({ l, i }) => {
            const p = store.progress[l.id]; const unlocked = isUnlocked(i);
            const cls = p ? "done" : (nxt && nxt.id === l.id ? "next" : "");
            return `<li><button class="node ${cls}" type="button" data-open="${l.id}" ${unlocked ? "" : "disabled"} aria-label="Mission ${i + 1} : ${esc(l.title)}${unlocked ? "" : " (verrouillée)"}">
              <span class="node-num">${l.quiz ? "?" : i + 1}</span>
              <span class="node-title">${esc(l.title)}<small>${l.quiz ? "Quiz" : l.boss ? "Mission finale" : esc(l.notion)}</small></span>
              <span class="node-stars">${p ? starsHTML(p.stars) : (unlocked ? "" : "🔒")}</span>
            </button></li>`;
          }).join("")}
        </ol>
      </article>`).join("")}
  </section>`;
  setView("map");
  updateStats();
}

/* =====================================================================
   VUE : DÉCOUVRIR (c’est quoi, à quoi ça sert, pourquoi)
   ===================================================================== */
function showDiscover() {
  current = null; preview = null; setHash("decouvrir");
  if (!store.seenDiscover) { store.seenDiscover = true; save(); }
  const D = GAME.discover;
  const trio = [
    { k: "html", name: "HTML", role: "La structure", img: "les murs et les pièces", text: "Il dit **ce qu’il y a** dans la page : un titre, un texte, une image, un bouton.", url: GAME.links.html },
    { k: "css", name: "CSS", role: "Le style", img: "la peinture et la déco", text: "Il dit **à quoi ça ressemble** : couleurs, tailles, polices, et où chaque chose se place.", url: GAME.links.css },
    { k: "js", name: "JavaScript", role: "Le comportement", img: "l’électricité", text: "Il dit **ce qui se passe** quand on clique, qu’on tape ou qu’on fait défiler.", url: GAME.links.js }
  ];
  $("#view-discover").innerHTML = `
  <section class="disc-hero">
    <div>
      <p class="kicker">${esc(D.kicker)}</p>
      <h1>${md(D.title)}</h1>
      <p class="lead">${md(D.lead)}</p>
    </div>
    <div class="disc-mascot"><div class="says says-big"><div>${mascot()}</div><p class="bubble">${md(D.say)}</p></div></div>
  </section>

  <section class="disc-cards">
    ${D.cards.map((c, k) => `<article class="card disc-card"><span class="disc-num">${k + 1}</span><h2>${esc(c.title)}</h2>${(Array.isArray(c.text) ? c.text : [c.text]).map(t => `<p>${md(t)}</p>`).join("")}${c.list ? `<ul>${c.list.map(x => `<li>${md(x)}</li>`).join("")}</ul>` : ""}</article>`).join("")}
  </section>

  ${D.before ? `<section class="disc-block">
    <div class="card before">
      <p class="card-kicker">Avant de commencer</p>
      <h2>${esc(D.before.title || "Ce qu’il faut savoir avant de commencer")}</h2>
      ${D.before.text ? `<p>${md(D.before.text)}</p>` : ""}
      <ul>${D.before.items.map(x => `<li>${md(x)}</li>`).join("")}</ul>
      ${D.before.link ? `<p><a class="btn btn-small" href="${D.before.link.url}">${esc(D.before.link.label)}</a></p>` : ""}
    </div>
  </section>` : ""}

  <section class="disc-block">
    <div class="section-title"><h2>Une page web, c’est une maison</h2><p>Trois langages, trois rôles. Ils travaillent toujours ensemble.</p></div>
    <div class="trio">${trio.map(t => `<a class="trio-item ${t.k === D.trioFocus ? "focus" : ""}" ${t.url ? `href="${t.url}"` : ""}>
      <span class="trio-name">${t.name}</span><span class="trio-role">${t.role}</span><span class="trio-img">= ${t.img}</span><span class="trio-text">${md(t.text)}</span>
      ${t.k === D.trioFocus ? `<span class="trio-here">${esc(D.trioHere)}</span>` : t.url ? `<span class="trio-link">Le jeu ${t.name} →</span>` : ""}
    </a>`).join("")}</div>
    ${D.trioNote ? `<p class="disc-note">${md(D.trioNote)}</p>` : ""}
  </section>

  ${D.demo ? `<section class="disc-block">
    <div class="section-title"><h2>${esc(D.demo.title)}</h2><p>${md(D.demo.text)}</p></div>
    <div class="demo card">
      <div class="demo-controls" role="group" aria-label="Variantes">${D.demo.variants.map((v, k) => `<button type="button" class="seg ${k === 0 ? "on" : ""}" data-demo="${k}">${esc(v.label)}</button>`).join("")}</div>
      <div class="demo-grid">
        <div><p class="mini-label">Le code</p><pre class="code-block" id="demo-code"></pre></div>
        <div><p class="mini-label">Ce que le navigateur affiche</p><div class="browser"><div class="browser-bar"><i></i><i></i><i></i><span>demo.html</span></div><iframe id="demo-frame" title="Démo" sandbox="allow-same-origin"></iframe></div><p class="demo-caption" id="demo-caption"></p></div>
      </div>
    </div>
  </section>` : ""}

  ${D.anatomy ? `<section class="disc-block">
    <div class="section-title"><h2>${esc(D.anatomy.title)}</h2><p>${md(D.anatomy.text || "")}</p></div>
    <div class="card anatomy"><pre class="code-block big">${highlight(D.anatomy.code, D.anatomy.lang)}</pre><dl class="pieces">${D.anatomy.pieces.map(([k, d]) => `<div><dt><code>${esc(k)}</code></dt><dd>${md(d)}</dd></div>`).join("")}</dl></div>
  </section>` : ""}

  ${D.compare ? `<section class="disc-block">
    <div class="section-title"><h2>${esc(D.compare.title)}</h2><p>${md(D.compare.text || "")}</p></div>
    <div class="compare">${D.compare.cols.map(c => `<article class="card ${c.focus ? "focus" : ""}"><h3>${esc(c.title)}</h3>${c.svg || ""}<ul>${c.items.map(x => `<li>${md(x)}</li>`).join("")}</ul></article>`).join("")}</div>
  </section>` : ""}

  <section class="disc-block">
    <div class="section-title"><h2>${esc(D.usesTitle || "Où on le voit dans la vraie vie")}</h2></div>
    <div class="uses">${D.uses.map(u => `<article class="card use"><h3>${esc(u.title)}</h3><p>${md(u.text)}</p></article>`).join("")}</div>
  </section>

  ${D.jobs ? `<section class="disc-block">
    <div class="section-title"><h2>${esc(D.jobs.title)}</h2><p>${md(D.jobs.text || "")}</p></div>
    <div class="uses jobs">${D.jobs.items.map(u => `<article class="card use job"><p class="card-kicker">Métier</p><h3>${esc(u.title)}</h3><p>${md(u.text)}</p></article>`).join("")}</div>
  </section>` : ""}

  <section class="disc-block disc-two">
    <article class="card"><p class="card-kicker">Le vocabulaire</p><dl class="glossary">${D.words.map(([k, d]) => `<div><dt>${md(k)}</dt><dd>${md(d)}</dd></div>`).join("")}</dl></article>
    <article class="card"><p class="card-kicker">Les pièges du débutant</p><ul class="traps">${D.traps.map(t => `<li>${md(t)}</li>`).join("")}</ul>
      ${D.tools ? `<p class="card-kicker" style="margin-top:18px">Pour coder chez toi</p><ul class="traps">${D.tools.map(t => `<li>${md(t)}</li>`).join("")}</ul>` : ""}</article>
  </section>

  <section class="disc-cta card">
    <div>${mascot("happy")}</div>
    <div><h2>${esc(D.ctaTitle)}</h2><p>${md(D.ctaText)}</p></div>
    <div class="hero-actions">${nextLevel() ? `<button class="btn btn-primary" type="button" data-open="${nextLevel().id}">Jouer : mission ${levelIndex(nextLevel().id) + 1} →</button>` : ""}<button class="btn" type="button" data-go="map">Voir la carte</button></div>
  </section>`;
  setView("discover");
  updateStats();
  if (D.demo) {
    const show = k => {
      const v = D.demo.variants[k];
      $$("[data-demo]").forEach(b => b.classList.toggle("on", +b.dataset.demo === k));
      const lang = v.lang || D.demo.lang || GAME.lang;
      $("#demo-code").innerHTML = highlight(v.show || (lang === "css" ? v.css : v.html), lang);
      $("#demo-caption").innerHTML = md(v.caption || "");
      const html = v.html != null ? v.html : D.demo.html;
      const css = (D.demo.base || "") + (v.css || "");
      loadFrame($("#demo-frame"), `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">${v.raw ? "" : `<style>${PAGE_BASE}${killStyleEnd(css)}</style>`}</head><body>${html}</body></html>`).then(doc => {
        const f = $("#demo-frame"); if (f && doc) { f.style.height = "0px"; f.style.height = Math.max(140, Math.min(460, doc.documentElement.scrollHeight + 4)) + "px"; }
      });
    };
    $$("[data-demo]").forEach(b => b.addEventListener("click", () => show(+b.dataset.demo)));
    show(0);
  }
}

/* =====================================================================
   VUE : MISSION
   ===================================================================== */
function openLevel(id) {
  const L = id === "bac-a-sable" ? GAME.sandbox : LEVELS.find(l => l.id === id);
  if (!L) return showMap();
  current = L; preview = null;
  session = { hints: 0, solution: false, attempts: 0, answers: {}, errLine: null, screen: GAME.screens ? (GAME.screenDefault || GAME.screens[GAME.screens.length - 1].id) : null };
  if (!L.sandbox) trk("open", L.id);
  setHash(L.sandbox ? "bac-a-sable" : "mission-" + L.id);
  const i = levelIndex(L.id);
  const ch = CHAPTERS.find(c => c.n === L.ch);
  const prev = i > 0 ? LEVELS[i - 1] : null;
  const next = i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
  const p = store.progress[L.id];

  const head = `
  <div class="level-head">
    <button class="btn btn-small btn-ghost" type="button" data-go="map">← Carte</button>
    <div class="level-title">
      <span class="where">${L.sandbox ? "Mode libre" : `Atelier ${L.ch} · ${esc(ch.title)} · Mission ${i + 1} / ${LEVELS.length}`}</span>
      <h2>${esc(L.title)} ${p ? `<span class="node-stars" style="font-size:1.1rem">${starsHTML(p.stars)}</span>` : ""}</h2>
    </div>
    ${L.sandbox ? "" : `<div class="level-nav">
      <button class="btn btn-small" type="button" ${prev ? `data-open="${prev.id}"` : "disabled"} aria-label="Mission précédente">◀</button>
      <button class="btn btn-small" type="button" ${next && isUnlocked(i + 1) ? `data-open="${next.id}"` : "disabled"} aria-label="Mission suivante">▶</button>
    </div>`}
  </div>`;

  const says = `<div class="says"><div id="says-mascot">${mascot()}</div><p class="bubble">${md(L.say)}</p></div>`;
  let brief, bench;
  if (L.quiz) {
    brief = says + `<section class="card mission"><p class="card-kicker">Ta mission</p><h3>Réponds juste à toutes les questions</h3><p>Choisis une réponse par question, puis clique sur <strong>Vérifier mes réponses</strong>. Les explications s’affichent après.</p></section>`;
    bench = quizHTML(L);
  } else if (L.sandbox) {
    brief = says + `<section class="card mission"><p class="card-kicker">Idées d’essais</p><ul class="steps">${L.ideas.map(s => `<li>${md(s)}</li>`).join("")}</ul></section>`;
    bench = benchHTML(L);
  } else {
    brief = says + `
      <section class="card mission"><p class="card-kicker">Ta mission</p><ol class="steps">${L.steps.map(s => `<li>${md(s)}</li>`).join("")}</ol></section>
      ${lessonHTML(L)}
      <section class="card help" id="help" hidden><p class="card-kicker">Indices</p><ol class="hint-list" id="hint-list"></ol><div id="solution-box" hidden><p class="mini-label">Solution</p><pre class="code-block">${highlight(L.solution, L.lang)}</pre><button class="btn btn-small" type="button" id="copy-solution">Copier dans l’éditeur</button></div></section>`;
    bench = benchHTML(L);
  }
  $("#view-level").innerHTML = head + `<div class="level-grid"><div class="brief">${brief}</div><div class="workbench">${bench}</div></div>`;
  setView("level");
  updateStats();
  if (L.quiz) return bindQuiz(L);
  if (L.lesson && L.lesson.example) renderExample(L);

  const ta = $("#code");
  ta.value = store.drafts[L.id] != null ? store.drafts[L.id] : L.starter;
  bindEditor(ta);
  renderGoals(null);
  if (!L.goals) selectTab("lint");
  renderPreview(ta.value, true).then(() => lint(ta.value));
}

function lessonHTML(L) {
  const s = L.lesson;
  const ex = s.example;
  return `<section class="card lesson">
    <p class="card-kicker">La leçon · ${esc(L.notion)}</p>
    ${(Array.isArray(s.what) ? s.what : [s.what]).map(t => `<p>${md(t)}</p>`).join("")}
    ${s.why ? `<div class="why"><p class="mini-label">À quoi ça sert ?</p><p>${md(s.why)}</p></div>` : ""}
    <pre class="code-block">${highlight(s.code, s.lang)}</pre>
    <dl class="pieces">${s.pieces.map(([k, d]) => `<div><dt><code>${esc(k)}</code></dt><dd>${md(d)}</dd></div>`).join("")}</dl>
    ${ex ? `<div class="example"><p class="mini-label">Exemple</p><pre class="code-block">${highlight(ex.code, ex.lang)}</pre><p class="mini-label">Résultat</p><div class="browser small"><iframe id="example-frame" title="Résultat de l’exemple" sandbox="allow-same-origin"></iframe></div></div>` : ""}
    ${s.trap ? `<div class="trap"><p class="mini-label">Piège à éviter</p><p>${md(s.trap)}</p></div>` : ""}
    ${s.good ? `<div class="good"><p class="mini-label">Bonne pratique</p>${(Array.isArray(s.good) ? s.good : [s.good]).map(t => `<p>${md(t)}</p>`).join("")}</div>` : ""}
  </section>`;
}
function renderExample(L) {
  const ex = L.lesson.example; const f = $("#example-frame"); if (!f) return;
  const mode = L.mode || GAME.mode;
  let doc;
  if ((ex.lang || GAME.lang) === "html") doc = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><style>${PAGE_BASE}body{margin:12px}${ex.css || ""}</style></head><body>${ex.code}</body></html>`;
  else doc = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><style>${PAGE_BASE}body{margin:12px}${ex.base || ""}${killStyleEnd(ex.code)}</style></head><body>${ex.html || ""}</body></html>`;
  loadFrame(f, doc).then(d => { if (d) { f.style.height = "0px"; f.style.height = Math.max(60, Math.min(320, d.documentElement.scrollHeight + 2)) + "px"; } });
}

function benchHTML(L) {
  const mode = L.mode || GAME.mode;
  const lang = L.lang || GAME.lang;
  let view;
  if (mode === "board") {
    view = `<div class="preview card board-card">
      <div class="preview-head"><span class="mini-label">${esc(GAME.boardSkin.title)}</span>${L.devices ? `<div class="segs devices" role="group" aria-label="Taille d’écran"><button type="button" class="seg on" data-device="pc">Ordinateur</button><button type="button" class="seg" data-device="phone">Téléphone</button></div>` : ""}${L.sandbox ? "" : `<span class="board-status" id="board-status" aria-live="polite"></span>`}</div>
      <div class="board" style="height:${L.boardHeight || GAME.boardSkin.height || 320}px"><iframe id="frame-target" title="Les cibles" sandbox="allow-same-origin"></iframe><iframe id="frame-game" title="Ton plateau" sandbox="allow-same-origin"></iframe></div>
      ${L.sandbox ? "" : `<p class="board-legend">${md(GAME.boardSkin.legend)}</p>`}
    </div>`;
  } else {
    view = `<div class="preview card">
      <div class="preview-head">
        ${L.sandbox ? `<span class="mini-label">Ta page</span>` : `<div class="segs" role="tablist" aria-label="Aperçu"><button type="button" class="seg on" data-view="page">Ton résultat</button><button type="button" class="seg" data-view="model">Le modèle à reproduire</button></div>`}
        ${L.devices ? `<div class="segs devices" role="group" aria-label="Taille d’écran"><button type="button" class="seg on" data-device="pc">Ordinateur</button><button type="button" class="seg" data-device="phone">Téléphone</button></div>` : ""}${GAME.screens ? `<div class="segs screens" role="group" aria-label="Taille d’écran">${GAME.screens.map(x => `<button type="button" class="seg ${x.id === (session.screen || GAME.screens[GAME.screens.length - 1].id) ? "on" : ""}" data-screen="${x.id}">${esc(x.label)} <small>${x.w}px</small></button>`).join("")}</div>` : ""}<span class="live-dot">en direct</span>
      </div>
      <div class="browser"><div class="browser-bar"><i></i><i></i><i></i><span id="page-name">${esc(L.file || (mode === "html" ? "index.html" : "ma-page.html"))}</span></div>
        <iframe id="frame-page" title="Ton résultat" sandbox="allow-same-origin"></iframe>
        ${L.sandbox ? "" : `<iframe id="frame-model" title="Le modèle" sandbox="allow-same-origin" hidden></iframe>`}
      </div>
    </div>`;
  }
  const given = mode !== "html" ? (L.boardHTML || L.html || (mode === "board" ? (L.board || GAME.board).html : GAME.pageHTML)) : null;
  const pre = given ? `<details class="prelude" ${L.showHTML ? "open" : ""}><summary><span>Le HTML de la page (déjà écrit, lecture seule)</span><span class="prelude-tip">clique pour ${L.showHTML ? "replier" : "voir les classes"}</span></summary><pre>${hlHTML(given.trim())}</pre></details>` : "";
  return `${view}${pre}
  <div class="editor"><div class="editor-tab">${lang === "css" ? "style.css" : (L.file || "index.html")}</div><div class="editor-body"><div class="gutter" id="gutter" aria-hidden="true"></div><div class="code-wrap"><pre class="hl" id="hl" aria-hidden="true"></pre><textarea id="code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Éditeur de code ${lang.toUpperCase()}"></textarea></div></div></div>
  <div class="actions">
    ${L.sandbox ? "" : `<button class="btn btn-primary" type="button" id="run">✓ Vérifier</button><button class="btn" type="button" id="hint">Indice (${L.hints.length})</button><button class="btn btn-ghost" type="button" id="show-solution">Solution</button>`}
    <button class="btn btn-ghost" type="button" id="reset">Recommencer</button>
    ${L.sandbox ? "" : `<span class="kbd">Ctrl + Entrée pour vérifier</span>`}
  </div>
  <div class="results">
    <div class="tabs" role="tablist">
      ${L.goals ? `<button class="tab" role="tab" id="tab-goals" data-tab="goals">Objectifs <span class="badge" id="badge-goals">0 / ${L.goals.length}</span></button>` : ""}
      <button class="tab" role="tab" id="tab-lint" data-tab="lint">Remarques <span class="badge" id="badge-lint" hidden></span></button>
      ${lang === "html" ? `<button class="tab" role="tab" id="tab-tree" data-tab="tree">Arbre</button>` : ""}
    </div>
    ${L.goals ? `<div class="panel" role="tabpanel" id="panel-goals"><ul class="goals" id="goals"></ul><p class="goals-note" id="goals-note"></p></div>` : ""}
    <div class="panel" role="tabpanel" id="panel-lint"><div class="lint" id="lint-out"></div></div>
    ${lang === "html" ? `<div class="panel" role="tabpanel" id="panel-tree"><p class="tree-note">Le navigateur range les balises comme un arbre : chaque balise est la <b>parente</b> de celles qu’elle contient.</p><div class="tree" id="tree-out"></div></div>` : ""}
  </div>`;
}

function selectTab(name) {
  $$(".tab").forEach(t => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
  $$("#view-level .panel").forEach(p => { p.hidden = p.id !== "panel-" + name; });
}

/* ---------- Éditeur ---------- */
let liveTimer = null;
function bindEditor(ta) {
  const hl = $("#hl"), gutter = $("#gutter");
  const lang = current.lang || GAME.lang;
  const paint = () => {
    const lines = ta.value.split("\n").length;
    const err = session && session.errLine;
    hl.innerHTML = `<div class="hl-inner">${err ? `<div class="errbar" style="top:${(err - 1) * 22}px"></div>` : ""}${highlight(ta.value, lang)}\n</div>`;
    let g = "";
    for (let n = 1; n <= Math.max(lines, 1); n++) g += `<div class="${n === err ? "err" : ""}">${n}</div>`;
    gutter.innerHTML = g;
    sync();
  };
  const sync = () => {
    const inner = hl.firstElementChild;
    if (inner) inner.style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`;
    gutter.scrollTop = ta.scrollTop;
  };
  const insert = t => { if (!document.execCommand || !document.execCommand("insertText", false, t)) { ta.setRangeText(t, ta.selectionStart, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input")); } };
  ta.addEventListener("input", () => {
    paint();
    if (current) { store.drafts[current.id] = ta.value; save(); }
    clearTimeout(liveTimer);
    liveTimer = setTimeout(async () => { await renderPreview(ta.value, (current.mode || GAME.mode) === "html"); lint(ta.value); }, 320);
  });
  ta.addEventListener("scroll", sync);
  ta.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runCode(); return; }
    if (e.key === "Tab" && !e.shiftKey && !e.altKey) { e.preventDefault(); insert("  "); return; }
    if (e.key === "Enter" && !e.shiftKey) {
      const before = ta.value.slice(0, ta.selectionStart);
      const after = ta.value.slice(ta.selectionEnd);
      const line = before.split("\n").pop();
      let ind = line.match(/^\s*/)[0];
      const opensBlock = /[{]\s*$/.test(line) || (lang === "html" && /<([a-z][\w-]*)[^>]*>\s*$/i.test(line) && !/<\/[^>]+>\s*$/.test(line) && !VOID_TAGS.has((line.match(/<([a-z][\w-]*)[^>]*>\s*$/i) || [])[1]));
      e.preventDefault();
      if (opensBlock && (/^\s*}/.test(after) || /^\s*<\//.test(after))) { insert("\n" + ind + "  " + "\n" + ind); ta.selectionStart = ta.selectionEnd = ta.selectionStart - ind.length - 1; return; }
      insert("\n" + ind + (opensBlock ? "  " : ""));
    }
  });
  ta._paint = paint;
  paint();
}

/* ---------- Remarques (vérificateur) ---------- */
function lint(code) {
  if (!current || current.quiz) return [];
  const lang = current.lang || GAME.lang;
  let issues, tree = "";
  if (lang === "html") {
    issues = lintHTML(code);
    if (preview && preview.doc) tree = treeHTML(preview.doc);
  } else {
    const r = lintCSS(code, preview && preview.doc);
    issues = r.issues;
    session.rules = r.rules;
  }
  session.issues = issues;
  const errs = issues.filter(x => x.level === "error");
  session.errLine = errs.length ? errs[0].line : null;
  $("#code")._paint();
  const out = $("#lint-out");
  if (out) out.innerHTML = issues.length
    ? issues.map(x => `<div class="lint-item ${x.level}"><span class="lint-where">${x.level === "error" ? "Erreur" : x.level === "warn" ? "Attention" : "Conseil"} · ligne ${x.line}</span><p>${md(x.msg)}</p></div>`).join("")
    : `<p class="lint-ok">✓ Aucune erreur d’écriture repérée. ${lang === "html" ? "Ton HTML est bien construit." : "Ton CSS est bien écrit."}</p>`;
  const b = $("#badge-lint");
  if (b) { b.hidden = !issues.length; b.textContent = errs.length || issues.length; b.className = "badge" + (errs.length ? " red" : " soft"); }
  const tr = $("#tree-out"); if (tr) tr.innerHTML = tree;
  return issues;
}
function treeHTML(doc) {
  const walk = (el, d) => {
    if (d > 12) return "";
    const kids = Array.from(el.childNodes).filter(n => n.nodeType === 1 && !(n.tagName === "STYLE" && n.textContent.startsWith("html{color-scheme")) || (n.nodeType === 3 && n.textContent.trim()));
    const tag = el.tagName.toLowerCase();
    const attrs = Array.from(el.attributes).slice(0, 3).map(a => ` <span class="t-attr">${esc(a.name)}</span>=<span class="t-str">"${esc(a.value.length > 24 ? a.value.slice(0, 24) + "…" : a.value)}"</span>`).join("");
    return `<li><span class="node-tag"><span class="t-tag">&lt;${tag}</span>${attrs}<span class="t-tag">&gt;</span></span>${kids.length ? `<ul>${kids.map(k => k.nodeType === 3 ? `<li class="tx">« ${esc(k.textContent.trim().slice(0, 40))}${k.textContent.trim().length > 40 ? "…" : ""} »</li>` : walk(k, d + 1)).join("")}</ul>` : ""}</li>`;
  };
  return `<ul class="tree-root">${walk(doc.documentElement, 0)}</ul>`;
}

/* ---------- Vérifier ---------- */
async function runCode() {
  const L = current; if (!L || L.quiz || L.sandbox) return;
  const ta = $("#code"); const code = ta.value;
  store.drafts[L.id] = code; save();
  session.attempts++;
  $("#run").disabled = true;
  clearTimeout(liveTimer);
  const mode = L.mode || GAME.mode;
  await renderPreview(code, mode === "html" || !preview);
  if (mode === "board") await wait(Math.max(0, 430 - (performance.now() - preview.lastUpdate)));
  const issues = lint(code);
  const c = { code, clean: stripComments(code, L.lang || GAME.lang), doc: preview && preview.doc, issues, rules: session.rules || [], L };
  let hidden = null;
  if (GAME.screens) {
    hidden = document.createElement("div");
    hidden.setAttribute("aria-hidden", "true");
    hidden.style.cssText = "position:absolute;left:-30000px;top:0;visibility:hidden;pointer-events:none";
    document.body.appendChild(hidden);
    c.at = {};
    await Promise.all(GAME.screens.map(async x => {
      const f = document.createElement("iframe");
      f.setAttribute("sandbox", "allow-same-origin");
      f.style.cssText = `width:${x.w}px;height:900px;border:0`;
      hidden.appendChild(f);
      c.at[x.id] = await loadFrame(f, pageDoc(L, code));
    }));
    await wait(60);
  }
  if (mode === "board") { c.board = measureBoard(); updateBoardStatus(); }
  const results = L.goals.map(g => { let r; try { r = g.test(c); } catch (e) { console.warn(e); r = false; } return { ok: r === true, detail: typeof r === "string" ? r : null }; });
  if (hidden) hidden.remove();
  $("#run").disabled = false;
  renderGoals(results);
  const all = results.every(r => r.ok);
  const firstErr = issues.find(x => x.level === "error");
  trk("run", L.id, { error: firstErr ? "Ligne " + firstErr.line + " : " + firstErr.msg.replace(/`/g, "") : null, ok: all, goals: [results.filter(r => r.ok).length, results.length] });
  if (all) { setMood("happy"); setTimeout(() => success(L), 300); }
  else { selectTab(issues.some(x => x.level === "error") && !results[0].ok ? "lint" : "goals"); setMood("think"); }
}
function setMood(mood) { const s = $("#says-mascot"); if (s) s.innerHTML = mascot(mood); }
function renderGoals(results) {
  const L = current; if (!L.goals) return;
  $("#goals").innerHTML = L.goals.map((g, i) => {
    const r = results && results[i];
    const st = !r ? "todo" : r.ok ? "ok" : "ko";
    return `<li class="goal ${st}"><span class="goal-icon" aria-hidden="true">${st === "ok" ? "✓" : st === "ko" ? "✗" : "○"}</span><span><span>${md(g.label)}</span>${r && r.detail ? `<span class="goal-detail">${md(r.detail)}</span>` : ""}</span></li>`;
  }).join("");
  const okN = results ? results.filter(r => r.ok).length : 0;
  const b = $("#badge-goals"); b.textContent = okN + " / " + L.goals.length; b.className = "badge" + (results && okN === L.goals.length ? " green" : "");
  $("#goals-note").textContent = !results ? "Clique sur Vérifier : le jeu contrôle chaque objectif." : "";
  if (!results) selectTab("goals");
}

/* ---------- Indices et solution ---------- */
function showHint() {
  const L = current; if (session.hints >= L.hints.length) return;
  session.hints++; trk("hint", L.id);
  $("#help").hidden = false;
  $("#hint-list").innerHTML = L.hints.slice(0, session.hints).map(h => `<li>${md(h)}</li>`).join("");
  const left = L.hints.length - session.hints;
  const b = $("#hint"); b.textContent = left ? `Indice (${left})` : "Plus d’indice"; b.disabled = !left;
  $("#help").scrollIntoView({ block: "nearest", behavior: "smooth" });
}
function twoStep(btn, ask, action) {
  if (btn.classList.contains("confirming")) { btn.classList.remove("confirming"); btn.textContent = btn.dataset.label; action(); return; }
  btn.dataset.label = btn.textContent; btn.textContent = ask; btn.classList.add("confirming");
  setTimeout(() => { if (btn.classList.contains("confirming")) { btn.classList.remove("confirming"); btn.textContent = btn.dataset.label; } }, 4000);
}

/* =====================================================================
   QUIZ
   ===================================================================== */
function quizHTML(L) {
  return `<div class="quiz">${L.questions.map((qq, qi) => `
    <fieldset class="q" id="q-${qi}">
      <legend>Question ${qi + 1} / ${L.questions.length}</legend>
      <p class="q-text">${md(qq.q)}</p>
      ${qq.code ? `<pre class="code-block">${highlight(qq.code, qq.lang)}</pre>` : ""}
      <div class="opts" role="radiogroup" aria-label="Question ${qi + 1}">${qq.opts.map((o, oi) => `<button type="button" class="opt" role="radio" aria-checked="false" data-q="${qi}" data-o="${oi}">${md(o)}</button>`).join("")}</div>
      <p class="q-why" hidden></p>
    </fieldset>`).join("")}
    <div class="quiz-foot"><button class="btn btn-primary" type="button" id="quiz-check">Vérifier mes réponses</button><span id="quiz-msg" aria-live="polite"></span></div>
  </div>`;
}
function bindQuiz(L) {
  $$(".opt").forEach(b => b.addEventListener("click", () => {
    const qi = +b.dataset.q;
    session.answers[qi] = +b.dataset.o;
    $$(`.opt[data-q="${qi}"]`).forEach(o => { o.setAttribute("aria-checked", String(o === b)); o.classList.remove("right", "wrong"); });
  }));
  $("#quiz-check").addEventListener("click", () => {
    const msg = $("#quiz-msg");
    if (Object.keys(session.answers).length < L.questions.length) { msg.textContent = "Réponds d’abord à toutes les questions."; return; }
    session.attempts++;
    let good = 0;
    L.questions.forEach((qq, qi) => {
      const chosen = session.answers[qi];
      const ok = chosen === qq.a; if (ok) good++;
      $$(`.opt[data-q="${qi}"]`).forEach(o => { o.classList.remove("right", "wrong"); if (+o.dataset.o === chosen) o.classList.add(ok ? "right" : "wrong"); });
      const why = $(`#q-${qi} .q-why`); why.hidden = false; why.innerHTML = (ok ? "<strong>Juste.</strong> " : "<strong>Pas tout à fait.</strong> ") + md(qq.why);
    });
    if (good === L.questions.length) { msg.textContent = "Tout est juste !"; setMood("happy"); setTimeout(() => success(L), 400); }
    else { trk("wrong", L.id); msg.textContent = `${good} / ${L.questions.length} bonnes réponses. Lis les explications et corrige.`; setMood("think"); }
  });
}

/* =====================================================================
   RÉUSSITE
   ===================================================================== */
function success(L) {
  if (L.sandbox) return;
  const allDoneBefore = LEVELS.every(l => isDone(l.id));
  const stars = L.quiz ? (session.attempts <= 1 ? 3 : session.attempts === 2 ? 2 : 1) : (session.solution ? 1 : session.hints > 0 ? 2 : 3);
  const before = store.progress[L.id];
  const chapterBefore = chapterDone(L.ch);
  store.progress[L.id] = { stars: Math.max(before ? before.stars : 0, stars) };
  trk("done", L.id, { stars });
  save(); updateStats();
  const newPiece = !chapterBefore && chapterDone(L.ch);
  const allDone = LEVELS.every(l => isDone(l.id));
  const i = levelIndex(L.id);
  const next = LEVELS[i + 1];
  const ch = CHAPTERS.find(c => c.n === L.ch);
  const finale = allDone && !allDoneBefore;
  $("#dialog").innerHTML = `
    <div class="dialog-top"><div class="dialog-mascot">${mascot("happy")}</div><div><p class="card-kicker">Mission ${i + 1} réussie</p><h2 id="modal-title">${finale ? esc(GAME.finaleTitle) : "Bien joué !"}</h2><div class="big-stars" aria-label="${stars} étoiles sur 3">${starsHTML(stars)}</div></div></div>
    ${newPiece ? `<p class="new-piece">${esc(GAME.rewardMsg)} ${esc(ch.piece)} ! Atelier ${ch.n} terminé.</p>` : ""}
    ${newPiece && ch.skills ? `<div class="recap"><p class="mini-label">Bilan de l’atelier : ce que tu sais faire maintenant</p><ul>${ch.skills.map(k => `<li>${md(k)}</li>`).join("")}</ul></div>` : ""}
    <div><p class="mini-label">Ce qu’il faut retenir</p><p>${md(L.debrief)}</p></div>
    ${finale && GAME.next ? `<div class="suite-box"><p class="mini-label">La suite</p><p>${md(GAME.next.text)}</p></div>` : ""}
    ${stars < 3 ? `<p style="color:var(--ink-soft);font-size:.92rem">Tu peux rejouer la mission plus tard sans indice pour gagner 3 étoiles.</p>` : ""}
    <div class="dialog-actions">
      <button class="btn btn-ghost" type="button" id="modal-stay">Rester ici</button>
      ${finale && GAME.next ? `<a class="btn btn-primary" href="${GAME.next.url}">${esc(GAME.next.name)} →</a>` : next && !allDone ? `<button class="btn btn-primary" type="button" id="modal-next">Mission suivante →</button>` : `<button class="btn btn-primary" type="button" id="modal-map">${esc(MASCOT.see || "Voir " + MASCOT.name + " sur la carte")}</button>`}
    </div>`;
  $("#modal").hidden = false;
  const close = () => { $("#modal").hidden = true; };
  $("#modal-stay").addEventListener("click", close);
  if ($("#modal-next")) { $("#modal-next").addEventListener("click", () => { close(); openLevel(next.id); }); $("#modal-next").focus(); }
  if ($("#modal-map")) { $("#modal-map").addEventListener("click", () => { close(); showMap(); }); $("#modal-map").focus(); }
  confetti(newPiece || allDone ? 160 : 70);
}
function confetti(n) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = $("#confetti"); cv.hidden = false;
  const ctx = cv.getContext("2d"); cv.width = innerWidth; cv.height = innerHeight;
  const colors = GAME.confetti;
  const ps = Array.from({ length: n }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 4, c: colors[Math.floor(Math.random() * colors.length)], a: Math.random() * 6 }));
  const t0 = performance.now();
  const tick = t => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .45; p.a += .2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
    if (t - t0 < 1800) requestAnimationFrame(tick); else { ctx.clearRect(0, 0, cv.width, cv.height); cv.hidden = true; }
  };
  requestAnimationFrame(tick);
}

/* =====================================================================
   VUE : LEXIQUE (vocabulaire, bonnes pratiques, prêt pour la suite ?)
   ===================================================================== */
function showLexique() {
  current = null; preview = null; setHash("lexique");
  const key = t => t.replace(/[`<>.#:@*!-]/g, "").trim();
  const words = (GAME.glossary || []).slice().sort((a, b) => key(a[0]).localeCompare(key(b[0]), "fr"));
  const checks = store.checks || {};
  const list = GAME.checklist || [];
  const nOk = list.filter((_, k) => checks[k]).length;
  const nextName = GAME.next ? GAME.next.name : "la suite";
  $("#view-lexique").innerHTML = `
    <div class="section-title"><div><p class="kicker">Le mémo</p><h2>Lexique et bonnes pratiques</h2></div><p>Les mots à connaître, les bons réflexes, et de quoi vérifier que tu es prêt pour la suite.</p></div>
    <div class="lex-layout">
      <section class="card lex-words">
        <div class="lex-head"><p class="card-kicker">Le lexique · ${words.length} mots</p><input type="search" id="lex-search" placeholder="Chercher un mot…" aria-label="Chercher un mot du lexique"></div>
        <dl class="lexicon" id="lexicon">${words.map(([k, d, ex]) => `<div data-k="${esc((k + " " + d).toLowerCase())}"><dt>${md(k)}</dt><dd><span>${md(d)}</span>${ex ? `<pre class="code-block small">${highlight(ex)}</pre>` : ""}</dd></div>`).join("")}</dl>
        <p class="lex-empty" id="lex-empty" hidden>Aucun mot trouvé.</p>
      </section>
      <div class="lex-side">
        ${GAME.practices ? `<section class="card"><p class="card-kicker">Les bonnes pratiques</p><ol class="practices">${GAME.practices.map(t => `<li>${md(t)}</li>`).join("")}</ol></section>` : ""}
        ${list.length ? `<section class="card ready">
          <p class="card-kicker">Prêt pour ${esc(nextName)} ?</p>
          <p>Coche ce que tu sais faire <strong>sans regarder la solution</strong>. Si tu hésites, revois la mission indiquée.</p>
          <ul class="checklist">${list.map((c, k) => {
            const i = c.mission ? levelIndex(c.mission) : -1;
            return `<li><label><input type="checkbox" data-check="${k}" ${checks[k] ? "checked" : ""}> <span>${md(c.text)}</span></label>${i >= 0 ? `<button class="btn btn-small btn-ghost" type="button" data-open="${c.mission}" ${isUnlocked(i) ? "" : "disabled"}>Revoir la mission ${i + 1}</button>` : ""}</li>`;
          }).join("")}</ul>
          <p class="ready-score"><b>${nOk} / ${list.length}</b> ${nOk === list.length ? `· Bravo, tu as les bases pour passer à la suite !${GAME.next ? ` <a href="${GAME.next.url}">${esc(GAME.next.name)} →</a>` : ""}` : "· Continue, tu y es presque."}</p>
        </section>` : ""}
      </div>
    </div>`;
  setView("lexique");
  updateStats();
  const inp = $("#lex-search");
  inp.addEventListener("input", () => {
    const qv = inp.value.trim().toLowerCase(); let n = 0;
    $$("#lexicon > div").forEach(d => { const on = !qv || d.dataset.k.includes(qv); d.hidden = !on; if (on) n++; });
    $("#lex-empty").hidden = n > 0;
  });
  $$("[data-check]").forEach(c => c.addEventListener("change", () => {
    store.checks = Object.assign({}, store.checks, { [c.dataset.check]: c.checked });
    save();
    const y = window.scrollY; showLexique(); window.scrollTo(0, y);
  }));
}

/* =====================================================================
   VUE : CARNET
   ===================================================================== */
function showNotebook() {
  current = null; preview = null; setHash("carnet");
  const items = LEVELS.map((l, i) => ({ l, i })).filter(o => !o.l.quiz && !o.l.boss);
  $("#view-notebook").innerHTML = `
    <div class="section-title"><div><p class="kicker">Antisèche</p><h2>Mon carnet</h2></div><p>Toutes les notions débloquées, à garder sous la main pendant tes projets.</p></div>
    <div class="notebook">${items.map(({ l, i }) => {
      if (!isUnlocked(i)) return `<div class="note locked"><p class="card-kicker">Mission ${i + 1}</p><h3>${esc(l.notion)}</h3><p>À débloquer en jouant.</p></div>`;
      return `<div class="note"><p class="card-kicker">Mission ${i + 1} · ${esc(l.title)}</p><h3>${esc(l.notion)}</h3><pre class="code-block">${highlight(l.lesson.code, l.lesson.lang)}</pre><dl class="pieces">${l.lesson.pieces.map(([k, d]) => `<div><dt><code>${esc(k)}</code></dt><dd>${md(d)}</dd></div>`).join("")}</dl>${l.lesson.trap ? `<div class="trap"><p class="mini-label">Piège</p><p>${md(l.lesson.trap)}</p></div>` : ""}${l.lesson.good ? `<div class="good"><p class="mini-label">Bonne pratique</p>${(Array.isArray(l.lesson.good) ? l.lesson.good : [l.lesson.good]).map(t => `<p>${md(t)}</p>`).join("")}</div>` : ""}</div>`;
    }).join("")}</div>
    <section class="prof">
      <p class="card-kicker">Options</p>
      <label for="unlock-all"><input type="checkbox" id="unlock-all" ${store.unlockAll ? "checked" : ""}> Débloquer toutes les missions (pour le formateur, ou pour réviser)</label>
      <div><button class="btn btn-small btn-ghost" type="button" id="reset-all">Effacer ma progression</button></div>
      <p style="font-size:.9rem;color:var(--ink-soft)">La progression est enregistrée dans ce navigateur uniquement.</p>
    </section>`;
  setView("notebook");
  $("#unlock-all").addEventListener("change", e => { store.unlockAll = e.target.checked; save(); showNotebook(); });
  $("#reset-all").addEventListener("click", e => twoStep(e.currentTarget, "Sûr ? Clique encore", () => { store = { progress: {}, drafts: {}, unlockAll: false, seenDiscover: false, owner: store.owner }; if (!store.owner) delete store.owner; save(); updateStats(); showNotebook(); }));
  updateStats();
}

/* =====================================================================
   ÉVÉNEMENTS
   ===================================================================== */
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.open) { openLevel(t.dataset.open); return; }
  if (t.dataset.go === "map") { showMap(); return; }
  if (t.dataset.go === "discover") { showDiscover(); return; }
  if (t.dataset.tab) { selectTab(t.dataset.tab); return; }
  if (t.dataset.screen) {
    $$("[data-screen]").forEach(b => b.classList.toggle("on", b === t));
    session.screen = t.dataset.screen;
    fitFrames();
    return;
  }
  if (t.dataset.device) {
    $$("[data-device]").forEach(b => b.classList.toggle("on", b === t));
    const phone = t.dataset.device === "phone";
    const box = $(".workbench .board") || $(".workbench .preview .browser");
    if (box) box.classList.toggle("phone", phone);
    setTimeout(() => { fitFrames(); updateBoardStatus(); }, 60);
    return;
  }
  if (t.dataset.view) {
    $$("[data-view]").forEach(b => b.classList.toggle("on", b === t));
    const model = t.dataset.view === "model";
    $("#frame-page").hidden = model; $("#frame-model").hidden = !model;
    $("#page-name").textContent = model ? "modèle" : ((preview && preview.doc && preview.doc.title.trim()) || current.file || ((current.mode || GAME.mode) === "html" ? "index.html" : "ma-page.html"));
    fitFrames();
    return;
  }
  switch (t.id) {
    case "run": runCode(); break;
    case "hint": showHint(); break;
    case "show-solution": twoStep(t, "Sûr ? (1 étoile)", () => { session.solution = true; trk("solution", current.id); $("#help").hidden = false; $("#solution-box").hidden = false; $("#solution-box").scrollIntoView({ block: "nearest", behavior: "smooth" }); }); break;
    case "copy-solution": { const ta = $("#code"); ta.value = current.solution; ta.dispatchEvent(new Event("input")); ta.focus(); break; }
    case "reset": twoStep(t, "Sûr ? Clique encore", () => { const ta = $("#code"); ta.value = current.starter; delete store.drafts[current.id]; save(); ta.dispatchEvent(new Event("input")); }); break;
  }
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#modal").hidden) $("#modal").hidden = true; });
window.addEventListener("hashchange", route);

document.addEventListener("DOMContentLoaded", () => {
  initStore();
  document.title = GAME.name;
  $("#brand-name").textContent = GAME.name;
  $("#nav-discover").textContent = GAME.discover.nav;
  $("#footer-text").textContent = `${GAME.name} · un jeu pour apprendre ${GAME.discover.subject}`;
  $$(".serie a").forEach(a => { if (!a.classList.contains("btn") && location.pathname.toLowerCase().startsWith(new URL(a.href).pathname.toLowerCase())) a.setAttribute("aria-current", "page"); });
  $("#brand").addEventListener("click", showMap);
  $("#nav-map").addEventListener("click", showMap);
  $("#nav-discover").addEventListener("click", showDiscover);
  $("#nav-notebook").addEventListener("click", showNotebook);
  $("#nav-lexique").addEventListener("click", showLexique);
  $("#nav-sandbox").addEventListener("click", () => openLevel("bac-a-sable"));
  $("#modal").addEventListener("click", e => { if (e.target.id === "modal") $("#modal").hidden = true; });
  window.addEventListener("resize", () => { fitFrames(); });
  route();
  /* sauvegarde en ligne (cloud.js, même compte que Mission Bip) */
  if (window.BipCloud) BipCloud.init({
    game: GAME.id,
    getStore: () => store,
    setStore: s => { store = s; },
    empty: () => ({ progress: {}, drafts: {}, unlockAll: false, seenDiscover: false }),
    persist: () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* rien */ } },
    refresh: () => { updateStats(); if (!current) route(); }
  });
});
