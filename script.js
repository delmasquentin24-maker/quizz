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

