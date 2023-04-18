#include <HardwareSerial.h>
#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include "SPIFFS.h"

#define LED 2


// Replace with your network credentials
const char* ssid = "esp32";
const char* password = "krai2023";


// Create AsyncWebServer object on port 80
AsyncWebServer server(80);


// Create an Event Source on /events
AsyncEventSource events("/events");


void initSPIFFS() {
  if (!SPIFFS.begin()) {
    Serial.println("An error has occurred while mounting SPIFFS");
  }
  Serial.println("SPIFFS mounted successfully");
}


// Initialize WiFi
void initWiFi() {
  WiFi.mode(WIFI_AP);
  // Remove the password parameter, if you want the AP (Access Point) to be open
  WiFi.softAP(ssid, password);

  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);
}

HardwareSerial pc(0); // Declare the UART port being used (in this case, UART2)


void setup() {
  pc.begin(115200); // Set the baud rate for the UART
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  initWiFi();
  initSPIFFS();


    // Web Server Root URL
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/main.html", "text/html");
  });

  server.serveStatic("/", SPIFFS, "/");

  events.onConnect([](AsyncEventSourceClient *client){
    if(client->lastId()){
      Serial.printf("Client reconnected! Last message ID that it got is: %u\n", client->lastId());
    }
    // send event with message "hello!", id current millis
    // and set reconnect delay to 1 second
    client->send("hello!", NULL, millis(), 10000);
  });
  server.addHandler(&events);

  // Start server
  server.begin();
}

void loop() {

  }
