import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import'./SelectQuestions.css';

function SelectQuestions(props) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    props.setQuestion(event.target.value);
  };

  const question1 = "1:腕時計問題"
  const question2 = "02:電車業界問題"

  return (
    <div className='pulldown'>
      <FormControl>
        <InputLabel id="select-label">問題を選択する</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={selectedOption}
          label="Options"
          onChange={handleChange}
        >
          <MenuItem value={question1}>{question1}</MenuItem>
          <MenuItem value={question2}>{question2}</MenuItem>
          {/* <MenuItem value="option3">03:携帯業界問題</MenuItem>
          <MenuItem value="option4">04:缶コーヒー問題</MenuItem> */}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectQuestions