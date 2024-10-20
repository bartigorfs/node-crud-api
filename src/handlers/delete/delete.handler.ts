import { IncomingMessage, ServerResponse } from 'http'
import { StatusCode, UUIDV4_REGEXP } from '@/models/server.models'
import { sendNotFound, sendRes } from '@/services/base/base.service'
import { CatchMemErrors } from '@/models/memory.model'
import { userMemoryInstance } from '@/services/memory/memory.service'
import { parentPort } from 'node:worker_threads'

export const handleDeleteRequest = async (req: IncomingMessage, res: ServerResponse & {
  req: IncomingMessage;
}): Promise<void> => {
  const urlParts: string[] | undefined = req.url?.split('/').filter(part => part)
  const endpoint: string | null = urlParts && urlParts.length > 1 ? urlParts[1] : null

  switch (endpoint) {
    case 'users': {
      if (urlParts?.length === 3) {
        const param: string | null = urlParts && urlParts.length >= 2 ? urlParts[2] : null

        if (!param || !UUIDV4_REGEXP.test(param)) {
          return sendRes(StatusCode.BadRequest, res, { message: 'Bad id string' })
        }

        try {
          const result: boolean = await new Promise((resolve, reject) => {
            parentPort?.postMessage({ type: 'deleteUserById', userId: param })

            parentPort?.once('message', (message) => {
              if (message.type === 'deleteUserByIdResponse') {
                if (message.error) reject(message.error)
                resolve(message.result)
              }
            })
          })

          console.log(result);

          if (result) {
            return sendRes(StatusCode.NoContent, res)
          } else {
            return sendRes(StatusCode.ServerError, res)
          }
        } catch (e: any) {
          return CatchMemErrors(e?.name, res, e?.message)
        }
      } else {
        return sendNotFound(res)
      }
    }
    default:
      sendNotFound(res)
  }
}
