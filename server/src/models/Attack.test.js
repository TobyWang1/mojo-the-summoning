const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals')
const { Attack } = require('.')
const { db } = require('../db/config')

// define in global scope
let attacks

// clear db and create new user before tests
beforeAll(async () => {
  await db.sync({ force: true })
  attacks = await Attack.bulkCreate([
    { title: 'attack1', mojoCost: 20, staminaCost: 2 },
    { title: 'attack2', mojoCost: 10, staminaCost: 1 }
  ])
})

// clear db after tests
afterAll(async () => await db.close())

// Utility function to fetch the first attack
const fetchAttackById = async (id = 1) => {
  return await Attack.findOne({ where: { id } })
}

describe('Attack', () => {
  let fetchedAttack

  // Fetch the attack before running tests
  beforeAll(async () => {
    fetchedAttack = await fetchAttackById()
  })

  it('has a title and it is attack1', async () => {
    expect(fetchedAttack).toHaveProperty('title')
    expect(fetchedAttack.title).toBe('attack1')
  })

  it('has mojoCost and it is 20', async () => {
    expect(fetchedAttack).toHaveProperty('mojoCost')
    expect(fetchedAttack.mojoCost).toBe(20)
  })

  it('has staminaCost and it is 2', async () => {
    expect(fetchedAttack).toHaveProperty('staminaCost')
    expect(fetchedAttack.staminaCost).toBe(2)
  })
})
