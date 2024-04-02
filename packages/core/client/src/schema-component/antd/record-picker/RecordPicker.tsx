import { connect, mapReadPretty } from '@nocobase/schema';
import { InputRecordPicker } from './InputRecordPicker';
import { ReadPrettyRecordPicker } from './ReadPrettyRecordPicker';

export const RecordPicker: any = connect(InputRecordPicker, mapReadPretty(ReadPrettyRecordPicker));
