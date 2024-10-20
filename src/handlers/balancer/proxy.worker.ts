import { parentPort } from 'node:worker_threads'
import { ClientRequest, request } from 'node:http'

parentPort?.on('message', ({ options, body }) => {
  const proxyRequest = (options: any, body: Buffer | string | undefined) => {
    return new Promise((resolve, reject) => {
      const req: ClientRequest = request(options, (res) => {
        const chunks: Uint8Array[] = []
        res.on('data', (chunk) => {
          chunks.push(chunk)
        })

        res.on('end', () => {
          const responseBody = Buffer.concat(chunks).toString()
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: responseBody,
          })
        })
      })

      req.on('error', (err) => {
        reject({ error: err.message })
      })

      if (body && (options.method === 'POST' || options.method === 'PUT')) {
        req.write(body)
      }

      req.end()
    })
  }

  proxyRequest(options, body)
    .then((response) => {
      parentPort?.postMessage({ type: 'response', response })
    })
    .catch((error) => {
      parentPort?.postMessage({ type: 'error', error })
    })
})
