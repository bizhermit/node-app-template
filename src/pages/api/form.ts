import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  console.log(`----- ${req.method} -----`);
  console.log("----- query -----")
  console.log(JSON.stringify(req.query, null, 2));
  console.log("----- body -----")
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200);
};

export default handler;