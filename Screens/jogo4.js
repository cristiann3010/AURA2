// ElephantMemory.js - Jogo da Memória do Elefante
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

// CONFIGURAÇÃO FÁCIL DE TROCAR AS IMAGENS
const GAME_CONFIG = {
  totalRounds: 5,
  
  // TODAS AS IMAGENS DISPONÍVEIS (adicione quantas quiser)
  allImages: [
    require('../assets/eleOi3.png'), // ← TROQUE AQUI
    require('../assets/eleOi2.png'), // ← TROQUE AQUI
    require('../assets/eleOi.png'), // ← TROQUE AQUI
    require('../assets/eletriste.png'), // ← TROQUE AQUI
    require('../assets/elefeliz.png'), // ← TROQUE AQUI
    require('../assets/fds1.png'), // ← TROQUE AQUI
    require('../assets/fds2.png'), // ← TROQUE AQUI
    require('../assets/fds3.png'), // ← TROQUE AQUI
  ],
};

export default function ElephantMemory({ navigation }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentTargetImage, setCurrentTargetImage] = useState(null);
  const [options, setOptions] = useState([]);

  // Configurações por rodada - mais opções conforme avança
  const roundConfig = [
    { optionsCount: 3 }, // Rodada 1: 3 opções
    { optionsCount: 4 }, // Rodada 2: 4 opções  
    { optionsCount: 5 }, // Rodada 3: 5 opções
    { optionsCount: 6 }, // Rodada 4: 6 opções
    { optionsCount: 8 }, // Rodada 5: 8 opções
  ];

  // Embaralhar array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Preparar rodada
  const setupRound = (round) => {
    const config = roundConfig[round];
    
    // Embaralhar todas as imagens disponíveis
    const shuffledImages = shuffleArray(GAME_CONFIG.allImages);
    
    // Pegar a imagem alvo (primeira da lista embaralhada)
    const targetImage = shuffledImages[0];
    setCurrentTargetImage(targetImage);
    
    // Pegar imagens para as opções (incluindo a correta)
    const availableOptions = shuffledImages.slice(0, config.optionsCount);
    
    // Se a imagem alvo não estiver nas opções, substituir a última
    if (!availableOptions.includes(targetImage)) {
      availableOptions[availableOptions.length - 1] = targetImage;
    }
    
    // Embaralhar as opções
    const finalOptions = shuffleArray(availableOptions);
    setOptions(finalOptions);
  };

  // Iniciar jogo
  const startGame = () => {
    setCurrentRound(0);
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
    setupRound(0);
  };

  // Verificar resposta
  const checkAnswer = (selectedImage) => {
    if (selectedImage === currentTargetImage) {
      // Resposta correta
      const newScore = score + 1;
      setScore(newScore);
      
      // Verificar se é a última rodada
      if (currentRound + 1 >= GAME_CONFIG.totalRounds) {
        setGameOver(true);
      } else {
        // Próxima rodada
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        setupRound(nextRound);
      }
    } else {
      // Resposta errada - game over
      Alert.alert(
        '❌ Oops!',
        'Esta não é a imagem igual! Tente novamente.',
        [
          {
            text: 'Recomeçar',
            onPress: startGame
          }
        ]
      );
    }
  };

  // Tela de vitória compacta
  const VictoryScreen = () => (
    <View style={styles.victoryContainer}>
      <View style={styles.victoryContent}>
        <Text style={styles.confetti}>🎉🎊</Text>
        
        <Image 
          source={require('../assets/elefeliz.png')}
          style={styles.victoryElephant}
          resizeMode="contain"
        />
        
        <Text style={styles.victoryTitle}>PARABÉNS!</Text>
        <Text style={styles.victorySubtitle}>
          Todas as rodadas completas!
        </Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>ACERTOS</Text>
          <Text style={styles.scoreValue}>{score}<Text style={styles.scoreTotal}>/{GAME_CONFIG.totalRounds}</Text></Text>
        </View>

        <View style={styles.performance}>
          <Text style={styles.performanceText}>
            {score === GAME_CONFIG.totalRounds ? '🌟 PERFEITO!' : 
             score >= GAME_CONFIG.totalRounds - 1 ? '🎯 ÓTIMO!' : 
             '👍 MUITO BOM!'}
          </Text>
        </View>

        <View style={styles.victoryButtons}>
          <TouchableOpacity 
            style={[styles.victoryButton, styles.restartButton]}
            onPress={startGame}
          >
            <Text style={styles.victoryButtonText}>Jogar Novamente</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.victoryButton, styles.exitButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.victoryButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2d004d" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🐘 Encontre o Igual</Text>
        <View style={styles.headerSpacer} />
      </View>

      {!gameStarted ? (
        // Tela inicial simplificada
        <View style={styles.startScreen}>
          <Image 
            source={require('../assets/elefeliz.png')}
            style={styles.startElephant}
            resizeMode="contain"
          />
          
          <Text style={styles.startTitle}>Encontre o Igual</Text>
          <Text style={styles.startDescription}>
            Clique na imagem igual à de cima{'\n'}
            e complete todas as rodadas!
          </Text>

          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>JOGAR</Text>
          </TouchableOpacity>
        </View>
      ) : gameOver ? (
        // Tela de vitória
        <VictoryScreen />
      ) : (
        // Jogo ativo
        <View style={styles.gameArea}>
          {/* Info do jogo */}
          <View style={styles.gameInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>RODADA</Text>
              <Text style={styles.infoValue}>{currentRound + 1}<Text style={styles.infoTotal}>/{GAME_CONFIG.totalRounds}</Text></Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>ACERTOS</Text>
              <Text style={styles.infoValue}>{score}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>OPÇÕES</Text>
              <Text style={styles.infoValue}>{roundConfig[currentRound].optionsCount}</Text>
            </View>
          </View>

          {/* Imagem alvo no topo */}
          <View style={styles.targetContainer}>
            <Text style={styles.targetTitle}>ENCONTRE ESTA IMAGEM:</Text>
            <View style={styles.targetImageWrapper}>
              <Image 
                source={currentTargetImage}
                style={styles.targetImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Opções de resposta */}
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}></Text>
            <View style={[
              styles.optionsGrid,
              roundConfig[currentRound].optionsCount <= 4 && styles.optionsGridSmall,
              roundConfig[currentRound].optionsCount > 4 && styles.optionsGridLarge
            ]}>
              {options.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => checkAnswer(image)}
                >
                  <Image 
                    source={image}
                    style={styles.optionImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#2d004d',
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
    marginTop: 20,
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
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  startElephant: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  startTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  startDescription: {
    fontSize: 18,
    color: '#e6ccff',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#b366ff',
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#e6ccff',
    shadowColor: '#b366ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  startButtonText: {
    color: '#1a0033',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  gameArea: {
    flex: 1,
    padding: 20,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    color: '#e6ccff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoValue: {
    color: '#b366ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoTotal: {
    color: '#e6ccff',
    fontSize: 14,
  },
  targetContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  targetTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  targetImageWrapper: {
    width: width * 0.5,
    height: width * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#b366ff',
    padding: 10,
  },
  targetImage: {
    width: '90%',
    height: '90%',
  },
  optionsContainer: {
    flex: 1,
  },
  optionsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  optionsGridSmall: {
    // Para 3-4 opções
  },
  optionsGridLarge: {
    // Para 5+ opções
    gap: 10,
  },
  optionButton: {
    width: width * 0.24, // DIMINUÍDO de 0.28 para 0.24
    height: width * 0.24, // DIMINUÍDO de 0.28 para 0.24
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18, // DIMINUÍDO de 20 para 18
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    margin: 4, // DIMINUÍDO de 5 para 4
  },
  optionImage: {
    width: '75%', // DIMINUÍDO de 85% para 75%
    height: '75%', // DIMINUÍDO de 85% para 75%
  },
  // TELA DE VITÓRIA COMPACTA
  victoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 0, 77, 0.95)',
    padding: 20,
  },
  victoryContent: {
    backgroundColor: '#2d004d',
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#b366ff',
    width: '90%',
    maxWidth: 380,
    shadowColor: '#b366ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
  },
  confetti: {
    fontSize: 20,
    marginBottom: 5,
  },
  victoryElephant: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  victoryTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(179, 102, 255, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  victorySubtitle: {
    fontSize: 16,
    color: '#e6ccff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  scoreContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(179, 102, 255, 0.5)',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#e6ccff',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#b366ff',
  },
  scoreTotal: {
    fontSize: 20,
    color: '#e6ccff',
  },
  performance: {
    marginBottom: 20,
  },
  performanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFE66D',
    textAlign: 'center',
  },
  victoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  victoryButton: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    minHeight: 50,
  },
  restartButton: {
    backgroundColor: '#560d9eff',
    borderColor: '#e6ccff',
  },
  exitButton: {
    backgroundColor: '#560d9eff',
    borderColor: '#e6ccff',
  },
  victoryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
});