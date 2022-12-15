import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    // bodyParser: false,
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  console.log(`----- ${req.method} -----`);
  console.log("----- headers -----");
  console.log(req.headers)
  console.log("----- query -----")
  console.log(JSON.stringify(req.query, null, 2));
  console.log("----- body -----")
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200);
};

export default handler;