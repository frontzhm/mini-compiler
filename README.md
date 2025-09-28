# 编译器

## 安装

```bash
npm install
```

## 运行

```bash
npm run test
```

## 简介

主要是将`'(add 2 (subtract 4 2))'`通过编译器转换为`'add(2, subtract(4, 2))'`。
在这过程中经历普通编译器的过程：词法分析、语法分析、代码转换、代码生成。

- 词法分析`tokenizer`是将输入的字符串转换为一个个的 token。

- 语法分析`parser`是将 token 转换为抽象语法树(AST)。

- 代码转换`transformer`是将 AST 转换为另一种形式的 AST。

- 代码生成`codeGenerator`是将 AST 转换为代码。

## 测试

项目是测试驱动开发的，每个功能都先写测试，再写实现，也可以动态`npm test -- src/compiler/index.spec.js `执行单个测试文件。

## 实现思路

### 词法分析`tokenizer`，输入是字符串，输出是 token 数组。

- 遇到左括号`(`时，添加一个`{ type: "paren", value: "(" }`到`tokens`数组中。
- 遇到右括号`)`时，添加一个`{ type: "paren", value: ")" }`到`tokens`数组中。
- 遇到数字时，需要遍历连续的数字，直到遇到非数字字符，然后添加一个`{ type: "number", value: "数字" }`到`tokens`数组中。
- 遇到字母时，需要遍历连续的字母，直到遇到非字母字符，然后添加一个`{ type: "name", value: "字母" }`到`tokens`数组中。
- 遇到空格时，跳过。

```js
const tokenizer = (code) => {
  const tokens = [];
  let current = 0;
  const length = code.length;
  while (current < length) {
    let char = code[current];
    if (char === '(') {
      tokens.push({ type: 'paren', value: '(' });
      current++;
    }
    if (char === ')') {
      tokens.push({ type: 'paren', value: ')' });
      current++;
    }

    {
      const whiteSpace = /\s/;
      if (whiteSpace.test(char)) {
        current++;
      }
    }

    {
      let LETTERS = /[a-z]/i;
      if (LETTERS.test(char)) {
        let value = '';
        while (LETTERS.test(char) && current < length) {
          value += char;

          // 指针后移
          current++;
          char = code[current];
        }
        tokens.push({ type: 'name', value });
      }
    }

    {
      let NUMBERS = /[0-9]/;
      if (NUMBERS.test(char)) {
        let value = '';
        while (NUMBERS.test(char) && current < length) {
          value += char;

          current++;
          char = code[current];
        }
        tokens.push({ type: 'number', value });
      }
    }
  }
  return tokens;
};

module.exports = { tokenizer };
```

### 语法分析`parser`，输入是 token 数组，输出是抽象语法树(AST)。

- 创建根节点`{ type: "Program", body: [] }`。
- 遇到`{ type: "number", value: "数字" }`时，创建数字节点`{ type: "NumberLiteral", value: "数字" }`。
- 遇到`{ type: "paren", value: "(" }`时，跳过，获取函数名，创建调用节点`{ type: "CallExpression", name: "函数名", params: [] }`，递归解析参数直到遇到`)`。
- 将节点添加到`body`数组中。
- 返回根节点。

其中`walk`是关键函数，用来解析不同类型的节点，根据 token 的类型，返回不同的节点，可以递归调用。

```js
function createRootNode() {
  return {
    type: 'Program',
    body: [],
  };
}
function createNumberNode(value) {
  return {
    type: 'NumberLiteral',
    value,
  };
}
function createCallExpressionNode(name) {
  return {
    type: 'CallExpression',
    name,
    params: [],
  };
}

export function parser(tokens) {
  const rootNode = createRootNode();
  let current = 0;
  let curMax = tokens.length - 1;

  /**
   * walk函数用来解析token，返回节点，可以递归调用
   */
  function walk() {
    let token = tokens[current];
    if (token.type === 'number') {
      return createNumberNode(token.value);
    }
    /**
     * 遇到左括号(时： 跳过(，获取函数名 创建调用节点 递归解析参数直到遇到) 返回完整的调用节点
     */
    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current];
      // 解析出name和params
      const node = createCallExpressionNode(token.value);
      token = tokens[++current];

      while (!(token.type === 'paren' && token.value === ')')) {
        node.params.push(walk());
        token = tokens[++current];
      }
      return node;
    }
  }

  while (current <= curMax) {
    // tokens是一个一维数组，循环遍历每个token，调用walk函数，返回节点，push到rootNode.body中
    // 不是每个token都对应一个节点，需要判断token的类型，调用不同的函数，返回不同的节点
    rootNode.body.push(walk());
    current++;
  }
  return rootNode;
}
```

### 代码转换`transformer`，输入是抽象语法树(AST)，输出是另一种形式的抽象语法树(AST)。

- 根据 AST 的类型，创建不同的节点。
- 将节点添加到`body`数组中。
- 返回根节点。

其中`astTypeMap`是节点类型映射，将 AST 的类型映射为另一种形式的 AST 的类型，其中的 Key 是 AST 的类型，Value 是另一种形式的 AST 的类型，如果 Value 的属性是函数，则调用函数，传入 AST 节点，返回另一种形式的 AST 节点。使用`handleObject`函数递归处理 Value 的属性。

```js
// 节点类型映射
const astTypeMap = {
  CallExpression: {
    type: 'CallExpression',
    callee: { type: 'Identifier', name: (node) => node.name },
    arguments: (node) => node.params.map((param) => transform(param)),
  },
  NumberLiteral: {
    type: 'NumberLiteral',
    value: (node) => node.value,
  },
};
function transform(node) {
  const typeHandler = astTypeMap[node.type];
  if (!typeHandler) return node;

  function handleObject(obj) {
    const result = {};
    for (const key in obj) {
      if (typeof obj[key] === 'function') {
        result[key] = obj[key](node);
      } else if (typeof obj[key] === 'object') {
        result[key] = handleObject(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }

  const result = handleObject(typeHandler);
  return result;
}

export function transformer(ast) {
  return {
    type: 'Program',
    body: ast.body.map((node) => ({
      type: 'ExpressionStatement',
      expression: transform(node),
    })),
  };
}
```

### 代码生成`codeGenerator`，输入是另一种形式的抽象语法树(AST)，输出是代码。

- 根据 AST 的类型，生成不同的代码。
- 使用递归调用`codeGenerator`函数，生成不同的代码。

```js
export function codeGenerator(node) {
  let res = '';
  switch (node.type) {
    case 'Program':
      return node.body.map(codeGenerator).join('');
    case 'ExpressionStatement':
      return `${codeGenerator(node.expression)};`;
    case 'CallExpression':
      return `${node.callee.name}(${node.arguments
        .map(codeGenerator)
        .join(', ')})`;
    case 'NumberLiteral':
      return node.value;
  }
  return res;
}
```

### 编译器`compiler`，输入是旧代码，输出是新代码。

- 使用`tokenizer`函数，将旧代码转换为 token 数组。
- 使用`parser`函数，将 token 数组转换为抽象语法树(AST)。
- 使用`transformer`函数，将抽象语法树(AST)转换为另一种形式的抽象语法树(AST)。
- 使用`codeGenerator`函数，将另一种形式的抽象语法树(AST)转换为新代码。
- 返回新代码。

```js
import { tokenizer } from '../tokenizer';
import { parser } from '../parser';
import { transformer } from '../transformer';
import { codeGenerator } from '../codeGenerator';

export function compiler(code) {
  // 词法分析
  const tokens = tokenizer(code);
  // 语法分析
  const ast = parser(tokens);
  // 代码转换
  const transformedAst = transformer(ast);
  // 代码生成
  const generatedCode = codeGenerator(transformedAst);
  // 返回生成的代码
  return generatedCode;
}
```
