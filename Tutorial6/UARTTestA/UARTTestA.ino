#include <HardwareSerial.h>

HardwareSerial SerialPort(2); // use UART2

#define touchMerah T5

void setup()  
{
  SerialPort.begin(15200, SERIAL_8N1, 16, 17); 
} 
void loop()  
{ 
  if(touchRead(touchMerah)< 50){
    SerialPort.print(0);
  }else{
    SerialPort.print(1);
  }
  delay(1000);                                         
}
