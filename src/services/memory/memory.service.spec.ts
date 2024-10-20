import { Memory, userMemoryInstance } from '@/services/memory/memory.service'
import { BaseUser, User } from '@/models/user.model'
import { IUserStorage, MemInvalidArgs, MemNotFound } from '@/models/memory.model'
import { expectTypeOf } from 'expect-type'

const user: BaseUser = {
  username: 'Shrock',
  age: 54,
  hobbies: ['Swamp'],
}

const user1: BaseUser = {
  username: 'Shrek',
  age: 33,
  hobbies: ['Fiona'],
}

describe('Memory class', (): void => {
  beforeEach(() => {
    userMemoryInstance.clear()
  })

  test('should create not create more than one exemplar', (): void => {
    const memory1: IUserStorage = userMemoryInstance
    const memory2: IUserStorage = userMemoryInstance

    expect(memory1).toBe(memory2)
    expect(memory1).toBeInstanceOf(Memory)
    expect(memory2).toBeInstanceOf(Memory)
  })

  test('addUser should throw MemInvalidArgs error when user is not presented', (): void => {
    const user = null as unknown

    expect(() => userMemoryInstance.addUser(user as BaseUser)).toThrow(MemInvalidArgs)
  })

  test('addUser should return new User on success', (): void => {
    const newUser: User = userMemoryInstance.addUser(user)

    expectTypeOf(newUser).toEqualTypeOf<User>()
  })

  test('getAllUsers should throw MemNotFound if no users in memory', (): void => {
    expect(() => userMemoryInstance.getAllUsers()).toThrow(MemNotFound)
  })

  test('getAllUsers should return users', (): void => {
    userMemoryInstance.addUser(user)

    const users: User[] = userMemoryInstance.getAllUsers()

    expect(users).toHaveLength(1)
    expectTypeOf(users).toEqualTypeOf<User[]>()
  })

  test('getUserById should throw MemNotFound if user is not presented', (): void => {
    expect(() => userMemoryInstance.getUserById(null as unknown as string)).toThrow(MemNotFound)
  })

  test('getUserById should throw MemNotFound if no user in memory', (): void => {
    userMemoryInstance.addUser(user)

    expect(userMemoryInstance.getAllUsers()).toHaveLength(1)

    expect(() => userMemoryInstance.getUserById('0')).toThrow(MemNotFound)
  })

  test('getAllUsers should return user by ID', (): void => {
    userMemoryInstance.addUser(user)
    userMemoryInstance.addUser(user1)

    expect(user).not.toBe(user1)

    const users: User[] = userMemoryInstance.getAllUsers()

    expect(userMemoryInstance.getUserById(users[0].id)).toBe(users[0])
    expect(userMemoryInstance.getUserById(users[0].id)).not.toBe(users[1])
  })

  test('deleteUser should throw MemInvalidArgs if no users in memory', (): void => {
    expect(() => userMemoryInstance.deleteUser(null as unknown as string)).toThrow(MemInvalidArgs)
  })

  test('deleteUser should throw MemNotFound if no user in memory', (): void => {
    userMemoryInstance.addUser(user)

    expect(userMemoryInstance.getAllUsers()).toHaveLength(1)

    expect(() => userMemoryInstance.deleteUser('0')).toThrow(MemNotFound)
  })

  test('deleteUser should delete user by ID', (): void => {
    userMemoryInstance.addUser(user)
    userMemoryInstance.addUser(user1)

    expect(user).not.toBe(user1)

    const users: User[] = userMemoryInstance.getAllUsers()

    expect(users).toHaveLength(2)

    expect(userMemoryInstance.deleteUser(users[0].id)).toBe(true)

    expect(userMemoryInstance.getAllUsers()).toHaveLength(1)
  })

  test('updateUser should throw MemInvalidArgs if user is not presented', (): void => {
    expect(() => userMemoryInstance.updateUser(null as unknown as BaseUser, '0')).toThrow(MemInvalidArgs)
  })

  test('updateUser should throw MemInvalidArgs if id is not presented', (): void => {
    expect(() => userMemoryInstance.updateUser(user, '')).toThrow(MemInvalidArgs)
  })

  test('updateUser should throw MemNotFound if user is not found', (): void => {
    userMemoryInstance.addUser(user)

    expect(userMemoryInstance.getAllUsers()).toHaveLength(1)

    expect(() => userMemoryInstance.updateUser(user1, '123')).toThrow(MemNotFound)
  })

  test('updateUser should return User without changes if user.id = user.id', (): void => {
    userMemoryInstance.addUser(user)
    userMemoryInstance.addUser(user1)

    expect(user).not.toBe(user1)

    const users: User[] = userMemoryInstance.getAllUsers()

    expect(userMemoryInstance.getAllUsers()).toHaveLength(2)

    expect(userMemoryInstance.updateUser(user, users[0].id)).toStrictEqual(users[0])
  })

  test('updateUser should update user with user1 data', (): void => {
    userMemoryInstance.addUser(user)
    userMemoryInstance.addUser(user1)

    expect(user).not.toBe(user1)

    const users: User[] = userMemoryInstance.getAllUsers()

    expect(userMemoryInstance.getAllUsers()).toHaveLength(2)

    expect(userMemoryInstance.updateUser(user1, users[0].id)?.age).toEqual(users[1]?.age)
    expect(userMemoryInstance.updateUser(user1, users[0].id)?.hobbies).toEqual(users[1]?.hobbies)
    expect(userMemoryInstance.updateUser(user1, users[0].id)?.username).toEqual(users[1]?.username)

    expect(userMemoryInstance.updateUser(user1, users[0].id)?.id).not.toEqual(users[1]?.id)
  })
})
