import React from 'react';
import { withStyles, Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

interface IProgressBar {
  type: string;
  value: [number, number];
}

function ProgressBar({ type, value }: IProgressBar) {
  const PrettoSlider = withStyles({
    disabled: {
      '& .MuiSlider-thumb': {
        width: 24,
        height: 24,
        backgroundColor: '#fff',
        border: '2px solid #ffcdd2',
        marginTop: -8,
        marginLeft: -12,
        color: '#ffcdd2',
      },
      '& + .MuiSlider-thumb': {
        border: '2px solid #b2dfdb',
        color: '#b2dfdb',
      },
      '& .MuiSlider-rail': {
        height: 8,
        borderRadius: 4,
        background: 'linear-gradient(to right, #ffcdd2, #b2dfdb)',
      },
      '& .MuiSlider-track': {
        background: 'linear-gradient(to right, #ffcdd2, #b2dfdb)',
        height: 8,
        borderRadius: 4,
      },
      '& .MuiSlider-valueLabel': {
        marginLeft: 8,
      },
    },
  })(Slider);

  return (
    <div className="sticky bottom-0 bg-white">
      <PrettoSlider value={value} disabled valueLabelDisplay="on" />
    </div>
  );
}

export default ProgressBar;
