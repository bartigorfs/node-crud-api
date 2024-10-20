import {Memory} from "@/services/memory/memory.service";
import {BaseUser, User} from "@/models/user.model";
import {MemInvalidArgs, MemNotFound} from "@/models/memory.model";
import {expectTypeOf} from 'expect-type';

const user: BaseUser = {
  username: "Shrock",
  age: 54,
  hobbies: ["Swamp"]
};

const user1: BaseUser = {
  username: "Shrek",
  age: 33,
  hobbies: ["Fiona"]
};

describe('Memory class', (): void => {
  beforeEach(() => {
    Memory.instance.clear();
  });

  test('should create not create more than one exemplar', (): void => {
    const memory1: Memory = Memory.instance;
    const memory2: Memory = Memory.instance;

    expect(memory1).toBe(memory2);
    expect(memory1).toBeInstanceOf(Memory);
    expect(memory2).toBeInstanceOf(Memory);
  });

  test('addUser should throw MemInvalidArgs error when user is not presented', (): void => {
    const user = null as unknown;

    expect(() => Memory.instance.addUser(user as BaseUser)).toThrow(
      MemInvalidArgs,
    );
  });

  test('addUser should return new User on success', (): void => {
    const newUser: User = Memory.instance.addUser(user)

    expectTypeOf(newUser).toEqualTypeOf<User>();
  });

  test('getAllUsers should throw MemNotFound if no users in memory', (): void => {
    expect(() => Memory.instance.getAllUsers()).toThrow(MemNotFound)
  });

  test('getAllUsers should return users', (): void => {
    Memory.instance.addUser(user)

    const users: User[] = Memory.instance.getAllUsers();

    expect(users).toHaveLength(1)
    expectTypeOf(users).toEqualTypeOf<User[]>();
  });

  test('getUserById should throw MemNotFound if user is not presented', (): void => {
    expect(() => Memory.instance.getUserById(null as unknown as string)).toThrow(MemNotFound)
  });

  test('getUserById should throw MemNotFound if no user in memory', (): void => {
    Memory.instance.addUser(user);

    expect(Memory.instance.getAllUsers()).toHaveLength(1)

    expect(() => Memory.instance.getUserById('0')).toThrow(MemNotFound)
  });

  test('getAllUsers should return user by ID', (): void => {
    Memory.instance.addUser(user);
    Memory.instance.addUser(user1);

    expect(user).not.toBe(user1);

    const users: User[] = Memory.instance.getAllUsers();

    expect(Memory.instance.getUserById(users[0].id)).toBe(users[0]);
    expect(Memory.instance.getUserById(users[0].id)).not.toBe(users[1]);
  });

  test('deleteUser should throw MemInvalidArgs if no users in memory', (): void => {
    expect(() => Memory.instance.deleteUser(null as unknown as string)).toThrow(MemInvalidArgs)
  });

  test('deleteUser should throw MemNotFound if no user in memory', (): void => {
    Memory.instance.addUser(user);

    expect(Memory.instance.getAllUsers()).toHaveLength(1)

    expect(() => Memory.instance.deleteUser('0')).toThrow(MemNotFound)
  });

  test('deleteUser should delete user by ID', (): void => {
    Memory.instance.addUser(user);
    Memory.instance.addUser(user1);

    expect(user).not.toBe(user1);

    const users: User[] = Memory.instance.getAllUsers();

    expect(users).toHaveLength(2);

    expect(Memory.instance.deleteUser(users[0].id)).toBe(true);

    expect(Memory.instance.getAllUsers()).toHaveLength(1)
  });

  test('updateUser should throw MemInvalidArgs if user is not presented', (): void => {
    expect(() => Memory.instance.updateUser(null as unknown as BaseUser, '0')).toThrow(MemInvalidArgs)
  });

  test('updateUser should throw MemInvalidArgs if id is not presented', (): void => {
    expect(() => Memory.instance.updateUser(user, '')).toThrow(MemInvalidArgs)
  });

  test('updateUser should throw MemNotFound if user is not found', (): void => {
    Memory.instance.addUser(user);

    expect(Memory.instance.getAllUsers()).toHaveLength(1);

    expect(() => Memory.instance.updateUser(user1, '123')).toThrow(MemNotFound)
  });

  test('updateUser should return User without changes if user.id = user.id', (): void => {
    Memory.instance.addUser(user);
    Memory.instance.addUser(user1);

    expect(user).not.toBe(user1);

    const users: User[] = Memory.instance.getAllUsers();

    expect(Memory.instance.getAllUsers()).toHaveLength(2);

    expect(Memory.instance.updateUser(user, users[0].id)).toStrictEqual(users[0]);
  });

  test('updateUser should update user with user1 data', (): void => {
    Memory.instance.addUser(user);
    Memory.instance.addUser(user1);

    expect(user).not.toBe(user1);

    const users: User[] = Memory.instance.getAllUsers();

    expect(Memory.instance.getAllUsers()).toHaveLength(2);

    expect(Memory.instance.updateUser(user1, users[0].id)?.age).toEqual(users[1]?.age);
    expect(Memory.instance.updateUser(user1, users[0].id)?.hobbies).toEqual(users[1]?.hobbies);
    expect(Memory.instance.updateUser(user1, users[0].id)?.username).toEqual(users[1]?.username);

    expect(Memory.instance.updateUser(user1, users[0].id)?.id).not.toEqual(users[1]?.id);
  });

});
