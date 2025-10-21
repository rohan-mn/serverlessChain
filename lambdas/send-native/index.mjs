import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';

const PRIV_KEY = process.env.SENDER_PRIV_KEY;
const RPC = process.env.RPC_URL || 'http://host.docker.internal:8545';

// Define CORS headers that will be returned with every response
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allows any origin
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler = async (event) => {
  // Handle preflight OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    // For POST requests, parse the body
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { to, amountEth } = body;

    if (!to || !amountEth) {
      return {
        statusCode: 400,
        headers: corsHeaders, // Include CORS headers in error response
        body: JSON.stringify({ error: 'to & amountEth are required' }),
      };
    }

    const account = privateKeyToAccount(PRIV_KEY);
    const wallet = createWalletClient({ account, chain: hardhat, transport: http(RPC) });
    const hash = await wallet.sendTransaction({ to, value: parseEther(amountEth) });

    return {
      statusCode: 200,
      headers: corsHeaders, // Include CORS headers in success response
      body: JSON.stringify({ hash }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      headers: corsHeaders, // Include CORS headers in catch block
      body: JSON.stringify({ error: e.message }),
    };
  }
};
