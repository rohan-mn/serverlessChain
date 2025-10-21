import type { NextApiRequest, NextApiResponse } from 'next';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const client = new LambdaClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.LOCALSTACK_ENDPOINT || 'http://localhost:4566',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  try {
    const count = req.query.count ? Number(req.query.count) : 10;
    const address = typeof req.query.address === 'string' ? req.query.address : undefined;

    const lambdaEvent = { body: JSON.stringify({ count, address }) };
    const out = await client.send(new InvokeCommand({
      FunctionName: process.env.RECENT_LAMBDA_NAME || 'recent-txs',
      Payload: Buffer.from(JSON.stringify(lambdaEvent)),
    }));

    const raw = out.Payload ? Buffer.from(out.Payload).toString('utf8') : '{}';
    const parsed = JSON.parse(raw);
    const body = typeof parsed.body === 'string' ? JSON.parse(parsed.body) : parsed.body;

    res.status(Number(parsed.statusCode ?? 200)).json(body ?? parsed);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: String(e?.message || e) });
  }
}
