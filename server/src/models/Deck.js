const { db, Model, DataTypes } = require('../db/config')

class Deck extends Model {}

Deck.init(
  {
    name: DataTypes.STRING,
    xp: DataTypes.INTEGER
  },
  {
    sequelize: db,
    modelName: 'Deck'
  }
)

module.exports = {
  Deck
}
