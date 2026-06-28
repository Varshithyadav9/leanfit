import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ProgressCharts({ history }) {
  const chartData = history
    .slice()
    .reverse()
    .map((day) => {
      const calories = day.meals.reduce(
        (sum, meal) => sum + Number(meal.calories || 0),
        0
      );

      return {
        date: day.date.slice(5),
        calories,
        water: day.water || 0,
        weight: day.weight || 0,
      };
    });

  if (chartData.length === 0) {
    return (
      <section className="dashboard-section">
        <h3>Progress Charts</h3>
        <div className="empty-state">No chart data available yet.</div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="section-head">
        <div>
          <h3>Progress Charts</h3>
          <p>Your last 7 days of calories, water and weight.</p>
        </div>
      </div>

      <div className="chart-box">
        <h4>Calories</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calories" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <h4>Water Intake</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="water" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <h4>Weight</h4>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#111827"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ProgressCharts;