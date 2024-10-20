import { IncomingMessage } from 'node:http'
import { ServerResponse } from 'http'
import { parentPort } from 'node:worker_threads'
import { UpdateNodeConn } from '@/models/balancer.model'
import { Worker } from 'worker_threads'
import path from 'path'
import { getRequestBuffer } from '@/services/base/base.service'

async function getTargetNode(): Promise<number | undefined> {
  return new Promise(resolve => {
    parentPort?.postMessage({ type: 'getNodes' })

    parentPort?.once('message', message => {
      if (message.type === 'nodesResponse') {
        const nodes = message.nodes
        console.log(nodes)
        resolve(nodes[0]?.id)
      }
    })
  })
}

async function updateNodeConn(port: number, updType: UpdateNodeConn): Promise<void> {
  return new Promise(resolve => {
    parentPort?.postMessage({ type: 'updateNodeConn', data: { port, updType } })
    resolve()
  })
}

export const balancerHandler = async (req: IncomingMessage, res: ServerResponse) => {
  const targetPort: number | undefined = await getTargetNode()

  console.log(`Balancer routed request to ${targetPort}`)

  await updateNodeConn(targetPort!, 'inc')

  const options = {
    hostname: 'localhost',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  }

  const body: Buffer | undefined = await getRequestBuffer(req)

  const proxyWorker: Worker = new Worker(path.resolve(__dirname, 'proxyWorker.js'))

  proxyWorker.postMessage({ options, body })

  proxyWorker.on('message', message => {
    if (message.type === 'response') {
      const { statusCode, headers, body } = message.response
      res.writeHead(statusCode || 500, headers)
      res.end(body)
      updateNodeConn(targetPort!, 'dec').catch(console.error)
    } else if (message.type === 'error') {
      console.error(`Error with request to ${targetPort}:`, message.error)
      res.writeHead(502)
      res.end('Bad Gateway')
      updateNodeConn(targetPort!, 'dec').catch(console.error)
    }
  })

  proxyWorker.on('error', error => {
    console.error(`Worker error:`, error)
  })

  proxyWorker.on('exit', code => {
    console.log(`Worker exited with code ${code}`)
  })
}
