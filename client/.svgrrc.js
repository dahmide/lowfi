const path = require("path");

function template(variables, { tpl }) {
    return tpl`
${variables.imports}

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const ${variables.componentName} = ({ size = 24, ...props }: IconProps) => (
  ${variables.jsx}
);

${variables.exports}
`;
}

function indexTemplate(files) {
    const exportEntries = files.map((file) => {
        const basename = path.basename(file.path, path.extname(file.path));
        return `export { default as ${basename}Icon } from './${basename}';`;
    });
    return exportEntries.join("\n");
}

module.exports = {
    typescript: true,
    jsxRuntime: "automatic",
    dimensions: false,
    expandProps: "end",
    svgProps: {
        width: "{size}",
        height: "{size}",
        fill: "currentColor",
    },
    template,
    indexTemplate,
};
