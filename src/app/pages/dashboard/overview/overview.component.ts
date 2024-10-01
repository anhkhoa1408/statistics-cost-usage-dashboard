import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import moment from 'moment';
import { forkJoin, take } from 'rxjs';
import { CostService } from '../../../services/cost.service';
import { Cost } from '../../../types/cost.type';

type DereivedCost = Omit<Cost, 'payer' | 'purpose' | 'date'> & {
  payer: string;
  purpose: string;
  date: string;
};

const CHART_OPTIONS = {
  Na: {
    borderColor: 'rgba(255,177,193,1)',
    backgroundColor: 'rgba(255,177,193,0.5)',
  },
  Kem: {
    borderColor: 'rgba(154,208,245,1)',
    backgroundColor: 'rgba(154,208,245,0.5)',
  },
  Khoa: {
    borderColor: 'rgba(255,207,159,1)',
    backgroundColor: 'rgba(255,207,159,0.5)',
  },
};

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit {
  curMonthcosts: {
    [k: string]: number;
  } = {};
  lastMonthCost: {
    [k: string]: number;
  } = {};
  curWeekCost: {
    [k: string]: number[];
  } = {};

  constructor(private readonly costService: CostService) {}

  mapCost = (costs: Cost[]) => {
    return costs.map((cost) => {
      return {
        ...cost,
        payer: (cost?.payer as any)?.name || 'Budget paid',
        purpose: (cost?.purpose as any)?.name || '',
        date: cost.shortDate,
      };
    });
  };

  groupCostByPurposeObj = (mappedCosts: ReturnType<typeof this.mapCost>) => {
    return mappedCosts.reduce(
      (
        total: {
          [k: string]: Array<DereivedCost>;
        },
        item: DereivedCost
      ) => {
        total[item.purpose] = total[item.purpose] || [];
        total[item.purpose].push(item);
        return total;
      },
      {}
    );
  };

  groupCostByDateObj = (mappedCosts: ReturnType<typeof this.mapCost>) => {
    return mappedCosts.reduce(
      (
        total: {
          [k: string]: Array<DereivedCost>;
        },
        item: DereivedCost
      ) => {
        total[item.shortDate] = total[item.purpose] || [];
        total[item.purpose].push(item);
        return total;
      },
      {}
    );
  };

  convertPurposeToAmoutObj = (
    groupByPurposeObj: ReturnType<typeof this.groupCostByPurposeObj>
  ) => {
    return Object.keys(groupByPurposeObj).reduce(
      (total: { [k: string]: number }, item: string) => {
        const data = {
          [item]: groupByPurposeObj[item].reduce(
            (acc: number, ele: DereivedCost) => {
              return acc + ele.amount;
            },
            0
          ),
        };

        return {
          ...data,
          ...total,
        };
      },
      {}
    );
  };

  convertDateToAmoutObj = (
    groupByPurposeObj: ReturnType<typeof this.groupCostByPurposeObj>
  ) => {
    return Object.keys(groupByPurposeObj).reduce(
      (
        total: {
          [k: string]: {
            [k: string]: number;
          };
        },
        item: string
      ) => {
        const data = {
          [item]: groupByPurposeObj[item].reduce(
            (
              acc: {
                [k: string]: number;
              },
              ele: DereivedCost
            ) => {
              acc[ele.date] = acc?.[ele?.date] || 0;
              acc[ele.date] += ele.amount;
              return acc;
            },
            {}
          ),
        };

        return {
          ...data,
          ...total,
        };
      },
      {}
    );
  };

  generateWeekLabelsFromStartOfWeek(): string[] {
    const labels: string[] = [];
    const startOfWeek = moment().startOf('week');
    for (let i = 0; i < 7; i++) {
      labels.push(startOfWeek.clone().add(i, 'days').format('DD/MM'));
    }

    return labels;
  }

  ngOnInit(): void {
    forkJoin([
      this.costService.getCostsInMonth(moment().get('month')).pipe(take(1)),
      this.costService.getCostsInMonth(moment().get('month') - 1).pipe(take(1)),
      this.costService.getCostInCurWeek().pipe(take(1)),
    ]).subscribe(([curMonthcosts, lastMonthCost, curWeekCost]) => {
      const purposes = ['Na', 'Kem', 'Khoa'];

      const mappedCurMonthCosts = this.mapCost(curMonthcosts);

      const curMonthPayerAmountObj = this.convertPurposeToAmoutObj(
        this.groupCostByPurposeObj(mappedCurMonthCosts)
      );
      this.curMonthcosts = curMonthPayerAmountObj;

      const mappedPrevMonthCosts = this.mapCost(lastMonthCost);
      const prevMonthPayerAmountObj = this.convertPurposeToAmoutObj(
        this.groupCostByPurposeObj(mappedPrevMonthCosts)
      );
      this.lastMonthCost = prevMonthPayerAmountObj;

      // init doughnut data
      this.doughnutChartDatasets = purposes.map((key) => {
        return {
          data: [curMonthPayerAmountObj?.[key] || 0],
          label: key,
          backgroundColor: CHART_OPTIONS.hasOwnProperty(key)
            ? CHART_OPTIONS[key as keyof typeof CHART_OPTIONS].backgroundColor
            : '#F8F9FB',
        };
      });

      // init bar data
      const now = moment();
      this.barChartData = {
        labels: [now.clone().get('month'), now.clone().get('month') + 1].map(
          (month) => `${month}/${now.clone().get('year')}`
        ),
        datasets: purposes.map((key) => {
          const prevVal = prevMonthPayerAmountObj.hasOwnProperty(key)
            ? prevMonthPayerAmountObj[key]
            : 0;
          const curVal = curMonthPayerAmountObj.hasOwnProperty(key)
            ? curMonthPayerAmountObj[key]
            : 0;

          return {
            data: [prevVal, curVal],
            label: key,
            backgroundColor: CHART_OPTIONS.hasOwnProperty(key)
              ? CHART_OPTIONS[key as keyof typeof CHART_OPTIONS].backgroundColor
              : '#F8F9FB',
          };
        }),
      };

      const dateToAmountObj = this.convertDateToAmoutObj(
        this.groupCostByPurposeObj(mappedCurMonthCosts)
      );

      const weekLabels = this.generateWeekLabelsFromStartOfWeek();
      this.lineChartData = {
        labels: weekLabels,
        datasets: purposes?.map((key) => {
          return {
            data: dateToAmountObj.hasOwnProperty(key)
              ? weekLabels.map((day) => {
                  return dateToAmountObj?.[key]?.[day] || 0;
                })
              : [],
            label: key,
            fill: true,
            tension: 0.5,
            borderColor: CHART_OPTIONS.hasOwnProperty(key)
              ? CHART_OPTIONS[key as keyof typeof CHART_OPTIONS].borderColor
              : '#F8F9FB',
            backgroundColor: CHART_OPTIONS.hasOwnProperty(key)
              ? CHART_OPTIONS[key as keyof typeof CHART_OPTIONS].backgroundColor
              : '#F8F9FB',
          };
        }),
      };
    });
  }

  // doughnut chart
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
  };
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
    [];

  // bar chart
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  // line chart
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };
  public lineChartLegend = true;
}
