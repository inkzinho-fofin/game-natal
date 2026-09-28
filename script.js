/*
============================================================
DESAFIO DE NATAL — BLOX FRUITS
SCRIPT PRINCIPAL
============================================================

Responsável por:

- Navegação entre páginas
- Cadastro dos jogadores
- Lobby
- Contagem de jogadores
- Quiz
- Pontuação
- Resultado
- Login DEV
- Painel DEV
- Lista de jogadores
- Notificações
- Preparação para Firebase

============================================================
*/


// ==========================================================
// CONFIGURAÇÕES
// ==========================================================

const CONFIG = {

    // Senha solicitada para o painel DEV
    DEV_PASSWORD: "inksuki0",

    // Quantidade mínima de jogadores
    MIN_PLAYERS: 3,

    // Tempo de cada pergunta
    QUESTION_TIME: 20,

    // Total de perguntas
    TOTAL_QUESTIONS: 10

};


// ==========================================================
// ESTADO DO JOGO
// ==========================================================

const gameState = {

    currentPlayer: null,

    players: {},

    currentQuestion: 0,

    score: 0,

    timer: null,

    timeLeft: CONFIG.QUESTION_TIME,

    gameStarted: false,

    devLogged: false,

    notifications: []

};


// ==========================================================
// PERGUNTAS
// ==========================================================

const questions = [

    // ------------------------------------------------------
    // FÁCEIS
    // ------------------------------------------------------

    {
        difficulty: "FÁCIL",

        question:
            "Quantos mares existem atualmente em Blox Fruits?",

        answers: [
            "2",
            "3",
            "4",
            "5"
        ],

        correct: 1
    },


    {
        difficulty: "FÁCIL",

        question:
            "Ao subir de nível, quantos pontos de atributo o jogador recebe?",

        answers: [
            "1",
            "2",
            "3",
            "5"
        ],

        correct: 2
    },


    {
        difficulty: "FÁCIL",

        question:
            "Qual destes é um dos mares principais de progressão?",

        answers: [
            "First Sea",
            "Fourth Sea",
            "Moon Sea",
            "Void Sea"
        ],

        correct: 0
    },


    // ------------------------------------------------------
    // MÉDIAS
    // ------------------------------------------------------

    {
        difficulty: "MÉDIA",

        question:
            "Qual nível é associado ao acesso ao Third Sea?",

        answers: [
            "700",
            "1000",
            "1500",
            "2000"
        ],

        correct: 2
    },


    {
        difficulty: "MÉDIA",

        question:
            "Em qual Sea ficam os caminhos de evolução Race V2 e V3?",

        answers: [
            "First Sea",
            "Second Sea",
            "Third Sea",
            "Nenhuma"
        ],

        correct: 1
    },


    {
        difficulty: "MÉDIA",

        question:
            "A Race V4 está ligada principalmente a qual Sea?",

        answers: [
            "First Sea",
            "Second Sea",
            "Third Sea",
            "Todas igualmente"
        ],

        correct: 2
    },


    // ------------------------------------------------------
    // DIFÍCEIS
    // ------------------------------------------------------

    {
        difficulty: "DIFÍCIL",

        question:
            "Qual destas NÃO é uma das quatro raças iniciais?",

        answers: [
            "Human",
            "Rabbit",
            "Shark",
            "Cyborg"
        ],

        correct: 3
    },


    {
        difficulty: "DIFÍCIL",

        question:
            "Qual raça é obtida por meio do puzzle relacionado ao Cyborg?",

        answers: [
            "Ghoul",
            "Cyborg",
            "Draco",
            "Angel"
        ],

        correct: 1
    },


    {
        difficulty: "DIFÍCIL",

        question:
            "Qual destas é uma raça que pode ser obtida através de uma quest própria?",

        answers: [
            "Human",
            "Angel",
            "Ghoul",
            "Rabbit"
        ],

        correct: 2
    },


    // ------------------------------------------------------
    // DESEMPATE
    // ------------------------------------------------------

    {
        difficulty: "DESEMPATE",

        question:
            "Qual destas raças NÃO faz parte das quatro raças iniciais?",

        answers: [
            "Angel",
            "Ghoul",
            "Human",
            "Shark"
        ],

        correct: 1
    }

];


// ==========================================================
// FUNÇÃO AUXILIAR
// ==========================================================

function get(id) {

    return document.getElementById(id);

}


// ==========================================================
// NAVEGAÇÃO
// ==========================================================

function showPage(pageId) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(page => {

        page.classList.remove("active");

    });


    const page =
        get(pageId);


    if (page) {

        page.classList.add("active");

    }

}


// ==========================================================
// TOAST
// ==========================================================

function showToast(message) {

    const toast =
        get("toast");


    if (!toast) {

        return;

    }


    toast.textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 4000);

}


// ==========================================================
// ESCAPAR HTML
// ==========================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ==========================================================
// BOTÃO — JOGADOR
// ==========================================================

get("openPlayerButton").addEventListener(
    "click",
    () => {

        showPage("registerPage");

    }
);


// ==========================================================
// BOTÃO — DEV
// ==========================================================

get("openDevButton").addEventListener(
    "click",
    () => {

        showPage("devLoginPage");

        get("devPassword").focus();

    }
);


// ==========================================================
// VOLTAR DO CADASTRO
// ==========================================================

get("backFromRegister").addEventListener(
    "click",
    () => {

        showPage("homePage");

    }
);


// ==========================================================
// VOLTAR DO LOGIN DEV
// ==========================================================

get("backFromDevLogin").addEventListener(
    "click",
    () => {

        showPage("homePage");

    }
);


// ==========================================================
// CADASTRO
// ==========================================================

get("registerForm").addEventListener(
    "submit",
    event => {

        event.preventDefault();

        registerPlayer();

    }
);


function registerPlayer() {

    const discordId =
        get("discordId").value.trim();


    const nick =
        get("playerNick").value.trim();


    const message =
        get("registerMessage");


    // ------------------------------------------------------
    // VALIDAR ID
    // ------------------------------------------------------

    if (!/^\d{6,20}$/.test(discordId)) {

        message.textContent =
            "❌ Digite um Discord ID numérico válido.";

        return;

    }


    // ------------------------------------------------------
    // VALIDAR NICK
    // ------------------------------------------------------

    if (nick.length < 2) {

        message.textContent =
            "❌ Digite um nick válido.";

        return;

    }


    // ------------------------------------------------------
    // CRIAR JOGADOR
    // ------------------------------------------------------

    gameState.currentPlayer = {

        id: discordId,

        nick: nick,

        score: 0,

        online: true,

        joinedAt: Date.now()

    };


    // ------------------------------------------------------
    // ADICIONAR AO LOBBY LOCAL
    // ------------------------------------------------------

    gameState.players[discordId] =
        gameState.currentPlayer;


    message.textContent = "";


    updateLobby();


    updateDevPanel();


    showPage("lobbyPage");


    showToast(
        `🎮 ${nick} entrou no lobby!`
    );


    /*
    ========================================================
    FUTURO FIREBASE

    Aqui posteriormente vamos registrar:

    rooms/
       natal-blox-fruits-2026/
           players/
               DISCORD_ID/

    ========================================================
    */

}


// ==========================================================
// ATUALIZAR LOBBY
// ==========================================================

function updateLobby() {

    const players =
        Object.values(
            gameState.players
        );


    // ------------------------------------------------------
    // CONTADOR
    // ------------------------------------------------------

    get("onlineCount").textContent =
        `${players.length} jogador(es) online`;


    // ------------------------------------------------------
    // INDICADOR
    // ------------------------------------------------------

    const indicator =
        get("onlineIndicator");


    if (players.length >= CONFIG.MIN_PLAYERS) {

        indicator.classList.add("on");

    } else {

        indicator.classList.remove("on");

    }


    // ------------------------------------------------------
    // LISTA
    // ------------------------------------------------------

    const list =
        get("playerList");


    if (players.length === 0) {

        list.innerHTML = `
            <p class="empty-message">
                Nenhum jogador conectado.
            </p>
        `;

        return;

    }


    list.innerHTML =
        players.map(player => {

            return `

                <div class="player-card">

                    <div class="player-avatar">
                        👤
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(player.nick)}
                        </strong>

                        <small>
                            ID:
                            ${escapeHTML(player.id)}
                        </small>

                    </div>

                    <span class="online">
                        ● ONLINE
                    </span>

                </div>

            `;

        }).join("");


    updateStartButton();

}


// ==========================================================
// BOTÃO COMEÇAR
// ==========================================================

function updateStartButton() {

    const button =
        get("startGameButton");


    const count =
        Object.keys(
            gameState.players
        ).length;


    if (
        count >= CONFIG.MIN_PLAYERS &&
        !gameState.gameStarted
    ) {

        button.disabled = false;

        button.innerHTML =
            "🚀 Começar Parte 1";


        get("lobbyMessage").textContent =
            "✅ Jogadores suficientes! O desafio pode começar.";

    }

    else {

        button.disabled = true;

        button.innerHTML =
            `🔒 Aguardando ${CONFIG.MIN_PLAYERS} jogadores...`;

        get("lobbyMessage").textContent =
            `É necessário ter pelo menos ${CONFIG.MIN_PLAYERS} jogadores online.`;

    }

}


// ==========================================================
// INICIAR JOGO
// ==========================================================

get("startGameButton").addEventListener(
    "click",
    startGame
);


function startGame() {

    const count =
        Object.keys(
            gameState.players
        ).length;


    if (count < CONFIG.MIN_PLAYERS) {

        showToast(
            "❌ Ainda não existem jogadores suficientes."
        );

        return;

    }


    gameState.gameStarted = true;

    gameState.currentQuestion = 0;

    gameState.score = 0;


    showPage("quizPage");


    loadQuestion();

}


// ==========================================================
// CARREGAR PERGUNTA
// ==========================================================

function loadQuestion() {

    clearInterval(
        gameState.timer
    );


    const question =
        questions[
            gameState.currentQuestion
        ];


    // ------------------------------------------------------
    // DIFICULDADE
    // ------------------------------------------------------

    get("difficultyBadge").textContent =
        question.difficulty;


    // ------------------------------------------------------
    // NÚMERO
    // ------------------------------------------------------

    get("questionNumber").textContent =
        `${gameState.currentQuestion + 1} / ${questions.length}`;


    // ------------------------------------------------------
    // PERGUNTA
    // ------------------------------------------------------

    get("questionText").textContent =
        question.question;


    // ------------------------------------------------------
    // PROGRESSO
    // ------------------------------------------------------

    const percentage =
        (
            gameState.currentQuestion /
            questions.length
        ) * 100;


    get("quizProgress").style.width =
        `${percentage}%`;


    // ------------------------------------------------------
    // RESPOSTAS
    // ------------------------------------------------------

    const answerList =
        get("answerList");


    answerList.innerHTML = "";


    question.answers.forEach(
        (answer, index) => {

            const button =
                document.createElement("button");


            button.className =
                "answer-button";


            button.textContent =
                answer;


            button.addEventListener(
                "click",
                () => {

                    answerQuestion(
                        index,
                        button
                    );

                }
            );


            answerList.appendChild(
                button
            );

        }
    );


    get("quizMessage").textContent =
        "";


    // ------------------------------------------------------
    // TIMER
    // ------------------------------------------------------

    startTimer();

}


// ==========================================================
// TIMER
// ==========================================================

function startTimer() {

    gameState.timeLeft =
        CONFIG.QUESTION_TIME;


    updateTimer();


    gameState.timer =
        setInterval(
            () => {

                gameState.timeLeft--;

                updateTimer();


                if (
                    gameState.timeLeft <= 0
                ) {

                    clearInterval(
                        gameState.timer
                    );


                    answerQuestion(
                        -1,
                        null
                    );

                }

            },
            1000
        );

}


// ==========================================================
// ATUALIZAR TIMER
// ==========================================================

function updateTimer() {

    get("questionTimer").textContent =
        `${gameState.timeLeft}s`;

}


// ==========================================================
// RESPONDER
// ==========================================================

function answerQuestion(
    selectedIndex,
    selectedButton
) {

    clearInterval(
        gameState.timer
    );


    const question =
        questions[
            gameState.currentQuestion
        ];


    const buttons =
        document.querySelectorAll(
            "#answerList button"
        );


    // ------------------------------------------------------
    // BLOQUEAR BOTÕES
    // ------------------------------------------------------

    buttons.forEach(
        button => {

            button.disabled = true;

        }
    );


    // ------------------------------------------------------
    // MOSTRAR RESPOSTA CORRETA
    // ------------------------------------------------------

    if (buttons[question.correct]) {

        buttons[
            question.correct
        ].classList.add(
            "correct"
        );

    }


    // ------------------------------------------------------
    // VERIFICAR
    // ------------------------------------------------------

    if (
        selectedIndex ===
        question.correct
    ) {

        gameState.score++;


        if (selectedButton) {

            selectedButton.classList.add(
                "correct"
            );

        }


        get("quizMessage").textContent =
            "✅ Resposta correta!";

    }

    else {

        if (selectedButton) {

            selectedButton.classList.add(
                "wrong"
            );

        }


        get("quizMessage").textContent =
            "❌ Resposta incorreta!";

    }


    // ------------------------------------------------------
    // PRÓXIMA PERGUNTA
    // ------------------------------------------------------

    setTimeout(
        () => {

            gameState.currentQuestion++;


            if (
                gameState.currentQuestion >=
                questions.length
            ) {

                finishGame();

            }

            else {

                loadQuestion();

            }

        },
        900
    );

}


// ==========================================================
// FINALIZAR JOGO
// ==========================================================

function finishGame() {

    clearInterval(
        gameState.timer
    );


    gameState.gameStarted =
        false;


    // ------------------------------------------------------
    // SALVAR PONTUAÇÃO
    // ------------------------------------------------------

    if (
        gameState.currentPlayer
    ) {

        gameState.currentPlayer.score =
            gameState.score;


        gameState.players[
            gameState.currentPlayer.id
        ].score =
            gameState.score;

    }


    // ------------------------------------------------------
    // RESULTADO
    // ------------------------------------------------------

    get("playerScore").textContent =
        `${gameState.score} / ${questions.length}`;


    let resultMessage;


    if (gameState.score === 10) {

        resultMessage =
            "🏆 Perfeito! Você acertou tudo!";

    }

    else if (gameState.score >= 7) {

        resultMessage =
            "🔥 Mandou muito bem!";

    }

    else if (gameState.score >= 5) {

        resultMessage =
            "👍 Boa tentativa!";

    }

    else {

        resultMessage =
            "📚 Ainda dá para estudar mais!";

    }


    get("resultMessage").textContent =
        resultMessage;


    updateResultRanking();


    updateDevPanel();


    showPage(
        "resultPage"
    );

}


// ==========================================================
// RANKING
// ==========================================================

function updateResultRanking() {

    const list =
        get("resultPlayerList");


    const players =
        Object.values(
            gameState.players
        );


    players.sort(
        (a, b) =>
            b.score - a.score
    );


    list.innerHTML =
        players.map(
            (player, index) => {

                return `

                    <div class="player-card">

                        <div class="ranking-position">

                            #${index + 1}

                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    player.nick
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    player.id
                                )}
                            </small>

                        </div>

                        <strong>
                            ${player.score} pts
                        </strong>

                    </div>

                `;

            }
        ).join("");

}


// ==========================================================
// VOLTAR AO INÍCIO
// ==========================================================

get("backHomeButton").addEventListener(
    "click",
    () => {

        showPage(
            "homePage"
        );

    }
);


// ==========================================================
// SAIR DO LOBBY
// ==========================================================

get("leaveLobbyButton").addEventListener(
    "click",
    leaveLobby
);


function leaveLobby() {

    if (
        gameState.currentPlayer
    ) {

        delete gameState.players[
            gameState.currentPlayer.id
        ];

    }


    gameState.currentPlayer =
        null;


    updateLobby();

    updateDevPanel();


    showPage(
        "homePage"
    );


    showToast(
        "Você saiu do lobby."
    );

}


// ==========================================================
// LOGIN DEV
// ==========================================================

get("devLoginForm").addEventListener(
    "submit",
    event => {

        event.preventDefault();

        loginDev();

    }
);


function loginDev() {

    const password =
        get("devPassword").value;


    if (
        password !==
        CONFIG.DEV_PASSWORD
    ) {

        get("devLoginMessage").textContent =
            "❌ Senha incorreta.";

        return;

    }


    gameState.devLogged =
        true;


    get("devPassword").value =
        "";


    get("devLoginMessage").textContent =
        "";


    updateDevPanel();


    showPage(
        "devPage"
    );


    showToast(
        "🛠️ Painel DEV aberto."
    );

}


// ==========================================================
// SAIR DO DEV
// ==========================================================

get("devLogoutButton").addEventListener(
    "click",
    () => {

        gameState.devLogged =
            false;


        showPage(
            "homePage"
        );


        showToast(
            "Painel DEV fechado."
        );

    }
);


// ==========================================================
// PAINEL DEV
// ==========================================================

function updateDevPanel() {

    const players =
        Object.values(
            gameState.players
        );


    // ------------------------------------------------------
    // ONLINE
    // ------------------------------------------------------

    get("devOnlinePlayers").textContent =
        players.length;


    get("devOnlineBadge").textContent =
        `${players.length} ONLINE`;


    // ------------------------------------------------------
    // PONTOS
    // ------------------------------------------------------

    const totalPoints =
        players.reduce(
            (total, player) => {

                return total +
                    Number(player.score || 0);

            },
            0
        );


    get("devTotalPoints").textContent =
        totalPoints;


    // ------------------------------------------------------
    // MAIOR PONTUAÇÃO
    // ------------------------------------------------------

    const highest =
        players.length > 0

            ? Math.max(
                ...players.map(
                    player =>
                        Number(
                            player.score || 0
                        )
                )
            )

            : 0;


    get("devHighestScore").textContent =
        highest;


    // ------------------------------------------------------
    // LISTA
    // ------------------------------------------------------

    const list =
        get("devPlayerList");


    if (players.length === 0) {

        list.innerHTML = `
            <p class="empty-message">
                Nenhum jogador online.
            </p>
        `;

        return;

    }


    list.innerHTML =
        players.map(
            player => {

                return `

                    <div class="dev-player-card">

                        <div class="dev-player-info">

                            <div class="player-avatar">
                                👤
                            </div>

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        player.nick
                                    )}
                                </strong>

                                <small>
                                    Discord ID:
                                    ${escapeHTML(
                                        player.id
                                    )}
                                </small>

                            </div>

                        </div>


                        <div class="dev-player-score">

                            <span>
                                Pontos
                            </span>

                            <strong>
                                ${player.score}
                            </strong>

                        </div>


                        <button
                            class="notify-player-button"
                            data-player-id="${escapeHTML(
                                player.id
                            )}"
                        >

                            🔔 Notificar

                        </button>

                    </div>

                `;

            }
        ).join("");


    // ------------------------------------------------------
    // BOTÕES INDIVIDUAIS
    // ------------------------------------------------------

    document
        .querySelectorAll(
            ".notify-player-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const playerId =
                            button.dataset.playerId;


                        sendNotification(
                            playerId
                        );

                    }
                );

            }
        );

}


// ==========================================================
// NOTIFICAÇÃO PARA TODOS
// ==========================================================

get("notifyAllButton").addEventListener(
    "click",
    () => {

        sendNotification(
            "ALL"
        );

    }
);


// ==========================================================
// ENVIAR NOTIFICAÇÃO
// ==========================================================

function sendNotification(
    target
) {

    const text =
        get("notificationText")
            .value
            .trim();


    if (!text) {

        get("notificationMessage").textContent =
            "❌ Digite uma mensagem.";

        return;

    }


    // ------------------------------------------------------
    // CRIAR NOTIFICAÇÃO
    // ------------------------------------------------------

    const notification = {

        id:
            Date.now(),

        text:

            text,

        target:

            target,

        createdAt:

            new Date()
                .toLocaleTimeString(
                    "pt-BR"
                )

    };


    gameState.notifications.push(
        notification
    );


    // ------------------------------------------------------
    // HISTÓRICO
    // ------------------------------------------------------

    updateNotificationHistory();


    // ------------------------------------------------------
    // LIMPAR
    // ------------------------------------------------------

    get("notificationText")
        .value = "";


    get("notificationMessage").textContent =
        "✅ Notificação enviada.";


    // ------------------------------------------------------
    // SIMULAÇÃO LOCAL
    // ------------------------------------------------------

    if (
        target === "ALL"
    ) {

        showToast(
            `📢 ${text}`
        );

    }

    else {

        const player =
            gameState.players[
                target
            ];


        if (player) {

            showToast(
                `🔔 Enviada para ${player.nick}`
            );

        }

    }


    /*
    ========================================================
    FUTURO FIREBASE

    A notificação será gravada no banco:

    rooms/
       natal-blox-fruits-2026/
           notifications/

    Assim todos os jogadores poderão recebê-la
    instantaneamente.

    ========================================================
    */

}


// ==========================================================
// HISTÓRICO DE NOTIFICAÇÕES
// ==========================================================

function updateNotificationHistory() {

    const container =
        get("notificationHistory");


    if (
        gameState.notifications.length === 0
    ) {

        container.innerHTML = `
            <p class="empty-message">
                Nenhuma notificação enviada.
            </p>
        `;

        return;

    }


    container.innerHTML =
        gameState.notifications
            .slice()
            .reverse()
            .map(
                notification => {

                    const target =
                        notification.target === "ALL"

                            ? "Todos os jogadores"

                            : (
                                gameState.players[
                                    notification.target
                                ]?.nick ||
                                "Jogador"
                            );


                    return `

                        <div class="notification-item">

                            <div>

                                <strong>
                                    📢
                                    ${escapeHTML(
                                        notification.text
                                    )}
                                </strong>

                                <small>

                                    Para:
                                    ${escapeHTML(
                                        target
                                    )}

                                    •
                                    ${notification.createdAt}

                                </small>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


// ==========================================================
// DETECTAR SAÍDA DA PÁGINA
// ==========================================================

window.addEventListener(
    "beforeunload",
    () => {

        /*
        ======================================================
        IMPORTANTE

        Quando colocarmos Firebase, o onDisconnect()
        removerá automaticamente o jogador do lobby.

        Sem servidor/Firebase, o navegador sozinho não
        consegue garantir presença real entre dispositivos.
        ======================================================
        */

    }
);


// ==========================================================
// ESTADO INICIAL
// ==========================================================

updateLobby();

updateDevPanel();


// ==========================================================
// LOG
// ==========================================================

console.log(
    "🎄 Desafio Blox Fruits carregado."
);

console.log(
    "🛠️ Painel DEV disponível."
);
