import { test, expect } from "vitest"
import { parser } from "./index.js"

test("parser", () => {
  const tokens = [
    { type: "paren", value: "(" },
    { type: "name", value: "add" },
    { type: "number", value: "2" },
    { type: "paren", value: "(" },
    { type: "name", value: "subtract" },
    { type: "number", value: "4" },
    { type: "number", value: "2" },
    { type: "paren", value: ")" },
    { type: "paren", value: ")" }
  ]

  const ast = {
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

  expect(parser(tokens)).toEqual(ast)
})

test("number", () => {
  const tokens = [{ type: "number", value: "1234" }]

  const ast = {
    type: "Program",
    body: [
      {
        type: "NumberLiteral",
        value: "1234"
      }
    ]
  }
  expect(parser(tokens)).toEqual(ast)
})

test("CallExpression", () => {
  const tokens = [
    { type: "paren", value: "(" },
    { type: "name", value: "add" },
    { type: "number", value: "2" },
    { type: "number", value: "4" },
    { type: "paren", value: ")" }
  ]

  const ast = {
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
            type: "NumberLiteral",
            value: "4"
          }
        ]
      }
    ]
  }

  expect(parser(tokens)).toEqual(ast)
})

test("two CallExpression", () => {
  const tokens = [
    { type: "paren", value: "(" },
    { type: "name", value: "add" },
    { type: "number", value: "2" },
    { type: "number", value: "4" },
    { type: "paren", value: ")" },
    { type: "paren", value: "(" },
    { type: "name", value: "add" },
    { type: "number", value: "5" },
    { type: "number", value: "6" },
    { type: "paren", value: ")" }
  ]

  const ast = {
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
            type: "NumberLiteral",
            value: "4"
          }
        ]
      },
      {
        type: "CallExpression",
        name: "add",
        params: [
          {
            type: "NumberLiteral",
            value: "5"
          },
          {
            type: "NumberLiteral",
            value: "6"
          }
        ]
      }
    ]
  }

  expect(parser(tokens)).toEqual(ast)
})
