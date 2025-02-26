import { connectionMongo, type Model } from '@fastgpt/common/mongo';
const { Schema, model, models } = connectionMongo;
import { hashStr } from '@fastgpt/common/tools/str';
import { PRICE_SCALE } from '@fastgpt/common/bill/constants';
import type { UserModelSchema } from './type.d';

const UserSchema = new Schema({
  username: {
    // 可以是手机/邮箱，新的验证都只用手机
    type: String,
    required: true,
    unique: true // 唯一
  },
  password: {
    type: String,
    required: true,
    set: (val: string) => hashStr(val),
    get: (val: string) => hashStr(val),
    select: false
  },
  createTime: {
    type: Date,
    default: () => new Date()
  },
  avatar: {
    type: String,
    default: '/icon/human.svg'
  },
  balance: {
    type: Number,
    default: 2 * PRICE_SCALE
  },
  inviterId: {
    // 谁邀请注册的
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  promotionRate: {
    type: Number,
    default: 15
  },
  limit: {
    exportKbTime: {
      // Every half hour
      type: Date
    },
    datasetMaxCount: {
      type: Number
    }
  },
  openaiAccount: {
    type: {
      key: String,
      baseUrl: String
    }
  },
  timezone: {
    type: String,
    default: 'Asia/Shanghai'
  }
});

export const MongoUser: Model<UserModelSchema> = models['user'] || model('user', UserSchema);
