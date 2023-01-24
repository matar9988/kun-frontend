import {Component, ViewChild} from '@angular/core';
import {PlyrComponent} from 'ngx-plyr';
import * as Plyr from 'plyr';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(PlyrComponent) plyr !: PlyrComponent;
  player !: Plyr;
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target?.files[0];
  }

  videoSources: Plyr.Source[] = [
  ];

  uploadFile() {
    const uploadData = new FormData();
    if (this.selectedFile) {
      uploadData.append('file', this.selectedFile, this.selectedFile?.name);
      this.http.post('YOUR_SERVER_URL', uploadData).subscribe(response => {
        console.log(response);
      });
    }
  }

  played(event: Plyr.PlyrEvent) {
    console.log('played', event);
  }

  play(): void {
    this.player.play(); // or this.plyr.player.play()
  }

}
