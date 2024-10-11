const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals')
const { Deck, Card } = require('.')
const { db } = require('../db/config')

// define in global scope
let deck
let cards

// clear db and create new user before tests
beforeAll(async () => {
  await db.sync({ force: true })
  deck = await Deck.create({ name: 'myDeck', xp: 100 })
  cards = await Card.bulkCreate([
    { name: 'card1', mojo: 80, stamina: 10, imgUrl: 'URL1', deckId: deck.id },
    { name: 'card2', mojo: 85, stamina: 9, imgUrl: 'URL2', deckId: deck.id }
  ])
})

// clear db after tests
afterAll(async () => await db.close())

describe('Deck', () => {
  it('has an name and it is myDeck', async () => {
    expect(deck).toHaveProperty('name')
    expect(deck.name).toBe('myDeck')
  })

  it('has a xp and it is 100', async () => {
    expect(deck).toHaveProperty('xp')
    expect(deck.xp).toBe(100)
  })
})

describe('Deck and Cards association', () => {
  it('has multiple cards', async () => {
    const fetchedDeck = await Deck.findOne({
      where: { name: 'myDeck' },
      include: Card // This is part of Sequelize's eager loading feature, which allows you to fetch related models along with the primary model in a single query.
    })
    expect(fetchedDeck.Cards.length).toBe(2)
    expect(fetchedDeck.Cards[0].name).toBe('card1')
    expect(fetchedDeck.Cards[1].deckId).toBe(1)
  })
})
