const astTypeMap = {
  CallExpression: {
    type: 'CallExpression',
    callee: { type: 'Identifier', name: (node) => node.name },
    arguments: (node) => node.params.map(param => transform(param))
  },
  NumberLiteral: {
    type: 'NumberLiteral',
    value: (node) => node.value
  }
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
    body: ast.body.map(node => ({
      type: 'ExpressionStatement',
      expression: transform(node)
    }))
  };
}
