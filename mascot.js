/* Kami, le caméléon du CSS. Dans le jeu CSS, il retrouve ses couleurs pièce par pièce.
   Dans Flexbox, il rassemble ses lucioles. Dans Grid, il fait pousser son potager. */
const MASCOT = {
  name: "Kami",
  // style : "colors" (chaque atelier colore une partie), "fireflies" (une luciole par atelier), "plants" (une plante par atelier), "screens" (un écran par atelier)
  style: "colors",
  svg(done, mood) {
    done = done || new Set();
    const st = MASCOT.style;
    const c = n => st !== "colors" || done.has(n) ? "got" : "grey";
    const happy = mood === "happy";
    const eye = happy
      ? `<path class="lid" d="M45 81 q7 -8 14 0"/>`
      : `<circle class="eye-white" cx="52" cy="82" r="7.5"/><circle class="pupil" cx="49" cy="82" r="3.6"/><circle class="glint" cx="50.2" cy="80.6" r="1.2"/>`;
    const mouth = happy ? `<path class="mouth" d="M22 100 q12 10 26 2"/>` : `<path class="mouth" d="M22 101 q12 5 24 1"/>`;
    let extras = "";
    if (st === "fireflies") {
      const pos = [[24, 26], [70, 14], [120, 22], [160, 44], [176, 86], [150, 10]];
      extras = pos.map(([x, y], i) => done.has(i + 1)
        ? `<g class="fly"><circle class="halo" cx="${x}" cy="${y}" r="11"/><ellipse class="wing" cx="${x - 3}" cy="${y - 5}" rx="4" ry="2.6"/><ellipse class="wing" cx="${x + 3}" cy="${y - 5}" rx="4" ry="2.6"/><circle class="bulb" cx="${x}" cy="${y}" r="5"/></g>`
        : `<circle class="fly-ghost" cx="${x}" cy="${y}" r="5"/>`).join("");
    } else if (st === "plants") {
      const xs = [16, 46, 76, 106, 136, 166];
      const plant = (k, x) => [
        `<path class="leaf" d="M${x} 152 q-8 -12 -2 -20 q6 6 2 20Z"/><path class="leaf" d="M${x} 152 q8 -12 2 -20 q-6 6 -2 20Z"/><path class="carrot" d="M${x - 6} 152 h12 l-6 14Z"/>`,
        `<path class="stem" d="M${x} 152 v-16"/><circle class="tomato" cx="${x}" cy="138" r="7"/><path class="leaf" d="M${x - 4} 132 l4 3 l4 -3"/>`,
        `<circle class="salad" cx="${x}" cy="146" r="9"/><path class="salad-line" d="M${x} 138 v16 M${x - 6} 141 q6 5 12 0"/>`,
        `<path class="stem" d="M${x} 152 v-20"/><circle class="flower" cx="${x}" cy="130" r="5"/><circle class="flower" cx="${x - 6}" cy="134" r="4"/><circle class="flower" cx="${x + 6}" cy="134" r="4"/><circle class="heart" cx="${x}" cy="133" r="3"/>`,
        `<ellipse class="pumpkin" cx="${x}" cy="146" rx="11" ry="8"/><path class="stem" d="M${x} 138 v-5"/><path class="salad-line" d="M${x - 4} 140 v12 M${x + 4} 140 v12"/>`,
        `<path class="leaf" d="M${x} 152 q-10 -14 0 -26 q10 12 0 26Z"/><circle class="radish" cx="${x}" cy="156" r="6"/>`
      ][k];
      extras = `<rect class="soil" x="2" y="150" width="180" height="16" rx="8"/>` + xs.map((x, i) => done.has(i + 1) ? `<g class="plant">${plant(i, x)}</g>` : `<circle class="seed" cx="${x}" cy="156" r="3"/>`).join("");
    }
    if (st === "screens") {
      // une récompense = un écran : 1 téléphone, 2 tablette, 3 portable, 4 écran, 5 télé, 6 montre
      const dev = [
        `<rect x="22" y="8" width="15" height="27" rx="3"/><rect class="dk" x="27" y="30" width="5" height="2" rx="1"/>`,
        `<rect x="42" y="6" width="24" height="32" rx="3"/><circle class="dk" cx="54" cy="34" r="1.5"/>`,
        `<rect x="72" y="10" width="32" height="21" rx="2"/><path class="dk" d="M67 31 h42 l-3 5 h-36 Z"/>`,
        `<rect x="112" y="4" width="38" height="25" rx="2"/><path class="dk" d="M128 29 h6 v6 h6 v3 h-18 v-3 h6 Z"/>`,
        `<rect x="152" y="8" width="30" height="21" rx="2"/><path class="dk" d="M158 29 l-3 7 M176 29 l3 7"/>`,
        `<rect x="4" y="16" width="12" height="13" rx="3"/><path class="dk" d="M6 16 v-5 h8 v5 M6 29 v5 h8 v-5"/>`
      ];
      extras = dev.map((d, i) => `<g class="dev ${done.has(i + 1) ? "got" : "ghost"}">${d}</g>`).join("");
    }
    const tall = st === "plants" ? 172 : 140;
    return `<svg class="mascot kami" viewBox="0 0 186 ${tall}" role="img" aria-label="Kami">
      ${extras}
      <path class="branch" d="M4 124 C 50 118, 120 130, 182 120"/>
      <path class="twig" d="M150 124 q10 -14 22 -12"/><ellipse class="twig-leaf" cx="172" cy="110" rx="7" ry="4" transform="rotate(-25 172 110)"/>
      <path class="tail ${c(5)}" d="M128 96 C 158 92, 172 118, 156 130 C 144 138, 130 128, 138 118 C 143 112, 152 116, 149 122"/>
      <path class="leg ${c(4)}" d="M112 108 l6 16 m-6 0 h12"/>
      <path class="crest ${c(3)}" d="M62 66 l6 -10 l6 8 l8 -9 l6 9 l9 -7 l5 9 l9 -5 l3 10 l8 -3 l-2 10 Z"/>
      <path class="body ${c(2)}" d="M56 76 C 70 58, 112 58, 128 76 C 140 90, 136 108, 116 114 C 96 120, 70 118, 58 104 Z"/>
      <g class="spots ${c(6)}"><circle cx="84" cy="80" r="5"/><circle cx="104" cy="76" r="4"/><circle cx="98" cy="96" r="5.5"/><circle cx="118" cy="92" r="4"/><circle cx="78" cy="100" r="3.5"/></g>
      <path class="stripe ${c(2)}" d="M64 104 C 84 112, 108 112, 126 100"/>
      <path class="leg ${c(4)}" d="M70 110 l-6 14 m-6 0 h12"/>
      <path class="head ${c(1)}" d="M64 80 C 56 64, 34 62, 22 76 C 14 86, 12 98, 22 104 C 34 110, 56 108, 64 98 Z"/>
      <path class="casque ${c(3)}" d="M40 66 C 50 56, 62 58, 68 72 L 58 76 Z"/>
      <circle class="turret ${c(1)}" cx="52" cy="83" r="11"/>
      ${eye}${mouth}
      <ellipse class="cheek" cx="34" cy="98" rx="5" ry="3"/>
    </svg>`;
  }
};
