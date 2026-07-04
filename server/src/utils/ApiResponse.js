export class ApiResponse {
  constructor(statusCode, data = null, message = 'Operation successful') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
