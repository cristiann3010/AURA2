// ElephantGame.js - Jogo do Elefante Comilão MELHORADO
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Image,
  Animated,
  Dimensions,
  Easing
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ElephantGame({ navigation }) {
  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [elephantHappy, setElephantHappy] = useState(false);
  const [gameActive, setGameActive] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  
  // Animações do elefante
  const elephantScale = useRef(new Animated.Value(1)).current;
  const elephantBounce = useRef(new Animated.Value(0)).current;
  const victoryAnimation = useRef(new Animated.Value(0)).current;

  // Tipos de frutas disponíveis
  const fruitTypes = [
    { type: 'mushroom', image: require('../assets/morango.png.png') },
    { type: 'owl', image: require('../assets/melancia.png.png') },
    { type: 'star', image: require('../assets/maca2.png') },
    { type: 'monkey', image: require('../assets/banana.png.png') },
  ];

  // Posições pré-definidas para as frutas (DENTRO DOS LIMITES DA TELA)
  const predefinedPositions = [
    // Linha superior - DENTRO DOS LIMITES
    { x: width * 0.2, y: height * 0.15 },
    { x: width * 0.5, y: height * 0.12 },
    { x: width * 0.8, y: height * 0.15 },
    
    // Linha do meio superior - DENTRO DOS LIMITES
    { x: width * 0.2, y: height * 0.25 },
    { x: width * 0.4, y: height * 0.22 },
    { x: width * 0.6, y: height * 0.22 },
    { x: width * 0.8, y: height * 0.25 },
    
    // Linha do meio - DENTRO DOS LIMITES
    { x: width * 0.3, y: height * 0.35 },
    { x: width * 0.5, y: height * 0.32 },
    { x: width * 0.7, y: height * 0.35 },
    
    // Posições centrais - SEMPRE DENTRO DA TELA
    { x: width * 0.15, y: height * 0.2 },
    { x: width * 0.85, y: height * 0.2 },
    { x: width * 0.25, y: height * 0.28 },
    { x: width * 0.75, y: height * 0.28 },
    
    // Posições mais centralizadas
    { x: width * 0.35, y: height * 0.18 },
    { x: width * 0.65, y: height * 0.18 },
    { x: width * 0.1, y: height * 0.3 },
    { x: width * 0.9, y: height * 0.3 },
  ];

  // Criar uma nova fruta
  const createFruit = () => {
    const randomFruit = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
    const randomPosition = predefinedPositions[Math.floor(Math.random() * predefinedPositions.length)];

    // Aumentar o tamanho da melancia
    const isWatermelon = randomFruit.type === 'owl';
    const fruitSize = isWatermelon ? 120 : 100; // Melancia maior que outras frutas

    return {
      id: Math.random().toString(),
      type: randomFruit.type,
      image: randomFruit.image,
      position: randomPosition,
      scale: new Animated.Value(0),
      rotation: new Animated.Value(0),
      bounce: new Animated.Value(0),
      visible: true,
      size: fruitSize, // Tamanho personalizado
    };
  };

  // Animação de entrada da fruta
  const animateFruitIn = (fruit) => {
    return Animated.parallel([
      Animated.timing(fruit.scale, {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(fruit.bounce, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);
  };

  // Animação de saída da fruta (quando o tempo acaba)
  const animateFruitOut = (fruit) => {
    return Animated.sequence([
      Animated.timing(fruit.scale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fruit.scale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);
  };

  // Animação do elefante feliz
  const animateHappyElephant = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(elephantScale, {
          toValue: 1.2,
          duration: 200,
          easing: Easing.elastic(1.5),
          useNativeDriver: true,
        }),
        Animated.timing(elephantScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(elephantBounce, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(elephantBounce, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  // Animação de vitória
  const animateVictory = () => {
    Animated.sequence([
      Animated.timing(victoryAnimation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Inicializar o jogo
  const initializeGame = () => {
    setFruits([]);
    setScore(0);
    setElephantHappy(false);
    setGameActive(true);
    setGameWon(false);
    
    // Reset animações
    elephantScale.setValue(1);
    elephantBounce.setValue(0);
    victoryAnimation.setValue(0);
  };

  // Sistema de spawn de frutas
  useEffect(() => {
    if (!gameActive || gameWon) return;

    let currentFruit = null;
    let fruitTimeout = null;
    let disappearTimeout = null;

    const spawnFruit = () => {
      // Criar nova fruta
      const newFruit = createFruit();
      currentFruit = newFruit;
      
      setFruits([newFruit]);

      // Animação de entrada
      animateFruitIn(newFruit).start();

      // Configurar desaparecimento após 2 SEGUNDOS
      disappearTimeout = setTimeout(() => {
        if (newFruit.visible) {
          animateFruitOut(newFruit).start(() => {
            setFruits([]);
            fruitTimeout = setTimeout(spawnFruit, 500);
          });
        }
      }, 2000);
    };

    spawnFruit();

    return () => {
      if (fruitTimeout) clearTimeout(fruitTimeout);
      if (disappearTimeout) clearTimeout(disappearTimeout);
    };
  }, [gameActive, score, gameWon]);

  // Animação da fruta sendo comida
  const animateFruitEaten = (fruit) => {
    fruit.visible = false;
    return Animated.parallel([
      Animated.sequence([
        Animated.timing(fruit.scale, {
          toValue: 1.4,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fruit.scale, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fruit.rotation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);
  };

  // Alimentar o elefante
  const feedElephant = (fruitId) => {
    if (!gameActive || gameWon) return;

    const fruitToRemove = fruits.find(fruit => fruit.id === fruitId);
    if (fruitToRemove && fruitToRemove.visible) {
      animateFruitEaten(fruitToRemove).start(() => {
        const newScore = score + 10;
        setScore(newScore);
        
        setElephantHappy(true);
        animateHappyElephant();
        setTimeout(() => setElephantHappy(false), 800);

        setFruits([]);

        // Verificar vitória
        if (newScore >= 200) {
          setGameActive(false);
          setGameWon(true);
          animateVictory();
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* BACKGROUND COM OPACIDADE REDUZIDA */}
      <ImageBackground 
        source={require('../assets/f2.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* OVERLAY PARA DIMINUIR OPACIDADE */}
        <View style={styles.backgroundOverlay} />
      </ImageBackground>
      
      <StatusBar backgroundColor="#2d004d" barStyle="light-content" />
      
      {/* HEADER FIXA NO TOPO */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Elefante comilão</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      {/* CONTEÚDO DO JOGO */}
      <View style={styles.content}>
        
        {/* PLACAR */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Pontuação: {score}/200</Text>
          <Text style={styles.instruction}>
            {gameActive && !gameWon
              ? "Toque nos itens antes que desapareçam!" 
              : gameWon ? "🎉 Parabéns! 🎉" : "Jogo concluído! 🎉"
            }
          </Text>
          <Text style={styles.timerText}>
            {fruits.length > 0 && fruits[0].visible && !gameWon ? "⏰ Rápido! 2 segundos!" : ""}
          </Text>
        </View>

        {/* TELA DE VITÓRIA */}
        {gameWon && (
          <Animated.View 
            style={[
              styles.victoryContainer,
              {
                opacity: victoryAnimation,
                transform: [
                  {
                    scale: victoryAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.victoryContent}>
              <Image 
                source={require('../assets/elefeliz.png')}
                style={styles.victoryElephant}
                resizeMode="contain"
              />
              <Text style={styles.victoryTitle}>🎉 Parabéns! 🎉</Text>
              <Text style={styles.victoryText}>
                Você alimentou muito bem o elefante! 🐘
              </Text>
              <Text style={styles.victoryScore}>
                Pontuação final: {score} pontos
              </Text>
              <TouchableOpacity 
                style={styles.playAgainButton}
                onPress={initializeGame}
              >
                <Text style={styles.playAgainText}>Jogar Novamente</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* ÁREA DAS FRUTAS - DELIMITADA */}
        {!gameWon && (
          <View style={styles.gameArea}>
            <View style={styles.delimitedArea} />
            
            {fruits.map((fruit) => {
              const rotateInterpolate = fruit.rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              });

              const bounceInterpolate = fruit.bounce.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15],
              });

              const fruitSize = fruit.size || 100;
              const isWatermelon = fruit.type === 'owl';

              return (
                <TouchableOpacity
                  key={fruit.id}
                  style={[
                    styles.fruitContainer,
                    {
                      left: fruit.position.x - fruitSize / 2,
                      top: fruit.position.y - fruitSize / 2,
                      width: fruitSize,
                      height: fruitSize,
                    }
                  ]}
                  onPress={() => feedElephant(fruit.id)}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={[
                      styles.fruit,
                      {
                        width: fruitSize - 10,
                        height: fruitSize - 10,
                        transform: [
                          { scale: fruit.scale },
                          { rotate: rotateInterpolate },
                          { translateY: bounceInterpolate },
                        ],
                      }
                    ]}
                  >
                    <Image 
                      source={fruit.image} 
                      style={[
                        styles.fruitImage,
                        isWatermelon && styles.watermelonImage
                      ]}
                      resizeMode="contain"
                    />
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ELEFANTE */}
        {!gameWon && (
          <View style={styles.elephantContainer}>
            <Animated.View
              style={{
                transform: [
                  { scale: elephantScale },
                  { translateY: elephantBounce },
                ],
              }}
            >
              <Image 
                source={
                  elephantHappy 
                    ? require('../assets/elefeliz.png')
                    : require('../assets/eletriste.png')
                }
                style={styles.elephantImage}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Ajuste a opacidade aqui
    // Para escurecer em vez de clarear, use:
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  content: {
    flex: 1,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(45, 0, 77, 0.7)',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  instruction: {
    color: '#e6ccff',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  timerText: {
    color: '#ffeb3b',
    fontSize: 12,
    marginTop: 3,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  delimitedArea: {
    position: 'absolute',
    top: height * 0.1,
    left: width * 0.1,
    right: width * 0.1,
    height: height * 0.3,
    borderRadius: 10,
  },
  fruitContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  fruit: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fruitImage: {
    width: '100%',
    height: '100%',
  },
  watermelonImage: {
    // A melancia já está maior por padrão devido ao size
  },
  elephantContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  elephantImage: {
    width: 250,
    height: 200,
  },
  // NOVOS ESTILOS PARA TELA DE VITÓRIA
  victoryContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(45, 0, 77, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  victoryContent: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(96, 53, 196, 0.3)',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8b5cf6',
    marginHorizontal: 20,
  },
  victoryElephant: {
    width: 200,
    height: 180,
    marginBottom: 20,
  },
  victoryTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  victoryText: {
    color: '#e6ccff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  victoryScore: {
    color: '#660663ff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  playAgainButton: {
    backgroundColor: '#370459ff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#4b00bcff',
    shadowColor: '#9370db',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  playAgainText: {
    color: '#e0e0ff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(147, 112, 219, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});