var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Estabelecimento = require('../models').Estabelecimento;


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

router.post('/trocarproduto', function (req, res, next) {
    console.log('Alterando produto');

    console.log(req.body);

    let idsensor = req.body.idsensor;
    let produto = req.body.idproduto;

    console.log(idsensor);

    const instrucaoSql = `update sensor set fkProduto = ${produto} where idsensor = ${idsensor}`;

    sequelize.query(instrucaoSql, {
        type: sequelize.QueryTypes.UPDATE
    })
    .then(resultado => {
        res.json(resultado);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    });
});

router.get('/buscar/:cep', function (req, res, next) {
    console.log(`Buscando estabelecimentos`);

    let cep = req.params.cep;
    const instrucaoSql = `select * from estabelecimento where (CONVERT(int, substring(cep, 0, 6))) - ${cep} between -200 and 200`;

    sequelize.query(instrucaoSql, {
        type: sequelize.QueryTypes.SELECT
    })
    .then(resultado => {
        res.json(resultado);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    });
});


router.get('/modal/:idmodal/:login', function (req, res, next) {
    console.log(`Recuperando estabelecimentos`);

    var idmodal = req.params.idmodal;
    var login = req.params.login;
    console.log(idmodal)
    const instrucaoSql = `select * from estabelecimento, empresa, sensor, registro where idEstabelecimento = '${idmodal}' and fkEstabelecimento = idEstabelecimento and login = '${login}'`;

    sequelize.query(instrucaoSql, {
        type: sequelize.QueryTypes.SELECT
    })
    .then(resultado => {
        res.json(resultado);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    });
});

module.exports = router;