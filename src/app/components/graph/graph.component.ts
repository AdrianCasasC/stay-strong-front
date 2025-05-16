import { AfterViewInit, Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss',
})
export class GraphComponent implements OnInit {
  /* Injections */
  private readonly _calendarService = inject(CalendarService);

  /* Signals */
  calendarWeights = this._calendarService.calendarWeights;

  /* ViewChild */
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  weightData = [
    { date: '2025/04/01', weight: 78.2 },
    { date: '2025/04/02', weight: 77.8 },
    { date: '2025/04/03', weight: 77.5 },
    // more data...
  ];

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [], // Days of the month
    datasets: [
      {
        data: [], // Income data
        label: 'Peso Corporal',
        fill: true, // Enable area fill
        borderColor: 'rgba(0, 136, 180, 1)', // Solid green line
        backgroundColor: '', // Green with 50% opacity
        tension: 0.4, // Smooth curve
        pointRadius: 5,
        pointHoverRadius: 7,
        spanGaps: true, // Ensures the line connects across missing data points
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Fecha' },
      },
      y: {
        title: { display: true, text: 'Peso (kg)' },
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  public lineChartLegend = true;

  private initGraph(): void {
    this.lineChartData.labels = this.calendarWeights().map((d) => d.date);
    this.lineChartData.datasets[0].data = this.calendarWeights().map(
      (d) => d.weight
    );
    const chartRef = this.chart?.chart;
    if (chartRef) {
      const ctx = chartRef.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, chartRef.height);
      gradient.addColorStop(0, 'rgba(0, 213, 155, 0.5)'); // Top
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');   // Bottom

      const dataset = this.lineChartData.datasets[0];
      dataset.backgroundColor = gradient;
    }
    this.chart?.update();
  }

  constructor() {
    effect(() => this.initGraph());
  }

  ngOnInit(): void {
    this._calendarService.getCalendarWeights();
  }
}
