/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('subitems', {
		subitemid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		itemid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'items',
				key: 'id'
			}
		},
		item_name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		item_price: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		category: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		subitem_type: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		min: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		max: {
			type: DataTypes.INTEGER(11),
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
		tableName: 'subitems',
		timestamps: false
	});
};
