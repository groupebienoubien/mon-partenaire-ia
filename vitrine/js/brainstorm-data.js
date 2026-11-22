/* Lot 2 · Brainstorming scénarisé « Trouvons votre premier sujet » (persona : Julien).
   Chaque nœud : say (messages du partenaire), choices (réponses à toucher) ou next (enchaînement automatique).
   Un choix peut définir set (variables), then (réponse immédiate du partenaire) et next.
   La fiche de cas d'usage est entièrement calculée à partir des variables. */

window.MPIA_BRAINSTORM = (function () {
  "use strict";

  function eur(n) { return Math.round(n).toLocaleString("fr-FR") + " €"; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function estimate(v) {
    var k = Math.max(1, Math.round(v.nb * v.share));
    return { k: k, enjeu: eur(Math.round((k * v.montant) / 500) * 500) };
  }

  function papiersTitle(v) {
    return v.papType === "impayes" ? "Relancer les factures impayées" : "Préparer les factures pour le comptable";
  }

  // Après une piste explorée : on s'assure d'avoir parlé des devis avant d'élargir.
  function afterPain(c) { return c.v.explored.devis ? "autre" : "devisCheck"; }

  function initVars() {
    return {
      profil: false, syndics: false,
      explored: { devis: false, demandes: false, papiers: false },
      compagnons: false, autreCount: 0,
      nb: 0, nbLabel: "", share: 0, unknown: false, montant: 0,
      demCanal: null, demDelai: null, papType: null,
      piste: null, envoi: null, delai: 0, exclusions: null, syndicRule: false,
      validation: false, photo: null, done: false
    };
  }

  var phases = ["Vous", "Votre quotidien", "Les pistes", "Le cadrage", "Le résultat"];

  var nodes = {
    intro: {
      phase: 0,
      say: function (c) {
        var s = [
          { t: "event", icon: "sparkle", text: "Démonstration · vous êtes Julien, artisan peintre à Nantes" },
          { t: "partner", text: "Bonjour ! Je suis votre partenaire. En quelques minutes, on va chercher ensemble par où je pourrais vous être le plus utile. Pas de questionnaire : on parle de votre quotidien." }
        ];
        if (c.liked.length) {
          s.push({ t: "partner", text: "Dans les exemples, vous avez marqué : " + c.liked.map(function (x) { return "« " + x + " »"; }).join(", ") + ". On part de là, ou on regarde plus large ?" });
        }
        return s;
      },
      choices: function (c) {
        return c.liked.length
          ? [{ label: "Partir de là", next: "entreprise" }, { label: "Regarder plus large", next: "entreprise" }]
          : [{ label: "C’est parti", next: "entreprise" }];
      }
    },

    entreprise: {
      phase: 0,
      say: [{ t: "partner", text: "Pour commencer, comment s’appelle votre entreprise ? Votre site aussi, si vous en avez un." }],
      choices: [{ label: "Martin Peinture, à Nantes · martin-peinture.fr", next: "profil" }]
    },

    profil: {
      phase: 0,
      say: [
        { t: "partner", text: "Merci ! Je regarde ce qui est public sur votre entreprise, ça prend quelques secondes." },
        {
          t: "scan",
          title: "Je découvre votre entreprise…",
          items: [
            "Registre des entreprises : peintre, créée en 2014, 3 personnes",
            "Votre site : peinture intérieure, ravalement, papier peint",
            "Votre fiche Google : 4,8★ sur 47 avis",
            "Vos avis : « propre », « ponctuel », « de bons conseils »"
          ]
        },
        {
          t: "card",
          title: "Voici ce que j’ai compris",
          meta: "D’après le registre, votre site et vos avis Google",
          body: "Peintre à Nantes depuis 2014, 3 personnes. Peinture intérieure, ravalement, papier peint. Surtout des particuliers. On vous trouve « propre » et « ponctuel ».",
          actions: []
        },
        { t: "partner", text: "C’est juste ?" }
      ],
      choices: [
        { label: "C’est ça", set: { profil: true }, next: "semaine" },
        {
          label: "Presque : j’ai aussi des syndics",
          reply: "Presque : je travaille aussi pour quelques syndics, sur les parties communes.",
          set: { profil: true, syndics: true },
          then: [{ t: "partner", text: "Merci, je n’avais pas vu les syndics. C’est noté." }],
          next: "semaine"
        }
      ]
    },

    semaine: {
      phase: 1,
      say: [
        { t: "partner", text: "Je ne vais pas vous demander vos « irritants ». Parlons plutôt de la semaine dernière." },
        { t: "partner", text: "En dehors des chantiers, qu’est-ce qui vous a pris du temps ?" }
      ],
      choices: [
        { label: "Les devis", set: function (v) { v.explored.devis = true; }, next: "devis1" },
        { label: "Répondre aux demandes", set: function (v) { v.explored.demandes = true; }, next: "dem1" },
        { label: "Les papiers, les factures", set: function (v) { v.explored.papiers = true; }, next: "pap1" }
      ]
    },

    devisCheck: {
      phase: 1,
      say: [{ t: "partner", text: "Une question sur vos devis, avant d’aller plus loin : il y en a qui restent sans réponse ?" }],
      choices: [
        { label: "Oui, pas mal", set: function (v) { v.explored.devis = true; v.share = 0.33; }, next: "devis1" },
        { label: "Je ne sais pas trop", set: function (v) { v.explored.devis = true; v.share = 0.3; v.unknown = true; }, next: "devis1" }
      ]
    },

    devis1: {
      phase: 1,
      say: [{ t: "partner", text: "Les devis, c’est souvent là que ça coince. Vous en faites combien par mois, à peu près ?" }],
      choices: [
        { label: "Moins de 10", set: { nb: 8, nbLabel: "moins de 10" }, next: function (c) { return c.v.share ? "devis3" : "devis2"; } },
        { label: "Entre 10 et 20", set: { nb: 15, nbLabel: "10 à 20" }, next: function (c) { return c.v.share ? "devis3" : "devis2"; } },
        { label: "Plus de 20", set: { nb: 25, nbLabel: "plus de 20" }, next: function (c) { return c.v.share ? "devis3" : "devis2"; } }
      ]
    },

    devis2: {
      phase: 1,
      say: [{ t: "partner", text: "Et sur ces devis, combien restent sans réponse du client ?" }],
      choices: [
        { label: "Peu", set: { share: 0.15 }, next: "devis3" },
        { label: "Pas mal, et je ne relance pas toujours", set: { share: 0.33 }, next: "devis3" },
        { label: "Je ne sais pas", set: { share: 0.3, unknown: true }, next: "devis3" }
      ]
    },

    devis3: {
      phase: 1,
      say: [{ t: "partner", text: "Un devis moyen, ça représente combien ?" }],
      choices: [
        { label: "Autour de 1 000 €", set: { montant: 1000 }, next: "devisCalc" },
        { label: "2 à 3 000 €", set: { montant: 2500 }, next: "devisCalc" },
        { label: "Plus de 3 000 €", set: { montant: 4000 }, next: "devisCalc" }
      ]
    },

    devisCalc: {
      phase: 1,
      say: function (c) {
        var e = estimate(c.v);
        return [
          {
            t: "partner",
            text: "Si je résume : " + c.v.nbLabel + " devis par mois, dont environ " + e.k + " restent sans réponse" +
              (c.v.unknown ? " (je pars sur un tiers, c’est souvent le cas)" : "") +
              ". Cela fait de l’ordre de " + e.enjeu + " de travaux par mois qui attendent une réponse."
          },
          { t: "note", text: "Estimation à partir de vos réponses, pas une promesse. Je l’affinerai avec vos vrais devis." }
        ];
      },
      next: "autre"
    },

    dem1: {
      phase: 1,
      say: [{ t: "partner", text: "Les demandes de clients arrivent comment, surtout ?" }],
      choices: [
        { label: "Par email ou par mon site", set: { demCanal: "email" }, next: "dem2" },
        { label: "Par téléphone", set: { demCanal: "tel" }, next: "dem2" },
        { label: "Un peu de tout", set: { demCanal: "mix" }, next: "dem2" }
      ]
    },

    dem2: {
      phase: 1,
      say: [{ t: "partner", text: "Et vous répondez en général sous combien de temps ?" }],
      choices: [
        { label: "Le jour même", set: { demDelai: "jour" }, then: [{ t: "partner", text: "Bravo, c’est rare ! Ce n’est sans doute pas là que je vous serai le plus utile." }], next: afterPain },
        { label: "En 2 ou 3 jours", set: { demDelai: "jours" }, then: [{ t: "partner", text: "Noté. Une réponse rapide fait souvent la différence face à un concurrent." }], next: afterPain },
        { label: "Ça dépend, parfois une semaine", set: { demDelai: "semaine" }, then: [{ t: "partner", text: "Noté. Une réponse rapide fait souvent la différence face à un concurrent." }], next: afterPain }
      ]
    },

    pap1: {
      phase: 1,
      say: [{ t: "partner", text: "Quel genre de papiers, surtout ?" }],
      choices: [
        { label: "Les factures pour le comptable", set: { papType: "factures" }, then: [{ t: "partner", text: "Je vois : rassembler, trier, envoyer. Je le note." }], next: afterPain },
        { label: "Les impayés à relancer", set: { papType: "impayes" }, then: [{ t: "partner", text: "Je le note. Ça ressemble d’ailleurs aux relances de devis." }], next: afterPain }
      ]
    },

    autre: {
      phase: 1,
      say: function (c) {
        return [{ t: "partner", text: c.v.autreCount ? "Autre chose ?" : "Autre chose qui vous prend du temps ou vous agace en ce moment ?" }];
      },
      choices: function (c) {
        var v = c.v;
        var list = [];
        function bump(x) { return function (vv) { vv.autreCount++; if (x) x(vv); }; }
        if (!v.explored.demandes) list.push({ label: "Répondre aux demandes", set: bump(function (vv) { vv.explored.demandes = true; }), next: "dem1" });
        if (!v.explored.papiers) list.push({ label: "Les papiers, les factures", set: bump(function (vv) { vv.explored.papiers = true; }), next: "pap1" });
        if (!v.compagnons) {
          list.push({
            label: "Trouver des compagnons",
            set: bump(function (vv) { vv.compagnons = true; }),
            then: [{ t: "partner", text: "Je comprends, c’est un vrai sujet pour beaucoup d’artisans. Mais recruter, je ne saurai pas le faire à votre place. Je le note quand même, sans vous promettre de miracle." }],
            next: "autre"
          });
        }
        list.push({ label: "Non, c’est l’essentiel", next: "synthese" });
        return list;
      }
    },

    synthese: {
      phase: 2,
      say: function (c) {
        var v = c.v;
        var e = estimate(v);
        var items = [
          { status: "reco", title: "Relancer les devis sans réponse", why: "≈ " + e.enjeu + " par mois en attente · facile à démarrer avec vos emails", gain: 3, ease: 3, risk: 1 },
          {
            status: "ok",
            title: "Répondre plus vite aux demandes",
            why: v.explored.demandes
              ? (v.demDelai === "jour" ? "Vous répondez déjà vite : gain limité" : "Un client qui attend peut aller voir ailleurs")
              : "À creuser : on n’en a pas parlé en détail",
            gain: v.demDelai === "jour" ? 1 : 2, ease: 2, risk: 2
          }
        ];
        if (v.explored.papiers) items.push({ status: "ok", title: papiersTitle(v), why: "Utile, mais moins d’argent en jeu", gain: 1, ease: 3, risk: 1 });
        items.push({ status: "later", title: "Préparer les devis chiffrés", why: "Pas tout de suite : le chiffrage vous engage. On y viendra quand je connaîtrai vos prix." });
        if (v.compagnons) items.push({ status: "no", title: "Trouver des compagnons", why: "Pas pour moi : je ne sais pas recruter à votre place." });

        return [
          { t: "partner", text: "Merci Julien, j’y vois plus clair. Voici mes pistes, classées selon trois critères : ce que vous y gagnez, la facilité pour démarrer, et le risque." },
          { t: "pistes", items: items },
          { t: "partner", text: "Je vous recommande de commencer par les relances : c’est là que l’enjeu est le plus net, et je peux démarrer avec ce que vous avez déjà." }
        ];
      },
      choices: [
        { label: "⭐ Relancer mes devis", reco: true, set: { piste: "relances" }, next: "c1" },
        {
          label: "Répondre plus vite aux demandes",
          set: { piste: "relances" },
          then: [{ t: "partner", text: "Bon choix aussi, je le garde en piste n° 2. Pour cette démonstration, je vous montre la suite avec les relances de devis : c’est le parcours le plus complet." }],
          next: "c1"
        }
      ]
    },

    c1: {
      phase: 3,
      say: [{ t: "partner", text: "Parfait, on cadre ça ensemble. Quelques questions rapides. D’abord : d’où partent vos devis ?" }],
      choices: [
        { label: "De mon logiciel, par email", set: { envoi: "logiciel" }, next: "c2" },
        { label: "De ma messagerie (Gmail, Outlook…)", set: { envoi: "mail" }, next: "c2" },
        {
          label: "Souvent sur papier, en main propre",
          set: { envoi: "papier" },
          then: [{ t: "partner", text: "Ceux-là, je ne pourrai pas les voir tout seul : une photo suffira pour me les signaler. Ceux envoyés par email, je les repère dans vos messages envoyés." }],
          next: "c2"
        }
      ]
    },

    c2: {
      phase: 3,
      say: [{ t: "partner", text: "Au bout de combien de jours sans réponse je vous prépare une relance ?" }],
      choices: [
        { label: "7 jours", set: { delai: 7 }, next: "c3" },
        { label: "10 jours", set: { delai: 10 }, next: "c3" },
        { label: "15 jours", set: { delai: 15 }, next: "c3" }
      ]
    },

    c3: {
      phase: 3,
      say: [{ t: "partner", text: "Y a-t-il des clients que je ne dois jamais relancer ?" }],
      choices: [
        {
          label: "Oui, quelques-uns",
          set: { exclusions: true },
          then: [{ t: "partner", text: "D’accord. Vous me les indiquerez lors du premier essai, d’un geste." }],
          next: function (c) { return c.v.syndics ? "cSyndic" : "c4"; }
        },
        { label: "Non, aucun", set: { exclusions: false }, next: function (c) { return c.v.syndics ? "cSyndic" : "c4"; } }
      ]
    },

    cSyndic: {
      phase: 3,
      say: [{ t: "partner", text: "Vous m’avez parlé des syndics. Avec eux, je fais quelque chose de différent ?" }],
      choices: [
        {
          label: "Mettre le n° de devis et la résidence dans l’objet",
          reply: "Oui : mets toujours le n° de devis et la résidence dans l’objet, sinon ils ne s’y retrouvent pas.",
          set: { syndicRule: true },
          then: [{ t: "partner", text: "C’est noté, je l’appliquerai à chaque relance de syndic." }],
          next: "c4"
        },
        { label: "Non, pareil", next: "c4" }
      ]
    },

    c4: {
      phase: 3,
      say: [{ t: "partner", text: "Au début, je vous soumets chaque relance avant de l’envoyer. Vous pourrez me laisser faire seul plus tard, si vous le souhaitez. Ça vous va ?" }],
      choices: [
        { label: "Oui, je valide tout", set: { validation: true }, next: "c5" },
        { label: "Oui, et on en reparle dans un mois", set: { validation: true }, next: "c5" }
      ]
    },

    c5: {
      phase: 3,
      say: [{ t: "partner", text: "Dernière chose : pouvez-vous me montrer un devis récent ? Une photo suffit. Ça m’aide à reprendre vos mots et votre façon de présenter." }],
      choices: [
        {
          label: "📷 Prendre une photo (simulé)",
          reply: null,
          set: { photo: true },
          then: function (c) {
            return [
              { t: "photo" },
              { t: "partner", text: "Merci ! Devis n° 2026-104 pour Mme Durand : salon et couloir, 2 480 €, envoyé il y a " + (c.v.delai + 2) + " jours. Toujours sans réponse." }
            ];
          },
          next: "resultat"
        },
        { label: "Plus tard", set: { photo: false }, then: [{ t: "partner", text: "Pas de souci, je prends un exemple pour vous montrer." }], next: "resultat" }
      ]
    },

    resultat: {
      phase: 4,
      set: { done: true },
      say: function (c) {
        var v = c.v;
        return [
          { t: "partner", text: "Voici ce que je vous préparerais dès lundi matin :" },
          {
            t: "card",
            title: "Relance · Mme Durand",
            meta: "Salon + couloir · 2 480 € · envoyé il y a " + (v.delai + 2) + " jours" + (v.photo ? "" : " · exemple"),
            body: "Bonjour Madame Durand, je reviens vers vous au sujet du devis pour votre salon et votre couloir. Avez-vous pu le consulter ? Je peux passer revoir les teintes avec vous si besoin. Bien cordialement, Julien Martin",
            actions: ["Modifier", "Ça me va"]
          },
          { t: "partner", text: "Et votre fiche est prête : elle reprend tout ce qu’on s’est dit. C’est elle que j’appliquerai." },
          { t: "ficheLink" },
          { t: "next", title: "Un essai sur vos 3 derniers devis sans réponse", text: "Il me faut juste l’accès à votre messagerie : 2 minutes. Rien ne part sans votre accord." }
        ];
      },
      choices: [
        {
          label: "Lancer l’essai",
          reco: true,
          then: [{ t: "done", text: "Fin de la démonstration. Dans le vrai produit, vous connecteriez ici votre messagerie, et je préparerais vos 3 premières relances." }],
          next: "feedback"
        },
        {
          label: "Recevoir ma fiche par email",
          then: [{ t: "done", text: "C’est noté. (Maquette : aucun email n’est envoyé.)" }],
          next: "feedback"
        }
      ]
    },

    feedback: {
      phase: 4,
      say: [{ t: "feedback" }],
      choices: [{ label: "↺ Recommencer la démonstration", next: "__restart" }]
    }
  };

  /* Fiche de cas d'usage : chaque rubrique est calculée à partir des variables (null = pas encore définie). */
  var fiche = [
    {
      key: "entreprise", label: "Votre entreprise", core: true,
      value: function (v) { return v.profil ? "Peintre à Nantes · 3 personnes · " + (v.syndics ? "particuliers et quelques syndics" : "surtout des particuliers") : null; }
    },
    {
      key: "sujet", label: "Votre sujet", core: true, title: true,
      value: function (v) { return v.piste ? "Ne plus laisser dormir mes devis" : null; }
    },
    {
      key: "aujourdhui", label: "Aujourd’hui", core: true,
      value: function (v) {
        if (!v.nb) return null;
        var envoi = { logiciel: ", envoyés en PDF depuis votre logiciel", mail: ", envoyés depuis votre messagerie", papier: ", souvent remis sur papier" }[v.envoi] || "";
        return cap(v.nbLabel) + " devis par mois" + envoi + ". Relances quand vous y pensez.";
      }
    },
    {
      key: "enjeu", label: "Ce qui est en jeu", core: true,
      value: function (v) {
        if (!v.nb || !v.montant) return null;
        var e = estimate(v);
        return "Environ " + e.k + " devis par mois sans réponse, soit ≈ " + e.enjeu + " en attente";
      },
      tag: function () { return "Estimation"; }
    },
    {
      key: "partenaire", label: "Ce que je ferai", core: true,
      value: function (v) { return v.delai ? "Repérer les devis sans réponse après " + v.delai + " jours, préparer une relance dans votre ton, suivre les réponses" : null; }
    },
    {
      key: "controle", label: "Ce qui reste à vous", core: true,
      value: function (v) {
        if (!v.validation) return null;
        return "Vous validez chaque relance avant envoi" + (v.exclusions ? " · vous excluez les clients de votre choix" : "");
      }
    },
    {
      key: "attention", label: "Points d’attention", core: true,
      value: function (v) {
        if (!v.validation) return null;
        var l = [];
        if (v.syndicRule) l.push("Syndics : n° de devis et résidence dans l’objet");
        if (v.envoi === "papier") l.push("Devis remis sur papier : à me signaler d’une photo");
        return l.length ? l : "Rien de particulier pour l’instant";
      }
    },
    {
      key: "besoins", label: "Ce dont j’ai besoin", core: true,
      value: function (v) {
        if (!v.envoi) return null;
        var l = ["Accès à votre messagerie (lecture des emails envoyés, préparation de brouillons)"];
        if (v.photo === true) l.push("Un exemple de devis ✓");
        return l;
      }
    },
    {
      key: "indicateur", label: "Comment on saura que ça marche", core: true,
      value: function (v) { return v.done ? "Nombre de devis relancés, puis de devis acceptés après relance" : null; }
    },
    {
      key: "etape", label: "Première étape", core: true,
      value: function (v) { return v.done ? "Un essai sur vos 3 derniers devis sans réponse" : null; }
    },
    {
      key: "manque", label: "Encore à préciser", aside: "todo",
      value: function (v) {
        var l = [];
        if (v.exclusions) l.push("Les clients à ne pas relancer");
        if (v.photo === false) l.push("Un exemple de devis");
        if (v.unknown) l.push("La part réelle de devis sans réponse (je la mesurerai)");
        return l.length ? l : null;
      }
    },
    {
      key: "plusTard", label: "Pour plus tard", aside: "later",
      value: function (v) {
        if (!v.piste) return null;
        var l = ["Répondre plus vite aux demandes"];
        if (v.explored.papiers) l.push(papiersTitle(v));
        l.push("Préparer les devis chiffrés");
        return l;
      }
    }
  ];

  return { persona: "julien", start: "intro", phases: phases, nodes: nodes, fiche: fiche, initVars: initVars };
})();
