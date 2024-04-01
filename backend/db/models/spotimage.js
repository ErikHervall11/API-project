"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpotImage.belongsTo(models.Spot, { foreignKey: "spotId" });
    }
  }
  SpotImage.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
      },
      url: DataTypes.INTEGER,
      preview: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "SpotImage",
    }
  );
  return SpotImage;
};
