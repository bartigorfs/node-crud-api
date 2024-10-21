import { IncomingMessage, ServerResponse } from 'http'
import { User } from '@/models/user.model'
import { CatchMemErrors } from '@/models/memory.model'
import { sendNotFound, sendRes } from '@/services/base/base.service'
import { StatusCode, UUIDV4_REGEXP } from '@/models/server.models'
import { parentPort } from 'node:worker_threads'
import { userMemoryInstance } from '@/services/memory/memory.service'

export const getAllUsersFromMem = async (res: ServerResponse) => {
  let result: User[] | null = null

  try {
    if (parentPort) {
      result = await new Promise((resolve, reject) => {
        parentPort?.postMessage({ type: 'getAllUsers' })

        parentPort?.once('message', message => {
          if (message.type === 'getAllUsersResponse') {
            if (message.error) reject(message.error)
            resolve(message.users)
          }
        })
      })
    } else {
      result = userMemoryInstance.getAllUsers()
    }
  } catch (e: any) {
    return CatchMemErrors(e?.name, res, e?.message)
  }

  return sendRes(StatusCode.OK, res, result)
}

export const getUserFromMem = async (userId: string, res: ServerResponse) => {
  let user: User | null = null

  try {
    if (!userId || !UUIDV4_REGEXP.test(userId)) {
      return sendRes(StatusCode.BadRequest, res, { message: 'Bad id string' })
    }

    if (parentPort) {
      user = await new Promise((resolve, reject) => {
        parentPort?.postMessage({ type: 'getUserById', userId })

        parentPort?.once('message', message => {
          if (message.type === 'getUserByIdResponse') {
            if (message.error) reject(message.error)
            resolve(message.user)
          }
        })
      })
    } else {
      user = userMemoryInstance.getUserById(userId)
    }

    if (!user) {
      return sendRes(StatusCode.NotFound, res)
    }

    return sendRes(StatusCode.OK, res, { user })
  } catch (e: any) {
    return CatchMemErrors(e?.name, res, e?.message)
  }
}

export const handleGetRequest = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const urlParts: string[] | undefined = req.url?.split('/').filter(part => part)
  const endpoint: string | null = urlParts && urlParts.length > 1 ? urlParts[1] : null

  switch (endpoint) {
    case 'users': {
      if (urlParts?.length === 2) {
        await getAllUsersFromMem(res)
      } else if (urlParts?.length === 3) {
        const param: string | null = urlParts && urlParts.length >= 2 ? urlParts[2] : null
        await getUserFromMem(param as string, res)
      }
      break
    }
    default:
      return sendNotFound(res)
  }
}
