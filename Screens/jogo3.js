import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  Modal
} from "react-native";

export default function Jogo3({ navigation }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerSymbol, setPlayerSymbol] = useState("🦉");
  const [botSymbol, setBotSymbol] = useState("🌙");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ player: 0, bot: 0, draws: 0 });
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      resetGame();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      checkWinner();
    }
  }, [board]);

  const checkWinner = () => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setGameOver(true);
        
        if (board[a] === playerSymbol) {
          setScore(prev => ({ ...prev, player: prev.player + 1 }));
        } else {
          setScore(prev => ({ ...prev, bot: prev.bot + 1 }));
        }
        
        setShowGameOverModal(true);
        return;
      }
    }

    if (!board.includes(null) && !winner && gameStarted) {
      setWinner("Empate");
      setGameOver(true);
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      setShowGameOverModal(true);
    }
  };

  const handlePlayerMove = (index) => {
    if (!gameStarted || board[index] || !isPlayerTurn || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    setIsPlayerTurn(false);

    setTimeout(() => {
      if (!gameOver && newBoard.includes(null)) {
        botMove(newBoard);
      }
    }, 500);
  };

  const botMove = (currentBoard) => {
    if (gameOver) return;

    const emptyCells = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter(cell => cell !== null);

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const botIndex = emptyCells[randomIndex];
      
      const newBoard = [...currentBoard];
      newBoard[botIndex] = botSymbol;
      setBoard(newBoard);
      setIsPlayerTurn(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
    setShowGameOverModal(false);
  };

  const newGame = () => {
    resetGame();
  };

  const startGame = () => {
    setGameStarted(true);
    resetGame();
  };

  const renderCell = (index) => {
    const cellValue = board[index];
    let cellStyle = styles.cell;
    let textStyle = styles.cellText;

    if (cellValue === playerSymbol) {
      cellStyle = { ...cellStyle, ...styles.playerCell };
    } else if (cellValue === botSymbol) {
      cellStyle = { ...cellStyle, ...styles.botCell };
    }

    return (
      <TouchableOpacity
        style={cellStyle}
        onPress={() => handlePlayerMove(index)}
        disabled={!isPlayerTurn || gameOver || !gameStarted}
      >
        <Text style={textStyle}>{cellValue}</Text>
      </TouchableOpacity>
    );
  };

  const getStatusMessage = () => {
    if (!gameStarted) return "Toque em Iniciar Jogo!";
    if (gameOver) {
      if (winner === playerSymbol) return "Você Venceu! 🎉";
      if (winner === botSymbol) return "A Lua Venceu!";
      return "Empate! 🤝";
    }
    return isPlayerTurn ? "Sua vez 🦉" : "Vez da Lua 🌙";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Jogo da Velha</Text>
        
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={resetGame}
        >
          <Text style={styles.resetButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.scoreBoard}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Você</Text>
            <Text style={styles.scoreValue}>{score.player}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Empates</Text>
            <Text style={styles.scoreValue}>{score.draws}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Lua</Text>
            <Text style={styles.scoreValue}>{score.bot}</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{getStatusMessage()}</Text>
        </View>

        <View style={styles.board}>
          <View style={styles.row}>
            {renderCell(0)}
            {renderCell(1)}
            {renderCell(2)}
          </View>
          <View style={styles.row}>
            {renderCell(3)}
            {renderCell(4)}
            {renderCell(5)}
          </View>
          <View style={styles.row}>
            {renderCell(6)}
            {renderCell(7)}
            {renderCell(8)}
          </View>
        </View>

        {!gameStarted && (
          <View style={styles.startOverlay}>
            <View style={styles.startContent}>
              <Text style={styles.emojiLarge}>🦉</Text>
              <Text style={styles.startTitle}>Jogo da Velha</Text>
              <TouchableOpacity 
                style={styles.startButton}
                onPress={startGame}
              >
                <Text style={styles.startButtonText}>INICIAR JOGO</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* REMOVIDO O BOTÃO DUPLICADO - AGORA SÓ APARECE O BOTÃO "NOVO JOGO" DURANTE O JOGO */}
        {gameStarted && (
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={newGame}
            >
              <Text style={styles.controlButtonText}>NOVO JOGO</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal visible={showGameOverModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fim do Jogo!</Text>
            
            <View style={styles.resultContainer}>
              {winner === playerSymbol && (
                <>
                  <Text style={styles.emojiLarge}>🎉</Text>
                  <Text style={styles.modalMessage}>Você Venceu!</Text>
                </>
              )}
              {winner === botSymbol && (
                <>
                  <Text style={styles.emojiLarge}>🌙</Text>
                  <Text style={styles.modalMessage}>A Lua Venceu!</Text>
                </>
              )}
              {winner === "Empate" && (
                <>
                  <Text style={styles.emojiLarge}>🤝</Text>
                  <Text style={styles.modalMessage}>Empate!</Text>
                </>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={newGame}
              >
                <Text style={styles.modalButtonText}>JOGAR NOVAMENTE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0033",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2d004d',
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#a78bfa',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: '#e9d5ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    padding: 8,
  },
  resetButtonText: {
    color: '#a78bfa',
    fontSize: 18,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#c4b5fd',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scoreValue: {
    color: '#e9d5ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    minWidth: '80%',
    alignItems: 'center',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  board: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  playerCell: {
    backgroundColor: 'rgba(139, 92, 246, 0.4)',
  },
  botCell: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  cellText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  startOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 0, 51, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startContent: {
    alignItems: 'center',
    padding: 30,
  },
  emojiLarge: {
    fontSize: 60,
    marginBottom: 15,
  },
  startTitle: {
    color: '#e9d5ff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 200,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    width: '100%',
    marginTop: 10,
  },
  controlButton: {
    backgroundColor: '#8b5cf6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d004d',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    padding: 25,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#e9d5ff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalMessage: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtons: {
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#8b5cf6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});