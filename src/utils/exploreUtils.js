export const networks = {
  GNOSIS_TESTNET: "GNOSIS_TESTNET",
  GNOSIS_MAINNET: "GNOSIS_MAINNET",
  DKG_MAINNET: "DKG_MAINNET",
  DKG_TESTNET: "DKG_TESTNET",
  BASE_MAINNET: "BASE_MAINNET",
  BASE_TESTNET: "BASE_TESTNET",
};

export const subScanURls = {
  [networks.GNOSIS_TESTNET]: (contract, tokenId, hash = null) => ({
    subScanUrl: `https://gnosis-chiado.blockscout.com/token/${contract}/instance/${tokenId}`,
    blockchainName: "Gnosis Chiado Testnet",
    txDetails: `https://gnosis-chiado.blockscout.com/tx/${hash}`,
  }),
  [networks.GNOSIS_MAINNET]: (contract, tokenId, hash = null) => ({
    subScanUrl: `https://gnosis.blockscout.com/token/${contract}/instance/${tokenId}`,
    blockchainName: "Gnosis Mainnet",
    txDetails: `https://gnosis.blockscout.com/tx/${hash}`,
  }),
  [networks.DKG_MAINNET]: (contract, tokenId, hash = null) => ({
    subScanUrl: `https://origintrail.subscan.io/erc721_inventory?tokenID=${tokenId}&contract=${contract}`,
    blockchainName: "NeuroWeb Mainnet",
    txDetails: `https://origintrail.subscan.io/tx/${hash}`,
  }),
  [networks.DKG_TESTNET]: (contract, tokenId, hash = null) => ({
    subScanUrl: `https://origintrail-testnet.subscan.io/erc721_inventory?tokenID=${tokenId}&contract=${contract}`,
    blockchainName: "NeuroWeb Testnet",
    txDetails: `https://origintrail-testnet.subscan.io/tx/${hash}`,
  }),
  [networks.BASE_TESTNET]: (contract, tokenId, hash = null) => ({
    subScanUrl: `https://sepolia.basescan.org/token/${contract}?a=${tokenId}`,
    generalScannerUrl: `https://sepolia.basescan.org/address/${contract}`,
    blockchainName: "Base Testnet",
    txDetails: `https://sepolia.basescan.org/tx/${hash}`,
  }),
  [networks.BASE_MAINNET]: (contract, tokenId, hash = null) => ({
    subScanUrl: `https://basescan.org/token/${contract}?a=${tokenId}`,
    generalScannerUrl: `https://basescan.org/address/${contract}`,
    blockchainName: "Base Mainnet",
    txDetails: `https://basescan.org/tx/${hash}`,
  }),
};

export const explorerUrls = {
  [networks.GNOSIS_TESTNET]: (wallet) => ({
    profile: `https://dkg-testnet.origintrail.io/profile?wallet=${wallet}`,
  }),
  [networks.GNOSIS_MAINNET]: (wallet) => ({
    profile: `https://dkg.origintrail.io/profile?wallet=${wallet}`,
  }),
  [networks.DKG_MAINNET]: (wallet) => ({
    profile: `https://dkg.origintrail.io/profile?wallet=${wallet}`,
  }),
  [networks.DKG_TESTNET]: (wallet) => ({
    profile: `https://dkg-testnet.origintrail.io/profile?wallet=${wallet}`,
  }),
  [networks.BASE_TESTNET]: (wallet) => ({
    profile: `https://dkg-testnet.origintrail.io/profile?wallet=${wallet}`,
  }),
  [networks.BASE_MAINNET]: (wallet) => ({
    profile: `https://dkg.origintrail.io/profile?wallet=${wallet}`,
  }),
};
