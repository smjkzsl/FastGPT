import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoOutLink } from '@fastgpt/support/outLink/schema';
import { authApp } from '@/service/utils/auth';
import { authUser } from '@fastgpt/support/user/auth';
import type { OutLinkEditType } from '@fastgpt/support/outLink/type.d';
import { customAlphabet } from 'nanoid';
import { OutLinkTypeEnum } from '@fastgpt/support/outLink/constant';
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 24);

/* create a shareChat */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const { appId, ...props } = req.body as OutLinkEditType & {
      appId: string;
      type: `${OutLinkTypeEnum}`;
    };

    const { userId } = await authUser({ req, authToken: true });
    await authApp({
      appId,
      userId,
      authOwner: false
    });

    const shareId = nanoid();
    await MongoOutLink.create({
      shareId,
      userId,
      appId,
      ...props
    });

    jsonRes(res, {
      data: shareId
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
