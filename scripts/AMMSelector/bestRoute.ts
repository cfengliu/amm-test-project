import { ChainId, Token, WETH, Fetcher, Trade, TokenAmount } from "@uniswap/sdk";

const USDC = new Token(ChainId.MAINNET, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 6);
const DAI = new Token(ChainId.MAINNET, "0x6B175474E89094C44Da98b954EedeAC495271d0F", 18);

const TETHER = new Token(ChainId.MAINNET, "0xdAC17F958D2ee523a2206206994597C13D831ec7", 6);

async function main() {
  const pair1 = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);
  const pair2 = await Fetcher.fetchPairData(WETH[DAI.chainId], USDC);
  const pair3 = await Fetcher.fetchPairData(WETH[DAI.chainId], TETHER);
  const pair4 = await Fetcher.fetchPairData(WETH[DAI.chainId], DAI);
  const pair5 = await Fetcher.fetchPairData(USDC, WETH[DAI.chainId]);
  const pair6 = await Fetcher.fetchPairData(TETHER, WETH[DAI.chainId]);

  const best = Trade.bestTradeExactIn(
    [pair1, pair2, pair3, pair4, pair5, pair6],
    new TokenAmount(USDC, "100000"),
    USDC,
    { maxNumResults: 3, maxHops: 3 },
  );

  console.log(best[0].route);
  console.log(best[1].route);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
