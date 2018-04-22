/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sessions', {
		session_id: {
			type: DataTypes.STRING(128),
			allowNull: false,
			primaryKey: true
		},
		expires: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: false
		},
		data: {
			type: DataTypes.TEXT,
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
		tableName: 'sessions',
		timestamps: false
	});
};
