const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals')
const { Card, Attack } = require('.')
const { db } = require('../db/config')

// define in global scope
let cards
let attacks

// clear db and create new user before tests
beforeAll(async () => {
  await db.sync({ force: true })
  cards = await Card.bulkCreate([
    { name: 'card1', mojo: 80, stamina: 10, imgUrl: 'URL1' },
    { name: 'card2', mojo: 85, stamina: 9, imgUrl: 'URL2' }
  ])
  attacks = await Attack.bulkCreate([
    { title: 'attack1', mojoCost: 20, staminaCost: 2 },
    { title: 'attack2', mojoCost: 10, staminaCost: 1 }
  ])

  // Associate cards with attacks
  await cards[0].addAttacks([attacks[0], attacks[1]])
  await cards[1].addAttacks([attacks[0]])
})

// clear db after tests
afterAll(async () => await db.close())

// Utility function to fetch the first card
const fetchCardById = async (id = 1) => {
  return await Card.findOne({ where: { id } })
}

describe('Card', () => {
  let fetchedCard

  // Fetch the card before running tests
  beforeAll(async () => {
    fetchedCard = await fetchCardById()
  })

  it('has a name and it is card1', async () => {
    expect(fetchedCard).toHaveProperty('name')
    expect(fetchedCard.name).toBe('card1')
  })

  it('has mojo and it is 85', async () => {
    expect(fetchedCard).toHaveProperty('mojo')
    expect(fetchedCard.mojo).toBe(80)
  })

  it('has stamina and it is 20', async () => {
    expect(fetchedCard).toHaveProperty('stamina')
    expect(fetchedCard.stamina).toBe(10)
  })

  it('imgUrl and it is URL1', async () => {
    expect(fetchedCard).toHaveProperty('imgUrl')
    expect(fetchedCard.imgUrl).toBe('URL1')
  })
})

describe('Card and Attack association', () => {
  it('card1 is associated with attack1 and attack2', async () => {
    const fetchedCard = await Card.findOne({
      where: { id: cards[0].id },
      include: Attack
    })
    expect(fetchedCard.Attacks.length).toBe(2)
    expect(fetchedCard.Attacks.map(attack => attack.title)).toContain('attack1')
    expect(fetchedCard.Attacks.map(attack => attack.title)).toContain('attack2')
  })

  it('card2 is associated with attack1 only', async () => {
    const fetchedCard = await Card.findOne({
      where: { id: cards[1].id },
      include: Attack
    })
    expect(fetchedCard.Attacks.length).toBe(1)
    expect(fetchedCard.Attacks[0].title).toBe('attack1')
  })

  it('attack1 is associated with both card1 and card2', async () => {
    const fetchedAttack = await Attack.findOne({
      where: { id: attacks[0].id },
      include: Card
    })
    expect(fetchedAttack.Cards.length).toBe(2)
    expect(fetchedAttack.Cards.map(card => card.name)).toContain('card1')
    expect(fetchedAttack.Cards.map(card => card.name)).toContain('card2')
  })

  it('attack2 is associated with card1 only', async () => {
    const fetchedAttack = await Attack.findOne({
      where: { id: attacks[1].id },
      include: Card
    })
    expect(fetchedAttack.Cards.length).toBe(1)
    expect(fetchedAttack.Cards[0].name).toBe('card1')
  })
})
