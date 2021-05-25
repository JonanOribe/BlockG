import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import jsQR from 'jsqr';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;
 
  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
  loading: HTMLIonLoadingElement = null;
  url: any="http://localhost:3000/requestTicket";

  headers = new HttpHeaders({
    'Content-Type': 'application/json'});
  options = { headers: this.headers };

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private plt: Platform,
    private http: HttpClient,
    public toastController: ToastController
  ) {
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }
  }
 
  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
  }
 
  async presentToast(response) {
    let toast;
    if(response=="GREEN"){
    toast = await this.toastController.create({
      message: 'Registro completado con ÉXITO',
      duration: 2000,
      color:"success"
    });
    }else if(response=="RED"){
    toast = await this.toastController.create({
      message: 'AVISO!! Ya estas registrado al evento',
      duration: 2000,
      color:"warning"
    });
    }else{
    toast = await this.toastController.create({
      message: 'ERROR!! Fallo en el servicio',
      duration: 2000,
      color:"danger"
    });
    }
    toast.present();
  }

  reset() {
    this.scanResult = null;
  }
 
  stopScan() {
    this.scanActive = false;
  }

  async startScan() {
    // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
   
    this.videoElement.srcObject = stream;
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);
   
    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();
   
    this.videoElement.play();
    requestAnimationFrame(this.scan.bind(this));
  }
   
  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }
   
      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;
   
      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
   
      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  captureImage() {
    this.fileinput.nativeElement.click();
  }
   
  handleFile(files: FileList) {
    const file = files.item(0);
   
    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
   
      if (code) {
        this.scanResult = code.data;
      }
    };
    img.src = URL.createObjectURL(file);
  }

  sendCode(){
  this.scanResult=JSON.parse(this.scanResult);
  this.scanResult.myMail="ECarbajo@gmail.com";
  this.scanResult.myAddress="0x525252E697cbe424c2CF6B2252d09e512ebe6e82";
  this.scanResult=JSON.stringify(this.scanResult);
  console.log(this.url, this.scanResult);
  let response=this.http.post(this.url, this.scanResult, this.options).subscribe();
  this.presentToast(response);
  }
}
