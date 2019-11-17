// Variáveis para saber onde o sensor está setado.

/* Sensor 1 */
int s1_id = 1;
int s1_porta = 7;

/* Sensor 2 */
int s2_id = 2;
int s2_porta = 8;

// variaveis que irão registrar o tempo quando o sensor foi ativado

/* Sensor 1 */
int s1_resultado = 0;
int s1_tempoAproximacao;
unsigned long s1_tempoPresenca = 0;

/* Sensor 2 */
int s2_resultado = 0;
int s2_tempoAproximacao;
unsigned long s2_tempoPresenca = 0;

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
  pinMode(s1_porta, INPUT); // configurando pino 7 como entrada
  pinMode(s2_porta, INPUT); // configurando pino 8 como entrada
  
  Serial.begin(9600); // inicia a porta serial, configura a taxa de dados para 9600 bps
}

/**
 * Depois de criar uma função setup(), que inicializa e atribui os 
 * valores iniciais, a função loop() repete-se consecutivamente enquanto 
 * a placa estiver ligada, permitindo o seu programa mudar e responder 
 * a essas mudanças. 
 */
void loop(){

  lerSensor(s1_id, s1_porta, &s1_tempoAproximacao, &s1_tempoPresenca);
  lerSensor(s2_id, s2_porta, &s2_tempoAproximacao, &s2_tempoPresenca);
}

void lerSensor(int id, int porta, int *tempoAproximacao, unsigned long *tempoPresenca) {

  /** 
   *  Aqui estou pegando os parametros como referência.
   *  Isso serve para usar as variáveis globais para o armazenamento dos dados e não uma cópia das mesmas.
   *  Isso é feito para evitar que os valores sejam resetados toda vez que o arduino executar esse procedimento. 
   */

  // Pegando a leitura e setando na variável "resultado".
  int resultado = digitalRead(porta);
  *tempoAproximacao = 0;

  // Verifica se usuário se aproximou.
  if (resultado == 0 && *tempoPresenca == 0) {

    *tempoPresenca = millis(); // guardando tempo atual do arduino
  }

  // Verifica se usuário se afastou.
  if (resultado == 1 && *tempoPresenca > 0) {

    *tempoAproximacao = millis() - *tempoPresenca;
  }

  // Se usuário se aproximou...
  if (*tempoPresenca > 0 && (*tempoAproximacao > 0)) {

    if (*tempoAproximacao > 1000) {

      Serial.println(String(id) + ":1");
    }
    else if (*tempoAproximacao > 200){

      Serial.println(String(id) + ":2");
    }

    // resetando tempos de presença e ausência
    *tempoPresenca = 0;
  }
}
