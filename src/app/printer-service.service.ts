import { Injectable } from '@angular/core';
import axios from 'axios';

interface Device {
  name: string;
  deviceType: string;
  connection: string;
  uid: string;
  provider: string;
  manufacturer: string;
  version: number;
}

@Injectable({
  providedIn: 'root',
})
export class PrinterService {
  API_URL = 'http://localhost:9100/';
  device: Device = {} as Device;

  constructor() {}

  getAvailablePrinters = async () => {
    const config = {
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      },
    };

    const endpoint = this.API_URL + 'available';

    try {
      const { data } = await axios.get(endpoint, config);

      if (
        data &&
        data !== undefined &&
        data.printer &&
        data.printer !== undefined &&
        data.printer.length > 0
      ) {
        return data.printer;
      }

      return new Error('No printers available');
    } catch (error) {
      throw new Error(error as any);
    }
  };

  getDefaultPrinter = async (): Promise<Device> => {
    const config = {
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      },
    };

    const endpoint = this.API_URL + 'default';

    try {
      const res = await axios.get(endpoint, config);
      const data = res.data();

      if (
        data &&
        data !== undefined &&
        typeof data !== 'object' &&
        data.split('\n\t').length === 7
      ) {
        const deviceRaw = data.split('\n\t');

        const name = this.cleanUpString(deviceRaw[1]);
        const deviceType = this.cleanUpString(deviceRaw[2]);
        const connection = this.cleanUpString(deviceRaw[3]);
        const uid = this.cleanUpString(deviceRaw[4]);
        const provider = this.cleanUpString(deviceRaw[5]);
        const manufacturer = this.cleanUpString(deviceRaw[6]);

        const device = {
          connection,
          deviceType,
          manufacturer,
          name,
          provider,
          uid,
          version: 5,
        };

        this.device = device;
        return device;
      }

      throw new Error("There's no default printer");
    } catch (error) {
      throw new Error(error as any);
    }
  };

  setPrinter = (device: Device) => {
    this.device = device;
  };

  getPrinter = (): Device => {
    return this.device;
  };

  cleanUpString = (str: string): string => {
    const arr = str.split(':');
    const result = arr[1].trim();
    return result;
  };

  checkPrinterStatus = async () => {
    await this.write('~HQES');
    const result = await this.read();

    const errors = [];
    let isReadyToPrint = false;

    const isError = result.charAt(70);
    const media = result.charAt(88);
    const head = result.charAt(87);
    const pause = result.charAt(84);

    isReadyToPrint = isError === '0';

    switch (media) {
      case '1':
        errors.push('Paper out');
        break;
      case '2':
        errors.push('Ribbon Out');
        break;
      case '4':
        errors.push('Media Door Open');
        break;
      case '8':
        errors.push('Cutter Fault');
        break;
      default:
        break;
    }

    switch (head) {
      case '1':
        errors.push('Printhead Overheating');
        break;
      case '2':
        errors.push('Motor Overheating');
        break;
      case '4':
        errors.push('Printhead Fault');
        break;
      case '8':
        errors.push('Incorrect Printhead');
        break;
      default:
        break;
    }

    if (pause === '1') errors.push('Printer Paused');

    if (!isReadyToPrint && errors.length === 0)
      errors.push('Error: Unknown Error');

    return {
      isReadyToPrint,
      errors: errors.join(),
    };
  };

  write = async (data: string) => {
    try {
      const endpoint = this.API_URL + 'write';

      const myData = {
        device: this.device,
        data,
      };

      const config = {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
          'Accept': '/'
        },
        body: JSON.stringify(myData),
      };

      await axios.post(endpoint, config);
    } catch (error) {
      throw new Error(error as any);
    }
  };

  read = async () => {
    try {
      const endpoint = this.API_URL + 'read';

      const myData = {
        device: this.device,
      };

      const config = {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
        },
        body: JSON.stringify(myData),
      };

      const { data } = await axios.post(endpoint, config);

      return data;
    } catch (error) {
      throw new Error(error as any);
    }
  };

  print = async (text: string) => {
    try {
      await this.write(text);
    } catch (error) {
      throw new Error(error as any);
    }
  };
}
