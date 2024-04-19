export class ResponseDto {
  constructor(error: boolean, msg: string, result: Record<string, any>) {
    this.error = error;
    this.msg = msg;
    this.result = result;
  }

  error: boolean;
  msg: string;
  result: Record<string, any> | null;
}
