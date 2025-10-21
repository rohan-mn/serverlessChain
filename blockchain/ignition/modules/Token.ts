import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenModule", (m) => {
  const initial = 1_000_000n * 10n**18n;
  const token = m.contract("DemoToken", [initial]);
  return { token };
});
