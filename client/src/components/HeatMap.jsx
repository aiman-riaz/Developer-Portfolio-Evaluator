import './HeatMap.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function buildWeeks(heatmapData) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  const cursor = new Date(start);

  while (cursor <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const isFuture = cursor > today;
      const iso = cursor.toISOString().split('T')[0];
      week.push({
        date:  iso,
        count: isFuture ? 0 : (heatmapData[iso] || 0),
        empty: isFuture,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

function getColor(count, empty) {
  if (empty)       return 'transparent';
  if (count === 0) return '#ebedf0';
  if (count <= 2)  return '#9be9a8';
  if (count <= 5)  return '#40c463';
  if (count <= 9)  return '#30a14e';
  return '#216e39';
}

export default function HeatMap({ heatmapData = {} }) {
  const safeData = heatmapData || {};
  const weeks = buildWeeks(safeData);

  const totalContributions = Object.values(safeData).reduce((a, b) => a + b, 0);

  const monthLabels = weeks.map((week, i) => {
    if (week[0].empty) return '';
    const month = new Date(week[0].date).getMonth();
    const prevMonth = i > 0 && !weeks[i - 1][0].empty
      ? new Date(weeks[i - 1][0].date).getMonth()
      : -1;
    return month !== prevMonth ? MONTHS[month] : '';
  });

  return (
    <div className="card heatmap-card fade-up">
      <div className="heatmap-header">
        <h3>Contribution Activity</h3>
        <span className="badge">{totalContributions} contributions tracked</span>
      </div>

      <div className="heatmap-scroll">
        <div className="heatmap-inner">
          <div className="heatmap-month-row">
            <div className="heatmap-day-spacer" />
            {weeks.map((_, i) => (
              <div key={i} className="heatmap-month-cell">
                {monthLabels[i] || ''}
              </div>
            ))}
          </div>

          {[0,1,2,3,4,5,6].map((dayIndex) => (
            <div key={dayIndex} className="heatmap-row">
              <div className="heatmap-day-label">
                {dayIndex === 1 ? 'Mon' : dayIndex === 3 ? 'Wed' : dayIndex === 5 ? 'Fri' : ''}
              </div>
              {weeks.map((week, wi) => {
                const cell = week[dayIndex];
                return (
                  <div
                    key={wi}
                    className="heatmap-cell"
                    style={{ background: getColor(cell.count, cell.empty) }}
                    title={!cell.empty ? `${cell.date}: ${cell.count} contribution${cell.count !== 1 ? 's' : ''}` : ''}
                  />
                );
              })}
            </div>
          ))}

        </div>
      </div>

      <div className="heatmap-legend">
        <span className="legend-text">Less</span>
        {[0, 2, 5, 9, 12].map((v) => (
          <div key={v} className="heatmap-cell" style={{ background: getColor(v, false) }} />
        ))}
        <span className="legend-text">More</span>
      </div>
    </div>
  );
}