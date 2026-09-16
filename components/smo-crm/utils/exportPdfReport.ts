import { jsPDF } from 'jspdf';
import { Department, WorkspaceSpace } from '../types';

export interface PdfReportData {
  templateName?: string;
  reportTitle?: string;
  includedWidgets?: string[];
  isAutomatedSchedule?: boolean;
  scheduleFrequency?: string;
  timeHorizonLabel: string;
  currentSpace: WorkspaceSpace;
  totalPipelineValue: number;
  closedCommittedValue: number;
  winRatePct: number;
  avgLeadScore: number;
  pipelineTrendPct: number;
  closedTrendPct: number;
  winRateTrendPct: number;
  scoreTrendPct: number;
  transitSpeedDays: number;
  totalWeeklyActions: number;
  weeklyBuckets: Array<{
    weekLabel: string;
    dateRange: string;
    capitalMoved: number;
    dealsMoved: number;
    capitalWon: number;
    activeVelocityScore: number;
  }>;
  departmentMetrics: Array<{
    name: string;
    leadName: string;
    leadRole: string;
    weeklyActionsCount: number;
    primaryMetricLabel: string;
    primaryMetricValue: string | number;
    velocityScore: number;
    velocityTrendPct: number;
    activeInitiative: string;
  }>;
  stageData: Array<{
    label: string;
    count: number;
    value: number;
    pct: number;
  }>;
}

export function generateAnalyticsPdf(data: PdfReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val.toLocaleString()}`;
  };

  // --- Top Banner Header ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 25, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.text(
    data.templateName
      ? `SANS MERCANTILE — ${data.templateName.toUpperCase()}`
      : 'SANS MERCANTILE HOLDINGS — EXECUTIVE CRM',
    margin + 6,
    y + 7.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // slate-300
  const subtext = data.isAutomatedSchedule
    ? `Automated ${data.scheduleFrequency || 'Weekly'} Scheduled Report  |  Deal Velocity & Portfolio Telemetry`
    : 'Sovereign Command Hub | Deal Velocity & Department Activity Telemetry';
  doc.text(subtext, margin + 6, y + 13.5);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // slate-400
  const exportDateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(
    `Report Period: ${data.timeHorizonLabel.toUpperCase()}  |  Scope: ${data.currentSpace}  |  Generated: ${exportDateStr}  |  Status: Verified`,
    margin + 6,
    y + 19
  );

  y += 29;

  // --- Section 1: Executive KPI Performance Summary ---
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('1. Executive KPI Performance & Velocity Indicators', margin, y);
  y += 4;

  // 4 KPI Cards in a row
  const cardWidth = (contentWidth - 6) / 4;
  const cardHeight = 18;

  const kpis = [
    {
      label: 'ACTIVE PIPELINE',
      value: formatCurrency(data.totalPipelineValue),
      trend: `${data.pipelineTrendPct >= 0 ? '+' : ''}${data.pipelineTrendPct}% vs prior`,
      trendPositive: data.pipelineTrendPct >= 0,
    },
    {
      label: 'CLOSED COMMITTED',
      value: formatCurrency(data.closedCommittedValue),
      trend: `${data.closedTrendPct >= 0 ? '+' : ''}${data.closedTrendPct}% vs prior`,
      trendPositive: data.closedTrendPct >= 0,
    },
    {
      label: 'AVG LEAD SCORE',
      value: `${data.avgLeadScore} / 100`,
      trend: `${data.scoreTrendPct >= 0 ? '+' : ''}${data.scoreTrendPct}% score`,
      trendPositive: data.scoreTrendPct >= 0,
    },
    {
      label: 'STAGE TRANSIT SPEED',
      value: `${data.transitSpeedDays} Days/Stage`,
      trend: '18% faster',
      trendPositive: true,
    },
  ];

  kpis.forEach((kpi, idx) => {
    const x = margin + idx * (cardWidth + 2);
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(x, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(kpi.label, x + 3, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(kpi.value, x + 3, y + 10.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    if (kpi.trendPositive) {
      doc.setTextColor(16, 185, 129); // emerald-500
    } else {
      doc.setTextColor(225, 29, 72); // rose-600
    }
    doc.text(kpi.trend, x + 3, y + 15);
  });

  y += cardHeight + 7;

  // --- Section 2: Weekly Deal Velocity Trailing Pacing Table ---
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('2. Trailing Sprint Deal Velocity Pacing (Trailing 4 Sprints)', margin, y);
  y += 4;

  // Table header
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105); // slate-600

  doc.text('SPRINT WEEK', margin + 3, y + 4.2);
  doc.text('DATE RANGE', margin + 32, y + 4.2);
  doc.text('CAPITAL ADVANCED', margin + 82, y + 4.2);
  doc.text('DEALS MOVED', margin + 120, y + 4.2);
  doc.text('CLOSED WON', margin + 144, y + 4.2);
  doc.text('VELOCITY SCORE', margin + 165, y + 4.2);
  y += 6;

  // Table rows
  data.weeklyBuckets.forEach((bucket, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);

    doc.setFont('helvetica', 'bold');
    doc.text(bucket.weekLabel, margin + 3, y + 3.8);
    doc.setFont('helvetica', 'normal');
    doc.text(bucket.dateRange, margin + 32, y + 3.8);
    doc.text(formatCurrency(bucket.capitalMoved), margin + 82, y + 3.8);
    doc.text(`${bucket.dealsMoved} Deals`, margin + 120, y + 3.8);
    doc.text(formatCurrency(bucket.capitalWon), margin + 144, y + 3.8);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229); // indigo-600
    doc.text(`${bucket.activeVelocityScore} / 100`, margin + 165, y + 3.8);

    y += 5.5;
  });

  y += 5;

  // --- Section 3: Department Activity & Velocity Metrics ---
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(`3. Cross-Department Velocity & Activity Metrics (${data.totalWeeklyActions} Total Actions)`, margin, y);
  y += 4;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);

  doc.text('DEPARTMENT & LEAD', margin + 3, y + 4.2);
  doc.text('KEY DELIVERABLE / TELEMETRY', margin + 65, y + 4.2);
  doc.text('ACTIONS', margin + 125, y + 4.2);
  doc.text('VELOCITY', margin + 145, y + 4.2);
  doc.text('TREND', margin + 165, y + 4.2);
  y += 6;

  data.departmentMetrics.forEach((dept, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 6, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(`${dept.name} (${dept.leadName})`, margin + 3, y + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`${dept.primaryMetricLabel}: ${dept.primaryMetricValue}`, margin + 65, y + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(`${dept.weeklyActionsCount} actions`, margin + 125, y + 4.2);

    doc.setFont('helvetica', 'bold');
    doc.text(`${dept.velocityScore}/100`, margin + 145, y + 4.2);

    doc.setTextColor(16, 185, 129);
    doc.text(`+${dept.velocityTrendPct}%`, margin + 165, y + 4.2);

    y += 6;
  });

  y += 5;

  // --- Section 4: Pipeline Stage Distribution ---
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('4. Pipeline Stage Allocation & Concentration', margin, y);
  y += 4;

  // Stage table
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('STAGE NAME', margin + 3, y + 3.8);
  doc.text('DEAL VOLUME', margin + 70, y + 3.8);
  doc.text('CAPITAL VALUE', margin + 115, y + 3.8);
  doc.text('PIPELINE SHARE (%)', margin + 155, y + 3.8);
  y += 5.5;

  data.stageData.forEach((stg, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(stg.label, margin + 3, y + 3.5);
    doc.text(`${stg.count} deals`, margin + 70, y + 3.5);
    doc.text(formatCurrency(stg.value), margin + 115, y + 3.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${stg.pct}%`, margin + 155, y + 3.5);
    y += 5;
  });

  // --- Bottom Footer & Governance Note ---
  const footerY = 282;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('CONFIDENTIAL & PROPRIETARY — SANS MERCANTILE HOLDINGS SOVEREIGN RECORD', margin, footerY);
  doc.text('Page 1 of 1', pageWidth - margin - 14, footerY);

  // Trigger download
  const safeFilename = `SMO-Executive-KPI-Report-${data.timeHorizonLabel.replace(/\s+/g, '-').toLowerCase()}.pdf`;
  doc.save(safeFilename);
}
