import { memo } from 'react';
import { withStyles, Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import CircularProgress from '@material-ui/core/CircularProgress';

interface IProgressBar {
  type: string;
  value: [number, number] | number;
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

  const distanceMark = [{ value: 50, label: '약속장소' }];
  const distanceLabelFormat = (value: number) => {
    const fromto = Math.abs(value - 50);
    return `${100 - 2 * fromto}%`;
  };

  const getTimevalue = (val: number) => {
    if (value > 180) return 100;
    return Math.floor((val / 180) * 100);
  };

  console.log('value', value);

  return type === 'distance' ? (
    <div className="sticky bottom-0 bg-white z-10">
      <PrettoSlider
        value={value}
        disabled
        marks={distanceMark}
        valueLabelDisplay="on"
        valueLabelFormat={distanceLabelFormat}
      />
    </div>
  ) : (
    <div>
      {/* <Typography variant="subtitle2">약속 시간까지</Typography> */}
      {/* <CircularProgress
        value={getTimevalue(Number(value))}
        variant="determinate"
        size={50}
        thickness={5}
        color={Number(value) < 30 ? 'primary' : 'secondary'}
      /> */}
      <PrettoSlider value={value} disabled />
    </div>
  );
}

export default memo(ProgressBar);
