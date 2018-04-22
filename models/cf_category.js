/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cf_category', {
		categoryunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		parent_categoryunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'cf_category',
				key: 'categoryunkid'
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
		tableName: 'cf_category',
		timestamps: false
	});
};
