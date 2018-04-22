/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('items', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		itemunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'cf_items',
				key: 'itemunkid'
			}
		},
		vendorunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'vendor',
				key: 'vendorunkid'
			}
		},
		price: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		pro_description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		size: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		isactive: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '1'
		},
		isavailable: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '1'
		},
		percent_discount: {
			type: DataTypes.INTEGER(5),
			allowNull: true
		},
		cash_discount: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		originalprice: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		discount_from: {
			type: DataTypes.DATE,
			allowNull: true
		},
		discount_to: {
			type: DataTypes.DATE,
			allowNull: true
		},
		food_diet: {
			type: DataTypes.STRING(255),
			allowNull: false,
			defaultValue: 'Vegetarian'
		},
		food_taste: {
			type: DataTypes.STRING(255),
			allowNull: false,
			defaultValue: 'Medium'
		},
		modal: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '1'
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
		tableName: 'items',
		timestamps: false
	});
};
