import React from "react";

type StepperProps = {
  id: string;
  name?: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  handleChange: (value: number) => void;
};

export default function Stepper({
  id,
  name,
  label,
  value,
  min,
  max,
  handleChange,
}: StepperProps): JSX.Element {
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = Number(e.target.value);

    if (
      (typeof min === "undefined" || newValue >= min) &&
      (typeof max === "undefined" || newValue <= max)
    ) {
      handleChange(newValue);
    }
  }

  function handleDecrementClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (value !== min) {
      handleChange(value - 1);
    }
  }

  function handleIncrementClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (value !== max) {
      handleChange(value + 1);
    }
  }

  return (
    <div>
      <label htmlFor={id} id={`${id}-label`}>
        {label}
      </label>
      <div>
        <button
          type="button"
          aria-label="Decrement"
          aria-describedby={`${id}-label`}
          onClick={handleDecrementClick}
          {...(value === min && { disabled: true })}
        >
          −
        </button>
        <input
          type="number"
          id={id}
          name={name ? name : id}
          value={value}
          {...(min && min <= value && { min })}
          {...(max && max >= value && { max })}
          onChange={handleInputChange}
          {...(min && max && max === min && { disabled: true })}
        />
        <button
          type="button"
          aria-label="Add"
          aria-describedby={`${id}-label`}
          onClick={handleIncrementClick}
          {...(value === max && { disabled: true })}
        >
          +
        </button>
        <div role="status" aria-live="polite" className="visually-hidden"></div>
      </div>
    </div>
  );
}
