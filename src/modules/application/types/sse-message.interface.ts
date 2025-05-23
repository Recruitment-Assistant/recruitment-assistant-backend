export interface ISSEMessage {
  id?: string;
  event?: string;
  data: string | object;
  retry?: number;
  message?: string;
}
