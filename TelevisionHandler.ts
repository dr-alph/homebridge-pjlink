import type {
  Logger,
  API,
  CharacteristicValue,
  PlatformAccessory,
  Service,
} from 'homebridge';
import {CharacteristicEventTypes} from 'homebridge';
// import {PJLink} from 'PJLink';
const PJLink = require('pjlink');

export class TelevisionHandler {
  private readonly tvService: Service;
  private readonly switchService?: Service;

  private deviceActive = false;

  constructor(
    private readonly log: Logger,
    private readonly api: API,
    private readonly accessory: PlatformAccessory,
    private readonly device: PJLink,
    private readonly name: string,
    private readonly enableSwitch = false
  ) {
    this.tvService = this.createService();
    if (this.enableSwitch) {
      this.switchService = this.createSwitchService();
    }
  }

  private createService(): Service {
    // hap
    const Characteristic = this.api.hap.Characteristic;
    const Service = this.api.hap.Service;

    // service
    const tvService =
      this.accessory.getService(Service.Television) ||
      this.accessory.addService(Service.Television, this.name);

    tvService
      .setCharacteristic(Characteristic.ConfiguredName, this.name)
      .setCharacteristic(
        Characteristic.SleepDiscoveryMode,
        Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE
      );
    tvService
      .getCharacteristic(Characteristic.Active)
      .onGet(this.getTelevisionActive.bind(this))
      .onSet(this.setTelevisionActive.bind(this));
    tvService
      .getCharacteristic(this.api.hap.Characteristic.RemoteKey)
      .onSet(this.setRemoteKey.bind(this));

    return tvService;
  }

  private createSwitchService(): Service {
    // hap
    const Service = this.api.hap.Service;
    const Characteristic = this.api.hap.Characteristic;

    // service
    const service =
      this.accessory.getService(Service.Switch) ||
      this.accessory.addService(Service.Switch, this.name);
    service
      .getCharacteristic(Characteristic.On)
      .onGet(this.getTelevisionActive.bind(this))
      .onSet(this.setTelevisionActive.bind(this));

    return service;
  }

  public getService(): Service {
    return this.tvService;
  }

  public getSwitchService(): Service | undefined {
    return this.switchService;
  }

  /**
   * Get television active
   */
  private async getTelevisionActive(): Promise<CharacteristicValue> {
    return new Promise((resolve, reject) => {
      try {
        this.device.getPowerState((error: string | undefined, state) => {
          if (error) {
<<<<<<< HEAD
            this.log.error(error);
            reject(new Error(error));
=======
            // Silently ignore "Unavailable time" errors when device is off
            if (error.includes('Unavailable time')) {
              resolve(this.deviceActive);
            } else {
              this.log.error(error);
              reject(new Error(error));
            }
>>>>>>> origin/main
          } else {
            this.deviceActive = state === PJLink.POWER.ON;
            this.log.info('television active', this.deviceActive);
            resolve(this.deviceActive);
          }
        });
      } catch (e) {
        if (e instanceof Error) {
          this.log.error(e.message);
          reject(e);
        }
      }
    });
  }

  /**
   * Set television active
   * @param {boolean} value
   */
  private async setTelevisionActive(
    value: CharacteristicValue
  ): Promise<void> {
    // hap
    const Characteristic = this.api.hap.Characteristic;

    return new Promise((resolve, reject) => {
      try {
        const powerState =
          value === 1 || value === true ? PJLink.POWER.ON : PJLink.POWER.OFF;
        this.device.setPowerState(powerState, (error?: string) => {
          this.log.info('setPowerState', value, powerState, error);
          if (error) {
<<<<<<< HEAD
            reject(new Error(error));
=======
            // Silently ignore "Unavailable time" errors when device is off
            if (error.includes('Unavailable time')) {
              resolve();
            } else {
              reject(new Error(error));
            }
>>>>>>> origin/main
          } else {
            this.deviceActive = powerState === PJLink.POWER.ON;
            this.tvService.updateCharacteristic(
              Characteristic.Active,
              this.deviceActive
            );

            if (this.switchService) {
              this.switchService.updateCharacteristic(
                Characteristic.On,
                this.deviceActive
              );
            }
            resolve();
          }
        });
      } catch (e) {
        if (e instanceof Error) {
          this.log.error(e.message);
          reject(e);
        }
      }
    });
  }

  private async setRemoteKey(
    value: CharacteristicValue
  ): Promise<void> {
    this.log.info('setRemoteKey', value);
  }

  public update(): void {
    try {
      this.device.getPowerState((error: string | undefined, state) => {
        if (error) {
          // Silently ignore "Unavailable time" errors when device is off
          if (!error.includes('Unavailable time')) {
            this.log.error(error);
          }
        } else {
          const active = state === PJLink.POWER.ON;
          if (active !== this.deviceActive) {
            this.deviceActive = active;

            // hap
            const Characteristic = this.api.hap.Characteristic;

            this.tvService.updateCharacteristic(
              Characteristic.Active,
              this.deviceActive
            );

            if (this.switchService) {
              this.switchService.updateCharacteristic(
                Characteristic.On,
                this.deviceActive
              );
            }
          }
        }
      });
    } catch (e) {
      if (e instanceof Error) this.log.error(e.message);
    }
  }
}
