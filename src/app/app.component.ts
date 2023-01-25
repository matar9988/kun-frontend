import {Component, ViewChild} from '@angular/core';
import {PlyrComponent} from 'ngx-plyr';
import * as Plyr from 'plyr';
import {HttpClient} from "@angular/common/http";
import { HlsjsPlyrDriver } from './components/hlsjs-plyr-driver/hlsjs-plyr-driver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(PlyrComponent) plyr !: PlyrComponent;
  player !: Plyr;
  selectedFile: File | null = null;
  loading: boolean = false;
  constructor(private http: HttpClient) {}

  hlsjsDriver = new HlsjsPlyrDriver(true);

  onFileChanged(event: any) {
    this.selectedFile = event.target?.files[0];
  }
  options: Plyr.Options = {
    captions: { active: true, update: true, language: 'en' },
    quality: {options:[240,480],default:240,forced:true, onChange: (e) => this.updateQuality(e) }
  };
  videoSources: Plyr.Source[] = [];

   updateQuality(newQuality: any) {
    // @ts-ignore
     window.hls.levels.forEach((level, levelIndex) => {
      if (level.height === newQuality) {
        console.log("Found quality match with " + newQuality);
        // @ts-ignore
        window.hls.currentLevel = levelIndex;
      }
    });
  }

  uploadFile() {
    const uploadData = new FormData();
    if (this.selectedFile) {
      this.loading = true;
      uploadData.append('userfile', this.selectedFile, this.selectedFile?.name);
      this.http.post<{[key:string]: string}>('http://localhost/kun/index.php/render', uploadData).subscribe((response: {[key:string]: string} ) => {
        this.videoSources = [{type: 'video', src: `http://localhost/kun/public/${response['data']}`}];
        this.loading = false;
      });
    }
  }

  played(event: Plyr.PlyrEvent) {
    console.log('played', event);
    this.hlsjsDriver.load(this.videoSources[0].src);
  }
}
