import { DataTypes, Model } from 'https://deno.land/x/denodb@v1.0.39/mod.ts';
import { Token } from './token.ts';
import { Wallpaper } from './wallpaper.ts';

export class User extends Model {
  static table = 'users';
  static timestamps = true;

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
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
      length: 4000,
      allowNull: true,
    },
    client_token: {
      type: DataTypes.STRING,
      length: 500,
      allowNull: true,
    },
  };

  static postedWallPapers() {
    return this.hasMany(Wallpaper);
  }

  static wallpapersToShow() {
    return this.hasMany(Wallpaper);
  }

  static tokens() {
    return this.hasMany(Token);
  }
}
