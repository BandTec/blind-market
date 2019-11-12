'use strict';

/* 
lista e explicação dos Datatypes:
https://codewithhugo.com/sequelize-data-types-a-practical-guide/
*/

module.exports = (sequelize, DataTypes) => {
    let Leitura = sequelize.define('Leitura',{	
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},	
		fksensor: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		fkproduto: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		datahora: {
			type: DataTypes.DATE,
			allowNull: false
		},
		momento_grafico: {
			type: DataTypes.VIRTUAL, // campo 'falso' (não existe na tabela). Deverá ser preenchido 'manualmente' no select
			allowNull: true
		}
	}, 
	{
		tableName: 'registro', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return Leitura;
};
