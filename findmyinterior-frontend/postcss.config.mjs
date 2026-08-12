const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-preset-env": {
      stage: 0,
      features: {
        "color-mix": true,
        "oklab-function": true,
        "logical-properties-and-values": false
      }
    },
    "@csstools/postcss-cascade-layers": {}
  },
};

export default config;
