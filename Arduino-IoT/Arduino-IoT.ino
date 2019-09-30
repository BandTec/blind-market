/**
 * Definindo uma estrutura para o sensor tcrt5000.
 * 
 * Estruturas são coleções de variáveis que atendem por 
 * um único nome.
 */
struct tcrt {
  
  int id; // Id do sensor no banco de dados.
  int porta; // Porta que recebe os dados do sensor.
  int tempo;
};

// Criando um vetor de sensores usando a estrutura trct.
struct tcrt sensores[2] = {{ 1, 7, 0 }, { 2, 8, 0 }};

int tamanho = sizeof(sensores) / sizeof(sensores[0]);

void setup() {   

  // para cada sensor
  for(int i = 0; i < 2; i++) {
    
    // Configura o pino da porta digital como entrada.
    pinMode(sensores[i].porta, INPUT); 
  }
  // Inicia a comunicação serial em uma taxa de dados de 9600bps.
  Serial.begin(9600); 
}

void loop() {

  for(int i = 0; i < 2; i++) {

    // Lendo a porta do sensor. 
    int resultado = digitalRead(sensores[i].porta); 
    int tempoMillis = millis() - sensores[i].tempo;
    
    // Se o sensor detectou alguma coisa...
    if(resultado == 0 && tempoMillis <= 3000) {
      
       // Imprime id do sensor e data/hora.
       Serial.println("Sensor: " + String(sensores[i].id) + " DataHora: 01/01/2001 00:00:00");
       sensores[i].tempo = millis();
    }
  }

  delay(100); // Aguarda 100 milissegundos para fazer a próxima leitura.
}

