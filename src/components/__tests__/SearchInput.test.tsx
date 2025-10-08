import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from '../SearchInput';

describe('SearchInput', () => {
  const mockOnSearch = vi.fn();
  const mockOnClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default placeholder', () => {
    render(<SearchInput onSearch={mockOnSearch} onClear={mockOnClear} />);

    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(
      <SearchInput
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        placeholder="Custom placeholder"
      />
    );

    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('shows search icon when not loading', () => {
    render(<SearchInput onSearch={mockOnSearch} onClear={mockOnClear} />);

    const searchIcon = screen.getByTestId('search-icon');
    expect(searchIcon).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    render(<SearchInput onSearch={mockOnSearch} onClear={mockOnClear} loading={true} />);

    const loadingSpinner = screen.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('calls onSearch when user types', async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} onClear={mockOnClear} />);

    const input = screen.getByPlaceholderText('Search articles...');
    await user.type(input, 'test query');

    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('shows clear button when input has value', async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} onClear={mockOnClear} />);

    const input = screen.getByPlaceholderText('Search articles...');
    await user.type(input, 'test');

    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('does not show clear button when input is empty', () => {
    render(<SearchInput onSearch={mockOnSearch} onClear={mockOnClear} />);

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('clears input and calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} onClear={mockOnClear} />);

    const input = screen.getByPlaceholderText('Search articles...');
    await user.type(input, 'test');

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    expect(input).toHaveValue('');
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('clears input when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} onClear={mockOnClear} />);

    const input = screen.getByPlaceholderText('Search articles...');
    await user.type(input, 'test');

    expect(input).toHaveValue('test');

    await user.keyboard('{Escape}');

    expect(input).toHaveValue('');
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('focuses input after clearing', async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} onClear={mockOnClear} />);

    const input = screen.getByPlaceholderText('Search articles...');
    await user.type(input, 'test');

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    expect(input).toHaveFocus();
  });

  it('applies custom className', () => {
    render(
      <SearchInput
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        className="custom-class"
      />
    );

    const container = screen.getByTestId('search-input-container');
    expect(container).toHaveClass('search-input-container', 'custom-class');
  });

  it('handles rapid typing without calling onSearch for every keystroke', async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} onClear={mockOnClear} />);

    const input = screen.getByPlaceholderText('Search articles...');

    // Type quickly
    await user.type(input, 'rapid typing test');

    // onSearch should be called for each character change
    expect(mockOnSearch).toHaveBeenCalledWith('rapid typing test');
  });

  it('maintains input focus state correctly', async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} onClear={mockOnClear} />);

    const input = screen.getByPlaceholderText('Search articles...');

    await user.click(input);
    expect(input).toHaveFocus();

    await user.tab();
    expect(input).not.toHaveFocus();
  });
});