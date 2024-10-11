export class CategoryDTO {
  id: string;
  title: string;
  color: string;
  icon: string;

  constructor(data:any) {
    this.id = data.id;
    this.title = data.title;
    this.color = data.color;
    this.icon = data.icon;
  }
}
