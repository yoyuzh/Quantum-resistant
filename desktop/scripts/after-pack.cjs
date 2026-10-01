'use strict';
const path = require('node:path');
module.exports = async (context) => {
  const { flipFuses, FuseVersion, FuseV1Options } = await import('@electron/fuses');
  const product = context.electronPlatformName === 'linux'
    ? context.packager.executableName : context.packager.appInfo.productFilename;
  const binary = context.electronPlatformName === 'darwin'
    ? path.join(context.appOutDir, `${product}.app`)
    : path.join(context.appOutDir, `${product}${context.electronPlatformName === 'win32' ? '.exe' : ''}`);
  await flipFuses(binary, {
    version: FuseVersion.V1,
    resetAdHocDarwinSignature: context.electronPlatformName === 'darwin',
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
  });
};
