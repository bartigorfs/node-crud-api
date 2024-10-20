import { Balancer } from '@/models/balancer.model'
import { balancerMemoryInstance, userMemoryInstance } from '@/services/memory/memory.service'
import { Worker } from 'worker_threads'
import { UpdateBaseUser, User } from '@/models/user.model'
import { MemInvalidArgs, MemNotFound } from '@/models/memory.model'

export const messagesHandler = (message: any, worker: Worker) => {
  switch (message.type) {
    case 'getNodes' : {
      const nodes: Balancer[] = balancerMemoryInstance.getNodesASC()
      worker.postMessage({ type: 'nodesResponse', nodes })
      break
    }

    case 'updateNodeConn': {
      balancerMemoryInstance.updateNodeConn(message.data.port, message.data.updType)
      break
    }

    case 'getAllUsers' : {
      try {
        const users: User[] = userMemoryInstance.getAllUsers()
        worker.postMessage({ type: 'getAllUsersResponse', users })
      } catch (error) {
        if (error instanceof MemNotFound || error instanceof MemInvalidArgs) {
          worker.postMessage({ type: 'getAllUsersResponse', error: { name: error.name, message: error.message } })
        } else {
          worker.postMessage({ type: 'getAllUsersResponse', error })
        }
      }
      break
    }

    case 'getUserById' : {
      try {
        const user: User = userMemoryInstance.getUserById(message.userId)
        worker.postMessage({ type: 'getUserByIdResponse', user })
      } catch (error) {
        if (error instanceof MemNotFound || error instanceof MemInvalidArgs)
          worker.postMessage({ type: 'getUserByIdResponse', error: { name: error.name, message: error.message } })
        else
          worker.postMessage({ type: 'getUserByIdResponse', error })
      }
      break
    }

    case 'addUser' : {
      try {
        const user: User = userMemoryInstance.addUser(message.user)
        worker.postMessage({ type: 'addUserResponse', user })
      } catch (error) {
        if (error instanceof MemNotFound || error instanceof MemInvalidArgs)
          worker.postMessage({ type: 'addUserResponse', error: { name: error.name, message: error.message } })
        else
          worker.postMessage({ type: 'addUserResponse', error })
      }
      break
    }

    case 'deleteUserById' : {
      try {
        const result: boolean = userMemoryInstance.deleteUser(message.userId)
        worker.postMessage({ type: 'deleteUserByIdResponse', result })
      } catch (error) {
        if (error instanceof MemNotFound || error instanceof MemInvalidArgs)
          worker.postMessage({ type: 'deleteUserByIdResponse', error: { name: error.name, message: error.message } })
        else
          worker.postMessage({ type: 'deleteUserByIdResponse', error })
      }
      break
    }

    case 'updateUserById' : {
      try {
        const user: User | undefined = userMemoryInstance.updateUser(message.user, message.userId)
        worker.postMessage({ type: 'updateUserByIdResponse', user })
      } catch (error) {
        if (error instanceof MemNotFound || error instanceof MemInvalidArgs)
          worker.postMessage({ type: 'updateUserByIdResponse', error: { name: error.name, message: error.message } })
        else
          worker.postMessage({ type: 'updateUserByIdResponse', error })
      }
      break
    }
  }
}
