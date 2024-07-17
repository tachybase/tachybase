import fs from 'fs';

import PizZip from 'pizzip';
import { parseStringPromise } from 'xml2js';

export async function getTemplateParams(templatePath) {
  try {
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    const getXmlContent = (fileName) => {
      const file = zip.file(fileName);
      return file ? file.asText() : '';
    };

    const docXml = getXmlContent('word/document.xml');

    const parseXml = async (xml) => {
      try {
        const result = await parseStringPromise(xml, { explicitArray: false, ignoreAttrs: true });
        const body = result['w:document']['w:body'];
        return Array.isArray(body['w:p']) ? body['w:p'] : [body['w:p']];
      } catch (error) {
        console.error('Error parsing XML:', error);
        throw error;
      }
    };

    const xmlContent = await parseXml(docXml);

    const extractTags = (nodes) => {
      const tags = new Set();
      nodes.forEach((node) => {
        if (node['w:r'] && Array.isArray(node['w:r'])) {
          node['w:r'].forEach((r) => {
            if (r['w:t'] && r['w:t']['#']) {
              const matches = r['w:t']['#'].match(/\{[\w-]+\.}/g);
              if (matches) {
                matches.forEach((tag) => tags.add(tag));
              }
            }
          });
        }
      });
      return tags;
    };

    const tags = extractTags(xmlContent);
    return Array.from(tags); // Ensure the return value is an array
  } catch (error) {
    console.error('Error in getTemplateParams:', error);
    throw error;
  }
}
