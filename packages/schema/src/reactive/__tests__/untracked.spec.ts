import { autorun, observable, untracked } from '..';

test('basic untracked', () => {
  const obs = observable<any>({});
  const fn = vi.fn();
  autorun(() => {
    untracked(() => {
      fn(obs.value);
    });
  });

  expect(fn).toBeCalledTimes(1);
  obs.value = 123;
  expect(fn).toBeCalledTimes(1);
});

test('no params untracked', () => {
  untracked();
});
