import React from 'react';
import { withStyles, Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

interface IProgressBar {
  type: string;
}

function ProgressBar({ type }: IProgressBar) {
  const PrettoSlider = withStyles({
    // root: {
    //   // color: 'primary',
    //   // height: 8,
    // },
    disabled: {
      // color: '#ffcdd2',
      '& .MuiSlider-thumb': {
        width: 24,
        height: 24,
        backgroundColor: '#fff',
        border: '2px solid #ffcdd2',
        marginTop: -8,
        marginLeft: -12,
      },
      '& + .MuiSlider-thumb': {
        border: '2px solid #b2dfdb',
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
    },
  })(Slider);

  return (
    <div>
      <PrettoSlider defaultValue={[20, 60]} disabled />
    </div>
  );
}

export default ProgressBar;
