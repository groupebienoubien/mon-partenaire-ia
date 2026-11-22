/* Contenus de la vitrine : personas, catégories et cas d'usage scénarisés.
   Les scénarios et chiffres sont illustratifs. */

window.MPIA_DATA = {
  personas: {
    julien: {
      name: "Julien",
      role: "Artisan peintre",
      place: "Nantes",
      company: "Martin Peinture",
      team: "Julien + 2 compagnons",
      initials: "JM",
      color: "#C65D3B",
      quote: "Je perds un temps fou sur les devis, et je relance quand j’y pense."
    },
    sophie: {
      name: "Sophie",
      role: "Restauratrice",
      place: "Lyon",
      company: "Le Petit Comptoir",
      team: "Sophie + 5 salariés",
      initials: "SB",
      color: "#D8962B",
      quote: "Entre le service, les fournisseurs et Instagram, je n’ai plus de soirées."
    },
    claire: {
      name: "Claire",
      role: "Consultante indépendante",
      place: "Bordeaux",
      company: "Claire Lefèvre Conseil",
      team: "Seule à bord",
      initials: "CL",
      color: "#5E8A68",
      quote: "Je passe plus de temps à écrire sur mes missions qu’à les faire."
    }
  },

  categories: {
    commercial: { label: "Commercial", icon: "handshake" },
    communication: { label: "Communication", icon: "megaphone" },
    administratif: { label: "Administratif", icon: "folder" },
    organisation: { label: "Organisation", icon: "calendar" },
    gestion: { label: "Gestion", icon: "chart" }
  },

  useCases: [
    {
      id: "relances-devis",
      cat: "commercial",
      persona: "julien",
      title: "Ne plus oublier de relancer vos devis",
      hook: "Des devis partent, certains restent sans réponse… et vous relancez quand vous y pensez.",
      how: [
        "Repère dans vos emails envoyés les devis restés sans réponse",
        "Prépare une relance personnalisée pour chacun, avec votre ton",
        "Vous les présente en une fois, sur votre téléphone",
        "Envoie depuis votre propre adresse, une fois validé",
        "Suit les réponses et vous signale les devis acceptés"
      ],
      control: [
        "Rien ne part sans votre accord",
        "Vous choisissez le délai et le ton des relances",
        "Vous excluez un client en un geste"
      ],
      benefit: "Plus aucun devis oublié, et des devis « endormis » qui se réveillent.",
      needs: ["Accès à votre messagerie (Gmail ou Outlook)", "Deux minutes pour valider le premier lot"],
      start: "accord",
      scenario: [
        { t: "event", icon: "clock", text: "Lundi, 7 h 42" },
        { t: "partner", text: "Bonjour Julien ☀️ 4 devis envoyés il y a plus de 10 jours n’ont pas eu de réponse. J’ai préparé les relances." },
        {
          t: "card",
          title: "Relance · Mme Durand",
          meta: "Salon + couloir · 2 480 € · envoyé il y a 12 jours",
          body: "Bonjour Madame Durand, je reviens vers vous au sujet du devis pour votre salon et votre couloir. Avez-vous pu le consulter ? Je peux passer revoir les teintes avec vous si besoin. Bien cordialement, Julien Martin",
          actions: ["Modifier", "Valider"],
          validated: "Validé"
        },
        { t: "user", text: "Ok pour les 4 👍" },
        { t: "partner", text: "C’est parti, envoyées depuis votre adresse. Je vous préviens dès qu’il y a une réponse." },
        { t: "event", icon: "clock", text: "Jeudi, 18 h 10" },
        { t: "done", text: "Mme Durand a répondu : « Bon pour accord, on cale une date ? ». J’ai noté le devis comme accepté." }
      ]
    },
    {
      id: "demandes-clients",
      cat: "commercial",
      persona: "julien",
      title: "Répondre vite à chaque demande de devis",
      hook: "Les demandes arrivent par email, formulaire ou message… et attendent que vous ayez cinq minutes.",
      how: [
        "Lit la demande et en extrait l’essentiel : travaux, surfaces, délais",
        "Repère ce qui manque pour pouvoir chiffrer",
        "Prépare une réponse avec les bonnes questions",
        "Propose un créneau de visite d’après votre agenda"
      ],
      control: ["Vous validez chaque réponse", "Le chiffrage reste votre décision"],
      benefit: "Des clients qui ont une réponse le jour même, pas quand vous rentrez du chantier.",
      needs: ["Votre messagerie", "Votre agenda (Google ou Outlook)"],
      start: "accord",
      scenario: [
        { t: "event", icon: "mail", text: "Nouvelle demande via votre site · 14 h 05" },
        { t: "partner", text: "Nouvelle demande de M. Leroy : rafraîchir 3 chambres à Rezé, avant fin mars. Il manque les surfaces et l’état des murs." },
        {
          t: "card",
          title: "Réponse proposée · M. Leroy",
          meta: "Visite proposée : mardi 9 h ou jeudi 17 h",
          body: "Bonjour Monsieur Leroy, merci pour votre demande. Pour vous faire un devis précis, je peux passer voir les chambres mardi à 9 h ou jeudi à 17 h. Pourriez-vous m’envoyer quelques photos des murs d’ici là ? Julien Martin",
          actions: ["Modifier", "Valider"]
        },
        { t: "user", text: "Mets plutôt jeudi 18 h" },
        { t: "partner", text: "C’est corrigé et envoyé. J’ai bloqué jeudi 18 h dans votre agenda, en provisoire." },
        { t: "done", text: "M. Leroy a confirmé jeudi 18 h et envoyé 4 photos. Je les ai rangées dans son dossier." }
      ]
    },
    {
      id: "propositions",
      cat: "commercial",
      persona: "claire",
      title: "Transformer un rendez-vous en proposition commerciale",
      hook: "Après un bon premier échange, il faut encore rédiger la proposition… et elle traîne trois jours.",
      how: [
        "Part de votre note vocale ou de vos notes de rendez-vous",
        "S’appuie sur vos propositions passées comme modèles",
        "Rédige une première version structurée, dans votre style",
        "Laisse les honoraires à compléter par vous"
      ],
      control: ["Les prix et engagements restent toujours votre décision", "Vous relisez et ajustez avant tout envoi"],
      benefit: "Une proposition prête à relire le jour même du rendez-vous.",
      needs: ["Quelques propositions passées (PDF ou Word)", "Une note vocale ou vos notes de rendez-vous"],
      start: "propose",
      scenario: [
        { t: "event", icon: "mic", text: "Note vocale de Claire · 2 min 14" },
        { t: "user", text: "Rendez-vous avec la directrice d’une PME de 40 personnes. Elle veut revoir l’accueil des nouveaux salariés. 3 ateliers, démarrage en avril." },
        { t: "partner", text: "Compris. Je prépare une proposition sur le modèle de celle envoyée à Atelier Bois & Co, c’est la plus proche." },
        {
          t: "card",
          title: "Proposition · Accueil des nouveaux salariés",
          meta: "4 pages · inspirée de 3 propositions passées",
          body: "1. Contexte et enjeux · 2. Démarche en 3 ateliers · 3. Calendrier avril–mai · 4. Honoraires : à compléter par vous",
          actions: ["Ouvrir", "Compléter les honoraires"]
        },
        { t: "partner", text: "J’ai laissé les honoraires vides : c’est vous qui fixez le prix." },
        { t: "done", text: "Proposition envoyée le soir même du rendez-vous." }
      ]
    },
    {
      id: "avis-clients",
      cat: "communication",
      persona: "sophie",
      title: "Répondre à tous vos avis clients",
      hook: "Les avis s’accumulent sur Google. Vous savez qu’il faudrait répondre… mais quand ?",
      how: [
        "Repère les nouveaux avis chaque matin",
        "Prépare une réponse dans votre ton, qui reprend ce que le client a aimé",
        "Traite avec tact les avis négatifs et vous les montre en premier"
      ],
      control: ["Chaque réponse publique passe par vous", "Les avis sensibles vous sont toujours signalés"],
      benefit: "Une fiche Google vivante, qui montre que vous êtes à l’écoute.",
      needs: ["Accès à votre fiche Google"],
      start: "accord",
      scenario: [
        { t: "event", icon: "star", text: "3 nouveaux avis ce week-end" },
        { t: "partner", text: "Bonjour Sophie ! 2 avis à 5 étoiles et 1 avis à 2 étoiles sur l’attente de samedi soir. Les 3 réponses sont prêtes, la plus délicate en premier." },
        {
          t: "card",
          title: "Réponse · avis 2★ de Marc D.",
          meta: "« Très bon, mais 40 min d’attente pour le plat »",
          body: "Bonjour Marc, merci pour votre retour et désolée pour cette attente samedi : nous étions complets et la cuisine a pris du retard. Ravie que le plat vous ait plu malgré tout. On espère vous revoir un soir plus calme ! Sophie",
          actions: ["Modifier", "Publier"],
          validated: "Publié"
        },
        { t: "user", text: "Parfait, publie les trois" },
        { t: "done", text: "3 réponses publiées. Plus aucun avis en attente." }
      ]
    },
    {
      id: "publications",
      cat: "communication",
      persona: "sophie",
      title: "Publier régulièrement sans y passer vos soirées",
      hook: "Instagram, c’est important pour le restaurant… mais c’est toujours la dernière chose de la journée.",
      how: [
        "Part d’une simple photo prise en cuisine",
        "Rédige la publication avec vos mots",
        "Propose le meilleur moment pour publier",
        "Prépare un petit planning pour la semaine"
      ],
      control: ["Rien n’est publié sans votre feu vert", "Vous gardez votre style et votre voix"],
      benefit: "Une présence régulière, en quelques secondes par jour.",
      needs: ["Votre compte Instagram professionnel", "Une photo, c’est tout"],
      start: "accord",
      scenario: [
        { t: "event", icon: "camera", text: "Sophie a envoyé une photo · 10 h 52" },
        { t: "user", text: "Plat du jour !" },
        { t: "partner", text: "Superbe 😍 Je prépare la publication pour 11 h 30, juste avant le service." },
        {
          t: "card",
          title: "Publication Instagram · 11 h 30",
          meta: "Photo + texte + hashtags locaux",
          body: "Aujourd’hui au Petit Comptoir : blanquette de veau à l’ancienne, comme à la maison 🥄 Servie jusqu’à épuisement ! #lyon #bouchonlyonnais #platdujour",
          actions: ["Modifier", "Programmer"]
        },
        { t: "user", text: "Oui, mais c’est du veau de chez Morel, mets-le !" },
        { t: "partner", text: "Ajouté ! Et je retiens : citer nos producteurs quand c’est possible." },
        { t: "done", text: "Publié à 11 h 30. Je vous proposerai les publications de la semaine lundi matin." }
      ]
    },
    {
      id: "visibilite-linkedin",
      cat: "communication",
      persona: "claire",
      title: "Rester visible sans y passer vos week-ends",
      hook: "Vos clients viennent du bouche-à-oreille et de LinkedIn… où vous n’avez rien publié depuis trois mois.",
      how: [
        "Repère dans vos missions des sujets intéressants à partager",
        "Anonymise systématiquement vos clients",
        "Rédige des posts courts, dans votre style",
        "Vous en propose un par semaine"
      ],
      control: ["Rien n’est publié sans vous", "Aucune information client n’est utilisée sans votre accord"],
      benefit: "Une visibilité régulière qui entretient votre réseau.",
      needs: ["Quelques exemples de vos anciens posts"],
      start: "propose",
      scenario: [
        { t: "event", icon: "clock", text: "Vendredi, 9 h" },
        { t: "partner", text: "Bonjour Claire, cette semaine vous avez animé deux ateliers sur l’accueil des nouveaux salariés. Ça ferait un bon sujet de post. Je vous propose un brouillon ?" },
        { t: "user", text: "Vas-y, mais sans nommer le client" },
        {
          t: "card",
          title: "Post LinkedIn · brouillon",
          meta: "≈ 120 mots · client anonymisé",
          body: "Le premier jour d’un salarié dit tout de l’entreprise. Cette semaine, avec une PME industrielle, on a remplacé le classique « voici ton bureau » par… 3 enseignements 👇",
          actions: ["Modifier", "Publier lundi 8 h"],
          validated: "Programmé"
        },
        { t: "done", text: "Programmé pour lundi 8 h. Je retiens : jamais de nom de client dans les posts." }
      ]
    },
    {
      id: "factures",
      cat: "administratif",
      persona: "sophie",
      title: "Trier factures et justificatifs sans y penser",
      hook: "Les factures fournisseurs arrivent par email, sur papier, en photo… et votre comptable les réclame en fin de mois.",
      how: [
        "Repère les factures dans vos emails et vos photos",
        "Les range dans le bon dossier, par mois et par fournisseur",
        "Note montants et dates dans un tableau pour votre comptable",
        "Vous signale ce qui manque"
      ],
      control: ["Au début, vous vérifiez son classement", "Ensuite, il peut le faire seul et vous rendre compte"],
      benefit: "Un dossier prêt pour le comptable, sans course aux justificatifs.",
      needs: ["Votre messagerie", "Un dossier partagé (Google Drive ou OneDrive)"],
      start: "autonome",
      scenario: [
        { t: "event", icon: "camera", text: "Photo d’un ticket Metro · 16 h 20" },
        { t: "partner", text: "Facture Metro du 14/03 · 312,40 € TTC. Rangée dans « Achats / Mars ». J’ai aussi trouvé 6 factures fournisseurs dans vos emails cette semaine." },
        {
          t: "card",
          title: "Classement de la semaine",
          meta: "7 factures · 2 148,90 € TTC",
          body: "Metro · Boucherie Morel · Crèmerie Durieux · EDF · … Tout est rangé et noté dans le tableau de votre comptable.",
          actions: ["Voir le détail", "OK"]
        },
        { t: "partner", text: "Depuis un mois, vous n’avez corrigé aucun de mes classements. Voulez-vous que je m’en occupe seul et vous fasse un résumé chaque vendredi ?" },
        { t: "user", text: "Oui, vas-y" },
        { t: "done", text: "Classement des factures : vous m’avez confié la tâche. Vous pouvez revenir en arrière à tout moment." }
      ]
    },
    {
      id: "retrouver-info",
      cat: "organisation",
      persona: "julien",
      title: "Retrouver une information en 10 secondes",
      hook: "« Quelle teinte on avait mise chez Mme Robin ? » La réponse est quelque part : un email, un carnet, une photo…",
      how: [
        "Rassemble vos devis, emails, photos et notes de chantier",
        "Répond à vos questions posées naturellement, même à la voix",
        "Cite toujours d’où vient l’information"
      ],
      control: ["Il n’accède qu’aux sources que vous avez autorisées", "Il vous dit quand il ne sait pas"],
      benefit: "Fini la recherche fébrile dans le téléphone devant le client.",
      needs: ["Votre messagerie et/ou vos dossiers", "Vos notes vocales de chantier, si vous le souhaitez"],
      start: "autonome",
      scenario: [
        { t: "user", text: "🎙️ C’était quoi la teinte du séjour chez Mme Robin, l’an dernier ?" },
        { t: "partner", text: "Blanc cassé « Lin 07 », finition velours. Posé en mai dernier." },
        {
          t: "card",
          title: "D’où je le sais",
          meta: "2 sources",
          body: "Devis n° 2025-041 du 12 avril · Votre note vocale du 3 mai : « Robin, séjour, Lin 07 velours, 2 couches »",
          actions: ["Voir le devis"]
        },
        { t: "user", text: "Elle veut la même dans la chambre" },
        { t: "partner", text: "Je prépare le devis sur la base du précédent ? Il me faudra juste la surface de la chambre." },
        { t: "done", text: "Réponse trouvée en quelques secondes, devant la cliente." }
      ]
    },
    {
      id: "comptes-rendus",
      cat: "organisation",
      persona: "claire",
      title: "Des comptes rendus sans effort",
      hook: "Après chaque rendez-vous, il faudrait envoyer un compte rendu. Souvent, il n’est jamais écrit.",
      how: [
        "Part de votre note vocale dictée en sortant",
        "Structure le compte rendu : décisions, actions, échéances",
        "Prépare l’email pour votre client",
        "Ajoute les échéances à votre agenda"
      ],
      control: ["Vous relisez avant envoi", "Rien n’est partagé sans votre accord"],
      benefit: "Des clients qui reçoivent un compte rendu clair le jour même.",
      needs: ["Votre messagerie et votre agenda"],
      start: "accord",
      scenario: [
        { t: "event", icon: "mic", text: "Note vocale · 3 min 40 · en sortant de chez Nova Industrie" },
        { t: "partner", text: "Le compte rendu est prêt : 3 décisions, 4 actions, prochain point le 12 avril." },
        {
          t: "card",
          title: "Compte rendu · Nova Industrie",
          meta: "Email prêt pour Mme Garnier",
          body: "Décisions : atelier 1 le 4 avril. Actions : Mme Garnier envoie la liste des managers (vendredi) · Claire prépare le questionnaire (lundi) · …",
          actions: ["Modifier", "Envoyer"],
          validated: "Envoyé"
        },
        { t: "user", text: "Envoie" },
        { t: "done", text: "Envoyé à Mme Garnier. Les échéances sont dans votre agenda, avec un rappel la veille." }
      ]
    },
    {
      id: "semaine",
      cat: "organisation",
      persona: "julien",
      title: "Commencer la semaine avec les idées claires",
      hook: "Chantiers, rendez-vous, devis, fournisseurs : tout est dans votre tête… jusqu’à l’oubli.",
      how: [
        "Rassemble agenda, devis en attente et demandes en cours",
        "Vous envoie un point clair chaque lundi matin",
        "Signale ce qui risque de déraper"
      ],
      control: ["Il prépare, vous décidez des priorités"],
      benefit: "Moins d’oublis, et des semaines qui démarrent sereinement.",
      needs: ["Votre agenda", "Votre messagerie"],
      start: "autonome",
      scenario: [
        { t: "event", icon: "clock", text: "Lundi, 6 h 30" },
        { t: "partner", text: "Bonjour Julien, voici votre semaine en 30 secondes 👇" },
        {
          t: "card",
          title: "Votre semaine",
          meta: "",
          body: "🏠 2 chantiers : Durand (mardi → jeudi), Leroy (vendredi) · 📅 1 visite jeudi 18 h · 📄 3 devis à relancer · ⚠️ Peinture du chantier Leroy pas encore commandée",
          actions: ["Préparer la commande", "Détail"]
        },
        { t: "user", text: "Ah oui, la commande ! Prépare-la" },
        { t: "partner", text: "Commande préparée chez votre fournisseur habituel, comme pour le chantier Durand. Je vous la montre avant envoi." },
        { t: "done", text: "Commande validée lundi matin : livrée avant le chantier." }
      ]
    },
    {
      id: "marges",
      cat: "gestion",
      persona: "sophie",
      title: "Voir venir les hausses de prix fournisseurs",
      hook: "Le beurre augmente, la viande aussi… mais les prix de votre carte n’ont pas bougé depuis un an.",
      how: [
        "Lit vos factures fournisseurs au fil de l’eau",
        "Repère les hausses importantes",
        "Estime l’impact sur le coût de vos plats",
        "Vous propose des pistes : ajuster un prix, comparer un fournisseur, revoir une recette"
      ],
      control: ["Il alerte et propose, vous décidez", "Aucun changement de prix sans vous"],
      benefit: "Des marges sous contrôle, sans tableur.",
      needs: ["Vos factures fournisseurs", "Votre carte et vos prix"],
      start: "propose",
      scenario: [
        { t: "event", icon: "chart", text: "Point du mois · 1er avril" },
        { t: "partner", text: "Sophie, le beurre a augmenté de 18 % en trois mois chez la Crèmerie Durieux. Ça touche 4 plats de votre carte." },
        {
          t: "card",
          title: "Impact estimé",
          meta: "D’après vos factures de janvier à mars",
          body: "Tarte Tatin : coût matière 2,10 € → 2,45 € · Quenelles sauce Nantua : 3,80 € → 4,05 € · …",
          actions: ["Voir les pistes", "Plus tard"]
        },
        { t: "user", text: "Quelles pistes ?" },
        { t: "partner", text: "Passer la Tatin de 8 € à 8,50 €, ou demander un prix à la Crèmerie Bertin, moins chère d’après vos achats de l’an dernier. Je prépare la demande ?" },
        { t: "done", text: "Demande de prix envoyée à la Crèmerie Bertin, après votre accord." }
      ]
    },
    {
      id: "point-mensuel",
      cat: "gestion",
      persona: "claire",
      title: "Savoir où vous en êtes, sans tableur",
      hook: "Combien avez-vous facturé ce trimestre ? Qui ne vous a pas encore payée ? Il faut ouvrir trois outils pour le savoir.",
      how: [
        "Rassemble vos factures émises et vos encaissements",
        "Vous fait un point simple chaque mois",
        "Repère les factures en retard",
        "Prépare des relances courtoises"
      ],
      control: ["Les relances de paiement passent toujours par vous", "Il ne touche jamais à votre banque"],
      benefit: "Une vision claire de votre activité, et moins d’impayés oubliés.",
      needs: ["Votre outil de facturation, ou vos factures en PDF"],
      start: "propose",
      scenario: [
        { t: "event", icon: "chart", text: "Point du mois · 1er avril" },
        { t: "partner", text: "Bonjour Claire, voici votre mois de mars." },
        {
          t: "card",
          title: "Mars en un coup d’œil",
          meta: "",
          body: "Facturé : 8 400 € · Encaissé : 6 100 € · En retard : 1 facture de 2 300 € (Atelier Bois & Co, échue depuis 18 jours) · Objectif du trimestre : 82 % atteint",
          actions: ["Préparer une relance", "Détail"]
        },
        { t: "user", text: "Prépare une relance gentille, c’est un bon client" },
        { t: "partner", text: "Voilà : un ton cordial, avec la facture en pièce jointe. Je l’envoie ?" },
        { t: "done", text: "Relance envoyée après votre accord. Atelier Bois & Co a réglé trois jours plus tard." }
      ]
    }
  ],

  autonomyLevels: [
    { id: "propose", label: "Je propose", desc: "Il vous suggère, vous faites." },
    { id: "accord", label: "Après votre accord", desc: "Il prépare tout, rien ne part sans votre validation." },
    { id: "autonome", label: "Je m’en occupe", desc: "Il agit seul et vous rend compte." }
  ],

  autonomyActivities: [
    { label: "Relancer un devis", level: "accord" },
    { label: "Classer les factures", level: "autonome" },
    { label: "Répondre à un avis Google", level: "accord" },
    { label: "Publier sur Instagram", level: "propose" },
    { label: "Fixer un prix, envoyer un devis chiffré", level: "propose", locked: true }
  ],

  /* Section « Il apprend à vous connaître » : la fiche se remplit au fil du scénario.
     mem : { op: "set", key, value, src } ajoute ou met à jour une ligne ; { op: "rule", text } ajoute une règle. */
  sources: {
    site: { label: "Déduit de votre site", cls: "src-site" },
    registre: { label: "Registre public", cls: "src-public" },
    avis: { label: "Déduit de vos avis", cls: "src-avis" },
    ok: { label: "Confirmé par vous", cls: "src-ok" },
    mail: { label: "Observé dans vos emails", cls: "src-mail" },
    learn: { label: "Appris de vos corrections", cls: "src-learn" }
  },

  learning: {
    discovery: {
      persona: "julien",
      company: "Martin Peinture",
      initial: { rows: [], rules: [] },
      steps: [
        { t: "event", icon: "clock", text: "Inscription · 2 minutes" },
        { t: "user", text: "Martin Peinture, à Nantes. Mon site : martin-peinture.fr" },
        { t: "partner", text: "Merci Julien ! Je regarde ce qui est public sur votre entreprise. Ça prend quelques secondes." },
        {
          t: "scan",
          title: "Je découvre votre entreprise…",
          items: [
            "Registre des entreprises : peintre, créée en 2014, 3 personnes",
            "Votre site : peinture intérieure, ravalement, papier peint",
            "Votre fiche Google : 4,8★ sur 47 avis",
            "Vos avis : « propre », « ponctuel », « de bons conseils »"
          ],
          mem: [
            { op: "set", key: "Activité", value: "Peinture intérieure, ravalement, papier peint", src: "site" },
            { op: "set", key: "Taille", value: "3 personnes, depuis 2014", src: "registre" },
            { op: "set", key: "Réputation", value: "4,8★ (47 avis) · « propre, ponctuel »", src: "avis" },
            { op: "set", key: "Clients", value: "Surtout des particuliers", src: "avis" },
            { op: "set", key: "Zone", value: "Nantes, environ 20 km", src: "avis" }
          ]
        },
        { t: "partner", text: "Voilà ce que j’ai compris. Deux questions pour ne pas me tromper." },
        {
          t: "card",
          title: "Ce que j’ai déduit, à vérifier",
          meta: "D’après vos avis clients",
          body: "Vous travaillez surtout pour des particuliers, dans un rayon d’environ 20 km autour de Nantes ?",
          actions: ["Pas tout à fait", "Oui"]
        },
        {
          t: "user",
          text: "Oui, mais aussi quelques syndics, pour les parties communes",
          mem: [
            { op: "set", key: "Clients", value: "Particuliers + quelques syndics (parties communes)", src: "ok" },
            { op: "set", key: "Zone", value: "Nantes et 20 km autour", src: "ok" }
          ]
        },
        { t: "partner", text: "Noté, je n’avais pas vu les syndics sur votre site. Dernière question : comment faites-vous vos devis aujourd’hui ?" },
        {
          t: "user",
          text: "Sur mon logiciel, et je les envoie par mail en PDF",
          mem: [{ op: "set", key: "Devis", value: "Logiciel de devis, envoi en PDF par email", src: "ok" }]
        },
        { t: "partner", text: "Parfait. Si vous connectez votre messagerie, je pourrai repérer les devis restés sans réponse. C’est souvent là qu’on gagne le plus vite." },
        { t: "done", text: "Fiche créée en 3 minutes. Le reste, je l’apprendrai en travaillant avec vous." }
      ]
    },

    correction: {
      persona: "julien",
      company: "Martin Peinture",
      initial: {
        rows: [
          { key: "Activité", value: "Peinture intérieure, ravalement, papier peint", src: "site" },
          { key: "Taille", value: "3 personnes, depuis 2014", src: "registre" },
          { key: "Clients", value: "Particuliers + quelques syndics (parties communes)", src: "ok" },
          { key: "Zone", value: "Nantes et 20 km autour", src: "ok" },
          { key: "Devis", value: "Logiciel de devis, envoi en PDF par email", src: "ok" },
          { key: "Votre ton", value: "Vouvoiement, chaleureux, signé « Julien Martin »", src: "learn" }
        ],
        rules: ["Relancer un devis après 10 jours sans réponse"]
      },
      steps: [
        { t: "event", icon: "clock", text: "Mardi 12 mars · 7 h 40" },
        { t: "partner", text: "Bonjour Julien, 3 relances de devis sont prêtes. La première :" },
        {
          t: "card",
          title: "Relance · M. Garcia, syndic",
          meta: "Objet : Votre devis",
          body: "Bonjour Monsieur Garcia, je reviens vers vous au sujet du devis pour les parties communes de la résidence. Avez-vous pu le soumettre au conseil syndical ? Bien cordialement, Julien Martin",
          actions: ["Modifier", "Valider"]
        },
        { t: "user", text: "Avec les syndics, mets toujours le n° de devis et la résidence dans l’objet, sinon ils ne s’y retrouvent pas." },
        { t: "edit", before: "Objet : Votre devis", after: "Objet : Devis n° 2026-118 · Résidence Les Iris" },
        { t: "partner", text: "C’est corrigé. Je retiens cette règle pour toutes vos relances aux syndics ?" },
        { t: "user", text: "Oui" },
        {
          t: "rule",
          text: "Syndics : toujours indiquer le n° de devis et la résidence dans l’objet",
          mem: [{ op: "rule", text: "Syndics : n° de devis et résidence dans l’objet" }]
        },
        { t: "event", icon: "clock", text: "Deux semaines plus tard · Lundi 25 mars" },
        { t: "partner", text: "Une nouvelle relance est prête :" },
        {
          t: "card",
          title: "Relance · Mme Petit, syndic",
          meta: "Objet : Devis n° 2026-131 · Résidence Le Parc",
          applied: "Votre règle du 12 mars, appliquée",
          body: "Bonjour Madame Petit, je reviens vers vous au sujet du devis pour la cage d’escalier de la résidence Le Parc. Avez-vous pu le soumettre au conseil syndical ? Bien cordialement, Julien Martin",
          actions: ["Modifier", "Valider"],
          validated: "Validé"
        },
        { t: "user", text: "Parfait, envoie 👍" },
        { t: "done", text: "Une correction, une seule fois. Ensuite il s’en souvient, et vous voyez qu’il l’applique." }
      ]
    }
  }
};
