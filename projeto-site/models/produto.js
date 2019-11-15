'use strict';

module.exports = (sequelize, DataTypes) => {
	let Produto = sequelize.define('Produto', {
		idProduto: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		nome: {
			type: DataTypes.STRING,
			allowNull: false
		},
		preco: {
			type: DataTypes.DECIMAL,
			allowNull: false
		},
		fkcategoria: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		unidade: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'produto',
		freezeTableName: true,
		underscored: true,
		timestamps: false,
	});

	return Produto;
};