// Screens/AguardandoRFID.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AguardandoRFID() {
  const navigation = useNavigation();
  const route = useRoute();
  const { furryEsperado } = route.params;

  // Simulação de leitura do RFID - em um app real, aqui você teria uma integração com o leitor
  // Vamos simular com um botão que, quando pressionado, navega para a tela do furry
  // Ou, se tiver o leitor real, você escutaria um evento do leitor e compararia o RFID lido com o esperado

  const [rfidLido, setRfidLido] = useState(null);

  // Função para simular a leitura do RFID (remova isso e integre com o leitor real)
  const simularLeituraRFID = () => {
    // Em um app real, você teria uma lista de RFID correspondentes a cada furry
    const rfids = {
      furry1: 'RFID_123',
      furry2: 'RFID_456',
      furry3: 'RFID_789'
    };

    // Simula a leitura do RFID correto
    const rfid = rfids[furryEsperado];
    setRfidLido(rfid);
    // Se o RFID lido for o esperado, navega para a tela do furry
    if (rfid === rfids[furryEsperado]) {
      // Navega para a tela do furry correspondente
      navigation.navigate(furryEsperado);
    } else {
      Alert.alert('Erro', 'Carta incorreta!');
    }
  };

  // Se tiver um leitor real, você usaria um useEffect para escutar as leituras
  // useEffect(() => {
  //   const subscription = ... // escutar o leitor RFID
  //   return () => subscription.remove();
  // }, []);

  return (
    <ImageBackground 
      source={require('../assets/bgdosfurry.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar backgroundColor="#2d004d" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AGUARDANDO CARTA</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <View style={styles.container}>
        <Text style={styles.title}>Coloque a carta no dispositivo</Text>
        <Text style={styles.subtitle}>
          Escaneie o RFID da carta física para continuar
        </Text>

        {/* Botão para simular leitura - remova em produção */}
        <TouchableOpacity style={styles.button} onPress={simularLeituraRFID}>
          <Text style={styles.buttonText}>Simular Leitura RFID</Text>
        </TouchableOpacity>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#e6ccff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});