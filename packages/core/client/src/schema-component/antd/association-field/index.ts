import { connect, mapReadPretty } from '@tachybase/schema';

import { Action } from '../action';
import { Editable } from './Editable';
import { InternalPicker } from './InternalPicker';
import { Nester } from './Nester';
import { ReadPretty } from './ReadPretty';
import { SubTable } from './SubTable';

export const AssociationField: any = connect(Editable, mapReadPretty(ReadPretty));
export * from './SubTabs';

AssociationField.SubTable = SubTable;
AssociationField.Nester = Nester;
AssociationField.AddNewer = Action.Container;
AssociationField.Selector = Action.Container;
AssociationField.Viewer = Action.Container;
AssociationField.InternalSelect = InternalPicker;
AssociationField.ReadPretty = ReadPretty;
