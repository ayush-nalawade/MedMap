import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryStatsCard = ({ mappedDoctors }) => {
  const totalDoctors = mappedDoctors.length;
  const totalCoverage = mappedDoctors.reduce((sum, mapping) => sum + mapping.coverMoney, 0);
  const averageCoverage = totalDoctors > 0 ? totalCoverage / totalDoctors : 0;

  const stats = [
    {
      label: 'Mapped Doctors',
      value: totalDoctors,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Total Coverage',
      value: `$${totalCoverage.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Average Coverage',
      value: `$${averageCoverage.toLocaleString()}`,
      icon: 'TrendingUp',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 card-shadow">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Icon name="BarChart3" size={20} />
        Summary Statistics
      </h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <Icon name={stat.icon} size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-sm text-text-secondary">{stat.label}</p>
              <p className="text-lg font-semibold text-text-primary">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Last Updated</span>
          <span className="text-text-primary">
            {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryStatsCard;