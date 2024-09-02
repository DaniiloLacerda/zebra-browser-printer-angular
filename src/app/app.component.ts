import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'zebraBrower';
  ZebraBrowserPrintWrapper = ZebraBrowserPrintWrapper;
  printBarcode = async (zpl: string) => {
    try {
      // Create a new instance of the object
      const browserPrint = new ZebraBrowserPrintWrapper();

      // Select default printer
      const defaultPrinter = await browserPrint.getDefaultPrinter();
      console.log('default printer', defaultPrinter);
      // Set the printer
      browserPrint.setPrinter(defaultPrinter);

      // Check printer status
      const printerStatus = await browserPrint.checkPrinterStatus();

      // Check if the printer is ready
      if (printerStatus.isReadyToPrint) {
        console.log('printerStatus', printerStatus);
        // ZPL script to print a simple barcode
        browserPrint.print(zpl);
      } else {
        console.log('Error/s', printerStatus.errors);
      }
    } catch (error) {
      throw new Error(error as any);
    }
  };
}
