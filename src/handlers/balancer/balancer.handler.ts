import { ClientRequest, IncomingMessage, request } from 'node:http'
import { ServerResponse } from 'http'
import { parentPort } from 'node:worker_threads'

async function getTargetNode(): Promise<number | undefined> {
  return new Promise((resolve) => {
    parentPort?.postMessage({ type: 'getNodes' });

    parentPort?.once('message', (message) => {
      if (message.type === 'nodesResponse') {
        const nodes = message.nodes;
        resolve(nodes[0]?.id);
      }
    });
  });
}

async function getTargetNode(): Promise<number | undefined> {
  return new Promise((resolve) => {
    parentPort?.postMessage({ type: 'getNodes' });

    parentPort?.once('message', (message) => {
      if (message.type === 'nodesResponse') {
        const nodes = message.nodes;
        resolve(nodes[0]?.id);
      }
    });
  });
}

export const balancerHandler = async (req: IncomingMessage, res: ServerResponse) => {
  const targetPort: number | undefined = await getTargetNode()

  console.log(targetPort);

  const options = {
    hostname: 'localhost',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  }

  const proxy: ClientRequest = request(options, (targetRes) => {
    res.writeHead(targetRes.statusCode || 500, targetRes.headers)
    targetRes.pipe(res, {
      end: true,
    })
  })

  req.pipe(proxy, {
    end: true,
  })

  proxy.on('error', (err) => {
    console.error(`Error with request to ${targetPort}:`, err)
    res.writeHead(502)
    res.end('Bad Gateway')
  })
}
