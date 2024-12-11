import React from 'react'

interface InputProps {
  id: string
  label?: string
  type: 'text' | 'number'
  value: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  min?: string
  required?: boolean
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  ...props
}) => {
  const inputStyle =
    'mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
  return (
    <div>
      <label htmlFor={id} className="block text-lg font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={inputStyle}
        aria-label={label}
        {...props}
      />
    </div>
  )
}

export default Input
