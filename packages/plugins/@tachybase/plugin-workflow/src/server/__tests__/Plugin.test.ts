import { MockServer } from '@tachybase/test';
import Database from '@tachybase/database';
import { getApp, sleep } from '@tachybase/plugin-workflow-test';

import Plugin from '..';
import { EXECUTION_STATUS } from '../constants';

describe('workflow > Plugin', () => {
  let app: MockServer;
  let db: Database;
  let PostRepo;
  let WorkflowModel;
  let plugin;

  beforeEach(async () => {
    app = await getApp();
    db = app.db;
    WorkflowModel = db.getCollection('workflows').model;
    PostRepo = db.getCollection('posts').repository;
    plugin = app.pm.get(Plugin) as Plugin;
  });

  afterEach(() => app.destroy());

  describe('create', () => {
    it('create with enabled', async () => {
      const workflow = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      expect(workflow.current).toBe(true);
    });

    it('create with disabled', async () => {
      const workflow = await WorkflowModel.create({
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      expect(workflow.current).toBe(true);
    });
  });

  describe('update', () => {
    it('toggle on', async () => {
      const workflow = await WorkflowModel.create({
        enabled: false,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });
      expect(workflow.current).toBe(true);

      const p1 = await PostRepo.create({ values: { title: 't1' } });

      await sleep(500);

      const count = await workflow.countExecutions();
      expect(count).toBe(0);

      await workflow.update({ enabled: true });
      expect(workflow.current).toBe(true);

      const p2 = await PostRepo.create({ values: { title: 't2' } });

      await sleep(500);

      const executions = await workflow.getExecutions();
      expect(executions.length).toBe(1);
    });

    it('toggle off', async () => {
      const workflow = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });
      expect(workflow.current).toBe(true);

      const p1 = await PostRepo.create({ values: { title: 't1' } });

      await sleep(500);

      const c1 = await workflow.countExecutions();
      expect(c1).toBe(1);

      await workflow.update({ enabled: false });
      expect(workflow.current).toBe(true);

      const p2 = await PostRepo.create({ values: { title: 't2' } });

      await sleep(500);

      const c2 = await workflow.countExecutions();
      expect(c2).toBe(1);
    });

    it('toggle off then on', async () => {
      const workflow = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      const p1 = await PostRepo.create({ values: { title: 't1' } });

      await sleep(500);

      const c1 = await workflow.countExecutions();
      expect(c1).toBe(1);

      await workflow.update({
        enabled: false,
      });
      expect(workflow.current).toBe(true);

      const p2 = await PostRepo.create({ values: { title: 't2' } });

      await sleep(500);

      const c2 = await workflow.countExecutions();
      expect(c2).toBe(1);

      await workflow.update({
        enabled: true,
      });
      expect(workflow.current).toBe(true);

      const p3 = await PostRepo.create({ values: { title: 't3' } });

      await sleep(500);

      const c3 = await workflow.countExecutions();
      expect(c3).toBe(2);
    });

    it('update config', async () => {
      const workflow = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      const p1 = await PostRepo.create({ values: { title: 't1' } });

      await sleep(500);

      const c1 = await workflow.countExecutions();
      expect(c1).toBe(1);

      await workflow.update({
        config: {
          mode: 1,
          collection: 'tags',
        },
      });

      const p2 = await PostRepo.create({ values: { title: 't2' } });

      await sleep(500);

      const c2 = await workflow.countExecutions();
      expect(c2).toBe(1);
    });
  });

  describe('destroy', () => {
    it('destroyed workflow will not be trigger any more', async () => {
      const workflow = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      const n1 = await workflow.createNode({
        type: 'update',
        config: {
          collection: 'posts',
          params: {
            filter: {
              id: '{{$context.data.id}}',
            },
            values: {
              title: 't2',
            },
          },
        },
      });

      await PostRepo.create({ values: { title: 't1' } });

      await sleep(500);

      const { model: JobModel } = db.getCollection('jobs');

      const e1c = await workflow.countExecutions();
      expect(e1c).toBe(1);
      const j1c = await JobModel.count();
      expect(j1c).toBe(1);
      const p1 = await PostRepo.findOne();
      expect(p1.title).toBe('t2');

      await workflow.destroy();

      await PostRepo.create({ values: { title: 't1' } });

      await sleep(500);

      const p2c = await PostRepo.count({ filter: { title: 't1' } });
      expect(p2c).toBe(1);
    });
  });

  describe('dispatcher', () => {
    it('multiple triggers in same event', async () => {
      const w1 = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      const w2 = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      const w3 = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      const p1 = await PostRepo.create({ values: { title: 't1' } });

      await sleep(1000);

      const [e1] = await w1.getExecutions();
      expect(e1.status).toBe(EXECUTION_STATUS.RESOLVED);

      const [e2] = await w2.getExecutions();
      expect(e2.status).toBe(EXECUTION_STATUS.RESOLVED);

      const [e3] = await w3.getExecutions();
      expect(e3.status).toBe(EXECUTION_STATUS.RESOLVED);
    });

    it('multiple events on same workflow', async () => {
      const w1 = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      const p1 = await PostRepo.create({ values: { title: 't1' } });
      const p2 = await PostRepo.create({ values: { title: 't2' } });
      const p3 = await PostRepo.create({ values: { title: 't3' } });

      await sleep(1000);

      const executions = await w1.getExecutions();
      expect(executions.length).toBe(3);
      expect(executions.map((item) => item.status)).toEqual(Array(3).fill(EXECUTION_STATUS.RESOLVED));
    });

    it('when server starts, process all created executions', async () => {
      const w1 = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      await app.stop();

      await db.reconnect();

      const p1 = await PostRepo.create({ values: { title: 't1' } });

      const ExecutionModel = db.getCollection('executions').model;
      const e1 = await w1.createExecution({
        key: w1.key,
        context: {
          data: p1.get(),
        },
      });

      await app.start();

      await sleep(500);

      await e1.reload();
      expect(e1.status).toBe(EXECUTION_STATUS.RESOLVED);

      await w1.update({ enabled: false });

      await app.stop();

      await db.reconnect();

      const e2 = await w1.createExecution({
        key: w1.key,
        context: {
          data: p1.get(),
        },
        createdAt: p1.createdAt,
      });

      const w2 = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      const e3 = await w2.createExecution({
        key: w2.key,
        context: {
          data: p1.get(),
        },
      });

      await app.start();

      await sleep(500);

      await e2.reload();
      expect(e2.status).toBe(EXECUTION_STATUS.QUEUEING);

      // queueing execution of disabled workflow should not effect other executions
      await e3.reload();
      expect(e3.status).toBe(EXECUTION_STATUS.RESOLVED);
    });
  });

  describe('options.deleteExecutionOnStatus', () => {
    it('no configured should not be deleted', async () => {
      const w1 = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      const p1 = await PostRepo.create({ values: { title: 't1' } });

      await sleep(500);

      const executions = await w1.getExecutions();
      expect(executions.length).toBe(1);
    });

    it('status on started should not be deleted', async () => {
      const w1 = await WorkflowModel.create({
        enabled: true,
        options: {
          deleteExecutionOnStatus: [EXECUTION_STATUS.STARTED],
        },
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      await w1.createNode({
        type: 'pending',
      });

      const p1 = await PostRepo.create({ values: { title: 't1' } });

      await sleep(500);

      const executions = await w1.getExecutions();
      expect(executions.length).toBe(1);
      expect(executions[0].status).toBe(EXECUTION_STATUS.STARTED);
    });

    it('configured resolved status should be deleted', async () => {
      const w1 = await WorkflowModel.create({
        enabled: true,
        options: {
          deleteExecutionOnStatus: [EXECUTION_STATUS.RESOLVED],
        },
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      const p1 = await PostRepo.create({ values: { title: 't1' } });

      await sleep(500);

      const executions = await w1.getExecutions();
      expect(executions.length).toBe(0);
    });

    it('configured error status should be deleted', async () => {
      const w1 = await WorkflowModel.create({
        enabled: true,
        options: {
          deleteExecutionOnStatus: [EXECUTION_STATUS.ERROR],
        },
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts',
        },
      });

      await w1.createNode({
        type: 'error',
      });

      const p1 = await PostRepo.create({ values: { title: 't1' } });

      await sleep(500);

      const executions = await w1.getExecutions();
      expect(executions.length).toBe(0);
    });
  });

  describe('sync', () => {
    it('sync on trigger class', async () => {
      const w1 = await WorkflowModel.create({
        enabled: true,
        type: 'syncTrigger',
      });

      const processor = await plugin.trigger(w1, {});

      const executions = await w1.getExecutions();
      expect(executions.length).toBe(1);
      expect(executions[0].status).toBe(EXECUTION_STATUS.RESOLVED);
      expect(processor.execution.id).toBe(executions[0].id);
      expect(processor.execution.status).toBe(executions[0].status);
    });

    it('sync on workflow instance', async () => {
      const w1 = await WorkflowModel.create({
        enabled: true,
        type: 'asyncTrigger',
        sync: true,
      });

      const processor = await plugin.trigger(w1, {});

      const executions = await w1.getExecutions();
      expect(executions.length).toBe(1);
      expect(executions[0].status).toBe(EXECUTION_STATUS.RESOLVED);
      expect(processor.execution.id).toBe(executions[0].id);
      expect(processor.execution.status).toBe(executions[0].status);
    });
  });
});
