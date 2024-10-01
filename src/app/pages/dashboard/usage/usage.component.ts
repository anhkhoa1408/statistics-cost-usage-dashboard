import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {
  CellTemplateProp,
  HyperFunc,
  RevoGrid,
  Template,
  VNode,
} from '@revolist/angular-datagrid';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { CostService } from './../../../services/cost.service';
import { Cost } from './../../../types/cost.type';
import moment from 'moment';
import { TrashedButtonComponent } from './trashed-button/trashed-button.component';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrl: './usage.component.scss',
})
export class UsageComponent {
  @ViewChild('sidenav') sidenavRef!: MatSidenav;
  @ViewChild('costGrid') costGridRef!: RevoGrid;

  costs: Cost[] = [];

  columns = [
    {
      prop: 'index',
      name: '#',
      size: 100,
    },
    {
      prop: 'date',
      name: 'Date',
      size: 280,
    },
    {
      prop: 'amount',
      name: 'Amount',
      size: 230,
      cellTemplate: (h: HyperFunc<VNode>, props: CellTemplateProp) => {
        return currencyFormatter.format((props.model as any)?.amount) || '0 đ';
      },
    },
    {
      prop: 'purpose',
      name: 'Purpose',
      size: 200,
      cellTemplate: (h: HyperFunc<VNode>, props: CellTemplateProp) => {
        return (props.model as any)?.purpose?.name || 'Unknown';
      },
    },
    {
      prop: 'type',
      name: 'Type',
      size: 170,
    },
    {
      prop: 'payer',
      name: 'Payer',
      size: 200,
      cellTemplate: (h: HyperFunc<VNode>, props: CellTemplateProp) => {
        return (props.model as any)?.payer?.name || 'Budget paid';
      },
    },
    {
      prop: '',
      name: 'Action',
      cellTemplate: Template(TrashedButtonComponent),
    },
  ];

  constructor(private costService: CostService) {
    this.costService
      .getCostsInMonth(moment().get('month'))
      .subscribe((costs) => {
        this.costs = costs;
      });
  }

  toggleSidenav = () => {
    this.sidenavRef.toggle();
  };

  exportToExcel() {
    const mappedCosts = this.costs.map((cost) => ({
      ...cost,
      payer: (cost?.payer as any)?.name || 'Budget paid',
      purpose: (cost?.purpose as any)?.name || '',
    }));

    const headers = this.columns.map((col: any) => col.name);
    const data = mappedCosts.map((row: any) =>
      headers.map((header: string) =>
        header === '#' ? row['id'] : row[header.toLowerCase()]
      )
    );

    const groupByNameObj = mappedCosts.reduce(
      (
        total: {
          [k: string]: Array<
            Omit<Cost, 'payer' | 'purpose'> & {
              payer: string;
              purpose: string;
            }
          >;
        },
        item: Omit<Cost, 'payer' | 'purpose'> & {
          payer: string;
          purpose: string;
        }
      ) => {
        total[item.payer] = total[item.payer] || [];
        total[item.payer].push(item);
        return total;
      },
      {}
    );

    const payerAmoutObj = Object.keys(groupByNameObj).reduce(
      (total: { [k: string]: number }, item: string) => {
        const data = {
          [item]: groupByNameObj[item].reduce(
            (
              acc: number,
              ele: Omit<Cost, 'payer' | 'purpose'> & {
                payer: string;
                purpose: string;
              }
            ) => {
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

    const allCostSum = Object.values(payerAmoutObj).reduce(
      (sum: number, cost: number) => {
        return sum + cost;
      },
      0
    );

    const worksheetData = [
      headers,
      ...data,
      [''],
      [''],
      ['Payer', 'Total'],
      ...Object.entries(payerAmoutObj),
      [''],
      [''],
      ['All', allCostSum],
    ];

    const columnWidth = headers.map((head) => ({
      wpx: head === '#' ? 80 : 120,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
    ws['!cols'] = columnWidth;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Cost data');

    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Cost per month.xlsx');
  }
}
