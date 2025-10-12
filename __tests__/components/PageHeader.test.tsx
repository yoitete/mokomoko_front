import { render, screen } from "@testing-library/react";
import { PageHeader } from "@/components/PageHeader/PageHeader";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock FontAwesome
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, className }) => (
    <span data-testid="fontawesome-icon" className={className}>
      {icon}
    </span>
  ),
}));

describe("PageHeader", () => {
  it("renders with title", () => {
    render(<PageHeader title="Test Title" />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders with back button when showBackButton is true", () => {
    const mockOnBack = jest.fn();
    render(
      <PageHeader
        title="Test Title"
        showBackButton={true}
        onBack={mockOnBack}
      />
    );

    const backButton = screen.getByRole("button");
    expect(backButton).toBeInTheDocument();
    expect(screen.getByTestId("fontawesome-icon")).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", () => {
    const mockOnBack = jest.fn();
    render(
      <PageHeader
        title="Test Title"
        showBackButton={true}
        onBack={mockOnBack}
      />
    );

    const backButton = screen.getByRole("button");
    backButton.click();

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("renders with custom className", () => {
    render(<PageHeader title="Test Title" className="custom-class" />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("custom-class");
  });

  it("renders children when provided", () => {
    render(
      <PageHeader title="Test Title">
        <div data-testid="child-content">Child Content</div>
      </PageHeader>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });
});
