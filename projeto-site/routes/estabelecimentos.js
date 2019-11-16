var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Produto = require('../models').Estabelecimento;


/* Cadastrar estabelecimento */
router.post('/cadastrar', function (req, res, next) {
    console.log('Criando um Estabelecimento');

    Estabelecimento.create({
        nome: req.body.nomeEstabelecimento,
        endereco: req.body.enderecoEstabelecimento,
        cep: req.body.cepEstabelecimento,
        fkempresa: req.body.nomeEmpresa
    }).then(resultado => {
        console.log(`Registro criado: ${resultado}`)
        res.send(resultado);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    });
});

module.exports = router;