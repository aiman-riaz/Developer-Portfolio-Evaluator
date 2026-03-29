import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const COLORS = ['#7c6af7','#3ecfcf','#e85d8a','#f0a94e','#2dd4a0','#a594ff','#60d0e0','#ff8fa3'];

export default function LanguageChart({ languages = [] }) {
  if (!languages.length) return null;

  const data = {
    labels: languages.map((l) => l.name),
    datasets: [
      {
        label: 'Usage %',
        data: languages.map((l) => l.percent),
        backgroundColor: languages.map((_, i) => COLORS[i % COLORS.length]),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a24',
        borderColor: '#2a2a3a',
        borderWidth: 1,
        titleColor: '#e8e8f0',
        bodyColor: '#6b6b80',
        titleFont: { family: 'Syne', weight: '700' },
        bodyFont: { family: 'Space Mono' },
        callbacks: { label: (ctx) => ` ${ctx.raw}%` },
      },
    },
    scales: {
      x: {
        grid: { color: '#2a2a3a' },
        ticks: { color: '#6b6b80', font: { family: 'Space Mono', size: 11 }, callback: (v) => v + '%' },
        max: 100,
      },
      y: {
        grid: { display: false },
        ticks: { color: '#e8e8f0', font: { family: 'Space Mono', size: 12 } },
      },
    },
  };

  return (
    <div className="card fade-up" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>
        Language Distribution
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
}
