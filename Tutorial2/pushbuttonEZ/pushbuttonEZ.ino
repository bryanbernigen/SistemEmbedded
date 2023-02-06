// Define pin pushbutton and led
#define pushbutton 32
#define led 33

// Setup pin pushbutton and led
void setup() {
  pinMode(pushbutton, INPUT);
  pinMode(led, OUTPUT);
}

//Main Loop
void loop() {
    // If pushbutton is pressed
  if (digitalRead(pushbutton) == HIGH) {
    // Turn on led
    digitalWrite(led, HIGH);
  } else {
    // Turn off led
    digitalWrite(led, LOW);
  }
}