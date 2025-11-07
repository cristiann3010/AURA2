import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function GenerateQR() {
  const [inputValue, setInputValue] = useState('');
  const [generated, setGenerated] = useState('');

  const handleGenerate = () => {
    if (inputValue.trim() === '') {
      alert('Digite algo para gerar o QR Code!');
      return;
    }
    setGenerated(inputValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerador de QR Code</Text>

      <TextInput
        placeholder="Digite o texto ou link"
        style={styles.input}
        value={inputValue}
        onChangeText={setInputValue}
      />

      <Button title="Gerar QR Code" onPress={handleGenerate} color="#2d004d" />

      {generated !== '' && (
        <View style={styles.qrContainer}>
          <QRCode value={generated} size={200} />
          <Text style={styles.qrText}>{generated}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2d004d',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  qrContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  qrText: {
    marginTop: 10,
    color: '#333',
  },
});
