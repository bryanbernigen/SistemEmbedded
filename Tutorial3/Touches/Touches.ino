// ESP32 Touch Test
// Just test touch pin - Touch0 is T0 which is on GPIO 4.

#define ledMerah 32
#define ledKuning 33
#define ledHijau 25
#define touchBiru T4
#define touchMerah T5

void setup()
{
  Serial.begin(115200);
  pinMode(ledMerah, OUTPUT);
  pinMode(ledKuning, OUTPUT);
  pinMode(ledHijau, OUTPUT);
}

void loop()
{
  if(touchRead(touchMerah)< 50){
      if(touchRead(touchBiru)<50){
        digitalWrite(ledMerah, LOW);
        digitalWrite(ledKuning, HIGH);
        digitalWrite(ledHijau, LOW);
        }
        else{
          digitalWrite(ledMerah, HIGH);
          digitalWrite(ledKuning, LOW);
          digitalWrite(ledHijau, LOW);
          }
    }
    else{
      if(touchRead(touchBiru)<50){
        digitalWrite(ledMerah, LOW);
        digitalWrite(ledKuning, LOW);
        digitalWrite(ledHijau, HIGH);
        }
        else{
          digitalWrite(ledMerah, LOW);
          digitalWrite(ledKuning, LOW);
          digitalWrite(ledHijau, LOW);}
      }
}
