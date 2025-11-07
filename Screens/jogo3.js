// Jogo3.js - Jogo da Velha com Tema da Coruja
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
  ImageBackground,
  Image
} from "react-native";

export default function Jogo3({ navigation }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerSymbol, setPlayerSymbol] = useState("🦉"); // Coruja para jogador
  const [botSymbol, setBotSymbol] = useState("🌙"); // Lua para bot
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ player: 0, bot: 0, draws: 0 });
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Inicializar jogo
  useEffect(() => {
    if (gameStarted) {
      resetGame();
    }
  }, [gameStarted]);

  // Verificar vitória após cada jogada
  useEffect(() => {
    if (gameStarted) {
      checkWinner();
    }
  }, [board]);

  // Função para verificar se há um vencedor
  const checkWinner = () => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
      [0, 4, 8], [2, 4, 6] // diagonais
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setGameOver(true);
        
        // Atualizar placar
        if (board[a] === playerSymbol) {
          setScore(prev => ({ ...prev, player: prev.player + 1 }));
        } else {
          setScore(prev => ({ ...prev, bot: prev.bot + 1 }));
        }
        
        setShowGameOverModal(true);
        return;
      }
    }

    // Verificar empate
    if (!board.includes(null) && !winner && gameStarted) {
      setWinner("Empate");
      setGameOver(true);
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      setShowGameOverModal(true);
    }
  };

  // Jogada do jogador
  const handlePlayerMove = (index) => {
    if (!gameStarted || board[index] || !isPlayerTurn || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    setIsPlayerTurn(false);

    // Bot joga após um pequeno delay
    setTimeout(() => {
      if (!gameOver && newBoard.includes(null)) {
        botMove(newBoard);
      }
    }, 800); // Delay maior para parecer que o bot está "pensando"
  };

  // Jogada do bot (aleatória)
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

  // Reiniciar jogo
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
    setShowGameOverModal(false);
  };

  // Nova partida (mantém o placar)
  const newGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
    setShowGameOverModal(false);
  };

  // Iniciar o jogo pela primeira vez
  const startGame = () => {
    setGameStarted(true);
    resetGame();
  };

  // Renderizar célula do tabuleiro
  const renderCell = (index) => {
    const cellValue = board[index];
    let cellStyle = styles.cell;
    let textStyle = styles.cellText;

    if (cellValue === playerSymbol) {
      cellStyle = { ...cellStyle, ...styles.playerCell };
      textStyle = { ...textStyle, ...styles.playerText };
    } else if (cellValue === botSymbol) {
      cellStyle = { ...cellStyle, ...styles.botCell };
      textStyle = { ...textStyle, ...styles.botText };
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

  // Determinar mensagem de status
  const getStatusMessage = () => {
    if (!gameStarted) return "🦉 Toque em Iniciar Caçada!";
    if (gameOver) {
      if (winner === playerSymbol) return "🎉 Coruja Venceu!";
      if (winner === botSymbol) return "🌙 Lua Venceu!";
      if (winner === "Empate") return "🤝 Caçada Empatada!";
    }
    return isPlayerTurn ? "Sua vez 🦉" : "Vez da Lua 🌙";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.owlEmoji}>🦉</Text>
          <Text style={styles.title}>Caçada da Coruja</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={resetGame}
        >
          <Text style={styles.resetButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Placar com tema de coruja */}
        <View style={styles.scoreBoard}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreEmoji}>🦉</Text>
            <Text style={styles.scoreLabel}>Coruja</Text>
            <Text style={styles.scoreValue}>{score.player}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreEmoji}>🤝</Text>
            <Text style={styles.scoreLabel}>Empates</Text>
            <Text style={styles.scoreValue}>{score.draws}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreEmoji}>🌙</Text>
            <Text style={styles.scoreLabel}>Lua</Text>
            <Text style={styles.scoreValue}>{score.bot}</Text>
          </View>
        </View>

        {/* Status do jogo */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{getStatusMessage()}</Text>
        </View>

        {/* Área do jogo com background4.png */}
        <ImageBackground
          source={require('../assets/background4.png')}
          style={styles.gameArea}
          imageStyle={styles.gameAreaImage}
          resizeMode="cover"
        >
          {/* Tabuleiro transparente sobre o background */}
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

          {/* Tela de início */}
          {!gameStarted && (
            <View style={styles.startOverlay}>
              <View style={styles.startContent}>
                <Text style={styles.owlLarge}>🦉</Text>
                <Text style={styles.startTitle}>Caçada da Coruja</Text>
                <Text style={styles.startSubtitle}>Jogo da Velha Noturno</Text>
                <Text style={styles.startDescription}>
                  Use sua sabedoria de coruja para vencer a Lua!
                </Text>
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={startGame}
                >
                  <Text style={styles.startButtonText}>🦉 INICIAR CAÇADA</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ImageBackground>

        {/* Controles */}
        <View style={styles.controls}>
          {gameStarted ? (
            <>
              <TouchableOpacity 
                style={[styles.controlButton, styles.huntButton]}
                onPress={newGame}
              >
                <Text style={styles.controlButtonText}>🦉 Nova Caçada</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlButton, styles.resetScoreButton]}
                onPress={() => {
                  setScore({ player: 0, bot: 0, draws: 0 });
                  Alert.alert("Placar Zerado", "A floresta esquecerá suas caçadas!");
                }}
              >
                <Text style={styles.controlButtonText}>🌌 Zerar Placar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[styles.controlButton, styles.startButton]}
              onPress={startGame}
            >
              <Text style={styles.controlButtonText}>🦉 Começar Caçada</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Instruções temáticas */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>🌙 Como Caçar:</Text>
          <Text style={styles.instructionsText}>
            • Toque em um espaço vazio como a coruja{'\n'}
            • Forme uma linha de 3 corujas para vencer{'\n'}
            • A Lua jogará automaticamente contra você{'\n'}
            • Use sua sabedoria noturna para vencer!
          </Text>
        </View>
      </View>

      {/* Modal de Fim de Jogo com tema noturno */}
      <Modal
        visible={showGameOverModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <ImageBackground
            source={require('../assets/background4.png')}
            style={styles.modalBackground}
            imageStyle={styles.modalBackgroundImage}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🌌 Fim da Caçada!</Text>
              
              <View style={styles.resultContainer}>
                {winner === playerSymbol && (
                  <>
                    <Text style={styles.owlVictory}>🦉</Text>
                    <Text style={styles.modalMessage}>A Coruja Venceu!</Text>
                    <Text style={styles.victoryText}>Sua sabedoria noturna prevaleceu!</Text>
                  </>
                )}
                {winner === botSymbol && (
                  <>
                    <Text style={styles.moonVictory}>🌙</Text>
                    <Text style={styles.modalMessage}>A Lua Venceu!</Text>
                    <Text style={styles.defeatText}>A noite pertence à lua desta vez!</Text>
                  </>
                )}
                {winner === "Empate" && (
                  <>
                    <Text style={styles.drawEmoji}>🤝</Text>
                    <Text style={styles.modalMessage}>Caçada Empatada!</Text>
                    <Text style={styles.drawText}>Coruja e Lua estão em harmonia!</Text>
                  </>
                )}
              </View>

              <View style={styles.scoreSummary}>
                <Text style={styles.scoreSummaryText}>
                  🦉 {score.player} - {score.draws} - {score.bot} 🌙
                </Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.primaryButton]}
                  onPress={newGame}
                >
                  <Text style={styles.modalButtonText}>🦉 Nova Caçada</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.secondaryButton]}
                  onPress={() => {
                    setShowGameOverModal(false);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.modalButtonText}>Voltar ao Ninho</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0015",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1a0033',
    borderBottomWidth: 3,
    borderBottomColor: '#8B4513',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#D2691E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  owlEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    color: '#F4A460',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(139, 69, 19, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  resetButton: {
    padding: 8,
  },
  resetButtonText: {
    color: '#D2691E',
    fontSize: 18,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#8B4513',
    shadowColor: '#D2691E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreEmoji: {
    fontSize: 20,
    marginBottom: 5,
  },
  scoreLabel: {
    color: '#DEB887',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scoreValue: {
    color: '#F4A460',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statusContainer: {
    backgroundColor: 'rgba(139, 69, 19, 0.4)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#D2691E',
    minWidth: '80%',
    alignItems: 'center',
    shadowColor: '#D2691E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  gameArea: {
    width: '100%',
    height: 350,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#8B4513',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#D2691E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  gameAreaImage: {
    borderRadius: 16,
    opacity: 0.9,
  },
  board: {
    flex: 1,
    backgroundColor: 'rgba(10, 0, 21, 0.7)',
    padding: 15,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    margin: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(210, 105, 30, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  playerCell: {
    backgroundColor: 'rgba(139, 69, 19, 0.6)',
    borderColor: '#F4A460',
    shadowColor: '#F4A460',
    shadowOpacity: 0.6,
  },
  botCell: {
    backgroundColor: 'rgba(70, 130, 180, 0.6)',
    borderColor: '#87CEEB',
    shadowColor: '#87CEEB',
    shadowOpacity: 0.6,
  },
  cellText: {
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  playerText: {
    color: '#F4A460',
    fontSize: 36,
  },
  botText: {
    color: '#87CEEB',
    fontSize: 36,
  },
  startOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 0, 21, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startContent: {
    alignItems: 'center',
    padding: 30,
  },
  owlLarge: {
    fontSize: 80,
    marginBottom: 15,
    textShadowColor: 'rgba(244, 164, 96, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  startTitle: {
    color: '#F4A460',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(139, 69, 19, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  startSubtitle: {
    color: '#DEB887',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  startDescription: {
    color: '#CD853F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#D2691E',
    shadowColor: '#F4A460',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D2691E',
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  huntButton: {
    backgroundColor: '#8B4513',
    borderColor: '#D2691E',
  },
  resetScoreButton: {
    backgroundColor: 'rgba(70, 130, 180, 0.6)',
    borderColor: '#87CEEB',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  instructions: {
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#D2691E',
    width: '100%',
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  instructionsTitle: {
    color: '#F4A460',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  instructionsText: {
    color: '#DEB887',
    fontSize: 13,
    lineHeight: 18,
  },
  // Estilos do Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackgroundImage: {
    opacity: 0.8,
  },
  modalContent: {
    backgroundColor: 'rgba(26, 0, 51, 0.95)',
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#8B4513',
    padding: 30,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#F4A460',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    color: '#F4A460',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(139, 69, 19, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  owlVictory: {
    fontSize: 60,
    marginBottom: 10,
  },
  moonVictory: {
    fontSize: 60,
    marginBottom: 10,
  },
  drawEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  modalMessage: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  victoryText: {
    color: '#F4A460',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  defeatText: {
    color: '#87CEEB',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  drawText: {
    color: '#DEB887',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  scoreSummary: {
    backgroundColor: 'rgba(139, 69, 19, 0.4)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#D2691E',
  },
  scoreSummaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  modalButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  primaryButton: {
    backgroundColor: '#8B4513',
    borderColor: '#D2691E',
  },
  secondaryButton: {
    backgroundColor: 'rgba(70, 130, 180, 0.7)',
    borderColor: '#87CEEB',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});