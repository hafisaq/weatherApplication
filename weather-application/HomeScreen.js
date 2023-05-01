import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

const HomeScreen = () => {
  const countries = [
    { name: "United Arab Emirates", code: "AE", timeZone: "Asia/Dubai" },
    { name: "Qatar", code: "QA", timeZone: "Asia/Qatar" },
    { name: "Saudi Arabia", code: "SA", timeZone: "Asia/Riyadh" },
    { name: "Kuwait", code: "KW", timeZone: "Asia/Kuwait" },
    { name: "Oman", code: "OM", timeZone: "Asia/Muscat" },
    { name: "United Kingdom", code: "GB", timeZone: "Europe/London" },
  ];

  const [expandedCountry, setExpandedCountry] = useState(null); // Keep track of the currently expanded country
  const [weatherData, setWeatherData] = useState(null); // Store weather data for the expanded country

  const getWeatherData = async (country) => {
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=60c53e1307f7425785d160819230105&q=${country}&aqi=no`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getDayOrNightIcon = (timeZone) => {
    const time = new Date().toLocaleString("en-US", {
      timeZone: timeZone,
      hour: "numeric",
    });
    const hour = Number(time.split(" ")[0]);
    if (hour >= 6 && hour <= 18) {
      return <Icon name="moon-o" size={20} color="white" />;
    } else {
      return <Icon name="sun-o" size={20} color="orange" />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      {countries.map((country) => (
        <View key={country.code} style={{ marginBottom: 10 }}>
          <TouchableOpacity
            style={styles.countryContainer}
            onPress={() => {
              if (expandedCountry === country.name) {
                // Collapse the container if the same country is pressed again
                setExpandedCountry(null);
                setWeatherData(null);
              } else {
                // Expand the container if a new country is pressed
                setExpandedCountry(country.name);
                const fetchWeatherData = async () => {
                  const data = await getWeatherData(country.name);
                  setWeatherData(data);
                };
                fetchWeatherData();
              }
            }}
          >
            <Image
              source={{
                uri: `https://flagsapi.com/${country.code}/flat/64.png`,
              }}
              style={styles.flagImage}
            />
            <Text style={styles.countryName}>{country.name}</Text>
            {getDayOrNightIcon(country.timeZone)}
          </TouchableOpacity>
          {expandedCountry === country.name && weatherData && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>
                Temperature: {weatherData.current.temp_c}°C
              </Text>

              <Text style={styles.detailsText}>
                Wether: {weatherData.current.condition.text}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0D0D26",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#fff",
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#1C1C2E",
  },
  flagImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  countryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  detailsContainer: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#13132B",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsText: {
    fontSize: 18,
    color: "#fff",
    marginTop: 5,
  },
  dayBackground: {
    backgroundColor: "#4D4DFF",
  },
  nightBackground: {
    backgroundColor: "#1D1D3E",
  },
});

export default HomeScreen;
