#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SimpleDHT.h>

const char* ssid = "PiNat";
const char* password = "rafael13";

const char* http_site = "esp-8266-temperature-monitor-c8d4ymgxa-natbrs.vercel.app";
const int http_port = 3000;
const char* http_path = "/dashboard"; 

int pinDHT11 = D1;
SimpleDHT11 dht11;

unsigned long previousMillis = 0;
const long interval = 600000;

void setup() {
  Serial.begin(9600);
  Serial.println("NodeMCU - Gravando dados no BD via GET");
  Serial.println("Aguardando conexão");

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi conectado com sucesso: " + WiFi.localIP().toString());
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    byte temp = 0;
    byte humid = 0;
    if (dht11.read(pinDHT11, &temp, &humid, NULL)) {
      Serial.println("Falha na leitura do sensor.");
      return;
    }

    Serial.println("Gravando dados no BD: ");
    Serial.print((int)temp);
    Serial.print(" *C, ");
    Serial.print((int)humid);
    Serial.println(" %");

    if (!sendDataToServer((int)temp, (int)humid)) {
      Serial.println("GET request failed");
    }
  }
}

bool sendDataToServer(int temp, int humid) {
  WiFiClientSecure client;
  client.setInsecure();

  String url = "https://" + String(http_site) + http_path + "?wea_humid=" + String(humid) + "&wea_temp=" + String(temp);
  Serial.println("Placing order");
  Serial.println(url);


  if (client.connect(http_site, http_port)) {
    Serial.println("Connected to client");
    client.print(String("GET ") + url + " HTTP/1.1\r\n" + "Host: " + http_site + "\r\n" + "Connection: close\r\n\r\n");

    while (client.connected()) {
      Serial.println("Waiting for response from the server...");
      String line = client.readStringUntil('\n');
      if (line == "\r") {
        break;
      }
    }

    while (client.available()) {
      Serial.println("esperando resto da resposta");
      String line = client.readStringUntil('\n');
      Serial.println(line);
    }

    Serial.println("concluído");

    client.stop();
    return true;
  } 
    
  Serial.println("Falha na conexão com o servidor");
  return false;
}