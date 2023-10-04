//#region Variáveis globais
let board = [];
let currentPlayer = "X";
let difficulty = "easy";
//#endregion

//#region Eventos

// Adicione um ouvinte de evento onchange ao <select>
const selectElement = document.getElementById("difficulty");
selectElement.addEventListener("change", handleDifficultyChange);

//#endregion
 
//#region Métodos úteis

// Método para gerar aletóriamente um numero 0 ou 1;
function randomZeroOrOne() {
  // Gere um número aleatório entre 0 e 1 (inclusive)
  const randomNumber = Math.random();

  // Arredonde o número para 0 ou 1
  const result = Math.round(randomNumber);

  return result;
}

// Função para lidar com a mudança no <select>
function handleDifficultyChange() {
  const selectElement = document.getElementById("difficulty");
  const selectedOption = selectElement.value;

  // Defina o novo nível de dificuldade na variável global
  difficulty = selectedOption;
}

//#endregion

//#region Funções de check

// Função para verificar se o jogo terminou (alguém venceu ou empatou)
function checkGameOver() {
  return checkWinner("X") || checkWinner("O") || checkDraw();
}

// Função para verificar o vencedor
function checkWinner(player) {
  // Verificar linhas
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === player &&
      board[i][1] === player &&
      board[i][2] === player
    ) {
      return true;
    }
  }

  // Verificar colunas
  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] === player &&
      board[1][i] === player &&
      board[2][i] === player
    ) {
      return true;
    }
  }

  // Verificar diagonais
  if (
    board[0][0] === player &&
    board[1][1] === player &&
    board[2][2] === player
  ) {
    return true;
  }

  if (
    board[0][2] === player &&
    board[1][1] === player &&
    board[2][0] === player
  ) {
    return true;
  }

  return false;
}

// Função para verificar empate
function checkDraw() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        return false; // Ainda existem células vazias, o jogo não é um empate.
      }
    }
  }
  return true; // Todas as células estão preenchidas, é um empate.
}

//#endregion

//#region Funções de estratégia.

// Função para fazer uma jogada aleatória
function makeRandomMove() {
  let emptyCells = [];

  // Encontra todas as células vazias
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        emptyCells.push({ row, col });
      }
    }
  }

  // Escolhe uma célula vazia aleatoriamente
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const selectedCell = emptyCells[randomIndex];

  // Faz a jogada do computador
  const row = selectedCell.row;
  const col = selectedCell.col;
  board[row][col] = "O";
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  cell.textContent = "O";

  // Verifica o resultado após a jogada do computador
  if (checkWinner("O")) {
    alert("O computador venceu!");
    resetGame();
  } else if (checkDraw()) {
    alert("Empate!");
    resetGame();
  } else {
    currentPlayer = "X";
  }
}

// Função para a estratégia de jogada do computador (nível "hard")
function makeHardMove() {
  // Verifica se há uma ação de vitória iminente para o computador
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        board[row][col] = "O";
        if (checkWinner("O")) {
          // Se a jogada levar à vitória, faça essa jogada
          updateBoard(row, col);
          return;
        }
        board[row][col] = ""; // Desfaz a jogada
      }
    }
  }

  // Verifica se há uma ação de derrota iminente para o jogador humano
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        board[row][col] = "X";
        if (checkWinner("X")) {
          // Bloqueia a vitória do jogador humano
          updateBoard(row, col);
          return;
        }
        board[row][col] = ""; // Desfaz a jogada
      }
    }
  }

  // Se não há ação de vitória iminente ou derrota iminente, faça uma jogada aleatória
  makeRandomMove();
}

function makeMediumMove() {
  const numRandom = randomZeroOrOne();

  if (numRandom === 1) {
    makeRandomMove();
  } else {
    makeHardMove();
  }
}

//#endregion

//#region Funções do tabuleiro

// Função para iniciar o jogo
function startGame() {
  const difficultySelect = document.getElementById("difficulty");
  difficulty = difficultySelect.value;
  createBoard();
}

// Função para fazer uma jogada e atualizar o tabuleiro
function updateBoard(row, col) {
  board[row][col] = "O";
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  cell.textContent = "O";

  // Verifica o resultado após a jogada do computador
  if (checkWinner("O")) {
    alert("O computador venceu!");
    resetGame();
  } else if (checkDraw()) {
    alert("Empate!");
    resetGame();
  } else {
    currentPlayer = "X";
  }
}

// Função para criar o tabuleiro
function createBoard() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";

  for (let row = 0; row < 3; row++) {
    const rowArray = [];
    for (let col = 0; col < 3; col++) {
      const cell = document.createElement("div");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", cellClick);
      rowArray.push("");
      boardElement.appendChild(cell);
    }
    board.push(rowArray);
  }
}

// Função para lidar com o clique nas células
function cellClick(event) {
  const row = event.target.dataset.row;
  const col = event.target.dataset.col;

  if (board[row][col] === "" && !checkGameOver()) {
    event.target.textContent = currentPlayer;
    board[row][col] = currentPlayer;

    if (checkWinner(currentPlayer)) {
      alert(`O jogador ${currentPlayer} venceu!`);
      resetGame();
      return;
    }

    if (checkDraw()) {
      alert("Empate!");
      resetGame();
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    // Se o computador estiver jogando (dificuldade média ou difícil)
    if (currentPlayer === "O") {
      setTimeout(computerMove, 500);
    }
  }
}

// Função para resetar o jogo
function resetGame() {
  board = [];
  currentPlayer = "X";
  createBoard();
}

//#endregion

//#region Movimento do Computador

// Função para a jogada do computador
function computerMove() {
  if (currentPlayer !== "O") {
    return;
  }

  computerMoveStrategy(difficulty);
}

// Função para a estratégia de jogada do computador
function computerMoveStrategy(difficulty) {
  switch (difficulty) {
    case "easy":
      // Jogada aleatória (nível fácil)
      makeRandomMove();
      break;
    case "medium":
      // Jogada aleatória entre fácil e dificil.
      makeMediumMove();
      break;
    case "hard":
      // Jogada de nível dificil.
      makeHardMove();
      break;
  }
}

// Função para a jogada do computador (nível "hard")
function computerMoveHard() {
  if (currentPlayer !== "O") {
    return;
  }

  makeHardMove();
}
//#endregion

// Iniciar o jogo quando a página carregar
window.onload = startGame;