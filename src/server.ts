import { parentPort, workerData } from 'worker_threads'
import { createServer, IncomingMessage } from 'node:http'
import { ServerResponse } from 'http'
import { balancerHandler } from '@/handlers/balancer/balancer.handler'
import { rootHandler } from '@/handlers'
import { balancerMemoryInstance } from '@/services/memory/memory.service'
import { Balancer, NodeType } from '@/models/balancer.model'

export const runServer = (mPORT: number = 4000, mROLE: NodeType = 'worker') => {
  const PORT = workerData?.port || mPORT
  const ROLE = workerData?.role || mROLE
  console.log(ROLE)

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) =>
    ROLE === 'gateway' ? balancerHandler(req, res) : rootHandler(req, res),
  )

  server.listen(PORT, () => {
    console.log(`${ROLE} started on port ${PORT}`)
  })

  if (parentPort) {
    parentPort.on('message', message => {
      if (message.type === 'getNodes') {
        const nodes: Balancer[] = balancerMemoryInstance.getNodesASC()
        parentPort?.postMessage({ type: 'nodesResponse', nodes })
      }
    })
  }
}

runServer()
