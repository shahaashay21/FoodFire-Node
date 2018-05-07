/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cart', {
		cartid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		cusunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'cus',
				key: 'cusunkid'
			}
		},
		itemid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'items',
				key: 'id'
			}
		},
		qty: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		food_taste: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		food_diet: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		extra: {
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
		tableName: 'cart',
		timestamps: false
	});
};
