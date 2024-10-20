import { Worker } from 'worker_threads';
import path from 'path';
import { balancerMemoryInstance } from '@/services/memory/memory.service';
import { Balancer } from '@/models/balancer.model';
import { config } from 'dotenv'

const bootstrap = () => {
  config();

  const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;
  const BALANCER_NODES: number = process.env.BALANCER_NODES ? parseInt(process.env.BALANCER_NODES) : 1;

  const LB_NODES: number[] = Array.from({ length: BALANCER_NODES }, (_, i: number) => i + PORT);
console.log(LB_NODES);
  LB_NODES.forEach((port: number): void => {
    const node: Balancer | undefined = balancerMemoryInstance.registerNode(port);
console.log(node);
    if (!node) {
      console.error(`Error starting worker on port ${port}: cannot register node`);
    } else {
      const worker: Worker = new Worker(path.resolve(__dirname, 'server.js'), { workerData: { port, role: node.role } });

      worker.on('message', (message) => {
        if (message.type === 'getNodes') {
          const nodes = balancerMemoryInstance.getNodesASC();
          worker.postMessage({ type: 'nodesResponse', nodes });
        }
      });

      worker.on('error', (error) => {
        console.error(`Error starting worker on port ${port}:`, error);
      });

      worker.on('exit', (code) => {
        console.log(`Worker on port ${port} exited with code ${code}`);
      });
    }
  });
};

bootstrap();
