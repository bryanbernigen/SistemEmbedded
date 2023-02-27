/*********
  Rui Santos
  Complete project details at https://randomnerdtutorials.com  
*********/

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ESP32Servo.h>

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

Servo myservo; 
int pos = 0;    // variable to store the servo position
float currentPWM = 0.0;
// Recommended PWM GPIO pins on the ESP32 include 2,4,12-19,21-23,25-27,32-33 
int servoPin = 13;

void setup() {
  Serial.begin(115200);
  myservo.attach(servoPin);

  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  delay(2000);
  display.clearDisplay();
  display.setTextColor(WHITE);
}

void loop() {
  for (pos = 1000; pos <=2000; pos += 100) { // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    currentPWM = (pos-1000)/1000.0;
    myservo.writeMicroseconds(pos);              // tell servo to go to position in variable 'pos'
    //clear display
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0,0);
    display.print("Servo Current PWM: ");
    display.setTextSize(2);
    display.setCursor(0,10);
    display.println(currentPWM, 3);
    display.display(); 
    delay(200);                       // waits 15ms for the servo to reach the position
  }
  for (pos = 2000; pos >= 1000; pos -= 100) { // goes from 180 degrees to 0 degrees
    myservo.writeMicroseconds(pos);              // tell servo to go to position in variable 'pos'
    currentPWM = (pos-1000)/1000.0;
    //clear display
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0,0);
    display.print("Servo Current PWM: ");
    display.setTextSize(2);
    display.setCursor(0,10);
    display.println(currentPWM, 3); 
    display.display(); 
    delay(200);                       // waits 15ms for the servo to reach the position
  }
   

}
