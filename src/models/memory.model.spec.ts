import { MemInvalidArgs, MemNotFound } from '@/models/memory.model'

describe('MemNotFound', () => {
  test('should create an instance of MemNotFound', () => {
    const error = new MemNotFound()

    expect(error).toBeInstanceOf(MemNotFound)

    expect(error.message).toBe('User or users not found!')

    expect(error.name).toBe('MemNotFound')
  })
})

describe('MemInvalidArgs', () => {
  test('should create an instance of MemInvalidArgs', () => {
    const error = new MemInvalidArgs()

    expect(error).toBeInstanceOf(MemInvalidArgs)

    expect(error.message).toBe('Invalid arguments!')

    expect(error.name).toBe('MemInvalidArgs')
  })
})
