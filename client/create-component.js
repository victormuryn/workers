const path = require(`path`);
const fs = require(`fs`);

// test-component => TestComponent
const camelize = (str) => {
  const arr = str.split(`-`);
  const capital = arr
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase());
  return capital.join(``);
};

// on file creation/modification callback
const fileCallback = (error, filename) => {
  if (error) console.log(error);
  console.log(`${filename} created`);
};

// delete first 2 arguments
const args = process.argv.slice(2);

const fileName = args[0];

// if second argument and second argument starts with "-" (--scss or -T) => skip
// on the other case => return this element
const argPath = (args[1] && args[1][0]) === `-` ? undefined : args[1];

// create path to component. Default: src\component\(fileName)
const pathToComponent = path.join(`src`, (argPath || `components`), fileName);

// componentName witch camelize
const componentName = camelize(fileName);

// do we need a test
const matchTest = args.includes(`--test`) || args.includes(`-T`);
// do we need a e2e-test
const matchE2ETest = args.includes(`--e2e-test`) || args.includes(`-ET`);
// do we need css
const mathCSS = args.includes(`--css`) || args.includes(`-C`);
// do we need scss
const mathSCSS = args.includes(`--scss`) || args.includes(`-S`);

// if there isn't folder
if (!fs.existsSync(pathToComponent)) {
  fs.mkdirSync(pathToComponent);
}

// jsx markup. We import css/scss files if we use them
const jsxContent = `import React from 'react';
${mathCSS ? `import './${fileName}.css';` : ``}
${mathSCSS ? `import './${fileName}.scss';` : ``}

const ${componentName} = () => {
  return (
    <p>${componentName}</p>
  );
};

export default ${componentName};
`;

fs.writeFile(
  `${path.join(pathToComponent, fileName)}.jsx`,
  jsxContent,
  (e) => fileCallback(e, `JSX`),
);

// index file. We export component from folder by default
const indexContent = `import ${componentName} from './${fileName}';

export default ${componentName};
`;

fs.writeFile(
  `${path.join(pathToComponent, `index.js`)}`,
  indexContent,
  (e) => fileCallback(e, `INDEX`),
);


if (matchTest) {
  const testContent = `import React from 'react';
import renderer from 'react-test-renderer';
import ${componentName} from './${fileName}';

describe(\`${componentName} tests\`, () => {
  it(\`${componentName} renders corrects\`, () => {
    const tree = renderer.create(<${componentName} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
`;

  fs.writeFile(
    `${path.join(pathToComponent, fileName)}.test.js`,
    testContent,
    (e) => fileCallback(e, `Test`),
  );
}

if (matchE2ETest) {
  const testContent = `import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ${componentName} from './${fileName}';

Enzyme.configure({adapter: new Adapter()});

it(\`On ${componentName} ...\`, () => {
  // test data
  const app = shallow(<${componentName} />);

  // test manipulation

  // check test
});
`;

  fs.writeFile(
    `${path.join(pathToComponent, fileName)}.e2e.test.js`,
    testContent,
    (e) => fileCallback(e, `E2E Test`),
  );
}

if (mathSCSS) {
  fs.appendFile(
    `${path.join(pathToComponent, fileName)}.scss`,
    ``,
    (e) => fileCallback(e, `SCSS`),
  );
}

if (mathCSS) {
  fs.appendFile(
    `${path.join(pathToComponent, fileName)}.css`,
    ``,
    (e) => fileCallback(e, `CSS`),
  );
}
