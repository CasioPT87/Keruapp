
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
  withCredentials: true
}

@Injectable()
export class ImageService {

  constructor(
    private http: HttpClient
  ) { }

  // getImage(imageURL): Observable<any> {
  //   var response =  this.http.get(imageURL, httpOptions)
  //     .subscribe((blob) => {
  //       console.log(blob)
  //     });
  // }

  fixImageRotationInput(reader, fileData): any {

    return new Promise((resolve, reject) => {
      reader.readAsArrayBuffer(fileData.target.files[0].slice(0, 64 * 1024));
      reader.onload = (event: any) => {
        var arrayBufferImage = event.target.result;  
        var orientation = this.getOrientation(arrayBufferImage);
        resolve(orientation);
      }
    })
      .then((orientation) => {
        var orientation = orientation;
        return new Promise((resolve, reject) => {
          var reader2 = new FileReader();
          reader2.onload = (event: any) => {
            var originalImage = event.target.result;              
            resolve( this.resetOrientation(originalImage, orientation) );  
          }
          reader2.readAsDataURL(fileData.target.files[0]);
        })  
      })
      .then((resetBase64Image) => {
        return resetBase64Image;
      })   
  }

  fixImageRotationURL(imageURL): any {

    //return new Promise((resolve, reject) => {
      var image = new Image();
      image.setAttribute('crossOrigin', 'anonymous');
      console.log(imageURL)
      image.src = imageURL;
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      image.onload = () => {
        context.drawImage(image, 0, 0);
        Promise.resolve(canvas.toDataURL())
          .then((response) => {
            console.log(response)        
            return new Promise((resolve, reject) => { 
                resolve( this.getOrientation(response) );
            })
          })
          .then((orientation) => {
            //return new Promise((resolve, reject) => {
              var originalImage = imageURL;              
              return this.resetOrientation(originalImage, orientation);  
            //})  
          })
          .then((resetBase64Image) => {
            return resetBase64Image;
          })
      }
    //})
          
  }
  
  getOrientation(arrayBufferImage): any {
  
    return new Promise((resolve, reject) => {
      var view = new DataView(arrayBufferImage);
      if (view.getUint16(0, false) != 0xFFD8){
        resolve( -2 );
      } 
      var length = view.byteLength,
          offset = 2;
  
      while (offset < length) {
        var marker = view.getUint16(offset, false);
        offset += 2;
  
        if (marker == 0xFFE1) {
          if (view.getUint32(offset += 2, false) != 0x45786966) {
            resolve( -1 );
          }
          var little = view.getUint16(offset += 6, false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          var tags = view.getUint16(offset, little);
          offset += 2;
  
          for (var i = 0; i < tags; i++)
            if (view.getUint16(offset + (i * 12), little) == 0x0112){
              resolve( view.getUint16(offset + (i * 12) + 8, little) );
            }           
        }
        else if ((marker & 0xFF00) != 0xFF00) {
          break;
        }
        else {
          offset += view.getUint16(offset, false);
        }
      }
      resolve( -1 );
    })
  };
  
  resetOrientation(srcBase64, srcOrientation): any {
    return new Promise((resolve, reject) => {
      var img = new Image();	
      img.onload = () => {
        var width = img.width,
            height = img.height,
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d");        
        // set proper canvas dimensions before transform & export
        if (4 < srcOrientation && srcOrientation < 9) {
          canvas.width = height;
          canvas.height = width;
        } else {
          canvas.width = width;
          canvas.height = height;
        }
        // transform context before drawing image
        switch (srcOrientation) {
          case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
          case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
          case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
          case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
          case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
          case 7: ctx.transform(0, -1, -1, 0, height , width); break;
          case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
          default: break;
        }
        // draw image
        ctx.drawImage(img, 0, 0);
        // export base64
        resolve( canvas.toDataURL() );
      };  
      img.src = srcBase64;   
    }) 
  }
}

