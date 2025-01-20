import { render } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

export function setup(jsx) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

export function mockFetch(data) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    })
  );
}