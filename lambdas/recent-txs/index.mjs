import { createPublicClient, http } from 'viem'
import { hardhat } from 'viem/chains'

const RPC = process.env.RPC_URL || 'http://host.docker.internal:8545'
const client = createPublicClient({ chain: hardhat, transport: http(RPC) })

export const handler = async (event) => {
  try {
    // accept top-level or API-GW style
    let body = event
    if (typeof body === 'string') body = JSON.parse(body)
    if (body && body.body) body = typeof body.body === 'string' ? JSON.parse(body.body) : body.body

    const maxBlocks = Math.max(1, Math.min(50, Number(body?.count ?? 10))) // cap to 50
    const address = body?.address?.toLowerCase()?.trim()

    const latestNum = await client.getBlockNumber() // bigint
    if (latestNum < 0n) throw new Error('Invalid latest block number')

    // Build the list of block numbers, clamped to 0n
    const blockNumbers = []
    for (let i = 0n; i < BigInt(maxBlocks); i++) {
      const n = latestNum - i
      if (n < 0n) break
      blockNumbers.push(n)
    }

    const blocks = await Promise.all(
      blockNumbers.map((n) =>
        client.getBlock({ blockNumber: n, includeTransactions: true })
      )
    )

    const txs = blocks
      .flatMap((b) =>
        (b.transactions || []).map((tx) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value?.toString(),
          blockNumber: b.number?.toString(),
        }))
      )
      .filter((tx) => {
        if (!address) return true
        return tx.from?.toLowerCase() === address || tx.to?.toLowerCase() === address
      })

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        latest: latestNum.toString(),
        blocksRequested: maxBlocks,
        blocksReturned: blocks.length,
        count: txs.length,
        txs,
      }),
    }
  } catch (e) {
    console.error(e)
    return { statusCode: 500, body: JSON.stringify({ error: String(e?.message || e) }) }
  }
}
