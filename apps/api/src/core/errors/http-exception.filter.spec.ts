import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

import { HttpExceptionFilter } from './http-exception.filter';
import { ErrorCode } from './error-codes';

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();

  function mockHost() {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const getResponse = jest.fn().mockReturnValue({ status, json });
    const getRequest = jest.fn().mockReturnValue({ method: 'GET', url: '/x' });
    return {
      host: {
        switchToHttp: () => ({
          getResponse,
          getRequest,
        }),
      },
      status,
      json,
    };
  }

  it('maps HttpException to contract', () => {
    const { host, json, status } = mockHost();
    filter.catch(
      new HttpException('nope', HttpStatus.NOT_FOUND),
      host as never,
    );
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: ErrorCode.NOT_FOUND,
          message: 'nope',
        }),
      }),
    );
  });

  it('maps ZodError to BAD_REQUEST with details', () => {
    const { host, json } = mockHost();
    const err = new ZodError([
      {
        code: 'custom',
        message: 'bad',
        path: ['email'],
      },
    ]);
    filter.catch(err, host as never);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: ErrorCode.BAD_REQUEST,
          details: expect.any(Array),
        }),
      }),
    );
  });

  it('maps BadRequestException to contract', () => {
    const { host, json } = mockHost();
    filter.catch(new BadRequestException('bad'), host as never);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: ErrorCode.BAD_REQUEST }),
      }),
    );
  });
});
