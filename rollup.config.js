const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const html = require("@rollup/plugin-html");
// const buble = require('@rollup/plugin-buble')
const { babel } = require("@rollup/plugin-babel");

module.exports = {
  input: "./src/entry.ts",
  output: {
    file: "./dist/bundle.js",
    format: "iife",
    name: "_detector",
    sourcemap: true,
  },
  watch: {
    buildDelay: 1000,
    include: "src/**",
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    // buble({ transforms: { generator: true } }),
    babel({
      babelHelpers: "bundled",
      extensions: ["ts", "js"],
      exclude: /node_modules/,
    }),
    html({
      template: getTemplateHtml,
    }),
  ],
};

function getTemplateHtml({ attributes, files, title, meta }) {
  const makeHtmlAttributes = (attributes) => {
    if (!attributes) {
      return "";
    }

    const keys = Object.keys(attributes);
    // eslint-disable-next-line no-param-reassign
    return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), "");
  };
  const publicPath = "";
  const scripts = (files.js || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.script);
      return `<script src="${publicPath}${fileName}"${attrs}></script>`;
    })
    .join("\n");

  const links = (files.css || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.link);
      return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
    })
    .join("\n");

  const metas = meta
    .map((input) => {
      const attrs = makeHtmlAttributes(input);
      return `<meta${attrs}>`;
    })
    .join("\n");

  const testScripts = ["pre.js", 'uv.js', "ajax.js", "static_source.js"];

  return `
<!DOCTYPE html>
<html ${makeHtmlAttributes(attributes)}>
<head>
  ${metas}
  <title>${title}</title>
  ${links}
</head>
<body>
  ${scripts}
  ${testScripts.map((name) => `<script src='../test/${name}'></script>`).join("\n")}
</body>
</html>
`;
}
