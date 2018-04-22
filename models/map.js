/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('map', {
		code_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		map_detail: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		table_name: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'map',
		timestamps: false
	});
};
