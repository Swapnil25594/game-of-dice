export class LoggerService {
  info(message) {
    console.log(message);
  }

  error(message) {
    console.error(message);
  }

  table(data) {
    console.table(data);
  }
}
