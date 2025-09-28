import { tokenizer } from "../tokenizer"
import { parser } from "../parser"
import { transformer } from "../transformer"
import { codeGenerator } from "../codeGenerator"

export function compiler(code){
  // 词法分析
  const tokens = tokenizer(code)
  // 语法分析
  const ast = parser(tokens)
  // 代码转换
  const transformedAst = transformer(ast)
  // 代码生成
  const generatedCode = codeGenerator(transformedAst)
  // 返回生成的代码
  return generatedCode
}