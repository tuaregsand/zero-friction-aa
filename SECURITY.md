# Security

This project implements ERC-4337 account abstraction. Specific risks include:

- **Paymaster griefing** – malicious users may try to exhaust the Paymaster stake. The Paymaster whitelists dApps and re-deposits refunds to maintain balance.
- **Signature replay** – user operations could be replayed across chains. The SmartAccount uses a monotonic `nonce` tied to the entry point to prevent reuse.
- **Validation gas** – high validation costs can drain user funds. Our bundler simulates operations first and the Paymaster caps refunded gas via `maxRefundWei`.

Always review contracts before deployment and run static analysis tools.

## Responsible disclosure
Please report vulnerabilities via email to security@example.com. Qualifying reports may receive rewards:
- Critical: up to $2,000
- High: up to $1,000
- Medium: up to $500
