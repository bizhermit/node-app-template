import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.session);

  res.status(200).json({ session: res.session });
};

export default handler;