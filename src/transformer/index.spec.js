import { expect, test } from "vitest"
import { transformer } from "./index"

test("transformer", () => {
  const originalAST = {
    type: "Program",
    body: [
      {
        type: "CallExpression",
        name: "add",
        params: [
          {
            type: "NumberLiteral",
            value: "2"
          },
          {
            type: "CallExpression",
            name: "subtract",
            params: [
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
    ]
  }

  const transformedAST = {
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
  expect(transformer(originalAST)).toEqual(transformedAST)
})
