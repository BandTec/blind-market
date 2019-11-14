var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Leitura = require('../models').Leitura;

/* Recuperar as últimas N leituras */
router.get('/ultimas', function(req, res, next) {
	
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

	sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
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

	sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
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
	const instrucaoSql = `select DATEPART(Year, datahora) ano, DATEPART(Month, datahora) as mes, count(idregistro) as qtd from registro, sensor, estabelecimento, empresa where fkSensor = idsensor and fkEstabelecimento = idEstabelecimento and fkEmpresa = idempresa and login = '${login}' and datahora >= DATEADD(Month, -12, getdate()) group by DATEPART(Year, datahora), DATEPART(Month, datahora) order by ano desc, mes desc;`;

	sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
		.then(resultado => {
			res.json(resultado);
		}).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
		});
})

router.get('/categorias/:login', function (req, res, next) {
	console.log(`Recuperando a quantidade por categoria`);

	let login = req.params.login;
	const instrucaoSql = `select categoria.nome, count(idregistro) qtd from registro, sensor, estabelecimento, empresa, produto, categoria where registro.fkProduto = idproduto and fkCategoria = idcategoria and fkSensor = idsensor and fkEstabelecimento = idEstabelecimento and fkEmpresa = idEmpresa and login = '${login}' group by categoria.nome`;

	sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
		.then(resultado => {
			res.json(resultado);
		}).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
		});
})

module.exports = router;
