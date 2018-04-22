/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cf_items', {
		itemunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		categoryunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'cf_category',
				key: 'categoryunkid'
			}
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		description: {
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
		tableName: 'cf_items',
		timestamps: false
	});
};
