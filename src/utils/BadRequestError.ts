export default class BadEquestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadEquest';
    Object.setPrototypeOf(this, BadEquestError.prototype);
  }
}
