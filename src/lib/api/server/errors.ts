export class AuthError extends Error {
  constructor(message = "User not authenticated") {
    super(message);
    this.name = "AuthError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ReservationError extends Error {
  constructor(message = "Error fetching reservations") {
    super(message);
    this.name = "ReservationError";
  }
}
