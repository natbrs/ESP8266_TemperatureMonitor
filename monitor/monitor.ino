#include <ESP8266WiFi.h>
#include <DHT.h>

const char* ssid = "SEU_SSID";
const char* password = "SUA_SENHA"; 
const char* server = "SEU_SERVIDOR"; 
const int port = 3000; 

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  delay(10);

  // Conecte-se à rede Wi-Fi
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");

  dht.begin();
}

void loop() {
  delay(2000);

  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Falha ao ler o sensor DHT!");
    return;
  }

  // Enviar dados para o servidor Node.js
  sendDataToServer(temperature, humidity);
}

void sendDataToServer(float temperature, float humidity) {
  WiFiClient client;

  if (!client.connect(server, port)) {
    Serial.println("Falha na conexão com o servidor");
    return;
  }

  // Construa a URL para enviar os dados
  String url = "/add-value?temp=" + String(temperature) + "&umi=" + String(humidity);

  Serial.print("Enviando dados para: ");
  Serial.println(url);

  // Envie a solicitação HTTP GET
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + server + "\r\n" +
               "Connection: close\r\n\r\n");

  while (client.connected()) {
    if (client.available()) {
      String line = client.readStringUntil('\r');
      Serial.print(line);
    }
  }

  client.stop();
}
