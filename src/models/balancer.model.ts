export interface Balancer {
  id: number
  connections: number
  role: NodeType
}

export type NodeType = 'worker' | 'gateway'

export type UpdateNodeConn = 'dec' | 'inc'
