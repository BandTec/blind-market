// Variáveis para saber onde o sensor está setado.
int porta_sensor = 7;
int porta_sensor2 = 8;

/**
 * A função setup é chamada quando a execução começa. é usada para 
 * inicializar variáveis, configurar o modo dos pinos(INPUT ou OUTPUT), 
 * inicializar bibliotecas, etc. 
 * 
 * A função setup() será executada apenas uma vez, após a placa ser 
 * alimentada ou acontecer um reset.
 */
void setup(){
    
  /**
   * Falando para o Arduino quais portas estão sendo usadas pelo sensor.
   * 
   * O pinMode configura o pino especificado para funcionar como uma entrada ou saída
   * como queremos ler os dados dos sensores configuramos como entrada.
   */ 
  pinMode(porta_sensor, INPUT); // configurando pino 7 como entrada
  pinMode(porta_sensor2, INPUT); // configurando pino 8 como entrada
  
  Serial.begin(9600); // inicia a porta serial, configura a taxa de dados para 9600 bps
}

/**
 * Depois de criar uma função setup(), que inicializa e atribui os 
 * valores iniciais, a função loop() repete-se consecutivamente enquanto 
 * a placa estiver ligada, permitindo o seu programa mudar e responder 
 * a essas mudanças. 
 */
void loop(){
  
  // Pegando a leitura e setando na variável "resultado".
  int resultado = digitalRead(porta_sensor);
  int resultado2 = digitalRead(porta_sensor2);

  // Verifica se o sensor detectou algo.
  if (resultado == 0) {
  
    // Serial print mostra na tela o que está dentro do parenteses. 
    Serial.print("[1,");
  }
  else {

    Serial.print("[0,");
  }

  // Verifica se o sensor 2 detectou algo.
  if (resultado2 == 0) {

    // Serial print mostra na tela o que está dentro do parenteses. 
    Serial.println("1]");
  }
  else {

    Serial.println("0]");
  }
  
  // Aguarda um segundo para fazer a próxima leitura.
  delay(1000);
}
