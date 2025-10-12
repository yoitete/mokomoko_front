import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/Button/Button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies default variant styles", () => {
    render(<Button>Default Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-[#7E6565]");
  });

  it("applies outline variant styles", () => {
    render(<Button variant="outline">Outline Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-[#7E6565]");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
