var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Leitura = require('../models').Leitura;

/* Recuperar as últimas N leituras */
router.get('/ultimas', function (req, res, next) {

	// quantas são as últimas leituras que quer? 8 está bom?
	const limite_linhas = 7;

	console.log(`Recuperando as últimas ${limite_linhas} leituras`);

	const instrucaoSql = `select top ${limite_linhas} 
						fkproduto, 
						fksensor, 
						datahora,
						FORMAT(datahora,'HH:mm:ss') as momento_grafico 
						from registro order by idregistro desc`;

	sequelize.query(instrucaoSql, {
			model: Leitura,
			mapToModel: true
		})
		.then(resultado => {
			console.log(`Encontrados: ${resultado.length}`);
			res.json(resultado);
		}).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
		});
});


// tempo real (último valor de cada leitura)
router.get('/tempo-real', function (req, res, next) {

	console.log(`Recuperando as últimas leituras`);

	const instrucaoSql = `select top 1 fksensor, fkProduto, datahora from registro order by idregistro desc`;

	sequelize.query(instrucaoSql, {
			type: sequelize.QueryTypes.SELECT
		})
		.then(resultado => {
			res.json(resultado[0]);
		}).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
		});

});


// estatísticas (max, min, média, mediana, quartis etc)
router.get('/estatisticas', function (req, res, next) {

	console.log(`Recuperando as estatísticas atuais`);

	const instrucaoSql = `select 
							max(fkproduto) as produto_max, 
							min(fkproduto) as produto_min, 
							avg(fkproduto) as produto_avg,
							max(fksensor) as sensor_max, 
							min(fksensor) as sensor_min, 
							avg(fksensor) as sensor_avg 
						from registro`;

	sequelize.query(instrucaoSql, {
			type: sequelize.QueryTypes.SELECT
		})
		.then(resultado => {
			res.json(resultado[0]);
		}).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
		});

});

router.get('/todosestabelecimentos/:login', function (req, res, next) {
	console.log(`Recuperando estabelecimentos`);

	let login = req.params.login;
	const instrucaoSql = `select DATEPART(Year, datahora) ano, DATEPART(Month, datahora) as mes, count(idregistro) as qtd from registro, sensor, estabelecimento, empresa where fkSensor = idsensor and fkEstabelecimento = idEstabelecimento and fkEmpresa = idempresa and login = '${login}' and datahora >= DATEADD(Month, -12, getdate()) group by DATEPART(Year, datahora), DATEPART(Month, datahora) order by ano desc, mes desc`;

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


// Gráfico da Dashboard dos estabelecimentos
router.get('/dashboard/estabelecimentos/:login', function (req, res, next) {
	console.log(`Recuperando estabelecimentos`);

	let login = req.params.login;
	const instrucaoSql = `select TOP 10 * from empresa, estabelecimento, sensor, registro where fkEmpresa = idEmpresa and fkEstabelecimento = idEstabelecimento and fkSensor = idSensor and login = '${login}'`;

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

router.get('/categorias/:login', function (req, res, next) {
	console.log(`Recuperando a quantidade por categoria`);

	let login = req.params.login;
	const instrucaoSql = `select categoria.nome, count(idregistro) qtd from registro, sensor, estabelecimento, empresa, produto, categoria where registro.fkProduto = idproduto and fkCategoria = idcategoria and fkSensor = idsensor and fkEstabelecimento = idEstabelecimento and fkEmpresa = idEmpresa and login = '${login}' group by categoria.nome`;

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

router.get('/topestabelecimentos/:login', function (req, res, next) {
	console.log(`Recuperando a quantidade por categoria`);
	let login = req.params.login;
	const instrucaoSql = `select top 5 estabelecimento.nome, count(idregistro) as qtd from registro, sensor, estabelecimento, empresa where fkSensor = idsensor and fkEstabelecimento = idEstabelecimento and fkEmpresa = idempresa and login = '${login}' group by estabelecimento.nome;`;

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

router.get('/qtdestabelecimentos/:login', function (req, res, next) {
	console.log(`Recuperando a quantidade por categoria`);
	let login = req.params.login;
	const instrucaoSql = `SELECT idEstabelecimento id, estabelecimento.nome, count(idregistro) qtd 
							FROM estabelecimento
							LEFT JOIN sensor on fkEstabelecimento = idEstabelecimento
							LEFT JOIN registro on fkSensor = idsensor
							INNER JOIN empresa on fkEmpresa = idempresa
							WHERE (datahora > DATEADD(WEEK, DATEDIFF(WEEK, '1905-01-01', CURRENT_TIMESTAMP), '1905-01-01') or datahora is null) 
								and login = '${login}'
							GROUP BY idEstabelecimento, estabelecimento.nome, DATEPART(Year, datahora), DATEPART(Month, datahora), DATEPART(Week, datahora)`;

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

router.get('/estatisticas/estabelecimento/:estabelecimento', function (req, res, next) {
	console.log(`Recuperando a quantidade por categoria`);

	let estabelecimento = req.params.estabelecimento;
	const instrucaoSql = `SELECT idestabelecimento id, nome, AVG(qtd) media from (
							SELECT idestabelecimento, nome, count(idregistro) as qtd 
							FROM estabelecimento
							LEFT JOIN sensor on fkEstabelecimento = idEstabelecimento
							LEFT JOIN registro on fkSensor = idsensor
							WHERE idEstabelecimento = ${estabelecimento}
							GROUP BY idestabelecimento, nome, DATEPART(Year, datahora), DATEPART(Month, datahora), DATEPART(Week, datahora)
						) as quantidade group by idestabelecimento, nome`;

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

router.get('/qtdprodutos/:login', function (req, res, next) {
	console.log(`Recuperando a quantidade por categoria`);

	let login = req.params.login;
	const instrucaoSql = `SELECT TOP 10 idproduto, produto.nome, count(idregistro) qtd FROM registro
							INNER JOIN produto on fkProduto = idproduto
							INNER JOIN sensor on fkSensor = idsensor
							INNER JOIN estabelecimento on fkEstabelecimento = idEstabelecimento
							INNER JOIN empresa on fkEstabelecimento = idempresa
							WHERE (datahora > DATEADD(DAY, -(DATEPART(WEEKDAY, '2019-11-16') - 1), '2019-11-16')) and login = '${login}'
							GROUP BY idproduto, produto.nome`;

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