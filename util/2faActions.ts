import { TwoFactorCodeModel } from '@util/models';
import { Op } from 'sequelize';
import { ensureDatabase } from '@util/database';

export async function fetch2FACode(type: 'email' | 'phone', receiver: string) {
  await ensureDatabase();
  return TwoFactorCodeModel.findOne({
    where: {
      type,
      receiver,
      expiration: {
        [Op.gt]: new Date()
      }
    }
  });
}

export async function add2FACode(type: 'email' | 'phone', receiver: string, code: number) {
  await ensureDatabase();
  const timeout = Number.parseInt(process.env.TIMEOUT_2FACTOR_MINUTES || '15', 10);
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + timeout);

  await TwoFactorCodeModel.upsert({
    type,
    receiver,
    code,
    expiration,
    created_at: new Date()
  });
}

// Deletes all requests of type and receiver
export async function delete2FACode(type: 'email' | 'phone', receiver: string) {
  await ensureDatabase();
  await TwoFactorCodeModel.destroy({
    where: {
      type,
      receiver
    }
  });
}
