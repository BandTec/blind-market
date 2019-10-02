// Variáveis para saber onde o sensor está setado.
int porta_sensor = 7;
int porta_sensor2 = 8;

void setup(){
    // Falando para o Arduino quais portas estão sendo usadas pelo sensor 
    pinMode(porta_sensor, INPUT);
    pinMode(porta_sensor2, INPUT);
    // Taxa de transferência de dados.
    Serial.begin(9600);
}

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