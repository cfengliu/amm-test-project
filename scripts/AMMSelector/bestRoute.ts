import { ChainId, Token, WETH, Fetcher, Trade, TokenAmount } from "@uniswap/sdk";

const USDC = new Token(ChainId.MAINNET, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 6);
const DAI = new Token(ChainId.MAINNET, "0x6B175474E89094C44Da98b954EedeAC495271d0F", 18);
const TETHER = new Token(ChainId.MAINNET, "0xdAC17F958D2ee523a2206206994597C13D831ec7", 6);
const LINK = new Token(ChainId.MAINNET, "0x514910771AF9Ca656af840dff83E8264EcF986CA", 6);
const UNI = new Token(ChainId.MAINNET, "0xdAC17F958D2ee523a2206206994597C13D831ec7", 6);

async function bestTrade(tokenIn: Token, tokenOut: Token, amount: string) {
  const best = Trade.bestTradeExactIn(await getPairs(), new TokenAmount(tokenIn, amount), tokenOut, {
    maxNumResults: 3,
    maxHops: 3,
  });

  return best;
}

async function getPairs() {
  const pairIn1 = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);
  const pairIn2 = await Fetcher.fetchPairData(USDC, WETH[DAI.chainId]);
  const pairIn3 = await Fetcher.fetchPairData(LINK, WETH[DAI.chainId]);
  const pairIn4 = await Fetcher.fetchPairData(UNI, WETH[DAI.chainId]);
  const pairIn5 = await Fetcher.fetchPairData(TETHER, WETH[DAI.chainId]);

  const pairOut1 = await Fetcher.fetchPairData(WETH[DAI.chainId], USDC);
  const pairOut2 = await Fetcher.fetchPairData(WETH[DAI.chainId], TETHER);
  const pairOut3 = await Fetcher.fetchPairData(WETH[DAI.chainId], DAI);
  const pairOut4 = await Fetcher.fetchPairData(WETH[DAI.chainId], LINK);
  const pairOut5 = await Fetcher.fetchPairData(WETH[DAI.chainId], UNI);

  return [pairIn1, pairIn2, pairIn3, pairIn4, pairIn5, pairOut1, pairOut2, pairOut3, pairOut4, pairOut5];
}

async function main() {
  const bests = await bestTrade(LINK, DAI, "100000");

  for (const best of bests) {
    console.log(best.route);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
