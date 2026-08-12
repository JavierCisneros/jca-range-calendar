import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import RangeCalendar from "./range-calendar";

const range = {
  from: new Date(2026, 7, 12),
  to: new Date(2026, 7, 18),
};

function getInputs() {
  return screen.getAllByRole("textbox") as HTMLInputElement[];
}

describe("RangeCalendar", () => {
  it("keeps displayed values in sync with a controlled parent", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<RangeCalendar onChange={onChange} value={range}>Period</RangeCalendar>);

    await user.click(screen.getByRole("button", { name: /open date range calendar/i }));
    const day = document.querySelector<HTMLButtonElement>(
      'button[data-day="2026-08-20"]',
    );
    expect(day).not.toBeNull();
    await user.click(day!);

    expect(onChange).toHaveBeenCalled();
    expect(getInputs()[0]).toHaveValue("08/12/2026");
    expect(getInputs()[1]).toHaveValue("08/18/2026");
  });

  it("reports an incomplete date after blur", () => {
    render(<RangeCalendar>Period</RangeCalendar>);
    const [fromInput] = getInputs();

    fireEvent.change(fromInput, { target: { value: "02/2" } });
    fireEvent.blur(fromInput);

    expect(screen.getByText("Enter a valid start date.")).toBeInTheDocument();
  });

  it("does not validate again while a previously invalid field is being edited", () => {
    render(<RangeCalendar>Period</RangeCalendar>);
    const [fromInput] = getInputs();

    fireEvent.change(fromInput, { target: { value: "02/2" } });
    fireEvent.blur(fromInput);
    expect(screen.getByText("Enter a valid start date.")).toBeInTheDocument();

    fireEvent.focus(fromInput);
    fireEvent.change(fromInput, { target: { value: "02/20" } });
    expect(screen.queryByText("Enter a valid start date.")).not.toBeInTheDocument();

    fireEvent.blur(fromInput);
    expect(screen.getByText("Enter a valid start date.")).toBeInTheDocument();
  });

  it("moves between date boundaries with arrow keys at their edges", () => {
    render(<RangeCalendar defaultValue={range}>Period</RangeCalendar>);
    const [fromInput, toInput] = getInputs();

    fromInput.focus();
    fromInput.setSelectionRange(fromInput.value.length, fromInput.value.length);
    fireEvent.keyDown(fromInput, { key: "ArrowRight" });
    expect(toInput).toHaveFocus();

    toInput.setSelectionRange(0, 0);
    fireEvent.keyDown(toInput, { key: "ArrowLeft" });
    expect(fromInput).toHaveFocus();
  });

  it("prevents all field interactions when disabled", async () => {
    const user = userEvent.setup();
    render(<RangeCalendar disabled>Period</RangeCalendar>);

    const [fromInput, toInput] = getInputs();
    expect(fromInput).toBeDisabled();
    expect(toInput).toBeDisabled();

    const trigger = screen.getByRole("button", { name: /open date range calendar/i });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
