import { render } from '@testing-library/react';
import { Dialog } from '../Dialog';
import { DialogTrigger } from '../DialogTrigger';

describe('Dialog Minimal Test', () => {
  it('should render Dialog without crashing', () => {
    render(
      <Dialog>
        <div>Simple child</div>
      </Dialog>,
    );
  });

  it('should render Dialog with DialogTrigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
      </Dialog>,
    );
  });
});
