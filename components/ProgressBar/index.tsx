import { memo } from 'react';
import { withStyles, Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Image from 'next/image';

interface IProgressBar {
  type: string;
  value: [number, number] | number;
}

function ProgressThumb(props: any) {
  return (
    <span {...props}>
      <Image
        src={props['data-index'] ? '/images/turtle.png' : '/images/rabbit.png'}
        width={50}
        height={50}
        alt="thumbnail"
      />
      ;
    </span>
  );
}

function ProgressBar({ type, value }: IProgressBar) {
  const RabbitTurtleSlider = withStyles({
    disabled: {
      '& .MuiSlider-thumb': {
        width: 40,
        height: 40,
        backgroundColor: 'transparent',
        // border: '2px solid #ffcdd2',
        marginTop: -20,
        marginLeft: -20,
        // color: '#ffcdd2',
        zIndex: 10,
      },
      // '& + .MuiSlider-thumb': {
      //   border: '2px solid #b2dfdb',
      //   color: '#b2dfdb',
      // },
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

  const getTimevalue = (val: number) => {
    if (value > 60) return 0;
    return Math.floor(((60 - val) / 60) * 100);
  };

  return (
    <RabbitTurtleSlider
      value={type === 'distance' ? value : getTimevalue(value as number)}
      disabled
      marks={type === 'distance' && distanceMark}
      ThumbComponent={ProgressThumb}
    />
  );
}

export default memo(ProgressBar);
