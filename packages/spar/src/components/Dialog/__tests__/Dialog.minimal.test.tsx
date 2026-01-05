import { render } from '@testing-library/react';
import { DialogRoot } from '../DialogRoot';
import { DialogTrigger } from '../DialogTrigger';

describe('Dialog Minimal Test', () => {
  it('should render DialogRoot without crashing', () => {
    render(
      <DialogRoot>
        <div>Simple child</div>
      </DialogRoot>,
    );
  });

  it('should render DialogRoot with DialogTrigger', () => {
    render(
      <DialogRoot>
        <DialogTrigger>Open Dialog</DialogTrigger>
      </DialogRoot>,
    );
  });
});
