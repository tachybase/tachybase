import { Steps } from 'antd';

const StepFormContainer = () => {
  const items = [
    {
      title: 'Step 1',
    },
    {
      title: 'Step 2',
    },
    {
      title: 'Step 3',
    },
  ];
  return <Steps items={items} />;
};

export default StepFormContainer;
