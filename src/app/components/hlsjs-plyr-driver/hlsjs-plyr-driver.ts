import Hls from 'hls.js';
import { PlyrDriver, PlyrDriverCreateParams, PlyrDriverDestroyParams, PlyrDriverUpdateSourceParams } from 'ngx-plyr';
import * as Plyr from 'plyr';

export class HlsjsPlyrDriver implements PlyrDriver {

  hls = new Hls();

  private loaded = false;

  constructor(private autoload: boolean) { }

  create(params: PlyrDriverCreateParams) {
    this.hls.attachMedia(params.videoElement);
    // @ts-ignore
    window['hls'] = this.hls;
    return new Plyr(params.videoElement, params.options);
  }

  updateSource(params: PlyrDriverUpdateSourceParams) {
    console.log(params);
    if (this.autoload && params.source.sources.length > 0) {
      this.load(params.source.sources[0].src);
    } else {
      // poster does not work with autoload
      if (params.source.poster != null) {
        params.videoElement.poster = params.source.poster;
      }
    }
  }

  destroy(params: PlyrDriverDestroyParams) {
    params.plyr.destroy();
    this.hls.detachMedia();
    this.hls.destroy();
  }

  load(src: string) {
    if (!this.loaded) {
      this.loaded = true;
      this.hls.loadSource(src);
      console.log(window);
    }
  }

}
