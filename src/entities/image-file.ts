export class ImageFile {
  path: string
  width?: number
  height?: number

  constructor(data: ImageFile) {
    this.path = data.path
    this.width = data.width
    this.height = data.height
  }
}