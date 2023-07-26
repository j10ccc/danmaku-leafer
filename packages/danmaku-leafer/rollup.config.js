import typescript from "@rollup/plugin-typescript";

const config = {
  input: ["src/index.ts"],
  output: {
    dir: "dist",
    format: "esm"
  },
  plugins: [typescript({
    compilerOptions: {
      outDir: "dist"
    }
  })]
};

export default config;