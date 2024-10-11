const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals')
const { User, Deck } = require('.')
const { db } = require('../db/config')

// define in global scope
let user
let deck

// clear db and create new user before tests
beforeAll(async () => {
  await db.sync({ force: true })
  user = await User.create({ username: 'gandalf' })
  deck = await Deck.create({ userId: user.id })
})

// clear db after tests
afterAll(async () => await db.close())

describe('User', () => {
  it('has an id', async () => {
    expect(user).toHaveProperty('id')
  })

  it('has a username and it is gandalf', async () => {
    expect(user).toHaveProperty('username')
    expect(user.username).toBe('gandalf')
  })
})

describe('User and Deck association', () => {
  // test user and deck relationship
  it('has a deck', async () => {
    const fetchedUser = await User.findOne({
      where: { username: 'gandalf' },
      include: Deck
    })
    expect(fetchedUser.Deck.userId).toBe(user.id)
  })
})
