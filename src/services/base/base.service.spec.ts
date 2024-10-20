import {IncomingMessage, ServerResponse} from 'http';
import {getRequestBody, sendNotFound, sendRes} from './base.service';
import {ContentTypes, StatusCode} from '@/models/server.models';
import {Readable} from "node:stream";

interface MockServerResponse extends ServerResponse {
  headers: Record<string, string | number | readonly string[]>;
}

const createMockRes = (): MockServerResponse => {
  return {
    statusCode: 200,
    statusMessage: 'OK',
    headers: {},
    setHeader: jest.fn(function (this: MockServerResponse, name: string, value: string | number | readonly string[]) {
      this.headers[name] = value;
      return this;
    }),
    write: jest.fn(),
    end: jest.fn(),
    getHeader: jest.fn(function (this: MockServerResponse, name: string) {
      return this.headers[name] || null;
    }),
    removeHeader: jest.fn(function (this: MockServerResponse, name: string) {
      delete this.headers[name];
    }),
    finished: false,
    writable: true,
    writeHead: jest.fn(),
  } as unknown as MockServerResponse;
};

describe('Server service functions', () => {

  describe('sendNotFound', () => {
    it('should set status code to 404 and send JSON response', () => {
      const res = createMockRes();

      sendNotFound(res);

      expect(res.statusCode).toBe(StatusCode.NotFound);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', ContentTypes.JSON);
      expect(res.write).toHaveBeenCalledWith(JSON.stringify({ message: 'Not found' }));
      expect(res.end).toHaveBeenCalled();
    });
  });

  describe('sendRes', () => {
    it('should send response with default JSON content type', () => {
      const res = createMockRes();
      const data = { success: true };

      sendRes(StatusCode.OK, res, data);

      expect(res.statusCode).toBe(StatusCode.OK);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', ContentTypes.JSON);
      expect(res.write).toHaveBeenCalledWith(JSON.stringify(data));
      expect(res.end).toHaveBeenCalled();
    });
  });

  describe('getRequestBody', () => {
    it('should resolve with parsed JSON body when valid JSON is provided', async () => {
      const req = new Readable();
      req._read = () => {};
      req.push(JSON.stringify({ key: 'value' }));
      req.push(null);

      const result = await getRequestBody(req as IncomingMessage);
      expect(result).toEqual({ key: 'value' });
    });

    it('should resolve with undefined when body is empty', async () => {
      const req = new Readable();
      req._read = () => {};
      req.push(null);

      const result = await getRequestBody(req as IncomingMessage);
      expect(result).toBeUndefined();
    });

    it('should resolve with undefined when JSON parsing fails', async () => {
      const req = new Readable();
      req._read = () => {};
      req.push('invalid JSON');
      req.push(null);

      const result = await getRequestBody(req as IncomingMessage);
      expect(result).toBeUndefined();
    });

    it('should reject the promise on request error', async () => {
      const req: Readable = new Readable();
      req._read = (): void => {};

      process.nextTick(() => {
        req.emit('error', new Error('Test error'));
      });

      await expect(getRequestBody(req as IncomingMessage)).rejects.toThrow('Test error');
    });
  });
});
