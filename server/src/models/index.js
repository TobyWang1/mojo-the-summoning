const { User } = require('./User')
const { Deck } = require('./Deck')
const { Card } = require('./Card')
const { Attack } = require('./Attack')
// import the rest of your models above

// set up the associations here
User.hasOne(Deck, { foreignKey: 'userId' })
Deck.belongsTo(User, { foreignKey: 'userId' })
Deck.hasMany(Card, { foreignKey: 'deckId' })
Card.belongsTo(Deck, { foreignKey: 'deckId' })
Card.belongsToMany(Attack, { through: 'CardAttack' })
Attack.belongsToMany(Card, { through: 'CardAttack' })

// and then export them all below
module.exports = {
  User,
  Deck,
  Card,
  Attack
}
