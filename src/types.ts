export enum BookStatus {
  Active = "Active",
  Deactivated = "Deactivated",
}

export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: number;
  createdAt: string;
  editedAt: string | null;
  status: BookStatus;
};
