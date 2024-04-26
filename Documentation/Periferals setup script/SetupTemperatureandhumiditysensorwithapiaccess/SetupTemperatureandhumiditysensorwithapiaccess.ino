#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// WiFi credentials
const char* ssid = "Sde-Guest";
//const char* ssid = "NETGEAR51";
// const char* password = "manicdaisy646";
// DHT Sensor
#define DHTPIN 15          // Pin connected to the DHT sensor.
#define DHTTYPE DHT22      // DHT 22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  delay(10);

  // Initialize DHT sensor
  dht.begin();

  // Connect to Wi-Fi
  Serial.print("Connecting to WiFi..");
  // WiFi.begin(ssid, password);
  WiFi.begin(ssid);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to the WiFi network");
}

void loop() {

  // Read humidity and temperature values
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Check if the readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Proceed if connected to WiFi
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String serverPath = "https://dragon723.pagekite.me/api/EnvironmentalReading";

    // Start connection and send HTTP header and body
    http.begin(serverPath);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("ngrok-skip-browser-warning", "true");
    // Format the data in JSON
    String httpRequestData = "{\"Temperature\":" + String(temperature, 2) +
                             ", \"Humidity\":" + String(humidity, 2) +
                             ", \"EnvironmentalSettingsID\":1}"; // Hard-coded ID for testing purposes

    // Send the HTTP POST request
    int httpResponseCode = http.POST(httpRequestData);

    // Print the HTTP response code
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    // Free resources
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
  delay(900000); // Delay for 15 minutes between readings
}
