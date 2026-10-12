# AOTS⁶ ZK Core — revisión de seguridad y gobernación

**Fecha:** 2026-10-12  
**Contrato revisado:** `contracts/AOTS6_ZK_Core.sol`  
**Estado:** revisión estática de fuente; no se afirma compilación, prueba completa ni despliegue on-chain.

## Hallazgos que bloquean el despliegue

### ZK-01 — Prueba no ligada a todos los datos registrados (ALTO)

La interfaz `IGroth16Verifier.verifyProof` recibe un único valor público `input[0]`. En `registerIdentityZK`, la prueba no recibe como entradas públicas el `ipfsCid`, `shaAnchor` ni `nullifier`, aunque estos valores se guardan en el estado y el nullifier se consume. Con la interfaz visible, la prueba verificada no demuestra que esos tres valores estén ligados criptográficamente a la prueba. Un llamador podría adjuntar metadatos diferentes a una prueba válida, salvo que el circuito/verificador real establezca una vinculación equivalente por un mecanismo externo no visible en este repositorio.

**Control:** no desplegar ni usar para registrar procedencia hasta definir y revisar el esquema de entradas públicas del circuito, ligar CID/hash/nullifier a la prueba y añadir pruebas negativas que cambien cada campo. La interfaz Solidity y el circuito deben versionarse juntos.

### ZK-02 — Verificador sin validación de dirección (MEDIO)

El constructor acepta `_zkVerifier` sin comprobar dirección cero ni existencia de código. Un verificador incorrecto puede hacer que la verificación falle o que el contrato quede inutilizable.

**Control:** validar `_zkVerifier != address(0)` y `_zkVerifier.code.length > 0`, y probar el despliegue con direcciones inválidas antes de liberar una versión corregida.

### ZK-03 — Política de votación incompleta o no demostrada (ALTO)

`toroidalPrivateVote` está restringida a `SOVEREIGN_ROLE`; el contrato no almacena una votación con quórum ni una política de propuesta verificable, y el umbral se calcula a partir de `input[0]` y `voteWeight`. `voteWeight` no tiene límite de política explícito en la función. Esto puede ser intencional para un operador soberano, pero no implementa por sí solo una votación distribuida o un consenso general.

**Control:** definir roles, límite de peso, quórum, ventana de votación, propuesta y resultado persistido; añadir pruebas de autorización y límites. No describir la función como gobernanza democrática o consenso distribuido hasta demostrarlo.

### ZK-04 — Estado de despliegue no verificado

La fuente contiene un CID constante y un constructor que requiere un verificador, pero este análisis no encontró en los archivos inspeccionados un recibo de despliegue, dirección de contrato, chain ID ni transacción de inicialización verificable.

**Control:** tratar el contrato como código fuente, no como estatuto ya desplegado. Registrar dirección, chain ID, hash de bytecode, transacción y bloque solo después de verificar un recibo en un explorador/RPC independiente.

## Criterio de liberación

No liberar hasta: (1) corregir ZK-01, (2) validar la dirección del verificador, (3) completar las pruebas de roles y política de voto, (4) compilar y ejecutar pruebas reproducibles, y (5) registrar evidencia de despliegue si se despliega. Ninguna corrección documental equivale a una transacción o a una validación del circuito Groth16.
