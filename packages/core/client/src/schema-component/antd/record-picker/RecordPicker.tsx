import { connect, mapReadPretty } from '@tachybase/schema';
import { InputRecordPicker } from './InputRecordPicker';
import { ReadPrettyRecordPicker } from './ReadPrettyRecordPicker';

export const RecordPicker: any = connect(InputRecordPicker, mapReadPretty(ReadPrettyRecordPicker));
