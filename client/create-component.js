var path = require("path");
var fs = require("fs");
var generateJSX = function (props) {
  var css = props.css, scss = props.scss, componentName = props.componentName,
    fileName = props.fileName;
  return "import React from 'react';\n" + (css ? "import './" + fileName + ".css';" : "") + "\n" + (scss ? "import './" + fileName + ".scss';" : "") + "\n\nconst " + componentName + " = () => {\n  return (\n    <p>" + componentName + "</p>\n  );\n};\n\nexport default " + componentName + ";\n";
};
var generateTS = function (props) {
  var css = props.css, scss = props.scss, componentName = props.componentName,
    fileName = props.fileName;
  return "import React from 'react';\n" + (css ? "import './" + fileName + ".css';" : "") + "\n" + (scss ? "import './" + fileName + ".scss';" : "") + "\n  \nconst " + componentName + ": React.FC = () => {\n  return (\n    <p>" + componentName + "</p>\n  );\n};\n\nexport default " + componentName + ";\n";
};
var generateIndex = function (props) {
  var componentName = props.componentName, fileName = props.fileName;
  return "import " + componentName + " from './" + fileName + "';\n\nexport default " + componentName + ";\n";
};
var generateTest = function (props) {
  var componentName = props.componentName, fileName = props.fileName;
  return "import React from 'react';\nimport renderer from 'react-test-renderer';\nimport " + componentName + " from './" + fileName + "';\n\ndescribe(`" + componentName + " tests`, () => {\n  it(`" + componentName + " renders corrects`, () => {\n    const tree = renderer.create(<" + componentName + " />).toJSON();\n\n    expect(tree).toMatchSnapshot();\n  });\n});\n";
};
var generateE2ETest = function (props) {
  var componentName = props.componentName, fileName = props.fileName;
  return "import React from 'react';\nimport Enzyme, {shallow} from 'enzyme';\nimport Adapter from 'enzyme-adapter-react-16';\nimport " + componentName + " from './" + fileName + "';\n\nEnzyme.configure({adapter: new Adapter()});\n\nit(`On " + componentName + " ...`, () => {\n  // test data\n  const app = shallow(<" + componentName + " />);\n\n  // test manipulation\n\n  // check test\n});\n";
};
// test-component => TestComponent
var camelize = function (str) {
  var arr = str.split("-");
  var capital = arr
    .map(function (item) {
      return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
    });
  return capital.join("");
};
// on file creation/modification callback
var fileCallback = function (error, filename) {
  if (error)
    console.log(error);
  console.log(filename + " created");
};
// delete first 2 arguments
var args = process.argv.slice(2);
var fileName = args[0];
// if second argument starts with "-" (--scss or -T) => skip
// on the other case => return this element
var argPath = args[1][0] === "-" ? undefined : args[1];
// create path to component. Default: src\component\(fileName)
var pathToComponent = path.join("src", (argPath || "components"), fileName);
// componentName witch camelize
var componentName = camelize(fileName);
// do we need a test
var matchTest = args.includes("--test") || args.includes("-T");
// do we need a e2e-test
var matchE2ETest = args.includes("--e2e-test") || args.includes("-ET");
// do we need css
var matchCSS = args.includes("--css") || args.includes("-C");
// do we need scss
var matchSCSS = args.includes("--scss") || args.includes("-S");
// do we need typescript
var matchTS = args.includes("--typescript") || args.includes("-TS");
// if there isn't folder
if (!fs.existsSync(pathToComponent)) {
  fs.mkdirSync(pathToComponent);
}
if (matchTS) {
  var mainContent = generateTS({
    css: matchCSS,
    scss: matchSCSS,
    fileName: fileName, componentName: componentName
  });
  fs.writeFile(path.join(pathToComponent, fileName) + ".tsx", mainContent, function (e) {
    return fileCallback(e, "TSX");
  });
} else {
  // jsx markup. We import css/scss files if we use them
  var jsxContent = generateJSX({
    css: matchCSS,
    scss: matchSCSS,
    fileName: fileName, componentName: componentName
  });
  fs.writeFile(path.join(pathToComponent, fileName) + ".jsx", jsxContent, function (e) {
    return fileCallback(e, "JSX");
  });
}
// index file. We export component from folder by default
var indexContent = generateIndex({
  componentName: componentName,
  fileName: fileName
});
fs.writeFile("" + path.join(pathToComponent, "index." + (matchTS ? 't' : 'j') + "s"), indexContent, function (e) {
  return fileCallback(e, "index." + (matchTS ? 't' : 'j') + "s");
});
if (matchTest) {
  var testContent = generateTest({
    componentName: componentName,
    fileName: fileName
  });
  fs.writeFile(path.join(pathToComponent, fileName) + ".test." + (matchTS ? "tsx" : "js"), testContent, function (e) {
    return fileCallback(e, "Test");
  });
}
if (matchE2ETest) {
  var testContent = generateE2ETest({
    componentName: componentName,
    fileName: fileName
  });
  fs.writeFile(path.join(pathToComponent, fileName) + ".e2e.test." + (matchTS ? "tsx" : "js"), testContent, function (e) {
    return fileCallback(e, "E2E Test");
  });
}
if (matchSCSS) {
  fs.appendFile(path.join(pathToComponent, fileName) + ".scss", "", function (e) {
    return fileCallback(e, "SCSS");
  });
}
if (matchCSS) {
  fs.appendFile(path.join(pathToComponent, fileName) + ".css", "", function (e) {
    return fileCallback(e, "CSS");
  });
}
