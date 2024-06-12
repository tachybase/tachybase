export type ReferencePriority = 'default' | 'user';

export interface Reference {
  sourceCollectionName: string;
  sourceField: string;
  targetField: string;
  targetCollectionName: string;
  onDelete: string;
  priority: ReferencePriority;
}

const DEFAULT_ON_DELETE = 'NO ACTION';

export function buildReference(options: Partial<Reference>): Reference {
  const { sourceCollectionName, sourceField, targetField, targetCollectionName, onDelete, priority } = options;

  return {
    sourceCollectionName,
    sourceField,
    targetField,
    targetCollectionName,
    onDelete: (onDelete || DEFAULT_ON_DELETE).toUpperCase(),
    priority: assignPriority(priority, onDelete),
  };
}

function assignPriority(priority: string | undefined, onDelete: string | undefined): ReferencePriority {
  if (priority) {
    return priority as ReferencePriority;
  }

  return onDelete ? 'user' : 'default';
}

const PRIORITY_MAP = {
  default: 1,
  user: 2,
};

class ReferencesMap {
  protected map: Map<string, Reference[]> = new Map();

  addReference(reference: Reference) {
    const existReference = this.existReference(reference);

    if (existReference && existReference.onDelete !== reference.onDelete) {
      // check two references onDelete priority, using the higher priority, if both are the same, throw error
      const existPriority = PRIORITY_MAP[existReference.priority];
      const newPriority = PRIORITY_MAP[reference.priority];

      if (newPriority > existPriority) {
        existReference.onDelete = reference.onDelete;
        existReference.priority = reference.priority;
      } else if (newPriority === existPriority && newPriority === PRIORITY_MAP['user']) {
        if (existReference.onDelete === 'SET NULL' && reference.onDelete === 'CASCADE') {
          existReference.onDelete = reference.onDelete;
        } else {
          console.error(
            new Error(
              `On Delete Conflict, exist reference ${JSON.stringify(existReference)}, new reference ${JSON.stringify(
                reference,
              )}`,
            ),
          );
        }
      }
    }

    if (!existReference) {
      this.map.set(reference.targetCollectionName, [
        ...(this.map.get(reference.targetCollectionName) || []),
        reference,
      ]);
    }
  }

  getReferences(collectionName) {
    return this.map.get(collectionName);
  }

  existReference(reference: Reference) {
    const references = this.map.get(reference.targetCollectionName);

    if (!references) {
      return null;
    }

    const keys = Object.keys(reference).filter((k) => k !== 'onDelete' && k !== 'priority');

    return references.find((ref) => keys.every((key) => ref[key] === reference[key]));
  }

  removeReference(reference: Reference) {
    const references = this.map.get(reference.targetCollectionName);

    if (!references) {
      return;
    }

    const keys = ['sourceCollectionName', 'sourceField', 'targetField', 'targetCollectionName'];

    this.map.set(
      reference.targetCollectionName,
      references.filter((ref) => !keys.every((key) => ref[key] === reference[key])),
    );
  }
}

export default ReferencesMap;
