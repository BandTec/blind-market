'use strict';

module.exports = (sequelize, DataTypes) => {
	let Categoria = sequelize.define('Categoria', {
		idCategoria: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		nome: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'categoria',
		freezeTableName: true,
		underscored: true,
		timestamps: false,
	});

	return Categoria;
};