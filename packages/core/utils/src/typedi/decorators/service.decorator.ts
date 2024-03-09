import { ServiceMetadata } from '../interfaces/service-metadata.interface';
import { ServiceOptions } from '../interfaces/service-options.interface';
import { EMPTY_VALUE } from '../empty.const';
import { Constructable } from '../types/constructable.type';
import { ContainerInstance } from '../container-instance.class';

/**
 * Marks class as a service that can be injected using Container.
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function Service<T = unknown>(): Function;
export function Service<T = unknown>(options: ServiceOptions<T>): Function;
export function Service<T>(options: ServiceOptions<T> = {}): ClassDecorator {
  return (targetConstructor) => {
    const serviceMetadata: ServiceMetadata<T> = {
      id: options.id || targetConstructor,
      type: targetConstructor as unknown as Constructable<T>,
      factory: (options as any).factory || undefined,
      multiple: options.multiple || false,
      eager: options.eager || false,
      scope: options.scope || 'container',
      referencedBy: new Map().set(ContainerInstance.default.id, ContainerInstance.default),
      value: EMPTY_VALUE,
    };

    ContainerInstance.default.set(serviceMetadata);
  };
}
