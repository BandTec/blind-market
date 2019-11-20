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
        preco: parseInt(req.body.produto_preco),
        fkcategoria: Number(req.body.produto_categoria),
        unidade: req.body.produto_unidade
    }).then(resultado => {
        console.log(`Registro criado: ${resultado}`)
        res.send(resultado);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    });
});

router.get('/todosprodutos/:login', function (req, res, next) {
    console.log(`Recuperando a quantidade por categoria`);

    let login = req.params.login;
    const instrucaoSql = `SELECT idproduto id, produto.nome, categoria.nome categoria, preco, corredor FROM produto
                            INNER JOIN sensor on idproduto = fkProduto
                            INNER JOIN estabelecimento on fkEstabelecimento = idEstabelecimento
                            INNER JOIN categoria on fkCategoria = idcategoria
                            INNER JOIN empresa on fkEmpresa = idempresa
                            WHERE login = '${login}'`;

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

router.get('/produto/:login/:id', function (req, res, next) {
    console.log(`Recuperando a quantidade por categoria`);

    let login = req.params.login;
    let id = req.params.id;

    const instrucaoSql = `select idproduto id, produto.nome, preco, categoria.nome categoria, corredor from produto 
                            inner join categoria on fkCategoria = idcategoria
                            left join sensor on fkProduto = idproduto
                            left join estabelecimento on fkEstabelecimento = idestabelecimento
                            left join empresa on fkEmpresa = idempresa
                            where idproduto = ${id} and (login = '${login}' or login is null)`;

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