import { useEffect, useState } from 'react';

import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

export async function parseMarkdown(text: string) {
  if (!text) {
    return text;
  }
  return md.render(text);
}

export function useParseMarkdown(text: string) {
  const [html, setHtml] = useState<any>('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    parseMarkdown(text).then((r) => {
      setHtml(r);
      setLoading(false);
    });
  }, [text]);
  return { html, loading };
}

export function convertToText(markdownText: string) {
  const content = markdownText;
  let temp = document.createElement('div');
  temp.innerHTML = content;
  const text = temp.innerText;
  temp = null;
  return text?.replace(/[\n\r]/g, '') || '';
}
