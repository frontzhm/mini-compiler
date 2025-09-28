function createRootNode() {
  return {
    type: "Program",
    body: []
  }
}
function createNumberNode(value) {
  return {
    type: "NumberLiteral",
    value
  }
}
function createCallExpressionNode(name) {
  return {
    type: "CallExpression",
    name,
    params: []
  }
}

export function parser(tokens) {
  const rootNode = createRootNode()
  let current = 0
  let curMax = tokens.length - 1

  /**
   * walk函数用来解析token，返回节点，可以递归调用
   */
  function walk() {
    let token = tokens[current]
    if (token.type === "number") {
      return createNumberNode(token.value)
    }
    /**
     * 遇到左括号(时： 跳过(，获取函数名 创建调用节点 递归解析参数直到遇到) 返回完整的调用节点
     */
    if (token.type === "paren" && token.value === "(") {
      token = tokens[++current]
      // 解析出name和params
      const node = createCallExpressionNode(token.value)
      token = tokens[++current]

      while (!(token.type === "paren" && token.value === ")")) {
        node.params.push(walk())
        token = tokens[++current]
      }
      return node
    }

  }


  while (current <= curMax) {
    // tokens是一个一维数组，循环遍历每个token，调用walk函数，返回节点，push到rootNode.body中
    // 不是每个token都对应一个节点，需要判断token的类型，调用不同的函数，返回不同的节点
    rootNode.body.push(walk())
    current++
  }
  return rootNode
}