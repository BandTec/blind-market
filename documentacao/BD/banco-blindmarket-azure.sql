create database blind_market;
use blind_market;

/* criando tabelas */

create table empresa (
	idempresa int primary key identity(1,1),
	nome varchar(50),
	login varchar(50),
	email varchar(50),
	senha varchar(50)
);

create table estabelecimento (
	idestabelecimento int primary key identity(1,1),
	nome varchar(50),
	endereco varchar(50),
	cep char(9)
);

create table categoria (
	idcategoria int primary key identity(1,1),
	nome varchar(50)
);

create table registro(
	idregistro int primary key identity(1,1),
	datahora datetime
);

create table sensor (
	idsensor int primary key identity(1,1),
	corredor varchar(50),
	porta varchar(50)
);

create table produto (
	idproduto int primary key identity(1,1),
	nome varchar(50),
	preco decimal(5,2)
);

select * from produto;
select * from empresa;
select * from estabelecimento;
select * from registro;
select * from categoria;
select * from sensor;

/* criando colunas fk*/

alter table produto add fkCategoria int;
alter table produto add foreign key (fkCategoria) references categoria (idcategoria);

alter table estabelecimento add fkEmpresa int;
alter table estabelecimento add foreign key (fkEmpresa) references Empresa (idempresa);

alter table registro add fkSensor int;
alter table registro add fkProduto int;
alter table registro add foreign key (fkSensor) references Sensor (idsensor);
alter table registro add foreign key (fkProduto) references Produto (idproduto);

alter table sensor add fkProduto int;
alter table sensor add foreign key (fkProduto) references Produto (idProduto);
alter table sensor add fkEstabelecimento int;
alter table sensor add foreign key (fkEstabelecimento) references Estabelecimento (idestabelecimento);

/* Selects para compor os gráficos estatísticos */

-- Quantidade de sensores ativos de todos os estabelecimentos
select DATEPART(Year, datahora) ano, DATEPART(Month, datahora) as mes, count(idregistro) as qtd from registro, sensor, estabelecimento where fkSensor = idsensor and fkEstabelecimento = idEstabelecimento and fkEmpresa = 1 and datahora >= DATEADD(Month, -12, getdate()) group by DATEPART(Year, datahora), DATEPART(Month, datahora) order by ano, mes;

-- Quantidade de sensores ativos por categoria de produto
select categoria.nome, count(idregistro) qtd from registro, sensor, estabelecimento, produto, categoria where registro.fkProduto = idproduto and fkCategoria = idcategoria and fkSensor = idsensor and fkEstabelecimento = idEstabelecimento and fkEmpresa = 1 group by categoria.nome;

-- Quantidade de sensores ativos por estabelecimento
select nome, count(idregistro) from registro, sensor, estabelecimento where fkSensor = idsensor and fkEstabelecimento = idEstabelecimento and fkEmpresa = 2 group by nome;
