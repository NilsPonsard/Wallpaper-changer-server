import { DataTypes, Model } from 'https://deno.land/x/denodb@v1.0.40/mod.ts';
import { Wallpaper } from './wallpaper.ts';

export class User extends Model {
  static table = 'users';
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
    email: {
      type: DataTypes.STRING,
      length: 255,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      length: 255,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
      length:4000 ,
      allowNull: true,
    }
  };

  static wallpapers() {
    return this.hasMany(Wallpaper);
  }
}
