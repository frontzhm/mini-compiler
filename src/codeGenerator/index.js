export function codeGenerator(node){
  let res = ''
  switch(node.type){
    case 'Program':
      return node.body.map(codeGenerator).join("")
    case 'ExpressionStatement':
      return `${codeGenerator(node.expression)};`
    case 'CallExpression':
      return `${node.callee.name}(${node.arguments.map(codeGenerator).join(", ")})`
    case 'NumberLiteral':
      return node.value
  }
  return res
}
// function transformCallExpression(expression){
//  let res = ''
//  const name = expression?.callee?.name
//  res += `${name}(`
//  const args = expression?.arguments
//  for(let i = 0; i < args.length; i++){
//   const argument = args[i]
//   if(argument.type === 'NumberLiteral'){
//     res += `${argument.value}`
//   } 
//   if(argument.type === 'CallExpression'){
//     res += `${transformCallExpression(argument)}`
//   }
//   if(i !== args.length - 1){
//     res += ', '
//   }
//  }
//  res += `)`
//  return res
// }

// function transformExpressionStatement(expressionStatements){
//   let res = ''
//   for(let i = 0; i < expressionStatements.length; i++){
//     const expressionStatement = expressionStatements[i]
//     const expression = expressionStatement.expression
//     res += `${transformCallExpression(expression)};`
//   }
//   return res
// }

// export function codeGenerator(node) {
//   let res = ''
//   const expressionStatements = node.body
//   res += `${transformExpressionStatement(expressionStatements)}`
//   return res
// }