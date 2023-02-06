//Define Pin
#define pushbuttonijo 32
#define pushbuttonmerah 35
#define ledmerah 33
#define ledkuning 25
#define ledijo 26

//Setup Pin
void setup() {
  pinMode(ledmerah, OUTPUT);
  pinMode(ledkuning, OUTPUT);
  pinMode(ledijo, OUTPUT);
  pinMode(pushbuttonijo, INPUT);
  pinMode(pushbuttonmerah, INPUT);
}

//Main Loop
void loop() {
    //Jika pushbutton ijo dan merah ditekan
    if (digitalRead(pushbuttonijo) == HIGH && digitalRead(pushbuttonmerah) == HIGH) {
        //Nyalakan LED kuning
        digitalWrite(ledkuning, HIGH);
        //Matikan LED merah dan ijo
        digitalWrite(ledmerah, LOW);
        digitalWrite(ledijo, LOW);
    } else {
        //Matikan LED kuning
        digitalWrite(ledkuning, LOW);
        //Jika hanya pushbutton ijo ditekan
        if (digitalRead(pushbuttonijo) == HIGH) {
            //Nyalakan LED ijo
            digitalWrite(ledijo, HIGH);
            //Matikan LED merah
            digitalWrite(ledmerah, LOW);
        } else {
            //Matikan LED ijo
            digitalWrite(ledijo, LOW);
            //Jika hanya pushbutton merah ditekan
            if (digitalRead(pushbuttonmerah) == HIGH) {
                //Nyalakan LED merah
                digitalWrite(ledmerah, HIGH);
            } else {
                //Matikan LED merah
                digitalWrite(ledmerah, LOW);
            }
        }
    }
}
