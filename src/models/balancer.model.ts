export interface Balancer {
  id: number;
  connections: number;
}

export type UpdateNodeConn = "dec" | "inc";
