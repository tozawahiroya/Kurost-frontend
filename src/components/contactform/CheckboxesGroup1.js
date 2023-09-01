import React , { useState } from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';



function CheckboxesGroup1({ selectedItems }) {
  const [state, setState] = useState({
    one: false,
    two: false,
    three: false,
    four: false,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { one, two, three , four } = state;
  const error = [ one, two, three , four ].filter((v) => v).length !== 1;

  return (
    <Box>
      <div className='questionnaire-1'>
        <p>サービスの利用目的は何ですか？　＊必須＊　</p>
      </div>
 
      <FormControl
        required
        error={error}
        component="fieldset"
        variant="standard"
      >
        <FormLabel component="legend">１つ選ぶ</FormLabel>
        <FormGroup style={{ textAlign: 'left' }}>
          <FormControlLabel
            control={
              <Checkbox checked={one} onChange={handleChange} name="one" />
            }
            label="新卒面接対策"
          />
          <FormControlLabel
            control={
              <Checkbox checked={two} onChange={handleChange} name="two" />
            }
            label="中途面接対策（未経験）"
          />
          <FormControlLabel
            control={
              <Checkbox checked={three} onChange={handleChange} name="three" />
            }
            label="中途面接対策（経験）"
          />
          <FormControlLabel
            control={
              <Checkbox checked={four} onChange={handleChange} name="four" />
            }
            label="その他"
          />
        </FormGroup>
        {/*<FormHelperText>１つ以上選んでいます</FormHelperText>*/}
      </FormControl>
    </Box>
  );
}

export default CheckboxesGroup1;