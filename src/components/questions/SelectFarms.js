import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import'./SelectFarms.css';

function SelectFarms(props) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    props.setFarm(event.target.value);
  };

  const farm1 = "戦略系"
  const farm2 = "総合系"

  return (
    <div className='pulldown'>
      <FormControl>
      <InputLabel id="select-label">ファーム種別を選択</InputLabel>
      <Select
        labelId="select-label"
        id="select"
        value={selectedOption}
        label="Options"
        onChange={handleChange}
      >
        <MenuItem value={farm1}>{farm1}</MenuItem>
        <MenuItem value={farm2}>{farm2}</MenuItem>
      </Select>
      </FormControl>
    </div>
  );
};

export default SelectFarms


