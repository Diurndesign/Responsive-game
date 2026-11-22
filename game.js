/* =====================================================================
   KAMI S’ADAPTE · les données du jeu Responsive
   Chaque mission a sa page HTML (`html`, en lecture seule) et un CSS de
   base caché facultatif (`base`) ; l’élève écrit le CSS.
   Au clic sur « Vérifier », le moteur rend la page à 3 largeurs
   (GAME.screens : mobile 375px, tablette 768px, ordi 1280px).
   Les objectifs vérifient chaque écran avec qAt, qaAt, csAt, boxAt,
   visibleAt, overflowAt (voir engine.js, « OUTILS POUR LES OBJECTIFS »).
   ===================================================================== */
MASCOT.style = "screens";

/* Petits outils propres au jeu Responsive (préfixe r pour ne pas gêner le moteur) */
const R_SCREENS = ["mobile", "tablette", "ordi"];
const R_NAMES = { mobile: "téléphone", tablette: "tablette", ordi: "ordinateur" };
// nombre d’éléments sur la première ligne (= nombre de colonnes)
const rCols = (c, id, sel) => { const els = qaAt(c, id, sel); if (!els.length) return 0; const t = els[0].getBoundingClientRect().top; return els.filter(e => Math.abs(e.getBoundingClientRect().top - t) < 3).length; };
// b est à droite de a, sur la même bande horizontale
const rSide = (c, id, a, b) => { const A = boxAt(c, id, a), B = boxAt(c, id, b); return !!A && !!B && B.left >= A.right - 1 && B.top < A.bottom && A.top < B.bottom; };
// b est sous a
const rBelow = (c, id, a, b) => { const A = boxAt(c, id, a), B = boxAt(c, id, b); return !!A && !!B && B.top >= A.bottom - 1; };
// largeur arrondie d’un élément
const rW = (c, id, sel) => { const b = boxAt(c, id, sel); return b ? Math.round(b.width) : 0; };
// taille calculée en px
const rPx = (c, id, sel, prop) => px(csAt(c, id, sel, prop));
// les règles écrites dans une media query dont la condition vérifie re
const rMedia = (c, re) => (c.rules || []).filter(r => r.media && re.test(r.media));
// la valeur écrite pour prop dans une règle (dans ou hors @media) dont un sélecteur est dans sels
const rDecl = (c, sels, prop, inMedia) => { let v = null; (c.rules || []).forEach(r => { if ((inMedia == null || !!r.media === inMedia) && r.sel && r.sel.split(",").map(norm).some(s => sels.includes(s))) r.decls.forEach(d => { if (d.prop === prop) v = d.value; }); }); return v; };
// liste lisible des écrans où un test échoue
const rFail = (test, ids) => (ids || R_SCREENS).filter(id => !test(id)).map(id => R_NAMES[id]);
// aucune page ne déborde sur ces écrans ?
const rNoOverflow = (c, ids) => { const ko = rFail(id => !overflowAt(c, id), ids); return !ko.length || `La page déborde sur le côté : ${ko.join(", ")}.`; };

const GAME = {
  id: "kami-ecrans",
  name: "Kami s’adapte",
  title: ["Kami", "Responsive"],
  kicker: "Responsive · pour bien démarrer dans le web",
  lead: "Un caméléon s’adapte à tout ce qui l’entoure. Une page web aussi doit s’adapter : au téléphone, à la tablette, à l’ordinateur. C’est le **responsive**. Écris du CSS, regarde ta page sur les trois écrans, et chaque atelier terminé allume un nouvel écran autour de Kami.",
  mode: "css",
  lang: "css",
  screens: [
    { id: "mobile", label: "Téléphone", w: 375 },
    { id: "tablette", label: "Tablette", w: 768 },
    { id: "ordi", label: "Ordinateur", w: 1280 }
  ],
  screenDefault: "mobile",
  rewardWord: "écrans allumés",
  rewardLabel: "Écran",
  rewardMsg: "Un nouvel écran s’allume près de Kami :",
  chapterNote: "Chaque atelier terminé allume un écran autour de Kami.",
  finaleTitle: "Ta page s’adapte à tous les écrans !",
  confetti: ["#3DCB8B", "#0B6E99", "#9BE3FF", "#FFD43B", "#1B2440"],
  links: { html: "https://diurndesign.github.io/Html_game/", css: null, js: "https://diurndesign.github.io/javascript_game/" },
  next: {
    name: "Mission Bip (JavaScript)",
    url: "https://diurndesign.github.io/javascript_game/",
    title: "La suite : rendre la page vivante avec le JavaScript",
    text: "Ta page est structurée, stylée, bien rangée et elle s’adapte à tous les écrans. Il manque le comportement : ouvrir un menu d’un clic, réagir à un formulaire, afficher des données. **Bip le robot** t’apprend le **JavaScript**."
  },
  // style de base des pages, SANS « img { max-width: 100% } » : c’est à l’élève de l’écrire
  pageBase: `html{color-scheme:light}body{margin:16px;font:16px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1B2440;background:#fff}`,
  pageHTML: `<h1>Bonjour</h1>`,

  /* ------------------------------------------------------------------
     PAGE « DÉCOUVRIR » : c’est quoi, à quoi ça sert, pourquoi
     ------------------------------------------------------------------ */
  discover: {
    nav: "Découvrir", button: "C’est quoi le responsive ?", subject: "le responsive",
    cardTitle: "C’est quoi le responsive ? À quoi ça sert ? Pourquoi on l’utilise ?",
    cardText: "5 minutes pour comprendre avant de jouer, avec une démo à tester.",
    kicker: "Étape 0 · Découvrir",
    title: "C’est quoi, le **responsive** ?",
    lead: "Tu sais écrire une page en HTML, l’habiller en CSS et la mettre en page avec Flexbox et Grid. Mais ta page sera lue sur des écrans de toutes les tailles : un téléphone dans la main, une tablette sur le canapé, un grand écran au bureau. Prends cinq minutes pour comprendre comment une seule page peut s’adapter à tous.",
    say: "Moi, je change de couleur selon l’endroit où je suis : c’est mon métier de caméléon ! Une page responsive fait pareil : elle change de forme selon l’écran. Je t’explique.",
    cards: [
      { title: "C’est quoi ?", text: ["*Responsive* est un mot anglais qui veut dire « qui réagit ». Une page **responsive** (on dit aussi *adaptative*) **s’adapte à la largeur de l’écran** : une seule colonne sur un téléphone, deux sur une tablette, trois sur un ordinateur.", "Ce n’est pas un nouveau langage : c’est une **façon d’écrire son CSS**. Le HTML reste le même pour tous les écrans ; seules les règles CSS changent, grâce à des largeurs **fluides**, des unités **relatives** et des **media queries**."] },
      { title: "À quoi ça sert ?", text: "À offrir une page agréable sur **n’importe quel écran**, sans zoomer ni faire défiler la page sur le côté. Concrètement, le responsive sert à :", list: ["faire tenir les images et les blocs dans l’écran, sans **débordement** ;", "passer d’une colonne à plusieurs quand la place le permet ;", "garder un texte lisible : ni minuscule sur téléphone, ni en lignes interminables sur un grand écran ;", "rendre les boutons et les liens faciles à toucher du doigt ;", "n’écrire et ne maintenir **qu’un seul site** au lieu d’un site « mobile » et d’un site « ordinateur »."] },
      { title: "Pourquoi on l’utilise ?", text: ["Parce que **plus de la moitié des visites** sur le web se font depuis un téléphone. Un site qui ne s’adapte pas oblige à pincer pour zoomer et à glisser dans tous les sens : la plupart des visiteurs repartent.", "Les moteurs de recherche, comme Google, regardent d’abord la **version mobile** d’un site pour le classer. Aujourd’hui, le responsive n’est plus une option : c’est la base de tout site professionnel."] }
    ],
    before: {
      title: "Ce qu’il faut savoir avant de commencer",
      text: "Ce jeu est la dernière marche avant le JavaScript. Il réutilise tout ce que tu as appris dans les jeux HTML, CSS, Flexbox et Grid. Si un de ces points te paraît flou, revois le jeu correspondant :",
      items: [
        "**HTML** : les **balises**, les **éléments** imbriqués (**parent**, **enfant**), les attributs `class` et `id`, la structure `header`/`nav`/`main`/`footer`, la balise `<img>` avec son attribut `alt`, et le `<head>` qui contient les réglages de la page.",
        "**CSS** : écrire une **règle** complète (`sélecteur { propriété: valeur; }`), viser une classe (`.carte`) ou un descendant (`nav a`), la **cascade** (à force égale, la dernière règle écrite gagne).",
        "**Le modèle de boîte** : `padding`, `border`, `margin`, `width` et `max-width`, et ce que change `box-sizing: border-box`.",
        "**Les unités** : `px`, `%`, `rem`, `em`, et `display` (`block`, `inline`, `none`).",
        "**Flexbox** : `display: flex`, `flex-direction`, `justify-content`, `align-items`, `gap`, `flex-wrap`.",
        "**Grid** : `display: grid`, `grid-template-columns`, `fr`, `repeat()`, `grid-template-areas` et `grid-area`."
      ],
      link: { label: "Revoir le jeu Grid", url: "https://diurndesign.github.io/Grid-game/" }
    },
    trioFocus: "css",
    trioHere: "Le responsive, c’est du CSS",
    trioNote: "Le responsive ne s’ajoute pas à côté du CSS : c’est **du CSS bien pensé**, écrit dans le même fichier `style.css`. Le HTML donne le contenu (une seule fois), le CSS l’adapte à chaque écran. Ensuite, le JavaScript ajoutera le comportement (ouvrir un menu, réagir à un clic).",
    demo: {
      title: "La même page, trois façons de l’écrire",
      text: "Clique sur les trois boutons. Le HTML ne change **jamais** : seul le CSS change. La fenêtre de démo est petite : moins de 700px de large, moins qu’une tablette.",
      lang: "css",
      html: `<div class="page">\n  <h1>Les balades de Kami</h1>\n  <div class="cartes">\n    <div class="carte">\n      <b>La forêt</b>\n      <p>Deux heures sous les grands arbres.</p>\n    </div>\n    <div class="carte">\n      <b>L’étang</b>\n      <p>Une soirée avec les lucioles.</p>\n    </div>\n  </div>\n</div>`,
      base: `.page{background:#E1F7EC;padding:12px;border-radius:12px;box-sizing:border-box}.page h1{margin:0 0 10px;font-size:1.4rem;color:#1E9E66}.carte{background:#fff;border:3px solid #1B2440;border-radius:10px;padding:10px;box-sizing:border-box}.carte p{margin:6px 0 0}`,
      variants: [
        { label: "Largeur fixe", css: `/* Pensé pour un ordinateur */\n.page {\n  width: 700px;\n}\n\n.cartes {\n  display: flex;\n  gap: 10px;\n}\n\n.carte {\n  width: 340px;\n}`, caption: "Des largeurs **fixes**, en pixels : parfait sur un grand écran… mais ici la page fait 700px dans une fenêtre plus étroite. Elle **déborde** : une partie est coupée, et il faut faire défiler la page sur le côté. C’est le défaut numéro un des sites non responsive." },
        { label: "Largeurs fluides", css: `/* Rien de fixe : tout suit l’écran */\n.page {\n  max-width: 700px;\n}\n\n.cartes {\n  display: flex;\n  gap: 10px;\n}\n\n.carte {\n  flex: 1;\n}`, caption: "Avec `max-width` au lieu de `width`, la page **rétrécit** avec l’écran sans jamais dépasser 700px : plus de débordement. Les cartes se partagent la place avec `flex: 1`. Mais sur un écran de téléphone, deux cartes côte à côte deviennent minces et leur texte se tasse." },
        { label: "Fluide + media query", css: `/* Mobile d’abord : une colonne */\n.page {\n  max-width: 700px;\n}\n\n.cartes {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n/* Écrans de 768px et plus */\n@media (min-width: 768px) {\n  .cartes {\n    flex-direction: row;\n  }\n}`, caption: "La version **responsive**, *mobile d’abord* : par défaut, les cartes s’empilent, bien lisibles même sur un téléphone. C’est ce que tu vois ici, car la fenêtre de démo fait moins de 768px. La **media query** `@media (min-width: 768px)` les remet côte à côte sur une tablette ou un ordinateur. Une seule page, deux mises en page : c’est ce que tu vas apprendre." }
      ]
    },
    anatomy: {
      title: "Comment s’écrit une media query",
      text: "La **media query** est l’outil central du responsive. Elle entoure des règles CSS normales, qui ne s’appliquent **que si la condition est vraie**.",
      lang: "css",
      code: `/* Pour tous les écrans (le téléphone d’abord) */\n.cartes {\n  display: grid;\n  gap: 16px;\n}\n\n/* Seulement si l’écran fait 768px ou plus */\n@media (min-width: 768px) {\n  .cartes {\n    grid-template-columns: 1fr 1fr;\n  }\n}`,
      pieces: [
        ["@media", "le début d’une **media query** : « si l’écran… »"],
        ["(min-width: 768px)", "la **condition** : une largeur d’écran de **768px au minimum**. `max-width` voudrait dire « au maximum »"],
        ["768px", "le **point de rupture** : la largeur à laquelle la mise en page change (ici, celle d’une tablette)"],
        ["{ … }", "les accolades de la media query entourent des **règles complètes**, qui ont leurs propres accolades : deux niveaux"],
        [".cartes { … }", "une règle normale : elle s’ajoute à la première, et gagne la cascade parce qu’elle est écrite après"]
      ]
    },
    compare: {
      title: "Mobile d’abord ou ordinateur d’abord ?",
      text: "Il y a deux façons d’écrire un CSS responsive. Les deux marchent, mais les pros conseillent aujourd’hui de commencer par le téléphone : on dit **mobile d’abord** (*mobile first* en anglais). C’est la méthode de ce jeu.",
      cols: [
        { title: "Ordinateur d’abord", focus: false,
          svg: "<svg viewBox='0 0 260 110' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='Ordinateur d’abord : on part du grand écran et on réduit vers le téléphone'><rect x='8' y='14' width='120' height='76' rx='8' fill='#E1F0F7' stroke='#1B2440' stroke-width='3'/><rect x='20' y='26' width='44' height='52' rx='4' fill='#3DCB8B' stroke='#1B2440' stroke-width='2.5'/><rect x='72' y='26' width='44' height='52' rx='4' fill='#FFD43B' stroke='#1B2440' stroke-width='2.5'/><path d='M140 52 H184' stroke='#1B2440' stroke-width='3'/><path d='M182 45 L194 52 L182 59 Z' fill='#1B2440'/><rect x='206' y='10' width='44' height='86' rx='8' fill='#E1F0F7' stroke='#1B2440' stroke-width='3'/><rect x='214' y='20' width='28' height='30' rx='3' fill='#3DCB8B' stroke='#1B2440' stroke-width='2'/><rect x='214' y='56' width='28' height='30' rx='3' fill='#FFD43B' stroke='#1B2440' stroke-width='2'/></svg>",
          items: ["Le CSS de base est celui du **grand écran**.", "Pour les petits écrans, on **corrige** et on **retire** avec `@media (max-width: …)`.", "Le téléphone lit d’abord toutes les règles de l’ordinateur, puis les annule une par une.", "Très courant dans les sites plus anciens : il faut savoir le lire."] },
        { title: "Mobile d’abord", focus: true,
          svg: "<svg viewBox='0 0 260 110' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='Mobile d’abord : on part du téléphone et on enrichit pour le grand écran'><rect x='8' y='10' width='44' height='86' rx='8' fill='#E1F7EC' stroke='#1B2440' stroke-width='3'/><rect x='16' y='20' width='28' height='30' rx='3' fill='#3DCB8B' stroke='#1B2440' stroke-width='2'/><rect x='16' y='56' width='28' height='30' rx='3' fill='#FFD43B' stroke='#1B2440' stroke-width='2'/><path d='M64 52 H108' stroke='#1B2440' stroke-width='3'/><path d='M106 45 L118 52 L106 59 Z' fill='#1B2440'/><rect x='130' y='14' width='120' height='76' rx='8' fill='#E1F7EC' stroke='#1B2440' stroke-width='3'/><rect x='142' y='26' width='44' height='52' rx='4' fill='#3DCB8B' stroke='#1B2440' stroke-width='2.5'/><rect x='194' y='26' width='44' height='52' rx='4' fill='#FFD43B' stroke='#1B2440' stroke-width='2.5'/></svg>",
          items: ["Le CSS de base est celui du **téléphone** : souvent une simple colonne.", "Pour les grands écrans, on **ajoute** avec `@media (min-width: …)`.", "Le téléphone, souvent moins puissant et moins bien connecté, lit le moins de CSS possible.", "On commence par l’**essentiel** du contenu : la version ordinateur n’est qu’un enrichissement."] }
      ]
    },
    usesTitle: "Où on voit le responsive dans la vraie vie",
    uses: [
      { title: "Les boutiques en ligne", text: "La grille de produits passe de 2 colonnes sur téléphone à 4 ou 5 sur ordinateur. Le panier et le bouton « Acheter » restent toujours faciles à toucher." },
      { title: "Les menus", text: "Sur ordinateur, les liens du menu sont en ligne en haut de la page. Sur téléphone, ils s’empilent, ou se cachent derrière un bouton « menu » (avec un peu de JavaScript)." },
      { title: "Les journaux en ligne", text: "Trois colonnes d’articles sur grand écran, une seule sur téléphone, et des lignes de texte jamais trop longues pour lire confortablement." },
      { title: "Les images", text: "Une grande photo panoramique sur ordinateur, une version recadrée et plus légère sur téléphone : le navigateur choisit le bon fichier selon l’écran." }
    ],
    jobs: {
      title: "Et dans les métiers du web ?",
      text: "Le responsive fait partie du travail de chaque jour, pour tous ceux qui fabriquent des sites :",
      items: [
        { title: "Intégrateur·rice web", text: "Reçoit souvent deux ou trois maquettes de la même page (téléphone, tablette, ordinateur) et écrit le CSS qui passe de l’une à l’autre, avec des media queries et des largeurs fluides." },
        { title: "Développeur·se front-end", text: "Fabrique des composants (menus, cartes, tableaux) qui fonctionnent sur tous les écrans, et vérifie le rendu sur de vrais téléphones avant chaque mise en ligne." },
        { title: "Webdesigner / UI designer", text: "Dessine les écrans en commençant souvent par le téléphone, choisit les points de rupture et prévoit des zones tactiles assez grandes pour les doigts." },
        { title: "Testeur·se (assurance qualité)", text: "Vérifie le site sur des dizaines de tailles d’écran et de navigateurs, et signale chaque débordement, chaque bouton trop petit, chaque texte illisible." }
      ]
    },
    words: [
      ["**Responsive**", "se dit d’une page qui s’adapte à la largeur de l’écran."],
      ["**Viewport**", "la zone de l’écran où la page s’affiche (en français : *fenêtre d’affichage*)."],
      ["**Media query**", "un bloc `@media (condition) { … }` dont les règles ne s’appliquent que si la condition est vraie."],
      ["**Point de rupture**", "la largeur d’écran à laquelle la mise en page change, par exemple `768px`."],
      ["**Fluide**", "se dit d’une largeur qui suit l’écran (`%`, `max-width`), au lieu d’être fixe en pixels."],
      ["**Mobile d’abord**", "écrire d’abord le CSS du téléphone, puis l’enrichir pour les grands écrans avec `min-width`."]
    ],
    traps: [
      "Oublier la balise viewport (`<meta name=\"viewport\" …>`) dans le `<head>` : le téléphone affiche une version d’ordinateur rétrécie, et les media queries ne servent à rien.",
      "Donner des largeurs fixes en pixels (`width: 900px`) à de grands blocs : sur téléphone, la page déborde sur le côté.",
      "Tester seulement sur son ordinateur : regarde ta page sur un petit écran **dès le début**, pas à la fin.",
      "Cacher l’essentiel sur téléphone avec `display: none` : le visiteur mobile a droit au même contenu que les autres."
    ],
    tools: [
      "Un éditeur de code gratuit : **VS Code**, avec ton fichier `style.css` relié par `<link rel=\"stylesheet\" href=\"style.css\">`.",
      "Dans Chrome ou Firefox : clic droit, **Inspecter**, puis l’icône **téléphone et tablette** (le *mode responsive*). Tu choisis une largeur d’écran, ou tu tires le bord de la page pour voir où elle casse.",
      "Le plus important : ouvre ta page sur **ton vrai téléphone**. Rien ne remplace un vrai doigt sur un vrai écran."
    ],
    ctaTitle: "Prêt à t’adapter ?",
    ctaText: "24 missions t’attendent, réparties en 6 ateliers. Dans chacune, tu regardes ta page sur trois écrans : téléphone, tablette et ordinateur. Chaque atelier terminé allume un nouvel écran autour de Kami : le téléphone, la tablette, l’ordinateur portable, le grand écran, la télé et la montre."
  },

  /* ------------------------------------------------------------------
     BAC À SABLE
     ------------------------------------------------------------------ */
  sandbox: {
    id: "bac-a-sable", sandbox: true, title: "Bac à sable",
    say: "Ici, pas de mission : essaie tout ce que tu veux, et regarde ta page sur les trois écrans. Moi, je m’adapte à tout !",
    ideas: [
      "Change la largeur de l’écran avec les boutons au-dessus de la page : Téléphone, Tablette, Ordinateur.",
      "Écris une `@media (min-width: 768px)` qui met les `.cartes` côte à côte (`display: flex` ou `grid`).",
      "Donne au titre une taille fluide avec `clamp(2rem, 1rem + 5vw, 4rem)`.",
      "Centre le `.contenu` avec `max-width: 960px` et `margin-inline: auto`.",
      "Supprime `max-width: 100%` de l’image et regarde la page déborder sur téléphone."
    ],
    html: `<header class="entete">\n  <h1>Ma page</h1>\n</header>\n<main class="contenu">\n  <img src="img/paysage.svg" alt="Un paysage de collines" width="1200" height="600">\n  <div class="cartes">\n    <p class="carte">Une première carte.</p>\n    <p class="carte">Une deuxième carte.</p>\n    <p class="carte">Une troisième carte.</p>\n  </div>\n</main>`,
    starter: `img {\n  max-width: 100%;\n  height: auto;\n}\n\n.entete {\n  background-color: #0B6E99;\n  color: white;\n  padding: 16px;\n}\n\n.carte {\n  background-color: #E1F7EC;\n  padding: 16px;\n}\n\n/* Écrans de 768px et plus */\n@media (min-width: 768px) {\n  \n}\n`,
    hints: []
  },

  /* ------------------------------------------------------------------
     LEXIQUE, BONNES PRATIQUES, PRÊT POUR LA SUITE ?
     ------------------------------------------------------------------ */
  glossary: [
    ["**Responsive**", "se dit d’une page qui s’adapte à la largeur de l’écran (téléphone, tablette, ordinateur). En français, on dit aussi *adaptative*."],
    ["**Design adaptatif** (*adaptive*)", "une autre méthode, plus ancienne : quelques mises en page **fixes**, une par taille d’écran. Le responsive, lui, est **fluide** entre les points de rupture."],
    ["**Viewport**", "la zone de l’écran où la page s’affiche (*fenêtre d’affichage*). Sa largeur est celle que testent les media queries et que mesurent les unités `vw` et `vh`."],
    ["**Balise viewport**", "la balise `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`, dans le `<head>` de chaque page. Sans elle, un téléphone fait comme s’il avait un écran d’ordinateur et rétrécit tout."],
    ["**Pixel CSS**", "l’unité `px` du CSS. Ce n’est pas forcément un point physique de l’écran : un téléphone de « 375px » de large a en réalité 2 ou 3 fois plus de points."],
    ["**Densité de pixels**", "le nombre de points physiques de l’écran pour un pixel CSS : `1x` sur un écran ordinaire, `2x` ou `3x` sur un écran haute définition (*Retina*). Une image doit être plus grande pour rester nette en `2x`."],
    ["**Media query**", "un bloc `@media` dont les règles ne s’appliquent que si sa condition est vraie, par exemple une largeur d’écran minimale.", "@media (min-width: 768px) {\n  .menu {\n    flex-direction: row;\n  }\n}"],
    ["**Condition**", "ce qui est écrit entre parenthèses après `@media` : `(min-width: 768px)`, `(max-width: 600px)`…"],
    ["**`min-width`** (dans `@media`)", "« si l’écran fait **au moins** cette largeur ». La condition du mobile d’abord."],
    ["**`max-width`** (dans `@media`)", "« si l’écran fait **au plus** cette largeur ». La condition de l’ordinateur d’abord."],
    ["**Point de rupture**", "la largeur d’écran où la mise en page change. Dans ce jeu : `768px` (tablette) et `1024px` (ordinateur). On le choisit là où la page « casse », pas pour un appareil précis."],
    ["**Mobile d’abord**", "*mobile first* : écrire d’abord le CSS du téléphone (hors media query), puis l’enrichir pour les grands écrans avec `@media (min-width: …)`."],
    ["**Ordinateur d’abord**", "*desktop first* : l’inverse. Le CSS de base est celui du grand écran, corrigé pour les petits avec `@media (max-width: …)`."],
    ["**Fluide**", "se dit d’une largeur qui suit celle de l’écran ou du parent (`%`, `max-width`, `fr`, `vw`), au lieu d’être fixe en pixels."],
    ["**Largeur fixe**", "une largeur en pixels (`width: 900px`) : elle ne change jamais, même si l’écran est plus étroit. Source de débordement."],
    ["**Débordement**", "quand un élément est plus large que son parent ou que l’écran. Sur la page entière, il oblige à faire défiler sur le côté : le défaut numéro un à éviter."],
    ["**`overflow-x`**", "ce qui se passe quand le contenu déborde d’une boîte en largeur : `visible` (il dépasse), `hidden` (il est coupé), `auto` (une barre de défilement apparaît si besoin).", ".defilement {\n  overflow-x: auto;\n}"],
    ["**`max-width`** (propriété)", "la largeur **maximale** d’une boîte : elle peut rétrécir, jamais grandir au-delà.", "img {\n  max-width: 100%;\n  height: auto;\n}"],
    ["**Image fluide**", "une image qui rétrécit avec l’écran sans jamais dépasser sa taille réelle, grâce à `max-width: 100%` et `height: auto`."],
    ["**Pourcentage (`%`)**", "une part de la largeur du **parent** : `width: 50%` = la moitié du parent."],
    ["**`box-sizing`**", "avec `border-box`, la largeur donnée comprend le `padding` et la bordure : `width: 100%` ne déborde plus.", "*, *::before, *::after {\n  box-sizing: border-box;\n}"],
    ["**Unité absolue**", "une unité qui ne dépend de rien : surtout `px`. Bien pour une bordure, risquée pour une largeur ou un texte."],
    ["**Unité relative**", "une unité qui dépend d’autre chose : du parent (`%`, `em`), du texte de la page (`rem`), de l’écran (`vw`, `vh`)."],
    ["**`rem`**", "relative à la taille du texte de la racine `<html>` : 16px par défaut, mais le visiteur peut l’agrandir dans son navigateur. L’unité du texte.", "h1 {\n  font-size: 2rem; /* 32px */\n}"],
    ["**`em`**", "relative à la taille du texte de l’élément lui-même (ou de son parent, dans `font-size`). Pratique pour le `padding` d’un bouton, qui suit son texte."],
    ["**`vw`**", "1 % de la largeur du viewport : `50vw` = la moitié de la largeur de l’écran."],
    ["**`vh`**", "1 % de la hauteur du viewport : `100vh` = toute la hauteur de l’écran. Sur téléphone, la barre d’adresse la fait varier : on préfère souvent `svh` ou `dvh`."],
    ["**`ch`**", "la largeur du caractère « 0 » de la police. `65ch` ≈ une ligne de 65 caractères."],
    ["**`clamp()`**", "une valeur bornée : `clamp(MIN, IDÉAL, MAX)`. Le navigateur prend l’idéal, sans descendre sous le minimum ni monter au-dessus du maximum.", "h1 {\n  font-size: clamp(2rem, 1rem + 5vw, 4rem);\n}"],
    ["**`min()`** et **`max()`**", "`min()` prend la plus petite des valeurs, `max()` la plus grande. `width: min(100%, 500px)` = jamais plus de 500px.", ".carte {\n  width: min(100%, 500px);\n  padding: max(16px, 3vw);\n}"],
    ["**Typographie fluide**", "un texte dont la taille suit la largeur de l’écran, entre un minimum et un maximum, souvent avec `clamp()`."],
    ["**`flex-wrap`**", "avec `wrap`, les éléments flex passent à la ligne quand la place manque, au lieu de se tasser."],
    ["**`flex` (raccourci)**", "`flex: 1 1 240px` = grandir (1), rétrécir (1), taille de base 240px. Avec `flex-wrap`, il crée des cartes responsive sans media query."],
    ["**`auto-fit` et `minmax()`**", "dans `repeat()`, Grid crée autant de colonnes qu’il en tient, chacune d’au moins la taille minimale.", ".produits {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n}"],
    ["**`grid-template-areas`**", "le dessin de la grille avec des zones nommées. Dans une media query, on peut **redessiner** la page sans toucher au HTML."],
    ["**`display: none`**", "retire l’élément de l’affichage, et aussi des lecteurs d’écran. Le fichier d’une image cachée est souvent téléchargé quand même."],
    ["**Zone tactile**", "la surface qu’on peut toucher du doigt pour activer un lien ou un bouton. Au moins **44px sur 44px**, avec de l’espace autour."],
    ["**Longueur de ligne**", "le nombre de caractères par ligne de texte. Entre 45 et 75, c’est confortable ; on la limite avec `max-width: 65ch`."],
    ["**Conteneur centré**", "une boîte qui limite la largeur du contenu sur grand écran et se centre : `max-width` + `margin-inline: auto` + `padding-inline`.", ".conteneur {\n  max-width: 960px;\n  margin-inline: auto;\n  padding-inline: 16px;\n}"],
    ["**Propriétés logiques**", "`margin-inline` (gauche et droite), `padding-block` (haut et bas)… Elles suivent le sens de lecture de la langue."],
    ["**`aspect-ratio`**", "le rapport largeur / hauteur d’une boîte : `1 / 1` (carré), `16 / 9` (vidéo). La hauteur se calcule toute seule à partir de la largeur."],
    ["**`object-fit`**", "comment une image remplit sa boîte : `cover` la remplit en entier et coupe ce qui dépasse, sans déformer ; `contain` la montre en entier."],
    ["**`<picture>`**", "une balise HTML qui propose plusieurs images avec des `<source media=\"…\">` : le navigateur prend la première dont la condition est vraie, sinon le `<img>`."],
    ["**`srcset`**", "un attribut qui donne plusieurs versions d’une image (`photo-800.jpg 800w`, ou `photo@2x.jpg 2x`) : le navigateur télécharge la mieux adaptée à l’écran."],
    ["**`sizes`**", "un attribut qui accompagne `srcset` avec des largeurs `w` : il dit quelle largeur l’image occupera à l’écran, pour que le navigateur choisisse le bon fichier."],
    ["**Direction artistique**", "proposer un **cadrage** différent selon l’écran (photo carrée sur téléphone, panoramique sur ordinateur). C’est le rôle de `<picture>`."],
    ["**`loading=\"lazy\"`**", "un attribut de `<img>` : l’image n’est téléchargée que quand on s’en approche en faisant défiler. Plus rapide sur téléphone."],
    ["**Mode responsive**", "l’outil du navigateur (Inspecter, puis l’icône téléphone) qui affiche la page à la largeur de n’importe quel appareil."]
  ],
  practices: [
    "Mets la balise viewport (`<meta name=\"viewport\" …>`, avec `width=device-width` et `initial-scale=1`) dans le `<head>` de chaque page.",
    "Commence chaque feuille de style par deux règles : `box-sizing: border-box` pour tous les éléments (`*`), et des images fluides (`max-width: 100%` et `height: auto` sur `img`).",
    "Pense mobile d’abord : écris le CSS du téléphone hors media query, puis ajoute les grands écrans avec `@media (min-width: …)`.",
    "Préfère les largeurs fluides (`max-width`, `%`, `fr`, `min()`) aux largeurs fixes en pixels pour les blocs et les images.",
    "Choisis tes points de rupture là où ta page casse, pas pour un appareil précis, et range tes media queries de la plus petite à la plus grande.",
    "Écris les tailles de texte en `rem`, et utilise `clamp()` pour les grands titres : jamais trop petits, jamais énormes.",
    "Laisse Flexbox (`flex-wrap`) et Grid (`auto-fit`, `minmax()`) s’adapter tout seuls avant d’ajouter une media query.",
    "Donne au moins 44px sur 44px aux liens et aux boutons sur téléphone, avec de l’espace entre eux, et n’oublie pas qu’il n’y a pas de survol au doigt.",
    "Limite la largeur des lignes de texte à environ 65 caractères (`max-width: 65ch`) et centre le contenu dans un conteneur.",
    "Ne cache jamais l’essentiel sur téléphone : le visiteur mobile a droit au même contenu, rangé autrement.",
    "Donne à chaque `<img>` ses attributs `width` et `height` : la page ne « saute » plus pendant le chargement.",
    "Teste ta page dès le début à plusieurs largeurs, avec le mode responsive du navigateur et sur un vrai téléphone : aucune page ne doit déborder sur le côté."
  ],
  checklist: [
    { text: "Je sais à quoi sert la balise viewport, et où l’écrire.", mission: "ecrans" },
    { text: "Je sais rendre une image fluide avec `max-width: 100%` et `height: auto`.", mission: "image-fluide" },
    { text: "Je sais utiliser `%` et `box-sizing: border-box` pour qu’une boîte ne déborde pas.", mission: "largeurs-fluides" },
    { text: "Je sais écrire une media query et expliquer `min-width` et `max-width`.", mission: "menu-colonne" },
    { text: "Je sais écrire un CSS mobile d’abord, avec des points de rupture rangés du plus petit au plus grand.", mission: "points-de-rupture" },
    { text: "Je sais afficher ou cacher un élément avec `display: none`, et je sais que le JavaScript s’en servira pour ouvrir et fermer un menu.", mission: "afficher-masquer" },
    { text: "Je sais choisir entre `rem`, `em`, `vw` et `ch`.", mission: "rem-em" },
    { text: "Je sais faire un titre fluide avec `clamp()`, et limiter une largeur avec `min()`.", mission: "clamp-titre" },
    { text: "Je sais faire des cartes qui passent à la ligne toutes seules (`flex-wrap`, `auto-fit`, `minmax()`).", mission: "grille-auto" },
    { text: "Je sais redessiner une page avec `grid-template-areas` dans une media query.", mission: "zones-rupture" },
    { text: "Je sais faire un menu responsive avec des zones tactiles d’au moins 44px.", mission: "menu-responsive" },
    { text: "Je sais faire défiler un tableau trop large dans son conteneur, sans faire déborder la page.", mission: "tableau-defilant" },
    { text: "Je sais centrer le contenu dans un conteneur et limiter la longueur des lignes.", mission: "conteneur-centre" },
    { text: "Je sais expliquer `<picture>`, `srcset` et `aspect-ratio` avec `object-fit`.", mission: "quiz3" },
    { text: "Je sais lire une page HTML et retrouver un élément par sa classe ou son id : le JavaScript les cherchera de la même façon.", mission: "finale" }
  ],

  /* ------------------------------------------------------------------
     ATELIERS
     ------------------------------------------------------------------ */
  chapters: [
    { n: 1, title: "Penser mobile", piece: "Le téléphone", notions: ["responsive", "balise viewport", "images fluides", "largeurs fluides", "box-sizing"],
      skills: ["Je sais expliquer ce qu’est le responsive et pourquoi c’est indispensable.", "Je sais à quoi sert la balise viewport, et où l’écrire.", "Je sais rendre une image fluide avec `max-width: 100%` et `height: auto`.", "Je sais remplacer une largeur fixe par une largeur fluide (`max-width`, `%`), sans débordement grâce à `box-sizing`."] },
    { n: 2, title: "Les media queries", piece: "La tablette", notions: ["@media", "max-width", "min-width", "mobile d’abord", "points de rupture", "display: none"],
      skills: ["Je sais écrire une media query avec ses deux niveaux d’accolades.", "Je connais la différence entre `min-width` et `max-width`.", "Je sais écrire un CSS mobile d’abord, puis l’enrichir pour la tablette et l’ordinateur.", "Je sais ranger plusieurs points de rupture dans le bon ordre.", "Je sais afficher ou cacher un élément selon l’écran, sans cacher l’essentiel."] },
    { n: 3, title: "Les unités fluides", piece: "L’ordinateur portable", notions: ["rem et em", "vw et vh", "clamp()", "min() et max()"],
      skills: ["Je sais écrire les tailles de texte en `rem` et le `padding` d’un bouton en `em`.", "Je sais utiliser `vw` et `vh`, et je connais leurs limites.", "Je sais faire un titre qui grandit avec l’écran, entre deux bornes, avec `clamp()`.", "Je sais limiter une largeur avec `min()` et garantir un minimum avec `max()`."] },
    { n: 4, title: "Des mises en page qui s’adaptent", piece: "Le grand écran", notions: ["flex-wrap", "auto-fit et minmax()", "grid-template-areas", "sans media query"],
      skills: ["Je sais faire des cartes qui passent à la ligne avec `flex-wrap` et `flex`.", "Je sais faire une grille qui choisit seule son nombre de colonnes avec `repeat(auto-fit, minmax(…))`.", "Je sais redessiner une page entière avec `grid-template-areas` dans une media query.", "Je sais quand une media query est utile, et quand Flexbox ou Grid suffisent."] },
    { n: 5, title: "Des composants adaptables", piece: "La télé", notions: ["menu responsive", "zones tactiles", "overflow-x: auto", "65ch", "conteneur centré"],
      skills: ["Je sais faire un menu empilé sur téléphone et en ligne sur ordinateur, logo à gauche.", "Je sais donner aux liens une zone tactile d’au moins 44px.", "Je sais faire défiler un tableau trop large dans son conteneur.", "Je sais limiter la longueur des lignes de texte avec `ch`.", "Je sais centrer le contenu avec `max-width`, `margin-inline: auto` et `padding-inline`."] },
    { n: 6, title: "Médias et page complète", piece: "La montre", notions: ["aspect-ratio", "object-fit", "<picture> et srcset", "mission finale"],
      skills: ["Je sais faire des vignettes régulières avec `aspect-ratio` et `object-fit: cover`.", "Je sais expliquer `<picture>`, `srcset` et `sizes`, et pourquoi ils allègent la page.", "Je sais construire une page d’accueil complète, mobile d’abord, sans aucun débordement.", "Je suis prêt pour le JavaScript."] }
  ],

  levels: [
  /* ------------------------------ ATELIER 1 : PENSER MOBILE ------------------------------ */
  {
    id: "ecrans", ch: 1, title: "Kami change d’écran", notion: "le responsive et la balise viewport",
    say: "Salut, moi c’est Kami ! J’ai fait une affiche pour mon concours de camouflage. Sur l’ordinateur, elle est parfaite… mais sur le téléphone de Bip, elle sort de l’écran ! Regarde avec les boutons au-dessus de la page.",
    lesson: {
      what: [
        "Une page **responsive** s’adapte à la largeur de l’écran. Dans ce jeu, tu regardes chaque page sur trois écrans, avec les boutons au-dessus de l’aperçu : **Téléphone** (375px de large), **Tablette** (768px) et **Ordinateur** (1280px). Ce sont des largeurs courantes, en pixels CSS.",
        "Avant tout, une page responsive a besoin d’une ligne dans son HTML : la **balise viewport**. Le **viewport**, c’est la zone de l’écran où la page s’affiche. Sans cette balise, un téléphone fait comme s’il avait un écran d’ordinateur d’environ 980px, puis il rétrécit tout pour que ça tienne : le texte devient minuscule et il faut zoomer avec les doigts.",
        "Ensuite, le premier réflexe en CSS : **pas de largeur fixe** pour un grand bloc. `width: 600px` veut dire « 600px, même si l’écran est plus étroit » : la boîte **déborde**. `max-width: 600px` veut dire « **au maximum** 600px » : la boîte rétrécit sur un petit écran, et garde 600px sur un grand. On dit qu’elle est **fluide**."
      ],
      why: "Plus de la moitié des visites sur le web se font sur téléphone. Une page qui **déborde** oblige à faire défiler sur le côté pour lire chaque ligne : la plupart des visiteurs abandonnent. Google classe même moins bien les sites qui ne sont pas adaptés aux mobiles.",
      lang: "html",
      code: `<head>\n  <meta charset="utf-8">\n  <meta name="viewport"\n        content="width=device-width, initial-scale=1">\n  <title>Le concours de Kami</title>\n  <link rel="stylesheet" href="style.css">\n</head>`,
      pieces: [
        ["<meta name=\"viewport\">", "la **balise viewport** : une balise orpheline, dans le `<head>` de **chaque** page HTML"],
        ["width=device-width", "« la largeur de la page = la largeur réelle de l’écran », au lieu des 980px imaginaires"],
        ["initial-scale=1", "« pas de zoom au départ » : 1 pixel CSS de la page = 1 pixel CSS de l’écran"],
        ["max-width: 600px", "en CSS : « jamais plus de 600px », mais la boîte peut rétrécir. À préférer à `width: 600px` pour les grands blocs"]
      ],
      trap: "Oublier la balise viewport : sur un vrai téléphone, la page s’affiche en tout petit, comme une page d’ordinateur rétrécie, et **aucune** de tes règles responsive ne marche comme prévu. Dans l’aperçu de ce jeu, la page est déjà affichée comme si la balise était là : dans tes propres pages, c’est à toi de l’écrire.",
      good: "Mets la balise viewport dans le `<head>` de chaque page, juste après `<meta charset=\"utf-8\">` : c’est la première ligne du responsive. Puis teste ta page sur les trois écrans **dès le début** de ton travail, pas à la fin."
    },
    base: `.affiche { background-color: #E1F7EC; border: 4px solid #1E9E66; border-radius: 16px; padding: 16px; }\n.affiche h1 { margin-top: 0; color: #1E9E66; line-height: 1.15; }\n.date { font-weight: 700; margin-bottom: 0; }`,
    html: `<div class="affiche">
  <h1>Grand concours de camouflage</h1>
  <p>Au bord de l’étang, qui saura se cacher le mieux ? Kami remet son titre en jeu. Venez nombreux, les lucioles éclairent la soirée !</p>
  <p class="date">Samedi 14 juin · 18 h</p>
</div>`,
    steps: [
      "Au-dessus de l’aperçu, clique sur **Téléphone** : l’affiche sort de l’écran. Clique sur **Ordinateur** : là, tout va bien.",
      "Dans la règle `.affiche`, remplace `width` par `max-width` (garde la valeur `600px`).",
      "Regarde à nouveau les trois écrans, puis clique sur **Vérifier**."
    ],
    starter: `/* L’affiche du concours */\n.affiche {\n  width: 600px;\n}\n`,
    goals: [
      { label: "Sur téléphone, l’affiche tient dans l’écran : rien ne déborde", test: c => !overflowAt(c, "mobile") || (decl(c, ".affiche", "width") ? "Sur téléphone, la page est plus large que l’écran : la déclaration width fait encore dépasser l’affiche. Garde seulement max-width." : "Sur téléphone, la page est plus large que l’écran : l’affiche dépasse encore.") },
      { label: "Sur téléphone, l’affiche rétrécit avec l’écran", test: c => { const b = boxAt(c, "mobile", ".affiche"); return (!!b && b.right <= 375 - 15) || "L’affiche doit s’arrêter avant le bord droit du téléphone."; } },
      { label: "Sur ordinateur, l’affiche ne dépasse pas `600px`", test: c => rPx(c, "ordi", ".affiche", "width") === 600 || (rPx(c, "ordi", ".affiche", "width") > 600 ? "Sur ordinateur, l’affiche s’étire sur toute la largeur : garde une limite de 600px avec max-width." : false) },
      { label: "Tu utilises `max-width` au lieu d’une largeur fixe", test: c => csAt(c, "ordi", ".affiche", "max-width") === "600px" || "Écris max-width: 600px; dans la règle .affiche." },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Le problème : `width: 600px` est plus large que l’écran du téléphone (375px).",
      "Il suffit de changer le nom de la propriété : `max-width` au lieu de `width`.",
      "La règle complète : `.affiche { max-width: 600px; }`"
    ],
    solution: `/* L’affiche du concours */\n.affiche {\n  max-width: 600px;\n}\n`,
    debrief: "Un seul mot a tout changé : `max-width` laisse la boîte rétrécir sur un petit écran, sans jamais dépasser 600px sur un grand. C’est l’idée de base du responsive : des largeurs **fluides** plutôt que fixes. Et n’oublie pas la balise viewport dans le `<head>` de tes vraies pages : sans elle, le téléphone ne joue pas le jeu."
  },
  {
    id: "image-fluide", ch: 1, title: "La photo qui déborde", notion: "les images fluides",
    say: "Mon affiche tient dans l’écran, merci ! Maintenant, ma photo de vacances : elle fait 1200 pixels de large, et sur téléphone, on n’en voit qu’un petit bout. Aide-moi à la faire tenir.",
    lesson: {
      what: [
        "Une image a une **taille naturelle** : celle de son fichier. Ma photo fait 1200px de large sur 600px de haut. Le navigateur l’affiche à cette taille… même si l’écran ne fait que 375px : elle **déborde**.",
        "La solution tient en deux déclarations. `max-width: 100%` : l’image n’est **jamais plus large que son parent** (ici, le `body`). `height: auto` : la hauteur se calcule toute seule à partir de la largeur, pour garder les **proportions**. Une image qui suit ainsi la largeur disponible est une **image fluide**."
      ],
      why: "Les images sont la première cause de débordement sur téléphone. Cette petite règle, écrite une fois pour toutes les images (`img`), règle le problème sur toute la page, et pour toutes les images que tu ajouteras plus tard.",
      code: `img {\n  max-width: 100%;\n  height: auto;\n}`,
      pieces: [
        ["img", "un **sélecteur de balise** : la règle vise toutes les images de la page"],
        ["max-width: 100%", "jamais plus large que son parent : sur téléphone, l’image rapetisse ; sur ordinateur, elle garde sa taille naturelle"],
        ["height: auto", "la hauteur suit la largeur : l’image n’est pas écrasée"],
        ["width=\"1200\" height=\"600\"", "dans le HTML, ces attributs donnent la taille naturelle. Sans `height: auto` dans le CSS, la hauteur resterait bloquée à 600px"]
      ],
      trap: "Écrire `width: 100%` au lieu de `max-width: 100%` : l’image remplit toujours toute la largeur, même si elle est petite. Sur un grand écran, elle est **agrandie** au-delà de sa taille réelle et devient floue. Et sans `height: auto`, elle est écrasée.",
      good: [
        "Mets `img { max-width: 100%; height: auto; }` tout au début de chaque feuille de style : c’est la règle numéro un du responsive.",
        "Garde les attributs `width` et `height` sur chaque `<img>` dans le HTML : le navigateur réserve la bonne place avant même que l’image soit téléchargée, et la page ne « saute » pas pendant le chargement."
      ]
    },
    html: `<h1>Mes vacances</h1>
<img src="img/paysage.svg" alt="Kami sur une colline, au soleil" width="1200" height="600">
<p>Le plus beau paysage de la forêt, vu depuis ma colline préférée.</p>`,
    steps: [
      "Regarde la page en **Téléphone** : l’image sort de l’écran.",
      "Écris une règle pour toutes les images, `img`, avec `max-width: 100%` et `height: auto`.",
      "Vérifie en **Téléphone**, puis en **Ordinateur** : sur ordinateur, l’image garde sa taille réelle."
    ],
    starter: `/* Fais tenir l’image dans l’écran */\n`,
    goals: [
      { label: "Sur téléphone, rien ne déborde", test: c => !overflowAt(c, "mobile") || "La page est plus large que l’écran du téléphone : l’image dépasse encore." },
      { label: "Sur téléphone, l’image prend la largeur de l’écran", test: c => { const i = boxAt(c, "mobile", "img"), b = boxAt(c, "mobile", "body"); return (!!i && !!b && Math.abs(i.width - b.width) < 2) || false; } },
      { label: "L’image garde ses proportions (elle n’est pas écrasée)", test: c => { const i = boxAt(c, "mobile", "img"); return (!!i && i.height > 0 && Math.abs(i.width / i.height - 2) < 0.05) || (decl(c, "img", "max-width") ? "L’image est écrasée : ajoute height: auto;" : false); } },
      { label: "Sur ordinateur, l’image n’est pas agrandie au-delà de sa taille réelle (1200px)", test: c => rW(c, "ordi", "img") === 1200 || (rW(c, "ordi", "img") > 1200 ? "Sur ordinateur, l’image est étirée au-delà de 1200px : utilise max-width, pas width." : false) },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Le sélecteur de toutes les images : `img`.",
      "Deux déclarations : `max-width: 100%;` et `height: auto;`",
      "La règle complète : `img { max-width: 100%; height: auto; }`"
    ],
    solution: `/* Fais tenir l’image dans l’écran */\nimg {\n  max-width: 100%;\n  height: auto;\n}\n`,
    debrief: "`max-width: 100%` : l’image rapetisse si l’écran est petit, mais ne grandit jamais au-delà de sa taille. `height: auto` garde ses proportions. Tous les sites professionnels commencent leur CSS par cette règle : les photos d’un article de journal, d’une boutique ou d’un blog tiennent ainsi sur tous les écrans."
  },
  {
    id: "largeurs-fluides", ch: 1, title: "La barre de recherche", notion: "les largeurs en % et box-sizing",
    say: "Sur mon site de recettes, la barre de recherche dépasse de son cadre, et le bouton sort de l’écran du téléphone. Pourtant j’ai écrit `100%` ! Tu comprends pourquoi ?",
    lesson: {
      what: [
        "Une largeur en **pourcentage** (`%`) est une part de la largeur du **parent** : `width: 100%` = toute la largeur du parent, `width: 50%` = la moitié. C’est une **unité relative** : elle suit la taille du parent, donc de l’écran.",
        "Mais attention au **modèle de boîte** : par défaut (`box-sizing: content-box`), la largeur ne compte que le **contenu**. Le `padding` et la `border` s’ajoutent **en plus**. Un champ de `width: 100%` avec 12px de `padding` et 3px de bordure de chaque côté fait donc 100% **+ 30px** : il déborde.",
        "Avec `box-sizing: border-box`, la largeur **comprend** le padding et la bordure : `width: 100%` fait vraiment 100%. On l’applique à tous les éléments avec le **sélecteur universel** `*`."
      ],
      why: "Sur un écran étroit, chaque pixel compte : 30px de trop suffisent à faire déborder un champ ou toute la page. Avec `border-box`, les largeurs en `%` deviennent fiables, et le calcul des tailles devient simple.",
      code: `* {\n  box-sizing: border-box;\n}\n\n.bouton {\n  width: 100%;\n  max-width: 400px;\n}`,
      pieces: [
        ["*", "le **sélecteur universel** : il vise tous les éléments de la page"],
        ["box-sizing: border-box", "la largeur comprend le contenu, le `padding` et la `border`"],
        ["width: 100%", "toute la largeur du parent (ici, le formulaire)"],
        ["max-width: 400px", "mais jamais plus de 400px : sur ordinateur, un bouton de 1200px de large serait ridicule"]
      ],
      example: { code: `.a, .b {\n  width: 100%;\n  padding: 12px;\n  border: 3px solid teal;\n}\n\n.b {\n  box-sizing: border-box;\n}`, html: `<div style="border: 2px dashed #999; width: 220px">\n  <p class="a">content-box : je déborde</p>\n  <p class="b">border-box : je tiens</p>\n</div>` },
      trap: "Croire que `width: 100%` suffit : sans `box-sizing: border-box`, le `padding` et la bordure s’ajoutent et la boîte déborde. Autre piège : une largeur fixe comme `width: 400px` sur un bouton, plus large que l’écran d’un téléphone.",
      good: "Commence **chaque** feuille de style par `* { box-sizing: border-box; }` (les pros écrivent souvent `*, *::before, *::after`), juste à côté de la règle des images fluides. Puis pense « fluide » : `width: 100%` et une limite avec `max-width`, plutôt qu’une largeur fixe."
    },
    showHTML: true,
    base: `.recherche { background-color: #E1F0F7; padding: 16px; border-radius: 12px; }\nlabel { display: block; font-weight: 700; margin-bottom: 8px; }\n.champ, .bouton { display: block; font: inherit; }\n.bouton { margin-top: 12px; padding: 12px; border: 0; border-radius: 999px; background-color: #0B6E99; color: white; font-weight: 700; }`,
    html: `<form class="recherche">
  <label for="q">Chercher une recette de Kami</label>
  <input id="q" class="champ" type="text" placeholder="Grillons, mouches, nectar…">
  <button class="bouton" type="submit">Chercher</button>
</form>`,
    steps: [
      "Tout en haut du code, ajoute une règle `*` avec `box-sizing: border-box`.",
      "Dans la règle `.bouton`, remplace la largeur fixe : `width: 100%` et `max-width: 400px`.",
      "Vérifie sur les trois écrans : le champ reste dans son cadre, et le bouton ne dépasse jamais."
    ],
    starter: `/* La barre de recherche */\n.champ {\n  width: 100%;\n  padding: 12px;\n  border: 3px solid #0B6E99;\n}\n\n.bouton {\n  width: 400px;\n}\n`,
    goals: [
      { label: "Tous les éléments ont `box-sizing: border-box` (sélecteur `*`)", test: c => (csAt(c, "mobile", ".champ", "box-sizing") === "border-box" && csAt(c, "mobile", ".recherche", "box-sizing") === "border-box" && csAt(c, "mobile", "label", "box-sizing") === "border-box") || (csAt(c, "mobile", ".champ", "box-sizing") === "border-box" ? "Le champ est en border-box : mets-le sur tous les éléments avec le sélecteur universel *." : false) },
      { label: "Sur téléphone et sur ordinateur, le champ remplit le formulaire sans en dépasser", test: c => { const ko = rFail(id => { const f = boxAt(c, id, ".recherche"), e = boxAt(c, id, ".champ"); if (!f || !e) return false; const inner = f.right - rPx(c, id, ".recherche", "padding-right"); return e.right <= inner + 0.5 && e.width >= f.width - 33; }, ["mobile", "ordi"]); return !ko.length || `Le champ dépasse de son cadre (${ko.join(", ")}) : son padding et sa bordure s’ajoutent à 100%.`; } },
      { label: "Sur téléphone, le bouton tient dans le formulaire", test: c => { const f = boxAt(c, "mobile", ".recherche"), b = boxAt(c, "mobile", ".bouton"); return (!!f && !!b && b.right <= f.right - 15.5 && !overflowAt(c, "mobile")) || "Le bouton sort du formulaire sur téléphone : sa largeur fixe est trop grande."; } },
      { label: "Sur ordinateur, le bouton ne dépasse pas `400px`", test: c => rW(c, "ordi", ".bouton") === 400 || (rW(c, "ordi", ".bouton") > 400 ? "Sur ordinateur, le bouton est immense : ajoute max-width: 400px;" : false) },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Le sélecteur universel s’écrit avec une étoile : `* { }`.",
      "En haut : `* { box-sizing: border-box; }`. Dans `.bouton` : `width: 100%;` au lieu de `width: 400px;`.",
      "Et sous `width: 100%;`, ajoute `max-width: 400px;` dans la règle `.bouton`."
    ],
    solution: `/* La barre de recherche */\n* {\n  box-sizing: border-box;\n}\n\n.champ {\n  width: 100%;\n  padding: 12px;\n  border: 3px solid #0B6E99;\n}\n\n.bouton {\n  width: 100%;\n  max-width: 400px;\n}\n`,
    debrief: "`%` suit la largeur du parent, `max-width` pose une limite, et `box-sizing: border-box` fait que les deux tombent juste. Ces trois outils rendent n’importe quel formulaire, carte ou bloc fluide. Le combo `width: 100%` + `max-width` est partout : boutons de paiement, champs de connexion, barres de recherche."
  },
  {
    id: "quiz1", ch: 1, quiz: true, title: "Contrôle du téléphone", notion: "quiz",
    say: "Avant d’allumer mon premier écran, un petit contrôle. Tout juste, et le téléphone s’allume !",
    questions: [
      { q: "Ta page n’a pas de balise viewport. Que fait un téléphone en l’affichant ?", opts: ["Il l’affiche parfaitement, la balise ne sert qu’aux tablettes", "Il fait comme s’il avait un écran d’ordinateur (environ 980px), puis rétrécit tout", "Il refuse d’afficher la page"], a: 1, why: "Sans `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`, le téléphone affiche une version d’ordinateur rétrécie : texte minuscule, zoom obligatoire, et les media queries ne fonctionnent pas comme prévu." },
      { q: "Où écris-tu la balise viewport ?", opts: ["Dans le fichier `style.css`", "Dans le `<footer>` de la page", "Dans le `<head>` de chaque page HTML"], a: 2, why: "C’est une balise `<meta>` : elle se place dans le `<head>`, avec `<meta charset=\"utf-8\">` et le `<title>`. Ce n’est pas du CSS." },
      { q: "Quelle règle rend une image fluide, sans jamais l’agrandir au-delà de sa taille réelle ?", opts: ["`img { max-width: 100%; height: auto; }`", "`img { width: 100%; }`", "`img { width: 1200px; }`"], a: 0, why: "`max-width: 100%` laisse l’image rétrécir sans jamais la grandir, et `height: auto` garde ses proportions. `width: 100%` agrandirait aussi les petites images (floues), et une largeur fixe déborde." },
      { q: "Dans un parent de 300px, sans `box-sizing`, quelle est la largeur totale de cette boîte ?", code: `.boite {\n  width: 100%;\n  padding: 20px;\n  border: 2px solid teal;\n}`, opts: ["300px", "344px", "322px"], a: 1, why: "Par défaut (`content-box`), le padding (2 × 20px) et la bordure (2 × 2px) s’ajoutent : 300 + 40 + 4 = 344px. Elle déborde de 44px. Avec `box-sizing: border-box`, elle ferait 300px." },
      { q: "Pourquoi préférer `max-width: 600px` à `width: 600px` pour une grande boîte ?", opts: ["Parce que la boîte peut rétrécir sur un petit écran, sans dépasser 600px sur un grand", "Parce que `max-width` est plus rapide à charger", "Il n’y a aucune différence"], a: 0, why: "`width` fixe la largeur, même si l’écran est plus étroit : la boîte déborde. `max-width` est une limite : la boîte est **fluide** en dessous." }
    ],
    debrief: "Tu connais les bases du responsive : la balise viewport dans le `<head>`, les images fluides, les largeurs en `%` avec `max-width`, et `box-sizing: border-box`. Le premier écran s’allume près de Kami : le téléphone !"
  },

  /* ------------------------------ ATELIER 2 : LES MEDIA QUERIES ------------------------------ */
  {
    id: "menu-colonne", ch: 2, title: "Le menu qui s’empile", notion: "@media et max-width",
    say: "Sur ordinateur, mon menu est en ligne, c’est joli. Mais sur téléphone, les liens sont tout serrés et ils se coupent en deux ! Empile-les sur les petits écrans.",
    lesson: {
      what: [
        "Jusqu’ici, tes règles s’appliquaient à **tous** les écrans. Une **media query** applique des règles **seulement** si une **condition** est vraie : `@media (condition) { … }`. Entre ses accolades, on écrit des **règles complètes**, avec leurs propres accolades : il y a donc **deux niveaux** d’accolades.",
        "La condition `(max-width: 600px)` veut dire : « si l’écran fait **600px de large ou moins** ». Le téléphone (375px) est concerné ; la tablette (768px) et l’ordinateur (1280px) ne le sont pas. Cette largeur où la mise en page change s’appelle un **point de rupture**."
      ],
      why: "C’est l’outil central du responsive : la même page HTML, des règles différentes selon la largeur de l’écran. Sans media query, tu devrais choisir entre une mise en page pour téléphone et une pour ordinateur.",
      code: `.menu {\n  display: flex;\n  gap: 12px;\n}\n\n/* Écrans de 600px ou moins */\n@media (max-width: 600px) {\n  .menu {\n    flex-direction: column;\n  }\n}`,
      pieces: [
        ["@media", "le début d’une media query : « si l’écran… »"],
        ["(max-width: 600px)", "la condition : une largeur **au maximum** de 600px"],
        ["{ … }", "les accolades de la media query entourent des règles entières"],
        [".menu { … }", "une règle normale, rangée dans la media query, et indentée de 2 espaces de plus"],
        ["flex-direction: column", "rappel de Flexbox : l’**axe principal** devient vertical, les liens s’empilent"]
      ],
      trap: "Oublier l’accolade qui ferme la media query : toutes les règles écrites après se retrouvent **dedans** et ne s’appliquent plus que sur téléphone. Indente bien l’intérieur pour voir les deux niveaux. Autre piège : écrire la media query **avant** la règle normale. À spécificité égale, c’est la dernière règle écrite qui gagne la cascade.",
      good: "Écris tes media queries **après** les règles normales, à la fin du fichier ou juste après le composant qu’elles modifient, et mets un commentaire au-dessus (`/* Écrans de 600px ou moins */`). Dans une media query, n’écris que ce qui **change** : le reste vient déjà des règles normales."
    },
    base: `.menu { display: flex; gap: 12px; }\n.menu a { background-color: #E1F7EC; padding: 10px 16px; border-radius: 8px; color: #1B2440; font-weight: 700; text-decoration: none; }`,
    html: `<nav class="menu">
  <a href="#">Accueil</a>
  <a href="#">Mes photos</a>
  <a href="#">Mes amis</a>
  <a href="#">Me contacter</a>
</nav>`,
    steps: [
      "Regarde le menu en **Téléphone**, puis en **Tablette** et en **Ordinateur**.",
      "Sous le commentaire, écris une media query `@media (max-width: 600px) { }`.",
      "Dedans, écris une règle complète : `.menu` passe en `flex-direction: column`."
    ],
    starter: `/* Le menu est déjà en ligne (display: flex dans le CSS de base) */\n\n/* Écrans de 600px ou moins */\n`,
    goals: [
      { label: "Une media query `@media (max-width: 600px)` existe", test: c => rMedia(c, /max-width\s*:\s*600px/i).length > 0 || (rMedia(c, /./).length ? "Ta media query doit avoir la condition (max-width: 600px)." : (/@media/.test(c.clean) ? "Ta media query est vide : écris une règle complète entre ses accolades." : false)) },
      { label: "Sur téléphone, les liens sont empilés", test: c => csAt(c, "mobile", ".menu", "flex-direction") === "column" },
      { label: "Sur tablette et ordinateur, le menu reste en ligne", test: c => { const ko = rFail(id => csAt(c, id, ".menu", "flex-direction") === "row", ["tablette", "ordi"]); return !ko.length || `Le menu est empilé aussi sur ${ko.join(" et ")} : ta règle est-elle bien À L’INTÉRIEUR de la media query, avec 600px ?`; } },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Une media query s’écrit : `@media (max-width: 600px) {` … `}`.",
      "Entre ses accolades, une règle complète : `.menu { flex-direction: column; }`",
      "En entier : `@media (max-width: 600px) {` puis `  .menu {` puis `    flex-direction: column;` puis `  }` puis `}`."
    ],
    solution: `/* Le menu est déjà en ligne (display: flex dans le CSS de base) */\n\n/* Écrans de 600px ou moins */\n@media (max-width: 600px) {\n  .menu {\n    flex-direction: column;\n  }\n}\n`,
    debrief: "Une media query, c’est un « si » pour le CSS : si l’écran fait 600px ou moins, alors ces règles s’appliquent. Les menus de presque tous les sites changent ainsi de forme sur téléphone. Ici, tu as **retiré** la mise en ligne pour les petits écrans : c’est la méthode *ordinateur d’abord*. Dans la mission suivante, tu vas faire l’inverse."
  },
  {
    id: "mobile-dabord", ch: 2, title: "Le grillon du jour", notion: "min-width et mobile d’abord",
    say: "Sur ma fiche « grillon du jour », la photo est au-dessus du texte : parfait pour un téléphone. Mais sur un grand écran, je voudrais la photo à gauche et le texte à droite. Et cette fois, on pense au téléphone d’abord !",
    lesson: {
      what: [
        "La condition `(min-width: 768px)` veut dire : « si l’écran fait **768px de large ou plus** ». C’est l’inverse de `max-width` : la tablette (768px) et l’ordinateur (1280px) sont concernés, pas le téléphone.",
        "Avec `min-width`, on écrit son CSS **mobile d’abord** (*mobile first*) : les règles normales, hors media query, sont celles du **téléphone**. Puis on **ajoute** ce qui change pour les écrans plus grands, dans des media queries `min-width`. On part du simple (une colonne) pour aller vers le riche (plusieurs colonnes)."
      ],
      why: "Le téléphone est l’écran le plus contraint (petit, souvent moins puissant, parfois mal connecté) : en commençant par lui, on garde l’essentiel et un CSS léger. Le téléphone ne lit que les règles de base ; les grands écrans, eux, ajoutent leurs règles par-dessus. C’est la méthode conseillée aujourd’hui.",
      code: `/* Téléphone (le CSS de base) */\n.fiche {\n  display: flex;\n  flex-direction: column;\n}\n\n/* Écrans de 768px et plus */\n@media (min-width: 768px) {\n  .fiche {\n    flex-direction: row;\n  }\n\n  .portrait {\n    width: 40%;\n  }\n\n  .texte {\n    flex: 1;\n  }\n}`,
      pieces: [
        ["/* Téléphone */", "les règles hors media query s’appliquent à **tous** les écrans : on y met la version téléphone"],
        ["@media (min-width: 768px)", "« si l’écran fait **au moins** 768px » : tablette et ordinateur"],
        ["flex-direction: row", "sur grand écran, la photo et le texte passent côte à côte"],
        ["width: 40%", "la photo prend 40 % de la largeur de la fiche, le texte le reste"],
        ["flex: 1", "rappel de Flexbox : le texte **grandit** pour prendre toute la place restante"]
      ],
      trap: "Mélanger les deux méthodes au hasard (des `max-width` ici, des `min-width` là) : on ne sait plus quelle règle gagne sur quel écran. Choisis une méthode, mobile d’abord de préférence, et tiens-la. Et ne cherche pas à viser un appareil précis : `768px` est un repère, pas « l’iPad ».",
      good: "Organise ta feuille de style dans cet ordre : d’abord les règles de base (le téléphone), puis les media queries `min-width`, de la plus petite à la plus grande. Écris un commentaire au-dessus de chaque bloc : `/* Téléphone */`, `/* Tablette et plus : 768px */`."
    },
    base: `.fiche { background-color: #FFF8E7; border: 3px solid #1B2440; border-radius: 16px; padding: 16px; }\n.portrait { display: block; max-width: 100%; height: auto; border-radius: 12px; }\n.texte h1 { margin: 0 0 8px; color: #1E9E66; line-height: 1.15; }\n.texte p { margin: 0; }`,
    showHTML: true,
    html: `<article class="fiche">
  <img class="portrait" src="img/grillon.svg" alt="Un grillon dodu sur fond jaune" width="600" height="600">
  <div class="texte">
    <h1>Le grillon du jour</h1>
    <p>Croustillant, dodu et bien sautillant : le grillon des prés est le préféré de Kami. On le trouve dans les herbes hautes, au bord de l’étang, dès que le soleil chauffe.</p>
  </div>
</article>`,
    steps: [
      "Le CSS du téléphone est déjà écrit : la fiche est un conteneur flex en colonne. Regarde-la en **Téléphone**.",
      "Sous le dernier commentaire, écris une media query `@media (min-width: 768px) { }`.",
      "Dedans : la `.fiche` passe en `flex-direction: row`, la `.portrait` prend `width: 40%`, et le `.texte` prend `flex: 1`.",
      "Vérifie les trois écrans : sur téléphone, rien ne doit changer."
    ],
    starter: `/* Téléphone (le CSS de base) : la photo au-dessus du texte */\n.fiche {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n\n/* Tablette et ordinateur : 768px et plus */\n`,
    goals: [
      { label: "Sur téléphone, la photo est au-dessus du texte", test: c => rBelow(c, "mobile", ".portrait", ".texte") || "Sur téléphone, la photo doit rester au-dessus du texte : les règles du grand écran sont-elles bien dans la media query ?" },
      { label: "Sur tablette et ordinateur, la photo est à gauche du texte", test: c => { const ko = rFail(id => rSide(c, id, ".portrait", ".texte"), ["tablette", "ordi"]); return !ko.length || `Pas encore côte à côte sur ${ko.join(" et ")}.`; } },
      { label: "Sur grand écran, la photo prend moins de la moitié de la fiche", test: c => { const ko = rFail(id => { const p = boxAt(c, id, ".portrait"), f = boxAt(c, id, ".fiche"); return !!p && !!f && p.width <= f.width * 0.5; }, ["tablette", "ordi"]); return !ko.length || "La photo est trop large : donne-lui width: 40%; dans la media query."; } },
      { label: "Mobile d’abord : les grands écrans sont dans `@media (min-width: …)`", test: c => rMedia(c, /min-width/i).some(r => /fiche|portrait/.test(r.sel)) || (rMedia(c, /max-width/i).length ? "Mobile d’abord : utilise min-width (« au moins »), pas max-width." : false) },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "La media query : `@media (min-width: 768px) {` … `}`.",
      "Dedans, trois règles : `.fiche { flex-direction: row; }`, `.portrait { width: 40%; }` et `.texte { flex: 1; }`.",
      "Pour un joli rendu, ajoute `align-items: center;` dans la règle `.fiche` de la media query."
    ],
    solution: `/* Téléphone (le CSS de base) : la photo au-dessus du texte */\n.fiche {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n\n/* Tablette et ordinateur : 768px et plus */\n@media (min-width: 768px) {\n  .fiche {\n    flex-direction: row;\n    align-items: center;\n  }\n\n  .portrait {\n    width: 40%;\n  }\n\n  .texte {\n    flex: 1;\n  }\n}\n`,
    debrief: "Mobile d’abord : le CSS de base est celui du téléphone, et `@media (min-width: …)` **ajoute** pour les grands écrans. C’est l’inverse du menu de la mission précédente, et c’est la méthode des sites modernes : les fiches produits, les articles et les profils passent ainsi d’une colonne à deux. Changer `flex-direction` au point de rupture est l’un des gestes les plus courants du responsive."
  },
  {
    id: "points-de-rupture", ch: 2, title: "Le carnet de voyage", notion: "plusieurs points de rupture",
    say: "Mon carnet de voyage a six jours d’aventures. Une colonne sur téléphone, c’est bien. Mais sur tablette, j’en veux deux, et sur ordinateur, trois !",
    lesson: {
      what: [
        "Une page peut avoir **plusieurs points de rupture**. En mobile d’abord, on les écrit **du plus petit au plus grand** : une media query `min-width: 768px` pour la tablette, puis une `min-width: 1024px` pour l’ordinateur.",
        "Sur un écran de 1280px, les **deux** conditions sont vraies : les deux media queries s’appliquent. C’est la **cascade** qui départage : à spécificité égale, la dernière règle écrite gagne. Voilà pourquoi l’ordre compte."
      ],
      why: "Entre un téléphone et un grand écran, il y a de la place pour plusieurs mises en page. Deux ou trois points de rupture suffisent presque toujours : on ajoute une colonne quand la place le permet.",
      code: `.jours {\n  display: grid;\n  grid-template-columns: 1fr;\n}\n\n@media (min-width: 768px) {\n  .jours {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n\n@media (min-width: 1024px) {\n  .jours {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}`,
      pieces: [
        ["grid-template-columns: 1fr", "le téléphone : une seule colonne"],
        ["min-width: 768px", "le premier point de rupture : 2 colonnes à partir de la tablette"],
        ["min-width: 1024px", "le second : 3 colonnes à partir de 1024px (l’ordinateur)"],
        ["repeat(3, 1fr)", "rappel de Grid : trois colonnes égales, comme `1fr 1fr 1fr`"],
        ["l’ordre", "du plus petit au plus grand : sur 1280px, la règle de 1024px est écrite après et gagne"]
      ],
      trap: "Écrire la media query de 1024px **avant** celle de 768px : sur ordinateur, les deux conditions sont vraies, et c’est celle de 768px, écrite en dernier, qui gagne. Résultat : 2 colonnes au lieu de 3.",
      good: "Choisis tes points de rupture **là où ta page casse** : élargis l’écran petit à petit (avec le mode responsive du navigateur), et ajoute un point de rupture quand la mise en page devient trop étirée ou trop serrée. Garde-en peu, et toujours les mêmes dans tout le site."
    },
    base: `.jours { list-style: none; margin: 0; padding: 0; }\n.jour { background-color: #E1F7EC; border: 3px solid #1E9E66; border-radius: 12px; padding: 16px; }\n.jour b { display: block; color: #1E9E66; }`,
    html: `<h1>Le carnet de voyage de Kami</h1>
<ul class="jours">
  <li class="jour"><b>Lundi</b> La forêt des grands chênes.</li>
  <li class="jour"><b>Mardi</b> Pique-nique au bord de l’étang.</li>
  <li class="jour"><b>Mercredi</b> Sieste sur la plus haute branche.</li>
  <li class="jour"><b>Jeudi</b> Visite de l’atelier de Bip.</li>
  <li class="jour"><b>Vendredi</b> Soirée avec les lucioles.</li>
  <li class="jour"><b>Samedi</b> Le grand concours de camouflage.</li>
</ul>`,
    steps: [
      "Le téléphone est prêt : une seule colonne. Sous le commentaire « Tablette », écris `@media (min-width: 768px)` avec une grille de 2 colonnes.",
      "Sous le commentaire « Ordinateur », écris `@media (min-width: 1024px)` avec une grille de 3 colonnes.",
      "Vérifie les trois écrans : 1, 2 et 3 colonnes."
    ],
    starter: `/* Téléphone : une seule colonne */\n.jours {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 12px;\n}\n\n/* Tablette : 768px et plus, 2 colonnes */\n\n\n/* Ordinateur : 1024px et plus, 3 colonnes */\n`,
    goals: [
      { label: "Sur téléphone, une seule colonne", test: c => rCols(c, "mobile", ".jour") === 1 || "Sur téléphone, il ne doit y avoir qu’une colonne : vérifie que tes règles sont dans les media queries." },
      { label: "Sur tablette, deux colonnes", test: c => rCols(c, "tablette", ".jour") === 2 || `Sur tablette, il y a ${rCols(c, "tablette", ".jour")} colonne(s).` },
      { label: "Sur ordinateur, trois colonnes", test: c => { const n = rCols(c, "ordi", ".jour"); return n === 3 || (n === 2 && rMedia(c, /1024/).length ? "Deux colonnes seulement : ta media query de 1024px est-elle écrite APRÈS celle de 768px ?" : `Sur ordinateur, il y a ${n} colonne(s).`); } },
      { label: "Deux media queries `min-width`, de la plus petite à la plus grande", test: c => { const ws = rMedia(c, /min-width/i).map(r => parseFloat((r.media.match(/min-width\s*:\s*([\d.]+)/i) || [])[1])).filter(n => n > 0); const uniq = ws.filter((n, i) => ws.indexOf(n) === i); return (uniq.length >= 2 && uniq.every((n, i) => i === 0 || n > uniq[i - 1])) || (uniq.length >= 2 ? "Range tes media queries de la plus petite à la plus grande largeur." : false); } },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Tablette : `@media (min-width: 768px) { .jours { grid-template-columns: 1fr 1fr; } }`",
      "Ordinateur : `@media (min-width: 1024px) { .jours { grid-template-columns: repeat(3, 1fr); } }`",
      "Écris la media query de 768px **avant** celle de 1024px, chacune sous son commentaire."
    ],
    solution: `/* Téléphone : une seule colonne */\n.jours {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 12px;\n}\n\n/* Tablette : 768px et plus, 2 colonnes */\n@media (min-width: 768px) {\n  .jours {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n\n/* Ordinateur : 1024px et plus, 3 colonnes */\n@media (min-width: 1024px) {\n  .jours {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}\n`,
    debrief: "Deux points de rupture, trois mises en page, et une seule liste HTML. En mobile d’abord, les media queries vont **du plus petit au plus grand**, et chacune ne change que ce qui doit changer. C’est exactement ce que font les boutiques en ligne : 1, 2, puis 3 ou 4 produits par ligne."
  },
  {
    id: "afficher-masquer", ch: 2, title: "Le bon bouton au bon endroit", notion: "afficher et masquer : display: none",
    say: "Sur téléphone, un gros bouton « Appeler Kami » est super pratique : un doigt, et ça sonne ! Sur ordinateur, il ne sert à rien. Et ma grande illustration de la forêt est trop lourde pour un petit écran.",
    lesson: {
      what: [
        "Rappel du jeu CSS : `display: none` retire un élément de l’affichage, comme s’il n’existait pas. Il ne prend plus aucune place.",
        "Dans une media query, il permet d’**afficher ou de masquer** un élément selon l’écran. En mobile d’abord : on cache dans les règles de base ce qui ne sert que sur grand écran, puis on l’affiche à nouveau dans `@media (min-width: …)` avec `display: block` (et inversement)."
      ],
      why: "Certains éléments n’ont de sens que sur un écran : un bouton d’appel (`href=\"tel:…\"`) est utile sur un téléphone, pas sur un ordinateur ; une grande illustration **décorative** encombre un petit écran.",
      code: `/* Téléphone */\n.decor {\n  display: none;\n}\n\n/* Écrans de 768px et plus */\n@media (min-width: 768px) {\n  .appeler {\n    display: none;\n  }\n\n  .decor {\n    display: block;\n  }\n}`,
      pieces: [
        ["display: none", "l’élément disparaît et ne prend plus de place"],
        ["display: block", "dans la media query, l’élément réapparaît, en élément de bloc"],
        [".appeler", "le bouton d’appel : visible sur téléphone, caché à partir de 768px"],
        [".decor", "l’illustration décorative (son `alt` est vide) : cachée sur téléphone, visible à partir de 768px"]
      ],
      trap: [
        "`display: none` a des limites. L’élément est **toujours dans le HTML** : une image cachée est souvent **téléchargée quand même**, donc la page n’est pas plus légère. Et il disparaît aussi pour les **lecteurs d’écran**.",
        "Surtout, ne cache **jamais l’essentiel** sur téléphone (les horaires, les prix, le formulaire) : le visiteur mobile a droit au même contenu. On cache seulement le décoratif ou ce qui ne sert pas sur cet écran. Et n’utilise pas `visibility: hidden` : l’élément est invisible mais garde sa place, ce qui laisse un grand trou."
      ],
      good: "Avant de cacher quelque chose sur téléphone, demande-toi : « est-ce que le visiteur mobile en a besoin ? ». Si oui, **range-le autrement** (plus bas, en colonne) au lieu de le cacher. `display: none` est aussi l’outil du JavaScript pour ouvrir et fermer un menu : tu le retrouveras dans le jeu suivant."
    },
    showHTML: true,
    base: `.appeler { display: block; padding: 14px; border-radius: 999px; background-color: #1E9E66; color: white; text-align: center; font-weight: 700; text-decoration: none; }\n.decor { max-width: 100%; height: auto; border-radius: 12px; }`,
    html: `<h1>Kami, guide de la forêt</h1>
<p class="horaires"><b>Visites guidées</b> tous les jours de 9 h à 18 h, départ devant le grand chêne.</p>
<a class="appeler" href="tel:+33100000000">Appeler Kami</a>
<img class="decor" src="img/foret.svg" alt="" width="800" height="500">
<p class="tarifs">Tarif : 5 € la balade, gratuit pour les lucioles.</p>`,
    steps: [
      "Sous le premier commentaire (téléphone), cache l’illustration `.decor` avec `display: none`.",
      "Écris une media query `@media (min-width: 768px)` : dedans, cache le bouton `.appeler`, et affiche `.decor` avec `display: block`.",
      "Vérifie les trois écrans : les horaires et les tarifs restent toujours visibles."
    ],
    starter: `/* Téléphone : le bouton « Appeler » est utile, l’illustration est de trop */\n\n\n/* Tablette et ordinateur : 768px et plus */\n`,
    goals: [
      { label: "Sur téléphone : le bouton « Appeler » est visible, l’illustration est cachée (`display: none`)", test: c => (visibleAt(c, "mobile", ".appeler") && csAt(c, "mobile", ".decor", "display") === "none") || (csAt(c, "mobile", ".decor", "visibility") === "hidden" ? "Avec visibility: hidden, l’illustration garde sa place : utilise display: none." : false) },
      { label: "Sur tablette et ordinateur : le bouton est caché, l’illustration est visible", test: c => { const ko = rFail(id => csAt(c, id, ".appeler", "display") === "none" && visibleAt(c, id, ".decor"), ["tablette", "ordi"]); return !ko.length || `Pas encore sur ${ko.join(" et ")} : dans la media query, .appeler en display: none et .decor en display: block.`; } },
      { label: "Les horaires et les tarifs restent visibles sur les trois écrans", test: c => { const ko = rFail(id => visibleAt(c, id, ".horaires") && visibleAt(c, id, ".tarifs")); return !ko.length || `Les informations essentielles sont cachées (${ko.join(", ")}) : ne cache jamais l’essentiel.`; } },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Téléphone : `.decor { display: none; }`",
      "Dans `@media (min-width: 768px) { … }`, écris deux règles : `.appeler { display: none; }` et `.decor { display: block; }`.",
      "Vérifie que les deux règles sont bien entre les accolades de la media query."
    ],
    solution: `/* Téléphone : le bouton « Appeler » est utile, l’illustration est de trop */\n.decor {\n  display: none;\n}\n\n/* Tablette et ordinateur : 768px et plus */\n@media (min-width: 768px) {\n  .appeler {\n    display: none;\n  }\n\n  .decor {\n    display: block;\n  }\n}\n`,
    debrief: "`display: none` dans une media query : chaque écran montre ce qui lui est utile. Mais l’élément reste dans la page (et souvent téléchargé) : on ne cache que le décoratif ou l’inutile, jamais l’essentiel. Les sites de restaurants font exactement ça avec leur bouton « Appeler » ou « Itinéraire »."
  },

  /* ------------------------------ ATELIER 3 : LES UNITÉS FLUIDES ------------------------------ */
  {
    id: "rem-em", ch: 3, title: "La recette de Kami", notion: "rem et em",
    say: "Ma grand-mère caméléon lit mes recettes avec un texte agrandi dans son navigateur. Mais mes tailles sont en pixels : elles ne bougent pas ! Passons-les en `rem`.",
    lesson: {
      what: [
        "Une **unité absolue** comme `px` ne bouge jamais. Une **unité relative** dépend d’autre chose. Pour le texte, on utilise surtout deux unités relatives :",
        "`rem` (*root em*) dépend de la taille du texte de la **racine**, la balise `<html>` : **16px par défaut**. Donc `1rem` = 16px, `2rem` = 32px, `0.875rem` = 14px. Si le visiteur règle son navigateur sur « texte plus grand » (20px), `2rem` devient 40px : tout suit.",
        "`em` dépend de la taille du texte de **l’élément lui-même** (et, dans `font-size`, de celle de son **parent**). Pour le `padding` d’un bouton, `0.75em` = les trois quarts de la taille de son texte : si le texte grandit, le bouton grandit avec."
      ],
      why: "Beaucoup de gens agrandissent le texte de leur navigateur ou de leur téléphone pour mieux lire. Avec des tailles en `rem`, ta page respecte ce choix : c’est une question d’**accessibilité**. Et changer la taille de `<html>` suffit à agrandir tout le site d’un coup.",
      code: `h1 {\n  font-size: 2rem;        /* 32px */\n}\n\n.bouton {\n  font-size: 1rem;        /* 16px */\n  padding: 0.75em 1.5em;  /* 12px 24px */\n}`,
      pieces: [
        ["2rem", "2 × la taille du texte de `<html>` : 2 × 16 = 32px par défaut"],
        ["1.125rem", "18px : pour passer de px à rem, on divise par 16"],
        ["0.75em", "dans le `padding`, 0,75 × la taille du texte du bouton : 0,75 × 16 = 12px"],
        ["1.5em", "1,5 × 16 = 24px sur les côtés"]
      ],
      trap: "Utiliser `em` pour les tailles de texte de blocs **imbriqués** : chaque niveau multiplie le précédent (`0.8em` dans `0.8em` = 0,64 du texte de départ). Pour `font-size`, préfère `rem`, qui part toujours de la racine.",
      good: "Tailles de texte en `rem`, espaces intérieurs d’un composant (bouton, étiquette) en `em`, bordures en `px`. Et ne fixe **jamais** la taille de `<html>` en pixels (`html { font-size: 16px; }`) : tu effacerais le réglage du visiteur."
    },
    showHTML: true,
    base: `.recette { max-width: 600px; }\n.note { color: #5A6478; }\n.bouton { display: inline-block; border-radius: 999px; background-color: #0B6E99; color: white; font-weight: 700; text-decoration: none; }`,
    html: `<article class="recette">
  <h1>La soupe aux grillons</h1>
  <p>Une recette de Kami, pour quatre caméléons affamés. Croquante dehors, fondante dedans.</p>
  <p class="note">Temps de préparation : 20 minutes.</p>
  <a class="bouton" href="#">Voir la recette</a>
</article>`,
    steps: [
      "Remplace chaque `font-size` en pixels par sa valeur en `rem` (divise par 16) : `2rem`, `1.125rem`, `0.875rem` et `1rem`.",
      "Remplace le `padding` du bouton par des `em` : `0.75em 1.5em`.",
      "L’aperçu ne doit pas changer : les tailles sont les mêmes… tant que le visiteur ne touche pas à ses réglages."
    ],
    starter: `h1 {\n  font-size: 32px;\n}\n\np {\n  font-size: 18px;\n}\n\n.note {\n  font-size: 14px;\n}\n\n.bouton {\n  font-size: 16px;\n  padding: 12px 24px;\n}\n`,
    goals: [
      { label: "Les quatre tailles de texte sont en `rem`", test: c => { const ko = ["h1", "p", ".note", ".bouton"].filter(s => !/^[\d.]+rem$/.test(norm(rDecl(c, [s], "font-size", false) || ""))); return !ko.length || `Encore en pixels (ou absente) : ${ko.join(", ")}.`; } },
      { label: "Les tailles sont les mêmes qu’avant : 32px, 18px, 14px et 16px", test: c => { const v = [rPx(c, "mobile", "h1", "font-size"), rPx(c, "mobile", "p", "font-size"), rPx(c, "mobile", ".note", "font-size"), rPx(c, "mobile", ".bouton", "font-size")]; return (v[0] === 32 && v[1] === 18 && v[2] === 14 && v[3] === 16) || `Tailles actuelles : ${v.join("px, ")}px. Pour passer de px à rem, divise par 16.`; } },
      { label: "Le `padding` du bouton est en `em` (12px en haut, 24px sur les côtés)", test: c => { const p = norm(rDecl(c, [".bouton"], "padding", false) || ""); const ok = /(^|\s)[\d.]+em\b/.test(p) && !/rem/.test(p) && rPx(c, "mobile", ".bouton", "padding-top") === 12 && rPx(c, "mobile", ".bouton", "padding-left") === 24; return ok || (/rem/.test(p) ? "Ici, on veut em (pas rem) : le padding suit alors la taille du texte du bouton." : false); } },
      { label: "Si le visiteur agrandit le texte de son navigateur, toute la page suit", test: c => { const d = docAt(c, "ordi"); if (!d) return false; d.documentElement.style.fontSize = "20px"; const ok = rPx(c, "ordi", "h1", "font-size") === 40 && rPx(c, "ordi", ".note", "font-size") === 17.5 && rPx(c, "ordi", ".bouton", "padding-top") === 15; d.documentElement.style.fontSize = ""; return ok || "Avec un texte réglé sur 20px, le titre devrait faire 40px et le bouton grandir : il reste des pixels."; } },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Pour passer de px à rem, divise par 16 : 32px = `2rem`, 18px = `1.125rem`.",
      "14px = `0.875rem` et 16px = `1rem`. Pour le padding du bouton : `padding: 0.75em 1.5em;`",
      "Le titre : `h1 { font-size: 2rem; }`. Le bouton : `.bouton { font-size: 1rem; padding: 0.75em 1.5em; }`"
    ],
    solution: `h1 {\n  font-size: 2rem;\n}\n\np {\n  font-size: 1.125rem;\n}\n\n.note {\n  font-size: 0.875rem;\n}\n\n.bouton {\n  font-size: 1rem;\n  padding: 0.75em 1.5em;\n}\n`,
    debrief: "En `rem`, ta page suit les réglages du visiteur ; en `em`, le bouton suit son propre texte. Le rendu est identique, mais la page est devenue **accessible**. Les grands sites (journaux, services publics) écrivent ainsi toutes leurs tailles de texte en `rem`."
  },
  {
    id: "vw-vh", ch: 3, title: "La bannière géante", notion: "vw et vh",
    say: "Je veux une bannière d’accueil impressionnante : un titre qui grandit avec l’écran, et une bannière qui prend au moins la moitié de la hauteur de l’écran !",
    lesson: {
      what: [
        "Deux unités relatives à la **taille du viewport** (la zone d’affichage de l’écran) : `vw` (*viewport width*) = **1 % de la largeur** de l’écran, et `vh` (*viewport height*) = **1 % de la hauteur**.",
        "Sur un téléphone de 375px de large, `8vw` = 30px ; sur un ordinateur de 1280px, `8vw` = 102px. Le titre grandit **automatiquement** avec l’écran, sans media query. Et `min-height: 50vh` donne à un bloc une hauteur d’au moins la moitié de l’écran."
      ],
      why: "Les unités du viewport servent à faire des éléments **proportionnels à l’écran** : un grand titre d’accueil, une bannière qui remplit le premier écran, un bloc qui occupe la moitié de la largeur.",
      code: `.titre {\n  font-size: 8vw;\n}\n\n.heros {\n  min-height: 50vh;\n}`,
      pieces: [
        ["8vw", "8 % de la largeur de l’écran : 30px sur téléphone, 61px sur tablette, 102px sur ordinateur"],
        ["50vh", "50 % de la hauteur de l’écran"],
        ["min-height", "une hauteur **minimale** : le bloc peut grandir si son contenu est plus haut, il ne déborde jamais"],
        ["100vw", "toute la largeur de l’écran… barre de défilement comprise : attention au débordement"]
      ],
      trap: [
        "Un texte en `vw` seul ne réagit plus au **zoom** ni au réglage de taille du visiteur : sur un grand écran, il devient énorme ; sur un petit, minuscule. La mission suivante corrige ça avec `clamp()`.",
        "Sur téléphone, `100vh` ne tient pas compte de la barre d’adresse qui apparaît et disparaît : le bas du bloc peut être caché. Les navigateurs récents proposent `svh` (la plus petite hauteur) et `dvh` (la hauteur du moment). Utilise `height: 100vh` avec prudence : préfère `min-height`."
      ],
      good: "Garde `vw` et `vh` pour les grandes pièces d’une page (bannière, titre d’accueil, espacements), jamais pour le texte courant. Et préfère toujours `min-height` à `height` : le contenu doit pouvoir faire grandir son bloc."
    },
    base: `.heros { background-color: #1E9E66; color: white; padding: 24px; border-radius: 16px; }\n.titre { margin: 0 0 8px; line-height: 1.1; }\n.heros p { margin: 0; }`,
    html: `<section class="heros">
  <h1 class="titre">Kami s’adapte</h1>
  <p>Le caméléon qui change de forme selon l’écran.</p>
</section>
<p>La suite de la page commence ici : les balades, les amis, les photos…</p>`,
    steps: [
      "Dans la règle `.titre`, remplace `32px` par `8vw`. Compare la taille du titre sur les trois écrans.",
      "Dans la règle `.heros`, ajoute `min-height: 50vh`. (Dans l’aperçu, la page est aussi haute que son contenu : cet effet se voit surtout dans un vrai navigateur.)",
      "Vérifie : regarde la taille du titre sur ordinateur… il est énorme. On règle ça dans la mission suivante !"
    ],
    starter: `.titre {\n  font-size: 32px;\n}\n\n.heros {\n  \n}\n`,
    goals: [
      { label: "La taille du titre est en `vw`", test: c => /^[\d.]+vw$/.test(norm(rDecl(c, [".titre", "h1", ".heros h1", ".heros .titre"], "font-size") || "")) },
      { label: "Le titre grandit avec l’écran : téléphone < tablette < ordinateur", test: c => { const a = rPx(c, "mobile", ".titre", "font-size"), b = rPx(c, "tablette", ".titre", "font-size"), d = rPx(c, "ordi", ".titre", "font-size"); return (a < b && b < d) || `Tailles du titre : ${Math.round(a)}px, ${Math.round(b)}px, ${Math.round(d)}px.`; } },
      { label: "Sur téléphone, le titre fait entre 24px et 40px", test: c => { const a = rPx(c, "mobile", ".titre", "font-size"); return (a >= 24 && a <= 40) || `Sur téléphone, le titre fait ${Math.round(a)}px : essaie 8vw.`; } },
      { label: "La bannière `.heros` a une hauteur minimale en `vh`", test: c => /^[\d.]+vh$/.test(norm(rDecl(c, [".heros"], "min-height") || "")) || (rDecl(c, [".heros"], "height") ? "Préfère min-height à height : le contenu doit pouvoir faire grandir la bannière." : false) },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "`vw` = 1 % de la largeur de l’écran. Le titre : `font-size: 8vw;`",
      "`vh` = 1 % de la hauteur de l’écran. La bannière : `min-height: 50vh;`",
      "Les deux règles : `.titre { font-size: 8vw; }` et `.heros { min-height: 50vh; }`"
    ],
    solution: `.titre {\n  font-size: 8vw;\n}\n\n.heros {\n  min-height: 50vh;\n}\n`,
    debrief: "`vw` et `vh` suivent la taille de l’écran : pratique pour une bannière d’accueil. Mais regarde le titre sur ordinateur : plus de 100px ! Un texte en `vw` seul n’a pas de limite, et il ignore le réglage de taille du visiteur. Dans la mission suivante, `clamp()` va lui donner un minimum et un maximum."
  },
  {
    id: "clamp-titre", ch: 3, title: "Le titre bien élevé", notion: "clamp()",
    say: "Mon titre en `vw` est trop petit sur certains téléphones et gigantesque sur ordinateur. Je voudrais qu’il grandisse avec l’écran, mais entre deux limites !",
    lesson: {
      what: [
        "La fonction `clamp()` donne une valeur **bornée** : `clamp(MINIMUM, IDÉAL, MAXIMUM)`. Le navigateur utilise la valeur **idéale**, sans jamais descendre sous le minimum ni monter au-dessus du maximum.",
        "Pour un titre fluide : un minimum en `rem` (lisible sur téléphone), un maximum en `rem` (raisonnable sur grand écran), et au milieu une valeur qui **mélange** `rem` et `vw` : `1rem + 5vw` grandit avec l’écran tout en suivant le réglage du visiteur. Le calcul se fait tout seul, sans `calc()` : on peut écrire des additions directement dans `clamp()`."
      ],
      why: "Avant `clamp()`, il fallait une media query par taille d’écran pour ajuster un titre. Maintenant, une seule ligne suffit : le texte grandit de façon **fluide** entre deux bornes. On parle de **typographie fluide**.",
      code: `.titre {\n  font-size: clamp(2rem, 1rem + 5vw, 4rem);\n}`,
      pieces: [
        ["clamp(", "« borné entre… » : trois valeurs séparées par des virgules"],
        ["2rem", "le **minimum** : jamais moins de 32px"],
        ["1rem + 5vw", "l’**idéal** : 16px + 5 % de la largeur de l’écran. 35px sur téléphone, 54px sur tablette"],
        ["4rem", "le **maximum** : jamais plus de 64px, même sur un très grand écran"]
      ],
      example: { code: `.titre {\n  font-size: clamp(1.25rem, 1rem + 3vw, 2.5rem);\n  margin: 0;\n}`, html: `<p class="titre">Un titre fluide</p>\n<p>Change la largeur de la fenêtre : il grandit, mais pas trop.</p>` },
      trap: "Mettre les valeurs dans le mauvais ordre : c’est toujours **minimum, idéal, maximum**. Et oublier les espaces autour du `+` : `1rem+5vw` n’est pas valide, il faut `1rem + 5vw`.",
      good: "Utilise `clamp()` pour les **grands titres** et les grands espacements : le texte courant reste en `rem` simple. Garde toujours une part de `rem` dans la valeur idéale (`1rem + 5vw`) : le titre suit ainsi le zoom et le réglage du visiteur."
    },
    base: `.heros { background-color: #0B6E99; color: white; padding: 24px; border-radius: 16px; }\n.titre { margin: 0 0 8px; line-height: 1.1; }\n.heros p { margin: 0; }`,
    html: `<section class="heros">
  <h1 class="titre">Les balades de Kami</h1>
  <p>Des promenades guidées dans la forêt, pour petits et grands caméléons.</p>
</section>`,
    steps: [
      "Regarde le titre sur les trois écrans : trop petit sur téléphone, énorme sur ordinateur.",
      "Remplace `8vw` par `clamp(2rem, 1rem + 5vw, 4rem)`.",
      "Vérifie : au moins 32px sur téléphone, au plus 64px sur ordinateur, et entre les deux sur tablette."
    ],
    starter: `.titre {\n  font-size: 8vw;\n}\n`,
    goals: [
      { label: "La taille du titre utilise `clamp()`", test: c => { const v = rDecl(c, [".titre", "h1", ".heros h1", ".heros .titre"], "font-size") || ""; return (/clamp\(/.test(v) && CSS.supports("font-size", v)) || (/clamp\(/.test(v) ? "Ta valeur clamp() n’est pas valide : trois valeurs séparées par des virgules, et des espaces autour du + (1rem + 5vw)." : false); } },
      { label: "Sur téléphone, le titre fait au moins 32px", test: c => { const a = rPx(c, "mobile", ".titre", "font-size"); return a >= 31.5 || `Sur téléphone, le titre fait ${Math.round(a)}px : le minimum de clamp() doit être 2rem.`; } },
      { label: "Sur ordinateur, le titre ne dépasse pas 64px", test: c => { const a = rPx(c, "ordi", ".titre", "font-size"); return a <= 64.5 || `Sur ordinateur, le titre fait ${Math.round(a)}px : le maximum de clamp() doit être 4rem.`; } },
      { label: "Entre les deux, il grandit : plus grand sur tablette que sur téléphone", test: c => rPx(c, "tablette", ".titre", "font-size") > rPx(c, "mobile", ".titre", "font-size") || "Le titre a la même taille partout : la valeur idéale (au milieu) doit contenir des vw." },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "`clamp()` prend trois valeurs, dans l’ordre : minimum, idéal, maximum.",
      "Minimum `2rem`, idéal `1rem + 5vw`, maximum `4rem`.",
      "La déclaration complète : `font-size: clamp(2rem, 1rem + 5vw, 4rem);`"
    ],
    solution: `.titre {\n  font-size: clamp(2rem, 1rem + 5vw, 4rem);\n}\n`,
    debrief: "Une seule ligne, et le titre est parfait sur tous les écrans : jamais trop petit, jamais énorme, et toujours sensible au réglage du visiteur. `clamp()` sert aussi pour les marges et les espacements. Les sites modernes l’utilisent pour presque tous leurs grands titres."
  },
  {
    id: "min-max", ch: 3, title: "La carte de membre", notion: "min() et max()",
    say: "Voici ma carte de membre du club des caméléons. Elle doit faire 500px sur ordinateur, tenir dans l’écran du téléphone, et avoir de l’air autour du texte sur les grands écrans.",
    lesson: {
      what: [
        "`min()` prend la **plus petite** des valeurs qu’on lui donne, `max()` la **plus grande**. On peut mélanger les unités : le navigateur calcule pour chaque écran.",
        "`width: min(100%, 500px)` : sur téléphone, 100% (343px) est plus petit que 500px, donc la carte fait 100% ; sur ordinateur, 500px est plus petit, donc elle fait 500px. C’est la même chose que `width: 100%` + `max-width: 500px`, **en une seule ligne**.",
        "`padding: max(16px, 3vw)` : jamais moins de 16px, mais plus large sur un grand écran (3vw = 38px sur 1280px)."
      ],
      why: "`min()` et `max()` évitent des media queries : une seule déclaration s’adapte à tous les écrans. `min()` pose un **plafond**, `max()` pose un **plancher**.",
      code: `.carte {\n  width: min(100%, 500px);\n  padding: max(16px, 3vw);\n}`,
      pieces: [
        ["min(100%, 500px)", "la plus petite des deux : la carte ne dépasse jamais 500px, ni la largeur de son parent"],
        ["max(16px, 3vw)", "la plus grande des deux : au moins 16px, et plus sur grand écran"],
        ["3vw", "11px sur téléphone (donc 16px gagne), 38px sur ordinateur"],
        ["box-sizing", "ici, le CSS de base met déjà tous les éléments en `border-box` : le padding ne fait pas déborder la carte"]
      ],
      trap: "Inverser `min()` et `max()` : on a envie d’écrire `max(…, 500px)` pour dire « 500px au maximum ». Mais `max()` choisit la **plus grande** valeur ! Pour un plafond, c’est `min()`. Retiens : `min()` = « au plus », `max()` = « au moins ».",
      good: "Utilise `min()` pour les largeurs (un plafond) et `max()` pour les espacements (un plancher). Comme toujours avec les valeurs fluides, vérifie le résultat au plus petit et au plus grand écran."
    },
    base: `*, *::before, *::after { box-sizing: border-box; }\n.carte { background-color: #E1F7EC; border: 3px solid #1E9E66; border-radius: 16px; }\n.carte h1 { margin-top: 0; color: #1E9E66; }\n.numero { font-weight: 700; margin-bottom: 0; }`,
    html: `<div class="carte">
  <h1>Carte de membre</h1>
  <p>Club des caméléons de la forêt, section camouflage.</p>
  <p class="numero">N° 0042 · Kami</p>
</div>`,
    steps: [
      "Regarde la carte sur **Téléphone** : elle déborde.",
      "Remplace `width: 500px` par `width: min(100%, 500px)`.",
      "Remplace `padding: 16px` par `padding: max(16px, 3vw)`, puis compare le téléphone et l’ordinateur."
    ],
    starter: `.carte {\n  width: 500px;\n  padding: 16px;\n}\n`,
    goals: [
      { label: "Sur téléphone, la carte tient dans l’écran", test: c => { const b = boxAt(c, "mobile", ".carte"); return (!overflowAt(c, "mobile") && !!b && b.right <= 375 - 15) || "Sur téléphone, la carte dépasse de l’écran."; } },
      { label: "Sur ordinateur, la carte fait `500px` de large", test: c => rW(c, "ordi", ".carte") === 500 || `Sur ordinateur, la carte fait ${rW(c, "ordi", ".carte")}px.` },
      { label: "La largeur utilise `min()`", test: c => /^min\(/.test(norm(rDecl(c, [".carte"], "width") || "")) || (rDecl(c, [".carte"], "max-width") ? "max-width marche aussi, mais ici, écris tout en une ligne : width: min(100%, 500px);" : false) },
      { label: "Le `padding` utilise `max()` : au moins 16px, plus large sur ordinateur", test: c => { const p = norm(rDecl(c, [".carte"], "padding") || ""); const m = rPx(c, "mobile", ".carte", "padding-left"), o = rPx(c, "ordi", ".carte", "padding-left"); return (/max\(/.test(p) && m >= 16 && o > m) || (/min\(/.test(p) ? "Pour un minimum de 16px, c’est max() : il prend la plus grande valeur." : false); } },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "`min()` choisit la plus petite valeur : parfait pour une largeur maximale.",
      "La largeur : `width: min(100%, 500px);`",
      "Le padding : `padding: max(16px, 3vw);` (`max()` choisit la plus grande valeur)."
    ],
    solution: `.carte {\n  width: min(100%, 500px);\n  padding: max(16px, 3vw);\n}\n`,
    debrief: "`min()` pose un plafond, `max()` un plancher, et `clamp()` fait les deux. Ces trois fonctions remplacent beaucoup de media queries. Tu retrouveras `min(100%, …)` dans les conteneurs des sites modernes, et `max()` dans leurs marges intérieures."
  },

  /* ------------------------------ ATELIER 4 : DES MISES EN PAGE QUI S’ADAPTENT ------------------------------ */
  {
    id: "cartes-wrap", ch: 4, title: "Les amis de Kami", notion: "des cartes avec flex-wrap",
    say: "J’ai fait une carte pour chacun de mes amis. Sur ordinateur, elles sont bien alignées. Sur téléphone, elles sont écrasées les unes contre les autres ! Il faut qu’elles passent à la ligne toutes seules.",
    lesson: {
      what: [
        "Rappel de Flexbox : par défaut, les **éléments flex** restent sur **une seule ligne**, quitte à **rétrécir** jusqu’à devenir illisibles. Avec `flex-wrap: wrap` sur le **conteneur flex**, ils passent à la ligne quand la place manque.",
        "Le raccourci `flex: 1 1 240px` sur chaque carte dit : **taille de base** 240px, le droit de **grandir** (le premier 1) et de **rétrécir** (le second 1). Résultat : autant de cartes par ligne qu’il en tient, et elles s’étirent pour remplir la ligne. Une ligne de CSS, et **aucune media query**."
      ],
      why: "Le nombre de cartes par ligne s’adapte tout seul à la largeur : 1 sur téléphone, 2 sur tablette, 4 sur ordinateur. C’est le contenu qui décide, pas un point de rupture fixé à l’avance.",
      code: `.cartes {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.carte {\n  flex: 1 1 240px;\n}`,
      pieces: [
        ["flex-wrap: wrap", "les cartes passent à la ligne au lieu de s’écraser"],
        ["flex: 1 1 240px", "grandir : oui ; rétrécir : oui ; taille de base : 240px"],
        ["240px", "la largeur « idéale » d’une carte : en dessous, il n’en tient plus autant sur la ligne"],
        ["gap: 16px", "la **gouttière** entre les cartes, dans les deux sens"]
      ],
      trap: "Garder `width: 240px` sans `flex-grow` : les cartes passent bien à la ligne, mais elles ne remplissent pas la largeur, et il reste un grand trou à droite. Autre piège : sur la dernière ligne, une carte seule s’étire sur toute la largeur. Si tu veux des colonnes bien égales, la mission suivante, avec Grid, est faite pour ça.",
      good: "Avant d’écrire une media query, demande-toi si Flexbox ou Grid ne peuvent pas s’adapter **tout seuls** : `flex-wrap` ou `auto-fit`. Moins de media queries, c’est un CSS plus court et plus facile à maintenir."
    },
    base: `.carte { background-color: #FFF8E7; border: 3px solid #1B2440; border-radius: 12px; padding: 12px 16px; box-sizing: border-box; }\n.carte h2 { margin: 0 0 4px; font-size: 1.25rem; color: #1E9E66; }\n.carte p { margin: 0; }`,
    html: `<h1>Les amis de Kami</h1>
<div class="cartes">
  <article class="carte"><h2>Bip</h2><p>Le robot bricoleur, toujours un tournevis à la main.</p></article>
  <article class="carte"><h2>Les lucioles</h2><p>Elles éclairent l’étang tous les soirs.</p></article>
  <article class="carte"><h2>Tortue</h2><p>Lente, sage, et imbattable aux devinettes.</p></article>
  <article class="carte"><h2>Le hibou</h2><p>Il veille sur la forêt pendant la nuit.</p></article>
</div>`,
    steps: [
      "Regarde les cartes en **Téléphone** : elles s’écrasent sur une seule ligne.",
      "Ajoute `flex-wrap: wrap` au conteneur `.cartes`.",
      "Dans `.carte`, remplace `width: 240px` par `flex: 1 1 240px`, puis compare les trois écrans."
    ],
    starter: `.cartes {\n  display: flex;\n  gap: 16px;\n}\n\n.carte {\n  width: 240px;\n}\n`,
    goals: [
      { label: "Le conteneur `.cartes` a `flex-wrap: wrap`", test: c => csAt(c, "mobile", ".cartes", "flex-wrap") === "wrap" },
      { label: "Sur téléphone, une carte par ligne", test: c => rCols(c, "mobile", ".carte") === 1 || `Sur téléphone, il y a ${rCols(c, "mobile", ".carte")} cartes par ligne.` },
      { label: "Sur tablette, deux cartes par ligne ; sur ordinateur, les quatre", test: c => (rCols(c, "tablette", ".carte") === 2 && rCols(c, "ordi", ".carte") === 4) || `Cartes par ligne : ${rCols(c, "tablette", ".carte")} sur tablette, ${rCols(c, "ordi", ".carte")} sur ordinateur. Garde une taille de base de 240px.` },
      { label: "Les cartes s’étirent pour remplir la ligne", test: c => { const ko = rFail(id => { const cs2 = qaAt(c, id, ".carte"), box = boxAt(c, id, ".cartes"); if (!cs2.length || !box) return false; const n = rCols(c, id, ".carte"); return Math.abs(cs2[n - 1].getBoundingClientRect().right - box.right) < 2; }, ["tablette", "ordi"]); return !ko.length || "Il reste un trou à droite : les cartes doivent pouvoir grandir, avec flex: 1 1 240px."; } },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Pour passer à la ligne, une seule déclaration sur le conteneur : `flex-wrap: wrap;`",
      "Sur la carte, le raccourci `flex` : grandir, rétrécir, taille de base.",
      "`.cartes { display: flex; flex-wrap: wrap; gap: 16px; }` et `.carte { flex: 1 1 240px; }`"
    ],
    solution: `.cartes {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.carte {\n  flex: 1 1 240px;\n}\n`,
    debrief: "Avec `flex-wrap: wrap` et `flex: 1 1 240px`, les cartes trouvent toutes seules leur place : 1, 2 ou 4 par ligne, sans une seule media query. C’est le motif des étiquettes, des boutons de filtres et des cartes de profils sur beaucoup de sites."
  },
  {
    id: "grille-auto", ch: 4, title: "La boutique de Kami", notion: "repeat(auto-fit, minmax())",
    say: "Ma boutique a six produits. Sur ordinateur, quatre colonnes, c’est parfait. Sur téléphone, quatre colonnes de 70 pixels… on ne lit plus rien ! Et je ne veux pas écrire de media query.",
    lesson: {
      what: [
        "Rappel du jeu Grid : `repeat(3, 1fr)` crée 3 colonnes égales. Mais on peut laisser Grid **choisir le nombre** de colonnes : `repeat(auto-fit, minmax(180px, 1fr))`.",
        "`minmax(180px, 1fr)` : chaque colonne fait **au moins 180px**, et au plus une part de la place restante. `auto-fit` : « crée **autant de colonnes qu’il en tient** ». Sur 343px, une seule colonne de 180px tient ; sur 736px, trois ; sur 1248px, six. Les colonnes s’étirent ensuite pour remplir la ligne."
      ],
      why: "C’est la grille responsive la plus utilisée : une seule ligne de CSS, pas de media query, et des colonnes **toujours égales** (contrairement à `flex-wrap`, où la dernière carte s’étire seule).",
      code: `.produits {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n  gap: 16px;\n}`,
      pieces: [
        ["repeat(", "répète une **piste** (une colonne) plusieurs fois"],
        ["auto-fit", "autant de colonnes qu’il en tient dans le **conteneur de grille**"],
        ["minmax(180px, 1fr)", "chaque colonne : au moins 180px, au plus une **fraction** égale de la place"],
        ["gap: 16px", "la gouttière : elle compte aussi dans le calcul de la place"]
      ],
      trap: "Écrire `minmax(180px, 1fr)` sans `auto-fit` (ou `auto-fill`) : `repeat()` ne sait pas combien de colonnes créer. Et un minimum trop grand (`minmax(400px, 1fr)`) déborde sur un téléphone de 375px : garde un minimum plus petit que le plus petit écran.",
      good: "Retiens ce motif par cœur, c’est un des plus utiles du CSS : `repeat(auto-fit, minmax(MIN, 1fr))`. Choisis le minimum d’après ton **contenu** (la largeur sous laquelle une carte devient illisible), et non d’après un appareil."
    },
    base: `.produits { list-style: none; margin: 0; padding: 0; }\n.produit { background-color: #E1F0F7; border: 3px solid #0B6E99; border-radius: 12px; padding: 16px; font-weight: 700; }\n.produit span { display: block; font-weight: 400; color: #0B6E99; }`,
    html: `<h1>La boutique de Kami</h1>
<ul class="produits">
  <li class="produit">Miel de fleurs <span>4 €</span></li>
  <li class="produit">Grillons séchés <span>3 €</span></li>
  <li class="produit">Nectar de l’étang <span>5 €</span></li>
  <li class="produit">Feuilles croquantes <span>2 €</span></li>
  <li class="produit">Thé des lucioles <span>6 €</span></li>
  <li class="produit">Bonbons à la mouche <span>1 €</span></li>
</ul>`,
    steps: [
      "Regarde la grille en **Téléphone**, puis en **Ordinateur**.",
      "Remplace `repeat(4, 1fr)` par `repeat(auto-fit, minmax(180px, 1fr))`.",
      "Compare les trois écrans, sans écrire de media query : 1 colonne, 3 colonnes, 6 colonnes."
    ],
    starter: `.produits {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 16px;\n}\n`,
    goals: [
      { label: "Tu utilises `auto-fit` (ou `auto-fill`) et `minmax()`", test: c => { const v = norm(rDecl(c, [".produits"], "grid-template-columns") || ""); return (/auto-(fit|fill)/.test(v) && /minmax\(/.test(v)) || (/minmax/.test(v) ? "Il manque auto-fit dans repeat() : repeat(auto-fit, minmax(180px, 1fr))." : false); } },
      { label: "Sur téléphone, une seule colonne", test: c => rCols(c, "mobile", ".produit") === 1 || `Sur téléphone, il y a ${rCols(c, "mobile", ".produit")} colonnes : le minimum de minmax() est-il de 180px ?` },
      { label: "Sur tablette, de 2 à 4 colonnes ; sur ordinateur, au moins 5", test: c => { const t = rCols(c, "tablette", ".produit"), o = rCols(c, "ordi", ".produit"); return (t >= 2 && t <= 4 && o >= 5) || `Colonnes : ${t} sur tablette, ${o} sur ordinateur.`; } },
      { label: "Aucune media query : la grille s’adapte toute seule", test: c => !(c.rules || []).some(r => r.media) || "Pas besoin de media query ici : auto-fit fait le travail." },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Il suffit de changer la valeur de `grid-template-columns`.",
      "`repeat()` peut recevoir `auto-fit` à la place d’un nombre, et `minmax(180px, 1fr)` à la place de `1fr`.",
      "`grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));`"
    ],
    solution: `.produits {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n  gap: 16px;\n}\n`,
    debrief: "Une ligne, zéro media query, et la grille passe de 1 à 6 colonnes selon l’écran. `repeat(auto-fit, minmax(…, 1fr))` est la grille de produits, de photos ou d’articles de presque tous les sites modernes."
  },
  {
    id: "zones-rupture", ch: 4, title: "Le journal de Kami", notion: "grid-template-areas dans une media query",
    say: "Mon journal a un en-tête, un menu de rubriques, l’article et un pied de page. Sur téléphone, tout s’empile, c’est très bien. Sur grand écran, je voudrais le menu à gauche de l’article.",
    lesson: {
      what: [
        "Rappel du jeu Grid : `grid-template-areas` **dessine** la grille avec des **zones** nommées, et `grid-area` place chaque élément dans sa zone.",
        "Le grand avantage pour le responsive : on peut **redessiner** les zones dans une media query. Le HTML ne bouge pas, les `grid-area` non plus : seul le dessin change. Une colonne sur téléphone, deux colonnes sur tablette et ordinateur."
      ],
      why: "C’est la façon la plus lisible de changer la structure d’une page entière selon l’écran : le dessin entre guillemets **ressemble** à la page. On voit d’un coup d’œil la version téléphone et la version ordinateur.",
      code: `/* Téléphone */\n.page {\n  display: grid;\n  grid-template-areas:\n    "entete"\n    "menu"\n    "contenu"\n    "pied";\n}\n\n/* 768px et plus */\n@media (min-width: 768px) {\n  .page {\n    grid-template-columns: 200px 1fr;\n    grid-template-areas:\n      "entete entete"\n      "menu   contenu"\n      "pied   pied";\n  }\n}`,
      pieces: [
        ["\"entete\"", "sur téléphone : une seule colonne, une zone par rangée"],
        ["200px 1fr", "sur grand écran : une colonne de 200px pour le menu, le reste pour l’article"],
        ["\"entete entete\"", "l’en-tête s’étend sur les deux colonnes"],
        ["\"menu   contenu\"", "le menu à gauche, l’article à droite : les espaces en plus servent juste à aligner le dessin"],
        ["grid-area", "écrit une seule fois, hors media query : chaque élément garde le nom de sa zone"]
      ],
      trap: "Oublier de changer `grid-template-columns` dans la media query : le dessin a deux colonnes, mais la grille n’en a qu’une définie… Grid crée alors une colonne de plus, de la largeur de son contenu, et la page ressemble rarement à ce qu’on voulait. Et chaque rangée du dessin doit avoir le **même nombre** de noms.",
      good: "Garde l’**ordre du HTML** logique (l’en-tête, l’article, puis les menus secondaires) : c’est l’ordre lu par les lecteurs d’écran et par la touche Tab. Grid change seulement l’ordre **visuel**, et les zones nommées le rendent facile à lire."
    },
    base: `.page > * { border: 3px solid #1B2440; border-radius: 12px; padding: 12px; }\n.entete { background-color: #FFE066; font-weight: 800; font-size: 1.25rem; }\n.menu { background-color: #D8F5A2; }\n.contenu { background-color: #D0EBFF; }\n.contenu h2 { margin-top: 0; }\n.pied { background-color: #E9ECEF; }`,
    showHTML: true,
    html: `<div class="page">
  <header class="entete">Le journal de Kami</header>
  <main class="contenu">
    <h2>Les lucioles sont de retour</h2>
    <p>Hier soir, l’étang brillait comme un ciel d’été. Les lucioles sont revenues plus nombreuses que jamais, et Kami a passé la nuit à les compter.</p>
  </main>
  <nav class="menu">Rubriques : la forêt, l’étang, les amis</nav>
  <footer class="pied">© Le journal de Kami</footer>
</div>`,
    steps: [
      "Le téléphone est prêt : une colonne, avec le menu au-dessus de l’article.",
      "Sous le dernier commentaire, écris `@media (min-width: 768px)` avec une règle `.page`.",
      "Dedans : `grid-template-columns: 200px 1fr;` et le nouveau dessin sur trois rangées : `\"entete entete\"`, `\"menu contenu\"`, `\"pied pied\"`."
    ],
    starter: `/* Téléphone : tout en une colonne */\n.page {\n  display: grid;\n  gap: 12px;\n  grid-template-areas:\n    "entete"\n    "menu"\n    "contenu"\n    "pied";\n}\n\n.entete { grid-area: entete; }\n.menu { grid-area: menu; }\n.contenu { grid-area: contenu; }\n.pied { grid-area: pied; }\n\n/* Tablette et ordinateur : 768px et plus */\n`,
    goals: [
      { label: "Sur téléphone, tout s’empile : en-tête, menu, article, pied de page", test: c => (rBelow(c, "mobile", ".entete", ".menu") && rBelow(c, "mobile", ".menu", ".contenu") && rBelow(c, "mobile", ".contenu", ".pied")) || "Sur téléphone, garde une seule colonne : le nouveau dessin doit être DANS la media query." },
      { label: "Sur tablette et ordinateur, le menu est à gauche de l’article", test: c => { const ko = rFail(id => rSide(c, id, ".menu", ".contenu"), ["tablette", "ordi"]); return !ko.length || `Pas encore côte à côte sur ${ko.join(" et ")}.`; } },
      { label: "Sur grand écran, l’en-tête et le pied de page prennent toute la largeur", test: c => { const ko = rFail(id => { const p = boxAt(c, id, ".page"); return !!p && Math.abs(rW(c, id, ".entete") - p.width) < 2 && Math.abs(rW(c, id, ".pied") - p.width) < 2; }, ["tablette", "ordi"]); return !ko.length || "L’en-tête et le pied doivent s’étendre sur les deux colonnes : \"entete entete\" et \"pied pied\"."; } },
      { label: "Les zones sont redessinées dans `@media (min-width: …)`", test: c => rMedia(c, /min-width/i).some(r => r.decls.some(d => d.prop === "grid-template-areas")) },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Dans la media query, une règle `.page` avec deux déclarations : `grid-template-columns` et `grid-template-areas`.",
      "Les colonnes : `grid-template-columns: 200px 1fr;`",
      "Le dessin : `grid-template-areas: \"entete entete\" \"menu contenu\" \"pied pied\";` (une rangée par ligne, c’est plus lisible)."
    ],
    solution: `/* Téléphone : tout en une colonne */\n.page {\n  display: grid;\n  gap: 12px;\n  grid-template-areas:\n    "entete"\n    "menu"\n    "contenu"\n    "pied";\n}\n\n.entete { grid-area: entete; }\n.menu { grid-area: menu; }\n.contenu { grid-area: contenu; }\n.pied { grid-area: pied; }\n\n/* Tablette et ordinateur : 768px et plus */\n@media (min-width: 768px) {\n  .page {\n    grid-template-columns: 200px 1fr;\n    grid-template-areas:\n      "entete entete"\n      "menu   contenu"\n      "pied   pied";\n  }\n}\n`,
    debrief: "Le même HTML, deux plans de page : il suffit de redessiner `grid-template-areas` dans la media query. C’est ainsi que les journaux en ligne et les tableaux de bord passent d’une colonne sur téléphone à une page avec barre latérale sur ordinateur."
  },
  {
    id: "quiz2", ch: 4, quiz: true, title: "Contrôle du grand écran", notion: "quiz",
    say: "Les media queries et les mises en page fluides n’ont plus de secret pour toi ? Prouve-le, et le grand écran s’allume !",
    questions: [
      { q: "Sur quels écrans s’appliquent les règles de `@media (min-width: 768px) { … }` ?", opts: ["Seulement sur le téléphone (375px)", "Sur la tablette (768px) et l’ordinateur (1280px)", "Sur aucun écran, il manque `screen`"], a: 1, why: "`min-width: 768px` veut dire « au moins 768px » : la tablette (768px pile) et l’ordinateur sont concernés. Le mot `screen` est facultatif." },
      { q: "En mobile d’abord, dans quel ordre écris-tu ces deux media queries ?", opts: ["L’ordre ne compte pas", "`min-width: 1024px` puis `min-width: 768px`", "`min-width: 768px` puis `min-width: 1024px`"], a: 2, why: "Sur un écran de 1280px, les deux conditions sont vraies. À spécificité égale, la dernière règle écrite gagne : il faut donc écrire la plus grande largeur en dernier." },
      { q: "Combien de colonnes crée `repeat(auto-fit, minmax(200px, 1fr))` dans un conteneur de 650px (sans `gap`) ?", opts: ["3", "2", "4"], a: 0, why: "Trois colonnes de 200px tiennent (600px), quatre non (800px). Les trois colonnes s’étirent ensuite pour remplir les 650px." },
      { q: "Des cartes en Flexbox s’écrasent sur une seule ligne au lieu de passer à la ligne. Que manque-t-il ?", opts: ["`flex-wrap: wrap` sur le conteneur", "`display: block` sur les cartes", "`flex-direction: row` sur le conteneur"], a: 0, why: "Par défaut, un conteneur flex garde tous ses éléments sur une ligne (`nowrap`). `flex-wrap: wrap` leur permet de passer à la ligne." },
      { q: "Pourquoi ne pas cacher le formulaire de contact sur téléphone avec `display: none` ?", opts: ["Parce que `display: none` ne marche pas dans une media query", "Parce que le visiteur mobile a besoin du même contenu : il faut le ranger autrement, pas le cacher", "Parce que ça rend la page plus lourde à télécharger"], a: 1, why: "`display: none` marche partout, mais il ne faut jamais cacher l’essentiel : on peut changer la mise en page, pas priver le visiteur mobile d’une fonction importante." }
    ],
    debrief: "`min-width` et `max-width`, l’ordre des points de rupture, `flex-wrap`, `auto-fit` et `minmax()`, et les limites de `display: none` : tu sais faire s’adapter une mise en page entière. Le grand écran s’allume près de Kami !"
  },

  /* ------------------------------ ATELIER 5 : DES COMPOSANTS ADAPTABLES ------------------------------ */
  {
    id: "menu-responsive", ch: 5, title: "Le menu au bout des doigts", notion: "un menu responsive et des zones tactiles",
    say: "Mon menu est minuscule sur téléphone : Bip a voulu toucher « Mes amis » et il est tombé sur « Contact » ! Il faut des liens bien grands pour les doigts. Et sur ordinateur, je veux mon logo à gauche et les liens en ligne à droite.",
    lesson: {
      what: [
        "Sur un écran tactile, on vise avec le doigt, pas avec une souris : il faut des **zones tactiles** (la surface qu’on peut toucher) assez grandes. La règle d’or : **au moins 44px sur 44px** par lien ou bouton, et de l’**espace** entre eux (au moins 8px).",
        "Pour agrandir la zone tactile d’un lien, on lui donne `display: block` et du `padding` : le lien entier devient cliquable, pas seulement son texte.",
        "Sur grand écran, le motif classique d’un **en-tête** : le **logo à gauche**, les **liens en ligne à droite**. Avec Flexbox : `display: flex` et `justify-content: space-between` sur l’en-tête, et les liens repassent en `flex-direction: row`."
      ],
      why: "Un doigt touche une surface d’environ 1 cm sur 1 cm. Des liens trop petits ou trop serrés provoquent des erreurs et de l’agacement : c’est une question d’**accessibilité**, pour tout le monde (pouce, tremblements, écran dans le bus…).",
      code: `/* Téléphone */\n.liens a {\n  display: block;\n  padding: 12px 16px;  /* 47px de haut */\n}\n\n/* 768px et plus */\n@media (min-width: 768px) {\n  .entete {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  }\n\n  .liens {\n    flex-direction: row;\n  }\n}`,
      pieces: [
        ["display: block", "le lien devient une boîte : son `padding` agrandit vraiment la zone cliquable"],
        ["padding: 12px 16px", "12px + 23px de texte + 12px = 47px de haut : plus que 44px"],
        ["gap: 8px", "de l’espace entre deux liens, pour ne pas toucher le voisin"],
        ["justify-content: space-between", "rappel de Flexbox : le logo au début de l’axe, les liens à la fin"],
        ["align-items: center", "le logo et les liens alignés au milieu, en hauteur"]
      ],
      trap: "Compter sur le survol : `:hover` n’existe pas sur un écran tactile. Une information visible **seulement** au survol (un sous-menu, une explication) est inaccessible au doigt. Autre piège : agrandir le texte au lieu du `padding` ; ce n’est pas le texte qui doit être gros, c’est la zone à toucher.",
      good: "Teste tes menus avec ton pouce, sur un vrai téléphone. Et pour un menu plus long, les sites cachent souvent les liens derrière un bouton « Menu » (le fameux *burger* ☰) : il s’ouvre et se ferme avec un peu de **JavaScript**, que tu apprendras dans le jeu suivant."
    },
    showHTML: true,
    base: `.entete { background-color: #1B2440; padding: 12px 16px; border-radius: 12px; }\n.logo { display: flex; align-items: center; gap: 8px; color: white; font-weight: 800; font-size: 1.25rem; text-decoration: none; }\n.liens { list-style: none; margin: 0; padding: 0; }\n.liens a { color: white; text-decoration: none; border-radius: 8px; background-color: rgba(255, 255, 255, 0.12); }`,
    html: `<header class="entete">
  <a class="logo" href="#"><img src="img/logo.svg" alt="" width="48" height="48"> Kami</a>
  <nav>
    <ul class="liens">
      <li><a href="#">Accueil</a></li>
      <li><a href="#">Mes aventures</a></li>
      <li><a href="#">Mes amis</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
</header>`,
    steps: [
      "Téléphone : dans `.liens a`, ajoute `padding: 12px 16px`. Dans `.liens`, ajoute `gap: 8px` et `margin-top: 12px`.",
      "Écris une media query `@media (min-width: 768px)` : l’`.entete` devient un conteneur flex avec `align-items: center` et `justify-content: space-between`.",
      "Dans la même media query, les `.liens` passent en `flex-direction: row`, avec `margin-top: 0`."
    ],
    starter: `/* Téléphone : le logo, puis les liens empilés */\n.liens {\n  display: flex;\n  flex-direction: column;\n}\n\n.liens a {\n  display: block;\n}\n\n/* Tablette et ordinateur : 768px et plus */\n`,
    goals: [
      { label: "Sur téléphone, chaque lien fait au moins 44px de haut", test: c => { const h = qaAt(c, "mobile", ".liens a").map(a => a.getBoundingClientRect().height); return (h.length > 0 && h.every(x => x >= 44)) || `Sur téléphone, les liens font ${Math.round(Math.min(...h))}px de haut : ajoute du padding.`; } },
      { label: "Sur téléphone, les liens sont empilés, avec au moins 8px entre eux", test: c => { const b = qaAt(c, "mobile", ".liens a").map(a => a.getBoundingClientRect()); return (b.length > 1 && b.every((r, i) => i === 0 || r.top - b[i - 1].bottom >= 7.5)) || "Les liens doivent être les uns sous les autres, espacés d’au moins 8px (gap: 8px)."; } },
      { label: "Sur tablette et ordinateur : le logo à gauche, les liens en ligne à droite", test: c => { const ko = rFail(id => { const l = boxAt(c, id, ".logo"), e = boxAt(c, id, ".entete"), a = qaAt(c, id, ".liens a").map(x => x.getBoundingClientRect()); if (!l || !e || !a.length) return false; const row = a.every(r => Math.abs(r.top - a[0].top) < 3); return row && a[0].left >= l.right && a[0].top < l.bottom && a[a.length - 1].right >= e.right - 16 - 2; }, ["tablette", "ordi"]); return !ko.length || `Pas encore sur ${ko.join(" et ")} : l’en-tête en display: flex avec justify-content: space-between, et les liens en flex-direction: row.`; } },
      { label: "Sur téléphone, rien ne déborde", test: c => rNoOverflow(c, ["mobile"]) },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Téléphone : `.liens a { display: block; padding: 12px 16px; }` et `.liens { gap: 8px; margin-top: 12px; }`.",
      "Grand écran : `@media (min-width: 768px) { .entete { display: flex; align-items: center; justify-content: space-between; } }`",
      "Toujours dans la media query : `.liens { flex-direction: row; margin-top: 0; }`"
    ],
    solution: `/* Téléphone : le logo, puis les liens empilés */\n.liens {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  margin-top: 12px;\n}\n\n.liens a {\n  display: block;\n  padding: 12px 16px;\n}\n\n/* Tablette et ordinateur : 768px et plus */\n@media (min-width: 768px) {\n  .entete {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  }\n\n  .liens {\n    flex-direction: row;\n    margin-top: 0;\n  }\n}\n`,
    debrief: "Des zones tactiles de 44px au moins, bien espacées, et un en-tête qui passe de la colonne à la ligne : c’est le menu de presque tous les sites. Sur téléphone, beaucoup le cachent ensuite derrière un bouton « Menu » qui s’ouvre avec du JavaScript : tu sauras bientôt le faire avec Bip."
  },
  {
    id: "tableau-defilant", ch: 5, title: "Les horaires du bus", notion: "un tableau qui défile : overflow-x: auto",
    say: "Les horaires du bus de la forêt tiennent dans un grand tableau de huit colonnes. Sur téléphone, toute la page déborde ! Je ne veux pas écraser le tableau : je veux le faire glisser du doigt.",
    lesson: {
      what: [
        "Certains contenus sont **plus larges** qu’un téléphone et ne peuvent pas rétrécir : un tableau de données, un bloc de code, une frise. Sans précaution, ils font **déborder** toute la page.",
        "La solution : les placer dans un **conteneur** (une `div`) qui a `overflow-x: auto`. Le débordement reste **à l’intérieur** de ce conteneur : une barre de défilement horizontale apparaît seulement pour lui, et le reste de la page ne bouge pas."
      ],
      why: "Un tableau écrasé dans 343px devient illisible (une lettre par ligne), et une page qui déborde est pénible à lire. Avec un conteneur qui défile, chaque chose reste lisible : le texte de la page, et le tableau qu’on fait glisser du doigt.",
      code: `.defilement {\n  overflow-x: auto;\n}`,
      pieces: [
        [".defilement", "la `div` qui entoure le tableau dans le HTML"],
        ["overflow-x", "ce qui se passe quand le contenu déborde en **largeur** (l’axe x, horizontal)"],
        ["auto", "une barre de défilement apparaît **seulement si besoin** : sur ordinateur, le tableau tient et il n’y a pas de barre"],
        ["scroll", "la barre est **toujours** là, même quand tout tient : à éviter"]
      ],
      trap: "Mettre `overflow-x: hidden` sur le `body` pour « cacher » le débordement : la page ne défile plus sur le côté, mais la fin du tableau est **coupée** et devient impossible à lire. On ne cache pas un débordement : on le **range** dans un conteneur qui défile.",
      good: "Ajoute un petit texte ou une ombre qui indique qu’on peut faire glisser le tableau, et garde la première colonne courte et claire. Si une page déborde et que tu ne sais pas pourquoi, ouvre **Inspecter** et cherche l’élément plus large que l’écran."
    },
    showHTML: true,
    base: `table { border-collapse: collapse; min-width: 640px; }\ncaption { text-align: left; font-weight: 700; margin-bottom: 8px; }\nth, td { border: 2px solid #1B2440; padding: 8px 12px; white-space: nowrap; text-align: center; }\nthead th { background-color: #E1F7EC; }\ntbody th { text-align: left; background-color: #FFF8E7; }`,
    html: `<h1>Le bus de la forêt</h1>
<div class="defilement">
  <table>
    <caption>Premier passage de la journée</caption>
    <thead>
      <tr><th>Arrêt</th><th>Lun</th><th>Mar</th><th>Mer</th><th>Jeu</th><th>Ven</th><th>Sam</th><th>Dim</th></tr>
    </thead>
    <tbody>
      <tr><th>Grand chêne</th><td>8 h 00</td><td>8 h 00</td><td>8 h 00</td><td>8 h 00</td><td>8 h 00</td><td>9 h 30</td><td>10 h 00</td></tr>
      <tr><th>Étang</th><td>8 h 15</td><td>8 h 15</td><td>8 h 15</td><td>8 h 15</td><td>8 h 15</td><td>9 h 45</td><td>10 h 15</td></tr>
      <tr><th>Atelier de Bip</th><td>8 h 30</td><td>8 h 30</td><td>8 h 30</td><td>8 h 30</td><td>8 h 30</td><td>10 h 00</td><td>10 h 30</td></tr>
    </tbody>
  </table>
</div>
<p>Fais glisser le tableau pour voir toute la semaine.</p>`,
    steps: [
      "Regarde la page en **Téléphone** : toute la page déborde à cause du tableau.",
      "Écris une règle pour le conteneur `.defilement` avec `overflow-x: auto`.",
      "Vérifie : la page ne déborde plus, et le tableau défile tout seul dans son conteneur."
    ],
    starter: `/* Fais défiler le tableau, pas la page */\n`,
    goals: [
      { label: "Sur téléphone, la page ne déborde plus", test: c => !overflowAt(c, "mobile") || "La page entière déborde encore à cause du tableau." },
      { label: "Le conteneur `.defilement` a `overflow-x: auto`", test: c => { const v = csAt(c, "mobile", ".defilement", "overflow-x"); return v === "auto" || (v === "scroll" ? "Avec scroll, la barre s’affiche même quand tout tient : préfère auto." : false); } },
      { label: "Le tableau n’est pas écrasé : il garde sa largeur et défile", test: c => { const t = boxAt(c, "mobile", "table"), d = qAt(c, "mobile", ".defilement"); return (!!t && t.width >= 640 && !!d && d.scrollWidth > d.clientWidth) || "Le tableau doit garder sa largeur (au moins 640px) et défiler dans son conteneur."; } },
      { label: "Le débordement n’est pas caché sur toute la page", test: c => ["html", "body"].every(s => csAt(c, "mobile", s, "overflow-x") === "visible") || "Ne cache pas le débordement de la page (overflow-x: hidden) : la fin du tableau serait coupée." },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "La règle vise le conteneur, pas le tableau : `.defilement { }`.",
      "La propriété du débordement horizontal : `overflow-x`.",
      "`.defilement { overflow-x: auto; }`"
    ],
    solution: `/* Fais défiler le tableau, pas la page */\n.defilement {\n  overflow-x: auto;\n}\n`,
    debrief: "Le débordement est rangé dans son conteneur : la page reste stable, et le tableau garde toutes ses colonnes. Les sites de trains, de résultats sportifs ou de documentation utilisent ce motif pour leurs tableaux et leurs blocs de code sur téléphone."
  },
  {
    id: "texte-lisible", ch: 5, title: "Un article qui se lit bien", notion: "la longueur de ligne : max-width en ch",
    say: "J’ai écrit un long article sur les caméléons. Sur ordinateur, les lignes font toute la largeur de l’écran : arrivé au bout, on ne sait plus où reprendre ! Il faut des lignes plus courtes.",
    lesson: {
      what: [
        "La **longueur de ligne**, c’est le nombre de caractères par ligne de texte. Les spécialistes de la lecture conseillent entre **45 et 75 caractères** : au-delà, l’œil se perd en revenant au début de la ligne suivante.",
        "L’unité `ch` vaut la largeur du caractère « 0 » de la police. `max-width: 65ch` limite donc un bloc de texte à environ 65 caractères par ligne, **quelle que soit** la taille du texte : si le texte grandit, la largeur grandit avec.",
        "Pour un texte long, on soigne aussi l’**interligne** (`line-height`) : environ `1.6`, sans unité."
      ],
      why: "Sur un grand écran, un texte qui prend toute la largeur fait des lignes de 150 caractères : c’est fatigant à lire, et beaucoup de visiteurs abandonnent. Les journaux et les livres utilisent des colonnes étroites pour cette raison.",
      code: `.article {\n  max-width: 65ch;\n  line-height: 1.6;\n}`,
      pieces: [
        ["max-width", "une largeur **maximale** : sur téléphone, le texte prend toute la largeur ; sur ordinateur, il s’arrête"],
        ["65ch", "environ 65 caractères par ligne"],
        ["ch", "une unité relative : la largeur du caractère « 0 » de la police utilisée"],
        ["line-height: 1.6", "un interligne de 1,6 fois la taille du texte : sans unité, il suit la taille du texte"]
      ],
      trap: "Limiter le texte avec une largeur en pixels (`max-width: 600px`) : si le visiteur agrandit le texte, il y a moins de caractères par ligne ; si tu changes de police, tout change. `ch` suit la taille du texte. Et n’utilise pas `width` : sur téléphone, le texte déborderait.",
      good: "Limite toujours la largeur des **blocs de texte** (articles, descriptions), pas forcément celle de toute la page : une image ou une grille peuvent rester larges. Et pour un texte long : `line-height` autour de `1.6`, et des paragraphes courts."
    },
    base: `.article h1 { color: #1E9E66; line-height: 1.15; }`,
    html: `<article class="article">
  <h1>Pourquoi les caméléons changent de couleur</h1>
  <p>On croit souvent que les caméléons changent de couleur pour se cacher. C’est en partie vrai, mais ce n’est pas la raison principale. Leur peau contient de minuscules cristaux qui renvoient la lumière différemment selon qu’ils sont serrés ou écartés.</p>
  <p>Quand un caméléon est calme, les cristaux sont serrés et sa peau paraît verte. Quand il est excité, en colère ou qu’il veut impressionner un rival, les cristaux s’écartent et des couleurs vives apparaissent : jaune, orange, rouge.</p>
  <p>La température joue aussi : un caméléon qui a froid devient plus sombre, pour absorber davantage la chaleur du soleil. Kami, lui, change surtout de couleur quand il voit un grillon bien dodu.</p>
</article>`,
    steps: [
      "Regarde l’article en **Ordinateur** : les lignes sont interminables.",
      "Dans la règle `.article`, ajoute `max-width: 65ch`.",
      "Ajoute aussi un interligne confortable : `line-height: 1.6`. Vérifie sur téléphone : le texte prend toujours toute la largeur."
    ],
    starter: `/* Un texte agréable à lire sur tous les écrans */\n.article {\n  \n}\n`,
    goals: [
      { label: "Sur ordinateur, les lignes sont limitées avec `max-width` en `ch` (entre 45 et 75)", test: c => { const v = norm(rDecl(c, [".article", ".article p", "p", "article"], "max-width") || ""); const n = parseFloat(v); return (/^[\d.]+ch$/.test(v) && n >= 45 && n <= 75 && rW(c, "ordi", ".article p") < rW(c, "ordi", "body") * 0.7) || (v ? `max-width vaut ${v} : écris une valeur en ch, entre 45ch et 75ch, par exemple 65ch.` : false); } },
      { label: "Sur téléphone, le texte prend toute la largeur de l’écran", test: c => Math.abs(rW(c, "mobile", ".article p") - rW(c, "mobile", "body")) < 2 || "Sur téléphone, le texte doit prendre toute la largeur : utilise max-width, pas width." },
      { label: "L’interligne fait au moins 1.5", test: c => { const lh = rPx(c, "mobile", ".article p", "line-height"), fs = rPx(c, "mobile", ".article p", "font-size"); return (fs > 0 && lh / fs >= 1.5) || "Ajoute line-height: 1.6; dans la règle .article."; } },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "L’unité des caractères : `ch`. Environ 65 caractères par ligne : `65ch`.",
      "Dans `.article` : `max-width: 65ch;`",
      "Ajoute `line-height: 1.6;` dans la même règle."
    ],
    solution: `/* Un texte agréable à lire sur tous les écrans */\n.article {\n  max-width: 65ch;\n  line-height: 1.6;\n}\n`,
    debrief: "65 caractères par ligne et un bon interligne : l’article se lit sans effort, sur tous les écrans. Wikipédia, les journaux en ligne et les blogs limitent ainsi leurs colonnes de texte. Il ne reste qu’à **centrer** ce contenu sur les grands écrans : c’est la mission suivante."
  },
  {
    id: "conteneur-centre", ch: 5, title: "Bien au milieu", notion: "le conteneur centré : margin-inline et padding-inline",
    say: "Sur ordinateur, ma page d’accueil est collée à gauche, avec un grand vide à droite. Et sur téléphone, le texte touche les bords de l’écran. Il me faut un conteneur bien centré !",
    lesson: {
      what: [
        "Presque tous les sites rangent leur contenu dans un **conteneur centré** : une boîte qui a une **largeur maximale** sur grand écran, qui se **centre** dans la page, et qui garde un peu d’**espace sur les côtés** sur téléphone.",
        "Trois déclarations suffisent : `max-width` (la limite), `margin-inline: auto` (des marges automatiques et égales à gauche et à droite, donc la boîte est centrée), et `padding-inline` (un espace intérieur à gauche et à droite).",
        "`margin-inline` et `padding-inline` sont des **propriétés logiques** : *inline* veut dire « dans le sens de la ligne de texte », donc gauche et droite en français. `margin-inline: auto` est l’équivalent moderne de `margin: 0 auto`, que tu as vu dans le jeu CSS ; *block* veut dire haut et bas (`padding-block`)."
      ],
      why: "Sur un écran de 1280px ou plus, un contenu étalé d’un bord à l’autre est difficile à lire et semble vide. Sur un téléphone, un texte collé au bord de l’écran est désagréable et dur à lire. Le conteneur règle les deux problèmes à la fois.",
      code: `.conteneur {\n  max-width: 960px;\n  margin-inline: auto;\n  padding-inline: 16px;\n}`,
      pieces: [
        ["max-width: 960px", "jamais plus de 960px de contenu : sur téléphone, la boîte prend toute la largeur"],
        ["margin-inline: auto", "les marges de gauche et de droite se partagent la place restante : la boîte est centrée"],
        ["padding-inline: 16px", "16px d’espace intérieur à gauche et à droite : le texte ne touche jamais le bord de l’écran"],
        ["inline / block", "*inline* = gauche et droite, *block* = haut et bas (en français)"]
      ],
      trap: "Oublier le `padding-inline` : sur ordinateur, tout va bien, mais sur téléphone, le texte colle aux bords. Et `margin-inline: auto` ne centre que si la boîte a une largeur limitée (`max-width` ou `width`) : sinon, elle prend déjà toute la place.",
      good: "Crée une seule classe `.conteneur` et réutilise-la dans chaque grande zone de la page (en-tête, contenu, pied de page) : tout est aligné sur les mêmes bords. Avec `box-sizing: border-box`, `max-width` comprend aussi le padding, et les calculs restent simples."
    },
    showHTML: true,
    base: `body { margin: 0; background-color: #E9F1F5; }\n.conteneur { background-color: white; padding-block: 24px; }\n.conteneur h1 { margin-top: 0; color: #1E9E66; }`,
    html: `<div class="conteneur">
  <h1>Bienvenue chez Kami</h1>
  <p>Ici, tu trouveras mes balades dans la forêt, mes recettes préférées et les nouvelles de mes amis : Bip le robot, les lucioles de l’étang et le vieux hibou.</p>
  <p>Ce site s’adapte à tous les écrans, comme moi à toutes les branches.</p>
</div>`,
    steps: [
      "Regarde la page en **Ordinateur** (collée à gauche), puis en **Téléphone** (le texte touche les bords).",
      "Dans la règle `.conteneur`, ajoute `max-width: 960px` et `margin-inline: auto`.",
      "Ajoute `padding-inline: 16px`, puis vérifie les trois écrans."
    ],
    starter: `/* Le conteneur de la page */\n.conteneur {\n  \n}\n`,
    goals: [
      { label: "Sur ordinateur, le conteneur ne dépasse pas environ 960px", test: c => { const w = rW(c, "ordi", ".conteneur"); return (w >= 900 && w <= 1000) || `Sur ordinateur, le conteneur fait ${w}px : donne-lui max-width: 960px;`; } },
      { label: "Sur ordinateur, il est centré", test: c => { const b = boxAt(c, "ordi", ".conteneur"); return (!!b && b.width < 1100 && Math.abs(b.left - (1280 - b.right)) < 2) || "Le conteneur n’est pas centré : ajoute margin-inline: auto;"; } },
      { label: "Sur téléphone, le texte est à au moins 16px des bords", test: c => { const p = boxAt(c, "mobile", ".conteneur p"); return (!!p && p.left >= 15.5 && p.right <= 375 - 15.5) || "Sur téléphone, le texte touche les bords : ajoute padding-inline: 16px;"; } },
      { label: "Rien ne déborde, sur aucun écran", test: c => rNoOverflow(c) },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Trois déclarations dans `.conteneur` : une largeur maximale, des marges automatiques, un espace intérieur.",
      "`max-width: 960px;` et `margin-inline: auto;`",
      "Et pour les bords du téléphone : `padding-inline: 16px;`"
    ],
    solution: `/* Le conteneur de la page */\n.conteneur {\n  max-width: 960px;\n  margin-inline: auto;\n  padding-inline: 16px;\n}\n`,
    debrief: "`max-width` + `margin-inline: auto` + `padding-inline` : le contenu est limité et centré sur grand écran, et il respire sur téléphone. C’est le conteneur de presque tous les sites du web : ouvre **Inspecter** sur ton site préféré, tu le trouveras sûrement sous le nom `.container`."
  },

  /* ------------------------------ ATELIER 6 : MÉDIAS ET PAGE COMPLÈTE ------------------------------ */
  {
    id: "vignettes", ch: 6, title: "La galerie bien rangée", notion: "aspect-ratio et object-fit",
    say: "Ma galerie mélange des photos larges, des photos hautes et des photos carrées : c’est le désordre ! Je voudrais des vignettes toutes carrées, sans que mes photos soient écrasées.",
    lesson: {
      what: [
        "`aspect-ratio` fixe le **rapport largeur / hauteur** d’une boîte : `1 / 1` donne un carré, `16 / 9` un format vidéo, `4 / 3` un format photo. La largeur suit la grille (elle est fluide), et la hauteur se calcule toute seule.",
        "Mais une photo panoramique dans une boîte carrée serait **déformée**. `object-fit` dit comment l’image remplit sa boîte : `cover` la **remplit en entier** en gardant ses proportions, et coupe ce qui dépasse ; `contain` la montre en entier, avec des bandes vides."
      ],
      why: "Les photos envoyées par des personnes différentes n’ont jamais le même format. Avec `aspect-ratio` et `object-fit: cover`, une galerie, une liste de produits ou des avatars restent **réguliers** sur tous les écrans, sans recadrer chaque fichier à la main.",
      code: `.galerie img {\n  aspect-ratio: 1 / 1;\n  object-fit: cover;\n}`,
      pieces: [
        ["aspect-ratio: 1 / 1", "largeur et hauteur égales : une vignette carrée, quelle que soit sa largeur"],
        ["object-fit: cover", "l’image couvre toute la vignette sans être déformée ; les bords qui dépassent sont coupés"],
        ["object-fit: contain", "l’image entière, plus petite, avec des bandes vides autour"],
        ["object-position", "(facultatif) quelle partie garder quand on coupe : `center` par défaut, `top`, `left`…"]
      ],
      example: { code: `img {\n  width: 120px;\n  aspect-ratio: 1 / 1;\n  border: 3px solid #1B2440;\n}\n\n.b {\n  object-fit: cover;\n}`, html: `<img class="a" src="img/paysage.svg" alt="déformée">\n<img class="b" src="img/paysage.svg" alt="recadrée">` },
      trap: "Donner une largeur **et** une hauteur fixes en pixels (`width: 150px; height: 150px;`) : sur un grand écran, les vignettes restent petites ; et sans `object-fit: cover`, les photos sont écrasées. Avec `aspect-ratio`, la vignette garde sa forme mais suit la largeur de sa colonne.",
      good: "Avec `object-fit: cover`, une partie de l’image est coupée : choisis des photos dont le sujet est au **centre**, ou règle `object-position`. Et garde toujours un texte `alt` qui décrit l’image entière."
    },
    base: `.galerie { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }\n.galerie img { display: block; width: 100%; height: auto; border-radius: 12px; }`,
    html: `<h1>Mes plus belles photos</h1>
<ul class="galerie">
  <li><img src="img/paysage.svg" alt="Kami sur sa colline, au soleil" width="1200" height="600"></li>
  <li><img src="img/foret.svg" alt="Trois sapins dans la forêt" width="800" height="500"></li>
  <li><img src="img/etang.svg" alt="L’étang la nuit, avec les lucioles" width="500" height="750"></li>
  <li><img src="img/grillon.svg" alt="Un grillon dodu sur fond jaune" width="600" height="600"></li>
</ul>`,
    steps: [
      "Regarde la galerie : les images sont fluides (elles suivent la grille), mais elles n’ont pas toutes la même hauteur.",
      "Dans la règle `.galerie img`, ajoute `aspect-ratio: 1 / 1`.",
      "Ajoute `object-fit: cover` pour que les photos ne soient plus déformées, puis compare les trois écrans."
    ],
    starter: `/* Des vignettes toutes pareilles */\n.galerie img {\n  \n}\n`,
    goals: [
      { label: "Sur les trois écrans, toutes les vignettes ont la même hauteur", test: c => { const ko = rFail(id => { const h = qaAt(c, id, ".galerie img").map(i => i.getBoundingClientRect().height); return h.length === 4 && Math.max(...h) - Math.min(...h) < 1.5; }); return !ko.length || `Les vignettes n’ont pas la même hauteur (${ko.join(", ")}).`; } },
      { label: "Les vignettes sont carrées, sur téléphone comme sur ordinateur", test: c => { const ko = rFail(id => qaAt(c, id, ".galerie img").every(i => { const r = i.getBoundingClientRect(); return Math.abs(r.width - r.height) < 1.5; }), ["mobile", "ordi"]); return !ko.length || "Les vignettes ne sont pas carrées : aspect-ratio: 1 / 1; plutôt qu’une hauteur fixe."; } },
      { label: "Les photos ne sont pas déformées : `object-fit: cover`", test: c => { const v = csAt(c, "mobile", ".galerie img", "object-fit"); return v === "cover" || (v === "contain" ? "Avec contain, l’image est entière mais laisse des bandes vides : on veut cover." : false); } },
      { label: "Sur téléphone, rien ne déborde", test: c => rNoOverflow(c, ["mobile"]) },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "Le rapport largeur / hauteur d’un carré : `1 / 1`.",
      "`aspect-ratio: 1 / 1;` puis `object-fit: cover;`",
      "La règle complète : `.galerie img { aspect-ratio: 1 / 1; object-fit: cover; }`"
    ],
    solution: `/* Des vignettes toutes pareilles */\n.galerie img {\n  aspect-ratio: 1 / 1;\n  object-fit: cover;\n}\n`,
    debrief: "`aspect-ratio` donne la forme, `object-fit: cover` remplit sans déformer : la galerie est régulière sur tous les écrans, quelles que soient les photos. Instagram, les boutiques en ligne et les listes de contacts (avec leurs avatars ronds) utilisent exactement ce duo."
  },
  {
    id: "picture-srcset", ch: 6, title: "La bonne photo pour chaque écran", notion: "<picture> et srcset",
    say: "Sur téléphone, mon grand paysage devient tout petit et on ne me voit plus ! Bip a préparé deux fichiers : un recadrage carré pour les petits écrans, et le paysage entier pour les grands. Le navigateur choisit tout seul.",
    lesson: {
      what: [
        "Le HTML peut proposer **plusieurs fichiers** pour une même image, et laisser le **navigateur choisir**. Deux outils :",
        "La balise `<picture>` contient des `<source media=\"…\" srcset=\"…\">` et un `<img>`. Le navigateur prend la **première source** dont la condition `media` est vraie (comme une media query), sinon le `<img>`. Elle sert à la **direction artistique** : un **cadrage** différent selon l’écran (carré sur téléphone, panoramique sur ordinateur).",
        "L’attribut `srcset` sur `<img>` propose plusieurs **tailles** du même fichier : `srcset=\"kami-400.jpg 400w, kami-800.jpg 800w\"` (avec l’attribut `sizes`, qui dit quelle largeur l’image occupera), ou `srcset=\"kami.jpg 1x, kami@2x.jpg 2x\"` pour les écrans à forte **densité de pixels** (les écrans *Retina*, qui ont 2 ou 3 points physiques par pixel CSS).",
        "Dans cette mission, le HTML est donné : regarde-le, puis écris le CSS qui rend la photo fluide."
      ],
      why: "Un téléphone n’a pas besoin d’une image de 2000px : elle est lourde à télécharger (forfait, réseau lent) et lente à afficher. Avec `srcset`, il télécharge un fichier léger ; avec `<picture>`, il reçoit en plus un cadrage où le sujet se voit bien.",
      lang: "html",
      code: `<picture>\n  <source media="(min-width: 768px)" srcset="img/paysage.svg">\n  <img src="img/paysage-carre.svg" alt="Kami sur sa colline"\n       width="600" height="600">\n</picture>\n\n<img src="kami-400.jpg" alt="Kami"\n     srcset="kami-400.jpg 400w, kami-800.jpg 800w"\n     sizes="(min-width: 768px) 50vw, 100vw">`,
      pieces: [
        ["<picture>", "le conteneur : il propose plusieurs images au navigateur"],
        ["<source media=\"…\">", "une image possible, avec sa condition : la première vraie gagne"],
        ["<img>", "obligatoire, en dernier : l’image par défaut, avec son `alt`. C’est elle que le CSS vise"],
        ["srcset=\"… 400w, … 800w\"", "plusieurs largeurs du même fichier : le navigateur choisit selon l’écran et sa densité de pixels"],
        ["sizes", "la largeur qu’occupera l’image : 50 % de l’écran à partir de 768px, sinon 100 %"]
      ],
      trap: "Oublier le `<img>` dans `<picture>` : sans lui, rien ne s’affiche. Et c’est sur le `<img>` que se mettent l’`alt` et le CSS, pas sur `<picture>` ni sur `<source>`. Autre piège : croire que `display: none` sur une grande image évite de la télécharger ; pour alléger une page, c’est `srcset` et `<picture>` qu’il faut.",
      good: "Prépare chaque photo en plusieurs largeurs (par exemple 400, 800 et 1600px), propose-les avec `srcset` et `sizes`, et ajoute `loading=\"lazy\"` aux images qui sont plus bas dans la page : elles ne seront téléchargées que si le visiteur s’en approche."
    },
    showHTML: true,
    base: `h1 { color: #1E9E66; }\n.legende { color: #5A6478; }`,
    html: `<h1>La photo de la semaine</h1>
<picture>
  <source media="(min-width: 768px)" srcset="img/paysage.svg" width="1200" height="600">
  <img class="photo" src="img/paysage-carre.svg" alt="Kami sur sa colline, au soleil" width="600" height="600">
</picture>
<p class="legende">Sur téléphone, un recadrage carré ; sur grand écran, le paysage entier.</p>`,
    steps: [
      "Lis le HTML : repère `<picture>`, la `<source>` et sa condition, et l’`<img>` avec sa classe `photo`.",
      "Écris une règle `.photo` : `display: block`, `max-width: 100%` et `height: auto`.",
      "Ajoute des coins arrondis (`border-radius: 16px`), puis compare les trois écrans : ce n’est pas le même fichier !"
    ],
    starter: `/* La photo doit tenir dans l’écran, avec des coins arrondis */\n`,
    goals: [
      { label: "Sur téléphone, rien ne déborde", test: c => !overflowAt(c, "mobile") || "La photo dépasse de l’écran du téléphone : rends-la fluide." },
      { label: "La photo garde ses proportions : carrée sur téléphone, panoramique sur grand écran", test: c => { const r = id => { const b = boxAt(c, id, ".photo"); return b && b.height ? b.width / b.height : 0; }; return (Math.abs(r("mobile") - 1) < 0.05 && Math.abs(r("tablette") - 2) < 0.05 && Math.abs(r("ordi") - 2) < 0.05) || "La photo est déformée : ajoute height: auto;"; } },
      { label: "Les coins de la photo sont arrondis", test: c => rPx(c, "mobile", ".photo", "border-top-left-radius") >= 8 },
      { label: "Le navigateur a choisi le bon fichier : le carré sur téléphone, le paysage sur tablette et ordinateur", test: c => { const s = id => (qAt(c, id, ".photo") || {}).currentSrc || ""; return (/paysage-carre\.svg$/.test(s("mobile")) && /paysage\.svg$/.test(s("tablette")) && /paysage\.svg$/.test(s("ordi"))) || "Le HTML n’a pas changé ? Le navigateur doit choisir le fichier selon la condition de la source."; } },
      { label: "Aucune erreur", test: noErrors }
    ],
    hints: [
      "La classe de l’image est `photo` : le sélecteur est `.photo`.",
      "Comme dans la mission des images fluides : `max-width: 100%;` et `height: auto;`, plus `display: block;`.",
      "`.photo { display: block; max-width: 100%; height: auto; border-radius: 16px; }`"
    ],
    solution: `/* La photo doit tenir dans l’écran, avec des coins arrondis */\n.photo {\n  display: block;\n  max-width: 100%;\n  height: auto;\n  border-radius: 16px;\n}\n`,
    debrief: "Le HTML choisit **le fichier** (avec `<picture>` et `srcset`), le CSS choisit **la taille d’affichage** : les deux travaillent ensemble. Les grands sites d’information et de commerce proposent toujours plusieurs versions de chaque image : le téléphone télécharge moins, l’écran haute définition reste net."
  },
  {
    id: "quiz3", ch: 6, quiz: true, title: "Contrôle des images", notion: "quiz",
    say: "Avant la grande mission finale, un dernier contrôle sur les images. Elles pèsent souvent plus lourd que tout le reste de la page !",
    questions: [
      { q: "Dans `<picture>`, comment le navigateur choisit-il l’image à afficher ?", opts: ["Il prend la première `<source>` dont la condition `media` est vraie, sinon le `<img>`", "Il télécharge toutes les images et garde la plus belle", "Il prend toujours le `<img>`, les sources sont des commentaires"], a: 0, why: "Les `<source>` sont lues dans l’ordre ; la première dont la condition est vraie gagne. Le `<img>` final sert d’image par défaut, et c’est lui qui porte l’`alt`." },
      { q: "Sur un écran haute définition (densité 2x), quel fichier ce code télécharge-t-il ?", lang: "html", code: `<img src="kami.jpg" alt="Kami"\n     srcset="kami.jpg 1x, kami@2x.jpg 2x">`, opts: ["`kami.jpg`", "`kami@2x.jpg`", "Les deux"], a: 1, why: "Un écran 2x a deux points physiques par pixel CSS : le navigateur choisit `kami@2x.jpg`, deux fois plus grand, pour une image nette. Un écran ordinaire télécharge `kami.jpg`, plus léger." },
      { q: "Pourquoi proposer plusieurs tailles d’une image avec `srcset` ?", opts: ["Pour que l’image soit plus colorée", "Parce que `<img>` ne fonctionne pas sans `srcset`", "Pour que le téléphone télécharge un fichier léger et que les grands écrans aient une image nette"], a: 2, why: "Le navigateur connaît la largeur de l’écran et sa densité de pixels : avec `srcset`, il télécharge le plus petit fichier suffisant. La page est plus rapide, surtout sur un réseau mobile." },
      { q: "Des photos de formats différents doivent devenir des vignettes carrées, sans être déformées. Quel duo écris-tu ?", opts: ["`width: 150px; height: 150px;`", "`aspect-ratio: 1 / 1; object-fit: cover;`", "`aspect-ratio: 4 / 3; object-fit: contain;`"], a: 1, why: "`aspect-ratio: 1 / 1` donne la forme carrée en suivant la largeur de la colonne, et `object-fit: cover` remplit le carré sans déformer (en coupant les bords). Des tailles fixes ne suivent pas l’écran et déforment l’image." },
      { q: "À quoi servent les attributs `width` et `height` sur un `<img>`, même avec une image fluide ?", opts: ["À rien : le CSS les remplace", "À fixer l’image à cette taille sur tous les écrans", "À réserver la bonne place avant le chargement, pour que la page ne « saute » pas"], a: 2, why: "Le navigateur en déduit les proportions et réserve la place de l’image tout de suite. Le CSS (`max-width: 100%; height: auto;`) décide ensuite de la taille d’affichage." }
    ],
    debrief: "`<picture>` pour changer de cadrage, `srcset` et `sizes` pour changer de taille de fichier, `aspect-ratio` et `object-fit` pour des vignettes régulières, et `width`/`height` pour une page stable. Tes images sont prêtes pour tous les écrans !"
  },
  {
    id: "finale", ch: 6, boss: true, title: "La page d’accueil de Kami", notion: "mission finale",
    say: "Dernière mission ! Je lance mon site de balades guidées. Fais-moi une page d’accueil parfaite sur le téléphone, la tablette et l’ordinateur, avec tout ce que tu as appris. Et pas un seul pixel qui déborde !",
    lesson: {
      what: "Cette mission réunit tout le jeu : les bases (`box-sizing`, images fluides), le conteneur centré, le menu responsive avec ses zones tactiles, le titre fluide avec `clamp()`, la grille de cartes avec `auto-fit`, les vignettes avec `aspect-ratio`, et une media query mobile d’abord. Avance zone par zone, en suivant les commentaires du code de départ, et vérifie souvent sur les **trois écrans**.",
      why: "C’est exactement le travail d’un intégrateur web : partir d’une page HTML et de maquettes pour le téléphone et l’ordinateur, puis écrire un seul CSS qui fonctionne partout. Une page d’accueil comme celle-ci (en-tête, héros, cartes, pied de page) existe sur des milliers de sites.",
      code: `/* Mobile d’abord */\n.cartes {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 16px;\n}\n\n/* Grands écrans */\n@media (min-width: 768px) {\n  .barre {\n    display: flex;\n    justify-content: space-between;\n  }\n}`,
      pieces: [
        ["Le modèle", "clique sur « Le modèle à reproduire » au-dessus de l’aperçu, et compare sur chaque écran"],
        ["Le HTML", "ouvre le volet du HTML pour voir les classes : `.conteneur`, `.barre`, `.logo`, `.liens`, `.heros`, `.titre`, `.cartes`, `.carte`, `.pied`"],
        [".conteneur", "il est utilisé trois fois : dans l’en-tête, le héros et le pied de page. Une seule règle les aligne tous"],
        ["@media (min-width: 768px)", "une seule media query suffit, tout à la fin : l’en-tête passe en ligne"]
      ],
      trap: "Écrire d’abord la version ordinateur, puis tout corriger pour le téléphone. Fais l’inverse : écris tout pour le **téléphone**, vérifie, puis ajoute la media query. Et regarde les trois écrans après chaque zone, pas seulement à la fin.",
      good: "Travaille comme un pro : mobile d’abord, une zone à la fois, une vérification après chaque règle. Range ton CSS dans l’ordre de la page, avec un commentaire par zone, et garde les media queries à la fin : dans six mois, tu t’y retrouveras du premier coup."
    },
    showHTML: true,
    base: `body { margin: 0; background-color: #F4F8FA; }\na { color: inherit; }\n.entete { background-color: #1B2440; color: white; }\n.logo { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.25rem; text-decoration: none; }\n.liens { list-style: none; margin: 0; padding: 0; }\n.liens a { text-decoration: none; border-radius: 8px; background-color: rgba(255, 255, 255, 0.12); }\n.heros { background-color: #1E9E66; color: white; }\n.bouton { display: inline-block; padding: 0.75em 1.5em; border-radius: 999px; background-color: #FFD43B; color: #1B2440; font-weight: 700; text-decoration: none; }\n.cartes { list-style: none; margin: 0; padding: 0; }\n.carte { background-color: white; border: 3px solid #1B2440; border-radius: 16px; overflow: hidden; }\n.carte h3, .carte p { margin: 12px 16px; }\n.pied { background-color: #1B2440; color: white; margin-top: 32px; }\n.pied p { margin: 0; padding-block: 16px; }`,
    html: `<header class="entete">
  <div class="conteneur barre">
    <a class="logo" href="#"><img src="img/logo.svg" alt="" width="48" height="48"> Kami</a>
    <nav>
      <ul class="liens">
        <li><a href="#">Accueil</a></li>
        <li><a href="#">Les balades</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>
<main>
  <section class="heros">
    <div class="conteneur">
      <h1 class="titre">Les balades de Kami</h1>
      <p>Des promenades guidées dans la forêt, pour petits et grands caméléons.</p>
      <a class="bouton" href="#">Réserver une balade</a>
    </div>
  </section>
  <section class="conteneur">
    <h2>Nos balades</h2>
    <ul class="cartes">
      <li class="carte">
        <img src="img/foret.svg" alt="Trois sapins dans la forêt" width="800" height="500">
        <h3>La forêt</h3>
        <p>Deux heures sous les grands arbres.</p>
      </li>
      <li class="carte">
        <img src="img/etang.svg" alt="L’étang la nuit, avec les lucioles" width="500" height="750">
        <h3>L’étang</h3>
        <p>Une soirée avec les lucioles.</p>
      </li>
      <li class="carte">
        <img src="img/paysage.svg" alt="Kami sur sa colline, au soleil" width="1200" height="600">
        <h3>Les collines</h3>
        <p>Le plus beau point de vue de la forêt.</p>
      </li>
    </ul>
  </section>
</main>
<footer class="pied">
  <div class="conteneur">
    <p>© Les balades de Kami · Forêt des grands chênes</p>
  </div>
</footer>`,
    steps: [
      "Les bases : `box-sizing: border-box` pour tous les éléments, et des images fluides (`max-width: 100%`, `height: auto`, `display: block`).",
      "Le `.conteneur` : `max-width: 1100px`, centré avec `margin-inline: auto`, et `padding-inline: 16px`.",
      "L’en-tête : `.barre` avec un peu de `padding-block`. Les `.liens` en colonne (flex), espacés de `8px` ; chaque `.liens a` en `display: block` avec `padding: 12px 16px` (au moins 44px de haut).",
      "Le héros : du `padding-block`, et le `.titre` en `clamp(2rem, 1rem + 5vw, 4rem)`.",
      "Les cartes : `.cartes` en grille `repeat(auto-fit, minmax(220px, 1fr))` avec un `gap`, et les images des cartes en `aspect-ratio: 16 / 10` avec `object-fit: cover`.",
      "À la fin, `@media (min-width: 768px)` : la `.barre` en flex (logo à gauche, liens à droite) et les `.liens` en ligne."
    ],
    starter: `/* Les balades de Kami : la page d’accueil */\n/* Mobile d’abord : le CSS du téléphone, puis la media query à la fin. */\n\n/* 1. Les bases : box-sizing et images fluides */\n\n\n/* 2. Le conteneur centré */\n\n\n/* 3. L’en-tête : le logo et les liens (au moins 44px de haut) */\n\n\n/* 4. Le héros : un titre fluide avec clamp() */\n\n\n/* 5. Les cartes : une grille qui s’adapte toute seule */\n\n\n/* 6. Grands écrans : 768px et plus */\n`,
    goals: [
      { label: "Aucun débordement, sur les trois écrans", test: c => rNoOverflow(c) },
      { label: "Les images sont fluides : aucune ne dépasse de sa carte", test: c => { const ko = rFail(id => qaAt(c, id, ".carte").every(k => { const i = k.querySelector("img"); return !!i && i.getBoundingClientRect().width <= k.getBoundingClientRect().width + 0.5; })); return !ko.length || `Des images dépassent de leur carte (${ko.join(", ")}) : img { max-width: 100%; height: auto; }`; } },
      { label: "Le conteneur : centré et limité sur ordinateur, avec de l’espace sur les côtés sur téléphone", test: c => { const b = boxAt(c, "ordi", ".heros .conteneur"), t = boxAt(c, "mobile", ".titre"); const ok = !!b && b.width <= 1140 && Math.abs(b.left - (1280 - b.right)) < 2 && !!t && t.left >= 15.5; return ok || "Le .conteneur : max-width: 1100px; margin-inline: auto; padding-inline: 16px;"; } },
      { label: "Le menu : liens empilés d’au moins 44px sur téléphone, en ligne à droite du logo sur ordinateur", test: c => { const m = qaAt(c, "mobile", ".liens a").map(a => a.getBoundingClientRect()); const okM = m.length === 3 && m.every((r, i) => r.height >= 44 && (i === 0 || r.top >= m[i - 1].bottom)); const l = boxAt(c, "ordi", ".logo"), o = qaAt(c, "ordi", ".liens a").map(a => a.getBoundingClientRect()); const okO = !!l && o.length === 3 && o.every(r => Math.abs(r.top - o[0].top) < 3) && o[0].left > l.right && o[0].top < l.bottom; return (okM && okO) || (!okM ? "Sur téléphone : des liens empilés, en display: block avec padding: 12px 16px (au moins 44px)." : "Sur ordinateur : la .barre en display: flex avec justify-content: space-between, et les .liens en flex-direction: row."); } },
      { label: "Le titre utilise `clamp()` et grandit avec l’écran", test: c => { const v = norm(rDecl(c, [".titre", "h1", ".heros h1", ".heros .titre"], "font-size") || ""); return (/clamp\(/.test(v) && rPx(c, "mobile", ".titre", "font-size") < rPx(c, "ordi", ".titre", "font-size")) || (v ? "Le titre : font-size: clamp(2rem, 1rem + 5vw, 4rem);" : false); } },
      { label: "Les cartes : une colonne sur téléphone, plusieurs sur tablette, trois sur ordinateur", test: c => { const a = rCols(c, "mobile", ".carte"), b = rCols(c, "tablette", ".carte"), d = rCols(c, "ordi", ".carte"); return (a === 1 && b >= 2 && d === 3) || `Colonnes de cartes : ${a} sur téléphone, ${b} sur tablette, ${d} sur ordinateur.`; } },
      { label: "Les vignettes des cartes ont toutes la même hauteur", test: c => { const ko = rFail(id => { const h = qaAt(c, id, ".carte img").map(i => i.getBoundingClientRect().height); return h.length === 3 && Math.max(...h) - Math.min(...h) < 1.5; }); return !ko.length || "Les images des cartes n’ont pas la même hauteur : aspect-ratio: 16 / 10; et object-fit: cover;"; } },
      { label: "Mobile d’abord : des media queries en `min-width` seulement", test: c => (rMedia(c, /min-width/i).length > 0 && rMedia(c, /max-width/i).length === 0) || (rMedia(c, /max-width/i).length ? "Mobile d’abord : utilise min-width, pas max-width." : false) },
      { label: "Le CSS est propre : aucune erreur", test: noErrors }
    ],
    hints: [
      "Les bases : `*, *::before, *::after { box-sizing: border-box; }` et `img { display: block; max-width: 100%; height: auto; }`. Le conteneur : `.conteneur { max-width: 1100px; margin-inline: auto; padding-inline: 16px; }`.",
      "Le menu : `.liens { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }` et `.liens a { display: block; padding: 12px 16px; }`. Le titre : `.titre { font-size: clamp(2rem, 1rem + 5vw, 4rem); }`. Les cartes : `.cartes { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }` et `.carte img { aspect-ratio: 16 / 10; object-fit: cover; }`.",
      "La media query : `@media (min-width: 768px) { .barre { display: flex; align-items: center; justify-content: space-between; } .liens { flex-direction: row; margin-top: 0; } }`."
    ],
    solution: `/* Les balades de Kami : la page d’accueil */\n/* Mobile d’abord : le CSS du téléphone, puis la media query à la fin. */\n\n/* 1. Les bases : box-sizing et images fluides */\n*, *::before, *::after {\n  box-sizing: border-box;\n}\n\nimg {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n\n/* 2. Le conteneur centré */\n.conteneur {\n  max-width: 1100px;\n  margin-inline: auto;\n  padding-inline: 16px;\n}\n\n/* 3. L’en-tête : le logo et les liens (au moins 44px de haut) */\n.barre {\n  padding-block: 12px;\n}\n\n.liens {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  margin-top: 12px;\n}\n\n.liens a {\n  display: block;\n  padding: 12px 16px;\n}\n\n/* 4. Le héros : un titre fluide avec clamp() */\n.heros {\n  padding-block: 48px;\n}\n\n.titre {\n  margin: 0 0 12px;\n  font-size: clamp(2rem, 1rem + 5vw, 4rem);\n  line-height: 1.1;\n}\n\n/* 5. Les cartes : une grille qui s’adapte toute seule */\n.cartes {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 16px;\n}\n\n.carte img {\n  aspect-ratio: 16 / 10;\n  object-fit: cover;\n}\n\n/* 6. Grands écrans : 768px et plus */\n@media (min-width: 768px) {\n  .barre {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  }\n\n  .liens {\n    flex-direction: row;\n    margin-top: 0;\n  }\n}\n`,
    debrief: "Bravo : une vraie page d’accueil, mobile d’abord, parfaite sur le téléphone, la tablette et l’ordinateur, sans un pixel qui déborde. Tu sais maintenant **structurer** (HTML), **habiller** (CSS), **placer** (Flexbox et Grid) et **adapter** (responsive) une page. Avant de partir, passe par le **Lexique** et sa liste « Prêt pour la suite ? ». Il manque une dernière chose : le **comportement**. Ouvrir le menu d’un clic, réagir à un formulaire… c’est le **JavaScript**, et Bip le robot t’attend !"
  }
  ]
};
