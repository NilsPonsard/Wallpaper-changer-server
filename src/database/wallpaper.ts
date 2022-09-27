import { DataTypes, Model } from 'https://deno.land/x/denodb@v1.0.40/mod.ts';
import { User } from "./user.ts";

export class Wallpaper extends Model {
  static table = 'wallpapers';
  static timestamps = true;

  static fields = {
    id: {
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      length: 255,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      length: 4000,
      allowNull: false,
    },

  };
  static postedBy(){
    return this.hasOne(User);
  }
}
