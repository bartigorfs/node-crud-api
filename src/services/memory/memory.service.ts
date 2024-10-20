import {v4 as uuidv4} from 'uuid';
import {BaseUser, UpdateBaseUser, User} from "@/models/user.model";
import {MemInvalidArgs, MemNotFound} from "@/models/memory.model";

class Memory {
  static #mem: Memory;
  private _users: User[] = [];

  private constructor() { }

  public static get instance(): Memory {
    if (!Memory.#mem) {
      Memory.#mem = new Memory();
    }

    return Memory.#mem;
  }

  public addUser(user: BaseUser): User {
    if (!user) throw new MemInvalidArgs();

    if (!Memory.#mem) throw new MemNotFound();

    const newUser: User = {
      id: uuidv4(),
      ...user,
    };

    this._users.push(newUser);
console.log(this._users);
    return newUser;
  }

  public getAllUsers(): User[] {
    if (this._users && this._users.length > 0) {
      return this._users;
    } else {
      throw new MemNotFound();
    }
  }

  public getUserById(userId: string): User {
    if (this._users && this._users.length > 0) {
      const result: User | undefined = this._users.find((user: User) => user.id === userId);

      if (!result) {
        throw new MemNotFound();
      }

      return result;
    } else {
      throw new MemNotFound();
    }
  }

  public deleteUser(userId: string): boolean {
    if (!userId) throw new MemInvalidArgs();

    if (!Memory.#mem || !this._users) throw new MemNotFound();

    const existingUser: User | undefined = this._users.find((exist: User) => exist.id == userId);

    if (!existingUser) {
      throw new MemNotFound();
    }

    this._users = this._users.filter((existing: User): boolean => existing.id !== userId);

    return true;
  }

  public updateUser(user: UpdateBaseUser, id: string): User | undefined {
    if (!user) throw new MemInvalidArgs();

    if (!Memory.#mem || !this._users) throw new MemNotFound();

    const existingUser: User | undefined = this._users.find((exist: User) => exist.id == id);

    if (!existingUser) {
      throw new MemNotFound();
    }

    this._users = this._users.map((existing: User) => {
      if (existing.id === id) {
        return {
          ...existing,
          ...user
        };
      } else {
        return existing;
      }
    });

    return this._users.find((existing: User) => existing.id == id);
  }
}

//global.memory = global.memory || Memory.instance;

export const memoryInstance: Memory = Memory.instance;
