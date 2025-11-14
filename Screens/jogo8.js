import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView
} from "react-native";

export default function Jogo8({ navigation }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [owlPosition, setOwlPosition] = useState({ top: 150, left: 100 });
  const [showOwl, setShowOwl] = useState(false);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setGameActive(true);
    setShowOwl(true);
    moveOwl();
  };

  const moveOwl = () => {
    if (!gameActive) return;

    const newPosition = {
      top: 50 + Math.random() * 250,
      left: 30 + Math.random() * 220
    };
    setOwlPosition(newPosition);
  };

  const touchOwl = () => {
    if (!gameActive || !showOwl) return;
    
    setScore(score + 1);
    moveOwl();
  };

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          setShowOwl(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Toque na Coruja</Text>
        
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoPanel}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tempo</Text>
            <Text style={styles.infoValue}>{timeLeft}s</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Pontos</Text>
            <Text style={styles.infoValue}>{score}</Text>
          </View>
        </View>

        <View style={styles.gameArea}>
          {showOwl && gameActive && (
            <TouchableOpacity 
              style={[
                styles.owl,
                {
                  top: owlPosition.top,
                  left: owlPosition.left
                }
              ]}
              onPress={touchOwl}
            >
              <Text style={styles.owlEmoji}>🦉</Text>
            </TouchableOpacity>
          )}

          {!gameActive && timeLeft === 10 && (
            <View style={styles.message}>
              <Text style={styles.messageTitle}>Toque na Coruja!</Text>
              <Text style={styles.messageText}>
                A coruja vai pular pela tela
                Toque nela para ganhar pontos!
              </Text>
              <TouchableOpacity 
                style={styles.button}
                onPress={startGame}
              >
                <Text style={styles.buttonText}>COMEÇAR</Text>
              </TouchableOpacity>
            </View>
          )}

          {!gameActive && timeLeft === 0 && (
            <View style={styles.message}>
              <Text style={styles.messageTitle}>Fim do Jogo!</Text>
              <Text style={styles.messageScore}>Pontuação: {score}</Text>
              <TouchableOpacity 
                style={styles.button}
                onPress={startGame}
              >
                <Text style={styles.buttonText}>JOGAR NOVAMENTE</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsText}>
            ⚡ Toque na coruja o mais rápido que puder!
          </Text>
        </View>
      </View>
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
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  infoPanel: {
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
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    color: '#c4b5fd',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoValue: {
    color: '#e9d5ff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  gameArea: {
    width: '100%',
    height: 400,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  owl: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#a78bfa',
  },
  owlEmoji: {
    fontSize: 40,
  },
  message: {
    alignItems: 'center',
    padding: 20,
  },
  messageTitle: {
    color: '#e9d5ff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  messageText: {
    color: '#c4b5fd',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  messageScore: {
    color: '#e9d5ff',
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  instructionsText: {
    color: '#e9d5ff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});