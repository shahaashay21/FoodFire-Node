/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('order', {
		orderunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		cusunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'cus',
				key: 'cusunkid'
			}
		},
		addunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		order_date: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		total: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		discount: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		},
		promoid: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		paymentunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'cf_payment',
				key: 'paymentunkid'
			}
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
		tableName: 'order',
		timestamps: false
	});
};
