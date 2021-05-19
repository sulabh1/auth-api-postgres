const validator = require("validator");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: { type: DataTypes.STRING, allowNull: false, min: 8 },
      photo: DataTypes.STRING,
      // passwordChangedAt: DataTypes.Date,
      passwordResetToken: DataTypes.STRING,
    },
    {
      tableName: "users",
    }
  );
  return User;
};
