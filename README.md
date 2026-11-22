# Kami s’adapte · responsive-game

Un jeu pour apprendre le responsive en écrivant du vrai code, pensé pour les personnes qui veulent **commencer une formation dans le web** : aucune connaissance n’est nécessaire.

Un caméléon s’adapte à tout ce qui l’entoure. Une page web aussi doit s’adapter : au téléphone, à la tablette, à l’ordinateur. C’est le responsive. Chaque mission affiche ta page sur les trois écrans, et chaque atelier terminé allume un nouvel écran autour de Kami.

## Jouer

- **En ligne** : active GitHub Pages (Settings › Pages › *Deploy from a branch*, choisis la branche du jeu et le dossier `/ (root)`). Le jeu sera disponible à l’adresse `https://diurndesign.github.io/responsive-game/`.
- **En local** : ouvre le dossier avec l’extension Live Server de VS Code (ou n’importe quel petit serveur web). Ouvrir `index.html` en double-cliquant peut bloquer l’aperçu dans certains navigateurs.

La progression est enregistrée dans le navigateur de chaque joueur (localStorage).

## Comment ça marche

- **Découvrir** : une page qui explique ce qu’est le responsive, à quoi ça sert et pourquoi on l’utilise, avec une démo à manipuler, des exemples de la vraie vie, les métiers du web qui s’en servent, le vocabulaire et les pièges du débutant.
- **Les missions** : la page change **en direct** pendant que l’élève tape son CSS, à côté du modèle à reproduire. Le bouton **Vérifier** (ou Ctrl + Entrée) contrôle chaque objectif.

| Onglet | Ce qu’on y voit |
|---|---|
| Ton résultat / Le modèle | La page de l’élève, et la page à reproduire |
| Objectifs | Chaque critère réussi ou raté, avec une explication quand c’est faux |
| Remarques | Le vérificateur CSS : accolade, deux-points ou point-virgule oubliés, propriété inconnue, valeur invalide (couleur en français, unité manquante…), sélecteur qui ne trouve rien… en français, avec la ligne surlignée dans l’éditeur |

Chaque leçon explique **ce que c’est**, **à quoi ça sert**, le **piège à éviter** et la **bonne pratique** professionnelle. Les missions responsive ont une bascule **Ordinateur / Téléphone**.

Étoiles : 3 sans indice, 2 avec un indice, 1 avec la solution.

## Pour aller jusqu’au bout

- **Lexique** (menu en haut) : 48 mots du vocabulaire professionnel, définis simplement, avec une recherche ; 12 bonnes pratiques ; et la checklist **« Prêt pour la suite ? »** (15 points), qui renvoie vers la mission à revoir pour chaque point.
- **Ateliers** : chaque atelier annonce ce qu’on va apprendre et se termine par un bilan « Ce que tu sais faire maintenant ».
- **Découvrir** : la page commence par ce qu’il faut savoir avant de commencer, et renvoie au jeu précédent si besoin.

## Les 24 missions

| Atelier | Récompense | Notions |
|---|---|---|
| 1. Penser mobile | Le téléphone | le responsive et la balise viewport, les images fluides, les largeurs en % et box-sizing, quiz |
| 2. Les media queries | La tablette | @media et max-width, min-width et mobile d’abord, plusieurs points de rupture, afficher et masquer : display: none |
| 3. Les unités fluides | L’ordinateur portable | rem et em, vw et vh, clamp(), min() et max() |
| 4. Des mises en page qui s’adaptent | Le grand écran | des cartes avec flex-wrap, repeat(auto-fit, minmax()), grid-template-areas dans une media query, quiz |
| 5. Des composants adaptables | La télé | un menu responsive et des zones tactiles, un tableau qui défile : overflow-x: auto, la longueur de ligne : max-width en ch, le conteneur centré : margin-inline et padding-inline |
| 6. Médias et page complète | La montre | aspect-ratio et object-fit, `<picture> et srcset`, quiz, mission finale |

En plus : un **Carnet** (antisèche des notions débloquées) et un **Bac à sable** pour tester librement. Dans le Carnet, l’option « Débloquer toutes les missions » permet au formateur d’ouvrir toutes les missions.

## Fichiers

```
index.html   la structure de la page
jeu.css      le design commun aux 4 jeux
theme.css    les couleurs de ce jeu (variables CSS dans :root)
engine.js    le moteur commun : éditeur, aperçu, vérificateur, objectifs, carte, carnet, lexique
cloud.js     la sauvegarde en ligne (Firebase), reprise de Mission Bip
mascot.js    Kami, le caméléon, en SVG
game.js      les données du jeu : page Découvrir, lexique, ateliers et missions (tableau levels)
```

Pour ajouter ou modifier une mission, édite le tableau `levels` dans `game.js`. Chaque mission contient : le texte de Kami, la leçon (quoi, pourquoi, code, morceaux, piège), les étapes, la page HTML (`html`), le code de départ, les objectifs (`goals`, avec une fonction `test`), les indices et la solution (qui sert aussi de modèle à reproduire).

## La sauvegarde en ligne

Comme dans Mission Bip : sans compte, la progression reste dans le navigateur. Avec un compte (**e-mail + mot de passe**, bouton « Se connecter » en haut), elle est enregistrée en ligne dans Firebase (projet « bip-jeux », le même que Mission Bip) et l’élève la retrouve sur n’importe quel ordinateur. **Le même compte sert pour tous les jeux** : La maison de Bip, Mission Kami, Kami et les lucioles, Le potager de Kami, Kami s’adapte, Mission Bip et Bip Agence. Chaque élève ne peut lire et modifier que sa propre progression.

Ce qui est enregistré pour le formateur, mission par mission : essais, essais ratés, erreurs du vérificateur, indices, solution vue, réponses fausses aux quiz, étoiles et temps passé (même format que Mission Bip).

Rappel aux élèves : noter son e-mail et son mot de passe, et se déconnecter en partant d’un ordinateur de l’école.

### À faire une fois dans Firebase (formateur)

Les règles Firestore du projet « bip-jeux » n’autorisent pour l’instant que `mission-bip` et `bip-agence`. Dans **console.firebase.google.com › bip-jeux › Firestore Database › Règles**, remplace la liste des jeux par :

```
&& jeu in ['mission-bip', 'bip-agence', 'maison-bip', 'mission-kami', 'kami-lucioles', 'kami-potager', 'kami-ecrans'];
```

puis clique sur **Publier**. Sans cette étape, le jeu marche quand même, mais la sauvegarde en ligne affiche « La base refuse l’accès ».

| Jeu | Nom du document dans Firestore |
|---|---|
| La maison de Bip (HTML) | `eleves/{uid}/jeux/maison-bip` |
| Mission Kami (CSS) | `eleves/{uid}/jeux/mission-kami` |
| Kami et les lucioles (Flexbox) | `eleves/{uid}/jeux/kami-lucioles` |
| Le potager de Kami (Grid) | `eleves/{uid}/jeux/kami-potager` |
| Kami s’adapte (Responsive) | `eleves/{uid}/jeux/kami-ecrans` |

L’**Espace formateur** (bouton en bas de page) est celui de Mission Bip : `https://diurndesign.github.io/javascript_game/admin.html`.

## La série

| Jeu | Langage | Mascotte |
|---|---|---|
| [La maison de Bip](https://diurndesign.github.io/Html_game/) | HTML | la maison de Bip, à construire |
| [Mission Kami](https://diurndesign.github.io/Css_game/) | CSS | Kami, le caméléon |
| [Kami et les lucioles](https://diurndesign.github.io/Flexbox-game/) | CSS Flexbox | Kami |
| [Le potager de Kami](https://diurndesign.github.io/Grid-game/) | CSS Grid | Kami |
| [Kami s’adapte](https://diurndesign.github.io/responsive-game/) | Responsive | Kami |
| [Mission Bip](https://diurndesign.github.io/javascript_game/) | JavaScript | Bip, le robot |

---

Créé par Diurn Studio.
