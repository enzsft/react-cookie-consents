import React from "react";
import { render } from "react-testing-library";
import { TestComp } from "../test-comp";

describe("test-comp", () => {
  it("should render", () => {
    const { getByTestId } = render(<TestComp />);

    getByTestId("test-div");
  });
});
