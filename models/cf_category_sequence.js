/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cf_category_sequence', {
		sequenceunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		categoryunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'cf_category',
				key: 'categoryunkid'
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
		sequence: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		}
	}, {
		tableName: 'cf_category_sequence',
		timestamps: false
	});
};
