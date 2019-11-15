var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Produto = require('../models').Produto;

let sessoes = [];

/* Cadastrar produto */
router.post('/cadastrar', function (req, res, next) {
    console.log('Criando um produto');

    Produto.create({
        nome: req.body.produto_nome,
        preco: req.body.produto_preco,
        fkcategoria: req.body.produto_categoria,
        unidade: req.body.produto_unidade
    }).then(resultado => {
        console.log(`Registro criado: ${resultado}`)
        res.send(resultado);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    });
});


module.exports = router;