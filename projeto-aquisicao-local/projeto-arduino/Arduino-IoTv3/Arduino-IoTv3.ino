// Variáveis para saber onde o sensor está setado.
int idSensor = 1;
int porta_sensor = 7;

unsigned long tempoPresenca = 0;

int resultado = 0;
int tempoAproximacao;

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
  resultado = digitalRead(porta_sensor);
  tempoAproximacao = 0;

  // Verifica se usuário se aproximou.
  if (resultado == 0 && tempoPresenca == 0) {

    tempoPresenca = millis(); // guardando tempo atual do arduino
  }

  // Verifica se usuário se afastou.
  if (resultado == 1 && tempoPresenca > 0) {

    tempoAproximacao = millis() - tempoPresenca;
  }

  // Se usuário se aproximou...
  if (tempoPresenca > 0 && (tempoAproximacao > 0)) {

    if (tempoAproximacao > 1000) {

      Serial.println(String(idSensor) + ":1");
    }
    else if (tempoAproximacao > 200){

      Serial.println(String(idSensor) + ":2");
    }

    // resetando tempos de presença e ausência
    tempoPresenca = 0;
  }
}
