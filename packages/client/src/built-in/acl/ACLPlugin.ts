import { Plugin } from '../../application';
import {
  ACLActionProvider,
  ACLCollectionFieldProvider,
  ACLCollectionProvider,
  ACLMenuItemProvider,
} from './ACLProvider';

export class ACLPlugin extends Plugin {
  async load() {
    this.app.addComponents({
      ACLCollectionFieldProvider,
      ACLActionProvider,
      ACLMenuItemProvider,
      ACLCollectionProvider,
    });
  }
}
