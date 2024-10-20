import { parentPort, workerData } from 'worker_threads';
import { createServer, IncomingMessage } from 'node:http';
import { ServerResponse } from 'http';
import { balancerHandler } from '@/handlers/balancer/balancer.handler';
import { rootHandler } from '@/handlers'
import { balancerMemoryInstance } from '@/services/memory/memory.service'
import { Balancer } from '@/models/balancer.model'

const PORT = workerData.port;
const ROLE = workerData.role;

const server = createServer(async (req: IncomingMessage, res: ServerResponse) =>
  ROLE === 'gateway'
    ? balancerHandler(req, res)
    : rootHandler(req, res)
);

server.listen(PORT, () => {
  console.log(`${ROLE} started on port ${PORT}`);
});

if (parentPort) {
  parentPort.on('message', (message) => {
    if (message.type === 'getNodes') {
      const nodes: Balancer[] = balancerMemoryInstance.getNodesASC();
      parentPort?.postMessage({ type: 'nodesResponse', nodes });
    }
  });
}
