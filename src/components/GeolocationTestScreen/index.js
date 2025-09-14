import React, { useState } from "react";
import { View, Button, Text, TextInput, FlatList } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import { ScrollView } from "native-base";
import { PermissionsHandler } from "../../handler/permissions";

export default function GeolocationTestScreen() {
  const [position, setPosition] = useState(null);
  const [positionsList_getCurrent, setPositionsList_getCurrent] = useState([]);
  const [positionsList_watch, setPositionsList_watch] = useState([]);
  const [watchId, setWatchId] = useState(null);

  // Configurações de `getCurrentPosition`
  const [timeout_getCurrentPosition, setTimeout_getCurrentPosition] = useState(20); // Em segundos
  const [maximumAge_getCurrentPosition, setMaximumAge_getCurrentPosition] = useState(1); // Em segundos
  const [enableHighAccuracy_getCurrentPosition, setEnableHighAccuracy_getCurrentPosition] = useState(true);

  // Configurações de `watchPosition`
  const [interval_watchPosition, set_interval_watchPosition] = useState(60); // Em segundos
  const [fastestInterval_watchPosition, set_fastestInterval_watchPosition] = useState(30); // Em segundos
  const [timeout_watchPosition, set_timeout_watchPosition] = useState(120); // Em segundos
  const [maximumAge_watchPosition, set_maximumAge_watchPosition] = useState(60); // Em segundos
  const [enableHighAccuracy_watchPosition, set_enableHighAccuracy_watchPosition] = useState(true);
  const [distanceFilter_watchPosition, set_distanceFilter_watchPosition] = useState(50); // Distância em metros
  const [useSignificantChanges_watchPosition, set_useSignificantChanges_watchPosition] = useState(false);

  // Método para obter a localização atual
  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setPosition(position);
        setPositionsList_getCurrent((prevList) => [
          ...prevList,
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
          },
        ]);
      },
      (error) => console.error("Erro ao obter posição:", error),
      {
        timeout: timeout_getCurrentPosition * 1000,
        maximumAge: maximumAge_getCurrentPosition * 1000,
        enableHighAccuracy: enableHighAccuracy_getCurrentPosition,
      }
    );
  };

  // Método para monitorar mudanças na posição com `watchPosition`
  const startWatchingPosition = () => {
    const id = Geolocation.watchPosition(
      (position) => {
        setPosition(position);
        setPositionsList_watch((prevList) => [
          ...prevList,
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
            speed: position.coords.speed,
          },
        ]);
      },
      (error) => console.error("Erro ao monitorar posição:", error),
      {
        interval: interval_watchPosition * 1000,
        fastestInterval: fastestInterval_watchPosition * 1000,
        timeout: timeout_watchPosition * 1000,
        maximumAge: maximumAge_watchPosition * 1000,
        enableHighAccuracy: enableHighAccuracy_watchPosition,
        distanceFilter: distanceFilter_watchPosition,
        useSignificantChanges: useSignificantChanges_watchPosition,
      }
    );
    setWatchId(id);
  };

  // Parar o monitoramento de posição
  const stopWatchingPosition = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // Limpa as listas de posições
  const clearPositionsList_getCurrent = () => {
    setPositionsList_getCurrent([]);
  };

  const clearPositionsList_watch = () => {
    setPositionsList_watch([]);
  };

  return (
    <View style={{ padding: 10 }}>
      <ScrollView style={{ padding: 0 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Geolocation Test</Text>

        <Button title="Request Location Permission" onPress={PermissionsHandler.requestLocationPermissions()} />

        {/* Configurações de getCurrentPosition */}
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Configurações de getCurrentPosition</Text>
          
          <Text>Timeout (s):</Text>
          <TextInput
            keyboardType="numeric"
            value={timeout_getCurrentPosition.toString()}
            onChangeText={(value) => setTimeout_getCurrentPosition(parseFloat(value))}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <Text>Maximum Age (s):</Text>
          <TextInput
            keyboardType="numeric"
            value={maximumAge_getCurrentPosition.toString()}
            onChangeText={(value) => setMaximumAge_getCurrentPosition(parseFloat(value))}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <Text>Enable High Accuracy:</Text>
          <Button
            title={enableHighAccuracy_getCurrentPosition ? "True" : "False"}
            onPress={() => setEnableHighAccuracy_getCurrentPosition(!enableHighAccuracy_getCurrentPosition)}
          />

          <Button title="Get Current Position" onPress={getCurrentPosition} />
          <Button title="Clear Position List (getCurrent)" onPress={clearPositionsList_getCurrent} />
        </View>

        {/* Configurações de watchPosition */}
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Configurações de watchPosition</Text>

          <Text>Intervalo de Coleta (s):</Text>
          <TextInput
            keyboardType="numeric"
            value={interval_watchPosition.toString()}
            onChangeText={(value) => set_interval_watchPosition(parseFloat(value))}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <Text>Fastest Interval (s):</Text>
          <TextInput
            keyboardType="numeric"
            value={fastestInterval_watchPosition.toString()}
            onChangeText={(value) => set_fastestInterval_watchPosition(parseFloat(value))}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <Text>Timeout (s):</Text>
          <TextInput
            keyboardType="numeric"
            value={timeout_watchPosition.toString()}
            onChangeText={(value) => set_timeout_watchPosition(parseFloat(value))}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <Text>Maximum Age (s):</Text>
          <TextInput
            keyboardType="numeric"
            value={maximumAge_watchPosition.toString()}
            onChangeText={(value) => set_maximumAge_watchPosition(parseFloat(value))}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <Text>Distance Filter (m)a:</Text>
          <TextInput
            keyboardType="numeric"
            value={distanceFilter_watchPosition.toString()}
            onChangeText={(value) => set_distanceFilter_watchPosition(parseInt(value))}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <Text>Use Significant Changes:</Text>
          <Button
            title={useSignificantChanges_watchPosition ? "True" : "False"}
            onPress={() => set_useSignificantChanges_watchPosition(!useSignificantChanges_watchPosition)}
          />

          <Button title="Start Watching Position" onPress={startWatchingPosition} disabled={watchId !== null} />
          <Button title="Stop Watching Position" onPress={stopWatchingPosition} disabled={watchId === null} />
          <Button title="Clear Position List (watch)" onPress={clearPositionsList_watch} />
        </View>

        {/* Exibir lista de posições obtidas por getCurrentPosition */}
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Posições (getCurrentPosition):</Text>
        <FlatList
          data={positionsList_getCurrent}
          keyExtractor={(item, index) => `${item.timestamp}-${index}`}
          renderItem={({ item }) => (
            <Text>
              Lat: {item.latitude}, Lon: {item.longitude}, Timestamp: {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          )}
        />

        {/* Exibir lista de posições obtidas por watchPosition */}
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Posições (watchPosition):</Text>
        <FlatList
          data={positionsList_watch}
          keyExtractor={(item, index) => `${item.timestamp}-${index}`}
          renderItem={({ item }) => (
            <Text>
              Speed: {item.speed}, Lat: {item.latitude}, Lon: {item.longitude}, Timestamp: {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          )}
        />
      </ScrollView>
    </View>
  );
}
