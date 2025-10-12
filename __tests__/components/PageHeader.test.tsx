import { render, screen } from "@testing-library/react";
import { PageHeader } from "@/components/PageHeader/PageHeader";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock FontAwesome
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, className }: { icon: unknown; className?: string }) => (
    <span data-testid="fontawesome-icon" className={className}>
      {String(icon)}
    </span>
  ),
}));

describe("PageHeader", () => {
  it("renders with title", () => {
    render(<PageHeader title="Test Title" backHref="/home" />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders with back button", () => {
    render(
      <PageHeader
        title="Test Title"
        backHref="/home"
      />
    );

    const backButton = screen.getByRole("link");
    expect(backButton).toBeInTheDocument();
    expect(screen.getByTestId("fontawesome-icon")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<PageHeader title="Test Title" backHref="/home" className="custom-class" />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("custom-class");
  });

  it("renders with centerTitle when true", () => {
    render(<PageHeader title="Test Title" backHref="/home" centerTitle={true} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });
});
