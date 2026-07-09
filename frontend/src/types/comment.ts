export interface Comment {
  id: string;
  body: string;
  requestId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;

  author: {
    id: string;
    name: string;
    role: string;
  };
}