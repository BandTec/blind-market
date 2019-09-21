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
idprodutp int primary key auto_increment,
nome varchar(50),
preço decimal(5,2)
);

/* criando colunas fk*/

alter table produto add fkCategoria int;
alter table produto foreign key (fkCategoria) references categoria (idcategoria);