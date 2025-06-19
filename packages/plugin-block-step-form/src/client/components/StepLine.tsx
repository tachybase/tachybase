import { DndContext } from '@tachybase/client';

import { useContextStepsForm } from '../contexts/stepsForm';
import { DesignAddStepButton } from './AddStep.dn';
import { AntdStepList } from './AntdStepList';

export const StepLine = () => {
  const contextStepForm = useContextStepsForm();
  const { items, currentStep, handleStepReorder, addStep } = contextStepForm;
  return (
    <div style={{ display: 'flex', overflow: 'auto' }}>
      <DndContext onDragEnd={handleStepReorder}>
        <AntdStepList current={currentStep} items={items} />
      </DndContext>
      <DesignAddStepButton onClick={addStep} />
    </div>
  );
};
