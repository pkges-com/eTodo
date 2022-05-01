export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  title: string;
  synced: boolean;
  completed: boolean;
  editing?: boolean;
  tags?: Tag[];
}
