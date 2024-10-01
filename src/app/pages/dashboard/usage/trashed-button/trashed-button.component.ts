import { Component, Input } from '@angular/core';
import { ColumnDataSchemaModel } from '@revolist/revogrid';
import { CostService } from '../../../../services/cost.service';

@Component({
  selector: 'app-trashed-button',
  templateUrl: './trashed-button.component.html',
  styles: ``,
})
export class TrashedButtonComponent {
  @Input() props!: ColumnDataSchemaModel;

  get value() {
    return this.props.rowIndex;
  }

  constructor(private readonly costService: CostService) {}

  onDelete = async () => {
    const id = (this.props.model as any)?.id;
    if (!id) return;
    await this.costService.deleteCost({ id });
  };
}
