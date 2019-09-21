/**
 * Definindo uma estrutura para o sensor tcrt5000.
 * 
 * Estruturas são coleções de variáveis que atendem por 
 * um único nome.
 */
struct tcrt {
  
  int id; // Id do sensor no banco de dados.
  int porta; // Porta que recebe os dados do sensor.
};

// Criando um novo sensor usando a estrutura trct.
struct tcrt sensor = { 1, 7 };

void setup() {   

  // Configura o pino 7 digital como entrada.
  pinMode(sensor.porta, INPUT); 
  // Inicia a comunicação serial em uma taxa de dados de 9600bps.
  Serial.begin(9600); 
}

void loop() {

  // Lendo a porta do sensor. 
  int resultado = digitalRead(sensor.porta); 

  // Se o sensor detectou alguma coisa...
  if(resultado == 0) {
    
     // Imprime id do sensor e data/hora.
     Serial.println("Sensor: " + String(sensor.id) + " DataHora: 01/01/2001 00:00:00");
     delay(2000); // Pausa de 2 segundos.
  }

  delay(1000); // Aguarda 1 segundo para fazer a próxima leitura.
}
