/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cus', {
		cusunkid: {
			type: DataTypes.INTEGER(255),
			allowNull: false,
			primaryKey: true
		},
		username: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		email: {
			type: DataTypes.STRING(250),
			allowNull: true
		},
		contact: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		gender: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		birthday: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		userimg: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		remember_token: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		conf: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		confirmed: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		type: {
			type: DataTypes.STRING(10),
			allowNull: false,
			defaultValue: 'cus'
		},
		vendorunkid: {
			type: DataTypes.INTEGER(255),
			allowNull: true,
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
		tableName: 'cus',
		timestamps: false
	});
};
