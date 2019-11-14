'use strict';

module.exports = (sequelize, DataTypes) => {
	let Estabelecimento = sequelize.define('Estabelecimento', {
		idEstabelecimento: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		nome: {
			type: DataTypes.STRING,
			allowNull: false
		},
		endereco: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'estabelecimento',
		freezeTableName: true,
		underscored: true,
		timestamps: false,
	});

	return Estabelecimento;
};