import { tokenizer } from "./index"
import { expect, test } from "vitest"

test("tokenizer", () => {
  const code = "(add 2 (subtract 4 2))"

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

  expect(tokenizer(code)).toEqual(tokens)
})
test("left paren", () => {
  const code = "("
  const tokens = [{ type: "paren", value: "(" }]
  expect(tokenizer(code)).toEqual(tokens)
})

test("right paren", () => {
  const code = ")"
  const tokens = [{ type: "paren", value: ")" }]
  expect(tokenizer(code)).toEqual(tokens)
})
test("name", () => {
  const code = "add"
  const tokens = [{ type: "name", value: "add" }]
  expect(tokenizer(code)).toEqual(tokens)
})
test("number", () => {
  const code = "1234"
  const tokens = [{ type: "number", value: "1234" }]
  expect(tokenizer(code)).toEqual(tokens)
})

test("(add 1 2)", () => {
  const code = "(add 1 2)"
  const tokens = [{ type: "paren", value: "(" }, { type: "name", value: "add" }, { type: "number", value: "1" }, { type: "number", value: "2" }, { type: "paren", value: ")" }]
  expect(tokenizer(code)).toEqual(tokens)
})