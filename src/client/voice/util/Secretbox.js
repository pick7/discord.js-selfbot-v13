'use strict';

const libs = {
  sodium: sodium => ({
    open: sodium.api.crypto_secretbox_open_easy,
    close: sodium.api.crypto_secretbox_easy,
    random: n => sodium.randombytes_buf(n),
  }),
  'libsodium-wrappers': sodium => ({
    open: sodium.crypto_secretbox_open_easy,
    close: sodium.crypto_secretbox_easy,
    random: n => sodium.randombytes_buf(n),
  }),
  tweetnacl: tweetnacl => ({
    open: tweetnacl.secretbox.open,
    close: tweetnacl.secretbox,
    random: n => tweetnacl.randomBytes(n),
  }),
};

function NoLib() {
  throw new Error(
    'Cannot play audio as no valid encryption package is installed.\n- Install sodium, libsodium-wrappers, or tweetnacl.',
  );
}

exports.methods = {
  open: NoLib,
  close: NoLib,
  random: NoLib,
};

(async () => {
  for (const libName of Object.keys(libs)) {
    try {
      const lib = require(libName);
      if (libName === 'libsodium-wrappers' && lib.ready) await lib.ready; // eslint-disable-line no-await-in-loop
      exports.methods = libs[libName](lib);
      break;
    } catch {} // eslint-disable-line no-empty
  }
})();
