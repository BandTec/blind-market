create database blind_market;
use blind_market;

/* criando tabelas */

create table empresa (
idempresa int primary key auto_increment,
nome varchar(50),
login varchar(50),
email varchar(50),
senha varchar(50)
);

create table estabelecimento (
idestabelecimento int primary key auto_increment,
nome varchar(50),
endereco varchar(50)
);

create table categoria (
idcategoria int primary key auto_increment,
nome varchar(50)
);

create table registro(
idregistro int primary key auto_increment,
datahora datetime
);

create table sensor (
idsensor int primary key auto_increment,
corredor varchar(50),
porta varchar(50)
);

create table produto (
idproduto int primary key auto_increment,
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

alter table sensor add fkCategoria int;
alter table sensor add foreign key (fkCategoria) references Categoria (idCategoria);
