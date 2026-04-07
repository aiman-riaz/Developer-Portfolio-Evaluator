import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const LABELS = ['Activity', 'Code Quality', 'Diversity', 'Community', 'Hiring Ready'];

function makeDataset(scores, label, color) {
  return {
    label,
    data: [
      scores.activity,
      scores.codeQuality,
      scores.diversity,
      scores.community,
      scores.hiringReady,
    ],
    backgroundColor: color + '30',
    borderColor: color,
    borderWidth: 2,
    pointBackgroundColor: color,
    pointRadius: 4,
  };
}

export default function RadarChart({ scores, compareScores, username, compareUsername }) {
  const datasets = [makeDataset(scores, username, '#7c6af7')];
  if (compareScores) {
    datasets.push(makeDataset(compareScores, compareUsername, '#e85d8a'));
  }

  const data = { labels: LABELS, datasets };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          color: '#6b6b80',
          backdropColor: 'transparent',
          font: { family: 'Space Mono', size: 10 },
        },
        grid: { color: '#e2e2ea' },
        angleLines: { color: '#e2e2ea' },
        pointLabels: {
          color: '#1a1a24',
          font: { family: 'Syne', size: 12, weight: '700' },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#1a1a24',
          font: { family: 'Syne', size: 12 },
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e2ea',
        borderWidth: 1,
        titleColor: '#1a1a24',
        bodyColor: '#6b6b80',
        titleFont: { family: 'Syne', weight: '700' },
        bodyFont: { family: 'Space Mono' },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <div className="card fade-up" style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 700 }}>
        Score Breakdown
      </h3>
      <Radar data={data} options={options} />
    </div>
  );
}
