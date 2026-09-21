"use strict";

/*
 * Banque de questions.
 * Ajouter de nouvelles questions ici pour enrichir le quiz.
 * "answer" représente la position de la bonne réponse (0, 1, 2 ou 3).
 */
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

/*
 * Remplacer les valeurs ci-dessous par celles affichées
 * dans la configuration de votre application Firebase.
 */
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_PROJET.firebaseapp.com",
    projectId: "VOTRE_PROJET",
    storageBucket: "VOTRE_PROJET.appspot.com",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
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
    }
];

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

/* Date locale au format AAAA-MM-JJ */
function getTodayKey() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/* Date lisible en français */
function getFrenchDate() {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(new Date());
}

/* Génère un nombre stable à partir de la date */
function hashString(value) {
    let hash = 0;

    for (let i = 0; i < value.length; i++) {
        hash = ((hash << 5) - hash) + value.charCodeAt(i);
        hash |= 0;
    }

    return hash;
}

/* Mélange déterministe : mêmes questions pendant toute la journée */
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

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
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

    return {
        score: Number(score),
        answers: JSON.parse(answers)
    };
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

function showQuiz() {
    const pseudo = getPseudo();

    if (!pseudo) {
        showScreen(pseudoScreen);
        pseudoInput.focus();
        return;
    }

    const previousScore = getResultForToday();

    if (previousScore !== null) {
        showResult(previousScore);
        return;
    }

    playerName.textContent = pseudo;
    quizDateElement.textContent = getFrenchDate();

    dailyQuestions = getDailyQuestions();
    renderQuestions();

    hideError(quizError);
    showScreen(quizScreen);
}

function showResult(score) {
    resultName.textContent = getPseudo();
    resultScore.textContent = String(score);
    showScreen(resultScreen);
}

pseudoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const pseudo = pseudoInput.value.trim();

    if (pseudo.length < 2 || pseudo.length > 30) {
        showError(pseudoError, "Le pseudo doit contenir entre 2 et 30 caractères.");
        return;
    }

    setPseudo(pseudo);
    hideError(pseudoError);
    showQuiz();
});

quizForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quizForm);
    let score = 0;

    for (const question of dailyQuestions) {
        const answer = formData.get(`question-${question.id}`);

        if (answer === null) {
            showError(quizError, "Veuillez répondre aux 10 questions.");
            return;
        }

        if (Number(answer) === question.answer) {
            score++;
        }
    }

    saveResult(score);
    showResult(score);
});

function changePseudo() {
    localStorage.removeItem("quizPseudo");
    pseudoInput.value = "";
    hideError(pseudoError);
    showScreen(pseudoScreen);
    pseudoInput.focus();
}

document.getElementById("change-pseudo").addEventListener("click", changePseudo);
document.getElementById("result-change-pseudo").addEventListener("click", changePseudo);

/* Démarrage */
showQuiz();
