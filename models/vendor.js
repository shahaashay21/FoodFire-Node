/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('vendor', {
		vendorunkid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		vendor_url: {
			type: DataTypes.STRING(70),
			allowNull: true
		},
		vendor_fullurl: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		vendor_name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		address: {
			type: DataTypes.STRING(500),
			allowNull: true
		},
		imgsrc: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		dp: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		area: {
			type: DataTypes.STRING(45),
			allowNull: false,
			defaultValue: 'Mota-Bazar'
		},
		city: {
			type: DataTypes.STRING(40),
			allowNull: false,
			defaultValue: 'Anand'
		},
		zipcode: {
			type: DataTypes.STRING(15),
			allowNull: false,
			defaultValue: '388120'
		},
		isactive: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		birthdate: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		anniversarydate: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		note: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		price: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		},
		speciality: {
			type: DataTypes.STRING(1000),
			allowNull: true
		},
		veg: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '1'
		},
		jain: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		swaminarayan: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		non_veg: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		del_time: {
			type: DataTypes.STRING(255),
			allowNull: false,
			defaultValue: '30 Minutes'
		},
		tax: {
			type: DataTypes.FLOAT,
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
		tableName: 'vendor',
		timestamps: false
	});
};
