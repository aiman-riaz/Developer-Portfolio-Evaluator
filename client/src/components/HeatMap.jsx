import './HeatMap.css';
function buildGrid(heatmapData) {
  const today = new Date();
  const weeks = [];
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());

  let current = new Date(start);
  let week = [];

  while (current <= today) {
    const key = current.toISOString().split('T')[0];
    const count = heatmapData[key] || 0;
    week.push({ date: key, count });

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    current.setDate(current.getDate() + 1);
  }

  if (week.length) weeks.push(week);
  return weeks;
}

function cellColor(count) {
  if (count === 0) return '#1a1a24';
  if (count <= 2) return '#3d2d7a';
  if (count <= 5) return '#6a4fcf';
  if (count <= 10) return '#7c6af7';
  return '#a594ff';
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function HeatMap({ heatmapData = {} }) {
  const weeks = buildGrid(heatmapData);
  const totalCommits = Object.values(heatmapData).reduce((a, b) => a + b, 0);
  const monthLabels = [];
  weeks.forEach((week, i) => {
    const month = new Date(week[0].date).getMonth();
    const prev  = i > 0 ? new Date(weeks[i - 1][0].date).getMonth() : -1;
    if (month !== prev) {
      monthLabels.push({ index: i, label: MONTHS[month] });
    }
  });

  return (
    <div className="card heatmap-card fade-up">
      <div className="heatmap-header">
        <h3>Contribution Activity</h3>
        <span className="badge">{totalCommits} commits in last year</span>
      </div>

      <div className="heatmap-scroll">
        <div className="heatmap-months" style={{ gridTemplateColumns: `repeat(${weeks.length}, 14px)` }}>
          {weeks.map((_, i) => {
            const ml = monthLabels.find((m) => m.index === i);
            return <div key={i} className="month-label">{ml ? ml.label : ''}</div>;
          })}
        </div>
        <div className="heatmap-grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 14px)` }}>
          {weeks.map((week, wi) =>
            week.map((day, di) => (
              <div
                key={`${wi}-${di}`}
                className="heatmap-cell"
                style={{ background: cellColor(day.count) }}
                title={`${day.date}: ${day.count} commits`}
              />
            ))
          )}
        </div>
      </div>

      <div className="heatmap-legend">
        <span className="legend-label">Less</span>
        {[0, 2, 5, 10, 15].map((v) => (
          <div key={v} className="heatmap-cell" style={{ background: cellColor(v) }} />
        ))}
        <span className="legend-label">More</span>
      </div>
    </div>
  );
}
