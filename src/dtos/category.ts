export class CategoryDTO {
  id: string;
  title: string;
  color: string;
  icon: string;
  textColor: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.color = data.color;
    this.icon = data.icon;
    this.textColor = data.textColor;
  }
}
