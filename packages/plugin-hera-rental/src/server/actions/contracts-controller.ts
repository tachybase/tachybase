import { Context } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

@Controller('contracts')
export class ContractsController {
  @Action('update-alternative')
  async updateContract(ctx: Context, next: () => Promise<any>) {
    const {
      params: { contractsId },
    } = ctx.action;

    const contract = await ctx.db.getModel('contracts').findOne({
      where: {
        id: contractsId,
      },
    });
    const main = await ctx.db.getModel('contracts').findOne({
      where: {
        id: contract.alternative_contract_id,
      },
    });
    await contract.update({
      project_id: main.project_id,
      alternative_contract_id: null,
    });
    await main.update({
      project_id: null,
      alternative_contract_id: contract.id,
    });
    await ctx.db.getModel('records').update(
      {
        contract_id: contract.id,
      },
      {
        where: {
          contract_id: main.id,
        },
      },
    );
    return next();
  }
}
