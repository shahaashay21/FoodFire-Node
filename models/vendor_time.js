/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('vendor_time', {
		vendorunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'vendor',
				key: 'vendorunkid'
			}
		},
		day: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		open: {
			type: DataTypes.TIME,
			allowNull: false
		},
		close: {
			type: DataTypes.TIME,
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
		tableName: 'vendor_time',
		timestamps: false
	});
};
