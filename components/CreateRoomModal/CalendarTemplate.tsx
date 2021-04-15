import styled from 'styled-components';

function CalendarTemplate({ children }: { children: React.ReactNode }) {
  return <CalendarWrapper>{children}</CalendarWrapper>;
}

export default CalendarTemplate;

const CalendarWrapper = styled.div`
  border-bottom: 1px solid grey;
  .react-datepicker {
    border: none;
    box-shadow: 2px 16px 53px -13px rgba(0, 0, 0, 0.52);
  }
  .react-datepicker__triangle {
    border-top: none;
  }
  .react-datepicker-ignore-onclickoutside {
    outline: none;
    &:focus {
      border-bottom: 2px solid #ffcdd2;
    }
  }
  .react-datepicker-wrapper {
    width: 100%;
    font-size: 15px;
    background-color: white;
    .react-datepicker__input-container {
      input {
        width: 100%;
      }
    }
  }
  .react-datepicker__header {
    border: 0;
  }
  .react-datepicker-popper {
    //모바일에서 아래 속성이 최적화.
    /* transform: translate3d(15px, 210px, 0px) !important; */
    z-index: 101;
  }
  .react-datepicker__time-container {
    width: 65px;
    .react-datepicker__time-box {
      width: 65px !important;
      .react-datepicker__time-list {
        width: 65px !important;
        li {
          padding: 5px;
        }
      }
    }
  }
`;
