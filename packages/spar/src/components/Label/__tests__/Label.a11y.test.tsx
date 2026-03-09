import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Label } from '../Label';

expect.extend(toHaveNoViolations);

describe('Label Accessibility', () => {
  it('has no axe violations for explicit htmlFor/id association', async () => {
    const { container } = render(
      <div>
        <Label htmlFor='username'>Username</Label>
        <input id='username' type='text' />
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations for implicit association', async () => {
    const { container } = render(
      <Label>
        Email
        <input type='email' />
      </Label>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('supports aria-labelledby contract for polymorphic label', async () => {
    const { container } = render(
      <div>
        <Label as='span' id='email-label'>
          Email Address
        </Label>
        <input type='email' aria-labelledby='email-label' />
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  it('moves focus to associated control when label is clicked', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Label htmlFor='focus-target'>First Name</Label>
        <input id='focus-target' type='text' />
      </div>,
    );

    const input = screen.getByLabelText('First Name');
    await user.click(screen.getByText('First Name'));

    expect(input).toHaveFocus();
  });

  it('supports keyboard activation flow on associated checkbox', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Label htmlFor='terms'>Accept Terms</Label>
        <input id='terms' type='checkbox' />
      </div>,
    );

    const checkbox = screen.getByLabelText('Accept Terms');

    await user.tab();
    expect(checkbox).toHaveFocus();

    await user.keyboard('[Space]');
    expect(checkbox).toBeChecked();
  });
});
