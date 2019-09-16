int sensor;//Declarando variável do tipo inteiro 
void setup() {  
  pinMode(7, INPUT);// Configura o pino 7 digital como entrada
  Serial.begin(9600);//// Inicia a porta serial, configura a taxa de dados para 9600 bps (baud é uma medida de velocidade)
}

void loop() {
  sensor = digitalRead(7);// // Lendo o pino de entrada e  atribuido/armazenar a variável 
 
  if(sensor == 0)// Testando se o sensor detecta alguma coisa.
  {
     Serial.println("Produto:  X Preço: Y");// Imprime dados na porta serial
     delay(3000); // Pausa de 3000 em milissegundos/3 segundos
  }
  
}
