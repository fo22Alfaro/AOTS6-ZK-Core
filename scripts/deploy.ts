import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Desplegando AOTS6_ZK_Core...");

  // Reemplaza con la dirección de tu Groth16 Verifier (desplegado previamente)
  const zkVerifierAddress = "0x0000000000000000000000000000000000000000"; // ← ACTUALIZAR

  const AOTS6_ZK_Core = await ethers.getContractFactory("AOTS6_ZK_Core");
  const aots6 = await AOTS6_ZK_Core.deploy(zkVerifierAddress);

  await aots6.waitForDeployment();

  console.log("✅ AOTS6_ZK_Core desplegado en:", await aots6.getAddress());
  console.log("🔗 Ver en Etherscan una vez verificado");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
