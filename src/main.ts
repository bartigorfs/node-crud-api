import { Worker } from 'worker_threads'
import path from 'path'
import { balancerMemoryInstance } from '@/services/memory/memory.service'
import { Balancer } from '@/models/balancer.model'
import { config } from 'dotenv'
import { messagesHandler } from '@/handlers/messages/messages.handler'

export const bootstrap = (isTest = false) => {
  config()

  const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000
  const BALANCER_NODES: number = process.env.BALANCER_NODES ? parseInt(process.env.BALANCER_NODES) : 1

  const LB_NODES: number[] = Array.from({ length: BALANCER_NODES }, (_, i: number) => i + PORT)

  LB_NODES.forEach((port: number): void => {
    const node: Balancer | undefined = balancerMemoryInstance.registerNode(port)

    if (!node) {
      console.error(`Error starting worker on port ${port}: cannot register node`)
    } else {
      const worker: Worker = new Worker(isTest
        ? path.resolve(__dirname, '..', 'dist', 'server.js')
        : path.resolve(__dirname, 'server.js'), {
        workerData: {
          port,
          role: node.role,
        },
      })

      worker.on('message', message => messagesHandler(message, worker))

      worker.on('error', (error: Error) => {
        console.error(`Error starting worker on port ${port}:`, error)
      })

      worker.on('exit', (code: number) => {
        console.log(`Worker on port ${port} exited with code ${code}`)
      })
    }
  })

  console.table(balancerMemoryInstance.getNodesASC())
}

bootstrap()
