import { useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import TimeSelect from './TimeSelect';
import { CloseOutline, ChevronBackOutline, ChevronForwardOutline } from 'react-ionicons';

interface ICalendarModal {
  reservedDate: string | Date;
  handleDateChange?: (date: string) => void;
  setIsCalendarOn: React.Dispatch<React.SetStateAction<boolean>>;
}

function Calendar({ reservedDate, handleDateChange, setIsCalendarOn }: ICalendarModal) {
  const [getDay, setDay] = useState(dayjs(reservedDate));
  const [clickedDate, setClickedDate] = useState(getDay);
  dayjs.extend(weekOfYear);

  const initialDate = getDay;
  const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const ampm = ['AM', 'PM'];

  let hoursArr = new Array();
  for (let i = 0; i <= 12; i++) {
    hoursArr.push(i);
  }

  let minuteArr = new Array();
  for (let i = 0; i <= 55; i++) {
    if (i % 5 === 0) minuteArr.push(i);
  }

  const firstWeek = initialDate.clone().startOf('month').week();
  const lastWeek =
    initialDate.clone().endOf('month').week() === 1
      ? 53
      : initialDate.clone().endOf('month').week();

  const handleMonth = type => {
    const prevMonth = initialDate.clone().subtract(1, 'month');
    const nextMonth = initialDate.clone().add(1, 'month');
    type === 'prev' ? setDay(prevMonth) : setDay(nextMonth);
  };

  const handleClickedDate = date => {
    let prev = Number(date.format('MMDD')) >= Number(dayjs().format('MMDD'));
    if (prev) setClickedDate(date);
  };

  const calendarArr = () => {
    let result = [];
    let week = firstWeek;
    let prev = Number(clickedDate.format('MMDD')) >= Number(dayjs().format('MMDD'));
    for (week; week <= lastWeek; week++) {
      result = result.concat(
        <tr key={week}>
          {Array(7)
            .fill(0)
            .map((data, index) => {
              let days = initialDate
                .clone()
                .startOf('year')
                .week(week)
                .startOf('week')
                .add(index, 'day');
              return (
                <Day
                  key={index}
                  onClick={() => handleClickedDate(days)}
                  clickedDate={clickedDate.format('YYYYMMDD') === days.format('YYYYMMDD') && prev}
                  prevDate={Number(dayjs().format('YYYYMMDD')) > Number(days.format('YYYYMMDD'))}
                  dayColor={
                    //오늘일 경우.
                    dayjs().format('YYYYMMDD') === days.format('YYYYMMDD')
                      ? '#ef9a9a'
                      : //이전 또는 다음달 표시
                      days.format('MM') !== initialDate.format('MM')
                      ? '#c6c4c4'
                      : 'black'
                  }
                >
                  <span>{days.format('D')}</span>
                </Day>
              );
            })}
        </tr>,
      );
    }
    return result;
  };

  const handleTimeSelect = (e: React.ChangeEvent<HTMLSelectElement>, type) => {
    let timeValue = e.currentTarget.value;
    const am = clickedDate.get('hour') - 12;
    const pm = clickedDate.get('hour') + 12;
    setClickedDate(clickedDate.set(type, Number(timeValue)));
    if (type === 'ampm') setClickedDate(clickedDate.set('hour', timeValue === 'PM' ? pm : am));
  };

  return (
    <CalendarWrapper>
      <CloseBtn onClick={() => setIsCalendarOn(false)}>
        <CloseOutline color={'#00000'} height="25px" width="25px" />
      </CloseBtn>
      <CalendarContent>
        <span className="clickedDate">{clickedDate.format('YYYY. MM. DD hh:mm A')}</span>
        <Header className="control">
          <PrevBtn
            prev={getDay.get('month') > dayjs().get('month')}
            onClick={() => getDay.get('month') > dayjs().get('month') && handleMonth('prev')}
          >
            <ChevronBackOutline color={'#FFFF'} />
          </PrevBtn>
          <span>{initialDate.format('YYYY년 MM월')}</span>
          <NextBtn onClick={() => handleMonth('next')}>
            <ChevronForwardOutline color={'#FFFF'} />
          </NextBtn>
        </Header>
        <table>
          <tbody>
            <DayOfWeek>
              {weeks.map((day, idx) => {
                return (
                  <td key={idx}>
                    <span>{day}</span>
                  </td>
                );
              })}
            </DayOfWeek>
            {calendarArr()}
          </tbody>
        </table>
      </CalendarContent>
      <TimeWrapper>
        <TimeTitle onClick={() => setClickedDate(clickedDate.set('hour', 6))}>TIME</TimeTitle>
        <Time>
          <TimeSelect
            handleTimeSelect={handleTimeSelect}
            options={hoursArr}
            type="hour"
            select={
              clickedDate.get('hour') > 12 ? clickedDate.get('hour') - 12 : clickedDate.get('hour')
            }
          />
          <span className="colon">:</span>
          <TimeSelect
            handleTimeSelect={handleTimeSelect}
            options={minuteArr}
            type="minute"
            select={clickedDate.get('minute')}
          />
          <TimeSelect
            handleTimeSelect={handleTimeSelect}
            options={ampm}
            type="ampm"
            select={clickedDate.format('A')}
          />
        </Time>
      </TimeWrapper>
      <SaveBtn onClick={() => handleDateChange(dayjs(clickedDate).format())}>선택 완료</SaveBtn>
    </CalendarWrapper>
  );
}

export default Calendar;

const CalendarWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 101;

  @media (min-width: 414px) {
    justify-content: center;
  }
`;

const CloseBtn = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;

  @media (min-width: 414px) {
    top: 20px;
    right: 25px;
  }
`;

const CalendarContent = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  height: 300px;

  .clickedDate {
    font-size: 16px;
    color: grey;
  }

  @media (min-width: 414px) {
    height: 38%;

    .clickedDate {
      font-size: 18px;
      color: grey;
    }
  }
`;

const Header = styled.div`
  display: flex;
  padding: 17px 10px;

  span {
    padding: 0 20px;
    font-size: 17px;
    font-weight: bold;
    color: grey;
  }

  @media (min-width: 414px) {
    padding: 30px 0;

    span {
      padding: 0 40px;
      font-size: 20px;
    }
  }
`;

const PrevBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  color: white;
  background-color: ${props => (props.prev ? '#80cbc4' : '#e0f2f1')};
`;

const NextBtn = styled(PrevBtn)`
  background-color: #80cbc4;
`;

const DayOfWeek = styled.tr`
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  color: #80cbc4;
`;

const Day = styled.td`
  padding: 6px;
  border-radius: 5px;
  color: ${props => (props.clickedDate ? 'white' : props.dayColor)};
  background-color: ${props => (props.clickedDate ? '#80cbc4' : 'white')};
  text-align: center;
  text-decoration: ${props => (props.prevDate ? 'line-through' : 'none')};
  cursor: pointer;

  @media (min-width: 414px) {
    padding: 10px;
    font-size: 16px;
  }
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (min-width: 414px) {
    flex-direction: column;
  }
`;

const TimeTitle = styled.p`
  margin-right: 6px;
  color: #80cbc4;
  font-size: 19px;
  font-weight: bold;

  @media (min-width: 414px) {
    margin-bottom: 10px;
    font-size: 21px;
  }
`;
const Time = styled.div`
  display: flex;
  align-items: center;

  select {
    margin: 5px;
    font-weight: bold;
    font-size: 16px;
    padding: 5px;
    background-color: #b2dfdb;
    border: none;
    color: white;
    border-radius: 5px;
  }

  .colon {
    font-size: 17px;
    font-weight: bold;
    color: grey;
    background-color: transparent;
  }

  @media (min-width: 414px) {
    select {
      margin: 9px;
      padding: 8px;
      font-size: 20px;
    }

    .colon {
      font-size: 20px;
    }
  }
`;
const SaveBtn = styled.div`
  margin-top: 40px;
  padding: 10px 90px;
  border-radius: 10px;
  font-weight: bold;
  background-color: #80cbc4;
  color: white;
  cursor: pointer;

  @media (min-width: 414px) {
    padding: 15px 110px;
    font-size: 17px;
  }
`;
