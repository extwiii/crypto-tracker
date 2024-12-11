import { render, screen, fireEvent } from '@testing-library/react'
import Input from './Input' // Assuming the component is in the same directory

describe('Input Component', () => {
  it('renders the input field with the given label and value', () => {
    const value = 'Test value'
    const label = 'Test Label'
    render(
      <Input
        id="test-input"
        label={label}
        type="text"
        value={value}
        onChange={() => {}}
      />
    )

    const inputElement = screen.getByLabelText(label)
    expect(inputElement).toBeInTheDocument()
    expect(inputElement).toHaveValue(value) // Check the value of the input
  })

  it('calls onChange when the input value changes', () => {
    const handleChange = jest.fn()
    const value = 'Initial value'
    const newValue = 'New value'

    render(
      <Input
        id="test-input"
        label="Test Label"
        type="text"
        value={value}
        onChange={handleChange}
      />
    )

    const inputElement = screen.getByLabelText('Test Label')

    fireEvent.change(inputElement, { target: { value: newValue } })

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should be readonly if the readOnly prop is passed', () => {
    const value = 'Test value'

    render(
      <Input
        id="test-input"
        label="Test Label"
        type="text"
        value={value}
        onChange={() => {}}
        readOnly={true}
      />
    )

    const inputElement = screen.getByLabelText('Test Label')

    // Verify the input is readonly
    expect(inputElement).toHaveAttribute('readonly')
  })

  it('should render an input field of type number', () => {
    const value = 10

    render(
      <Input
        id="test-input"
        label="Test Label"
        type="number"
        value={value}
        onChange={() => {}}
      />
    )

    const inputElement = screen.getByLabelText('Test Label')
    expect(inputElement).toHaveAttribute('type', 'number')
  })

  it('should render with the correct placeholder', () => {
    const placeholder = 'Enter value'

    render(
      <Input
        id="test-input"
        label="Test Label"
        type="text"
        value=""
        onChange={() => {}}
        placeholder={placeholder}
      />
    )

    const inputElement = screen.getByLabelText('Test Label')
    expect(inputElement).toHaveAttribute('placeholder', placeholder)
  })

  it('should be required if the required prop is passed', () => {
    render(
      <Input
        id="test-input"
        label="Test Label"
        type="text"
        value=""
        onChange={() => {}}
        required={true}
      />
    )

    const inputElement = screen.getByLabelText('Test Label')
    expect(inputElement).toBeRequired()
  })
})
