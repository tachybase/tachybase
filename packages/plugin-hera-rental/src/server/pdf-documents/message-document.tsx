import React from 'react';

import { Document, Page, renderToStream, StyleSheet, Text } from '@hera/plugin-core';

const PreviewDocument = ({ message }: { message: string }) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      textAlign: 'center',
      backgroundColor: '#FFF',
      fontFamily: 'source-han-sans',
      fontSize: '12px',
    },
  });
  return (
    <Document>
      <Page style={{ ...styles.page }}>
        <Text>{message}</Text>
      </Page>
    </Document>
  );
};
export const render = async (message: string) => {
  return await renderToStream(<PreviewDocument message={message} />);
};
