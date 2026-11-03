declare module "imagetracerjs" {
  export interface ImageTracerOptions {
    corsenabled?: boolean;
    ltres?: number;
    qtres?: number;
    pathomit?: number;
    rightangleenhance?: boolean;
    colorsampling?: number;
    numberofcolors?: number;
    mincolorratio?: number;
    colorquantcycles?: number;
    layering?: number;
    strokewidth?: number;
    linefilter?: boolean;
    scale?: number;
    roundcoords?: number;
    viewbox?: boolean;
    desc?: boolean;
    lcpr?: number;
    qcpr?: number;
    blurradius?: number;
    blurdelta?: number;
    [key: string]: unknown;
  }

  export interface ImageTracerApi {
    imagedataToSVG(imgd: ImageData, options?: ImageTracerOptions): string;
    imageToSVG(
      url: string,
      callback: (svgstr: string) => void,
      options?: ImageTracerOptions
    ): void;
    imagedataToTracedata(imgd: ImageData, options?: ImageTracerOptions): unknown;
    [key: string]: unknown;
  }

  const ImageTracer: ImageTracerApi;
  export default ImageTracer;
}
