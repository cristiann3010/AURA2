// MemoryGame.js - Jogo da Memória com Header Fixa
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Image,
  ImageBackground,
  SafeAreaView,
  Alert,
  Animated,
  StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');
const CARD_SIZE = (width - 80) / 3;

// Componente de carta individual com animação
function AnimatedCard({ card, isFlipped, onPress, disabled }) {
  const flipAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 180 : 0,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {/* Verso da carta (IMAGEM - fácil de trocar) */}
      <Animated.View style={[styles.card, styles.cardFace, frontAnimatedStyle]}>
        <View style={styles.cardBack}>
          <Image 
            source={require('../assets/elefantinho.png')}
            style={styles.cardBackImage}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* Frente da carta (imagem) */}
      <Animated.View style={[styles.card, styles.cardFace, styles.cardFlipped, backAnimatedStyle]}>
        <Image source={card.image} style={styles.cardImage} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function MemoryGame({ navigation }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  // Imagens diferentes para cada par
  const cardImages = [
    { id: 1, image: require('../assets/owl.png') },
    { id: 2, image: require('../assets/forest.png') },
    { id: 3, image: require('../assets/star.png') },
    { id: 4, image: require('../assets/mushroom.png') },
    { id: 5, image: require('../assets/leaf.png') },
    { id: 6, image: require('../assets/full-moon.png') },
  ];

  const initializeGame = () => {
    // Criar pares de cartas
    let gameCards = [];
    cardImages.forEach((item, index) => {
      gameCards.push(
        { id: index * 2, type: item.id, image: item.image, flipped: false },
        { id: index * 2 + 1, type: item.id, image: item.image, flipped: false }
      );
    });

    // Embaralhar
    gameCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardPress = (cardId) => {
    if (flipped.length >= 2 || flipped.includes(cardId) || matched.includes(cardId)) {
      return;
    }

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);
    setMoves(moves + 1);

    if (newFlipped.length === 2) {
      const firstId = newFlipped[0];
      const secondId = newFlipped[1];
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.type === secondCard.type) {
        // Match found
        setMatched([...matched, firstId, secondId]);
        setFlipped([]);
        
        // Check if game is complete
        if (matched.length + 2 === cards.length) {
          setTimeout(() => {
            Alert.alert(
              '🎉 Parabéns!',
              `Você completou o jogo em ${moves + 1} movimentos!`,
              [{ text: 'Jogar Novamente', onPress: initializeGame }]
            );
          }, 500);
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 800);
      }
    }
  };

  const isCardFlipped = (cardId) => {
    return flipped.includes(cardId) || matched.includes(cardId);
  };

  return (
    <ImageBackground 
      source={require('../assets/backelefante.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar backgroundColor="#2d004d" barStyle="light-content" />
      
      {/* ESTRUTURA FIXA NO TOPO - MESMA DAS OUTRAS TELAS */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jogo da Memória</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      {/* CONTEÚDO PRINCIPAL DO JOGO */}
      <View style={styles.content}>
        <View style={styles.gameBoard}>
          <View style={styles.cardsContainer}>
            {cards.map((card) => (
              <AnimatedCard
                key={card.id}
                card={card}
                isFlipped={isCardFlipped(card.id)}
                onPress={() => handleCardPress(card.id)}
                disabled={isCardFlipped(card.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={initializeGame}>
            <Text style={styles.resetButtonText}>Reiniciar Jogo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeArea: {
    backgroundColor: '#2d004d',
  },
  // 🔥 HEADER FIXA NO TOPO - MESMA ESTRUTURA DAS OUTRAS TELAS
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
  gameBoard: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    marginBottom: 15,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: '#000000ff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#430169ff',
    shadowColor: '#6a5acd',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 15,
    backfaceVisibility: 'hidden',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardFlipped: {
    backgroundColor: '#4a0693ff',
    borderColor: '#eebd68ff',
    shadowColor: '#9370db',
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  cardBack: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#1b053cff',
  },
  cardBackImage: {
    width: '70%',
    height: '70%',
  },
  cardImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 8,
  },
  footer: {
    padding: 15,
    paddingBottom: 80,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  resetButton: {
    backgroundColor: '#2d014aff',
    paddingHorizontal: 35,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#4b00bcff',
    shadowColor: '#9370db',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
    minWidth: 180,
  },
  resetButtonText: {
    color: '#e0e0ff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(147, 112, 219, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
});