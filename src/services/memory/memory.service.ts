import { v4 as uuidv4 } from 'uuid'
import { BaseUser, UpdateBaseUser, User } from '@/models/user.model'
import { IBalancerDataStorage, IUserStorage, MemInvalidArgs, MemNotFound } from '@/models/memory.model'
import { Balancer, UpdateNodeConn } from '@/models/balancer.model'

export class Memory implements IUserStorage, IBalancerDataStorage {
  static #mem: Memory
  private _users: User[] = []
  private _balancerNodes: Balancer[] = []

  private constructor() {}

  public static get instance(): Memory {
    if (!Memory.#mem) {
      Memory.#mem = new Memory()
    }

    return Memory.#mem
  }

  public addUser(user: BaseUser): User {
    if (!user) throw new MemInvalidArgs()

    const newUser: User = {
      id: uuidv4(),
      ...user,
    }

    this._users.push(newUser)
    return newUser
  }

  public getAllUsers(): User[] {
    if (!this._users || this._users.length <= 0) throw new MemNotFound()

    return this._users
  }

  public getUserById(userId: string): User {
    if (this._users && this._users.length > 0) {
      const result: User | undefined = this._users.find((user: User) => user.id === userId)

      if (!result) {
        throw new MemNotFound()
      }

      return result
    } else {
      throw new MemNotFound()
    }
  }

  public deleteUser(userId: string): boolean {
    if (!userId) throw new MemInvalidArgs()

    if (this._users.length <= 0) throw new MemNotFound()

    const existingUser: User | undefined = this._users.find((exist: User) => exist.id == userId)

    if (!existingUser) {
      throw new MemNotFound()
    }

    this._users = this._users.filter((existing: User): boolean => existing.id !== userId)

    return true
  }

  public updateUser(user: UpdateBaseUser, id: string): User | undefined {
    if (!user || !id || id.length <= 0) throw new MemInvalidArgs()

    if (this._users.length <= 0) throw new MemNotFound()

    const existingUser: User | undefined = this._users.find((exist: User) => exist.id == id)

    if (!existingUser) {
      throw new MemNotFound()
    }

    this._users = this._users.map((existing: User) => {
      if (existing.id === id) {
        return {
          ...existing,
          ...user,
        }
      } else {
        return existing
      }
    })

    return this._users.find((existing: User) => existing.id == id)
  }

  public clear(): void {
    this._users = []
  }

  public registerNode(id: number): Balancer | undefined {
    if (!id) throw new MemInvalidArgs()
    this._balancerNodes.push({ id, connections: 0, role: this._balancerNodes.length <= 0 ? 'gateway' : 'worker' })
    return this._balancerNodes.find((item: Balancer) => item.id === id) || undefined
  }

  public getNodesASC(): Balancer[] {
    return this._balancerNodes
      .sort((a: Balancer, b: Balancer) => a.connections - b.connections)
      .filter((balancer: Balancer) => balancer.role !== 'gateway')
  }

  public updateNodeConn(id: number, type: UpdateNodeConn): void {
    if (!id) throw new MemInvalidArgs()

    this._balancerNodes = this._balancerNodes.map((balancer: Balancer) => {
      if (balancer.id === id) {
        return {
          ...balancer,
          connections:
            type === 'inc' ? balancer.connections + 1 : balancer.connections === 0 ? 0 : balancer.connections - 1,
        }
      } else {
        return balancer
      }
    })
  }
}

export const userMemoryInstance: IUserStorage = Memory.instance
export const balancerMemoryInstance: IBalancerDataStorage = Memory.instance
