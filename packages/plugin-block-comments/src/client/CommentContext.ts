import react from 'react';

export interface Comment {
  setCreateAble: any;
  createAble: boolean;
}

export const CommentContext = react.createContext<Partial<Comment>>({});
