import { describe, expect, it, vi } from 'vitest';

import setFocusToControl from './setFocusToControl';

describe('setFocusToControl', () => {
  it('scrolls and focuses the matching element', () => {
    document.body.innerHTML = '<button id="target">Focus me</button>';

    const element = document.getElementById('target') as HTMLElement & {
      focus: ReturnType<typeof vi.fn>;
      scrollIntoView: ReturnType<typeof vi.fn>;
    };
    element.focus = vi.fn();
    element.scrollIntoView = vi.fn();

    setFocusToControl('target');

    expect(element.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest',
    });
    expect(element.focus).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the id is missing or empty', () => {
    expect(() => setFocusToControl('missing')).not.toThrow();
    expect(() => setFocusToControl('')).not.toThrow();
  });
});
