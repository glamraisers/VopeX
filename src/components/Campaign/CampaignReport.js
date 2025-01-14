import React, { useEffect, useState } from 'react';
import { campaignService } from '../../services/campaignService';

const CampaignReport = ({ campaignId }) => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await campaignService.getCampaignReport(campaignId);
        setReport(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReport();
  }, [campaignId]);

  return (
    <div className="campaign-report">
      <h2>Campaign Report</h2>
      {error && <p className="error">{error}</p>}
      {report && (
        <div>
          <h3>{report.name}</h3>
          <p>Total Leads: {report.totalLeads}</p>
          <p>Converted Leads: {report.convertedLeads}</p>
          <p>Conversion Rate: {report.conversionRate}%</p>
        </div>
      )}
    </div>
  );
};

export default CampaignReport;
