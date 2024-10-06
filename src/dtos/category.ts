export class CategoryDTO {
  id: string;
  title: string;

  constructor(data:any) {
    this.id = data.id;
    this.title = data.title;
  }
}