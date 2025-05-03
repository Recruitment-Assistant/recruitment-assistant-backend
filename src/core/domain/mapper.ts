export interface Mapper<T> {
  toDto?(t: T): any;
  toDtos?(t: T[]): any[];
  toDomain?(raw: any): T;
  toPersistence?(t: T): any;
}
