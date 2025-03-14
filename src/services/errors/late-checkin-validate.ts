export class LateCheckInValidate extends Error {
  constructor() {
    super('The checkIn can only be validated until 20 minutes!')
  }
}
