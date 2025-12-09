import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Animated,
  Dimensions,
  StatusBar,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SERVER_URL = 'http://10.136.23.138:3001';

export default function TelaBloqueioFurry1() {
  const navigation = useNavigation();
  const [status, setStatus] = useState('Conectando ao servidor...');
  const [isConnected, setIsConnected] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pollingIntervalRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Animação de pulsação
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Inicia o sistema
    initializeSystem();

    return () => {
      isMountedRef.current = false;
      pulse.stop();
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const initializeSystem = async () => {
    console.log('🚀 Iniciando sistema Furry1...');
    await checkServer();
    startPolling();
  };

  const checkServer = async () => {
    if (!isMountedRef.current) return;
    
    try {
      console.log(`🔗 Tentando conectar (tentativa ${retryCount + 1})...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${SERVER_URL}/api/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (isMountedRef.current) {
        setServerOnline(true);
        setStatus(data.connected ? '✅ Conectado! Aguardando carta...' : '❌ ESP32 desconectado');
        setIsConnected(data.connected);
        setRetryCount(0);
        console.log('✅ Servidor conectado com sucesso - Furry1');
      }
      
    } catch (error) {
      if (!isMountedRef.current) return;
      
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      setServerOnline(false);
      setStatus(`❌ Servidor offline (tentativa ${newRetryCount})`);
      setIsConnected(false);
      
      console.log(`❌ Erro de conexão Furry1: ${error.message}`);
      
      // Tentativa de reconexão automática
      if (newRetryCount <= 5) {
        setTimeout(() => {
          if (isMountedRef.current) {
            checkServer();
          }
        }, 3000);
      } else {
        setStatus('❌ Servidor inacessível - Verifique a conexão');
      }
    }
  };

  const startPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    pollingIntervalRef.current = setInterval(() => {
      if (isMountedRef.current && serverOnline) {
        checkCard();
      }
    }, 2000);
  };

  const checkCard = async () => {
    if (!serverOnline || !isMountedRef.current) return;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${SERVER_URL}/api/check-card/furry1`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.unlocked) {
        console.log('🎉 ELEFANTE DETECTADO - Processando...');
        setStatus('✅ Carta do Elefante detectada! Liberando...');
        setIsConnected(true);
        
        // Para o polling para evitar múltiplas execuções
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        
        // Navega primeiro
        setTimeout(() => {
          if (isMountedRef.current) {
            navigation.navigate('furry1', {
              scannedFromQR: true,
              rfidVerified: true
            });
          }
        }, 1500);

        // Reset após um tempo
        setTimeout(async () => {
          try {
            await fetch(`${SERVER_URL}/api/reset-cards`, { method: 'POST' });
            console.log('🔄 Cartas resetadas após navegação do Elefante');
            
            // Reinicia o polling após o reset
            setTimeout(() => {
              if (isMountedRef.current) {
                startPolling();
              }
            }, 2000);
            
          } catch (error) {
            console.log('❌ Erro ao resetar cartas:', error);
          }
        }, 3000);
      }
      
      // Atualiza status da conexão
      if (isMountedRef.current) {
        setIsConnected(data.connected);
      }
      
    } catch (error) {
      console.log('❌ Erro ao verificar carta Elefante:', error.message);
      // Se houver erro na verificação da carta, verifica o servidor
      if (isMountedRef.current) {
        setServerOnline(false);
        checkServer();
      }
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancelar Leitura",
      "Deseja voltar para a tela de scan?",
      [
        { text: "Continuar", style: "cancel" },
        { text: "Voltar", onPress: () => navigation.navigate('Scan') }
      ]
    );
  };

  const testarConexao = async () => {
    await checkServer();
  };

  const simularLeitura = async () => {
    try {
      setStatus('🔍 Simulando leitura do Elefante...');
      
      const response = await fetch(`${SERVER_URL}/api/simulate-card/furry1`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus('✅ Carta do Elefante simulada!');
      }
    } catch (error) {
      setStatus('❌ Erro na simulação');
      checkServer();
    }
  };

  const reiniciarSistema = () => {
    setRetryCount(0);
    setStatus('🔄 Reiniciando sistema...');
    initializeSystem();
  };

  const irParaGame1 = () => {
    navigation.navigate('game1');
  };

  return (
    <ImageBackground 
      source={require('../assets/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleCancel}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AGUARDANDO CARTA</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.rfidIconContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={[
            styles.rfidIcon,
            isConnected && styles.connectedIcon,
            !serverOnline && styles.offlineIcon,
            retryCount > 0 && styles.retryIcon
          ]}>
            <Text style={styles.rfidIconText}>
              {!serverOnline ? '❌' : (isConnected ? '🔗' : '📡')}
            </Text>
          </View>
        </Animated.View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.title}>Coloque a Carta no Leitor</Text>
          <Text style={styles.subtitle}>
            Aproxime a carta física do{'\n'}
            <Text style={styles.highlight}>ELEFANTE</Text> no dispositivo
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{status}</Text>
          <View style={styles.statusIndicators}>
            <Text style={[
              styles.statusIndicator,
              serverOnline ? styles.statusOnline : styles.statusOffline
            ]}>
              {serverOnline ? '✅ SERVIDOR' : '❌ SERVIDOR'}
            </Text>
            <Text style={[
              styles.statusIndicator,
              isConnected ? styles.statusConnected : styles.statusDisconnected
            ]}>
              {isConnected ? '✅ ESP32' : '❌ ESP32'}
            </Text>
            {retryCount > 0 && (
              <Text style={styles.statusRetry}>
                🔄 {retryCount}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={testarConexao}
          >
            <Text style={styles.testButtonText}>
              TESTAR CONEXÃO
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.game1Button}
            onPress={irParaGame1}
          >
            <Text style={styles.game1ButtonText}>
              🎮 IR PARA GAME 1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restartButton}
            onPress={reiniciarSistema}
          >
            <Text style={styles.restartButtonText}>
              REINICIAR SISTEMA
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {serverOnline ? (
              `📍 ${isConnected ? 'Sistema pronto - Aproxime a carta do Elefante!' : 'Conecte o dispositivo USB'}`
            ) : (
              `❌ Tentando reconectar automaticamente... (${retryCount}/5)`
            )}
          </Text>
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
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    marginTop: 30,
  },
  backButton: {
    borderRadius: 20,
    backgroundColor: 'rgba(50, 6, 82, 0.48)',
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
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSpacer: {
    width: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  rfidIconContainer: {
    marginBottom: 40,
  },
  rfidIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  connectedIcon: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  offlineIcon: {
    borderColor: '#f44336',
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
  },
  retryIcon: {
    borderColor: '#FF9800',
    backgroundColor: 'rgba(255, 152, 0, 0.3)',
  },
  rfidIconText: {
    fontSize: 50,
  },
  instructionsContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  highlight: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  statusContainer: {
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statusIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  statusIndicator: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statusOnline: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    color: '#4CAF50',
  },
  statusOffline: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    color: '#f44336',
  },
  statusConnected: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    color: '#2196F3',
  },
  statusDisconnected: {
    backgroundColor: 'rgba(255, 152, 0, 0.3)',
    color: '#FF9800',
  },
  statusRetry: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 152, 0, 0.3)',
    color: '#FF9800',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
    marginBottom: 30,
  },
  testButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    width: '80%',
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  game1Button: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.5)',
    width: '80%',
  },
  game1ButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  restartButton: {
    backgroundColor: 'rgba(156, 39, 176, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(156, 39, 176, 0.5)',
    width: '80%',
  },
  restartButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    width: '95%',
  },
  infoText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});