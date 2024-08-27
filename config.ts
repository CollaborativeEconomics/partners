export const config = {
  "title": "Partners Portal",
  "description": "Dashboard for partners functionality",
  "registry": {
    "endpoint": "https://registry.staging.cfce.io/api"
  },
  "ipfs": {
    "endpoint": "https://s3.filebase.com/",
    "gateway": "https://ipfs.filebase.io/ipfs/",
    "region": "us-east-1",
    "pinning": "https://api.filebase.io/v1/ipfs",
    "buckets": {
      "nfts": "kuyawa-test-ipfs",
      "avatars": "kuyawa-avatars",
      "media": "kuyawa-media"
    }
  },
  "blockchain": "multiple",
  "chains": {
    "arbitrum": {
      "name": "Arbitrum",
      "network": "testnet",
      "chainId": "421614",
      "currency": "ARB",
      "decimals": 18,
      "explorer": "https://sepolia.arbiscan.io",
      "provider": "https://sepolia-rollup.arbitrum.io/rpc",
      "contracts": {
        "ERC721": {
          "address": "0x123",
          "admin": "0x123"
        }
      },
      "wallets": ["metamask"],
      "coins": [
        {
          "value":  "ARB",
          "image":   "/coins/arb.png",
          "contract": "0x123",
          "decimals": 18,
          "native": true,
          "chainEnabled": true
        },
        {
          "value":  "USDC",
          "image":   "/coins/usdc.png",
          "contract": "0x345",
          "decimals": 6,
          "native": false,
          "chainEnabled": true
        }
      ]
    },
    "xinfin": {
      "name": "XinFin",
      "network": "testnet",
      "chainId": "1",
      "currency": "XDC",
      "explorer": "",
      "provider": "",
      "contracts": {
        "ERC721": {
          "address": "0x123",
          "admin": "0x123"
        }
      },
      "wallets": [],
      "coins": []
    }
  }
} as const