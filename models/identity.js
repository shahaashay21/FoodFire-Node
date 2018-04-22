/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('identity', {
		tbl_name: {
			type: DataTypes.STRING(255),
			allowNull: false,
			primaryKey: true
		},
		lastunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false
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
		tableName: 'identity',
		timestamps: false
	});
};
