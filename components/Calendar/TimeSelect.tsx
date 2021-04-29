interface ITimeSelectOption {
  options: string[] | number[];
  type: string;
  select: string | number;
  handleTimeSelect: (e: React.ChangeEvent<HTMLSelectElement>, string) => void;
}

function TimeSelect({ type, options, select, handleTimeSelect }: ITimeSelectOption) {
  return (
    <select onChange={e => handleTimeSelect(e, type)}>
      {options.map((option, idx) => {
        return (
          <option key={idx} value={option} selected={option === select}>
            {option < 10 ? `0${option}` : option}
          </option>
        );
      })}
    </select>
  );
}

export default TimeSelect;
