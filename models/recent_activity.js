/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('recent_activity', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		cusname: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		vendorunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'vendor',
				key: 'vendorunkid'
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
		tableName: 'recent_activity',
		timestamps: false
	});
};
