'use strict';

module.exports = (sequelize, DataTypes) => {
	let Sensor = sequelize.define('Sensor', {
		idSensor: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		porta: {
			type: DataTypes.STRING,
			allowNull: false
		},
		corredor: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'sensor',
		freezeTableName: true,
		underscored: true,
		timestamps: false,
	});

	return Sensor;
};