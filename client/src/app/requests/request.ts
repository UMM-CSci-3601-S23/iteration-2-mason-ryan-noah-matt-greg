export interface Request {
  _id: string;
  timeSubmitted?: Date;
  selections: Map<string, boolean>;
}
