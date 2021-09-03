import fs from "fs";
import path from "path";
// import {} from "@testing-library/jest-dom/matchers";
// import { screen } from "@testing-library/dom";

const html = fs.readFileSync(path.resolve(__dirname, "../arch.tmpl.js"));
console.log(html.toString());

describe("type test", () => {
  beforeEach(() => {
    document.body.innerHTML = html.toString();
  });

  it("enum", () => {
    enum Color {
      Red = 0,
      Green,
      Blue,
    }

    const c = Color.Red;
    expect(c).toBe(0);
  });

  it("dom", () => {
    // const div = getByRole(document.documentElement, "dialog");
    // const div = screen.getByRole("dialog");
    console.log(document.body.innerHTML);
  });
});
