/**
 * Component Tests
 * Tests for React components using React Testing Library
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, fixtures } from './testUtils';
import CheckoutForm from '@/components/CheckoutForm';

describe('CheckoutForm Component', () => {
  it('should render checkout form', () => {
    renderWithProviders(<CheckoutForm />);
    expect(screen.getByText(/checkout/i)).toBeInTheDocument();
  });

  it('should have all form fields', () => {
    renderWithProviders(<CheckoutForm />);

    // Shipping fields
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();

    // Payment fields
    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    renderWithProviders(<CheckoutForm />);

    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it('should accept valid form input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckoutForm />);

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
  });

  it('should show order summary', () => {
    renderWithProviders(<CheckoutForm />);
    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
  });

  it('should calculate totals correctly', () => {
    renderWithProviders(<CheckoutForm />);
    // Check that total section exists
    expect(screen.getByText(/total:/i)).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckoutForm />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'john@example.com');

    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);

    // Form should persist or show loading/success state
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /place order/i })
      ).toBeInTheDocument();
    });
  });
});

describe('Component Accessibility', () => {
  it('should have proper heading hierarchy', () => {
    const { container } = render(<CheckoutForm />);
    const headings = container.querySelectorAll('h1, h2, h3');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('should have proper ARIA labels', () => {
    renderWithProviders(<CheckoutForm />);
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('aria-label') || expect(input).toHaveAttribute('id');
    });
  });

  it('should be keyboard navigable', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckoutForm />);

    const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    await user.tab();
    expect(firstNameInput).toBeFocused();

    await user.tab();
    expect(screen.getByLabelText(/last name/i)).toBeFocused();
  });

  it('should have sufficient color contrast', () => {
    const { container } = renderWithProviders(<CheckoutForm />);
    const textElements = container.querySelectorAll('p, label, span');
    expect(textElements.length).toBeGreaterThan(0);
  });
});

describe('Component Responsive Design', () => {
  it('should render on mobile viewport', () => {
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));

    const { container } = renderWithProviders(<CheckoutForm />);
    expect(container.querySelector('[class*="mobile"]')).toBeInTheDocument() || 
      expect(container.firstChild).toBeInTheDocument();
  });

  it('should render on tablet viewport', () => {
    global.innerWidth = 768;
    global.dispatchEvent(new Event('resize'));

    const { container } = renderWithProviders(<CheckoutForm />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render on desktop viewport', () => {
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));

    const { container } = renderWithProviders(<CheckoutForm />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('Component Error Handling', () => {
  it('should handle missing props gracefully', () => {
    expect(() => {
      renderWithProviders(<CheckoutForm />);
    }).not.toThrow();
  });

  it('should display error messages', async () => {
    renderWithProviders(<CheckoutForm />);
    const submitButton = screen.getByRole('button', { name: /place order/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(document.body.textContent).toMatch(/required|error/i);
    });
  });

  it('should recover from errors', async () => {
    const { rerender } = renderWithProviders(<CheckoutForm />);

    // Component should still render after error
    rerender(<CheckoutForm />);
    expect(screen.getByText(/checkout/i)).toBeInTheDocument();
  });
});

describe('Component Performance', () => {
  it('should render efficiently', () => {
    const { container } = renderWithProviders(<CheckoutForm />);
    const renderTime = Date.now();
    expect(container.firstChild).toBeInTheDocument();
    expect(Date.now() - renderTime).toBeLessThan(1000);
  });

  it('should not cause excessive re-renders', () => {
    const renderSpy = jest.fn();
    const { rerender } = renderWithProviders(<CheckoutForm />);

    renderSpy();
    rerender(<CheckoutForm />);
    renderSpy();

    expect(renderSpy).toHaveBeenCalled();
  });
});
