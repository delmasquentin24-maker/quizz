"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    orderBy,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* Configuration Firebase : remplacer par vos valeurs Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyBtIJMEyaxLS7wxVIqO5vgPndwRYeOjlnY",
  authDomain: "quiz-orange.firebaseapp.com",
  projectId: "quiz-orange",
  storageBucket: "quiz-orange.firebasestorage.app",
  messagingSenderId: "1050591189815",
  appId: "1:1050591189815:web:c3a004d9bea8b01300d8b2"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

/* Banque de questions */
const questionsBank = [
    {
        id: 1,
        question: "Quelle est la capitale de la France ?",
        options: ["Lyon", "Paris", "Marseille", "Lille"],
        answer: 1
    },
    {
        id: 2,
        question: "Combien y a-t-il de continents sur Terre ?",
        options: ["5", "6", "7", "8"],
        answer: 2
    },
    {
        id: 3,
        question: "Quelle planète est surnommée la planète rouge ?",
        options: ["Mars", "Jupiter", "Vénus", "Mercure"],
        answer: 0
    },
    {
        id: 4,
        question: "Quel est le plus grand océan du monde ?",
        options: ["Atlantique", "Indien", "Arctique", "Pacifique"],
        answer: 3
    },
    {
        id: 5,
        question: "Qui a écrit Les Misérables ?",
        options: ["Émile Zola", "Victor Hugo", "Molière", "Albert Camus"],
        answer: 1
    },
    {
        id: 6,
        question: "Combien de côtés possède un hexagone ?",
        options: ["5", "6", "7", "8"],
        answer: 1
    },
    {
        id: 7,
        question: "Quel animal produit la laine ?",
        options: ["La vache", "Le mouton", "Le cheval", "Le lapin"],
        answer: 1
    },
    {
        id: 8,
        question: "Quelle est la langue principalement parlée au Brésil ?",
        options: ["Espagnol", "Français", "Portugais", "Anglais"],
        answer: 2
    },
    {
        id: 9,
        question: "Quel est le symbole chimique de l'eau ?",
        options: ["O2", "CO2", "H2O", "NaCl"],
        answer: 2
    },
    {
        id: 10,
        question: "En quelle saison les feuilles tombent-elles généralement ?",
        options: ["Printemps", "Été", "Automne", "Hiver"],
        answer: 2
    },
    {
        id: 11,
        question: "Quel instrument possède habituellement 88 touches ?",
        options: ["Guitare", "Piano", "Violon", "Flûte"],
        answer: 1
    },
    {
        id: 12,
        question: "Quel pays a la forme d'une botte sur une carte ?",
        options: ["Italie", "Portugal", "Grèce", "Belgique"],
        answer: 0
    },
    {
        id: 13,
        question: "Combien de minutes y a-t-il dans une heure ?",
        options: ["30", "45", "60", "100"],
        answer: 2
    },
    {
        id: 14,
        question: "Quel est le plus grand mammifère du monde ?",
        options: ["Éléphant", "Baleine bleue", "Girafe", "Requin blanc"],
        answer: 1
    },
    {
        id: 15,
        question: "Quelle couleur obtient-on en mélangeant du bleu et du jaune ?",
        options: ["Orange", "Vert", "Violet", "Rose"],
        answer: 1
    },
    {
        id: 16,
        question: "Quel est le premier mois de l'année ?",
        options: ["Décembre", "Janvier", "Mars", "Février"],
        answer: 1
    },
    {
        id: 17,
        question: "Quel métal est principalement utilisé pour fabriquer les canettes ?",
        options: ["Or", "Aluminium", "Cuivre", "Argent"],
        answer: 1
    },
    {
        id: 18,
        question: "Quelle est la plus haute montagne du monde ?",
        options: ["Mont Blanc", "Kilimandjaro", "Everest", "Mont Fuji"],
        answer: 2
    },
    {
        id: 19,
        question: "Quel organe permet principalement de respirer ?",
        options: ["Le cœur", "Le foie", "Les poumons", "L'estomac"],
        answer: 2
    },
    {
        id: 20,
        question: "Combien de jours y a-t-il dans une semaine ?",
        options: ["5", "6", "7", "8"],
        answer: 2
    },
    {
        id: 21,
        question: "Quel est le satellite naturel de la Terre ?",
        options: ["Le Soleil", "Mars", "La Lune", "Vénus"],
        answer: 2
    },
    {
        id: 22,
        question: "Dans quel pays se trouve la ville de Tokyo ?",
        options: ["Chine", "Japon", "Corée du Sud", "Thaïlande"],
        answer: 1
    },
    {
        id: 23,
        question: "Quel est le résultat de 9 × 8 ?",
        options: ["63", "72", "81", "64"],
        answer: 1
    },
    {
        id: 24,
        question: "Quelle est la couleur du rubis ?",
        options: ["Bleu", "Vert", "Rouge", "Jaune"],
        answer: 2
    },
    {
        id: 25,
        question: "Quel écrivain a créé le personnage de Sherlock Holmes ?",
        options: ["Jules Verne", "Arthur Conan Doyle", "Agatha Christie", "Victor Hugo"],
        answer: 1
    },
    {
    id: 26,
    question: "Quelle est la capitale de l'Espagne ?",
    options: ["Barcelone", "Madrid", "Valence", "Séville"],
    answer: 1
},
{
    id: 27,
    question: "Quelle est la capitale de l'Italie ?",
    options: ["Milan", "Rome", "Naples", "Venise"],
    answer: 1
},
{
    id: 28,
    question: "Quel fleuve traverse Paris ?",
    options: ["Le Rhône", "La Loire", "La Seine", "La Garonne"],
    answer: 2
},
{
    id: 29,
    question: "Quel est le plus grand pays du monde par superficie ?",
    options: ["Le Canada", "La Chine", "Les États-Unis", "La Russie"],
    answer: 3
},
{
    id: 30,
    question: "Sur quel continent se trouve le désert du Sahara ?",
    options: ["Europe", "Afrique", "Asie", "Amérique du Sud"],
    answer: 1
},
{
    id: 31,
    question: "Quelle est la capitale du Canada ?",
    options: ["Toronto", "Vancouver", "Ottawa", "Montréal"],
    answer: 2
},
{
    id: 32,
    question: "Quel pays est surnommé le pays du Soleil-Levant ?",
    options: ["La Chine", "Le Japon", "La Corée du Sud", "La Thaïlande"],
    answer: 1
},
{
    id: 33,
    question: "Quelle mer sépare l'Europe de l'Afrique ?",
    options: ["La mer Noire", "La mer Baltique", "La mer Méditerranée", "La mer Rouge"],
    answer: 2
},
{
    id: 34,
    question: "Quelle est la capitale de l'Australie ?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    answer: 2
},
{
    id: 35,
    question: "Dans quel pays se trouvent les pyramides de Gizeh ?",
    options: ["Au Mexique", "En Égypte", "En Grèce", "En Inde"],
    answer: 1
},
{
    id: 36,
    question: "Quel est le plus long fleuve de France ?",
    options: ["La Seine", "Le Rhône", "La Loire", "La Garonne"],
    answer: 2
},
{
    id: 37,
    question: "Quelle est la capitale du Portugal ?",
    options: ["Porto", "Lisbonne", "Faro", "Coimbra"],
    answer: 1
},
{
    id: 38,
    question: "Quel pays est connu pour ses fjords ?",
    options: ["La Norvège", "L'Italie", "Le Maroc", "La Hongrie"],
    answer: 0
},
{
    id: 39,
    question: "Quelle est la capitale de la Belgique ?",
    options: ["Anvers", "Liège", "Bruxelles", "Gand"],
    answer: 2
},
{
    id: 40,
    question: "Quel océan borde la côte ouest de l'Amérique ?",
    options: ["Atlantique", "Pacifique", "Indien", "Arctique"],
    answer: 1
},
{
    id: 41,
    question: "Quelle monnaie est utilisée au Japon ?",
    options: ["Le yuan", "Le won", "Le yen", "Le dollar"],
    answer: 2
},
{
    id: 42,
    question: "Quel pays a pour capitale Athènes ?",
    options: ["La Grèce", "La Turquie", "Chypre", "La Bulgarie"],
    answer: 0
},
{
    id: 43,
    question: "Quelle est la capitale de l'Allemagne ?",
    options: ["Munich", "Francfort", "Berlin", "Hambourg"],
    answer: 2
},
{
    id: 44,
    question: "Quel volcan italien est situé près de Naples ?",
    options: ["L'Etna", "Le Vésuve", "Le Stromboli", "Le Piton de la Fournaise"],
    answer: 1
},
{
    id: 45,
    question: "Dans quel pays se situe la ville de Marrakech ?",
    options: ["En Algérie", "En Tunisie", "Au Maroc", "En Égypte"],
    answer: 2
},
{
    id: 46,
    question: "Qui fut le premier président de la Ve République française ?",
    options: ["Georges Pompidou", "Charles de Gaulle", "François Mitterrand", "Valéry Giscard d'Estaing"],
    answer: 1
},
{
    id: 47,
    question: "En quelle année a débuté la Révolution française ?",
    options: ["1789", "1815", "1914", "1945"],
    answer: 0
},
{
    id: 48,
    question: "Quel monument parisien a été construit pour l'Exposition universelle de 1889 ?",
    options: ["L'Arc de Triomphe", "La tour Eiffel", "Notre-Dame", "Le Sacré-Cœur"],
    answer: 1
},
{
    id: 49,
    question: "Qui a découvert l'Amérique en 1492 ?",
    options: ["Magellan", "Christophe Colomb", "Vasco de Gama", "James Cook"],
    answer: 1
},
{
    id: 50,
    question: "Quel roi français était surnommé le Roi-Soleil ?",
    options: ["Louis XIV", "Louis XVI", "François Ier", "Henri IV"],
    answer: 0
},
{
    id: 51,
    question: "Quelle ville romaine a été ensevelie par l'éruption du Vésuve en 79 ?",
    options: ["Pompéi", "Rome", "Florence", "Milan"],
    answer: 0
},
{
    id: 52,
    question: "Quel mur est tombé en 1989 ?",
    options: ["Le mur d'Hadrien", "Le mur de Berlin", "Le mur des Lamentations", "La Grande Muraille"],
    answer: 1
},
{
    id: 53,
    question: "Quelle reine d'Égypte était liée à Jules César et Marc Antoine ?",
    options: ["Néfertiti", "Cléopâtre", "Hatchepsout", "Cléopâtre II"],
    answer: 1
},
{
    id: 54,
    question: "Quel conflit a eu lieu de 1914 à 1918 ?",
    options: ["La guerre de Cent Ans", "La Première Guerre mondiale", "La Seconde Guerre mondiale", "La guerre froide"],
    answer: 1
},
{
    id: 55,
    question: "Qui a prononcé l'appel du 18 juin 1940 ?",
    options: ["Winston Churchill", "Charles de Gaulle", "Georges Clemenceau", "Jean Moulin"],
    answer: 1
},
{
    id: 56,
    question: "Quelle civilisation a construit Machu Picchu ?",
    options: ["Les Mayas", "Les Aztèques", "Les Incas", "Les Romains"],
    answer: 2
},
{
    id: 57,
    question: "Quel navigateur a réalisé le premier tour du monde, achevé par son expédition ?",
    options: ["Christophe Colomb", "Fernand de Magellan", "Jacques Cartier", "Marco Polo"],
    answer: 1
},
{
    id: 58,
    question: "Quel chef militaire français est devenu empereur en 1804 ?",
    options: ["Napoléon Bonaparte", "Louis-Philippe", "Charles X", "Jean Jaurès"],
    answer: 0
},
{
    id: 59,
    question: "Quelle bataille de 1815 marque la défaite finale de Napoléon ?",
    options: ["Austerlitz", "Marignan", "Waterloo", "Verdun"],
    answer: 2
},
{
    id: 60,
    question: "Quel peuple a construit le Colisée de Rome ?",
    options: ["Les Grecs", "Les Romains", "Les Égyptiens", "Les Vikings"],
    answer: 1
},
{
    id: 61,
    question: "Quel gaz est indispensable à la respiration humaine ?",
    options: ["L'azote", "L'oxygène", "Le dioxyde de carbone", "L'hélium"],
    answer: 1
},
{
    id: 62,
    question: "Combien de planètes composent le Système solaire ?",
    options: ["7", "8", "9", "10"],
    answer: 1
},
{
    id: 63,
    question: "Quel est l'astre au centre du Système solaire ?",
    options: ["La Lune", "Mars", "Le Soleil", "Jupiter"],
    answer: 2
},
{
    id: 64,
    question: "Quel est le symbole chimique de l'or ?",
    options: ["Or", "Au", "Ag", "Fe"],
    answer: 1
},
{
    id: 65,
    question: "Quelle est la formule chimique du dioxyde de carbone ?",
    options: ["CO", "CO2", "H2O", "O2"],
    answer: 1
},
{
    id: 66,
    question: "Quel organe pompe le sang dans le corps humain ?",
    options: ["Le cerveau", "Le foie", "Le cœur", "Le rein"],
    answer: 2
},
{
    id: 67,
    question: "Quel est l'état de l'eau à 0 °C dans des conditions normales ?",
    options: ["Gazeux", "Solide", "Liquide uniquement", "Plasma"],
    answer: 1
},
{
    id: 68,
    question: "Quel animal est un amphibien ?",
    options: ["La grenouille", "Le lézard", "Le pigeon", "Le requin"],
    answer: 0
},
{
    id: 69,
    question: "Quel est le plus petit os du corps humain ?",
    options: ["Le fémur", "L'étrier", "Le tibia", "Le radius"],
    answer: 1
},
{
    id: 70,
    question: "Quelle partie de la plante absorbe principalement l'eau du sol ?",
    options: ["La fleur", "La feuille", "La racine", "Le fruit"],
    answer: 2
},
{
    id: 71,
    question: "Quel scientifique a formulé la loi de la gravitation universelle ?",
    options: ["Albert Einstein", "Isaac Newton", "Galilée", "Louis Pasteur"],
    answer: 1
},
{
    id: 72,
    question: "Quel métal est liquide à température ambiante ?",
    options: ["Le fer", "Le cuivre", "Le mercure", "L'aluminium"],
    answer: 2
},
{
    id: 73,
    question: "Quelle planète est la plus proche du Soleil ?",
    options: ["Vénus", "Mercure", "Mars", "La Terre"],
    answer: 1
},
{
    id: 74,
    question: "Quelle planète possède les anneaux les plus visibles ?",
    options: ["Saturne", "Mars", "Vénus", "Mercure"],
    answer: 0
},
{
    id: 75,
    question: "Combien de pattes possède une araignée ?",
    options: ["6", "8", "10", "12"],
    answer: 1
},
{
    id: 76,
    question: "Quel animal est le plus grand félin ?",
    options: ["Le lion", "Le tigre", "Le guépard", "Le léopard"],
    answer: 1
},
{
    id: 77,
    question: "Quel est le nom du processus par lequel les plantes fabriquent leur énergie grâce à la lumière ?",
    options: ["La respiration", "La photosynthèse", "La fermentation", "La digestion"],
    answer: 1
},
{
    id: 78,
    question: "Quel scientifique est associé à la théorie de la relativité ?",
    options: ["Marie Curie", "Albert Einstein", "Charles Darwin", "Nikola Tesla"],
    answer: 1
},
{
    id: 79,
    question: "Quel est le nom de la galaxie où se trouve le Système solaire ?",
    options: ["Andromède", "La Voie lactée", "Orion", "La Grande Ourse"],
    answer: 1
},
{
    id: 80,
    question: "Quelle vitamine est produite par la peau sous l'action du soleil ?",
    options: ["Vitamine A", "Vitamine B12", "Vitamine C", "Vitamine D"],
    answer: 3
},
{
    id: 81,
    question: "Qui a écrit Le Petit Prince ?",
    options: ["Jules Verne", "Antoine de Saint-Exupéry", "Marcel Proust", "Albert Camus"],
    answer: 1
},
{
    id: 82,
    question: "Qui a écrit Roméo et Juliette ?",
    options: ["William Shakespeare", "Molière", "Charles Dickens", "Voltaire"],
    answer: 0
},
{
    id: 83,
    question: "Quel peintre a réalisé La Joconde ?",
    options: ["Claude Monet", "Léonard de Vinci", "Pablo Picasso", "Vincent van Gogh"],
    answer: 1
},
{
    id: 84,
    question: "Dans quel musée est exposée La Joconde ?",
    options: ["Le musée d'Orsay", "Le Louvre", "Le Centre Pompidou", "Le musée Rodin"],
    answer: 1
},
{
    id: 85,
    question: "Quel compositeur a écrit La Flûte enchantée ?",
    options: ["Mozart", "Beethoven", "Bach", "Chopin"],
    answer: 0
},
{
    id: 86,
    question: "Quel écrivain français a écrit Vingt mille lieues sous les mers ?",
    options: ["Jules Verne", "Victor Hugo", "Émile Zola", "Guy de Maupassant"],
    answer: 0
},
{
    id: 87,
    question: "Quel mouvement artistique est associé à Claude Monet ?",
    options: ["Le cubisme", "L'impressionnisme", "Le surréalisme", "Le romantisme"],
    answer: 1
},
{
    id: 88,
    question: "Quel peintre est célèbre pour avoir peint des tournesols ?",
    options: ["Salvador Dalí", "Vincent van Gogh", "Henri Matisse", "Paul Cézanne"],
    answer: 1
},
{
    id: 89,
    question: "Qui a écrit la pièce Le Malade imaginaire ?",
    options: ["Molière", "Racine", "Corneille", "Beaumarchais"],
    answer: 0
},
{
    id: 90,
    question: "Quel art utilise principalement des sons organisés ?",
    options: ["La sculpture", "La musique", "La peinture", "L'architecture"],
    answer: 1
},
{
    id: 91,
    question: "Quel instrument est joué avec un archet ?",
    options: ["Le violon", "La trompette", "Le piano", "La batterie"],
    answer: 0
},
{
    id: 92,
    question: "Quel auteur a écrit Harry Potter ?",
    options: ["J. R. R. Tolkien", "J. K. Rowling", "Stephen King", "Agatha Christie"],
    answer: 1
},
{
    id: 93,
    question: "Quel personnage de fiction vit au 221B Baker Street ?",
    options: ["Hercule Poirot", "Sherlock Holmes", "Arsène Lupin", "Tintin"],
    answer: 1
},
{
    id: 94,
    question: "Qui a peint le tableau Guernica ?",
    options: ["Pablo Picasso", "Paul Gauguin", "Édouard Manet", "Joan Miró"],
    answer: 0
},
{
    id: 95,
    question: "Quel écrivain a créé le personnage d'Arsène Lupin ?",
    options: ["Maurice Leblanc", "Georges Simenon", "Alexandre Dumas", "Honoré de Balzac"],
    answer: 0
},
{
    id: 96,
    question: "Combien font 12 multiplié par 12 ?",
    options: ["124", "132", "144", "156"],
    answer: 2
},
{
    id: 97,
    question: "Quel est le résultat de 100 divisé par 4 ?",
    options: ["20", "25", "30", "40"],
    answer: 1
},
{
    id: 98,
    question: "Combien de côtés possède un triangle ?",
    options: ["3", "4", "5", "6"],
    answer: 0
},
{
    id: 99,
    question: "Quel nombre vient après 99 ?",
    options: ["98", "100", "101", "110"],
    answer: 1
},
{
    id: 100,
    question: "Quelle est la moitié de 50 ?",
    options: ["20", "25", "30", "35"],
    answer: 1
},
{
    id: 101,
    question: "Combien font 7 plus 8 ?",
    options: ["13", "14", "15", "16"],
    answer: 2
},
{
    id: 102,
    question: "Quel est le résultat de 9 au carré ?",
    options: ["18", "27", "72", "81"],
    answer: 3
},
{
    id: 103,
    question: "Combien de mois compte une année ?",
    options: ["10", "11", "12", "13"],
    answer: 2
},
{
    id: 104,
    question: "Combien de secondes y a-t-il dans une minute ?",
    options: ["30", "45", "60", "100"],
    answer: 2
},
{
    id: 105,
    question: "Quel chiffre romain représente le nombre 10 ?",
    options: ["V", "X", "L", "C"],
    answer: 1
},
{
    id: 106,
    question: "Quel sport se joue avec une raquette et un volant ?",
    options: ["Le tennis", "Le badminton", "Le squash", "Le ping-pong"],
    answer: 1
},
{
    id: 107,
    question: "Combien de joueurs une équipe de football aligne-t-elle sur le terrain au début d'un match ?",
    options: ["9", "10", "11", "12"],
    answer: 2
},
{
    id: 108,
    question: "Dans quel sport utilise-t-on un panier ?",
    options: ["Le rugby", "Le basketball", "Le football", "Le handball"],
    answer: 1
},
{
    id: 109,
    question: "Quel pays a inventé les Jeux olympiques antiques ?",
    options: ["La France", "L'Italie", "La Grèce", "L'Égypte"],
    answer: 2
},
{
    id: 110,
    question: "Quel sport se pratique sur une piste avec des skis ?",
    options: ["Le surf", "Le ski", "La voile", "Le golf"],
    answer: 1
},
{
    id: 111,
    question: "Quelle couleur de carton indique généralement une exclusion au football ?",
    options: ["Bleu", "Vert", "Jaune", "Rouge"],
    answer: 3
},
{
    id: 112,
    question: "Dans quel sport célèbre-t-on un essai ?",
    options: ["Le rugby", "Le tennis", "Le cyclisme", "L'escrime"],
    answer: 0
},
{
    id: 113,
    question: "Quel tournoi de tennis se joue sur terre battue à Paris ?",
    options: ["Wimbledon", "Roland-Garros", "US Open", "Open d'Australie"],
    answer: 1
},
{
    id: 114,
    question: "Quel sport est associé au Tour de France ?",
    options: ["La course à pied", "Le cyclisme", "La natation", "L'automobile"],
    answer: 1
},
{
    id: 115,
    question: "Quel objet utilise-t-on pour jouer au golf ?",
    options: ["Une batte", "Un club", "Une raquette", "Une crosse"],
    answer: 1
},
{
    id: 116,
    question: "Quel appareil permet de téléphoner sans fil ?",
    options: ["Un téléphone portable", "Une imprimante", "Un scanner", "Un projecteur"],
    answer: 0
},
{
    id: 117,
    question: "Quel périphérique permet de saisir du texte sur un ordinateur ?",
    options: ["Une souris", "Un écran", "Un clavier", "Une enceinte"],
    answer: 2
},
{
    id: 118,
    question: "Que signifie l'abréviation WWW sur Internet ?",
    options: ["World Wide Web", "Web World Window", "Wide Web World", "World Web Wire"],
    answer: 0
},
{
    id: 119,
    question: "Quel symbole est généralement utilisé dans une adresse e-mail ?",
    options: ["#", "@", "&", "%"],
    answer: 1
},
{
    id: 120,
    question: "Quel navigateur web est développé par Mozilla ?",
    options: ["Chrome", "Safari", "Firefox", "Edge"],
    answer: 2
},
{
    id: 121,
    question: "Quel fruit est traditionnellement utilisé pour faire du cidre ?",
    options: ["La pomme", "La poire", "La cerise", "La pêche"],
    answer: 0
},
{
    id: 122,
    question: "Quel ingrédient est indispensable pour fabriquer du pain traditionnel ?",
    options: ["La farine", "Le chocolat", "Le riz", "Le fromage"],
    answer: 0
},
{
    id: 123,
    question: "Quelle boisson est obtenue à partir de feuilles infusées ?",
    options: ["Le thé", "Le lait", "Le jus d'orange", "Le soda"],
    answer: 0
},
{
    id: 124,
    question: "Quel ustensile sert à couper les aliments ?",
    options: ["Une cuillère", "Une fourchette", "Un couteau", "Un verre"],
    answer: 2
},
{
    id: 125,
    question: "Quel jour vient après le vendredi ?",
    options: ["Jeudi", "Samedi", "Dimanche", "Lundi"],
    answer: 1
}
];

/* Éléments HTML */
const pseudoScreen = document.getElementById("pseudo-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const pseudoForm = document.getElementById("pseudo-form");
const pseudoInput = document.getElementById("pseudo");
const pseudoError = document.getElementById("pseudo-error");

const quizForm = document.getElementById("quiz-form");
const quizError = document.getElementById("quiz-error");
const questionsContainer = document.getElementById("questions-container");

const playerName = document.getElementById("player-name");
const quizDateElement = document.getElementById("quiz-date");

const resultName = document.getElementById("result-name");
const resultScore = document.getElementById("result-score");

const correctionsContainer = document.getElementById("corrections-container");
const leaderboard = document.getElementById("leaderboard");
const leaderboardStatus = document.getElementById("leaderboard-status");

let dailyQuestions = [];

/* Retourne la date locale : AAAA-MM-JJ */
function getTodayKey() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/* Date française lisible */
function getFrenchDate() {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(new Date());
}

/* Crée une valeur stable à partir de la date */
function hashString(value) {
    let hash = 0;

    for (let index = 0; index < value.length; index++) {
        hash = ((hash << 5) - hash) + value.charCodeAt(index);
        hash |= 0;
    }

    return hash;
}

/* Mélange stable : mêmes questions pour tous durant la journée */
function seededShuffle(items, seed) {
    const shuffled = [...items];
    let currentSeed = seed;

    function random() {
        currentSeed |= 0;
        currentSeed = currentSeed + 0x6D2B79F5 | 0;

        let value = Math.imul(currentSeed ^ currentSeed >>> 15, 1 | currentSeed);
        value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;

        return ((value ^ value >>> 14) >>> 0) / 4294967296;
    }

    for (let index = shuffled.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(random() * (index + 1));

        [shuffled[index], shuffled[randomIndex]] = [
            shuffled[randomIndex],
            shuffled[index]
        ];
    }

    return shuffled;
}

function getDailyQuestions() {
    const seed = hashString(getTodayKey());

    return seededShuffle(questionsBank, seed).slice(0, 10);
}

function showScreen(screen) {
    pseudoScreen.classList.add("d-none");
    quizScreen.classList.add("d-none");
    resultScreen.classList.add("d-none");

    screen.classList.remove("d-none");
}

function showError(element, message) {
    element.textContent = message;
    element.classList.remove("d-none");
}

function hideError(element) {
    element.textContent = "";
    element.classList.add("d-none");
}

function getPseudo() {
    return localStorage.getItem("quizPseudo") || "";
}

function setPseudo(pseudo) {
    localStorage.setItem("quizPseudo", pseudo);
}

function getResultForToday() {
    const savedDate = localStorage.getItem("quizCompletedDate");

    if (savedDate !== getTodayKey()) {
        return null;
    }

    const score = localStorage.getItem("quizScore");
    const answers = localStorage.getItem("quizAnswers");

    if (score === null || answers === null) {
        return null;
    }

    try {
        return {
            score: Number(score),
            answers: JSON.parse(answers)
        };
    } catch {
        return null;
    }
}

function saveResult(score, answers) {
    localStorage.setItem("quizCompletedDate", getTodayKey());
    localStorage.setItem("quizScore", String(score));
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
}

function renderQuestions() {
    questionsContainer.replaceChildren();

    dailyQuestions.forEach((question, questionIndex) => {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "card question-card mb-4";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const legend = document.createElement("legend");
        legend.className = "h5 mb-3";
        legend.textContent = `Question ${questionIndex + 1} : ${question.question}`;

        cardBody.appendChild(legend);

        question.options.forEach((option, optionIndex) => {
            const wrapper = document.createElement("div");
            wrapper.className = "form-check mb-2";

            const input = document.createElement("input");
            input.className = "form-check-input";
            input.type = "radio";
            input.name = `question-${question.id}`;
            input.id = `question-${question.id}-option-${optionIndex}`;
            input.value = String(optionIndex);
            input.required = true;

            const label = document.createElement("label");
            label.className = "form-check-label";
            label.htmlFor = input.id;
            label.textContent = option;

            wrapper.appendChild(input);
            wrapper.appendChild(label);
            cardBody.appendChild(wrapper);
        });

        fieldset.appendChild(cardBody);
        questionsContainer.appendChild(fieldset);
    });
}

function renderCorrections(answers) {
    correctionsContainer.replaceChildren();

    dailyQuestions.forEach((question, index) => {
        const selectedIndex = Number(answers[question.id]);
        const isCorrect = selectedIndex === question.answer;

        const card = document.createElement("article");
        card.className = `card correction-card mb-3 ${isCorrect ? "correct" : "incorrect"}`;

        const body = document.createElement("div");
        body.className = "card-body";

        const title = document.createElement("h3");
        title.className = "h5";
        title.textContent = `Question ${index + 1} : ${question.question}`;

        const selected = document.createElement("p");
        selected.className = isCorrect
            ? "answer-correct mb-2"
            : "answer-incorrect mb-2";

        selected.textContent = `Votre réponse : ${question.options[selectedIndex]}`;

        const correct = document.createElement("p");
        correct.className = "mb-0";

        const strong = document.createElement("strong");
        strong.textContent = "Bonne réponse : ";

        correct.appendChild(strong);
        correct.append(question.options[question.answer]);

        body.appendChild(title);
        body.appendChild(selected);
        body.appendChild(correct);

        card.appendChild(body);
        correctionsContainer.appendChild(card);
    });
}

async function getFirebaseUser() {
    if (auth.currentUser) {
        return auth.currentUser;
    }

    const credential = await signInAnonymously(auth);
    return credential.user;
}

async function saveScoreToFirebase(score) {
    try {
        const user = await getFirebaseUser();

        const scoreReference = doc(
            db,
            "dailyScores",
            getTodayKey(),
            "entries",
            user.uid
        );

        await setDoc(scoreReference, {
            uid: user.uid,
            pseudo: getPseudo(),
            score: score,
            completedAt: serverTimestamp()
        });

    } catch (error) {
        console.error("Enregistrement Firebase indisponible :", error);
    }
}

async function loadLeaderboard() {
    leaderboard.replaceChildren();
    leaderboardStatus.textContent = "Chargement du classement…";

    try {
        const scoresReference = collection(
            db,
            "dailyScores",
            getTodayKey(),
            "entries"
        );

        const scoresQuery = query(
            scoresReference,
            orderBy("score", "desc"),
            limit(20)
        );

        const snapshot = await getDocs(scoresQuery);

        if (snapshot.empty) {
            leaderboardStatus.textContent = "Aucun score enregistré pour le moment.";
            return;
        }

        leaderboardStatus.textContent = "Les 20 meilleurs scores du jour.";

        snapshot.forEach((scoreDocument) => {
            const data = scoreDocument.data();

            const item = document.createElement("li");
            item.className = "list-group-item d-flex justify-content-between align-items-center";

            const pseudo = document.createElement("span");
            pseudo.textContent = data.pseudo || "Anonyme";

            const score = document.createElement("strong");
            score.textContent = `${data.score}/10`;

            item.appendChild(pseudo);
            item.appendChild(score);

            leaderboard.appendChild(item);
        });

    } catch (error) {
        console.error("Classement Firebase indisponible :", error);
        leaderboardStatus.textContent = "Le classement est momentanément indisponible.";
    }
}

function showQuiz() {
    const pseudo = getPseudo();

    if (!pseudo) {
        showScreen(pseudoScreen);
        pseudoInput.focus();
        return;
    }

    const previousResult = getResultForToday();

    if (previousResult !== null) {
        showResult(previousResult.score, previousResult.answers);
        return;
    }

    playerName.textContent = pseudo;
    quizDateElement.textContent = getFrenchDate();

    dailyQuestions = getDailyQuestions();
    renderQuestions();

    hideError(quizError);
    showScreen(quizScreen);
}

function showResult(score, answers) {
    resultName.textContent = getPseudo();
    resultScore.textContent = String(score);

    dailyQuestions = getDailyQuestions();
    renderCorrections(answers);

    showScreen(resultScreen);
    loadLeaderboard();
}

/* Validation et enregistrement du pseudo */
pseudoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const pseudo = pseudoInput.value.trim();

    if (!/^[\p{L}\p{N} _-]{2,30}$/u.test(pseudo)) {
        showError(
            pseudoError,
            "Le pseudo doit contenir entre 2 et 30 caractères."
        );
        return;
    }

    setPseudo(pseudo);
    hideError(pseudoError);
    showQuiz();
});

/* Calcul du score et affichage de la correction */
quizForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(quizForm);
    const answers = {};
    let score = 0;

    for (const question of dailyQuestions) {
        const answer = formData.get(`question-${question.id}`);

        if (answer === null) {
            showError(quizError, "Veuillez répondre aux 10 questions.");
            return;
        }

        answers[question.id] = Number(answer);

        if (Number(answer) === question.answer) {
            score++;
        }
    }

    saveResult(score, answers);

    await saveScoreToFirebase(score);

    showResult(score, answers);
});

function changePseudo() {
    localStorage.removeItem("quizPseudo");

    /*
     * Supprime également le résultat local.
     * Le classement Firebase déjà enregistré reste intact.
     */
    localStorage.removeItem("quizCompletedDate");
    localStorage.removeItem("quizScore");
    localStorage.removeItem("quizAnswers");

    pseudoInput.value = "";

    hideError(pseudoError);
    showScreen(pseudoScreen);

    pseudoInput.focus();
}

document.getElementById("change-pseudo").addEventListener("click", changePseudo);
document.getElementById("result-change-pseudo").addEventListener("click", changePseudo);

/* Démarrage */
showQuiz();

