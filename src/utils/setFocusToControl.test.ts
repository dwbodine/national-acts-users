import { describe, expect, it, vi } from 'vitest';

import setFocusToControl from './setFocusToControl';

describe('setFocusToControl', () => {
  it('scrolls and focuses the matching element', () => {
    document.body.innerHTML = '<button id="target">Focus me</button>';

    const element = document.getElementById('target') as HTMLElement;
    const focusMock = vi.fn<(options?: FocusOptions) => void>();
    const scrollIntoViewMock = vi.fn<(arg?: boolean | ScrollIntoViewOptions) => void>();
    element.focus = focusMock;
    element.scrollIntoView = scrollIntoViewMock;

    setFocusToControl('target');

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest',
    });
    expect(focusMock).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the id is missing or empty', () => {
    expect(() => setFocusToControl('missing')).not.toThrow();
    expect(() => setFocusToControl('')).not.toThrow();
  });
});
