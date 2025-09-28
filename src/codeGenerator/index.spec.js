import { test, expect } from "vitest"
import { codeGenerator } from "./index"
test("codeGenerator", () => {
  const ast = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "add"
          },
          arguments: [
            {
              type: "NumberLiteral",
              value: "2"
            },
            {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "subtract"
              },
              arguments: [
                {
                  type: "NumberLiteral",
                  value: "4"
                },
                {
                  type: "NumberLiteral",
                  value: "2"
                }
              ]
            }
          ]
        }
      }
    ]
  }

  expect(codeGenerator(ast)).toEqual("add(2, subtract(4, 2));")
})

test("ExpressionStatement", () => {
  const ast = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "add"
          },
          arguments: [
            {
              type: "NumberLiteral",
              value: "2"
            },
            {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "subtract"
              },
              arguments: [
                {
                  type: "NumberLiteral",
                  value: "4"
                },
                {
                  type: "NumberLiteral",
                  value: "2"
                }
              ]
            }
          ]
        }
      },
      {
        type: "ExpressionStatement",
        expression: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "add"
          },
          arguments: [
            {
              type: "NumberLiteral",
              value: "2"
            },
            {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "subtract"
              },
              arguments: [
                {
                  type: "NumberLiteral",
                  value: "5"
                },
                {
                  type: "NumberLiteral",
                  value: "7"
                }
              ]
            }
          ]
        }
      }
    ]
  }

  expect(codeGenerator(ast)).toEqual(
    "add(2, subtract(4, 2));add(2, subtract(5, 7));"
  )
})
