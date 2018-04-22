/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('search', {
		res: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		home_experience: {
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
		tableName: 'search',
		timestamps: false
	});
};
