'use strict';

module.exports = (sequelize, DataTypes) => {
	let Registro = sequelize.define('Registro', {
		idRegistro: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		datahora: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		tableName: 'registro',
		freezeTableName: true,
		underscored: true,
		timestamps: false,
	});

	return Registro;
};