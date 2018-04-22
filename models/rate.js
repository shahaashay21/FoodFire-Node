/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('rate', {
		cusunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'cus',
				key: 'cusunkid'
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
		rate: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '1'
		},
		code_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'map',
				key: 'code_id'
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
		tableName: 'rate',
		timestamps: false
	});
};
