import { DataTypes, Model } from 'https://deno.land/x/denodb@v1.0.40/mod.ts';
import { User } from './user.ts';

export class ClientToken extends Model {
  static table = 'client_tokens';
  static timestamps = true;

  static fields = {
    access: {
      primaryKey: true,
      type: DataTypes.STRING,
      length: 500,
      allowNull: false,
    },
  };

  static user() {
    return this.hasOne(User);
  }
}
