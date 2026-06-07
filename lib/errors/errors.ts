export class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
  }
}
export class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
  }
}
export class ValidationError extends Error {
    constructor(message = "Validation Error") {
        super(message);
        this.name = "ValidationError";
    }
}
export class DatabaseError extends Error {
    constructor(message = "Database Error") {
        super(message);
        this.name = "DatabaseError";
    }
}
export class UniqueConstraintError extends Error{
  constructor(message = "Unique Constraint violated"){
    super(message);
    this.name = "UniqueConstraintError";
  }
}
export class PrismaError extends Error{
  constructor(message = "Database Error"){
    super(message);
    this.name = "PrismaError";
  }
}