import { DataTypes, Model } from "https://deno.land/x/denodb@v1.0.40/mod.ts";
import { User } from "./user.ts";

export class Token extends Model {
  static table = 'tokens';
  static timestamps = true;

  static fields = {
    id: {
      primaryKey: true,
      autoIncrement: true,
    },
    access: {
      type: DataTypes.STRING,
      length: 500,
      allowNull: false,
    },
    refresh: {
      type: DataTypes.STRING,
      length: 500,
      allowNull: false,
    },
  };

  static user() {
    return this.hasOne(User);
  }
}