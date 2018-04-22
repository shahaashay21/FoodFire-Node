/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cus_address', {
		addunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		cusunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'cus',
				key: 'cusunkid'
			}
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		area: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		city: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		pincode: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		defaultadd: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'cus_address',
		timestamps: false
	});
};
