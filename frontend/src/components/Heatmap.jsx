import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const Heatmap = ({ data = {} }) => {
  const heatmapData = useMemo(() => {
    const today = new Date();
    const days = [];
    
    // Calculate last 365 days
    for (let i = 365; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        count: data[dateStr] || 0,
        dayOfWeek: d.getDay(),
        month: d.toLocaleString('default', { month: 'short' }),
        dayOfMonth: d.getDate()
      });
    }
    return days;
  }, [data]);

  const getColor = (count) => {
    if (count === 0) return 'var(--b2)'; // Empty color
    if (count <= 2) return '#0e4429'; // Level 1
    if (count <= 5) return '#006d32'; // Level 2
    if (count <= 8) return '#26a641'; // Level 3
    return '#39d353'; // Level 4 (GitHub-like greens)
  };

  // Group by weeks (52+ columns)
  const weeks = useMemo(() => {
    const w = [];
    let currentWeek = [];
    
    heatmapData.forEach((day, index) => {
      currentWeek.push(day);
      if (day.dayOfWeek === 6 || index === heatmapData.length - 1) {
        w.push(currentWeek);
        currentWeek = [];
      }
    });
    return w;
  }, [heatmapData]);

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = '';
    
    weeks.forEach((week, i) => {
      const month = week[0].month;
      if (month !== lastMonth) {
        labels.push({ label: month, index: i });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <h3 className="heatmap-title">Activity Consistency</h3>
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="legend-box" style={{ background: 'var(--b2)' }} />
          <div className="legend-box" style={{ background: '#0e4429' }} />
          <div className="legend-box" style={{ background: '#006d32' }} />
          <div className="legend-box" style={{ background: '#26a641' }} />
          <div className="legend-box" style={{ background: '#39d353' }} />
          <span>More</span>
        </div>
      </div>

      <div className="heatmap-scroll">
        <div className="heatmap-grid-wrapper">
          <div className="heatmap-month-row">
            {monthLabels.map((m, i) => (
              <div key={i} className="month-label" style={{ gridColumnStart: m.index + 1 }}>
                {m.label}
              </div>
            ))}
          </div>
          
          <div className="heatmap-grid">
            <div className="day-labels">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="heatmap-column">
                {/* Pad first week if necessary */}
                {weekIdx === 0 && Array.from({ length: 7 - week.length }).map((_, i) => (
                  <div key={`pad-${i}`} className="heatmap-day-placeholder" />
                ))}
                
                {week.map((day) => (
                  <motion.div
                    key={day.date}
                    className="heatmap-day"
                    style={{ background: getColor(day.count) }}
                    whileHover={{ scale: 1.3, zIndex: 10 }}
                    title={`${day.date}: ${day.count} accepted`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .heatmap-container {
          background: var(--bg2);
          border: 1px solid var(--b1);
          border-radius: 12px;
          padding: 20px;
          margin-top: 24px;
        }

        .heatmap-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .heatmap-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--t1);
        }

        .heatmap-legend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--t3);
        }

        .legend-box {
          width: 10px;
          height: 10px;
          border-radius: 2px;
        }

        .heatmap-scroll {
          overflow-x: auto;
          padding-bottom: 6px;
        }

        /* Webkit scrollbar styling */
        .heatmap-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .heatmap-scroll::-webkit-scrollbar-thumb {
          background: var(--b1);
          border-radius: 6px;
        }

        .heatmap-grid-wrapper {
          display: inline-grid;
          grid-template-rows: 20px auto;
          gap: 4px;
          min-width: 100%;
        }

        .heatmap-month-row {
          display: grid;
          grid-template-columns: repeat(53, 14px);
          gap: 3px;
          padding-left: 30px;
        }

        .month-label {
          font-size: 11px;
          color: var(--t3);
        }

        .heatmap-grid {
          display: flex;
          gap: 3px;
        }

        .day-labels {
          display: grid;
          grid-template-rows: repeat(7, 10px);
          gap: 3px;
          font-size: 9px;
          color: var(--t3);
          width: 26px;
          margin-top: 3px;
        }

        .day-labels span:nth-child(1) { grid-row: 2; }
        .day-labels span:nth-child(2) { grid-row: 4; }
        .day-labels span:nth-child(3) { grid-row: 6; }

        .heatmap-column {
          display: grid;
          grid-template-rows: repeat(7, 10px);
          gap: 3px;
        }

        .heatmap-day {
          width: 10px;
          height: 10px;
          border-radius: 2px;
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .heatmap-day-placeholder {
          width: 10px;
          height: 10px;
        }
      `}</style>
    </div>
  );
};

export default Heatmap;
