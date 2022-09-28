import { DataTypes, Model } from 'https://deno.land/x/denodb@v1.0.39/mod.ts';
import { User } from './user.ts';

export class Wallpaper extends Model {
  static table = 'wallpapers';
  static timestamps = true;

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
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

  static postedBy() {
    return this.hasOne(User);
  }

  static postedFor(){
    return this.hasMany(User);
  }
}
