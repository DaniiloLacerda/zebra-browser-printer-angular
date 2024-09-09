import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PrinterService } from './printer-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'zebraBrowser';

  constructor(private service: PrinterService) {}

  printBarcode = async (zpl: string, type?: string) => {
    try {
      const defaultPrinter = await this.service.getDefaultPrinter();
      console.log('default printer', defaultPrinter);

      const printerStatus = await this.service.checkPrinterStatus();

      if (!printerStatus.isReadyToPrint) {
        console.log('Error/s', printerStatus.errors);
        return;
      }
      console.log('printerStatus', printerStatus);

      if (type === 'ZPL') {
        const zplCode = `^XA
^FX Top section with logo, name and address.
^CF0,60
^FO50,50^GB100,100,100^FS
^FO75,75^FR^GB100,100,100^FS
^FO93,93^GB40,40,40^FS
^FO220,50^FDIntershipping, Inc.^FS
^CF0,30
^FO220,115^FD1000 Shipping Lane^FS
^FO220,155^FDShelbyville TN 38102^FS
^FO220,195^FDUnited States (USA)^FS
^FO50,250^GB700,3,3^FS
^XZ`;
        await this.service.print(zplCode);
        return;
      }

      if (type === 'EPL') {
        const eplCode = `
N
q609
Q203,26
B26,26,0,UA0,2,2,152,B,"603679025109"
A253,26,0,3,1,1,N,"SKU 6205518 MFG 6354"
A253,56,0,3,1,1,N,"2XIST TROPICAL BEACH"
A253,86,0,3,1,1,N,"STRIPE SQUARE CUT TRUNK"
A253,116,0,3,1,1,N,"BRICK"
A253,146,0,3,1,1,N,"X-LARGE"
P1
`;
        await this.service.print(eplCode);
        return;
      }

      if (type === 'FEEGOW') {
        const feegowCode =
          '\nN\nR30,10\nD10\nA210,0,0,1,1,1,N,"Enzo Guilherme Da Silva Fraga"\nB285,65,0,1,2,1,70,N,"209702680302"\nA210,20,0,1,1,1,N,"209-7026803-02  05/09/24 09:26"\nA210,35,0,1,1,1,N,"CONV: 17447"\nA330,35,0,1,1,1,N,"PED.CONV: FGW82394177D240905"\nA210,50,0,1,1,1,N,"LINHA VERDE"\nA430,50,0,1,1,1,N,"DN 17/01/2011"\nA195,220,3,1,1,1,R,"   NTO"\nA210,143,0,1,1,1,N,"SORO"\nA210,158,0,1,1,1,N,""\nA210,173,0,1,1,1,N,"VOL: 300ul"\nA450,173,0,1,1,1,N,"(CONGELADO)"\nA210,188,0,1,1,1,N,"PTH"\nA210,206,0,1,1,1,N,""\nP1\n\nN\n';
        await this.service.print(feegowCode);
        return;
      }

      if (type === 'PARDINI') {
        const pardiniCode =
          '\nN\nR30,10\nD10\nA210,0,0,1,1,1,N,"Paulo"\nB285,65,0,1,2,1,70,N,"209587699201"\nA210,20,0,1,1,1,N,"209-5876992-01  28/08/24 11:26"\nA210,35,0,1,1,1,N,"CONV: 12000"\nA330,35,0,1,1,1,N,"PED.CONV: f3232c837a42be8"\nA210,50,0,1,1,1,N,"ANATOMIA PATOLOGICA"\nA430,50,0,1,1,1,N,"DN 31/10/95"\nA195,220,3,1,1,1,R,"  NTBH"\nA210,143,0,1,1,1,N,"DIVERSOS EM FORMOLIZADO"\nA210,158,0,1,1,1,N,""\nA210,173,0,1,1,1,N,""\nA450,173,0,1,1,1,N,"(AMBIENTE)"\nA210,188,0,1,1,1,N,"BSM"\nA210,206,0,1,1,1,N,""\nP1\n\nN\n';
        await this.service.print(pardiniCode);
        return;
      }

      await this.service.print(zpl);
    } catch (error) {
      throw new Error(error as any);
    }
  };

  checkStatus = async () => {
    try {
      const printerStatus = await this.service.checkPrinterStatus();

      console.log(printerStatus);
    } catch (error) {
      throw new Error(error as any);
    }
  };

  getDefault = async () => {
    try {
      const defaultPrinter = await this.service.getDefaultPrinter();

      console.log(defaultPrinter);
    } catch (error) {
      throw new Error(error as any);
    }
  };
}
