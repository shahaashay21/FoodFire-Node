/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cf_payment', {
		paymentunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		paymentname: {
			type: DataTypes.STRING(45),
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
		tableName: 'cf_payment',
		timestamps: false
	});
};
