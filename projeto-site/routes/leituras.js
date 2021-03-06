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

router.get('/todosestabelecimentos/listagem/:login', function (req, res, next) {
	console.log(`Recuperando estabelecimentos para listagem`);

	let login = req.params.login;
	const instrucaoSql = `select e.*, em.idEmpresa,em.login from estabelecimento as e  inner join 
	empresa as em on e.fkEmpresa = em.idEmpresa where em.login = '${login}'`;

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

router.get('/atualizar/estabelecimento/:id', function (req, res, next) {
	console.log(`Recuperando estabelecimentos para atualizar usuario`);

	let idestabelecimento = req.params.id;
	const instrucaoSql = `select * from estabelecimento where idEstabelecimento = ${idestabelecimento}`;

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
	console.log(`Recuperando estabelecimentos`);

	let login = req.params.login;
	let id = req.params.id;

	const instrucaoSql = `select DATEPART(Year, datahora) ano, DATEPART(Month, datahora) as mes, count(idregistro) as qtd from registro, sensor, estabelecimento, empresa where fkSensor = idsensor and fkEstabelecimento = idEstabelecimento and fkEmpresa = idempresa and registro.fkProduto = ${id} and login = '${login}' and datahora >= DATEADD(Month, -12, getdate()) group by DATEPART(Year, datahora), DATEPART(Month, datahora) order by ano desc, mes desc`;

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
	const instrucaoSql = `select datepart(year, datahora) ano, datepart(month, datahora) mes, estabelecimento.nome, 
							estabelecimento.endereco, estabelecimento.cep, count(idregistro) qtd 
							from registro
							inner join sensor on fkSensor = idsensor
							right join estabelecimento on fkEstabelecimento = idEstabelecimento
							inner join empresa on fkEmpresa = idempresa
							where login = '${login}' and idestabelecimento = (
								select id from (
									select top 1 idEstabelecimento id, count(idregistro) qtd from registro
									inner join sensor on fkSensor = idsensor
									right join estabelecimento on fkEstabelecimento = idEstabelecimento
									inner join empresa on fkEmpresa = idempresa
									where login = '${login}' and ((datepart(year, datahora) = datepart(year, getdate())
									and datepart(month, datahora) = datepart(month, getdate())) or datahora is null)
									group by idEstabelecimento, datepart(year, datahora), datepart(month, datahora)
									order by qtd
								) dados
							)
							group by datepart(year, datahora), datepart(month, datahora), estabelecimento.nome, 
							estabelecimento.endereco, estabelecimento.cep
							order by ano desc, mes desc`;

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



// Trazendo todos os estabelecimentos para popular o modal
router.get('/dashboard/estabelecimentos/modal/:idmodal', function (req, res, next) {
	console.log(`Recuperando estabelecimentos`);

	let idmodal = req.params.idmodal;
	const instrucaoSql = `select * from estabelecimento where idEstabelecimento = '${idmodal}'`;

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
							WHERE (DATEPART(YEAR, datahora) = DATEPART(YEAR, GETDATE()) and DATEPART(MONTH, datahora) = DATEPART(MONTH, GETDATE()) or datahora is null)
								and login = '${login}'
							GROUP BY idEstabelecimento, estabelecimento.nome`;

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

router.get('/estatisticas/estabelecimento/:id/:login', function (req, res, next) {
	console.log(`Recuperando a quantidade por categoria`);

	let id = req.params.id;
	let login = req.params.login;

	const instrucaoSql = `SELECT DISTINCT idEstabelecimento id, nome,
							PERCENTILE_DISC(0) WITHIN GROUP (ORDER BY qtd)  
							OVER (PARTITION BY nome) AS Minimo,
							PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY qtd)  
							OVER (PARTITION BY nome) AS Q1,
							PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY qtd)  
							OVER (PARTITION BY nome) AS Mediana,
							PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY qtd)  
							OVER (PARTITION BY nome) AS Q3,
							PERCENTILE_DISC(1) WITHIN GROUP (ORDER BY qtd)  
							OVER (PARTITION BY nome) AS Maximo
						FROM (
							SELECT idEstabelecimento, estabelecimento.nome, count(idregistro) as qtd from registro
							INNER JOIN sensor on fkSensor = idsensor
							RIGHT JOIN estabelecimento on fkEstabelecimento = idEstabelecimento
							INNER JOIN empresa on fkEmpresa = idempresa
							WHERE login	= '${login}' and idEstabelecimento = ${id}
							GROUP BY idEstabelecimento, estabelecimento.nome, DATEPART(YEAR, datahora), DATEPART(MONTH, datahora)
						) dados`;

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

router.get('/estatisticas/produto/:id/:login', function (req, res, next) {
	console.log(`Recuperando a quantidade por categoria`);

	let id = req.params.id;
	let login = req.params.login;

	const instrucaoSql = `SELECT DISTINCT nome,
								PERCENTILE_DISC(0.25) WITHIN GROUP (ORDER BY qtd)  
								OVER (PARTITION BY nome) AS Q1,
								PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY qtd)  
								OVER (PARTITION BY nome) AS Mediana,
								PERCENTILE_DISC(0.75) WITHIN GROUP (ORDER BY qtd)  
								OVER (PARTITION BY nome) AS Q3
							FROM (
								SELECT produto.nome, count(idregistro) as qtd from registro
								INNER JOIN produto on fkProduto = idproduto
								INNER JOIN sensor on fkSensor = idsensor
								INNER JOIN estabelecimento on fkEstabelecimento = idEstabelecimento
								INNER JOIN empresa on fkEmpresa = idempresa
								WHERE login	= '${login}' and idproduto = ${id}
								GROUP BY produto.nome, DATEPART(YEAR, datahora), DATEPART(MONTH, datahora)
							) dados`;

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
							INNER JOIN produto on registro.fkProduto = idproduto
							INNER JOIN sensor on fkSensor = idsensor
							INNER JOIN estabelecimento on fkEstabelecimento = idEstabelecimento
							LEFT JOIN empresa on fkEmpresa = idempresa
							WHERE DATEPART(YEAR, datahora) = DATEPART(YEAR, GETDATE()) and DATEPART(MONTH, datahora) = DATEPART(MONTH, GETDATE()) and login = '${login}'
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

router.get('/todossensores/:login', function (req, res, next) {
	console.log(`Recuperando a quantidade por categoria`);

	let login = req.params.login;
	const instrucaoSql = `SELECT idsensor id, fkProduto, estabelecimento.nome estabelecimento, corredor FROM sensor
							INNER JOIN estabelecimento on fkEstabelecimento = idEstabelecimento
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

router.get('/combobox/categorias', function (req, res, next) {
	console.log(`Recuperando a quantidade por categoria`);

	const instrucaoSql = `select idcategoria id, nome from categoria`;

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

router.get('/combobox/produtos', function (req, res, next) {
	console.log(`Recuperando a quantidade por categoria`);

	const instrucaoSql = `select idproduto id, nome from produto`;

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