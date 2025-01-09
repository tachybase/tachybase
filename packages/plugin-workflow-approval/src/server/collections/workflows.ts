import { extendCollection } from '@tachybase/database';

import { workflowsCollection } from '../../common/workflows.collection';

// show workflows feature card theme-color and icon
export default extendCollection(workflowsCollection);
