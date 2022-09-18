import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mobilenet from '@tensorflow-models/mobilenet';

export interface IPrediction {
  className: string;
  probability: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  imageSrc!: string;
  @ViewChild('img') imageEl!: ElementRef;

  predictions!: IPrediction[];
  
  model!: any;
  loading!: boolean;

  imgSrc!: any;


  async ngOnInit() {
    this.loading = true;
    this.model = await mobilenet.load();
    this.loading = false;
  }

  async fileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (res: any) => {
        this.imgSrc = res.target.result;

        setTimeout(async () => {
          this.predictions = await this.model.classify(this.imageEl.nativeElement);
        })
      }
    }
  }

  async fileChangeEvent(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (res:any) => {
        this.imageSrc = res.target.results;

        setTimeout(async () => {
          const imgEl = res.target.result;
          this.predictions = await this.model.classify(imgEl);
        }, 0);
      }
    }
  }
}
