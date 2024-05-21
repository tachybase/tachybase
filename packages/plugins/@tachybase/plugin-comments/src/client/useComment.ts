import { useContext } from 'react';
import { CommentContext } from './CommentContext';

export function useComment() {
  return useContext(CommentContext);
}
