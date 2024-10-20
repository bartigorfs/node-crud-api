import { parentPort } from 'node:worker_threads';
import { ClientRequest, request } from 'node:http'

parentPort?.on('message', (options) => {
  const proxyRequest = (options: any) => {
    return new Promise((resolve, reject) => {
      const req: ClientRequest = request(options, (res) => {
        const chunks: Uint8Array[] = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks).toString();
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
          });
        });
      });

      req.on('error', (err) => {
        reject({ error: err.message });
      });

      req.end();
    });
  };

  proxyRequest(options)
    .then((response) => {
      parentPort?.postMessage({ type: 'response', response });
    })
    .catch((error) => {
      parentPort?.postMessage({ type: 'error', error });
    });
});
