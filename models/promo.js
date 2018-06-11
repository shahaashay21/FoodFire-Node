/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('promo', {
		promoid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		code: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		discount_type: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		discount: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		multiple: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		startdate: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
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
		},
		expdata: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'promo',
		timestamps: false
	});
};
