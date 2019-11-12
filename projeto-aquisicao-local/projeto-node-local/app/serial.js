const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const player = require('node-wav-player');

var caminho;
class ArduinoDataRead {

    constructor() {
        this.listData = [];
    }

    get List() {
        return this.listData;
    }

    SetConnection() {

        SerialPort.list().then(listSerialDevices => {

            let listArduinoSerial = listSerialDevices.filter(serialDevice => {
                return serialDevice.vendorId == 2341 && serialDevice.productId == 43;
            });

            if (listArduinoSerial.length != 1) {
                throw new Error("The Arduino was not connected or has many boards connceted");
            }

            console.log("Arduino found in the com %s", listArduinoSerial[0].comName);

            return listArduinoSerial[0].comName;


        }).then(arduinoCom => {

            let arduino = new SerialPort(arduinoCom, {
                baudRate: 9600
            });

            const parser = new Readline();
            arduino.pipe(parser);

            parser.on('data', (data) => {
                this.listData.push(parseFloat(data));

                // Separando os valores com o split dos dados que estão vindo do Arduino
                //
                var sensor = data.split(':')[0];
                var tempo = Number(data.split(':')[1]);

                if(tempo == 1){
                    player.play({
                        path: `./assets/audios/produto_detalhado_${sensor}.wav`
                    })
                }else if(tempo == 2){
                    player.play({
                        path: `./assets/audios/produto_${sensor}.wav`
                    })
                }
            });

        }).catch(error => console.log(error));
    }

}

const serial = new ArduinoDataRead();
serial.SetConnection();

module.exports.ArduinoData = {
    List: serial.List
}