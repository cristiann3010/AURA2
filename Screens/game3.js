import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ImageBackground,
  StatusBar
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
    <View style={styles.container}>
      <StatusBar backgroundColor="#2d004d" barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}> Jogo da Velha</Text>
          
         
        </View>
      </SafeAreaView>

      <View style={styles.scoreBoard}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>VOCÊ</Text>
          <Text style={styles.scoreValue}>{score.player}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>EMPATES</Text>
          <Text style={styles.scoreValue}>{score.draws}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>LUA</Text>
          <Text style={styles.scoreValue}>{score.bot}</Text>
        </View>
      </View>

      <ImageBackground
        source={require('../assets/batata.jpeg')}
        style={styles.gameArea}
        resizeMode="cover"
      >
        <View style={styles.gameOverlay}>
          <View style={styles.content}>
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
                  <Text style={styles.startDescription}>
                    Você é a Coruja {'\n'}
                    Jogue contra a Lua 
                  </Text>
                  <TouchableOpacity 
                    style={styles.startButton}
                    onPress={startGame}
                  >
                    <Text style={styles.startButtonText}>COMEÇAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

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
        </View>
      </ImageBackground>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0033",
  },
  safeArea: {
    backgroundColor: '#2d004d',
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
    marginTop: 30,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 21,
    includeFontPadding: false,
  },
  title: {
    color: '#e9d5ff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  resetButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(45, 0, 77, 0.9)',
    margin: 15,
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#c4b5fd',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  scoreValue: {
    color: '#8b5cf6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8b5cf6',
    overflow: 'hidden',
  },
  gameOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 0, 51, 0.3)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  statusContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    padding: 12,
    borderRadius: 15,
    marginBottom: 20,
    minWidth: '80%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  board: {
    backgroundColor: 'rgba(45, 0, 77, 0.8)',
    padding: 10,
    borderRadius: 15,
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
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    margin: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  playerCell: {
    backgroundColor: 'rgba(139, 92, 246, 0.5)',
  },
  botCell: {
    backgroundColor: 'rgba(139, 92, 246, 0.4)',
  },
  cellText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  startOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(45, 0, 77, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  startContent: {
    alignItems: 'center',
    padding: 30,
  },
  emojiLarge: {
    fontSize: 70,
    marginBottom: 15,
  },
  startTitle: {
    color: '#e9d5ff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  startDescription: {
    color: '#c4b5fd',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#a78bfa',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  controls: {
    width: '100%',
    marginTop: 10,
  },
  controlButton: {
    backgroundColor: '#8b5cf6',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#a78bfa',
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
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#e9d5ff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  modalMessage: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalButtons: {
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#8b5cf6',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#a78bfa',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});