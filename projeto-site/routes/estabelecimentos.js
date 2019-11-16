var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Produto = require('../models').Estabelecimento;


/* Cadastrar estabelecimento */
router.post('/cadastrar', function (req, res, next) {
    console.log('Criando um Estabelecimento');

    Estabelecimento.create({
        nome: req.body.cadastro_nome,
        endereco: req.body.cadastro_login,
        cep: req.body.cadastro_email
    }).then(resultado => {
        console.log(`Registro criado: ${resultado}`)
        res.send(resultado);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    });
});

module.exports = router;