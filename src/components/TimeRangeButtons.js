import StyledRangeButtons from "@/styles/StyledRangeButtons";

const TimeRangeButtons = ({timeRange, setTimeRange}) => (
  <StyledRangeButtons>
    <li>
      <button 
      className={timeRange === 'short' ? 'active': ''} 
      onClick={() => setTimeRange('short')}>
        This Month
      </button>
    </li>
    <li>
      <button 
      className={timeRange === 'medium' ? 'active': ''} 
      onClick={() => setTimeRange('medium')}>
        Last 6 Months
      </button>
    </li>
    <li>
      <button 
      className={timeRange === 'long' ? 'active': ''} 
      onClick={() => setTimeRange('long')}>
        All Time
      </button>
    </li>
  </StyledRangeButtons>
);

export default TimeRangeButtons;