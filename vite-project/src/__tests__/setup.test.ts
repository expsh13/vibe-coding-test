import { describe, it, expect } from 'vitest'

describe('Test Environment Setup', () => {
  it('should have vitest working', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have modern JS features available', () => {
    const arr = [1, 2, 3]
    const doubled = arr.map(x => x * 2)
    expect(doubled).toEqual([2, 4, 6])
  })
})