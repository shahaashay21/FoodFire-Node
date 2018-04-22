/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('order_details', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		orderunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'order',
				key: 'orderunkid'
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
		price: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		qty: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		food_diet: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		food_taste: {
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
		tableName: 'order_details',
		timestamps: false
	});
};
