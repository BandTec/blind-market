/*
 abrir a pasta deste arquivo via git bash e executar:
 npm i
 npm start
 talvez mostre uma mensagem de erro de placa arduino 
 mas depois vai começar a registrar os dados
*/

// se usar 'true' aqui, os dados serão gerados aleatórios e não recebidos da placa arduíno
const gerar_dados_aleatorios = false;

// leitura dos dados do Arduino
var porta_serial = require('serialport');
var leitura_recebida = porta_serial.parsers.Readline;
var banco = require(`./banco`);

// prevenir problemas com muitos recebimentos de dados do Arduino
require('events').EventEmitter.defaultMaxListeners = 15;

// reproduz os arquivos de áudio
const player = require('node-wav-player');

function iniciar_escuta() {

    porta_serial.list().then(entradas_seriais => {

        // este bloco trata a verificação de Arduino conectado (inicio)

        var entradas_seriais_arduino = entradas_seriais.filter(serialDevice => {
            return serialDevice.vendorId == 2341 && serialDevice.productId == 43;
        });

        if (entradas_seriais_arduino.length != 1) {
            throw new Error("Nenhum Arduino está conectado ou porta USB sem comunicação ou mais de um Arduino conectado");
        }

        console.log("Arduino conectado na COM %s", entradas_seriais_arduino[0].comName);

        return entradas_seriais_arduino[0].comName;


        // este bloco trata a verificação de Arduino conectado (fim)

    }).then(arduinoCom => {

        // este bloco trata o recebimento dos dados do Arduino (inicio)

        // o baudRate deve ser igual ao valor em
        // Serial.begin(xxx) do Arduino (ex: 9600 ou 115200)
        var arduino = new porta_serial(arduinoCom, {
            baudRate: 9600
        });

        var parser = new leitura_recebida();
        arduino.pipe(parser);

        console.error('Iniciando escuta do Arduino');

        // Tudo dentro desse parser.on(...
        // é invocado toda vez que chegarem dados novos do Arduino
        parser.on('data', (dados) => {
            console.error(`Recebeu novos dados do Arduino: ${dados}`);
            try {
                // O Arduino deve enviar a temperatura e umidade de uma vez,
                // separadas por ":" (temperatura : umidade)
                var leitura = dados.split(':');
				
				banco.conectar().then(() => {

					return banco.sql.query(`select fkproduto from sensor where idsensor = ${leitura[0]}`);

				}).then(result => {
					
					return result.recordset[0].fkproduto;
					
				}).then(id => {
					
					if (leitura[1] == 1) {
						player.play({
							path: `./assets/audios/produto_detalhado_${id}.wav`
						});
					} else if (leitura[1] == 2) {
						player.play({
							path: `./assets/audios/produto_${id}.wav`
						});
					}
					
				}).catch(erro => {

					console.error(`Erro ao reproduzir audio: ${erro}`);
					registrar_leitura(Number(leitura[0]));

				}).finally(() => {
					console.log('Valor recuperado com sucesso! \n');
					banco.sql.close();
					registrar_leitura(Number(leitura[0]));
				});

                //registrar_leitura(Number(leitura[0]));
            } catch (e) {
                throw new Error(`Erro ao tratar os dados recebidos do Arduino: ${e}`);
            }

            // este bloco trata o recebimento dos dados do Arduino (fim)
        });

    }).catch(error => console.error(`Erro ao receber dados do Arduino ${error}`));
}

// função que recebe valores de temperatura e umidade
// e faz um insert no banco de dados
function registrar_leitura(fksensor) {

    if (efetuando_insert) {
        console.log('Execução em curso. Aguardando 7s...');
        setTimeout(() => {
            registrar_leitura(fksensor);
        }, 7000);
        return;
    }

    efetuando_insert = true;

    console.log(`sensor: ${fksensor}`);

    banco.conectar().then(() => {

        return banco.sql.query(`INSERT into registro (fkproduto, fksensor, datahora)
                                values ((SELECT fkProduto from sensor where idsensor = ${fksensor}), ${fksensor}, CONVERT(Datetime, '${agora()}', 120));`);

    }).catch(erro => {

        console.error(`Erro ao tentar registrar aquisição na base: ${erro}`);

    }).finally(() => {
        console.log('Registro inserido com sucesso! \n');
        banco.sql.close();
        efetuando_insert = false;
    });

}

// função que retorna data e hora atual no formato aaaa-mm-dd HH:mm:ss
function agora() {
    let momento_atual = new Date();
    let retorno = `${momento_atual.toLocaleDateString()} ${momento_atual.toLocaleTimeString()}`;
    console.log(`Data e hora atuais: ${retorno}`);
    return retorno;
}

var efetuando_insert = false;


if (gerar_dados_aleatorios) {
    // dados aleatórios
    setInterval(function () {
        console.log('Gerando valores aleatórios!');
        registrar_leitura(Math.round(Math.random() * (4 - 1) + 1), agora())
    }, 5000);
} else {
    // iniciando a "escuta" de dispositivos Arduino.
    console.log('Iniciando obtenção de valores do Arduino!');
    iniciar_escuta();
}

/*
 abrir a pasta deste arquivo via git bash e executar:
 npm i
 npm start
 talvez mostre uma mensagem de erro de placa arduino 
 mas depois vai começar a registrar os dados
*/