import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './SelectFeedback.css';

function SelectFeedback({ onChange }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    onChange(event); // 親コンポーネントに選択された値を通知するために、onChangeプロップスを呼び出す
  };

  const select1 = "フィードバックが欲しい！（2,200円/税込)"
  const select2 = "解答例だけ欲しい！（1,100円/税込)"
  const select3 = "録音データだけ欲しい！（無料)"

  return (
    <div className='pulldown'>
      <FormControl>
      <InputLabel id="select-label">選択してください</InputLabel>
      <Select
        labelId="select-label"
        id="select"
        value={selectedOption}
        label="Options"
        onChange={handleChange}
      >
        <MenuItem value={select1}>{select1}</MenuItem>
        <MenuItem value={select2}>{select2}</MenuItem>
        <MenuItem value={select3}>{select3}</MenuItem>
      </Select>
      </FormControl>
    </div>
  );
};

export default SelectFeedback
