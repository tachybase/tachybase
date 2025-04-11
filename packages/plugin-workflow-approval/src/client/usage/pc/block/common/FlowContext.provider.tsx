import { ProviderContextWorkflow } from '@tachybase/module-workflow/client';

export function FlowContextProvider({ workflow = undefined, children, value }) {
  return <ProviderContextWorkflow value={{ workflow, ...value }}>{children}</ProviderContextWorkflow>;
}
