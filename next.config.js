let nextConfig = {
  publicRuntimeConfig: {
  },
  serverRuntimeConfig: {},
};

//Debug info for vault injection

console.log(JSON.stringify(process.env, null, 4));

module.exports = nextConfig;
